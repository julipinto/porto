use crate::services::docker::{self, DockerConfig};

use bollard::models::{
  ContainerCreateBody, ContainerInspectResponse, EndpointSettings, HostConfig, NetworkingConfig,
  PortBinding,
};
use bollard::query_parameters::{
  CreateContainerOptions, InspectContainerOptions, ListContainersOptions, RemoveContainerOptions,
  StartContainerOptions, StopContainerOptions,
};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub async fn list_containers(
  state: State<'_, DockerConfig>,
  search: Option<String>,
) -> Result<Vec<bollard::models::ContainerSummary>, String> {
  let docker = docker::connect(&state)?;

  let options = Some(ListContainersOptions {
    all: true,
    ..Default::default()
  });

  let mut containers = docker
    .list_containers(options)
    .await
    .map_err(|e| format!("Erro ao listar: {}", e))?;

  if let Some(query) = search {
    let q = query.trim().to_lowercase();
    if !q.is_empty() {
      containers.retain(|c| {
        let match_name = c
          .names
          .as_ref()
          .is_some_and(|names| names.iter().any(|n| n.to_lowercase().contains(&q)));
        let match_image = c
          .image
          .as_ref()
          .is_some_and(|img| img.to_lowercase().contains(&q));
        let match_id = c
          .id
          .as_ref()
          .is_some_and(|id| id.to_lowercase().contains(&q));
        let match_group = c.labels.as_ref().is_some_and(|labels| {
          labels
            .get("com.docker.compose.project")
            .is_some_and(|proj| proj.to_lowercase().contains(&q))
        });
        match_name || match_image || match_id || match_group
      });
    }
  }

  Ok(containers)
}

#[tauri::command]
pub async fn start_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  docker
    .start_container(&id, None::<StartContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao iniciar: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn stop_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  docker
    .stop_container(&id, None::<StopContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao parar: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn remove_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  let options = Some(RemoveContainerOptions {
    force: true,
    v: true,
    ..Default::default()
  });
  docker
    .remove_container(&id, options)
    .await
    .map_err(|e| format!("Erro ao remover: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn inspect_container(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<ContainerInspectResponse, String> {
  let docker = docker::connect(&state)?;
  let result = docker
    .inspect_container(&id, None::<InspectContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao inspecionar: {}", e))?;
  Ok(result)
}

#[tauri::command]
pub async fn manage_container_group(
  state: State<'_, DockerConfig>,
  group: String,
  action: String,
) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  let mut filters = HashMap::new();
  filters.insert(
    "label".to_string(),
    vec![format!("com.docker.compose.project={}", group)],
  );
  let list_options = Some(ListContainersOptions {
    all: true,
    filters: Some(filters),
    ..Default::default()
  });
  let containers = docker
    .list_containers(list_options)
    .await
    .map_err(|e| format!("Erro ao buscar grupo: {}", e))?;

  for container in containers {
    if let Some(id) = container.id {
      let result = match action.as_str() {
        "start" => {
          docker
            .start_container(&id, None::<StartContainerOptions>)
            .await
        }
        "stop" => {
          docker
            .stop_container(&id, None::<StopContainerOptions>)
            .await
        }
        _ => Err(bollard::errors::Error::IOError {
          err: std::io::Error::new(std::io::ErrorKind::InvalidInput, "Ação inválida"),
        }),
      };
      if let Err(e) = result {
        eprintln!("Erro ao executar {} no container {}: {}", action, id, e);
      }
    }
  }
  Ok(())
}

// --- STRUCT E FUNÇÃO DE CRIAÇÃO ---

#[derive(serde::Deserialize)]
pub struct RunContainerConfig {
  image: String,
  name: Option<String>,
  ports: Vec<(String, String)>,
  env: Vec<(String, String)>,
  mounts: Vec<(String, String)>,
  network_id: Option<String>,
}

#[tauri::command]
pub async fn create_and_start_container(
  state: State<'_, DockerConfig>,
  config: RunContainerConfig,
) -> Result<String, String> {
  let docker = docker::connect(&state)?;

  // 1. Configurar Portas
  let mut port_bindings = HashMap::new();
  let mut exposed_ports = HashMap::new();

  for (host_port, container_port) in config.ports {
    let container_key = format!("{}/tcp", container_port);
    exposed_ports.insert(container_key.clone(), HashMap::new());
    port_bindings.insert(
      container_key,
      Some(vec![PortBinding {
        host_ip: Some("0.0.0.0".to_string()),
        host_port: Some(host_port),
      }]),
    );
  }

  // 2. Env Vars
  let envs: Vec<String> = config
    .env
    .iter()
    .map(|(k, v)| format!("{}={}", k, v))
    .collect();

  // 3. Binds (Volumes)
  let binds: Vec<String> = config
    .mounts
    .iter()
    .map(|(host, cont)| format!("{}:{}", host, cont))
    .collect();

  // 4. Configuração de REDE (Nova Lógica)
  let networking_config = if let Some(net_id) = config.network_id.filter(|n| !n.is_empty()) {
    let mut endpoints = HashMap::new();
    endpoints.insert(net_id, EndpointSettings::default());

    Some(NetworkingConfig {
      // CORREÇÃO AQUI: Embrulhar 'endpoints' em Some()
      endpoints_config: Some(endpoints),
    })
  } else {
    None
  };

  // 5. Host Config
  let host_config = HostConfig {
    port_bindings: Some(port_bindings),
    binds: Some(binds),
    ..Default::default()
  };

  // 6. Container Body Principal
  let container_config = ContainerCreateBody {
    image: Some(config.image),
    exposed_ports: Some(exposed_ports),
    env: Some(envs),
    host_config: Some(host_config),
    networking_config, // <--- Injetamos a rede aqui
    ..Default::default()
  };

  // 7. Opções (Nome)
  let options = config
    .name
    .filter(|n| !n.is_empty())
    .map(|name| CreateContainerOptions {
      name: Some(name),
      ..Default::default()
    });

  // 8. Criar
  let create_res = docker
    .create_container(options, container_config)
    .await
    .map_err(|e| format!("Erro ao criar: {}", e))?;

  // 9. Iniciar com ROLLBACK (Segurança)
  if let Err(start_err) = docker
    .start_container(&create_res.id, None::<StartContainerOptions>)
    .await
  {
    // Se falhar o start (ex: porta ocupada), deletamos o container para não deixar lixo
    let remove_opts = Some(RemoveContainerOptions {
      force: true,
      ..Default::default()
    });
    let _ = docker.remove_container(&create_res.id, remove_opts).await;

    return Err(format!(
      "Falha ao iniciar (Rollback executado): {}",
      start_err
    ));
  }

  Ok(create_res.id)
}
