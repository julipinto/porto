use bollard::query_parameters::EventsOptions;
use bollard::Docker;
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

// 1. O Estado que guarda a configuração
pub struct DockerConfig {
    // Ex: "unix:///var/run/docker.sock" ou "tcp://192.168.1.5:2375"
    pub uri: Mutex<String>,
}

impl DockerConfig {
    pub fn new() -> Self {
        Self {
            // Valor padrão inicial (Tenta o socket padrão do Linux)
            uri: Mutex::new("unix:///var/run/docker.sock".to_string()),
        }
    }

    pub fn set_uri(&self, new_uri: String) {
        let mut uri = self.uri.lock().unwrap();
        *uri = new_uri;
    }

    pub fn get_uri(&self) -> String {
        self.uri.lock().unwrap().clone()
    }
}

// 2. A função de conexão (Exige o Estado)
pub fn connect(state: &State<'_, DockerConfig>) -> Result<Docker, String> {
    let uri = state.get_uri();

    // Tenta conectar usando o URI configurado
    Docker::connect_with_socket(&uri, 120, bollard::API_DEFAULT_VERSION)
        .map_err(|e| format!("Falha ao conectar em {}: {}", uri, e))
}

// 3. Monitor de Eventos (Restaurado e Adaptado)
pub fn spawn_event_monitor(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        // ADAPTAÇÃO: Precisamos pegar o estado de dentro do AppHandle
        // para poder chamar a função connect() nova.
        let state = app.state::<DockerConfig>();

        let docker = match connect(&state) {
            Ok(d) => d,
            Err(e) => {
                eprintln!("Monitor de Eventos falhou ao iniciar: {}", e);
                return;
            }
        };

        let mut filters = HashMap::new();
        filters.insert("type".to_string(), vec!["container".to_string()]);
        filters.insert(
            "event".to_string(),
            vec![
                "start".to_string(),
                "stop".to_string(),
                "die".to_string(),
                "destroy".to_string(),
                "create".to_string(),
                "rename".to_string(),
            ],
        );

        let options = EventsOptions {
            since: None,
            until: None,
            filters: Some(filters),
        };

        let mut event_stream = docker.events(Some(options));

        while let Some(msg) = event_stream.next().await {
            if let Ok(_event) = msg {
                // println!("Rust -> Evento Docker: {:?}", event.action);
                let _ = app.emit("docker-event", ());
            }
        }
    });
}
