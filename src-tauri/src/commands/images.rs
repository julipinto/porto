use crate::services::docker;
use bollard::query_parameters::{ListImagesOptions, RemoveImageOptions};

#[tauri::command]
pub async fn list_images() -> Result<Vec<bollard::models::ImageSummary>, String> {
    let docker = docker::connect()?;

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
    id: String,
) -> Result<Vec<bollard::models::ImageDeleteResponseItem>, String> {
    let docker = docker::connect()?;

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
