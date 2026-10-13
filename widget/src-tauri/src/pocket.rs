use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, sync::Mutex, time::{SystemTime, UNIX_EPOCH}};
use tauri::{AppHandle, Emitter, Manager};

#[derive(Clone, Default, Serialize, Deserialize)]
pub struct Lap { total: u64, split: u64 }

#[derive(Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Pocket {
    pub base: u64,
    pub since: u64,
    pub running: bool,
    pub enabled: bool,
    pub mode: String,
    pub theme: String,
    pub laps: Vec<Lap>,
}
impl Default for Pocket {
    fn default() -> Self {
        Self { base: 0, since: 0, running: false, enabled: false, mode: "docked".into(), theme: "forest".into(), laps: vec![] }
    }
}
impl Pocket {
    fn elapsed(&self, now: u64) -> u64 { self.base.saturating_add(if self.running { now.saturating_sub(self.since) } else { 0 }) }
    fn apply(&mut self, action: &str, value: Option<&str>, now: u64) -> Result<(), String> {
        match action {
            "get" => {},
            "toggle" if self.enabled => {
                if self.running { self.base = self.elapsed(now); self.running = false; }
                else { self.since = now; self.running = true; }
            },
            "reset" if !self.running => { self.base = 0; self.since = 0; self.laps.clear(); },
            "lap" if self.running && self.enabled => {
                if self.laps.len() >= 500 { return Err("500 laps reached. Pause and reset to start a new session.".into()); }
                let total = self.elapsed(now);
                let split = total.saturating_sub(self.laps.first().map(|l| l.total).unwrap_or(0));
                self.laps.insert(0, Lap { total, split });
            },
            "mode" => match value {
                Some("docked") | Some("detached") => { self.mode = value.unwrap().into(); },
                _ => return Err("Invalid stopwatch mode".into()),
            },
            "remove" => { self.base = self.elapsed(now); self.running = false; self.enabled = false; },
            "add" => { self.enabled = true; self.mode = "docked".into(); },
            "theme" => match value {
                Some("forest") | Some("paper") => self.theme = value.unwrap().into(),
                _ => return Err("Invalid theme".into()),
            },
            _ => return Err("Action unavailable in the current stopwatch state".into()),
        }
        Ok(())
    }
}
pub struct PocketStore { pub state: Mutex<Pocket>, file: PathBuf }
impl PocketStore {
    pub fn load(file: PathBuf) -> Self {
        let mut state: Pocket = fs::read_to_string(&file).ok().and_then(|s| serde_json::from_str(&s).ok()).unwrap_or_default();
        if state.mode != "detached" { state.mode = "docked".into(); }
        if state.theme != "paper" { state.theme = "forest".into(); }
        Self { state: Mutex::new(state), file }
    }
}
pub fn should_show(app: &AppHandle) -> bool {
    app.state::<PocketStore>().state.lock().map(|s| s.enabled && s.mode == "detached").unwrap_or(false)
}

#[tauri::command]
pub fn pocket_action(app: AppHandle, action: String, value: Option<String>) -> Result<Pocket, String> {
    let store = app.state::<PocketStore>();
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis() as u64;
    let mut guard = store.state.lock().map_err(|_| "Stopwatch state unavailable")?;
    let mut next = guard.clone();
    next.apply(&action, value.as_deref(), now)?;
    if action != "get" {
        if let Some(dir) = store.file.parent() { fs::create_dir_all(dir).map_err(|e| e.to_string())?; }
        fs::write(&store.file, serde_json::to_vec(&next).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    }
    *guard = next.clone();
    drop(guard);
    if action != "get" {
        app.emit("pocket:state", &next).map_err(|e| e.to_string())?;
        if let Some(w) = app.get_webview_window("pocket") {
            if next.enabled && next.mode == "detached" {
                if matches!(action.as_str(), "mode" | "toggle") { let _ = w.show(); }
            } else { let _ = w.hide(); }
        }
        if action == "mode" && next.mode == "docked" {
            if let Some(w) = app.get_webview_window("main") { let _ = w.show(); }
        }
    }
    Ok(next)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn detach_preserves_running_time_and_lap_splits() {
        let mut s = Pocket::default();
        s.apply("add", None, 100).unwrap(); s.apply("toggle", None, 100).unwrap();
        s.apply("lap", None, 600).unwrap();
        s.apply("mode", Some("detached"), 800).unwrap();
        s.apply("lap", None, 1100).unwrap();
        assert_eq!(s.laps[0].split, 500); assert_eq!(s.laps[0].total, 1000);
        s.apply("mode", Some("docked"), 1200).unwrap(); s.apply("toggle", None, 1400).unwrap();
        assert_eq!(s.base, 1300); assert!(!s.running);
    }
    #[test]
    fn remove_pauses_and_readd_preserves_session() {
        let mut s = Pocket::default(); s.apply("add", None, 0).unwrap(); s.apply("toggle", None, 100).unwrap();
        s.apply("remove", None, 900).unwrap(); assert_eq!(s.base, 800); assert!(!s.enabled);
        s.apply("add", None, 1200).unwrap(); assert_eq!(s.elapsed(1500), 800);
        s.apply("toggle", None, 1600).unwrap(); assert_eq!(s.elapsed(2000), 1200);
        assert!(s.apply("reset", None, 2000).is_err());
    }
    #[test]
    fn persisted_running_state_restores_elapsed_time() {
        let mut s = Pocket::default(); s.apply("add", None, 0).unwrap(); s.apply("toggle", None, 100).unwrap();
        let restored: Pocket = serde_json::from_str(&serde_json::to_string(&s).unwrap()).unwrap();
        assert_eq!(restored.elapsed(2100), 2000);
        assert_eq!(restored.elapsed(50), 0);
    }
}
