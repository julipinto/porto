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
pub fn set_docker_context(
    state: State<'_, DockerConfig>,
    endpoint: String,
) -> Result<String, String> {
    let mut final_uri = endpoint.trim().to_string();

    // 1. Se for TCP ou SSH, deixamos passar direto
    if final_uri.starts_with("tcp://") || final_uri.starts_with("ssh://") {
        state.set_uri(final_uri.clone());
        return Ok(final_uri);
    }

    // 2. Lógica para WINDOWS (Named Pipes)
    #[cfg(target_os = "windows")]
    {
        if !final_uri.starts_with("npipe://") {
            // Apenas adicionamos o prefixo, sem validar existência
            final_uri = format!("npipe://{}", final_uri);
        }
    }

    // 3. Lógica para LINUX/MAC (Unix Sockets)
    #[cfg(unix)]
    {
        // REMOVEMOS A VALIDAÇÃO DE EXISTÊNCIA (Path::exists)
        // Motivo: O socket pode não existir AINDA (ex: Docker desligado),
        // mas queremos permitir que o usuário selecione esse contexto mesmo assim.
        // Se falhar a conexão depois, o ServiceGuard vai mostrar a tela de erro apropriada.

        if !final_uri.starts_with("unix://") {
            final_uri = format!("unix://{}", final_uri);
        }
    }

    // 4. Salva no Estado Global
    state.set_uri(final_uri.clone());

    // Retorna a URI formatada
    Ok(final_uri)
}
