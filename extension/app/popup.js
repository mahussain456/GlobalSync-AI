// GlobalSync World Clock — toolbar popup: live clocks, a converter, quick switches and settings.
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const api = globalThis.chrome?.storage ? globalThis.chrome : null;   // null when previewed outside the extension
  let prefs = TL.defaults(), host = '', conv = null;

  const store = {
    load: () => new Promise(r => api ? api.storage.sync.get(null, v => r(v)) : r({})),
    save: patch => { Object.assign(prefs, patch); if (api) api.storage.sync.set(patch); render(); },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function rowsHTML(at) {
    const rows = TL.rowsAt(at, prefs);
    $('#fit').textContent = `${rows.filter(r => r.status.k === 'work').length} of ${rows.length} in work hours`;
    return rows.map(r => `<div class="r"><i class="dot ${r.status.k}"></i><span class="c${r.home ? ' home' : ''}"><b>${esc(r.city.name)}</b><small>${r.status.label}</small></span>
      <span class="t">${r.time}${r.ap ? `<small>${r.ap}</small>` : ''}</span><span class="d">${r.day}</span></div>`).join('');
  }
  function render() {
    document.getElementById('app').classList.toggle('paper', prefs.theme === 'paper' || (prefs.theme === 'auto' && !matchMedia('(prefers-color-scheme: dark)').matches));
    document.body.classList.toggle('paper', $('#app').classList.contains('paper'));
    const q = $('#q').value.trim();
    conv = q ? TL.parse(q, { now: Date.now(), fallbackTz: TL.byName(prefs.home)?.tz }) : null;
    const title = $('#title');
    if (q && !conv) { title.textContent = 'Try “3pm EST”, “15:00 London” or “9am Tokyo Fri”.'; title.className = 'title err'; $('#rows').innerHTML = ''; $('#fit').textContent = ''; }
    else {
      title.className = 'title';
      if (conv) { const k = TL.clock(conv.h, conv.m, prefs.hour12); title.textContent = `${TL.DAYS[conv.dow]} ${k.t}${k.ap ? ' ' + k.ap : ''} · ${conv.zoneLabel}`; }
      else title.textContent = 'Now';
      $('#rows').innerHTML = rowsHTML(conv ? conv.at : Date.now());
    }
    $('#mini').checked = !!prefs.mini;
    $('#site').checked = (prefs.disabledSites || []).includes(host);
    $('#site-label').textContent = host ? `Turn off on ${host}` : 'Turn off on this site';
    $('#site').closest('.tg').hidden = !host;
    renderSettings();
  }

  // ---------- settings ----------
  function renderSettings() {
    $('#cities').innerHTML = prefs.cities.map(n => {
      const c = TL.byName(n); if (!c) return '';
      return `<div class="ci"><button class="star${n === prefs.home ? ' on' : ''}" data-home="${esc(n)}" title="Make home">★</button><span>${esc(n)}<small>${esc(c.country)}</small></span>
        <button class="ic" data-rm="${esc(n)}" title="Remove" aria-label="Remove ${esc(n)}">×</button></div>`;
    }).join('');
    $('#add-q').disabled = prefs.cities.length >= 4;
    $('#add-q').placeholder = prefs.cities.length >= 4 ? '4 cities max, remove one to add' : 'Add a city or country…';
    document.querySelectorAll('.seg').forEach(seg => seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', String(prefs[seg.dataset.k]) === b.dataset.v)));
    const opt = (from, to, sel) => Array.from({ length: to - from + 1 }, (_, i) => from + i).map(h => { const k = TL.clock(h, 0, prefs.hour12); return `<option value="${h}"${h === sel ? ' selected' : ''}>${k.t}${k.ap ? ' ' + k.ap : ''}</option>`; }).join('');
    $('#ws').innerHTML = opt(5, 12, prefs.workStart); $('#we').innerHTML = opt(13, 23, prefs.workEnd);
  }
  let hl = 0, matches = [];
  function search() {
    const q = $('#add-q').value.trim().toLowerCase();
    matches = !q ? [] : TL.CITY.filter(c => !prefs.cities.includes(c.name) && (c.name.toLowerCase().includes(q) || c.country.toLowerCase().startsWith(q) || c.code.toLowerCase() === q)).slice(0, 8);
    hl = 0;
    $('#add-res').innerHTML = matches.map((c, i) => `<button data-add="${esc(c.name)}" class="${i === hl ? 'hl' : ''}"><span>${esc(c.name)}</span><small>${esc(c.country)}</small></button>`).join('');
  }
  function add(name) {
    if (!name || prefs.cities.length >= 4) return;
    store.save({ cities: [...prefs.cities, name] });
    $('#add-q').value = ''; search();
  }

  // ---------- events ----------
  $('#q').addEventListener('input', render);
  $('#copy').addEventListener('click', e => {
    const at = conv ? conv.at : Date.now();
    navigator.clipboard.writeText(TL.copyText(at, prefs, $('#q').value.trim() || null)).then(() => { e.target.textContent = 'Copied'; setTimeout(() => { e.target.textContent = 'Copy'; }, 1300); });
  });
  $('#mini').addEventListener('change', e => store.save({ mini: e.target.checked }));
  $('#site').addEventListener('change', e => {
    const list = new Set(prefs.disabledSites || []); e.target.checked ? list.add(host) : list.delete(host);
    store.save({ disabledSites: [...list] });
  });
  $('#to-settings').addEventListener('click', () => { $('#view-main').hidden = true; $('#view-settings').hidden = false; $('#add-q').focus(); });
  $('#back').addEventListener('click', () => { $('#view-settings').hidden = true; $('#view-main').hidden = false; render(); $('#q').focus(); });
  $('#cities').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.home) store.save({ home: b.dataset.home });
    if (b.dataset.rm) { const cities = prefs.cities.filter(n => n !== b.dataset.rm); if (!cities.length) return; store.save({ cities, home: cities.includes(prefs.home) ? prefs.home : cities[0] }); }
  });
  $('#add-q').addEventListener('input', search);
  $('#add-q').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); hl = (hl + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % Math.max(1, matches.length); [...$('#add-res').children].forEach((b, i) => b.classList.toggle('hl', i === hl)); }
    if (e.key === 'Enter' && matches[hl]) add(matches[hl].name);
  });
  $('#add-res').addEventListener('click', e => { const b = e.target.closest('button'); if (b) add(b.dataset.add); });
  document.querySelectorAll('.seg').forEach(seg => seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    let v = b.dataset.v; if (seg.dataset.k === 'hour12') v = v === 'true';
    store.save({ [seg.dataset.k]: v });
  }));
  $('#ws').addEventListener('change', e => store.save({ workStart: +e.target.value }));
  $('#we').addEventListener('change', e => store.save({ workEnd: +e.target.value }));

  // ---------- boot ----------
  (async () => {
    prefs = { ...TL.defaults(), ...(await store.load()) };
    if (api?.tabs) {
      const [tab] = await api.tabs.query({ active: true, currentWindow: true });
      try { const u = new URL(tab?.url || ''); if (/^https?:$/.test(u.protocol)) host = u.hostname; } catch { /* not a web page */ }
    }
    if (api?.commands) api.commands.getAll(cmds => { const c = cmds.find(x => x.name === '_execute_action'); if (c?.shortcut) $('#kbd').textContent = c.shortcut; });
    render();
    $('#q').focus();
    setInterval(() => { if (!$('#q').value.trim()) render(); }, 15000);
  })();
})();
