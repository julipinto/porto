use crate::services::docker::{self, DockerConfig};

use bollard::models::{
  HistoryResponseItem,     // Para history_image
  ImageDeleteResponseItem, // Para remove_image
  ImageInspect,            // Para inspect_image
  ImageSummary,            // Para list_images
};

// 2. Todas as Opções necessárias
use bollard::query_parameters::{CreateImageOptions, ListImagesOptions, RemoveImageOptions};

use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter, State};

// --- 1. LISTAR ---
#[tauri::command]
pub async fn list_images(
  state: State<'_, DockerConfig>,
  search: Option<String>,
) -> Result<Vec<ImageSummary>, String> {
  let docker = docker::connect(&state)?;

  let options = Some(ListImagesOptions {
    all: false,
    ..Default::default()
  });

  let mut images = docker
    .list_images(options)
    .await
    .map_err(|e| format!("Erro ao listar imagens: {}", e))?;

  if let Some(query) = search {
    let q = query.trim().to_lowercase();
    if !q.is_empty() {
      images.retain(|img| {
        let match_id = img.id.to_lowercase().contains(&q);
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

// --- 2. REMOVER ---
#[tauri::command]
pub async fn remove_image(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<Vec<ImageDeleteResponseItem>, String> {
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

// --- 3. BAIXAR (PULL) ---
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

// --- 4. INSPECIONAR ---
#[tauri::command]
pub async fn inspect_image(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<ImageInspect, String> {
  let docker = docker::connect(&state)?;

  let result = docker
    .inspect_image(&id)
    .await
    .map_err(|e| format!("Erro ao inspecionar imagem: {}", e))?;

  Ok(result)
}

// --- 5. HISTÓRICO ---
#[tauri::command]
pub async fn history_image(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<Vec<HistoryResponseItem>, String> {
  let docker = docker::connect(&state)?;

  // CORREÇÃO: O método correto no Bollard é image_history
  let history = docker
    .image_history(&id)
    .await
    .map_err(|e| format!("Erro ao buscar histórico: {}", e))?;

  Ok(history)
}
