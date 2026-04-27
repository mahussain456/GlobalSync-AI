/**
 * Runs react-snap and writes build/BUILD_INFO.json.
 * react_snap_ran is set true ONLY if react-snap exits 0.
 * Always exits 0 so the build pipeline continues regardless.
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const INFO_PATH = path.join(BUILD_DIR, 'BUILD_INFO.json');
const APP_ROOT = path.join(__dirname, '..');
const PUBLIC_ORIGIN = 'https://www.globalsync-ai.com';
const BRAND = 'GlobalSync AI';
const OG_IMAGE = `${PUBLIC_ORIGIN}/globalsync-ai-logo-1600x400.png`;
const DEFAULT_DESCRIPTION = 'Free AI-powered time zone converter, meeting planner, world clock, and live currency rates for remote teams, freelancers, and digital nomads.';

// Resolve git commit SHA
let gitCommit = process.env.GIT_COMMIT_SHA || process.env.COMMIT_SHA || 'unknown';
if (gitCommit === 'unknown') {
  try {
    gitCommit = execSync('git rev-parse HEAD', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..', '..'),
      timeout: 5000,
    }).trim();
  } catch (_) {}
}

// Write BUILD_INFO with react_snap_ran=false — gets updated only after snap succeeds
const info = {
  build_timestamp: new Date().toISOString(),
  git_commit_sha: gitCommit,
  react_snap_ran: false,
  react_snap_exit_code: null,
  react_snap_signal: null,
};

try {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.writeFileSync(INFO_PATH, JSON.stringify(info, null, 2));
  console.log('[build-info] Initial BUILD_INFO.json written — react_snap_ran=false');
} catch (err) {
  console.error('[build-info] Failed to write initial BUILD_INFO.json:', err.message);
}

// Run react-snap synchronously, capturing exit code
const snapBin = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'react-snap.cmd' : 'react-snap'
);
console.log('[build-info] Starting react-snap...');

const chromeCandidates = process.platform === 'win32'
  ? [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]
  : [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ];

const chromePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (chromePath) {
  console.log(`[build-info] Using browser for react-snap: ${chromePath}`);
}

const result = spawnSync(snapBin, [], {
  stdio: 'inherit',
  cwd: APP_ROOT,
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    ...(chromePath ? { PUPPETEER_EXECUTABLE_PATH: chromePath } : {}),
  },
});

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getFallbackMeta(route) {
  const normalizedRoute = route === '/404.html' ? '/404' : route;
  const noIndexRoutes = new Set(['/dashboard', '/admin', '/news', '/404']);
  const meta = {
    title: `${BRAND} | Time Zone Converter, Meeting Planner & Currency Converter`,
    description: DEFAULT_DESCRIPTION,
    canonical: `${PUBLIC_ORIGIN}${normalizedRoute === '/' ? '/' : normalizedRoute}`,
    robots: noIndexRoutes.has(normalizedRoute)
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  };

  if (normalizedRoute === '/time-zone-converter') {
    meta.title = `Free Time Zone Converter | World Clock & City Time Comparison | ${BRAND}`;
    meta.description = 'Compare live time across cities worldwide, convert time zones instantly, and find business-hour overlaps for global meetings.';
  } else if (normalizedRoute === '/currency-converter') {
    meta.title = `Free Live Currency Converter | 160+ Currencies & Real-Time Rates | ${BRAND}`;
    meta.description = 'Convert 160+ currencies with live exchange rates, popular currency pairs, and simple tools for freelancers and global teams.';
  } else if (normalizedRoute === '/meeting-planner') {
    meta.title = `Meeting Planner | Find Best Overlap Time | ${BRAND}`;
    meta.description = 'Find the best meeting time across multiple cities with business-hour overlap planning for remote teams.';
  } else if (normalizedRoute === '/blog') {
    meta.title = `Blog | Remote Work, Time Zones & Currency Guides | ${BRAND}`;
    meta.description = 'Practical guides for remote teams, freelancers, and digital nomads working across time zones and currencies.';
  } else if (normalizedRoute.startsWith('/blog/')) {
    const title = titleFromSlug(normalizedRoute.split('/').pop()).replace(/\bUsd\b/g, 'USD').replace(/\bInr\b/g, 'INR').replace(/\bEur\b/g, 'EUR').replace(/\bGbp\b/g, 'GBP');
    meta.title = `${title} | ${BRAND} Blog`;
    meta.description = `Read ${title}, a practical ${BRAND} guide for remote workers, freelancers, and global teams.`;
  } else if (normalizedRoute.startsWith('/time/')) {
    const pair = normalizedRoute.replace('/time/', '').split('-to-');
    const from = titleFromSlug(pair[0] || 'City');
    const to = titleFromSlug(pair[1] || 'City');
    meta.title = `${from} to ${to} Time | Overlap Planner`;
    meta.description = `Convert time between ${from} and ${to}, compare local times, and find meeting overlap windows.`;
  } else if (normalizedRoute.startsWith('/currency/')) {
    const pair = normalizedRoute.replace('/currency/', '').split('-to-');
    const from = (pair[0] || 'usd').toUpperCase();
    const to = (pair[1] || 'eur').toUpperCase();
    meta.title = `${from} to ${to} Exchange Rate | Live Converter`;
    meta.description = `Live ${from} to ${to} exchange rate with a simple currency converter for global workers and freelancers.`;
  } else if (normalizedRoute === '/about') {
    meta.title = `About ${BRAND} | Free World Clock & Currency Tools for Remote Teams`;
  } else if (normalizedRoute === '/contact') {
    meta.title = `Contact ${BRAND} | Get in Touch`;
  } else if (normalizedRoute === '/privacy-policy') {
    meta.title = `Privacy Policy | ${BRAND}`;
  } else if (normalizedRoute === '/terms-of-service') {
    meta.title = `Terms of Service | ${BRAND}`;
  } else if (normalizedRoute === '/editorial-policy') {
    meta.title = `Editorial Policy | ${BRAND}`;
  } else if (normalizedRoute === '/methodology') {
    meta.title = `Methodology | Data Sources & AI Transparency | ${BRAND}`;
  } else if (normalizedRoute === '/dashboard') {
    meta.title = `${BRAND} Dashboard | Time Zone & Currency Converter`;
  } else if (normalizedRoute === '/news') {
    meta.title = `Daily Feed | ${BRAND}`;
  } else if (normalizedRoute === '/404') {
    meta.title = `Page Not Found | ${BRAND}`;
  }

  return meta;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectMeta(html, meta) {
  const cleaned = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:(title|description|url|image|type|site_name|locale)["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:(card|title|description|image)["'][^>]*>/gi, '');

  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}">`,
    `<meta name="robots" content="${escapeHtml(meta.robots)}">`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}">`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}">`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}">`,
    `<meta property="og:site_name" content="${BRAND}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    '<meta property="og:locale" content="en_US">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
  ].join('');

  return cleaned.replace('</head>', `${tags}</head>`);
}

function writeFallbackSnapshots() {
  const pkg = JSON.parse(fs.readFileSync(path.join(APP_ROOT, 'package.json'), 'utf8'));
  const routes = (pkg.reactSnap && pkg.reactSnap.include) || ['/'];
  const shellPath = path.join(BUILD_DIR, 'index.html');
  if (!fs.existsSync(shellPath)) {
    console.error('[build-info] Cannot create fallback snapshots: build/index.html missing');
    return 0;
  }

  const shell = fs.readFileSync(shellPath, 'utf8');
  let written = 0;
  for (const route of routes) {
    const routePath = route === '/' ? shellPath : path.join(BUILD_DIR, route.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(routePath), { recursive: true });
    fs.writeFileSync(routePath, injectMeta(shell, getFallbackMeta(route)));
    written += 1;
  }

  console.log(`[build-info] Wrote ${written} browserless fallback SEO snapshots`);
  return written;
}

// Update BUILD_INFO.json based on actual result
info.react_snap_ran = result.status === 0;
info.react_snap_exit_code = result.status;
info.react_snap_signal = result.signal || null;
info.react_snap_error = result.error ? result.error.message : null;
info.fallback_snapshots_written = 0;

if (!info.react_snap_ran) {
  info.fallback_snapshots_written = writeFallbackSnapshots();
}

try {
  fs.writeFileSync(INFO_PATH, JSON.stringify(info, null, 2));
  if (result.status === 0) {
    console.log('[build-info] react-snap succeeded → react_snap_ran=true');
  } else {
    console.log(`[build-info] react-snap exited ${result.status} / signal ${result.signal} → react_snap_ran=false`);
  }
} catch (err) {
  console.error('[build-info] Failed to update BUILD_INFO.json:', err.message);
}

// Always exit 0 — server must start even if react-snap failed
process.exit(0);
