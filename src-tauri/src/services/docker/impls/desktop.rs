use crate::services::docker::{sys, DockerLifecycle};
use async_trait::async_trait;

pub struct DesktopManager;

#[async_trait]
impl DockerLifecycle for DesktopManager {
  async fn is_active(&self) -> bool {
    #[cfg(target_os = "windows")]
    return sys::windows::is_process_running("Docker Desktop.exe");

    #[cfg(target_os = "macos")]
    return sys::unix::pgrep("Docker");

    #[cfg(target_os = "linux")]
    return sys::unix::is_systemd_active("docker-desktop", true);
  }

  async fn start(&self) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    return sys::windows::start_via_cmd("Docker Desktop");

    #[cfg(target_os = "macos")]
    return sys::unix::open_app("Docker");

    #[cfg(target_os = "linux")]
    return sys::unix::systemctl("start", "docker-desktop", true, None);
  }

  async fn stop(&self) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    return sys::windows::kill_process("Docker Desktop.exe");

    #[cfg(target_os = "macos")]
    return sys::unix::quit_app_script("Docker");

    #[cfg(target_os = "linux")]
    return sys::unix::systemctl("stop", "docker-desktop", true, None);
  }
}
