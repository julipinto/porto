use crate::services::docker; 
use bollard::query_parameters::ListContainersOptions;

#[tauri::command]
pub async fn list_containers() -> Result<Vec<bollard::models::ContainerSummary>, String> {
    println!("RUST: Recebi pedido de list_containers..."); // <--- LOG 1

    let docker = docker::connect().map_err(|e| {
        println!("RUST: Erro ao conectar: {}", e); // <--- LOG 2
        e
    })?;

    let options = Some(ListContainersOptions {
        all: true,
        ..Default::default()
    });

    println!("RUST: Buscando no Docker Engine..."); // <--- LOG 3

    let containers = docker
        .list_containers(options)
        .await
        .map_err(|e| {
            println!("RUST: Erro no list_containers: {}", e); // <--- LOG 4
            format!("Erro ao listar: {}", e)
        })?;

    println!("RUST: Sucesso! Retornando {} containers.", containers.len()); // <--- LOG 5

    Ok(containers)
}