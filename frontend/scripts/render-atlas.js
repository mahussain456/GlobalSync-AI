#!/usr/bin/env node
// Renders public/atlas/world-atlas.svg to world-atlas.webp in Chrome, so every
// browser shows the same paper relief (SVG lighting filters differ across engines).
// Needs the dev server running: BASE=http://localhost:3000 node scripts/render-atlas.js
const path = require("path");
const puppeteer = require("puppeteer");
const sharp = require("sharp");
const BASE = process.env.BASE || "http://localhost:3123";
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 378, deviceScaleFactor: 2.4 });
  await page.goto(`${BASE}/atlas/world-atlas.svg`, { waitUntil: "networkidle0" });
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1000, height: 378 } });
  const out = path.join(__dirname, "..", "public", "atlas", "world-atlas.webp");
  const info = await sharp(png).webp({ quality: 82 }).toFile(out);
  console.log(`world-atlas.webp ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
  await browser.close();
})();
