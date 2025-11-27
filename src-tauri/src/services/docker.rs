use bollard::query_parameters::EventsOptions;
use bollard::Docker;
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager, State};

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DockerVariant {
    Native,  // Docker padrão (/var/run/docker.sock)
    Podman,  // Podman rootless
    Desktop, // Docker Desktop (VM)
    Remote,  // TCP ou SSH
}

// 1. O Estado que guarda a configuração
pub struct DockerConfig {
    pub uri: Mutex<String>,
    pub variant: Mutex<DockerVariant>, // <--- Armazena o tipo
}

impl DockerConfig {
    pub fn new() -> Self {
        Self {
            uri: Mutex::new("unix:///var/run/docker.sock".to_string()),
            variant: Mutex::new(DockerVariant::Native), // Padrão é Native
        }
    }

    // Setter inteligente: Atualiza URI e Variante ao mesmo tempo
    pub fn set_config(&self, new_uri: String, new_variant: DockerVariant) {
        let mut uri = self.uri.lock().unwrap();
        let mut variant = self.variant.lock().unwrap();
        *uri = new_uri;
        *variant = new_variant;
    }

    pub fn get_uri(&self) -> String {
        self.uri.lock().unwrap().clone()
    }

    pub fn get_variant(&self) -> DockerVariant {
        *self.variant.lock().unwrap()
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
