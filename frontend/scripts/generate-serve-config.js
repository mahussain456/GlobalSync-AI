#!/usr/bin/env node
/**
 * Generates build/serve.json with explicit rewrites for every react-snap
 * pre-rendered route. This makes `serve -s build --single` (the Emergent
 * production serving layer) route correctly to per-route HTML files instead
 * of always falling back to root index.html.
 *
 * Only adds a rewrite for routes where the pre-rendered file actually exists,
 * so a failed react-snap crawl gracefully falls back to the SPA root.
 */
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const routes = (pkg.reactSnap && pkg.reactSnap.include) || [];

const rewrites = [];
for (const route of routes) {
  if (route === '/') continue;
  const preRenderedFile = path.join(BUILD_DIR, route, 'index.html');
  if (fs.existsSync(preRenderedFile)) {
    rewrites.push({ source: route, destination: route + '/index.html' });
  }
}

const serveConfig = { rewrites };
fs.writeFileSync(path.join(BUILD_DIR, 'serve.json'), JSON.stringify(serveConfig, null, 2));
console.log(`generate-serve-config: wrote ${rewrites.length} rewrites to build/serve.json`);
