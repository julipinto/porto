use crate::services::docker;
use bollard::query_parameters::StatsOptions;
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub async fn stream_container_stats(app: AppHandle, id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    // CORREÇÃO 2: Struct sem update sintax (..) se preencher tudo
    // E sem generics <String>
    let options = Some(StatsOptions {
        stream: true,
        one_shot: false,
    });

    let mut stream = docker.stats(&id, options);

    tauri::async_runtime::spawn(async move {
        let event_name = format!("stats-stream://{}", id);

        while let Some(stats_result) = stream.next().await {
            match stats_result {
                Ok(stats) => {
                    if app.emit(&event_name, stats).is_err() {
                        break;
                    }
                }
                Err(e) => {
                    eprintln!("Erro no stream de stats: {}", e);
                    break;
                }
            }
        }
    });

    Ok(())
}
