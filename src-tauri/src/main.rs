#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod split_video;

use std::time::{SystemTime, UNIX_EPOCH};
use crate::split_video::split_file;

#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}

#[tauri::command]
fn split_file_name(file_names: Vec<String>, time_stamp: &str) -> () {
    split_file(file_names, time_stamp)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![on_button_clicked])
        .invoke_handler(tauri::generate_handler![split_file_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

