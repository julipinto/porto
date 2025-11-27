use crate::services::docker::{DockerConfig, DockerVariant};
use std::process::Command;
use std::time::Duration;
use tauri::State;
use tokio::net::TcpStream;
use tokio::time::timeout;

#[tauri::command]
pub async fn is_docker_service_active(state: State<'_, DockerConfig>) -> Result<bool, String> {
    let variant = state.get_variant();
    let uri = state.get_uri();

    let is_active = match variant {
        // Locais: Checa o SystemD
        DockerVariant::Native => check_service_active("docker", false),
        DockerVariant::Podman => check_service_active("podman", true),
        DockerVariant::Desktop => check_service_active("docker-desktop", true),

        // Remoto: Faz o PING via Rede (TCP)
        DockerVariant::Remote => check_remote_connection(&uri).await,
    };

    // Envolvemos o booleano num Ok()
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

    let variant = state.get_variant(); // <--- Lê o tipo salvo

    match variant {
        DockerVariant::Native => manage_native_docker(&action),
        DockerVariant::Podman => manage_user_service(&action, "podman", "podman.socket"),
        DockerVariant::Desktop => manage_user_service(&action, "docker-desktop", ""),
        DockerVariant::Remote => {
            Err("Não é possível controlar o ciclo de vida remoto via botão.".to_string())
        }
    }
}

// --- HELPERS ---

// Novo Helper: Tenta conectar via TCP com Timeout curto
async fn check_remote_connection(uri: &str) -> bool {
    // 1. Limpa o protocolo para pegar apenas "IP:PORTA"
    let address = if let Some(addr) = uri.strip_prefix("tcp://") {
        addr
    } else if uri.starts_with("ssh://") {
        // SSH assumimos true por enquanto
        return true;
    } else {
        return false;
    };

    // 2. Tenta conectar com timeout de 1 segundo
    match timeout(Duration::from_secs(1), TcpStream::connect(address)).await {
        Ok(Ok(_)) => true, // Conectou
        _ => false,        // Timeout ou Erro
    }
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
