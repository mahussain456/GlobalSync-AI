// Draws a city's sky + skyline as an SVG string for a given local hour.
// Coordinates: viewBox 300x96, ground at y=96. Landmarks are authored with ground at y=80
// and centred on x=150, then shifted into place.
(function () {
  const PALETTES = {
    night:   { sky: ['#04110c', '#0a2219', '#16392d'], glow: null,      far: 0.55, near: '#020a07' },
    dawn:    { sky: ['#1a3836', '#76675f', '#e2ae73'], glow: '#f3c27f', far: 0.42, near: '#0b1c16' },
    morning: { sky: ['#4c7c79', '#9dbdb0', '#eee0c1'], glow: '#fbe7bd', far: 0.30, near: '#10271f' },
    day:     { sky: ['#5b8c92', '#a2c3ba', '#e4e6d2'], glow: null,      far: 0.28, near: '#10271f' },
    golden:  { sky: ['#294840', '#a57a50', '#e9b86b'], glow: '#f6c878', far: 0.40, near: '#0b1c16' },
    dusk:    { sky: ['#0c231d', '#48384a', '#b0684f'], glow: '#d98059', far: 0.50, near: '#06130e' },
  };

  // Paper theme: the site's paper-atlas look — cream/sage washes, forest silhouettes, gold light.
  const PAPER = {
    night:   { sky: ['#c9d2cb', '#dcdfd6', '#ebe6da'], glow: null,      far: 0.55, near: '#173f33' },
    dawn:    { sky: ['#dcd8d0', '#ecdcc4', '#f3e6d0'], glow: '#e9c58a', far: 0.45, near: '#1B4D3E' },
    morning: { sky: ['#d8e4dd', '#e9ece2', '#f4eee2'], glow: '#f1dcaa', far: 0.40, near: '#1B4D3E' },
    day:     { sky: ['#d3e2da', '#e6ece3', '#f3efe5'], glow: null,      far: 0.40, near: '#1B4D3E' },
    golden:  { sky: ['#e2dccb', '#eed9b4', '#f4e6cc'], glow: '#e7bf78', far: 0.45, near: '#1B4D3E' },
    dusk:    { sky: ['#d4ccd0', '#e6d4c6', '#f0e2d4'], glow: '#dca47a', far: 0.50, near: '#173f33' },
  };

  function period(h) {
    if (h < 5 || h >= 20.5) return 'night';
    if (h < 7) return 'dawn';
    if (h < 10) return 'morning';
    if (h < 16) return 'day';
    if (h < 18.5) return 'golden';
    return 'dusk';
  }

  function rng(seed) {
    let s = 2166136261;
    for (const ch of seed) s = Math.imul(s ^ ch.charCodeAt(0), 16777619) >>> 0;
    return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  }

  // Golden Gate suspenders follow the main cable: x = 91 + 118t, y = 9 + 130t - 130t²
  const suspenders = [0.12, 0.24, 0.36, 0.5, 0.64, 0.76, 0.88]
    .map(t => { const x = 91 + 118 * t, y = 9 + 130 * t - 130 * t * t; return `M${x.toFixed(1)} ${y.toFixed(1)}V56`; }).join('');

  const LANDMARKS = {
    goldengate: { fill: ['M88 8h6v72h-6z', 'M206 8h6v72h-6z', 'M0 56h300v3H0z', 'M88 24h6v2h-6zM206 24h6v2h-6z'],
      stroke: 'M0 46Q50 42 91 9M91 9Q150 74 209 9M209 9Q250 42 300 46' + suspenders, dx: 0 },
    empirestate: { fill: ['M132 80V42h4v-6h24v6h4v38z', 'M139 36V26h22v10z', 'M143 26V16h14v10z', 'M147 16V8h6v8z', 'M149.4 8V0h1.2v8z'], dx: -8 },
    bigben: { fill: ['M196 80V16h14v64z', 'M194 16l9-14 9 14z', 'M202.4 2V-3h1.2v5z', 'M92 80V52h104v28z', 'M84 80V32h14v48z', 'M84 32l7-7 7 7z',
      ...Array.from({ length: 8 }, (_, i) => `M${104 + i * 11} 52v-6h2v6z`)], clock: [203, 26, 3.4], dx: -12 },
    burj: { fill: ['M138 80L141 62h2l2-18h1.5l1.5-18h1l.6-26h.8l.6 26h1l1.5 18h1.5l2 18h2l3 18z', 'M118 80v-6h64v6z'], dx: -10 },
    tokyotower: { fill: ['M130 80L146.5 24h7L170 80h-6L151.5 42h-3L136 80z', 'M141 40h18v3h-18z', 'M144.5 24h11v3h-11z', 'M148.6 24V2h2.8v22z'], nightFill: '#d4643a', dx: -8 },
    eiffel: { fill: ['M134 80Q146 52 147.8 22L149.2 2h1.6l1.4 20Q154 52 166 80h-7Q153 62 150 62T141 80z', 'M141 50h18v2.5h-18z', 'M145.5 26h9v2h-9z'], dx: -10 },
    opera: { fill: ['M104 80V70h96v10z', 'M112 70Q120 44 142 40L134 70z', 'M130 70Q142 36 166 33L152 70z', 'M150 70Q166 46 186 46L174 70z'],
      stroke: 'M-6 66Q44 24 94 66M-6 66h100', dx: 10 },
    charminar: { fill: ['M127 80V16h6v64z', 'M167 80V16h6v64z', 'M129 38h42v3h-42z'], hole: 'M131 80V41h38v39zM143 80V66Q150 54 157 66V80z',
      domes: [[130, 13, 4], [170, 13, 4]], dx: -10 },
    marinabay: { fill: ['M117 80L119 28h9l2 52z', 'M144 80L146 28h9l2 52z', 'M171 80L173 28h9l2 52z', 'M106 22h88l6 5h-94z'], dx: -8 },
    cntower: { fill: ['M149 0h2l.5 20h1.5l1 20 4 2v4l-4 2-1 32h-6l-1-32-4-2v-4l4-2 1-20h1.5z'], dx: -10 },
    spaceneedle: { fill: ['M149.5 0h1l.1 12 11.4 6v3h-24v-3l11.4-6z', 'M146 21h8l-2 29 3 30h-10l3-30z'], dx: -10 },
    kingdom: { fill: [], hole: 'M134 80V24Q150-4 166 24V80zM143 32Q150 14 157 32v4h-14z', bar: 'M142 36h16v2h-16z', dx: -10 },
    pearl: { fill: ['M148.5 0h3v80h-3z', 'M141 80l6-24h6l6 24h-3l-5-18h-2l-5 18z'], domes: [[150, 52, 7], [150, 27, 5], [150, 10, 2.4]], dx: -10 },
  };

  function buildings(r, { count, minH, maxH, quiet }, night, windowsOut) {
    let x = -4, out = '';
    while (x < 304) {
      const w = 7 + r() * 16;
      const inQuiet = quiet && x > quiet[0] && x < quiet[1];
      const h = inQuiet ? minH * 0.6 + r() * minH * 0.6 : minH + r() * (maxH - minH);
      out += `M${x.toFixed(1)} 96V${(96 - h).toFixed(1)}h${w.toFixed(1)}V96z`;
      if (r() < 0.12 && !inQuiet) out += `M${(x + w / 2 - 0.6).toFixed(1)} ${(96 - h).toFixed(1)}v-6h1.2v6z`;
      if (night && windowsOut) for (let wy = 96 - h + 4; wy < 92; wy += 5) for (let wx = x + 2; wx < x + w - 2.5; wx += 3.6)
        if (r() < 0.22) windowsOut.push(`M${wx.toFixed(1)} ${wy.toFixed(1)}h1.5v2h-1.5z`);
      x += w + (r() < 0.25 ? 1.5 : 0);
    }
    return out;
  }

  const cache = new Map();

  window.drawScene = function (city, hour, theme) {
    const bucket = Math.floor(hour * 6);                 // redraw every 10 local minutes
    const paper = theme === 'paper';
    const key = `${city.id}|${city.landmark || ''}|${bucket}|${paper ? 'p' : 'f'}`;
    if (cache.has(key)) return cache.get(key);

    const p = period(hour), pal = (paper ? PAPER : PALETTES)[p], night = p === 'night' || p === 'dusk';
    const r = rng(city.name + city.tz);
    const uid = `s${Math.abs(key.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7))}`;
    const lm = LANDMARKS[city.landmark];
    const windows = [];

    let svg = `<svg viewBox="0 0 300 96" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs><linearGradient id="${uid}g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${pal.sky[0]}"/><stop offset=".62" stop-color="${pal.sky[1]}"/><stop offset="1" stop-color="${pal.sky[2]}"/></linearGradient>
        <radialGradient id="${uid}o"><stop offset="0" stop-color="#fff6dc" stop-opacity=".95"/><stop offset=".35" stop-color="#f3d49a" stop-opacity=".55"/><stop offset="1" stop-color="#f3d49a" stop-opacity="0"/></radialGradient></defs>
      <rect width="300" height="96" fill="url(#${uid}g)"/>`;

    // stars
    if (p === 'night') {
      let stars = '';
      for (let i = 0; i < 26; i++) stars += `<circle cx="${(r() * 300).toFixed(1)}" cy="${(r() * 52).toFixed(1)}" r="${(0.3 + r() * 0.6).toFixed(2)}" opacity="${(0.35 + r() * 0.6).toFixed(2)}"/>`;
      svg += `<g fill="${paper ? '#1B4D3E' : '#f4efe6'}" opacity="${paper ? 0.45 : 1}">${stars}</g>`;
    }
    // sun / moon arc
    const isDay = hour >= 6 && hour < 18.5;
    const t = isDay ? (hour - 6) / 12.5 : (((hour - 18.5) + 24) % 24) / 11.5;
    const cx = 18 + 264 * t, cy = 78 - 62 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    if (isDay) svg += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="26" fill="url(#${uid}o)"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4.2" fill="${paper ? '#C8A96A' : '#fff4d6'}"/>`;
    else svg += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="14" fill="${paper ? '#1B4D3E' : '#c8d4c9'}" opacity="${paper ? 0.06 : 0.08}"/><path transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" d="M1.8-4.6A4.8 4.8 0 1 0 4.6 2.2 3.8 3.8 0 1 1 1.8-4.6z" fill="${paper ? '#9C7A36' : '#efe6cf'}"/>`;
    // horizon glow
    if (pal.glow) svg += `<ellipse cx="150" cy="96" rx="190" ry="26" fill="${pal.glow}" opacity=".35"/>`;

    // far layer, near layer (quiet in the middle when a landmark owns the stage)
    const quiet = lm ? [110 + (lm.dx || 0), 190 + (lm.dx || 0)] : null;
    svg += `<path d="${buildings(r, { minH: 10, maxH: 34 }, false)}" fill="${paper ? '#A7BFAE' : '#0E2A1F'}" opacity="${pal.far}"/>`;

    if (lm) {
      const tr = `translate(${lm.dx || 0} 16)`;
      const col = night && lm.nightFill ? lm.nightFill : pal.near;
      svg += `<g transform="${tr}" fill="${col}">`;
      if (lm.fill.length) svg += `<path d="${lm.fill.join('')}"/>`;
      if (lm.hole) svg += `<path fill-rule="evenodd" d="${lm.hole}"/>`;
      if (lm.bar) svg += `<path d="${lm.bar}"/>`;
      if (lm.domes) svg += lm.domes.map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}"/>`).join('');
      if (lm.stroke) svg += `<path d="${lm.stroke}" fill="none" stroke="${col}" stroke-width="1.3" stroke-linecap="round"/>`;
      if (lm.clock) svg += `<circle cx="${lm.clock[0]}" cy="${lm.clock[1]}" r="${lm.clock[2]}" fill="${night ? '#f2cf86' : '#d9d2bf'}"/>`;
      svg += `</g>`;
      if (night && lm.nightFill) svg += `<g transform="${tr}"><path d="${lm.fill.join('')}" fill="none" stroke="#ffb27a" stroke-width=".6" opacity=".8"/></g>`;
    }
    svg += `<path d="${buildings(r, { minH: 8, maxH: lm ? 30 : 46, quiet }, night, windows)}" fill="${pal.near}" opacity=".94"/>`;
    if (windows.length) svg += `<path d="${windows.join('')}" fill="#f2cf86" opacity=".8"/>`;
    svg += `</svg>`;

    if (cache.size > 400) cache.clear();
    cache.set(key, svg);
    return svg;
  };
  window.scenePeriod = period;
})();
