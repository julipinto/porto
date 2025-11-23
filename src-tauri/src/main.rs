#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use bollard::query_parameters::{ListContainersOptions, EventsOptions};
use bollard::Docker;
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use tauri::Emitter; // Removi o 'Manager' que não estava sendo usado explicitamente

// Comando para listar (usado na carga inicial)
#[tauri::command]
async fn list_containers() -> Result<Vec<bollard::models::ContainerSummary>, String> {
    let docker = Docker::connect_with_local_defaults()
        .map_err(|e| format!("Erro conexão: {}", e))?;

    // CORREÇÃO 1: Removemos o ::<String> que causava erro de generics
    let options = Some(ListContainersOptions {
        all: true,
        ..Default::default()
    });

    let containers = docker
        .list_containers(options)
        .await
        .map_err(|e| format!("Erro listagem: {}", e))?;

    Ok(containers)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // O handle precisa do trait Manager implicitamente, mas o objeto app já satisfaz
            let app_handle = app.handle().clone();

            tauri::async_runtime::spawn(async move {
                let docker = match Docker::connect_with_local_defaults() {
                    Ok(d) => d,
                    Err(e) => {
                        eprintln!("Falha ao conectar no Docker para eventos: {}", e);
                        return;
                    }
                };

                // CORREÇÃO 2: Tipagem explícita de String
                // O Rust exige que sejamos donos da string (String), não apenas referência (&str)
                let mut filters = HashMap::new();
                filters.insert(
                    "type".to_string(), 
                    vec!["container".to_string()]
                );
                filters.insert(
                    "event".to_string(), 
                    vec![
                        "start".to_string(), 
                        "stop".to_string(), 
                        "die".to_string(), 
                        "destroy".to_string(), 
                        "create".to_string(), 
                        "rename".to_string()
                    ]
                );

                let options = EventsOptions {
                    since: None,
                    until: None,
                    // CORREÇÃO 3: Envolvemos o HashMap em Some()
                    filters: Some(filters), 
                };

                let mut event_stream = docker.events(Some(options));

                while let Some(msg) = event_stream.next().await {
                    if let Ok(event) = msg {
                        println!("Evento Docker detectado: {:?}", event.action);
                        let _ = app_handle.emit("docker-event", ()); 
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![list_containers])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}