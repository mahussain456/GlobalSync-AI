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
  cwd: path.join(__dirname, '..'),
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    ...(chromePath ? { PUPPETEER_EXECUTABLE_PATH: chromePath } : {}),
  },
});

// Update BUILD_INFO.json based on actual result
info.react_snap_ran = result.status === 0;
info.react_snap_exit_code = result.status;
info.react_snap_signal = result.signal || null;
info.react_snap_error = result.error ? result.error.message : null;

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
