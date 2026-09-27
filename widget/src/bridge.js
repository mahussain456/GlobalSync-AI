// Connects the widget UI to the native Tauri shell (src-tauri/src/main.rs).
// Provides window.desk; without Tauri (plain browser), app.js falls back to its own dev shim.
(() => {
  const T = window.__TAURI__;
  if (!T) return;
  const { invoke } = T.core;
  const KEY = 'gs-world-clock', KEY_OS = 'gs-world-clock-os';
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
  const setOpacity = o => { const c = document.getElementById('card'); if (c) c.style.opacity = String(Math.max(0.4, Math.min(1, o))); };
  let shown = false;

  window.desk = {
    async load() {
      const os = await invoke('get_os');
      const opacity = (get(KEY_OS) || {}).opacity ?? 1;
      setOpacity(opacity);
      return { ...(get(KEY) || {}), ...os, opacity, platform: os.platform === 'macos' ? 'darwin' : os.platform };
    },
    save: data => put(KEY, data),
    setOS(patch) {
      if ('opacity' in patch) { put(KEY_OS, { ...(get(KEY_OS) || {}), opacity: patch.opacity }); setOpacity(patch.opacity); }
      const native = {};
      if ('alwaysOnTop' in patch) native.alwaysOnTop = !!patch.alwaysOnTop;
      if ('openAtLogin' in patch) native.openAtLogin = !!patch.openAtLogin;
      if (Object.keys(native).length) invoke('set_os', native);
    },
    hide: () => invoke('hide'),
    fit: (width, height) => invoke('fit', { width, height }).then(() => { if (!shown) { shown = true; invoke('ready'); } }),
    dragStart: () => invoke('drag'),
    dragEnd() {},
    openSite: path => invoke('open_site', { path }),
    on(channel, fn) {
      if (channel === 'ui:open' || channel === 'settings:changed') T.event.listen(channel, e => fn(e.payload));
    },
  };
})();
