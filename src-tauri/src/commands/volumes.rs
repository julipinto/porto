use crate::services::docker::{self, DockerConfig};
use bollard::models::{ContainerSummary, Volume};
use bollard::query_parameters::{ListContainersOptions, ListVolumesOptions, RemoveVolumeOptions};
use tauri::State;

#[tauri::command]
pub async fn list_volumes(
  state: State<'_, DockerConfig>,
  search: Option<String>,
) -> Result<Vec<Volume>, String> {
  let docker = docker::connect(&state)?;

  let response = docker
    .list_volumes(None::<ListVolumesOptions>)
    .await
    .map_err(|e| format!("Erro ao listar volumes: {}", e))?;

  let mut volumes = response.volumes.unwrap_or_default();

  // Lógica de Filtragem
  if let Some(query) = search {
    let q = query.trim().to_lowercase();
    if !q.is_empty() {
      volumes.retain(|v| {
        let match_name = v.name.to_lowercase().contains(&q);
        let match_driver = v.driver.to_lowercase().contains(&q);
        // Mountpoint é onde está no disco do host
        let match_mount = v.mountpoint.to_lowercase().contains(&q);

        match_name || match_driver || match_mount
      });
    }
  }

  Ok(volumes)
}

#[tauri::command]
pub async fn remove_volume(state: State<'_, DockerConfig>, name: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;

  docker
    .remove_volume(&name, None::<RemoveVolumeOptions>)
    .await
    .map_err(|e| format!("Erro ao remover volume: {}", e))?;

  Ok(())
}

#[derive(serde::Serialize)]
pub struct VolumeDetails {
  pub base: Volume,
  pub used_by: Vec<ContainerSummary>, // Lista de containers conectados
}

#[tauri::command]
pub async fn inspect_volume(
  state: State<'_, DockerConfig>,
  name: String,
) -> Result<VolumeDetails, String> {
  let docker = crate::services::docker::connect(&state)?;

  // 1. Busca dados do volume
  let volume = docker
    .inspect_volume(&name)
    .await
    .map_err(|e| format!("Erro ao inspecionar volume: {}", e))?;

  // 2. Busca todos os containers para cruzar dados
  let options = Some(ListContainersOptions {
    all: true,
    ..Default::default()
  });

  let all_containers = docker
    .list_containers(options)
    .await
    .map_err(|e| format!("Erro ao listar containers: {}", e))?;

  // 3. Filtra: Quem está usando este volume?
  let used_by: Vec<ContainerSummary> = all_containers
    .into_iter()
    .filter(|c| {
      c.mounts.as_ref().is_some_and(|mounts| {
        mounts
          .iter()
          .any(|m| m.name.as_deref() == Some(&name) || m.source.as_deref() == Some(&name))
      })
    })
    .collect();

  Ok(VolumeDetails {
    base: volume,
    used_by,
  })
}
