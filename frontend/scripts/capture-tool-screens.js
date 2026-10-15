#!/usr/bin/env node
// Captures real screenshots of the tools for the homepage proof strip.
// Usage: BASE=http://localhost:3000 node scripts/capture-tool-screens.js   (defaults to the live site)
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const sharp = require("sharp");

const BASE = process.env.BASE || "https://www.globalsync-ai.com";
const OUT = path.join(__dirname, "..", "public", "screens");
const SHOTS = [
  ["time-zone-converter", "/time-zone-converter"],
  ["meeting-planner", "/meeting-planner"],
  ["currency-converter", "/currency-converter"],
  ["invoice-builder", "/invoice"],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  // Decline optional cookies first so no banner or analytics appear in the shots.
  await page.goto(BASE + "/privacy-policy", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("gs_cookie_consent", "declined"));
  for (const [name, route] of SHOTS) {
    await page.goto(BASE + route, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 2500));
    // Skip the site header so the tool itself fills the frame.
    const top = await page.evaluate(() => {
      const main = document.querySelector("main, h1");
      return main ? Math.max(0, Math.round(main.getBoundingClientRect().top + window.scrollY) - 24) : 0;
    });
    const png = await page.screenshot({ clip: { x: 0, y: top, width: 1280, height: 800 } });
    await sharp(png).resize(640, 400).webp({ quality: 82 }).toFile(path.join(OUT, `${name}.webp`));
    console.log(`${name}.webp from ${route}`);
  }
  await browser.close();
})();
