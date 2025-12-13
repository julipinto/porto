use std::process::Command;

// --- LINUX (Systemd) ---
#[cfg(target_os = "linux")]
pub fn systemctl(
  action: &str,
  service: &str,
  user_mode: bool,
  socket: Option<&str>,
) -> Result<String, String> {
  let mut cmd = Command::new("systemctl");

  // Suporte ao modo usuário (usado no Podman/Docker Rootless)
  if user_mode {
    cmd.arg("--user");
  } else {
    // Se for modo root, pode precisar de pkexec dependendo da config,
    // mas mantendo simples conforme seu original:
    if action != "is-active" {
      // cmd.insert(0, "pkexec"); // Descomente se precisar de elevação
    }
  }

  cmd.arg(action).arg(service);

  // Lógica específica que você tinha para parar sockets
  if action == "stop" {
    if let Some(s) = socket {
      cmd.arg(s);
    }
  }

  let output = cmd.output().map_err(|e| e.to_string())?;

  if output.status.success() {
    Ok(format!("Systemd: {} {}", action, service))
  } else {
    Err(String::from_utf8_lossy(&output.stderr).to_string())
  }
}

#[cfg(target_os = "linux")]
pub fn is_systemd_active(service: &str, user_mode: bool) -> bool {
  let mut cmd = Command::new("systemctl");
  if user_mode {
    cmd.arg("--user");
  }

  match cmd.arg("is-active").arg(service).output() {
    Ok(o) => String::from_utf8_lossy(&o.stdout).trim() == "active",
    Err(_) => false,
  }
}

// --- MACOS ---
#[cfg(target_os = "macos")]
pub fn pgrep(name: &str) -> bool {
  let output = Command::new("pgrep").arg("-x").arg(name).output();
  matches!(output, Ok(o) if o.status.success())
}

#[cfg(target_os = "macos")]
pub fn open_app(app_name: &str) -> Result<String, String> {
  let output = Command::new("open")
    .arg("-a")
    .arg(app_name)
    .output()
    .map_err(|e| e.to_string())?;

  if output.status.success() {
    Ok("App aberto.".into())
  } else {
    Err("Falha ao abrir app.".into())
  }
}

#[cfg(target_os = "macos")]
pub fn quit_app_script(app_name: &str) -> Result<String, String> {
  let script = format!("quit app \"{}\"", app_name);
  Command::new("osascript")
    .arg("-e")
    .arg(&script)
    .output()
    .map_err(|e| e.to_string())?;
  Ok("App encerrado.".into())
}
