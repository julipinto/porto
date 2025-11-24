use crate::services::docker;
use bollard::query_parameters::{
    ListContainersOptions, StartContainerOptions, StopContainerOptions,
};

#[tauri::command]
pub async fn list_containers() -> Result<Vec<bollard::models::ContainerSummary>, String> {
    let docker = docker::connect()?;

    let options = Some(ListContainersOptions {
        all: true,
        ..Default::default()
    });

    let containers = docker
        .list_containers(options)
        .await
        .map_err(|e| format!("Erro ao listar: {}", e))?;

    Ok(containers)
}

#[tauri::command]
pub async fn start_container(id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    docker
        .start_container(&id, None::<StartContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao iniciar: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn stop_container(id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    docker
        .stop_container(&id, None::<StopContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao parar: {}", e))?;

    Ok(())
}
