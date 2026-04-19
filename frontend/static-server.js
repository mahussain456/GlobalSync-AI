/**
 * GlobalSync AI — Static file server
 * Serves react-snap pre-rendered HTML files per-route.
 * Falls back to root index.html (SPA shell) for non-pre-rendered routes.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const BUILD_DIR = path.join(__dirname, 'build');

// ── Diagnostic helpers ────────────────────────────────────────────────────────
function extractTitle(htmlPath) {
  if (!fs.existsSync(htmlPath)) return null;
  try {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const m = html.match(/<title>([^<]*)<\/title>/i);
    return m ? m[1] : null;
  } catch (_) {
    return null;
  }
}

const SKIP_DIRS = new Set(['static', 'media', 'fonts', 'icons']);

function countPreRenderedPages(dir, isRoot = true) {
  let count = isRoot && fs.existsSync(path.join(dir, 'index.html')) ? 1 : 0;
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
        const sub = path.join(dir, entry.name);
        if (fs.existsSync(path.join(sub, 'index.html'))) count++;
        count += countPreRenderedPages(sub, false);
      }
    }
  } catch (_) {}
  return count;
}

const ROUTES_TO_CHECK = [
  '/',
  '/time-zone-converter',
  '/currency-converter',
  '/meeting-planner',
  '/time/new-york-to-london',
  '/currency/usd-to-inr',
  '/blog/best-free-time-zone-converter-remote-teams-2026',
  '/blog/remote-work-time-zones-productivity-guide',
  '/blog/best-currency-to-invoice-freelancers-usd-eur-gbp',
];

// ── /build-info — BEFORE static handler so it's never shadowed ───────────────
// Note: in production, /api/build-info is served by FastAPI (port 8001).
// This endpoint is served by this Node process and accessible at /build-info.
app.get('/build-info', (req, res) => {
  let buildInfo = null;
  try {
    buildInfo = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, 'BUILD_INFO.json'), 'utf8'));
  } catch (_) {}

  const perRouteTitles = {};
  for (const route of ROUTES_TO_CHECK) {
    const htmlPath = route === '/'
      ? path.join(BUILD_DIR, 'index.html')
      : path.join(BUILD_DIR, ...route.replace(/^\//, '').split('/'), 'index.html');
    perRouteTitles[route] = extractTitle(htmlPath);
  }

  const payload = {
    now: new Date().toISOString(),
    build_timestamp: buildInfo ? buildInfo.build_timestamp : null,
    git_commit_sha: buildInfo ? buildInfo.git_commit_sha : null,
    react_snap_ran: buildInfo ? buildInfo.react_snap_ran : null,
    react_snap_exit_code: buildInfo ? buildInfo.react_snap_exit_code : null,
    react_snap_page_count: countPreRenderedPages(BUILD_DIR),
    per_route_titles: perRouteTitles,
    server_process_argv: process.argv.join(' '),
    server_script_path: __filename,
    node_version: process.version,
  };

  res.set('Cache-Control', 'no-store, max-age=0');
  res.json(payload);
});

// ── Static assets (JS/CSS/images) ────────────────────────────────────────────
app.use(express.static(BUILD_DIR, { index: false, redirect: false }));

// ── HTML routing — serve pre-rendered file or SPA fallback ───────────────────
app.get('*', (req, res) => {
  const urlPath = req.path.replace(/\/+$/, '') || '/';
  const preRendered = urlPath === '/'
    ? path.join(BUILD_DIR, 'index.html')
    : path.join(BUILD_DIR, urlPath, 'index.html');

  if (fs.existsSync(preRendered)) {
    res.sendFile(preRendered);
  } else {
    res.sendFile(path.join(BUILD_DIR, 'index.html'));
  }
});

app.listen(PORT, HOST, () => {
  console.log(`GlobalSync AI serving at http://${HOST}:${PORT}`);
});
