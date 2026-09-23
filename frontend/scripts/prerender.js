/* Render the actual application for every published route.
 * A failed renderer fails the build: never publish title-only fallback pages.
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');

const appRoot = path.resolve(__dirname, '..');
const build = path.join(appRoot, 'build');
const routes = require('../package.json').reactSnap.include;
const buildCommit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null;

async function main() {
  const app = express();
  const shell = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return res.status(503).json({ error: 'Unavailable during static rendering' });
    if (!path.extname(req.path) || req.path.endsWith('/index.html')) return res.type('html').send(shell);
    next();
  });
  app.use(express.static(build));
  
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  
  const isVercel = Boolean(process.env.VERCEL || process.env.NOW_BUILDER);
  const candidates = isVercel
    ? []
    : [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
      ].filter(Boolean);
      
  let executablePath = candidates.find(file => fs.existsSync(file));
  let launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
  let headless = true;
  
  let browser;
  try {
    if (isVercel) {
      const chromium = require('@sparticuz/chromium');
      executablePath = await chromium.executablePath();
      launchArgs = chromium.args;
      headless = 'shell';
    }
    
    browser = await puppeteer.launch({
      ...(executablePath ? { executablePath } : {}),
      headless,
      args: launchArgs
    });
    
    let next = 0;
    await Promise.all(Array.from({ length: 1 }, async () => {
      const page = await browser.newPage();
      await page.setUserAgent('ReactSnap');
      await page.setViewport({ width: 1280, height: 900 });
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().startsWith(origin) && !request.url().includes('/api/')) request.continue();
        else request.respond({ status: 503, contentType: 'application/json', body: '{}' });
      });
      while (next < routes.length) {
        const route = routes[next++];
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 30000 })
          .catch(error => { console.error(`Render failed on ${route}: ${error.message}`); throw error; });
        await page.waitForSelector('h1', { timeout: 30000 })
          .catch(error => { throw new Error(`Heading missing on ${route}: ${error.message}`); });
        await page.waitForFunction(() => document.title && document.querySelector('link[rel="canonical"]'), { timeout: 10000, polling: 100 })
          .catch(error => { throw new Error(`Metadata missing on ${route}: ${error.message}`); });
        await new Promise(resolve => setTimeout(resolve, 100));
        if (errors.length) throw new Error(`${route}: ${errors.join('; ')}`);
        const html = await page.content();
        if (/⚠️ TODO|Ad placeholder|630-hour/.test(html)) throw new Error(`Unfinished content at ${route}`);
        const target = path.join(build, route, 'index.html');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html);
        if (next % 40 === 0) console.log(`Rendered ${next}/${routes.length} routes`);
        page.off('pageerror', onError);
      }
      await page.close();
    }));
    
    fs.writeFileSync(
      path.join(build, 'BUILD_INFO.json'),
      JSON.stringify({ build_timestamp: new Date().toISOString(), git_commit_sha: buildCommit, prerendered_routes: routes.length, renderer: 'application' }, null, 2)
    );
    console.log(`Prerendered ${routes.length} routes from application components.`);
  } catch (launchOrRenderErr) {
    throw new Error(`Full-page prerendering failed. Refusing to publish incomplete HTML: ${launchOrRenderErr.message}`);
  } finally {
    if (browser) await browser.close().catch(error => {
      console.warn('Browser cleanup:', error.message);
      browser.process()?.kill();
    });
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error('[prerender] Unexpected error:', error);
  process.exitCode = 1;
});
