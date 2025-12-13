use crate::services::docker::DockerLifecycle;
use async_trait::async_trait;
pub struct RemoteDummy;

#[async_trait]
impl DockerLifecycle for RemoteDummy {
  async fn is_active(&self) -> bool {
    true
  }
  async fn start(&self) -> Result<String, String> {
    Err("Remoto não gerenciável".into())
  }
  async fn stop(&self) -> Result<String, String> {
    Err("Remoto não gerenciável".into())
  }
}
