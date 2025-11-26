use crate::services::docker::{self, DockerConfig};
use bollard::models::Volume;
use bollard::query_parameters::{ListVolumesOptions, RemoveVolumeOptions};
use tauri::State;

#[tauri::command]
pub async fn list_volumes(state: State<'_, DockerConfig>) -> Result<Vec<Volume>, String> {
    let docker = docker::connect(&state)?;

    let response = docker
        .list_volumes(None::<ListVolumesOptions>)
        .await
        .map_err(|e| format!("Erro ao listar volumes: {}", e))?;

    Ok(response.volumes.unwrap_or_default())
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
