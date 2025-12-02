use crate::services::docker::{DockerConfig, DockerVariant};
use bollard::query_parameters::{PruneContainersOptions, PruneImagesOptions, PruneNetworksOptions};
use serde::Serialize;
use std::process::Command;
use std::time::Duration;
use tauri::State;
use tokio::net::TcpStream;
use tokio::time::timeout;

#[derive(Serialize)]
pub struct PruneReport {
    deleted_containers: u64,
    deleted_images: u64,
    deleted_networks: u64,
    reclaimed_space: u64,
}

#[tauri::command]
pub async fn ping_docker(state: State<'_, DockerConfig>) -> Result<String, String> {
    let docker = crate::services::docker::connect(&state)?;
    docker
        .ping()
        .await
        .map_err(|e| format!("Ping falhou: {}", e))?;
    Ok("PONG".to_string())
}

#[tauri::command]
pub async fn is_docker_service_active(state: State<'_, DockerConfig>) -> Result<bool, String> {
    let variant = state.get_variant();
    let uri = state.get_uri();

    let is_active = match variant {
        DockerVariant::Native => check_service_active("docker", false),
        DockerVariant::Podman => check_service_active("podman", true),
        DockerVariant::Desktop => check_service_active("docker-desktop", true),
        DockerVariant::Remote => check_remote_connection(&uri).await,
    };

    Ok(is_active)
}

#[tauri::command]
pub async fn manage_docker(
    state: State<'_, DockerConfig>,
    action: String,
) -> Result<String, String> {
    if action != "start" && action != "stop" {
        return Err("Ação desconhecida".to_string());
    }

    let variant = state.get_variant();

    match variant {
        DockerVariant::Native => manage_native_docker(&action),
        DockerVariant::Podman => manage_user_service(&action, "podman", "podman.socket"),
        DockerVariant::Desktop => manage_user_service(&action, "docker-desktop", ""),
        DockerVariant::Remote => {
            Err("Não é possível controlar o ciclo de vida de um servidor remoto.".to_string())
        }
    }
}

#[tauri::command]
pub async fn prune_system(state: State<'_, DockerConfig>) -> Result<PruneReport, String> {
    let docker = crate::services::docker::connect(&state)?;

    // 1. Prune Containers (Sem Generics)
    let c_res = docker
        .prune_containers(None::<PruneContainersOptions>)
        .await
        .map_err(|e| format!("Erro ao limpar containers: {}", e))?;

    // 2. Prune Images (Sem Generics)
    let i_res = docker
        .prune_images(None::<PruneImagesOptions>)
        .await
        .map_err(|e| format!("Erro ao limpar imagens: {}", e))?;

    // 3. Prune Networks (Sem Generics)
    let n_res = docker
        .prune_networks(None::<PruneNetworksOptions>)
        .await
        .map_err(|e| format!("Erro ao limpar redes: {}", e))?;

    // O Bollard retorna i64, somamos aqui
    let reclaimed = c_res.space_reclaimed.unwrap_or(0) + i_res.space_reclaimed.unwrap_or(0);

    let report = PruneReport {
        deleted_containers: c_res.containers_deleted.unwrap_or_default().len() as u64,
        deleted_images: i_res.images_deleted.unwrap_or_default().len() as u64,
        deleted_networks: n_res.networks_deleted.unwrap_or_default().len() as u64,
        reclaimed_space: reclaimed as u64,
    };

    Ok(report)
}

// --- HELPERS ---

async fn check_remote_connection(uri: &str) -> bool {
    if uri.starts_with("ssh://") {
        return true;
    }

    let Some(address) = uri.strip_prefix("tcp://") else {
        return false;
    };

    matches!(
        timeout(Duration::from_secs(1), TcpStream::connect(address)).await,
        Ok(Ok(_))
    )
}

fn check_service_active(service_name: &str, is_user: bool) -> bool {
    let mut cmd = Command::new("systemctl");
    if is_user {
        cmd.arg("--user");
    }
    let output = cmd.arg("is-active").arg(service_name).output();
    match output {
        Ok(o) => String::from_utf8_lossy(&o.stdout).trim() == "active",
        Err(_) => false,
    }
}

fn manage_user_service(
    action: &str,
    service_name: &str,
    socket_name: &str,
) -> Result<String, String> {
    let mut cmd = Command::new("systemctl");
    cmd.arg("--user").arg(action).arg(service_name);
    if action == "stop" && !socket_name.is_empty() {
        cmd.arg(socket_name);
    }
    run_command(cmd, service_name)
}

fn manage_native_docker(action: &str) -> Result<String, String> {
    let mut cmd = Command::new("pkexec");
    cmd.arg("systemctl").arg(action);
    if action == "stop" {
        cmd.arg("docker").arg("docker.socket");
    } else {
        cmd.arg("docker");
    }
    run_command(cmd, "Docker Nativo")
}

fn run_command(mut cmd: Command, label: &str) -> Result<String, String> {
    let output = cmd
        .output()
        .map_err(|e| format!("Falha ao executar: {}", e))?;
    if output.status.success() {
        Ok(format!("{} - Sucesso", label))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
