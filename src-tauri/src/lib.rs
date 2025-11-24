mod commands;
mod services;

// To open DevTools automatically in development mode
// #[cfg(debug_assertions)]
// use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();

            // 1. Inicia monitor de eventos
            services::docker::spawn_event_monitor(handle);

            // 2. To open DevTools automatically in development mode
            // #[cfg(debug_assertions)]
            // {
            //     if let Some(window) = app.get_webview_window("main") {
            //         window.open_devtools();
            //     }
            // }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::containers::list_containers,
            commands::containers::start_container,
            commands::containers::stop_container,
            commands::system::manage_docker,
            commands::system::is_docker_service_active
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
