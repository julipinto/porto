use crate::services::docker::{get_manager, DockerConfig, DockerVariant};
use bollard::query_parameters::{PruneContainersOptions, PruneImagesOptions, PruneNetworksOptions};
use bollard::Docker;
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct PruneReport {
  deleted_containers: u64,
  deleted_images: u64,
  deleted_networks: u64,
  reclaimed_space: u64,
}

#[tauri::command]
pub async fn ping_docker(state: State<'_, DockerConfig>) -> Result<String, String> {
  // Mantém a lógica original usando a lib do Bollard que você já tem em services::docker::connect
  let docker = crate::services::docker::connect(&state)?;
  docker
    .ping()
    .await
    .map_err(|e| format!("Ping falhou: {}", e))?;
  Ok("PONG".to_string())
}

#[tauri::command]
pub async fn is_docker_service_active(state: State<'_, DockerConfig>) -> Result<bool, String> {
  // NOVA ARQUITETURA: Pede pra factory o gerenciador correto e checa
  let manager = get_manager(state.get_variant());
  Ok(manager.is_active().await)
}

#[tauri::command]
pub async fn manage_docker(
  state: State<'_, DockerConfig>,
  action: String,
) -> Result<String, String> {
  // NOVA ARQUITETURA: Delega start/stop independente do OS
  let manager = get_manager(state.get_variant());

  match action.as_str() {
    "start" => manager.start().await,
    "stop" => manager.stop().await,
    _ => Err("Ação desconhecida".to_string()),
  }
}

#[tauri::command]
pub async fn prune_system(state: State<'_, DockerConfig>) -> Result<PruneReport, String> {
  // Mantém exatamente igual, pois usa API do Docker (Bollard), não comando de SO.
  let docker = crate::services::docker::connect(&state)?;

  // 1. Prune Containers
  let c_res = docker
    .prune_containers(None::<PruneContainersOptions>)
    .await
    .map_err(|e| format!("Erro ao limpar containers: {}", e))?;

  // 2. Prune Images
  let i_res = docker
    .prune_images(None::<PruneImagesOptions>)
    .await
    .map_err(|e| format!("Erro ao limpar imagens: {}", e))?;

  // 3. Prune Networks
  let n_res = docker
    .prune_networks(None::<PruneNetworksOptions>)
    .await
    .map_err(|e| format!("Erro ao limpar redes: {}", e))?;

  let reclaimed = c_res.space_reclaimed.unwrap_or(0) + i_res.space_reclaimed.unwrap_or(0);

  let report = PruneReport {
    deleted_containers: c_res.containers_deleted.unwrap_or_default().len() as u64,
    deleted_images: i_res.images_deleted.unwrap_or_default().len() as u64,
    deleted_networks: n_res.networks_deleted.unwrap_or_default().len() as u64,
    reclaimed_space: reclaimed as u64,
  };

  Ok(report)
}

#[derive(Serialize)]
pub struct ActiveConfig {
  uri: String,
  variant: String, // Vamos enviar como string para facilitar no JS
}

#[tauri::command]
pub async fn get_active_config(state: State<'_, DockerConfig>) -> Result<ActiveConfig, String> {
  let uri = state.get_uri();
  let variant_enum: DockerVariant = state.get_variant();

  // Converte o Enum para String bonita
  let variant = match variant_enum {
    DockerVariant::Native => "Nativo (Linux)",
    DockerVariant::Desktop => "Docker Desktop",
    DockerVariant::Podman => "Podman",
    DockerVariant::Remote => "Remoto (TCP/SSH)",
  };

  Ok(ActiveConfig {
    uri,
    variant: variant.to_string(),
  })
}

// ... imports ...

// Função auxiliar (Pura lógica do Rust)
fn detect_variant_from_uri(uri: &str) -> DockerVariant {
  let lower_uri = uri.to_lowercase();

  if lower_uri.starts_with("tcp://")
    || lower_uri.starts_with("http://")
    || lower_uri.starts_with("https://")
    || lower_uri.starts_with("ssh://")
  {
    return DockerVariant::Remote;
  }

  if lower_uri.contains("podman") {
    return DockerVariant::Podman;
  }

  // Se for socket local e não tem "podman" no nome, assumimos Desktop ou Nativo
  // (Pode refinar isso checando OS se quiser, mas Desktop é um fallback seguro)
  DockerVariant::Desktop
}

#[tauri::command]
pub async fn connect_and_persist(
  state: State<'_, DockerConfig>,
  uri: String,
  // variant_str: String, <--- REMOVIDO! O Back resolve isso agora.
) -> Result<String, String> {
  // 1. O Backend decide quem é
  let variant = detect_variant_from_uri(&uri);

  // 2. Tentar conexão (Mesma lógica de antes)
  let test_client = if let Some(address) = uri.strip_prefix("tcp://") {
    Docker::connect_with_http(address, 4, bollard::API_DEFAULT_VERSION)
      .map_err(|e| format!("Erro de formato TCP: {}", e))?
  } else if uri.starts_with("unix://") || uri.starts_with("npipe://") {
    Docker::connect_with_local_defaults().map_err(|e| format!("Erro de formato Local: {}", e))?
  } else {
    return Err("Protocolo desconhecido".to_string());
  };

  // 3. Teste de Fogo
  test_client
    .ping()
    .await
    .map_err(|e| format!("Falha ao conectar: {}", e))?;

  // 4. Salvar estado
  state.set_config(uri.clone(), variant);

  // Retorna a variante detectada (como string) caso o front queira saber o que foi decidido
  let variant_name = match variant {
    DockerVariant::Native => "native",
    DockerVariant::Desktop => "desktop",
    DockerVariant::Podman => "podman",
    DockerVariant::Remote => "remote",
  };

  Ok(variant_name.to_string())
}
