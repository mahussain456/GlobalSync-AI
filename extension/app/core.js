// GlobalSync World Clock — shared engine (popup, content script, service worker).
// No network, no dependencies: time zones come from the browser's built-in Intl data.
(function (g) {
  'use strict';
  const CITIES = [["San Francisco","United States","America/Los_Angeles","SF"],["Los Angeles","United States","America/Los_Angeles","LA"],["San Diego","United States","America/Los_Angeles","SAN"],["Seattle","United States","America/Los_Angeles","SEA"],["Portland","United States","America/Los_Angeles","PDX"],["Las Vegas","United States","America/Los_Angeles","LAS"],["Phoenix","United States","America/Phoenix","PHX"],["Denver","United States","America/Denver","DEN"],["Salt Lake City","United States","America/Denver","SLC"],["Chicago","United States","America/Chicago","CHI"],["Austin","United States","America/Chicago","AUS"],["Dallas","United States","America/Chicago","DAL"],["Houston","United States","America/Chicago","HOU"],["Minneapolis","United States","America/Chicago","MSP"],["New York","United States","America/New_York","NYC"],["Boston","United States","America/New_York","BOS"],["Washington DC","United States","America/New_York","DC"],["Atlanta","United States","America/New_York","ATL"],["Miami","United States","America/New_York","MIA"],["Detroit","United States","America/Detroit","DTW"],["Anchorage","United States","America/Anchorage","ANC"],["Honolulu","United States","Pacific/Honolulu","HNL"],["Toronto","Canada","America/Toronto","TOR"],["Montreal","Canada","America/Toronto","MTL"],["Ottawa","Canada","America/Toronto","OTT"],["Vancouver","Canada","America/Vancouver","VAN"],["Calgary","Canada","America/Edmonton","YYC"],["Halifax","Canada","America/Halifax","HFX"],["St. John's","Canada","America/St_Johns","YYT"],["Mexico City","Mexico","America/Mexico_City","MEX"],["Guadalajara","Mexico","America/Mexico_City","GDL"],["Monterrey","Mexico","America/Monterrey","MTY"],["Panama City","Panama","America/Panama","PTY"],["San José","Costa Rica","America/Costa_Rica","SJO"],["Guatemala City","Guatemala","America/Guatemala","GUA"],["Havana","Cuba","America/Havana","HAV"],["San Juan","Puerto Rico","America/Puerto_Rico","SJU"],["Kingston","Jamaica","America/Jamaica","KIN"],["Bogotá","Colombia","America/Bogota","BOG"],["Medellín","Colombia","America/Bogota","MDE"],["Lima","Peru","America/Lima","LIM"],["Quito","Ecuador","America/Guayaquil","UIO"],["Caracas","Venezuela","America/Caracas","CCS"],["Santiago","Chile","America/Santiago","SCL"],["Buenos Aires","Argentina","America/Argentina/Buenos_Aires","BUE"],["Montevideo","Uruguay","America/Montevideo","MVD"],["São Paulo","Brazil","America/Sao_Paulo","SAO"],["Rio de Janeiro","Brazil","America/Sao_Paulo","RIO"],["Brasília","Brazil","America/Sao_Paulo","BSB"],["London","United Kingdom","Europe/London","LDN"],["Manchester","United Kingdom","Europe/London","MAN"],["Edinburgh","United Kingdom","Europe/London","EDI"],["Dublin","Ireland","Europe/Dublin","DUB"],["Lisbon","Portugal","Europe/Lisbon","LIS"],["Porto","Portugal","Europe/Lisbon","OPO"],["Madrid","Spain","Europe/Madrid","MAD"],["Barcelona","Spain","Europe/Madrid","BCN"],["Paris","France","Europe/Paris","PAR"],["Brussels","Belgium","Europe/Brussels","BRU"],["Amsterdam","Netherlands","Europe/Amsterdam","AMS"],["Berlin","Germany","Europe/Berlin","BER"],["Munich","Germany","Europe/Berlin","MUC"],["Frankfurt","Germany","Europe/Berlin","FRA"],["Hamburg","Germany","Europe/Berlin","HAM"],["Zurich","Switzerland","Europe/Zurich","ZRH"],["Geneva","Switzerland","Europe/Zurich","GVA"],["Vienna","Austria","Europe/Vienna","VIE"],["Milan","Italy","Europe/Rome","MIL"],["Rome","Italy","Europe/Rome","ROM"],["Copenhagen","Denmark","Europe/Copenhagen","CPH"],["Oslo","Norway","Europe/Oslo","OSL"],["Stockholm","Sweden","Europe/Stockholm","STO"],["Helsinki","Finland","Europe/Helsinki","HEL"],["Tallinn","Estonia","Europe/Tallinn","TLL"],["Riga","Latvia","Europe/Riga","RIX"],["Vilnius","Lithuania","Europe/Vilnius","VNO"],["Warsaw","Poland","Europe/Warsaw","WAW"],["Kraków","Poland","Europe/Warsaw","KRK"],["Prague","Czechia","Europe/Prague","PRG"],["Budapest","Hungary","Europe/Budapest","BUD"],["Bucharest","Romania","Europe/Bucharest","BUH"],["Sofia","Bulgaria","Europe/Sofia","SOF"],["Belgrade","Serbia","Europe/Belgrade","BEG"],["Zagreb","Croatia","Europe/Zagreb","ZAG"],["Athens","Greece","Europe/Athens","ATH"],["Kyiv","Ukraine","Europe/Kyiv","KYV"],["Istanbul","Türkiye","Europe/Istanbul","IST"],["Moscow","Russia","Europe/Moscow","MOW"],["Reykjavík","Iceland","Atlantic/Reykjavik","REK"],["Dubai","UAE","Asia/Dubai","DXB"],["Abu Dhabi","UAE","Asia/Dubai","AUH"],["Riyadh","Saudi Arabia","Asia/Riyadh","RUH"],["Jeddah","Saudi Arabia","Asia/Riyadh","JED"],["Doha","Qatar","Asia/Qatar","DOH"],["Kuwait City","Kuwait","Asia/Kuwait","KWI"],["Manama","Bahrain","Asia/Bahrain","BAH"],["Muscat","Oman","Asia/Muscat","MCT"],["Tel Aviv","Israel","Asia/Jerusalem","TLV"],["Amman","Jordan","Asia/Amman","AMM"],["Beirut","Lebanon","Asia/Beirut","BEY"],["Tehran","Iran","Asia/Tehran","THR"],["Baghdad","Iraq","Asia/Baghdad","BGW"],["Cairo","Egypt","Africa/Cairo","CAI"],["Casablanca","Morocco","Africa/Casablanca","CAS"],["Tunis","Tunisia","Africa/Tunis","TUN"],["Lagos","Nigeria","Africa/Lagos","LOS"],["Abuja","Nigeria","Africa/Lagos","ABV"],["Accra","Ghana","Africa/Accra","ACC"],["Dakar","Senegal","Africa/Dakar","DKR"],["Nairobi","Kenya","Africa/Nairobi","NBO"],["Addis Ababa","Ethiopia","Africa/Addis_Ababa","ADD"],["Kampala","Uganda","Africa/Kampala","KLA"],["Kigali","Rwanda","Africa/Kigali","KGL"],["Dar es Salaam","Tanzania","Africa/Dar_es_Salaam","DAR"],["Johannesburg","South Africa","Africa/Johannesburg","JNB"],["Cape Town","South Africa","Africa/Johannesburg","CPT"],["Karachi","Pakistan","Asia/Karachi","KHI"],["Lahore","Pakistan","Asia/Karachi","LHE"],["Islamabad","Pakistan","Asia/Karachi","ISB"],["Mumbai","India","Asia/Kolkata","BOM"],["Delhi","India","Asia/Kolkata","DEL"],["Hyderabad","India","Asia/Kolkata","HYD"],["Bengaluru","India","Asia/Kolkata","BLR"],["Chennai","India","Asia/Kolkata","MAA"],["Pune","India","Asia/Kolkata","PNQ"],["Kolkata","India","Asia/Kolkata","CCU"],["Ahmedabad","India","Asia/Kolkata","AMD"],["Kathmandu","Nepal","Asia/Kathmandu","KTM"],["Colombo","Sri Lanka","Asia/Colombo","CMB"],["Dhaka","Bangladesh","Asia/Dhaka","DAC"],["Kabul","Afghanistan","Asia/Kabul","KBL"],["Tashkent","Uzbekistan","Asia/Tashkent","TAS"],["Almaty","Kazakhstan","Asia/Almaty","ALA"],["Bangkok","Thailand","Asia/Bangkok","BKK"],["Ho Chi Minh City","Vietnam","Asia/Ho_Chi_Minh","SGN"],["Hanoi","Vietnam","Asia/Ho_Chi_Minh","HAN"],["Kuala Lumpur","Malaysia","Asia/Kuala_Lumpur","KUL"],["Singapore","Singapore","Asia/Singapore","SIN"],["Jakarta","Indonesia","Asia/Jakarta","JKT"],["Bali","Indonesia","Asia/Makassar","DPS"],["Manila","Philippines","Asia/Manila","MNL"],["Hong Kong","China","Asia/Hong_Kong","HKG"],["Shanghai","China","Asia/Shanghai","SHA"],["Beijing","China","Asia/Shanghai","BJS"],["Shenzhen","China","Asia/Shanghai","SZX"],["Taipei","Taiwan","Asia/Taipei","TPE"],["Seoul","South Korea","Asia/Seoul","SEL"],["Tokyo","Japan","Asia/Tokyo","TYO"],["Osaka","Japan","Asia/Tokyo","OSA"],["Perth","Australia","Australia/Perth","PER"],["Adelaide","Australia","Australia/Adelaide","ADL"],["Brisbane","Australia","Australia/Brisbane","BNE"],["Sydney","Australia","Australia/Sydney","SYD"],["Melbourne","Australia","Australia/Melbourne","MEL"],["Auckland","New Zealand","Pacific/Auckland","AKL"],["Wellington","New Zealand","Pacific/Auckland","WLG"],["Fiji","Fiji","Pacific/Fiji","SUV"],["UTC","Coordinated Universal Time","UTC","UTC"]];   // [name, country, IANA zone, code], from the desktop widget catalog

  const CITY = CITIES.map(([name, country, tz, code]) => ({ name, country, tz, code }));
  const byName = n => CITY.find(c => c.name === n);

  // Common abbreviations → a representative zone. Ambiguous ones use the most common meaning online
  // (IST = India, CST = US Central). Daylight saving is handled by the zone, so "EST" in July means New York time.
  const ABBR = {
    et: 'America/New_York', est: 'America/New_York', edt: 'America/New_York', eastern: 'America/New_York',
    ct: 'America/Chicago', cst: 'America/Chicago', cdt: 'America/Chicago', central: 'America/Chicago',
    mt: 'America/Denver', mst: 'America/Denver', mdt: 'America/Denver', mountain: 'America/Denver',
    pt: 'America/Los_Angeles', pst: 'America/Los_Angeles', pdt: 'America/Los_Angeles', pacific: 'America/Los_Angeles',
    akst: 'America/Anchorage', hst: 'Pacific/Honolulu', ast: 'America/Halifax', nst: 'America/St_Johns',
    brt: 'America/Sao_Paulo', art: 'America/Argentina/Buenos_Aires',
    gmt: 'UTC', utc: 'UTC', z: 'UTC', bst: 'Europe/London', wet: 'Europe/Lisbon', west: 'Europe/Lisbon',
    cet: 'Europe/Paris', cest: 'Europe/Paris', eet: 'Europe/Athens', eest: 'Europe/Athens', msk: 'Europe/Moscow',
    wat: 'Africa/Lagos', cat: 'Africa/Johannesburg', eat: 'Africa/Nairobi', sast: 'Africa/Johannesburg',
    gst: 'Asia/Dubai', pkt: 'Asia/Karachi', ist: 'Asia/Kolkata', npt: 'Asia/Kathmandu', bdt: 'Asia/Dhaka',
    ict: 'Asia/Bangkok', wib: 'Asia/Jakarta', sgt: 'Asia/Singapore', hkt: 'Asia/Hong_Kong', pht: 'Asia/Manila',
    kst: 'Asia/Seoul', jst: 'Asia/Tokyo', awst: 'Australia/Perth', acst: 'Australia/Adelaide',
    aest: 'Australia/Sydney', aedt: 'Australia/Sydney', nzst: 'Pacific/Auckland', nzdt: 'Pacific/Auckland',
  };
  const WEEKENDS = { 'Saudi Arabia': [5, 6], Qatar: [5, 6], Kuwait: [5, 6], Bahrain: [5, 6], Oman: [5, 6], Jordan: [5, 6],
    Iraq: [5, 6], Egypt: [5, 6], Israel: [5, 6], Iran: [5], Afghanistan: [5], Nepal: [6] };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAYS_LONG = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // ---------- zone math ----------
  const fmtCache = new Map();
  function offset(tz, ms) {        // minutes east of UTC for `tz` at instant `ms`
    if (typeof tz === 'number') return tz;          // fixed offset ("GMT+5")
    let f = fmtCache.get(tz);
    if (!f) {
      try { f = { long: new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }) }; f.long.format(0); }
      catch { f = { parts: new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }; }
      fmtCache.set(tz, f);
    }
    if (f.long) {
      const v = f.long.formatToParts(ms).find(p => p.type === 'timeZoneName').value;
      const m = v.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
      return m ? (m[1] === '-' ? -1 : 1) * (+m[2] * 60 + +(m[3] || 0)) : 0;
    }
    const p = Object.fromEntries(f.parts.formatToParts(ms).map(x => [x.type, x.value]));
    return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(ms / 6e4) * 6e4) / 6e4);
  }
  function local(tz, ms) {
    const L = new Date(ms + offset(tz, ms) * 6e4);
    return { y: L.getUTCFullYear(), mo: L.getUTCMonth(), d: L.getUTCDate(), h: L.getUTCHours(), m: L.getUTCMinutes(), dow: L.getUTCDay() };
  }
  function wallToInstant(tz, y, mo, d, h, m) {   // wall clock in tz → UTC ms (two passes settle DST edges)
    let t = Date.UTC(y, mo, d, h, m);
    for (let i = 0; i < 2; i++) t = Date.UTC(y, mo, d, h, m) - offset(tz, t) * 6e4;
    return t;
  }

  function status(c, h, dow, prefs) {
    const ws = prefs?.workStart ?? 9, we = prefs?.workEnd ?? 18;
    if (h < 7 || h >= 22) return { k: 'sleep', label: 'Asleep' };
    if ((WEEKENDS[c.country] || [0, 6]).includes(dow)) return { k: 'weekend', label: 'Weekend' };
    if (h >= ws && h < we) return { k: 'work', label: 'Good time to call' };
    return { k: 'edge', label: h < ws ? 'Before work' : 'After hours' };
  }
  function clock(h, m, hour12 = true) {
    return hour12 ? { t: `${h % 12 || 12}:${String(m).padStart(2, '0')}`, ap: h < 12 ? 'AM' : 'PM' }
                  : { t: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, ap: '' };
  }

  // ---------- parsing ----------
  const TIME_RE = /\b(\d{1,2})(?:[:.h](\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?(?=[^\d]|$)/gi;
  const cityWords = CITY.slice().sort((a, b) => b.name.length - a.name.length);

  function findTime(s) {
    TIME_RE.lastIndex = 0;
    let m;
    while ((m = TIME_RE.exec(s))) {
      const hasAp = !!m[3], hasMin = m[2] != null;
      if (!hasAp && !hasMin) continue;                  // a bare "16" is a date, not a time
      let h = +m[1]; const min = +(m[2] || 0);
      if (hasAp) { if (h < 1 || h > 12) continue; if (h === 12) h = 0; if (/p/i.test(m[3])) h += 12; }
      if (h > 23 || min > 59) continue;
      return { h, m: min, index: m.index, end: m.index + m[0].length };
    }
    return null;
  }
  function findZone(s, around) {
    // Look near the time first (±28 chars) so "et" or "pt" elsewhere in a sentence doesn't count.
    const win = around ? s.slice(Math.max(0, around.index - 28), around.end + 28) : s;
    const off = win.match(/\b(?:gmt|utc)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?\b/);
    if (off) return { tz: (off[1] === '-' ? -1 : 1) * (+off[2] * 60 + +(off[3] || 0)), label: off[0].toUpperCase().replace(/\s+/g, '') };
    for (const w of win.split(/[^a-z]+/)) if (ABBR[w]) return { tz: ABBR[w], label: w.toUpperCase() };
    for (const c of cityWords) if (win.includes(c.name.toLowerCase())) return { tz: c.tz, label: c.name };
    for (const c of CITY) if (c.country.length > 3 && win.includes(c.country.toLowerCase())) return { tz: c.tz, label: c.country };
    return null;
  }
  function findDay(s, tz, now) {
    const base = local(tz, now);
    const iso = s.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
    if (iso) return { y: +iso[1], mo: +iso[2] - 1, d: +iso[3] };
    // "16 April" or "April 16", but never read the hour of "April 14:00" as a day.
    const md = s.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTHS.join('|')})[a-z]*\\b`)) ||
               s.match(new RegExp(`\\b(${MONTHS.join('|')})[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?![:.h]?\\d)`));
    if (md) {
      const [mon, day] = isNaN(md[1]) ? [md[1], md[2]] : [md[2], md[1]];
      const mo = MONTHS.indexOf(mon.slice(0, 3));
      let y = base.y;
      if (Date.UTC(y, mo, +day) < Date.UTC(base.y, base.mo, base.d) - 31 * 864e5) y++;   // times people mention are upcoming
      return { y, mo, d: +day };
    }
    let add = 0;
    if (/\btomorrow\b/.test(s)) add = 1;
    else if (/\byesterday\b/.test(s)) add = -1;
    else {
      const i = DAYS_LONG.findIndex(d => new RegExp(`\\b${d.slice(0, 3)}(${d.slice(3)})?\\b`).test(s));
      if (i >= 0) add = (i - base.dow + 7) % 7;
    }
    return { y: base.y, mo: base.mo, d: base.d + add };
  }

  /** Parse "Thursday at 3pm EST" → { at, h, m, zoneLabel, assumedZone }. `fallbackTz` is used when no zone is written. */
  function parse(text, { now = Date.now(), fallbackTz = null } = {}) {
    if (!text) return null;
    const s = String(text).toLowerCase().replace(/\bnoon\b/g, '12:00 pm').replace(/\bmidnight\b/g, '12:00 am').replace(/[–—]/g, '-');
    const time = findTime(s);
    if (!time) return null;
    let zone = findZone(s, time), assumed = false;
    if (!zone) { if (!fallbackTz) return null; zone = { tz: fallbackTz, label: 'your time' }; assumed = true; }
    const day = findDay(s, zone.tz, now);
    const at = typeof zone.tz === 'number'
      ? Date.UTC(day.y, day.mo, day.d, time.h, time.m) - zone.tz * 6e4
      : wallToInstant(zone.tz, day.y, day.mo, day.d, time.h, time.m);
    const L = typeof zone.tz === 'number' ? (() => { const d = new Date(at + zone.tz * 6e4); return { h: d.getUTCHours(), m: d.getUTCMinutes(), dow: d.getUTCDay() }; })() : local(zone.tz, at);
    return { at, h: L.h, m: L.m, dow: L.dow, zoneLabel: zone.label, assumedZone: assumed };
  }
  /** Cheap check used on every selection: a time and a zone close together. */
  const looksLikeTime = text => !!text && text.length <= 120 && !!parse(text, { now: Date.now() });

  // ---------- settings ----------
  function defaults() {
    const here = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const seg = here.split('/').pop().replace(/_/g, ' ');
    const home = CITY.find(c => c.tz === here && c.name === seg) || CITY.find(c => c.tz === here) || byName('London');
    const picks = [home.name];
    for (const n of ['New York', 'London', 'Dubai', 'Tokyo', 'San Francisco', 'Singapore']) {
      const c = byName(n); if (picks.length < 4 && !picks.some(p => byName(p).tz === c.tz)) picks.push(n);
    }
    const hc = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hourCycle;
    return { cities: picks, home: home.name, hour12: hc ? hc === 'h12' || hc === 'h11' : true,
             workStart: 9, workEnd: 18, lens: 'pill', theme: 'forest', mini: false, miniPos: null, disabledSites: [] };
  }

  /** Rows for the user's cities at instant `at`. */
  function rowsAt(at, prefs) {
    const homeC = byName(prefs.home) || byName(prefs.cities[0]);
    const hl = homeC ? local(homeC.tz, at) : null;
    return prefs.cities.map(byName).filter(Boolean).map(c => {
      const L = local(c.tz, at), st = status(c, L.h, L.dow, prefs), k = clock(L.h, L.m, prefs.hour12);
      const dd = hl ? Math.round((Date.UTC(L.y, L.mo, L.d) - Date.UTC(hl.y, hl.mo, hl.d)) / 864e5) : 0;
      return { city: c, ...L, time: k.t, ap: k.ap, day: DAYS[L.dow], dayDiff: dd, status: st, home: c === homeC };
    });
  }
  function copyText(at, prefs, label) {
    return (label ? label + '\n' : '') + rowsAt(at, prefs).map(r => `${r.day} ${r.time}${r.ap ? ' ' + r.ap : ''}: ${r.city.name}`).join('\n');
  }

  g.TL = { CITY, byName, ABBR, DAYS, offset, local, status, clock, parse, looksLikeTime, defaults, rowsAt, copyText };
})(globalThis);
