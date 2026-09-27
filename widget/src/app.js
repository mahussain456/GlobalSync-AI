// GlobalSync World Clock — widget UI.
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const card = $('#card'), list = $('#list');
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const STEP = 15;                          // scrubber snap, minutes
  const MAX_CITIES = 4;

  // Screenshot/demo mode — plain browser only, never inside the installed app:
  // index.html?demo&at=2026-04-14T16:24:00Z&theme=paper&density=compact&panel=add&q=lag&shift=180&cities=San Francisco,London&home=London
  const DEMO = !window.__TAURI__ && !window.desk && new URLSearchParams(location.search).has('demo') ? new URLSearchParams(location.search) : null;
  const clockSkew = DEMO && DEMO.get('at') ? Date.parse(DEMO.get('at')) - Date.now() : 0;
  const now = () => Date.now() + clockSkew;
  const MAX_SHIFT = 3 * 1440;               // plan up to 3 days ahead/behind

  // Countries whose working week isn't Mon–Fri (0 = Sun … 6 = Sat)
  const WEEKENDS = { 'Saudi Arabia': [5, 6], Qatar: [5, 6], Kuwait: [5, 6], Bahrain: [5, 6], Oman: [5, 6], Jordan: [5, 6],
    Iraq: [5, 6], Egypt: [5, 6], Israel: [5, 6], Iran: [5], Afghanistan: [5], Nepal: [6] };

  // ---------- OS bridge (Electron preload) or browser fallback for development ----------
  const desk = window.desk || {
    load: async () => { try { return JSON.parse(localStorage.getItem('gs-world-clock')) || {}; } catch { return {}; } },
    save: d => { try { localStorage.setItem('gs-world-clock', JSON.stringify(d)); } catch { /* private mode */ } },
    setOS() {}, hide() {}, fit() {}, on() {}, dragStart() {}, dragEnd() {},
    openSite: p => window.open('https://www.globalsync-ai.com' + p, '_blank', 'noopener'),
  };

  // ---------- catalog ----------
  const makeId = (name, tz) => `${name}|${tz}`;
  const CATALOG = window.CITY_CATALOG.map(([name, country, tz, code, landmark]) => ({ id: makeId(name, tz), name, country, tz, code, landmark }));
  const ZONES = (Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : []).filter(z => z.includes('/'));
  const cityFromZone = tz => {
    const name = tz.split('/').pop().replace(/_/g, ' ');
    return { id: makeId(name, tz), name, country: tz.split('/')[0].replace(/_/g, ' '), tz, code: name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() };
  };
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // ---------- state ----------
  let S;                                   // persisted app settings
  let OS = { alwaysOnTop: false, opacity: 1, openAtLogin: false, platform: 'web', hotkey: 'CommandOrControl+Alt+Shift+W' };
  let shift = 0;                           // time-travel offset in minutes
  let panel = null;                        // 'add' | 'settings' | null
  const knownRows = new Set();

  function defaults() {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const seg = local.split('/').pop().replace(/_/g, ' ');
    const here = CATALOG.find(c => c.tz === local && c.name === seg) || CATALOG.find(c => c.tz === local) || cityFromZone(local);
    const picks = [here];
    for (const n of ['New York', 'London', 'Dubai', 'Tokyo', 'San Francisco', 'Singapore']) {
      const c = CATALOG.find(x => x.name === n);
      if (picks.length < MAX_CITIES && !picks.some(p => p.tz === c.tz)) picks.push(c);
    }
    const hc = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle;
    return { version: 1, cities: picks.map(c => ({ ...c })), homeId: here.id, theme: 'forest', hour12: hc ? hc === 'h12' || hc === 'h11' : true,
      size: 'm', density: 'scenic', workStart: 9, workEnd: 18 };
  }
  const save = () => desk.save(S);
  const home = () => S.cities.find(c => c.id === S.homeId) || S.cities[0];

  // ---------- time math ----------
  const offFmt = new Map(), abbrFmt = new Map();
  // UTC offset (minutes) of a zone at an instant. Uses the 'longOffset' name where supported; older
  // WebKit (macOS Catalina/Big Sur) lacks it, so fall back to diffing the zone's wall-clock fields against UTC.
  function offsetMin(tz, d) {
    let f = offFmt.get(tz);
    if (!f) {
      try { f = { long: new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }) }; f.long.format(d); }
      catch { f = { parts: new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }; }
      offFmt.set(tz, f);
    }
    if (f.long) {
      const v = f.long.formatToParts(d).find(p => p.type === 'timeZoneName').value;
      const m = v.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
      return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +(m[3] || 0)) : 0;
    }
    const p = Object.fromEntries(f.parts.formatToParts(d).map(x => [x.type, x.value]));
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
    return Math.round((wall - Math.floor(d.getTime() / 6e4) * 6e4) / 6e4);
  }
  function abbr(tz, d) {
    let f = abbrFmt.get(tz);
    if (!f) abbrFmt.set(tz, f = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' }));
    const v = f.formatToParts(d).find(p => p.type === 'timeZoneName').value;
    return /^[A-Z]{2,5}$/.test(v) && v !== 'UTC' ? v : '';
  }
  const fmtOff = o => { if (!o) return 'UTC'; const a = Math.abs(o), h = Math.floor(a / 60), m = a % 60; return `UTC ${o < 0 ? '−' : '+'}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`; };
  const fmtDelta = d => { if (!d) return 'same time'; const a = Math.abs(d), h = Math.floor(a / 60), m = a % 60; return `${d < 0 ? '−' : '+'}${h ? h + 'h' : ''}${m ? (h ? ' ' : '') + m + 'm' : ''}`; };
  const roughDelta = d => { const a = Math.abs(d), days = Math.floor(a / 1440), h = Math.round((a % 1440) / 60);
    return `${days ? days + 'd ' : ''}${h || !days ? h + 'h' : ''}`.trim() + (d > 0 ? ' ahead' : ' back'); };
  const fmtDur = mins => { const h = Math.floor(mins / 60), m = Math.round(mins % 60); return h ? `${h}h${m ? ' ' + m + 'm' : ''}` : `${m}m`; };
  function fmtTime(h, m) {
    const mm = String(m).padStart(2, '0');
    return S.hour12 ? { t: `${h % 12 || 12}:${mm}`, ap: h < 12 ? 'AM' : 'PM' } : { t: `${String(h).padStart(2, '0')}:${mm}`, ap: '' };
  }

  function statusOf(c, hf, dow) {
    const ws = S.workStart, we = S.workEnd;
    const weekend = (WEEKENDS[c.country] || [0, 6]).includes(dow);
    if (hf < 7 || hf >= 22) return { k: 'sleep' };
    if (weekend) return { k: 'weekend' };
    if (hf >= ws && hf < we) return { k: 'work', left: (we - hf) * 60 };
    if (hf < ws) return { k: 'edge', before: (ws - hf) * 60 };
    return { k: 'edge', after: true };
  }

  function snapshot(at) {
    const h0 = home(); if (!h0) return [];
    const hOff = offsetMin(h0.tz, at);
    const H = new Date(at.getTime() + hOff * 6e4);
    const hDay = Date.UTC(H.getUTCFullYear(), H.getUTCMonth(), H.getUTCDate());
    return S.cities.map(c => {
      const off = offsetMin(c.tz, at), L = new Date(at.getTime() + off * 6e4);
      const h = L.getUTCHours(), m = L.getUTCMinutes(), hf = h + m / 60, dow = L.getUTCDay();
      const dd = Math.round((Date.UTC(L.getUTCFullYear(), L.getUTCMonth(), L.getUTCDate()) - hDay) / 864e5);
      return { c, off, h, m, hf, dow, dd, diff: off - hOff, isHome: c.id === h0.id, st: statusOf(c, hf, dow),
        date: `${DAYS[dow]}, ${MON[L.getUTCMonth()]} ${L.getUTCDate()}`, abbr: abbr(c.tz, at) };
    });
  }

  // ---------- small SVG icons ----------
  const ICON = {
    phone: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 3.2A8.8 8.8 0 1 0 20.8 14 7 7 0 1 1 14 3.2z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 4S9 3 5.5 9.5C3 14 5 19 5 19s1.8-4.8 7-7.5c-3.8 3.3-5.3 7-5.5 8.5 7.5.5 12-5 13.5-16z"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>',
    pen: '<svg viewBox="0 0 24 24" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    grip: '<svg viewBox="0 0 6 16" width="6" height="16" fill="currentColor"><circle cx="1.5" cy="3" r="1.2"/><circle cx="4.5" cy="3" r="1.2"/><circle cx="1.5" cy="8" r="1.2"/><circle cx="4.5" cy="8" r="1.2"/><circle cx="1.5" cy="13" r="1.2"/><circle cx="4.5" cy="13" r="1.2"/></svg>',
  };
  const SUN_G = '<circle r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M0-7.8v-2.4M0 7.8v2.4M-7.8 0h-2.4M7.8 0h2.4M5.5-5.5l1.7-1.7M-5.5 5.5l-1.7 1.7M5.5 5.5l1.7 1.7M-5.5-5.5l-1.7-1.7"/></g>';
  const MOON_G = '<path d="M2.4-6.6A6.8 6.8 0 1 0 6.6 3.2 5.4 5.4 0 1 1 2.4-6.6z" fill="currentColor"/>';
  const STATUS_COLOR = { work: '#7fcf9f', edge: '#d9b56f', sleep: '#8ea3c4', weekend: '#a7bfae' };

  function ring(x) {
    const R = 21, C = 2 * Math.PI * R, col = STATUS_COLOR[x.st.k];
    const day = x.hf >= 6 && x.hf < 18.5, paper = card.dataset.theme === 'paper';
    return `<svg width="52" height="52" viewBox="-26 -26 52 52">
      <circle r="${R}" fill="none" stroke="currentColor" stroke-opacity=".16" stroke-width="3"/>
      <circle r="${R}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(C * x.hf / 24).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/>
      <g style="color:${paper ? (day ? '#b8893a' : '#526659') : (day ? '#f1c96b' : '#c9d3e6')}">${day ? SUN_G : MOON_G}</g></svg>`;
  }

  function pill(x) {
    const s = x.st, you = x.isHome;
    if (s.k === 'work') return `<span class="pill work">${you ? ICON.clock : ICON.phone}${you ? (s.left <= 60 ? `Wrapping up · ${fmtDur(s.left)}` : 'Your work hours') : (s.left <= 60 ? `Ends in ${fmtDur(s.left)}` : 'Good time to call')}</span>`;
    if (s.k === 'edge') return `<span class="pill edge">${ICON.clock}${s.before ? `Starts in ${fmtDur(s.before)}` : 'After hours'}</span>`;
    if (s.k === 'weekend') return `<span class="pill weekend">${ICON.leaf}${you ? 'Your weekend' : 'Weekend'}</span>`;
    return `<span class="pill sleep">${ICON.moon}${you ? 'Your night' : 'Asleep'}</span>`;
  }

  // ---------- rows ----------
  function rowHTML(c) {
    return `<div class="row${knownRows.has(c.id) ? '' : ' new'}" data-id="${c.id}" role="listitem">
      <div class="scene"></div><div class="scrim"></div>
      <span class="grip" title="Drag to reorder">${ICON.grip}</span>
      <div class="info">
        <div class="name"><span class="star" hidden>${ICON.star}</span><span class="nm"></span></div>
        <div class="sub"></div>
        <div class="pw"></div>
      </div>
      <div class="clock tnum"><span class="t"></span><span class="ap"></span><div class="d"></div></div>
      <div class="ring"></div>
      <div class="tools">
        <button data-act="home" title="Make home base" aria-label="Make home base">${ICON.star}</button>
        <button data-act="rename" title="Add a name (e.g. a teammate)" aria-label="Rename">${ICON.pen}</button>
        <button data-act="remove" class="danger" title="Remove" aria-label="Remove">${ICON.x}</button>
      </div>
    </div>`;
  }

  function build() {
    list.innerHTML = S.cities.map(rowHTML).join('');
    list.querySelectorAll('.row.new').forEach(r => r.addEventListener('animationend', () => r.classList.remove('new'), { once: true }));
    S.cities.forEach(c => knownRows.add(c.id));
    $('#empty').hidden = S.cities.length > 0;
    $('#foot').hidden = S.cities.length === 0;
    update();
  }

  const sceneCache = new Map();
  function update() {
    const at = new Date(now() + shift * 6e4);
    const snap = snapshot(at);
    const h0 = snap.find(x => x.isHome);
    [...list.children].forEach((row, i) => {
      const x = snap[i]; if (!x) return;
      const { c } = x;
      row.classList.toggle('home', x.isHome);
      row.querySelector('.star').hidden = !x.isHome;
      row.querySelector('.nm').textContent = c.name;
      row.querySelector('.sub').innerHTML = `${c.label ? `<span class="who">${esc(c.label)}</span> · ` : `${esc(c.country)} · `}${x.abbr ? x.abbr + ' · ' : ''}${fmtOff(x.off)}`;
      row.querySelector('.pw').innerHTML = pill(x);
      const t = fmtTime(x.h, x.m);
      row.querySelector('.t').textContent = t.t;
      row.querySelector('.ap').textContent = t.ap;
      const rel = x.dd === 1 ? 'Tomorrow' : x.dd === -1 ? 'Yesterday' : '';
      row.querySelector('.d').innerHTML = `${rel ? `${DAYS[x.dow]} · <b>${rel}</b>` : x.date}${x.isHome ? '' : ` · ${fmtDelta(x.diff)}`}`;
      row.querySelector('.ring').innerHTML = ring(x);
      row.setAttribute('aria-label', `${c.name}: ${t.t} ${t.ap}, ${x.date}`);
      const svg = window.drawScene(c, x.hf, card.dataset.theme);
      if (sceneCache.get(c.id) !== svg) { row.querySelector('.scene').innerHTML = svg; sceneCache.set(c.id, svg); }
    });

    // header
    if (h0) {
      $('#today-date').textContent = h0.date;
      const st = $('#today-state');
      st.textContent = shift ? 'Planning' : 'Live';
      st.classList.toggle('planning', !!shift);
    }
    $('#tagline').innerHTML = shift ? `Previewing <em>${roughDelta(shift)}</em>` : `${S.cities.length} ${S.cities.length === 1 ? 'city' : 'cities'}. <em>No borders.</em>`;

    // footer: the plan bar only appears while previewing another time
    $('#plan').hidden = shift === 0;
    card.classList.toggle('previewing', shift !== 0);
    if (shift && h0) { const t = fmtTime(h0.h, h0.m); $('#plan-state').textContent = `Preview · ${DAYS[h0.dow]} ${t.t}${t.ap ? ' ' + t.ap : ''}`; }

    // timeline dots — merge identical times, lift labels that would collide
    const dots = snap.map(x => ({ x, pos: x.hf / 24 })).sort((a, b) => a.pos - b.pos);
    const merged = [];
    for (const d of dots) {
      const last = merged[merged.length - 1];
      if (last && Math.abs(last.pos - d.pos) < 0.004) { last.codes.push(d.x.c.code); last.home ||= d.x.isHome; }
      else merged.push({ pos: d.pos, codes: [d.x.c.code], home: d.x.isHome, k: d.x.st.k });
    }
    let lastLow = -1;
    $('#dots').innerHTML = merged.map(m => {
      const up = lastLow >= 0 && m.pos - lastLow < 0.11;
      if (!up) lastLow = m.pos;
      const col = STATUS_COLOR[m.k];
      return `<div class="dot${m.home ? ' home' : ''}${up ? ' up' : ''}" style="left:${(m.pos * 100).toFixed(2)}%;color:${col}"><i style="background:${col}"></i><b>${m.codes.slice(0, 2).join('·')}${m.codes.length > 2 ? '+' : ''}</b></div>`;
    }).join('');
    $('#scrub').setAttribute('aria-valuenow', shift);
    $('#scrub').setAttribute('aria-valuetext', shift ? `${fmtDelta(shift)} from now` : 'now');
  }
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // ---------- city actions ----------
  function addCity(c) {
    if (S.cities.some(x => x.id === c.id)) return;
    if (S.cities.length >= MAX_CITIES) { toast(`${MAX_CITIES} clocks max. Remove one first.`); return; }
    S.cities.push({ id: c.id, name: c.name, country: c.country, tz: c.tz, code: c.code, landmark: c.landmark });
    if (!S.homeId) S.homeId = c.id;
    save(); build(); renderResults();
    toast(`Added ${c.name}`);
    if (S.cities.length >= MAX_CITIES) openPanel(null);
  }
  function removeCity(id) {
    const i = S.cities.findIndex(c => c.id === id); if (i < 0) return;
    const [gone] = S.cities.splice(i, 1);
    const wasHome = S.homeId === id;
    if (wasHome) S.homeId = S.cities[0]?.id || null;
    knownRows.delete(id);
    save(); build();
    toast(`Removed ${gone.name}`, 'Undo', () => {
      S.cities.splice(i, 0, gone); if (wasHome) S.homeId = gone.id; save(); build();
    });
  }
  function setHome(id) { S.homeId = id; save(); update(); toast(`${S.cities.find(c => c.id === id).name} is now home base`); }
  function rename(row) {
    const c = S.cities.find(x => x.id === row.dataset.id); if (!c) return;
    const sub = row.querySelector('.sub');
    sub.innerHTML = `<input class="rename" maxlength="32" placeholder="Teammate or team, e.g. Priya · Design" value="${esc(c.label || '')}">`;
    const inp = sub.querySelector('input');
    inp.focus(); inp.select();
    let finished = false;
    const done = ok => { if (finished) return; finished = true; if (ok) { c.label = inp.value.trim() || undefined; save(); } update(); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') { e.stopPropagation(); done(false); } });
    inp.addEventListener('blur', () => done(true), { once: true });
  }

  list.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const row = b.closest('.row'), id = row.dataset.id;
    if (b.dataset.act === 'home') setHome(id);
    if (b.dataset.act === 'remove') removeCity(id);
    if (b.dataset.act === 'rename') rename(row);
  });
  list.addEventListener('dblclick', e => { const row = e.target.closest('.row'); if (row && e.target.closest('.info')) rename(row); });

  // drag-to-reorder via the grip
  list.addEventListener('pointerdown', e => {
    const grip = e.target.closest('.grip'); if (!grip || e.button !== 0) return;
    e.preventDefault();
    const row = grip.closest('.row'), rows = [...list.children], from = rows.indexOf(row);
    const pitch = row.offsetHeight + 8, y0 = e.clientY;
    let to = from;
    grip.setPointerCapture(e.pointerId);
    row.classList.add('dragging');
    const move = ev => {
      const dy = ev.clientY - y0;
      row.style.transform = `translateY(${dy}px)`;
      to = Math.max(0, Math.min(rows.length - 1, from + Math.round(dy / pitch)));
      rows.forEach((r, j) => { if (r === row) return;
        const s = j > from && j <= to ? -pitch : j < from && j >= to ? pitch : 0;
        r.style.transform = s ? `translateY(${s}px)` : ''; });
    };
    const up = () => {
      grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', up);
      rows.forEach(r => { r.style.transform = ''; r.classList.remove('dragging'); });
      if (to !== from) { const [c] = S.cities.splice(from, 1); S.cities.splice(to, 0, c); save(); build(); }
    };
    grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
  });

  // ---------- move the widget: grab anywhere that isn't a control ----------
  const NO_DRAG = 'button, input, select, a, .grip, .scrub, .panel, .tools, .rename, .toast';
  card.addEventListener('pointerdown', e => {
    if (e.button !== 0 || e.target.closest(NO_DRAG)) return;
    card.setPointerCapture(e.pointerId);
    card.classList.add('moving');
    desk.dragStart();
    const end = () => { card.classList.remove('moving'); desk.dragEnd(); card.removeEventListener('pointerup', end); card.removeEventListener('pointercancel', end); card.removeEventListener('lostpointercapture', end); };
    card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end); card.addEventListener('lostpointercapture', end);
  });

  // ---------- time travel ----------
  const scrub = $('#scrub'), track = $('#track');
  // Previewing is always deliberate (drag or arrow keys) and snaps back to live after 90s idle,
  // so the clocks can never be left showing a "wrong" time by accident.
  let idleTimer;
  const setShift = v => {
    shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, Math.round(v / STEP) * STEP));
    clearTimeout(idleTimer);
    if (shift) idleTimer = setTimeout(() => { shift = 0; update(); }, 90000);
    update();
  };
  scrub.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const w = track.getBoundingClientRect().width, x0 = e.clientX, s0 = shift;
    let moved = false;
    scrub.setPointerCapture(e.pointerId);
    scrub.classList.add('active');
    const move = ev => { if (Math.abs(ev.clientX - x0) > 3) moved = true; if (moved) setShift(s0 + (ev.clientX - x0) / w * 1440); };
    const up = () => {
      scrub.removeEventListener('pointermove', move); scrub.removeEventListener('pointerup', up);
      scrub.classList.remove('active');
    };
    scrub.addEventListener('pointermove', move); scrub.addEventListener('pointerup', up);
  });
  scrub.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (k) { e.preventDefault(); setShift(shift + k * (e.shiftKey ? 60 : STEP)); }
    if (e.key === 'Home') setShift(0);
  });
  $('#btn-now').onclick = () => setShift(0);
  $('#cta').onclick = () => desk.openSite('/?ref=world-clock');
  $('#btn-copy').onclick = copyTimes;

  async function copyTimes() {
    const at = new Date(now() + shift * 6e4);
    const lines = snapshot(at).map(x => { const t = fmtTime(x.h, x.m);
      return `${x.date} · ${t.t}${t.ap ? ' ' + t.ap : ''} — ${x.c.name}${x.c.label ? ` (${x.c.label})` : ''}${x.isHome ? ' ★' : ''}`; });
    const text = lines.join('\n');
    try { await navigator.clipboard.writeText(text); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast('Meeting times copied');
  }

  // ---------- panels ----------
  function openPanel(name) {
    panel = panel === name ? null : name;
    $('#panel-add').hidden = panel !== 'add';
    $('#panel-settings').hidden = panel !== 'settings';
    $('#btn-add').classList.toggle('on', panel === 'add');
    $('#btn-settings').classList.toggle('on', panel === 'settings');
    if (panel === 'add') { $('#q').value = ''; renderResults(); requestAnimationFrame(() => $('#q').focus()); }
    if (panel === 'settings') renderSettings();
  }
  $('#btn-add').onclick = () => openPanel('add');
  $('#empty-add').onclick = () => openPanel('add');
  $('#add-close').onclick = () => openPanel(null);
  $('#btn-settings').onclick = () => openPanel('settings');
  $('#btn-hide').onclick = () => desk.hide();

  let hl = 0, matches = [];
  const POPULAR = ['London', 'New York', 'San Francisco', 'Dubai', 'Singapore', 'Tokyo', 'Sydney', 'Berlin', 'Bengaluru', 'Lagos', 'São Paulo', 'Toronto'];
  function search(q) {
    q = norm(q.trim());
    if (!q) return POPULAR.map(n => CATALOG.find(c => c.name === n));
    const scored = [];
    for (const c of CATALOG) {
      const n = norm(c.name), co = norm(c.country), code = c.code.toLowerCase();
      const s = code === q ? 0 : n.startsWith(q) ? 1 : n.includes(q) ? 2 : co.startsWith(q) ? 3 : co.includes(q) ? 4 : norm(c.tz).includes(q.replace(/ /g, '_')) ? 5 : -1;
      if (s >= 0) scored.push([s, c]);
    }
    scored.sort((a, b) => a[0] - b[0]);
    const out = scored.map(x => x[1]).slice(0, 30);
    const seen = new Set(out.map(c => c.tz + c.name));
    for (const z of ZONES) {
      if (out.length >= 40) break;
      const zc = cityFromZone(z);
      if (norm(z.replace(/_/g, ' ')).includes(q) && !seen.has(zc.tz + zc.name) && !CATALOG.some(c => c.name === zc.name)) out.push(zc);
    }
    return out;
  }
  function renderResults() {
    if (panel !== 'add') return;
    $('#slots').textContent = `${S.cities.length}/${MAX_CITIES}`;
    if (S.cities.length >= MAX_CITIES) {
      $('#results').innerHTML = `<div class="no-res">All ${MAX_CITIES} clocks are in use.<br>Hover a clock and press × to swap it out.</div>`;
      return;
    }
    matches = search($('#q').value);
    hl = Math.min(hl, Math.max(0, matches.length - 1));
    const nowD = new Date(now());
    const hOff = home() ? offsetMin(home().tz, nowD) : 0;
    $('#results').innerHTML = matches.length ? matches.map((c, i) => {
      const off = offsetMin(c.tz, nowD), L = new Date(nowD.getTime() + off * 6e4), t = fmtTime(L.getUTCHours(), L.getUTCMinutes());
      const added = S.cities.some(x => x.id === c.id);
      return `<button class="res${i === hl ? ' hl' : ''}${added ? ' added' : ''}" data-i="${i}" role="option">
        <span><span class="rn">${esc(c.name)}</span><br><span class="rc">${esc(c.country)} · ${fmtOff(off)}</span></span>
        <span class="rt tnum">${added ? '✓ Added' : `<b>${t.t}${t.ap ? ' ' + t.ap : ''}</b><br>${home() ? fmtDelta(off - hOff) : ''}`}</span></button>`;
    }).join('') : `<div class="no-res">No match. Try a country, a bigger nearby city, or an airport code.</div>`;
  }
  $('#q').addEventListener('input', () => { hl = 0; renderResults(); });
  $('#q').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); hl = (hl + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length; renderResults();
      $('#results .hl')?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && matches[hl]) addCity(matches[hl]);
    if (e.key === 'Escape') { e.stopPropagation(); openPanel(null); }
  });
  $('#results').addEventListener('click', e => { const b = e.target.closest('.res'); if (b) addCity(matches[+b.dataset.i]); });

  function renderSettings() {
    const seg = (key, opts) => `<span class="seg" data-key="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(S[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</span>`;
    const hours = (from, to, sel) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
      .map(h => { const t = fmtTime(h, 0); return `<option value="${h}"${h === sel ? ' selected' : ''}>${t.t}${t.ap ? ' ' + t.ap : ''}</option>`; }).join('');
    const hk = OS.platform === 'darwin' ? '⌘⌥⇧W' : 'Ctrl+Alt+Shift+W';
    $('#panel-settings').innerHTML = `
      <div class="set-row"><label>Theme</label>${seg('theme', [['forest', 'Forest'], ['paper', 'Paper'], ['auto', 'Auto']])}</div>
      <div class="set-row"><label>Clock</label>${seg('hour12', [[true, '12h'], [false, '24h']])}</div>
      <div class="set-row"><label>Size</label>${seg('size', [['s', 'S'], ['m', 'M'], ['l', 'L']])}</div>
      <div class="set-row"><label>Layout</label>${seg('density', [['scenic', 'Scenic'], ['compact', 'Compact']])}</div>
      <div class="set-row"><label>Work hours<small>Used for "good time to call"</small></label>
        <span><select id="ws">${hours(5, 12, S.workStart)}</select> – <select id="we">${hours(13, 23, S.workEnd)}</select></span></div>
      <div class="set-row"><label>Opacity</label><input type="range" id="op" min="40" max="100" value="${Math.round((OS.opacity ?? 1) * 100)}"></div>
      <div class="set-row"><label>Always on top</label><button class="switch${OS.alwaysOnTop ? ' on' : ''}" data-os="alwaysOnTop" role="switch" aria-checked="${!!OS.alwaysOnTop}"></button></div>
      <div class="set-row"><label>Launch at login</label><button class="switch${OS.openAtLogin ? ' on' : ''}" data-os="openAtLogin" role="switch" aria-checked="${!!OS.openAtLogin}"></button></div>
      <div class="set-foot"><span>Show / hide: <b>${hk}</b></span><button id="site">Plan with your team at globalsync-ai →</button></div>`;
  }
  $('#panel-settings').addEventListener('click', e => {
    const b = e.target.closest('.seg button');
    if (b) {
      const key = b.parentElement.dataset.key; let v = b.dataset.v;
      if (key === 'hour12') v = v === 'true';
      S[key] = v; save(); applyLook(); renderSettings(); update();
      return;
    }
    const sw = e.target.closest('[data-os]');
    if (sw) { const k = sw.dataset.os; OS[k] = !OS[k]; desk.setOS({ [k]: OS[k] }); renderSettings(); }
    if (e.target.closest('#site')) desk.openSite('/?ref=world-clock');
  });
  $('#panel-settings').addEventListener('change', e => {
    if (e.target.id === 'ws') S.workStart = +e.target.value;
    if (e.target.id === 'we') S.workEnd = +e.target.value;
    if (e.target.id === 'ws' || e.target.id === 'we') { save(); update(); }
  });
  $('#panel-settings').addEventListener('input', e => {
    if (e.target.id === 'op') { OS.opacity = +e.target.value / 100; desk.setOS({ opacity: OS.opacity }); }
  });

  // ---------- look & window fit ----------
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  function applyLook() {
    const theme = S.theme === 'auto' ? (darkMQ.matches ? 'forest' : 'paper') : S.theme;
    card.dataset.theme = theme;
    card.dataset.size = S.size;
    card.dataset.density = S.density;
    const zoom = { s: 0.86, m: 1, l: 1.16 }[S.size] || 1;
    card.style.setProperty('--list-max', `${Math.max(520, (screen.availHeight * 0.86) / zoom - 250)}px`);
  }
  darkMQ.addEventListener('change', () => S.theme === 'auto' && applyLook());
  new ResizeObserver(() => { const r = card.getBoundingClientRect(); desk.fit(r.width, r.height); }).observe(card);

  // ---------- toast ----------
  let toastTimer;
  function toast(msg, action, fn) {
    const t = $('#toast');
    t.innerHTML = esc(msg) + (action ? ` <button class="link" style="color:#0E2A1F;margin-left:6px;text-decoration:underline">${action}</button>` : '');
    t.style.pointerEvents = action ? 'auto' : 'none';
    if (action) t.querySelector('button').onclick = () => { fn(); t.classList.remove('show'); };
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), action ? 5000 : 1800);
  }

  // ---------- keyboard ----------
  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'n') { e.preventDefault(); openPanel('add'); }
    if (mod && e.key === ',') { e.preventDefault(); openPanel('settings'); }
    if (e.key === 'Escape' && !e.defaultPrevented) { if (panel) openPanel(null); else if (shift) setShift(0); }
    if (mod && e.key.toLowerCase() === 'c' && shift && !window.getSelection().toString()) { e.preventDefault(); copyTimes(); }
  });

  // ---------- clock ----------
  function tick() {
    update();
    setTimeout(tick, 60000 - (now() % 60000) + 50);   // land just after each minute boundary
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  setInterval(update, 20000);   // cheap safety net after sleep/resume or a system clock change

  // ---------- boot ----------
  desk.on('ui:open', name => { if (panel !== name) openPanel(name); });
  desk.on('settings:changed', patch => { Object.assign(OS, patch); if (panel === 'settings') renderSettings(); });

  desk.load().then(loaded => {
    const { alwaysOnTop, opacity, openAtLogin, platform, hotkey, ...app } = loaded || {};
    OS = { ...OS, alwaysOnTop: !!alwaysOnTop, opacity: opacity ?? 1, openAtLogin: !!openAtLogin, platform: platform || OS.platform, hotkey: hotkey || OS.hotkey };
    S = app && Array.isArray(app.cities) ? { ...defaults(), ...app } : defaults();
    // re-attach landmarks for saved cities (catalog may have gained some since)
    S.cities.forEach(c => { const k = CATALOG.find(x => x.id === c.id); if (k) c.landmark = k.landmark; });
    if (S.cities.length > MAX_CITIES) {
      const h = S.cities.find(c => c.id === S.homeId);
      S.cities = [...(h ? [h] : []), ...S.cities.filter(c => c !== h)].slice(0, MAX_CITIES);
    }
    if (DEMO) {   // demo overrides are never saved
      const names = DEMO.get('cities');
      if (names) S.cities = names.split(',').map(n => CATALOG.find(c => c.name === n.trim())).filter(Boolean).map(c => ({ ...c })).slice(0, MAX_CITIES);
      const h = DEMO.get('home') && S.cities.find(c => c.name === DEMO.get('home'));
      S.homeId = h ? h.id : S.cities[0]?.id;
      for (const k of ['theme', 'density', 'size']) if (DEMO.get(k)) S[k] = DEMO.get(k);
      if (DEMO.get('hour12')) S.hour12 = DEMO.get('hour12') !== 'false';
    } else save();
    applyLook();
    build();
    tick();
    if (DEMO) {
      if (DEMO.get('shift')) { shift = +DEMO.get('shift'); update(); }
      if (DEMO.get('panel')) { openPanel(DEMO.get('panel')); if (DEMO.get('q')) { $('#q').value = DEMO.get('q'); renderResults(); } }
    }
    document.fonts?.ready.then(() => { const r = card.getBoundingClientRect(); desk.fit(r.width, r.height); });
  });
})();
