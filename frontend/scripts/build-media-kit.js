#!/usr/bin/env node
// Builds public/media-kit/ (individual files) and public/media-kit/globalsync-ai-media-kit.zip.
// Facts here must match what the site already states. Run: node scripts/build-media-kit.js
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");
const OUT = path.join(PUBLIC, "media-kit");
fs.mkdirSync(OUT, { recursive: true });

const BRAND = {
  company: "GlobalSync AI is a free, no-signup set of browser tools for people who work across borders: a time zone converter covering 85+ cities, a meeting planner that finds a time inside everyone's working hours for up to five cities, a currency converter with live rates for 160+ currencies, a freelance rate calculator, an invoice builder that exports PDFs, and a free desktop world clock for Windows and Mac. It was founded in 2026 and is built and run by Ahmed Hussain.",
  // Same text as the published author page (src/pages/AuthorPage.js). Keep them in sync.
  founderBio: "Ahmed Hussain is the founder of GlobalSync AI. With over a decade of experience in software engineering and managing distributed international teams, he designs free, data-driven tools that resolve the daily friction of working across multiple time zones and currencies.",
  colors: [
    ["Forest", "#0E2A1F", "Primary text, dark panels"],
    ["Pine", "#1B4D3E", "Buttons, links, accents"],
    ["Ivory", "#F4EFE6", "Page background"],
    ["Gold", "#C8A96A", "The only accent colour; highlights and the -ai in the wordmark"],
    ["Sage", "#A7BFAE", "Secondary text on dark panels"],
  ],
  fonts: "Headings: Playfair Display. Body: DM Sans (homepage) and Inter (tool pages). Both free on Google Fonts.",
  contact: "press@globalsync-ai.com",
  site: "https://www.globalsync-ai.com",
};

const README = `GlobalSync AI media kit
=======================

About GlobalSync AI
-------------------
${BRAND.company}

Founder bio
-----------
${BRAND.founderBio}

Brand colours
-------------
${BRAND.colors.map(([n, hex, use]) => `${n.padEnd(7)} ${hex}   ${use}`).join("\n")}

Typography
----------
${BRAND.fonts}

Files
-----
logo-wordmark.png            Full wordmark, transparent background (for light backgrounds)
logo-wordmark-on-dark.png    Full wordmark on forest green
icon-512.png                 App icon, ivory "g" on forest green
icon-light-512.png           App icon, forest "g" on ivory
brand-colors.png             Colour swatches

Usage
-----
Use the logos as provided: don't recolour, stretch or add effects. Leave clear space of
at least 10% of the logo's width around it. Write the name as "GlobalSync AI".

Press contact: ${BRAND.contact}
Website: ${BRAND.site}
`;

// Small store-only ZIP writer (no compression dependency needed beyond zlib's crc32).
function zip(files) {
  const crcTable = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc32 = (buf) => { let c = -1; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const local = [], central = []; let offset = 0;
  for (const { name, data } of files) {
    const deflated = zlib.deflateRawSync(data);
    const nameBuf = Buffer.from(name), crc = crc32(data);
    const head = Buffer.alloc(30); head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(8, 8);
    head.writeUInt32LE(crc, 14); head.writeUInt32LE(deflated.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(nameBuf.length, 26);
    local.push(head, nameBuf, deflated);
    const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(8, 10);
    cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(deflated.length, 20); cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(nameBuf.length, 28); cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);
    offset += head.length + nameBuf.length + deflated.length;
  }
  const cenBuf = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cenBuf.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, cenBuf, end]);
}

// Forest letters become ivory; the gold "-ai" stays gold.
async function onDark(file, width) {
  const { data, info } = await sharp(file).resize({ width }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const isGold = r > 120 && r - b > 40;
    if (!isGold) { data[i] = 0xf4; data[i + 1] = 0xef; data[i + 2] = 0xe6; }
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

(async () => {
  const wordmark = path.join(PUBLIC, "meridian", "logo-finished.png");
  const files = {
    "logo-wordmark.png": await sharp(wordmark).resize({ width: 1600 }).png().toBuffer(),
    "logo-wordmark-on-dark.png": await sharp({ create: { width: 1800, height: 700, channels: 4, background: "#0E2A1F" } })
      .composite([{ input: await onDark(wordmark, 1500), gravity: "center" }]).png().toBuffer(),
    "icon-512.png": await sharp(path.join(PUBLIC, "brand", "icon-source.png")).resize(512, 512).png().toBuffer(),
    "icon-light-512.png": await sharp(path.join(PUBLIC, "meridian", "logo-original-icon.png")).resize(512, 512).png().toBuffer(),
    "brand-colors.png": await sharp({ create: { width: 1000, height: 200, channels: 3, background: "#ffffff" } })
      .composite(BRAND.colors.map(([, hex], i) => ({ input: { create: { width: 200, height: 200, channels: 3, background: hex } }, left: i * 200, top: 0 }))).png().toBuffer(),
    "README.txt": Buffer.from(README),
  };
  for (const [name, data] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), data);
  fs.writeFileSync(path.join(OUT, "globalsync-ai-media-kit.zip"), zip(Object.entries(files).map(([name, data]) => ({ name: `globalsync-ai-media-kit/${name}`, data }))));
  console.log("media kit:", Object.keys(files).join(", "), "+ zip");
})();
