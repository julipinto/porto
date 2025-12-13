use std::process::Command;

pub fn is_process_running(name: &str) -> bool {
  let filter = format!("IMAGENAME eq {}", name);
  let output = Command::new("tasklist").args(["/FI", &filter]).output();

  match output {
    Ok(o) => {
      let stdout = String::from_utf8_lossy(&o.stdout);
      // O Windows retorna sucesso mesmo se não achar, mas diz "INFO: No tasks..."
      o.status.success() && stdout.contains(name)
    }
    Err(_) => false,
  }
}

pub fn start_via_cmd(app_name: &str) -> Result<String, String> {
  Command::new("cmd")
    .args(["/C", "start", "", app_name])
    .spawn()
    .map_err(|e| format!("Falha ao iniciar {}: {}", app_name, e))?;

  Ok(format!("{} iniciado via CMD.", app_name))
}

pub fn kill_process(name: &str) -> Result<String, String> {
  let _ = Command::new("taskkill")
    .args(["/IM", name, "/F"])
    .output()
    .map_err(|e| e.to_string())?;

  Ok(format!("Comando de encerrar enviado para {}", name))
}
