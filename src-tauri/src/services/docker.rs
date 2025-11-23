use bollard::query_parameters::EventsOptions;
use bollard::Docker;
use futures_util::stream::StreamExt;
use std::collections::HashMap;
use tauri::{AppHandle, Emitter};

// Utilitário: Conecta ao Docker ou retorna erro formatado
pub fn connect() -> Result<Docker, String> {
    Docker::connect_with_local_defaults().map_err(|e| format!("Falha na conexão Docker: {}", e))
}

// Utilitário: Inicia o monitoramento de eventos em background
pub fn spawn_event_monitor(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        // Tenta conectar. Se falhar, encerra a thread silenciosamente (ou loga erro)
        let docker = match connect() {
            Ok(d) => d,
            Err(e) => {
                eprintln!("Monitor de Eventos falhou ao iniciar: {}", e);
                return;
            }
        };

        // Filtros (igual fizemos antes)
        let mut filters = HashMap::new();
        filters.insert("type".to_string(), vec!["container".to_string()]);
        filters.insert(
            "event".to_string(),
            vec![
                "start".to_string(), "stop".to_string(), "die".to_string(),
                "destroy".to_string(), "create".to_string(), "rename".to_string(),
            ],
        );

        let options = EventsOptions {
            since: None,
            until: None,
            filters: Some(filters),
        };

        let mut event_stream = docker.events(Some(options));

        // Loop Infinito
        while let Some(msg) = event_stream.next().await {
            if let Ok(event) = msg {
                println!("Rust -> Evento Docker: {:?}", event.action);
                // Emite para o frontend
                let _ = app.emit("docker-event", ());
            }
        }
    });
}