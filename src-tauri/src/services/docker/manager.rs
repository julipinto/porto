use crate::services::docker::{get_manager, DockerConfig};
use bollard::query_parameters::{PruneContainersOptions, PruneImagesOptions, PruneNetworksOptions};
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
