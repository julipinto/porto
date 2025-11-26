use crate::services::docker::{self, DockerConfig};
use bollard::query_parameters::LogsOptions;
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter, State};

#[tauri::command]
pub async fn stream_container_logs(
    app: AppHandle,
    state: State<'_, DockerConfig>,
    id: String,
) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    let options = Some(LogsOptions {
        follow: true,
        stdout: true,
        stderr: true,
        tail: "100".into(),
        ..Default::default()
    });

    let mut stream = docker.logs(&id, options);

    tauri::async_runtime::spawn(async move {
        let event_name = format!("log-stream://{}", id);
        while let Some(log_result) = stream.next().await {
            if let Ok(log_output) = log_result {
                let payload = log_output.to_string();
                if app.emit(&event_name, payload).is_err() {
                    break;
                }
            } else {
                break;
            }
        }
    });
    Ok(())
}
