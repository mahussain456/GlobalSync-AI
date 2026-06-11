#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load configurations
const BUILD_DIR = path.join(__dirname, '../build');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const routes = (pkg.reactSnap && pkg.reactSnap.include) || [];

// Retrieve key from environment variable (do not hardcode)
const indexNowKey = process.env.INDEXNOW_KEY;

if (!indexNowKey) {
  console.log('\n[IndexNow] No INDEXNOW_KEY environment variable found.');
  console.log('[IndexNow] Skipping IndexNow URL submission. To enable:');
  console.log('  1. Generate a key at https://www.bing.com/indexnow');
  console.log('  2. Define the environment variable INDEXNOW_KEY during build.');
  console.log('  3. The build pipeline will automatically verify the key and submit all routes.');
  process.exit(0);
}

// 1. Generate the verification text file in the build directory
const keyFileName = `${indexNowKey}.txt`;
const keyFilePath = path.join(BUILD_DIR, keyFileName);

try {
  fs.writeFileSync(keyFilePath, indexNowKey, 'utf8');
  console.log(`[IndexNow] Wrote verification file: build/${keyFileName}`);
} catch (err) {
  console.error('[IndexNow] Failed to write key verification file:', err.message);
  process.exit(1);
}

// 2. Prepare URLs to submit (exclude private/app routes and 404)
const EXCLUDE = new Set(['/dashboard', '/404']);
const host = 'www.globalsync-ai.com';
const urlList = routes
  .filter(route => !EXCLUDE.has(route))
  .map(route => `https://${host}${route}`);

console.log(`[IndexNow] Submitting ${urlList.length} URLs to IndexNow...`);

// 3. Make POST request to IndexNow API
const data = JSON.stringify({
  host: host,
  key: indexNowKey,
  keyLocation: `https://${host}/${keyFileName}`,
  urlList: urlList
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('[IndexNow] URLs submitted successfully!');
    } else {
      console.error(`[IndexNow] Submission failed with status code ${res.statusCode}:`, body);
    }
  });
});

req.on('error', (err) => {
  console.error('[IndexNow] Request error:', err.message);
});

req.write(data);
req.end();
