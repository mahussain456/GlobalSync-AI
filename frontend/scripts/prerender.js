/* Render the real application for every published route. A failed route fails
 * the build instead of publishing an unrelated hand-written fallback page. */
const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');
const appRoot = path.resolve(__dirname, '..');
const build = path.join(appRoot, 'build');
const routes = require('../package.json').reactSnap.include;

async function main() {
  const app = express();
  // Serve the unmodified shell on every document request, even after snapshots
  // have been written, so snapshots can never be nested inside other snapshots.
  const shell = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return res.status(503).json({error: 'Unavailable during static rendering'});
    if (!path.extname(req.path) || req.path.endsWith('/index.html')) return res.type('html').send(shell);
    next();
  });
  app.use(express.static(build));
  const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const candidates = [process.env.PUPPETEER_EXECUTABLE_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', puppeteer.executablePath()].filter(Boolean);
  const executablePath = candidates.find(file => fs.existsSync(file));
  let browser;
  try {
    browser = await puppeteer.launch({ ...(executablePath ? {executablePath} : {}), headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
    let next = 0;
    await Promise.all(Array.from({length: 2}, async () => {
      const page = await browser.newPage();
      await page.setUserAgent('ReactSnap');
      await page.setViewport({width: 1280, height: 900});
      await page.setRequestInterception(true);
      page.on('request', request => {
        if (request.url().startsWith(origin) && !request.url().includes('/api/')) request.continue();
        else request.respond({status: 503, contentType: 'application/json', body: '{}'});
      });
      while (next < routes.length) {
        const route = routes[next++];
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        await page.goto(origin + route, {waitUntil: 'domcontentloaded', timeout: 30000})
          .catch(error => { console.error(`Render failed on ${route}: ${error.message}`); throw error; });
        await page.waitForSelector('h1', {timeout: 15000});
        await page.waitForFunction(() => document.title && document.querySelector('link[rel="canonical"]'), {timeout: 10000, polling: 100})
          .catch(error => { throw new Error(`Metadata missing on ${route}: ${error.message}`); });
        // A background tab may suspend animation frames indefinitely. Metadata
        // is ready above; allow effects to settle without waiting for a repaint.
        await new Promise(resolve => setTimeout(resolve, 100));
        if (errors.length) throw new Error(`${route}: ${errors.join('; ')}`);
        const html = await page.content();
        if (/⚠️ TODO|Ad placeholder|630-hour/.test(html)) throw new Error(`Unfinished content at ${route}`);
        const target = path.join(build, route, 'index.html');
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.writeFileSync(target, html);
        if (next % 40 === 0) console.log(`Rendered ${next}/${routes.length} routes`);
        page.off('pageerror', onError);
      }
      await page.close();
    }));
    fs.writeFileSync(path.join(build, 'BUILD_INFO.json'), JSON.stringify({build_timestamp: new Date().toISOString(), prerendered_routes: routes.length, renderer: 'application'}, null, 2));
    console.log(`Prerendered ${routes.length} routes from application components.`);
  } finally {
    if (browser) await browser.close().catch(error => console.warn('Browser cleanup:', error.message));
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
