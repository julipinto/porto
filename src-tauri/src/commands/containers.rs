use crate::services::docker::{self, DockerConfig};

use bollard::models::ContainerInspectResponse;
use bollard::query_parameters::{
    InspectContainerOptions, ListContainersOptions, RemoveContainerOptions, StartContainerOptions,
    StopContainerOptions,
};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub async fn list_containers(
    state: State<'_, DockerConfig>,
) -> Result<Vec<bollard::models::ContainerSummary>, String> {
    let docker = docker::connect(&state)?;

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
pub async fn start_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    docker
        .start_container(&id, None::<StartContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao iniciar: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn stop_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    docker
        .stop_container(&id, None::<StopContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao parar: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn remove_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    // force: true garante que remove mesmo se estiver rodando (kill + rm)
    // v: true remove volumes anônimos associados (boa prática pra não deixar lixo)
    let options = Some(RemoveContainerOptions {
        force: true,
        v: true,
        ..Default::default()
    });

    docker
        .remove_container(&id, options)
        .await
        .map_err(|e| format!("Erro ao remover: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn inspect_container(
    state: State<'_, DockerConfig>,
    id: String,
) -> Result<ContainerInspectResponse, String> {
    let docker = docker::connect(&state)?;

    let result = docker
        .inspect_container(&id, None::<InspectContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao inspecionar: {}", e))?;

    Ok(result)
}

#[tauri::command]
pub async fn manage_container_group(
    state: State<'_, DockerConfig>,
    group: String,
    action: String,
) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    let mut filters = HashMap::new();
    filters.insert(
        "label".to_string(),
        vec![format!("com.docker.compose.project={}", group)],
    );

    let list_options = Some(ListContainersOptions {
        all: true,
        filters: Some(filters),
        ..Default::default()
    });

    let containers = docker
        .list_containers(list_options)
        .await
        .map_err(|e| format!("Erro ao buscar grupo: {}", e))?;

    for container in containers {
        if let Some(id) = container.id {
            let result = match action.as_str() {
                "start" => {
                    docker
                        .start_container(&id, None::<StartContainerOptions>)
                        .await
                }
                "stop" => {
                    docker
                        .stop_container(&id, None::<StopContainerOptions>)
                        .await
                }
                _ => Err(bollard::errors::Error::IOError {
                    err: std::io::Error::new(std::io::ErrorKind::InvalidInput, "Ação inválida"),
                }),
            };

            if let Err(e) = result {
                eprintln!("Erro ao executar {} no container {}: {}", action, id, e);
            }
        }
    }

    Ok(())
}
