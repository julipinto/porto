use crate::services::docker::{self, DockerConfig};
use bollard::query_parameters::{CreateImageOptions, ListImagesOptions, RemoveImageOptions};
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter, State};

#[tauri::command]
pub async fn list_images(
    state: State<'_, DockerConfig>,
    search: Option<String>,
) -> Result<Vec<bollard::models::ImageSummary>, String> {
    let docker = docker::connect(&state)?;

    let options = Some(ListImagesOptions {
        all: false,
        ..Default::default()
    });

    let mut images = docker
        .list_images(options)
        .await
        .map_err(|e| format!("Erro ao listar imagens: {}", e))?;

    // Lógica de Filtragem
    if let Some(query) = search {
        let q = query.trim().to_lowercase();
        if !q.is_empty() {
            images.retain(|img| {
                // 1. Verifica ID (parcial)
                let match_id = img.id.to_lowercase().contains(&q);

                // 2. Verifica Tags (Nome da imagem)
                // A imagem pode ter várias tags (ex: ubuntu:latest, ubuntu:22.04)
                // Se QUALQUER uma der match, mantemos a imagem.
                let match_tag = img
                    .repo_tags
                    .iter()
                    .any(|tag| tag.to_lowercase().contains(&q));

                match_id || match_tag
            });
        }
    }

    Ok(images)
}

#[tauri::command]
pub async fn remove_image(
    state: State<'_, DockerConfig>,
    id: String,
) -> Result<Vec<bollard::models::ImageDeleteResponseItem>, String> {
    let docker = docker::connect(&state)?;
    let options = Some(RemoveImageOptions {
        force: true,
        ..Default::default()
    });
    let result = docker
        .remove_image(&id, options, None)
        .await
        .map_err(|e| format!("Erro ao excluir imagem: {}", e))?;
    Ok(result)
}

#[tauri::command]
pub async fn pull_image(
    app: AppHandle,
    state: State<'_, DockerConfig>,
    image: String,
) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    let (img_name, tag) = if let Some((name, t)) = image.split_once(':') {
        (name.to_string(), t.to_string())
    } else {
        (image.clone(), "latest".to_string())
    };

    let options = Some(CreateImageOptions {
        from_image: Some(img_name),
        tag: Some(tag),
        ..Default::default()
    });

    let mut stream = docker.create_image(options, None, None);
    let event_name = "pull-progress";

    tauri::async_runtime::spawn(async move {
        while let Some(msg) = stream.next().await {
            match msg {
                Ok(info) => {
                    let _ = app.emit(event_name, info);
                }
                Err(e) => {
                    let _ = app.emit("pull-error", e.to_string());
                    break;
                }
            }
        }
        let _ = app.emit("pull-complete", ());
    });

    Ok(())
}
