use crate::services::docker::DockerConfig;
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
pub struct DockerContext {
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(rename = "Description")]
    pub description: Option<String>,
    #[serde(rename = "DockerEndpoint")]
    pub docker_endpoint: Option<String>,
    #[serde(rename = "Current")]
    pub current: bool,
}

#[tauri::command]
pub async fn list_docker_contexts() -> Result<Vec<DockerContext>, String> {
    // Executa: docker context ls --format json
    // Isso retorna uma lista de objetos JSON (um por linha)
    let output = Command::new("docker")
        .args(["context", "ls", "--format", "json"])
        .output()
        .map_err(|e| format!("Falha ao executar docker CLI: {}", e))?;

    if !output.status.success() {
        // Se o usuário não tiver o CLI instalado, isso vai falhar (o que é esperado)
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut contexts = Vec::new();

    // O output do Docker vem como "JSON Lines" (vários JSONs soltos, um por linha)
    // Precisamos iterar e parsear um por um
    for line in stdout.lines() {
        if line.trim().is_empty() {
            continue;
        }

        match serde_json::from_str::<DockerContext>(line) {
            Ok(mut ctx) => {
                // Fix: O contexto 'default' no Linux às vezes vem com Endpoint vazio,
                // mas sabemos que ele é o socket padrão.
                if ctx.name == "default"
                    && (ctx.docker_endpoint.is_none()
                        || ctx.docker_endpoint.as_ref().unwrap().is_empty())
                {
                    ctx.docker_endpoint = Some("unix:///var/run/docker.sock".to_string());
                }
                contexts.push(ctx);
            }
            Err(e) => eprintln!("Falha ao parsear contexto: {} | Erro: {}", line, e),
        }
    }

    Ok(contexts)
}

// Comando 2: Atualiza o Estado Global na memória do Rust
#[tauri::command]
pub fn set_docker_context(state: State<'_, DockerConfig>, endpoint: String) -> Result<(), String> {
    // Aqui atualizamos o Mutex que criamos no services/docker.rs
    // A partir de agora, qualquer comando (list_containers, etc) vai usar esse endpoint
    state.set_uri(endpoint);
    Ok(())
}
