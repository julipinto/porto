mod commands;
mod services;

use crate::services::monitor::SystemMonitor;

// To open DevTools automatically in development mode
// #[cfg(debug_assertions)]
// use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(SystemMonitor::new())
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
            commands::containers::remove_container,
            commands::containers::inspect_container,
            commands::containers::manage_container_group,
            commands::system::manage_docker,
            commands::system::is_docker_service_active,
            commands::images::list_images,
            commands::images::remove_image,
            commands::volumes::list_volumes,
            commands::volumes::remove_volume,
            commands::container_logs::stream_container_logs,
            commands::container_stats::stream_container_stats,
            commands::monitor::get_host_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
