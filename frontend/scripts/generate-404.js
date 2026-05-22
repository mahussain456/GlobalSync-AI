#!/usr/bin/env node
/**
 * Vercel auto-serves /404.html with HTTP 404 status for unmatched URLs.
 * react-snap pre-renders /404 to build/404/index.html, so we copy it to
 * build/404.html. If pre-rendering failed, fall back to the SPA shell so the
 * client-side router still resolves the NotFound route.
 */
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const SOURCE = path.join(BUILD_DIR, '404', 'index.html');
const FALLBACK = path.join(BUILD_DIR, 'index.html');
const TARGET = path.join(BUILD_DIR, '404.html');

let src;
if (fs.existsSync(SOURCE)) {
  src = SOURCE;
  console.log('[generate-404] Using pre-rendered build/404/index.html');
} else if (fs.existsSync(FALLBACK)) {
  src = FALLBACK;
  console.warn('[generate-404] Pre-rendered /404 missing — falling back to build/index.html');
} else {
  console.error('[generate-404] No source HTML found — skipping');
  process.exit(0);
}

fs.copyFileSync(src, TARGET);
console.log(`[generate-404] Wrote ${TARGET}`);
