use crate::services::docker::{self, DockerConfig};
use bollard::query_parameters::{ListImagesOptions, RemoveImageOptions};
use tauri::State;

#[tauri::command]
pub async fn list_images(
    state: State<'_, DockerConfig>,
) -> Result<Vec<bollard::models::ImageSummary>, String> {
    let docker = docker::connect(&state)?;

    let options = Some(ListImagesOptions {
        all: false, // false = mostra só as principais, true = mostra camadas intermediárias
        ..Default::default()
    });

    let images = docker
        .list_images(options)
        .await
        .map_err(|e| format!("Erro ao listar imagens: {}", e))?;

    Ok(images)
}

#[tauri::command]
pub async fn remove_image(
    state: State<'_, DockerConfig>,
    id: String,
) -> Result<Vec<bollard::models::ImageDeleteResponseItem>, String> {
    let docker = docker::connect(&state)?;

    let options = Some(RemoveImageOptions {
        force: true, // Força a remoção de tags, mas respeita containers existentes
        ..Default::default()
    });

    let result = docker
        .remove_image(&id, options, None)
        .await
        .map_err(|e| format!("Erro ao excluir imagem: {}", e))?;

    Ok(result)
}
