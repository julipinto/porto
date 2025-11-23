use std::process::Command;

#[tauri::command]
pub async fn manage_docker(action: String) -> Result<String, String> {
    if action != "start" && action != "stop" {
        return Err("Ação desconhecida".to_string());
    }

    let output = Command::new("pkexec")
        .arg("systemctl")
        .arg(&action)
        .arg("docker")
        .output()
        .map_err(|e| format!("Falha ao executar comando: {}", e))?;

    if output.status.success() {
        Ok(format!("Docker {}", action))
    } else {
        let err = String::from_utf8_lossy(&output.stderr);
        Err(format!("Erro systemctl: {}", err))
    }
}