// GlobalSync World Clock — page script. Idle until you select text; renders inside a closed shadow root
// so it can't be restyled by (or restyle) the page. Makes no network requests.
(() => {
  'use strict';
  if (window.__gsWorldClock || !globalThis.TL) return;
  window.__gsWorldClock = true;
  const TL = globalThis.TL;
  const api = globalThis.chrome?.storage ? globalThis.chrome : null;   // null when previewed outside the extension
  const HOST = location.hostname;
  let prefs = TL.defaults(), miniPos = null;

  // ---------- styles ----------
  const CSS = `
  :host { all: initial; }
  * { box-sizing: border-box; margin: 0; padding: 0; font: inherit; color: inherit; }
  .ui { font: 12.5px/1.35 "DM Sans", "Segoe UI", system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased;
        --bg: #0E2A1F; --ink: #F4EFE6; --muted: #A7BFAE; --line: rgba(167,191,174,.18); --gold: #C8A96A; --gold-hi: #E3C68B; --btn: rgba(244,239,230,.08); }
  .ui.paper { --bg: #FFFCF7; --ink: #0E2A1F; --muted: #526659; --line: #D8DDD3; --gold: #9C7A36; --gold-hi: #1B4D3E; --btn: #EEF0EA; }
  button { cursor: pointer; background: none; border: 0; }
  .pill { position: fixed; width: 24px; height: 24px; border-radius: 50%; background: var(--bg); box-shadow: 0 0 0 2px var(--gold), 0 6px 16px rgba(0,0,0,.28);
          display: grid; place-items: center; color: var(--gold-hi); animation: pop .16s ease-out; }
  .pill:hover { transform: scale(1.08); }
  .pill svg { width: 14px; height: 14px; }
  .card { position: fixed; width: 272px; background: var(--bg); color: var(--ink); border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,.28), 0 0 0 1px var(--line);
          animation: pop .14s ease-out; overflow: hidden; }
  .hd { display: flex; align-items: center; gap: 7px; padding: 9px 8px 8px 12px; cursor: grab; user-select: none; border-bottom: 1px solid var(--line); }
  .hd:active { cursor: grabbing; }
  .hd svg { width: 14px; height: 14px; color: var(--gold-hi); flex: none; }
  .hd b { font: italic 500 14.5px/1.2 "Playfair Display", Georgia, serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hd .z { color: var(--gold-hi); font-weight: 600; font-size: 11.5px; white-space: nowrap; }
  .hd .sp { flex: 1; }
  .ic { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; color: var(--muted); font-size: 15px; line-height: 1; }
  .ic:hover { background: var(--btn); color: var(--ink); }
  .rows { padding: 3px 12px; }
  .r { display: grid; grid-template-columns: 8px 1fr auto 30px; gap: 8px; align-items: center; padding: 5px 0; }
  .r + .r { border-top: 1px solid var(--line); }
  .dot { width: 7px; height: 7px; border-radius: 50%; }
  .work { background: #7fcf9f; } .edge { background: #d9b56f; } .sleep { background: #8ea3c4; } .weekend { background: #a7bfae; }
  .c { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .c.home { font-weight: 600; }
  .t { font-variant-numeric: tabular-nums; font-weight: 600; font-size: 13.5px; text-align: right; } .t small { font-size: 10px; font-weight: 500; color: var(--muted); margin-left: 2px; }
  .d { color: var(--muted); font-size: 11px; text-align: right; }
  .ft { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 8px 8px 12px; border-top: 1px solid var(--line); }
  .fit { color: var(--muted); font-size: 11.5px; }
  .copy { font-size: 11.5px; font-weight: 600; padding: 5px 10px; border-radius: 999px; background: var(--gold); color: #0E2A1F; }
  .paper .copy { color: #FFFCF7; background: #0E2A1F; }
  .note { padding: 10px 12px; color: var(--muted); font-size: 12px; }
  .mini { position: fixed; display: flex; align-items: center; gap: 2px; padding: 3px 4px 3px 8px; border-radius: 999px; background: var(--bg); color: var(--ink);
          box-shadow: 0 6px 18px rgba(0,0,0,.22), 0 0 0 1px var(--line); opacity: .55; transition: opacity .18s; cursor: grab; user-select: none; touch-action: none; }
  .mini:hover, .mini.drag { opacity: 1; }
  .mini .ch { display: flex; align-items: center; gap: 5px; padding: 2px 6px; font-variant-numeric: tabular-nums; font-size: 12px; white-space: nowrap; }
  .mini .ch b { font-size: 10px; letter-spacing: .06em; color: var(--muted); font-weight: 600; }
  .mini .x { width: 18px; height: 18px; font-size: 13px; opacity: 0; }
  .mini:hover .x { opacity: 1; }
  @keyframes pop { from { opacity: 0; transform: translateY(3px) scale(.98); } }
  @media (prefers-reduced-motion: reduce) { .pill, .card { animation: none; } .mini { transition: none; } }`;

  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';

  // ---------- root ----------
  let root, shadow, ui, pill, card, mini;
  function ensureRoot() {
    if (root?.isConnected) return;
    root = document.createElement('gs-world-clock');
    root.style.cssText = 'all:initial;position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;';
    shadow = root.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `<style>${CSS}</style><div class="ui"></div>`;
    ui = shadow.querySelector('.ui');
    applyTheme();
    document.documentElement.appendChild(root);
  }
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() { if (ui) ui.classList.toggle('paper', prefs.theme === 'paper' || (prefs.theme === 'auto' && !darkMQ.matches)); }
  const disabled = () => (prefs.disabledSites || []).includes(HOST);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const inUI = e => root && e.composedPath && e.composedPath().includes(root);
  const clampX = (x, w) => Math.max(8, Math.min(innerWidth - w - 8, x));
  const clampY = (y, h) => Math.max(8, Math.min(innerHeight - h - 8, y));

  // ---------- selection → pill → card ----------
  let lastText = '', lastRect = null, parsed = null, timer;
  function selectionRect(sel) {
    try { const r = sel.getRangeAt(0).getBoundingClientRect(); if (r.width || r.height) return r; } catch { /* no range */ }
    return null;
  }
  function onSelect(e) {
    if (inUI(e)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (prefs.lens === 'off' || disabled()) return;
      const sel = getSelection(), text = (sel?.toString() || '').trim().replace(/\s+/g, ' ');
      if (!text || text.length > 120) return hidePill();
      const r = TL.parse(text, { now: Date.now() });
      if (!r) return hidePill();
      lastText = text; parsed = r;
      lastRect = selectionRect(sel) || (e.clientX != null ? { left: e.clientX, right: e.clientX, top: e.clientY, bottom: e.clientY, height: 0 } : null);
      if (!lastRect) return;
      prefs.lens === 'auto' ? showCard(parsed, lastRect) : showPill(lastRect);
    }, 110);
  }
  function showPill(rect) {
    ensureRoot(); hidePill();
    pill = document.createElement('button');
    pill.className = 'pill'; pill.title = 'Convert with World Clock'; pill.setAttribute('aria-label', 'Convert this time with World Clock');
    pill.innerHTML = ICON;
    // Float just above the end of the selection so it never covers the text being read.
    pill.style.left = clampX(rect.right - 10, 24) + 'px';
    pill.style.top = (rect.top - 30 >= 8 ? rect.top - 30 : clampY(rect.bottom + 6, 24)) + 'px';
    pill.addEventListener('mousedown', e => e.preventDefault());       // keep the page selection
    pill.addEventListener('click', () => { hidePill(); showCard(parsed, rect); });
    ui.appendChild(pill);
  }
  const hidePill = () => { pill?.remove(); pill = null; };

  let dragged = false;
  function showCard(r, rect, note) {
    ensureRoot(); hidePill(); closeCard();
    card = document.createElement('div');
    card.className = 'card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'World Clock');
    if (!r) {
      card.innerHTML = `<div class="hd"><span>${ICON}</span><b>World Clock</b><span class="sp"></span><button class="ic close" aria-label="Close">×</button></div>
        <div class="note">${esc(note || 'No time found.')} Try something like “3pm EST” or “15:00 London”.</div>`;
    } else {
      const rows = TL.rowsAt(r.at, prefs), k = TL.clock(r.h, r.m, prefs.hour12);
      const n = rows.filter(x => x.status.k === 'work').length;
      card.innerHTML = `<div class="hd" title="Drag to move"><span>${ICON}</span><b>${TL.DAYS[r.dow]} ${k.t}${k.ap ? ' ' + k.ap : ''}</b><span class="z">${esc(r.zoneLabel)}</span><span class="sp"></span><button class="ic close" aria-label="Close">×</button></div>
        <div class="rows">${rows.map(x => `<div class="r" title="${esc(x.status.label)}"><i class="dot ${x.status.k}"></i><span class="c${x.home ? ' home' : ''}">${esc(x.city.name)}</span><span class="t">${x.time}${x.ap ? `<small>${x.ap}</small>` : ''}</span><span class="d">${x.day}</span></div>`).join('')}</div>
        <div class="ft"><span class="fit">${n} of ${rows.length} in work hours</span><button class="copy">Copy</button></div>`;
      card.querySelector('.copy').addEventListener('click', e => copy(TL.copyText(r.at, prefs, `${lastText}`), e.currentTarget));
    }
    card.querySelector('.close').addEventListener('click', closeCard);
    ui.appendChild(card);
    const w = card.offsetWidth, h = card.offsetHeight;
    const below = rect.bottom + 8, above = rect.top - h - 8;
    card.style.left = clampX(rect.left, w) + 'px';
    card.style.top = (below + h < innerHeight - 8 || above < 8 ? clampY(below, h) : above) + 'px';
    dragged = false;
    makeDraggable(card, card.querySelector('.hd'), () => { dragged = true; });
  }
  const closeCard = () => { card?.remove(); card = null; };

  function copy(text, btn) {
    const done = () => { btn.textContent = 'Copied'; setTimeout(() => { if (btn.isConnected) btn.textContent = 'Copy'; }, 1400); };
    navigator.clipboard?.writeText(text).then(done, () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done();
    });
  }

  function makeDraggable(el, handle, onMove, onDrop) {
    handle.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
      let moved = false;
      handle.setPointerCapture(e.pointerId); el.classList.add('drag');
      const move = ev => {
        if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 3) return;
        moved = true;
        el.style.left = clampX(ev.clientX - dx, r.width) + 'px'; el.style.top = clampY(ev.clientY - dy, r.height) + 'px';
        el.style.right = el.style.bottom = 'auto';
        onMove?.();
      };
      const up = () => { handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); el.classList.remove('drag'); if (moved) onDrop?.(); el.__moved = moved; };
      handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up);
    });
  }

  // Dismiss quietly: outside click, Esc, or scrolling away (unless the card was moved by hand).
  document.addEventListener('mouseup', onSelect, true);
  document.addEventListener('keyup', e => { if (e.key === 'Escape') { hidePill(); closeCard(); } else if (e.shiftKey) onSelect(e); }, true);
  document.addEventListener('mousedown', e => { if (!inUI(e)) { hidePill(); closeCard(); } }, true);
  addEventListener('scroll', () => { hidePill(); if (!dragged) closeCard(); }, { passive: true, capture: true });

  // ---------- floating mini clock (opt-in) ----------
  let tick;
  function renderMini() {
    const want = prefs.mini && !disabled() && !document.fullscreenElement;
    if (!want) { mini?.remove(); mini = null; clearTimeout(tick); return; }
    ensureRoot(); applyTheme();
    if (!mini) {
      mini = document.createElement('div');
      mini.className = 'mini'; mini.title = 'World Clock · drag to move · click for details';
      ui.appendChild(mini);
      makeDraggable(mini, mini, null, () => {
        const r = mini.getBoundingClientRect();
        miniPos = { rx: (innerWidth - r.right) / innerWidth, by: (innerHeight - r.bottom) / innerHeight };
        api?.storage.local.set({ miniPos });
      });
      mini.addEventListener('click', e => {
        if (mini.__moved || e.target.closest('.x')) return;
        const r = mini.getBoundingClientRect(), now = Date.now(), L = TL.local(TL.byName(prefs.home)?.tz || 'UTC', now);
        showCard({ at: now, h: L.h, m: L.m, dow: L.dow, zoneLabel: 'now' }, r);   // opens above the strip when there's no room below
      });
    }
    const rows = TL.rowsAt(Date.now(), prefs);
    mini.innerHTML = rows.map(x => `<span class="ch" title="${esc(x.city.name)} · ${esc(x.status.label)}"><i class="dot ${x.status.k}"></i><b>${esc(x.city.code)}</b>${x.time}${prefs.hour12 ? `<small style="font-size:9px;opacity:.7">${x.ap[0]}</small>` : ''}</span>`).join('') +
      `<button class="ic x" aria-label="Hide mini clock" title="Hide (turn back on from the toolbar)">×</button>`;
    mini.querySelector('.x').addEventListener('click', () => api ? api.storage.sync.set({ mini: false }) : (prefs.mini = false, renderMini()));
    const w = mini.offsetWidth, h = mini.offsetHeight, p = miniPos || { rx: 0, by: 0 };
    if (!mini.classList.contains('drag')) {
      mini.style.left = clampX(innerWidth - w - Math.round(p.rx * innerWidth) - (miniPos ? 0 : 16), w) + 'px';
      mini.style.top = clampY(innerHeight - h - Math.round(p.by * innerHeight) - (miniPos ? 0 : 16), h) + 'px';
    }
    clearTimeout(tick);
    tick = setTimeout(renderMini, 60000 - (Date.now() % 60000) + 50);
  }
  document.addEventListener('fullscreenchange', renderMini);
  addEventListener('resize', () => mini && renderMini());

  // ---------- messages from the right-click menu ----------
  api?.runtime.onMessage.addListener(msg => {
    if (msg?.type !== 'lens') return;
    const sel = getSelection(), rect = (sel && selectionRect(sel)) || { left: innerWidth / 2 - 136, right: innerWidth / 2, top: 60, bottom: 60, height: 0 };
    lastText = msg.text || '';
    const r = TL.parse(lastText, { now: Date.now(), fallbackTz: TL.byName(prefs.home)?.tz });
    showCard(r, rect, r ? '' : `No time found in “${lastText.slice(0, 40)}”.`);
  });

  // ---------- settings ----------
  function start(sync, local) {
    prefs = { ...TL.defaults(), ...sync }; miniPos = local?.miniPos || null;
    applyTheme(); renderMini();
  }
  if (api) {
    api.storage.sync.get(null, s => api.storage.local.get('miniPos', l => start(s, l)));
    api.storage.onChanged.addListener((ch, area) => {
      if (area !== 'sync') return;
      for (const k in ch) prefs[k] = ch[k].newValue;
      applyTheme(); renderMini();
      if (prefs.lens === 'off' || disabled()) { hidePill(); }
    });
  } else start(window.__gsPreviewPrefs || {}, {});
  darkMQ.addEventListener?.('change', applyTheme);
})();
