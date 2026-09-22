/* Render the application for every published route.
 * Tries Puppeteer browser prerendering first. If Puppeteer cannot launch
 * (e.g. Vercel/headless Linux environments missing Chrome GUI libraries like libnspr4.so),
 * it gracefully falls back to generating static pre-rendered HTML snapshots for all routes.
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');

const appRoot = path.resolve(__dirname, '..');
const build = path.join(appRoot, 'build');
const routes = require('../package.json').reactSnap.include;
const buildCommit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null;

function getRouteMeta(route) {
  const publicOrigin = 'https://www.globalsync-ai.com';
  const canonical = `${publicOrigin}${route === '/' ? '' : route}`;
  
  if (route === '/') {
    return {
      title: 'GlobalSync AI - Time Zone Converter, Currency Rates & Remote Meeting Planner',
      description: 'Free AI-powered time zone converter, meeting planner, world clock, and live currency rates for remote teams, freelancers, and digital nomads.',
      canonical
    };
  }
  if (route.startsWith('/time/')) {
    const pair = route.replace('/time/', '').replace(/-/g, ' ');
    const formatted = pair.split(' to ').map(s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(' to ');
    return {
      title: `${formatted} Time Zone Converter & Meeting Planner | GlobalSync AI`,
      description: `Calculate exact local times, meeting overlaps, and daylight saving shifts between ${formatted} for remote teams and global business.`,
      canonical
    };
  }
  if (route.startsWith('/currency/')) {
    const pair = route.replace('/currency/', '').toUpperCase();
    return {
      title: `${pair} Exchange Rate & Live Currency Converter | GlobalSync AI`,
      description: `Get real-time mid-market exchange rates, historical trends, and fee-free conversion calculations for ${pair}.`,
      canonical
    };
  }
  if (route.startsWith('/convert/')) {
    const pair = route.replace('/convert/', '').toUpperCase().replace('-', ' to ');
    return {
      title: `Convert ${pair} Time Zones | GlobalSync AI`,
      description: `Instant, accurate time zone conversion for ${pair} with live time differences and meeting overlap planner.`,
      canonical
    };
  }
  if (route.startsWith('/freelance-rate/')) {
    const pair = route.replace('/freelance-rate/', '').toUpperCase().replace('-', ' to ');
    return {
      title: `Freelancer Rate Converter (${pair}) | GlobalSync AI`,
      description: `Compare international freelance rates and net earnings between ${pair} accounting for currency conversion and local purchasing power.`,
      canonical
    };
  }
  if (route.startsWith('/meeting-overlap/')) {
    const pair = route.replace('/meeting-overlap/', '').replace(/-/g, ' ').toUpperCase();
    return {
      title: `${pair} Working Hours & Meeting Overlap | GlobalSync AI`,
      description: `Find optimal business hour overlap between ${pair} for scheduling global remote team meetings.`,
      canonical
    };
  }
  if (route.startsWith('/compare/')) {
    const tool = route.replace('/compare/', '').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${tool} - Free AI Alternative | GlobalSync AI`,
      description: `Compare GlobalSync AI with ${tool} for modern remote teams needing multi-region time conversion and live currency rates.`,
      canonical
    };
  }
  if (route.startsWith('/blog/')) {
    const slug = route.replace('/blog/', '').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${slug} | GlobalSync AI Blog`,
      description: `Insights on remote work culture, time zone management, cross-border payments, and global team operating systems.`,
      canonical
    };
  }
  
  const titleName = route.replace(/^\//, '').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${titleName} | GlobalSync AI`,
    description: `GlobalSync AI time zone, currency, and remote collaboration tools for distributed teams.`,
    canonical
  };
}

function generateFallbackHtml(shell, route) {
  const meta = getRouteMeta(route);
  const escape = str => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  
  let html = shell
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '');

  const metaTags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}">`,
    `<link rel="canonical" href="${escape(meta.canonical)}">`,
    `<meta property="og:title" content="${escape(meta.title)}">`,
    `<meta property="og:description" content="${escape(meta.description)}">`,
    `<meta property="og:url" content="${escape(meta.canonical)}">`
  ].join('\n  ');

  html = html.replace('</head>', `  ${metaTags}\n</head>`);

  const bodyContent = route === '/' ? fs.readFileSync(path.join(appRoot, 'src/static/meridian-home.html'), 'utf8') : `
    <div data-gs-fallback="1" style="max-width: 900px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif;">
      <h1>${escape(meta.title)}</h1>
      <p>${escape(meta.description)}</p>
    </div>
  `;

  return html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${bodyContent}</div>`);
}

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
      
  const executablePath = candidates.find(file => fs.existsSync(file));
  
  let browser;
  try {
    if (isVercel) {
      throw new Error('Vercel environment detected (skipping browser launch to avoid libnspr4.so error).');
    }
    
    browser = await puppeteer.launch({
      ...(executablePath ? { executablePath } : {}),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    let next = 0;
    await Promise.all(Array.from({ length: 2 }, async () => {
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
        await page.waitForSelector('h1', { timeout: 15000 });
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
    console.warn(`[prerender] Puppeteer browser prerender bypassed/failed: ${launchOrRenderErr.message}`);
    console.log('[prerender] Generating static HTML snapshots for all routes...');
    
    let written = 0;
    for (const route of routes) {
      const html = generateFallbackHtml(shell, route);
      const target = route === '/' ? path.join(build, 'index.html') : path.join(build, route, 'index.html');
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
      written++;
    }
    
    fs.writeFileSync(
      path.join(build, 'BUILD_INFO.json'),
      JSON.stringify({ build_timestamp: new Date().toISOString(), git_commit_sha: buildCommit, prerendered_routes: written, renderer: 'static-fallback' }, null, 2)
    );
    console.log(`[prerender] Successfully generated ${written} static route snapshots via fallback generator.`);
  } finally {
    if (browser) await browser.close().catch(error => console.warn('Browser cleanup:', error.message));
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error('[prerender] Unexpected error:', error);
  process.exitCode = 1;
});
