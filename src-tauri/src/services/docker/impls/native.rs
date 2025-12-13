use crate::services::docker::DockerLifecycle;
use async_trait::async_trait;

#[cfg(target_os = "linux")]
use crate::services::docker::sys;

pub struct NativeManager;

#[async_trait]
impl DockerLifecycle for NativeManager {
  async fn is_active(&self) -> bool {
    #[cfg(target_os = "linux")]
    return sys::unix::is_systemd_active("docker", false);
    #[cfg(not(target_os = "linux"))]
    return false;
  }

  async fn start(&self) -> Result<String, String> {
    #[cfg(target_os = "linux")]
    return sys::unix::systemctl("start", "docker", false, None);
    #[cfg(not(target_os = "linux"))]
    Err("Docker nativo suportado apenas no Linux".into())
  }

  async fn stop(&self) -> Result<String, String> {
    #[cfg(target_os = "linux")]
    return sys::unix::systemctl("stop", "docker", false, Some("docker.socket"));
    #[cfg(not(target_os = "linux"))]
    Err("Docker nativo suportado apenas no Linux".into())
  }
}
