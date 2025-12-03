use crate::services::docker::{self, DockerConfig};
use bollard::models::Network;
use bollard::query_parameters::{InspectNetworkOptions, ListNetworksOptions};
use tauri::State;

#[tauri::command]
pub async fn list_networks(
  state: State<'_, DockerConfig>,
  search: Option<String>,
) -> Result<Vec<Network>, String> {
  let docker = docker::connect(&state)?;

  let options = Some(ListNetworksOptions {
    ..Default::default()
  });

  let mut networks = docker
    .list_networks(options)
    .await
    .map_err(|e| format!("Erro ao listar redes: {}", e))?;

  // Lógica de Filtragem
  if let Some(query) = search {
    let q = query.trim().to_lowercase();
    if !q.is_empty() {
      networks.retain(|n| {
        let match_name = n
          .name
          .as_ref()
          .is_some_and(|name| name.to_lowercase().contains(&q));
        let match_id = n
          .id
          .as_ref()
          .is_some_and(|id| id.to_lowercase().contains(&q));
        let match_driver = n
          .driver
          .as_ref()
          .is_some_and(|d| d.to_lowercase().contains(&q));

        match_name || match_id || match_driver
      });
    }
  }

  Ok(networks)
}

#[tauri::command]
pub async fn remove_network(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;

  docker
    .remove_network(&id)
    .await
    .map_err(|e| format!("Erro ao remover rede: {}", e))?;

  Ok(())
}

#[tauri::command]
pub async fn inspect_network(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<Network, String> {
  let docker = crate::services::docker::connect(&state)?;

  let options = Some(InspectNetworkOptions::default());

  let network = docker
    .inspect_network(&id, options)
    .await
    .map_err(|e| format!("Erro ao inspecionar rede: {}", e))?;

  Ok(network)
}
