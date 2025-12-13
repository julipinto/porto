use async_trait::async_trait;
use crate::services::docker::DockerLifecycle;

#[cfg(unix)]
use crate::services::docker::sys;

pub struct PodmanManager;
#[async_trait]
impl DockerLifecycle for PodmanManager {
  async fn is_active(&self) -> bool {
    #[cfg(target_os = "linux")]
    return sys::unix::is_systemd_active("podman", true); // true = user mode (rootless)

    #[cfg(target_os = "macos")]
    return sys::unix::pgrep("podman"); // Verifica se o processo da VM está rodando

    #[cfg(target_os = "windows")]
    return false; // Ainda não implementado para Windows
  }

  async fn start(&self) -> Result<String, String> {
    #[cfg(target_os = "linux")]
    return sys::unix::systemctl("start", "podman", true, None);

    #[cfg(not(target_os = "linux"))]
    Err("Automação de Start/Stop do Podman disponível apenas no Linux".into())
  }

  async fn stop(&self) -> Result<String, String> {
    #[cfg(target_os = "linux")]
    // No Podman, é importante parar o socket também para garantir
    return sys::unix::systemctl("stop", "podman", true, Some("podman.socket"));

    #[cfg(not(target_os = "linux"))]
    Err("Automação de Start/Stop do Podman disponível apenas no Linux".into())
  }
}
