use crate::services::docker;
use bollard::models::Volume;
use bollard::query_parameters::{ListVolumesOptions, RemoveVolumeOptions};

#[tauri::command]
pub async fn list_volumes() -> Result<Vec<Volume>, String> {
    let docker = docker::connect()?;

    let response = docker
        .list_volumes(None::<ListVolumesOptions>)
        .await
        .map_err(|e| format!("Erro ao listar volumes: {}", e))?;

    Ok(response.volumes.unwrap_or_default())
}

#[tauri::command]
pub async fn remove_volume(name: String) -> Result<(), String> {
    let docker = docker::connect()?;

    docker
        .remove_volume(&name, None::<RemoveVolumeOptions>)
        .await
        .map_err(|e| format!("Erro ao remover volume: {}", e))?;

    Ok(())
}
