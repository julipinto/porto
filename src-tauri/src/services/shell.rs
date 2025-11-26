use crate::services::docker::{self, DockerConfig};
use bollard::exec::{CreateExecOptions, StartExecResults};
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use tokio::io::AsyncWriteExt; // <--- Importante para o write_all e flush
use tokio::sync::Mutex;

// Guardamos o "Writer" (Stdin) de cada container
type ShellMap = Arc<Mutex<HashMap<String, std::pin::Pin<Box<dyn tokio::io::AsyncWrite + Send>>>>>;

pub struct ShellManager {
    sessions: ShellMap,
}

impl ShellManager {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn open_session(
        &self,
        app: AppHandle,
        state: State<'_, DockerConfig>,
        container_id: String,
    ) -> Result<(), String> {
        let docker = docker::connect(&state).map_err(|e| e.to_string())?;

        // 1. Cria a configuração de execução
        let config = CreateExecOptions {
            attach_stdout: Some(true),
            attach_stderr: Some(true),
            attach_stdin: Some(true),
            tty: Some(true),
            cmd: Some(vec!["/bin/sh"]),
            ..Default::default()
        };

        // CORREÇÃO: Removemos <String>
        let exec = docker
            .create_exec(&container_id, config)
            .await
            .map_err(|e| e.to_string())?;

        // 2. Inicia a execução
        let start_result = docker
            .start_exec(&exec.id, None)
            .await
            .map_err(|e| e.to_string())?;

        match start_result {
            StartExecResults::Attached { mut output, input } => {
                // Guardamos o INPUT (Stdin) no mapa
                let mut sessions = self.sessions.lock().await;
                sessions.insert(container_id.clone(), Box::pin(input));

                // 3. Thread de Leitura (Output -> Frontend)
                let event_name = format!("terminal-output://{}", container_id);

                tauri::async_runtime::spawn(async move {
                    while let Some(msg) = output.next().await {
                        if let Ok(log_output) = msg {
                            // Manda o texto cru para o xterm.js tratar
                            let _ = app.emit(&event_name, log_output.to_string());
                        }
                    }
                });
            }
            _ => return Err("Falha ao anexar TTY".to_string()),
        }

        Ok(())
    }

    pub async fn write_to_session(&self, container_id: String, data: String) {
        let mut sessions = self.sessions.lock().await;
        if let Some(stdin) = sessions.get_mut(&container_id) {
            // Escreve os bytes no terminal do container
            // Agora o AsyncWriteExt está no escopo, então funciona!
            let _ = stdin.write_all(data.as_bytes()).await;
            let _ = stdin.flush().await;
        }
    }

    #[allow(dead_code)] // O linter pode reclamar que não usamos ainda
    pub async fn close_session(&self, container_id: String) {
        let mut sessions = self.sessions.lock().await;
        sessions.remove(&container_id);
    }
}
