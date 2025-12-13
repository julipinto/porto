use crate::services::docker::{DockerConfig, DockerVariant};
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::State;

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ConnectionType {
  Local,
  Remote,
}

#[derive(Serialize)]
pub struct ContextConfigResponse {
  pub uri: String,
  pub connection_type: ConnectionType,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DockerContext {
  #[serde(rename = "Name")]
  pub name: String,
  #[serde(rename = "Description")]
  pub description: Option<String>,
  #[serde(rename = "DockerEndpoint")]
  pub docker_endpoint: Option<String>,
  #[serde(rename = "Current")]
  pub current: bool,
}

#[tauri::command]
pub async fn list_docker_contexts() -> Result<Vec<DockerContext>, String> {
  // Executa: docker context ls --format json
  // Isso retorna uma lista de objetos JSON (um por linha)
  let output = Command::new("docker")
    .args(["context", "ls", "--format", "json"])
    .output()
    .map_err(|e| format!("Falha ao executar docker CLI: {}", e))?;

  if !output.status.success() {
    // Se o usuário não tiver o CLI instalado, isso vai falhar (o que é esperado)
    return Err(String::from_utf8_lossy(&output.stderr).to_string());
  }

  let stdout = String::from_utf8_lossy(&output.stdout);
  let mut contexts = Vec::new();

  // O output do Docker vem como "JSON Lines" (vários JSONs soltos, um por linha)
  // Precisamos iterar e parsear um por um
  for line in stdout.lines() {
    if line.trim().is_empty() {
      continue;
    }

    match serde_json::from_str::<DockerContext>(line) {
      Ok(mut ctx) => {
        // Fix: O contexto 'default' no Linux às vezes vem com Endpoint vazio,
        // mas sabemos que ele é o socket padrão.
        if ctx.name == "default"
          && (ctx.docker_endpoint.is_none() || ctx.docker_endpoint.as_ref().unwrap().is_empty())
        {
          ctx.docker_endpoint = Some("unix:///var/run/docker.sock".to_string());
        }
        contexts.push(ctx);
      }
      Err(e) => eprintln!("Falha ao parsear contexto: {} | Erro: {}", line, e),
    }
  }

  Ok(contexts)
}

// Comando 2: Atualiza o Estado Global na memória do Rust
#[tauri::command]
pub fn set_docker_context(
  state: State<'_, DockerConfig>,
  endpoint: String,
) -> Result<ContextConfigResponse, String> {
  let mut final_uri = endpoint.trim().to_string();
  let connection_type;
  let variant;

  if final_uri.starts_with("tcp://")
    || final_uri.starts_with("ssh://")
    || final_uri.starts_with("http://")
    || final_uri.starts_with("https://")
  {
    connection_type = ConnectionType::Remote;
    variant = DockerVariant::Remote;
  } else {
    connection_type = ConnectionType::Local;

    #[cfg(target_os = "windows")]
    {
      if !final_uri.contains("://") || final_uri.starts_with("npipe://") {
        final_uri = format!("npipe://{}", final_uri);
      }
    }

    #[cfg(unix)]
    if !final_uri.starts_with("unix://") {
      final_uri = format!("unix://{}", final_uri);
    }

    // CLASSIFICAÇÃO DA VARIANTE
    if final_uri.contains("podman") {
      variant = DockerVariant::Podman;
    } else if final_uri.contains("desktop") {
      variant = DockerVariant::Desktop;
    } else {
      variant = DockerVariant::Native;
    }
  }

  state.set_config(final_uri.clone(), variant);

  Ok(ContextConfigResponse {
    uri: final_uri,
    connection_type,
  })
}
