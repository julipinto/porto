use crate::services::docker;
use bollard::query_parameters::LogsOptions;
use futures_util::stream::StreamExt;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub async fn stream_container_logs(app: AppHandle, id: String) -> Result<(), String> {
    let docker = docker::connect()?;

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
            match log_result {
                Ok(log_output) => {
                    let payload = log_output.to_string();

                    if app.emit(&event_name, payload).is_err() {
                        break;
                    }
                }
                Err(e) => {
                    eprintln!("Erro no stream de logs: {}", e);
                    break;
                }
            }
        }
    });

    Ok(())
}
