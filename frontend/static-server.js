/**
 * GlobalSync AI — Static file server
 * Serves react-snap pre-rendered HTML files per-route.
 * Falls back to root index.html (SPA) for non-pre-rendered routes.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const BUILD_DIR = path.join(__dirname, 'build');

// Serve static assets (JS, CSS, images, fonts) — no automatic directory index
app.use(express.static(BUILD_DIR, { index: false, redirect: false }));

// HTML routing: serve pre-rendered file if it exists, else SPA root fallback
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
