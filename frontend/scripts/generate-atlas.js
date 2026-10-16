#!/usr/bin/env node
// Builds public/atlas/world-atlas.svg: the "Living Atlas" hero illustration.
// Natural Earth land (world-atlas, 50m) in an equirectangular projection cropped to
// 80°N..56°S. The app places city pins with the same projection (src/lib/atlas.js),
// so keep W/H/LAT_N/LAT_S here and there identical. Run: node scripts/generate-atlas.js
const fs = require("fs");
const path = require("path");
const { feature } = require("topojson-client");

const W = 1000, LAT_N = 80, LAT_S = -56;
const H = Math.round((W * (LAT_N - LAT_S)) / 360); // 378
const x = (lon) => ((lon + 180) / 360) * W;
const y = (lat) => ((LAT_N - lat) / (LAT_N - LAT_S)) * H;

const topo = require("world-atlas/land-50m.json");
const land = feature(topo, topo.objects.land);

// Rings that cross the antimeridian are unwrapped to continuous longitudes, then
// drawn again shifted by 360° so both halves land inside the (clipped) frame.
function unwrap(ring) {
  const out = [];
  let offset = 0, prev = null;
  for (const [lon, lat] of ring) {
    if (prev !== null && Math.abs(lon - prev) > 180) offset += prev > lon ? 360 : -360;
    out.push([lon + offset, lat]);
    prev = lon;
  }
  return out;
}
// Project rings, drop points closer than 0.45 units, round to 0.1.
function ringPath(ring, shift = 0) {
  let d = "", last = null;
  for (const [lon0, lat] of ring) {
    const lon = lon0 + shift;
    const px = Math.round(x(lon) * 10) / 10, py = Math.round(y(lat) * 10) / 10;
    if (last && Math.hypot(px - last[0], py - last[1]) < 0.45) continue;
    d += `${d ? "L" : "M"}${px} ${py}`;
    last = [px, py];
  }
  return d ? d + "Z" : "";
}
const polys = land.features.flatMap((f) => (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates));
const d = polys
  .filter((rings) => rings[0].some(([, lat]) => lat > LAT_S)) // no Antarctica
  .map((rings) => {
    const un = rings.map(unwrap);
    const lons = un.flat().map(([lon]) => lon);
    const shifts = [0];
    if (Math.max(...lons) > 180) shifts.push(-360);
    if (Math.min(...lons) < -180) shifts.push(360);
    return shifts.map((sh) => un.map((r) => ringPath(r, sh)).join("")).join("");
  })
  .join("");

const grat = [];
for (let lon = -150; lon <= 150; lon += 30) grat.push(`M${x(lon).toFixed(1)} 0V${H}`);
for (let lat = -30; lat <= 60; lat += 30) grat.push(`M0 ${y(lat).toFixed(1)}H${W}`);

const label = (text, lat, lon, size = 9) =>
  `<text x="${x(lon).toFixed(1)}" y="${y(lat).toFixed(1)}" font-size="${size}" text-anchor="middle">${text.split("\n").map((t, i) => `<tspan x="${x(lon).toFixed(1)}" dy="${i ? size * 1.5 : 0}">${t}</tspan>`).join("")}</text>`;

// Compass rose in the South Pacific (−42°, −150°).
const cx = x(-150), cy = y(-38);
const rose = `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" fill="#80612d" stroke="none">
  <circle r="15" fill="none" stroke="#80612d" stroke-width=".6" opacity=".6"/>
  <path d="M0-20L3 0 0 20-3 0Z"/><path d="M-20 0L0-3 20 0 0 3Z" opacity=".75"/>
  <path d="M-10-10L1.5-1.5 10 10-1.5 1.5Z" opacity=".45"/><path d="M10-10L1.5 1.5-10 10-1.5-1.5Z" opacity=".45"/>
  <g font-size="7" text-anchor="middle" fill="#5b4a2a" font-family="Georgia,serif"><text y="-24">N</text><text y="30">S</text><text x="27" y="2.5">E</text><text x="-27" y="2.5">W</text></g>
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <filter id="paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 .36  0 0 0 0 .33  0 0 0 0 .26  0 0 0 .07 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="relief" x="-2%" y="-2%" width="104%" height="104%">
    <feMorphology in="SourceAlpha" operator="erode" radius=".6" result="core"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="soft"/>
    <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="5" seed="3" result="terrain"/>
    <feComposite in="terrain" in2="soft" operator="arithmetic" k1="0" k2=".5" k3=".48" k4="0" result="height"/>
    <feDiffuseLighting in="height" surfaceScale="5.5" lighting-color="#fbf6ea" diffuseConstant="1.05" result="light">
      <feDistantLight azimuth="235" elevation="38"/>
    </feDiffuseLighting>
    <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="1.35" k2="0" k3="0" k4="-.04" result="shadedAll"/>
    <feComposite in="shadedAll" in2="SourceAlpha" operator="in" result="shaded"/>
    <feOffset in="SourceAlpha" dx="1.2" dy="1.8" result="o"/>
    <feGaussianBlur in="o" stdDeviation="1.6" result="ob"/>
    <feColorMatrix in="ob" type="matrix" values="0 0 0 0 .12  0 0 0 0 .1  0 0 0 0 .06  0 0 0 .32 0" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="shaded"/></feMerge>
  </filter>
</defs>
<clipPath id="frame"><rect width="${W}" height="${H}"/></clipPath>
<rect width="${W}" height="${H}" fill="#f1ebdf"/>
<rect width="${W}" height="${H}" fill="#f1ebdf" filter="url(#paper)"/>
<path d="${grat.join("")}" fill="none" stroke="#80612d" stroke-width=".35" opacity=".22" stroke-dasharray="1.5 3"/>
<g clip-path="url(#frame)"><path d="${d}" fill="#4f7d61" stroke="#2c4f3c" stroke-width=".35" stroke-linejoin="round" filter="url(#relief)"/></g>
<g font-family="Georgia,'Times New Roman',serif" font-style="italic" fill="#6f6a58" letter-spacing="3.5" opacity=".8">
  ${label("ATLANTIC\nOCEAN", 18, -42)}
  ${label("PACIFIC\nOCEAN", 8, -138)}
  ${label("PACIFIC\nOCEAN", -8, 172)}
  ${label("INDIAN\nOCEAN", -26, 78)}
</g>
${rose}
</svg>`;

const out = path.join(__dirname, "..", "public", "atlas", "world-atlas.svg");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`world-atlas.svg ${W}x${H}, ${(svg.length / 1024).toFixed(0)} KB, ${polys.length} land polygons`);
