pub mod impls;
pub mod manager;
pub mod sys;

use async_trait::async_trait;
use bollard::Docker;
use std::sync::Mutex;
use tauri::State;

// --- ESTRUTURAS DE CONFIGURAÇÃO ---

#[derive(Clone, serde::Serialize, Copy, PartialEq, Debug)]
pub enum DockerVariant {
  Native,
  Desktop,
  Podman,
  Remote,
}

// Envolvemos os dados num Mutex para permitir alteração em tempo de execução
pub struct DockerConfig {
  inner: Mutex<ConfigData>,
}

struct ConfigData {
  variant: DockerVariant,
  uri: String,
}

impl DockerConfig {
  // O método 'new' que o lib.rs está procurando
  pub fn new() -> Self {
    Self {
      inner: Mutex::new(ConfigData {
        // Defina aqui seu padrão inicial (ex: Desktop ou Native)
        variant: DockerVariant::Desktop,
        uri: "unix:///var/run/docker.sock".to_string(), // Ou npipe para windows
      }),
    }
  }

  pub fn get_variant(&self) -> DockerVariant {
    self.inner.lock().unwrap().variant
  }

  pub fn get_uri(&self) -> String {
    self.inner.lock().unwrap().uri.clone()
  }

  // O método 'set_config' que o contexts.rs está procurando
  pub fn set_config(&self, uri: String, variant: DockerVariant) {
    let mut data = self.inner.lock().unwrap();
    data.uri = uri;
    data.variant = variant;
  }
}

// --- TRAIT E FACTORY (Mantidos da refatoração) ---

#[async_trait]
pub trait DockerLifecycle: Send + Sync {
  async fn is_active(&self) -> bool;
  async fn start(&self) -> Result<String, String>;
  async fn stop(&self) -> Result<String, String>;
}

pub fn get_manager(variant: DockerVariant) -> Box<dyn DockerLifecycle> {
  match variant {
    DockerVariant::Desktop => Box::new(impls::desktop::DesktopManager),
    DockerVariant::Native => Box::new(impls::native::NativeManager),
    DockerVariant::Podman => Box::new(impls::podman::PodmanManager),
    DockerVariant::Remote => Box::new(impls::remote::RemoteDummy),
  }
}

// --- HELPERS DE CONEXÃO ---

pub fn connect(state: &State<DockerConfig>) -> Result<Docker, String> {
  let uri = state.get_uri();

  // Conexão via Socket/Pipe Local
  if uri == "unix:///var/run/docker.sock" || uri == "npipe:////./pipe/docker_engine" {
    return Docker::connect_with_local_defaults()
      .map_err(|e| format!("Falha na conexão local: {}", e));
  }

  // Conexão TCP
  if let Some(address) = uri.strip_prefix("tcp://") {
    return Docker::connect_with_http(address, 4, bollard::API_DEFAULT_VERSION)
      .map_err(|e| format!("Falha na conexão TCP/HTTP: {}", e));
  }

  // Fallback
  Docker::connect_with_local_defaults().map_err(|e| format!("Falha ao conectar (fallback): {}", e))
}

// --- EVENT MONITOR (Erro E0425) ---
// Adicionando um placeholder para a função que sumiu.
// Se você tinha lógica aqui antes, precisará colar ela de volta.
pub fn spawn_event_monitor(_app_handle: tauri::AppHandle) {
  // TODO: Implementar monitoramento de eventos do Docker
  println!("Monitor de eventos iniciado (placeholder)");
}
