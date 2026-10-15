#!/usr/bin/env node
// Generates correctly sized favicons from the 1024px brand icon.
// Source: public/brand/icon-source.png (ivory "g" on forest green, the app icon). Run: node scripts/generate-favicons.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");
const SOURCE = path.join(PUBLIC, "brand", "icon-source.png");

// Small sizes get a slightly tighter crop so the "g" stays legible at 16px.
const OUTPUTS = [
  { file: "favicon-16.png", size: 16, crop: 0.13 },
  { file: "favicon-32.png", size: 32, crop: 0.16 },
  { file: "favicon-48.png", size: 48, crop: 0.12 },
  // iOS rounds this itself and paints transparent corners black, so keep it full-bleed.
  { file: "apple-touch-icon.png", size: 180, crop: 0, square: true },
  { file: "favicon-180.png", size: 180, crop: 0 },
  { file: "favicon-192.png", size: 192, crop: 0 },
  { file: "favicon-512.png", size: 512, crop: 0 },
];

async function render(size, crop, square = false) {
  const meta = await sharp(SOURCE).metadata();
  const inset = Math.round(meta.width * crop);
  return sharp(SOURCE)
    .extract({ left: inset, top: inset, width: meta.width - inset * 2, height: meta.height - inset * 2 })
    .resize(size, size, { kernel: "lanczos3" })
    // Rounded corners (22% radius), transparent outside, like the app icon.
    .composite(square ? [] : [{ input: Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#fff"/></svg>`), blend: "dest-in" }])
    .png({ compressionLevel: 9, palette: size >= 180 })
    .toBuffer();
}

// Minimal ICO writer: PNG-compressed entries are valid in every current browser.
function ico(entries) {
  const header = Buffer.alloc(6 + entries.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = header.length;
  entries.forEach(({ size, data }, i) => {
    const o = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, o);
    header.writeUInt8(size >= 256 ? 0 : size, o + 1);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(data.length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...entries.map((e) => e.data)]);
}

(async () => {
  const made = {};
  for (const { file, size, crop, square } of OUTPUTS) {
    const png = await render(size, crop, square);
    if (!square) made[size] = png;
    fs.writeFileSync(path.join(PUBLIC, file), png);
    console.log(`${file} ${size}x${size} ${png.length} bytes`);
  }
  fs.writeFileSync(path.join(PUBLIC, "favicon.ico"), ico([16, 32, 48].map((size) => ({ size, data: made[size] }))));
  console.log("favicon.ico 16/32/48");
})();
