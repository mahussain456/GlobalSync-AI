// GlobalSync World Clock — native shell (Tauri).
// One frameless, transparent widget window + a tray / menu-bar icon.
// The UI in ../src is plain HTML/JS; it talks to this file through the commands below.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    path::PathBuf,
    sync::{
        atomic::{AtomicU64, Ordering::SeqCst},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tauri::{
    image::Image,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, LogicalSize, Manager, PhysicalPosition, WebviewWindow, WindowEvent,
};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use tauri_plugin_opener::OpenerExt;

const SITE: &str = "https://www.globalsync-ai.com";
const WIDTH: f64 = 384.0; // default window width (logical px) before the UI reports its real size
const PAD: f64 = 22.0; // transparent margin around the card so its CSS shadow isn't clipped
const SNAP: f64 = 18.0; // snap to a screen edge when the card lands this close to it

// Position is stored in physical pixels: logical units differ per monitor when screens use
// different scaling (e.g. a 200% laptop panel next to a 100% external display).
#[derive(Default, Serialize, Deserialize, Clone)]
struct Prefs {
    px: Option<i32>,
    py: Option<i32>,
    always_on_top: bool,
}

struct AppState {
    prefs: Mutex<Prefs>,
    file: PathBuf,
    move_gen: Arc<AtomicU64>,
}

fn save_prefs(state: &AppState) {
    if let Ok(p) = state.prefs.lock() {
        if let Some(dir) = state.file.parent() {
            let _ = fs::create_dir_all(dir);
        }
        let _ = fs::write(&state.file, serde_json::to_string_pretty(&*p).unwrap_or_default());
    }
}

fn main_window(app: &AppHandle) -> Option<WebviewWindow> {
    app.get_webview_window("main")
}

fn toggle(app: &AppHandle, force_show: bool) {
    if let Some(w) = main_window(app) {
        if force_show || !w.is_visible().unwrap_or(false) {
            let _ = w.show();
            let _ = w.set_focus();
        } else {
            let _ = w.hide();
        }
    }
}

/// WC_DEBUG=1: append diagnostics to %TEMP%/world-clock-debug.log
fn dbg(msg: String) {
    if std::env::var_os("WC_DEBUG").is_some() {
        use std::io::Write;
        if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(std::env::temp_dir().join("world-clock-debug.log")) {
            let _ = writeln!(f, "{msg}");
        }
    }
}

/// Put the widget where the user left it, or top-right of the primary screen.
fn place(w: &WebviewWindow, p: &Prefs) {
    for m in w.available_monitors().unwrap_or_default() {
        dbg(format!("monitor {:?} sf={} pos={:?} size={:?} work={:?}", m.name(), m.scale_factor(), m.position(), m.size(), m.work_area()));
    }
    dbg(format!("prefs px={:?} py={:?}", p.px, p.py));
    if let (Some(x), Some(y)) = (p.px, p.py) {
        // The card's top-left sits PAD inside the window; require it to land on some screen's work area.
        let visible = w.available_monitors().unwrap_or_default().iter().any(|m| {
            let (a, pad) = (m.work_area(), (PAD * m.scale_factor()) as i32);
            let (ax, ay, aw, ah) = (a.position.x, a.position.y, a.size.width as i32, a.size.height as i32);
            let (cx, cy) = (x + pad, y + pad);
            cx + 80 > ax && cx < ax + aw - 80 && cy + 20 > ay && cy < ay + ah - 60
        });
        if visible {
            let _ = w.set_position(PhysicalPosition::new(x, y));
            return;
        }
    }
    if let Ok(Some(m)) = w.primary_monitor() {
        let (sf, a) = (m.scale_factor(), m.work_area());
        let x = a.position.x + a.size.width as i32 - ((WIDTH - PAD + 8.0) * sf) as i32;
        let y = a.position.y + ((8.0 - PAD) * sf) as i32;
        let _ = w.set_position(PhysicalPosition::new(x, y));
        dbg(format!("default place {x},{y}"));
    }
}

/// After a move settles: snap the card (not the transparent margin) to nearby screen edges, then remember the spot.
fn snap_and_save(app: &AppHandle) {
    let Some(w) = main_window(app) else { return };
    let (Ok(pos), Ok(size), Ok(Some(mon))) = (w.outer_position(), w.outer_size(), w.current_monitor()) else { return };
    let (sf, a) = (mon.scale_factor(), mon.work_area());
    let (pad, snap, inset) = ((PAD * sf) as i32, (SNAP * sf) as i32, (8.0 * sf) as i32);
    let (ax, ay, aw, ah) = (a.position.x, a.position.y, a.size.width as i32, a.size.height as i32);
    let (ww, wh) = (size.width as i32, size.height as i32);
    let (mut x, mut y) = (pos.x, pos.y);

    let (left, right) = (x + pad - ax, ax + aw - (x + ww - pad));
    let (top, bottom) = (y + pad - ay, ay + ah - (y + wh - pad));
    if left.abs() < snap { x = ax - pad + inset } else if right.abs() < snap { x = ax + aw - ww + pad - inset }
    if top.abs() < snap { y = ay - pad + inset } else if bottom.abs() < snap { y = ay + ah - wh + pad - inset }
    if (x, y) != (pos.x, pos.y) {
        let _ = w.set_position(PhysicalPosition::new(x, y));
    }

    dbg(format!("snap {:?} -> {x},{y} (work {:?})", pos, a));
    let state = app.state::<AppState>();
    if let Ok(mut p) = state.prefs.lock() {
        p.px = Some(x);
        p.py = Some(y);
    }
    save_prefs(&state);
}

// ---------------- commands called by the UI ----------------

/// The UI reports its card size; the window hugs it (plus shadow margin) and never falls off the bottom of the screen.
#[tauri::command]
fn fit(window: WebviewWindow, width: f64, height: f64) {
    let w = width.ceil() + PAD * 2.0;
    let mut h = height.ceil() + PAD * 2.0;
    if let (Ok(Some(mon)), Ok(pos)) = (window.current_monitor(), window.outer_position()) {
        let (sf, a) = (mon.scale_factor(), mon.work_area());
        let (top, bottom) = (a.position.y, a.position.y + a.size.height as i32);
        let hp = ((h * sf) as i32).min(bottom - top);
        h = hp as f64 / sf;
        if pos.y + hp > bottom {
            let _ = window.set_position(PhysicalPosition::new(pos.x, (bottom - hp).max(top)));
        }
    }
    let _ = window.set_size(LogicalSize::new(w, h));
    dbg(format!("fit {width}x{height} -> {w}x{h}; outer {:?} {:?}", window.outer_position(), window.outer_size()));
}

/// First paint is ready: show the window (it starts hidden so it never flashes at the wrong size).
#[tauri::command]
fn ready(window: WebviewWindow) {
    let _ = window.show();
}

/// Grab-anywhere dragging: hand the move to the OS so it's smooth on Windows and macOS.
#[tauri::command]
fn drag(window: WebviewWindow) {
    let _ = window.start_dragging();
}

#[tauri::command]
fn hide(window: WebviewWindow) {
    let _ = window.hide();
}

#[tauri::command]
fn get_os(app: AppHandle) -> serde_json::Value {
    let on_top = app.state::<AppState>().prefs.lock().map(|p| p.always_on_top).unwrap_or(false);
    serde_json::json!({
        "alwaysOnTop": on_top,
        "openAtLogin": app.autolaunch().is_enabled().unwrap_or(false),
        "platform": std::env::consts::OS,
    })
}

#[tauri::command]
fn set_os(app: AppHandle, window: WebviewWindow, always_on_top: Option<bool>, open_at_login: Option<bool>) {
    if let Some(v) = always_on_top {
        let _ = window.set_always_on_top(v);
        let state = app.state::<AppState>();
        if let Ok(mut p) = state.prefs.lock() {
            p.always_on_top = v;
        }
        save_prefs(&state);
    }
    if let Some(v) = open_at_login {
        let al = app.autolaunch();
        let _ = if v { al.enable() } else { al.disable() };
    }
}

/// Only ever opens pages on globalsync-ai.com.
#[tauri::command]
fn open_site(app: AppHandle, path: String) {
    let safe = path.starts_with('/') && path.chars().all(|c| c.is_ascii_alphanumeric() || "-_/?=&.".contains(c));
    let url = format!("{SITE}{}", if safe { path.as_str() } else { "/" });
    let _ = app.opener().open_url(url, None::<&str>);
}

// ---------------- app ----------------

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| toggle(app, true)))
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        toggle(app, false);
                    }
                })
                .build(),
        )
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory); // menu-bar app, no Dock icon

            let file = app.path().app_config_dir()?.join("window.json");
            let prefs: Prefs = fs::read_to_string(&file).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default();
            app.manage(AppState { prefs: Mutex::new(prefs.clone()), file, move_gen: Arc::new(AtomicU64::new(0)) });

            let win = app.get_webview_window("main").expect("main window");
            let _ = win.set_always_on_top(prefs.always_on_top);
            place(&win, &prefs);
            // Safety net: if the UI never reports ready (e.g. a script error), still show the window.
            let w2 = win.clone();
            thread::spawn(move || {
                thread::sleep(Duration::from_millis(2500));
                let _ = w2.show();
            });

            // Tray / menu-bar icon
            let item = |id: &str, label: &str| MenuItem::with_id(app, id, label, true, None::<&str>);
            let menu = Menu::with_items(
                app,
                &[
                    &item("toggle", "Show / hide widget")?,
                    &item("add", "Add a city…")?,
                    &item("settings", "Settings…")?,
                    &PredefinedMenuItem::separator(app)?,
                    &item("reset", "Reset position")?,
                    &PredefinedMenuItem::separator(app)?,
                    &item("site", "Free meeting planner — globalsync-ai.com")?,
                    &item("quit", "Quit GlobalSync World Clock")?,
                ],
            )?;
            #[cfg(target_os = "macos")]
            let tray_png: &[u8] = include_bytes!("../../assets/trayTemplate@2x.png");
            #[cfg(not(target_os = "macos"))]
            let tray_png: &[u8] = include_bytes!("../../assets/tray-win.png");

            TrayIconBuilder::with_id("main")
                .icon(Image::from_bytes(tray_png)?)
                .icon_as_template(cfg!(target_os = "macos"))
                .tooltip("GlobalSync World Clock")
                .menu(&menu)
                .show_menu_on_left_click(cfg!(target_os = "macos"))
                .on_menu_event(|app, e| match e.id.as_ref() {
                    "toggle" => toggle(app, false),
                    id @ ("add" | "settings") => {
                        toggle(app, true);
                        let _ = app.emit_to("main", "ui:open", id);
                    }
                    "reset" => {
                        if let Some(w) = main_window(app) {
                            place(&w, &Prefs::default());
                            toggle(app, true);
                        }
                    }
                    "site" => open_site(app.clone(), "/?ref=world-clock-tray".into()),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, e| {
                    if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = e {
                        if !cfg!(target_os = "macos") {
                            toggle(tray.app_handle(), false);
                        }
                    }
                })
                .build(app)?;

            // Global hotkey: Ctrl+Alt+Shift+W (⌘⌥⇧W on Mac)
            let mods = if cfg!(target_os = "macos") { Modifiers::SUPER } else { Modifiers::CONTROL } | Modifiers::ALT | Modifiers::SHIFT;
            let _ = app.global_shortcut().register(Shortcut::new(Some(mods), Code::KeyW));
            Ok(())
        })
        .on_window_event(|window, event| {
            // Moves arrive in a stream while dragging; act once they've been quiet for 350 ms.
            if let WindowEvent::Moved(_) = event {
                let app = window.app_handle().clone();
                let counter = app.state::<AppState>().move_gen.clone();
                let gen = counter.fetch_add(1, SeqCst) + 1;
                thread::spawn(move || {
                    thread::sleep(Duration::from_millis(350));
                    if counter.load(SeqCst) == gen {
                        let a = app.clone();
                        let _ = app.run_on_main_thread(move || snap_and_save(&a));
                    }
                });
            }
        })
        .invoke_handler(tauri::generate_handler![fit, ready, drag, hide, get_os, set_os, open_site])
        .run(tauri::generate_context!())
        .expect("error while running GlobalSync World Clock");
}
