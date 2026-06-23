const puppeteer = require('../frontend/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('../frontend/node_modules/express');

// Setup a temporary express server to serve the build directory
const BUILD_DIR = path.resolve(__dirname, '../frontend/build');
const app = express();
app.use(express.static(BUILD_DIR));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const preRendered = path.join(BUILD_DIR, req.path, 'index.html');
  if (fs.existsSync(preRendered)) {
    res.sendFile(preRendered);
  } else {
    res.sendFile(path.join(BUILD_DIR, 'index.html'));
  }
});

let server;
const PORT = 45999;

async function startServer() {
  return new Promise((resolve) => {
    server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`[test-server] Serving static build at http://127.0.0.1:${PORT}`);
      resolve();
    });
  });
}

async function stopServer() {
  if (server) {
    server.close();
    console.log('[test-server] Stopped');
  }
}

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'About Page', path: '/about' },
  { name: 'Blog Article', path: '/blog/async-first-remote-team-operating-system' },
  { name: 'Time Zone Hub', path: '/time-zone-converter' }
];

async function measurePage(browser, pageInfo) {
  const page = await browser.newPage();
  
  // Set viewport to a standard mobile width to test mobile metrics
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

  // Record resource requests
  const resources = [];
  page.on('response', (res) => {
    const url = res.url();
    const contentType = res.headers()['content-type'] || '';
    res.buffer().then(buf => {
      resources.push({
        url,
        contentType,
        size: buf.length
      });
    }).catch(() => {});
  });

  // Inject performance observers before the page loads
  await page.evaluateOnNewDocument(() => {
    window.fcp = 0;
    window.lcp = 0;
    window.cls = 0;

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        window.lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const url = `http://127.0.0.1:${PORT}${pageInfo.path}`;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

  // Wait a bit to ensure LCP/CLS settle
  await new Promise(r => setTimeout(r, 1000));

  // Extract Web Vitals and DOM metrics
  const metrics = await page.evaluate(() => {
    return {
      fcp: window.fcp || 0,
      lcp: window.lcp || 0,
      cls: window.cls || 0,
      domNodes: document.getElementsByTagName('*').length
    };
  });

  // Calculate resource categories
  let jsTransferred = 0;
  let cssTransferred = 0;
  let imageTransferred = 0;

  resources.forEach(r => {
    if (r.contentType.includes('javascript')) {
      jsTransferred += r.size;
    } else if (r.contentType.includes('css')) {
      cssTransferred += r.size;
    } else if (r.contentType.includes('image')) {
      imageTransferred += r.size;
    }
  });

  await page.close();

  return {
    ...pageInfo,
    ...metrics,
    jsTransferred: Math.round(jsTransferred / 1024),
    cssTransferred: Math.round(cssTransferred / 1024),
    imageTransferred: Math.round(imageTransferred / 1024)
  };
}

async function run() {
  await startServer();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('\nMeasuring baseline performance metrics...');
  const results = [];

  for (const pageInfo of PAGES) {
    try {
      const res = await measurePage(browser, pageInfo);
      results.push(res);
      console.log(`- Measured ${res.name}: FCP=${res.fcp.toFixed(0)}ms, LCP=${res.lcp.toFixed(0)}ms, CLS=${res.cls.toFixed(4)}, DOM Nodes=${res.domNodes}, JS=${res.jsTransferred}KB, CSS=${res.cssTransferred}KB, Images=${res.imageTransferred}KB`);
    } catch (err) {
      console.error(`❌ Failed to measure ${pageInfo.name}:`, err.message);
    }
  }

  await browser.close();
  await stopServer();

  console.log('\n=== Baseline Summary Table ===');
  console.table(results.map(r => ({
    Page: r.name,
    'FCP (ms)': Math.round(r.fcp),
    'LCP (ms)': Math.round(r.lcp),
    CLS: parseFloat(r.cls.toFixed(4)),
    'DOM Nodes': r.domNodes,
    'JS (KB)': r.jsTransferred,
    'CSS (KB)': r.cssTransferred,
    'Images (KB)': r.imageTransferred
  })));
}

run().catch(console.error);
