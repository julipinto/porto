#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Chama a função run() que está na lib.rs
    // O nome do pacote no Cargo.toml define o nome do crate (ex: tauri_app)
    // Se o nome do seu projeto no Cargo.toml for "tauri-app", o Rust converte para "tauri_app" (snake_case)
    tauri_app_lib::run();
}