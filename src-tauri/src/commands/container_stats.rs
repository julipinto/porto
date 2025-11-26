use crate::services::docker::{self, DockerConfig};
use bollard::query_parameters::StatsOptions;
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter, State};

#[tauri::command]
pub async fn stream_container_stats(
    app: AppHandle,
    state: State<'_, DockerConfig>,
    id: String,
) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    let options = Some(StatsOptions {
        stream: true,
        one_shot: false,
    });
    let mut stream = docker.stats(&id, options);

    tauri::async_runtime::spawn(async move {
        let event_name = format!("stats-stream://{}", id);
        while let Some(stats_result) = stream.next().await {
            if let Ok(stats) = stats_result {
                if app.emit(&event_name, stats).is_err() {
                    break;
                }
            } else {
                break;
            }
        }
    });
    Ok(())
}
