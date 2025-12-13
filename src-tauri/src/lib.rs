mod commands;
mod services;

use crate::services::docker::DockerConfig;
use crate::services::monitor::SystemMonitor;
use crate::services::shell::ShellManager;

// To open DevTools automatically in development mode
// #[cfg(debug_assertions)]
// use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_opener::init())
    .manage(SystemMonitor::new())
    .manage(ShellManager::new())
    .manage(DockerConfig::new())
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
      // Container Commands
      commands::containers::list_containers,
      commands::containers::start_container,
      commands::containers::stop_container,
      commands::containers::remove_container,
      commands::containers::inspect_container,
      commands::containers::manage_container_group,
      commands::containers::create_and_start_container,
      // System Commands
      services::docker::manager::manage_docker,
      services::docker::manager::is_docker_service_active,
      services::docker::manager::ping_docker,
      services::docker::manager::prune_system,
      services::docker::manager::get_active_config,
      services::docker::manager::connect_and_persist,
      // Image Commands
      commands::images::list_images,
      commands::images::remove_image,
      commands::images::pull_image,
      commands::images::inspect_image,
      commands::images::history_image,
      // Volume Commands
      commands::volumes::list_volumes,
      commands::volumes::remove_volume,
      commands::volumes::inspect_volume,
      // Log & Stats Commands
      commands::container_logs::stream_container_logs,
      commands::container_stats::stream_container_stats,
      // Monitoring Commands
      commands::monitor::get_host_stats,
      // Terminal Commands
      commands::terminal::open_terminal,
      commands::terminal::write_terminal,
      commands::terminal::resize_terminal,
      // Docker Context Commands
      commands::contexts::list_docker_contexts,
      commands::contexts::set_docker_context,
      // Network Commands
      commands::networks::list_networks,
      commands::networks::remove_network,
      commands::networks::inspect_network,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
