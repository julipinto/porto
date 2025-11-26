use crate::services::shell::ShellManager;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn open_terminal(
    app: AppHandle,
    state: State<'_, ShellManager>,
    id: String,
) -> Result<(), String> {
    state.open_session(app, id).await
}

#[tauri::command]
pub async fn write_terminal(
    state: State<'_, ShellManager>,
    id: String,
    data: String,
) -> Result<(), String> {
    state.write_to_session(id, data).await;
    Ok(())
}

#[tauri::command]
pub async fn resize_terminal(_id: String, _rows: u16, _cols: u16) -> Result<(), String> {
    // Implementação futura: Redimensionar o TTY do Docker
    // O Bollard tem suporte a resize_exec, podemos adicionar depois
    Ok(())
}
