const puppeteer = require('../frontend/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../frontend/build');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Enable request interception to block third-party trackers/ads that might fail in headless shell
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (
      url.includes('posthog') || 
      url.includes('googlesyndication') || 
      url.includes('google-analytics') || 
      url.includes('googletagmanager') ||
      url.includes('doubleclick')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Capture page console logs and stack traces
  page.on('console', msg => {
    console.log(`[BROWSER LOG - ${msg.type()}]:`, msg.text());
  });
  
  page.on('pageerror', err => {
    console.error('❌ BROWSER EXCEPTION:', err.stack || err.toString());
  });

  const routes = ['/', '/about'];

  for (const route of routes) {
    console.log(`\n==========================================`);
    console.log(`Route: ${route}`);
    const url = `http://localhost:3000${route}`;
    
    console.log(`Navigating to ${url}...`);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      console.log(`Navigation status:`, response ? response.status() : 'No response');
    } catch (err) {
      console.error(`❌ Navigation failed:`, err.message);
      continue;
    }

    console.log('Waiting 3 seconds for React to mount...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const pageUrl = page.url();
    const pageTitle = await page.title();
    console.log(`Current page URL in browser:`, pageUrl);
    console.log(`Current page title in browser:`, pageTitle);
    
    const bodySnippet = await page.evaluate(() => {
      return document.body ? document.body.innerHTML.substring(0, 500) : 'NO BODY';
    });
    console.log(`Body HTML snippet:`, bodySnippet);
    
    const allTitles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('title')).map(t => t.outerHTML);
    });
    console.log('All titles found:', allTitles);
    
    const allDescriptions = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('meta[name="description"]')).map(m => m.outerHTML);
    });
    console.log('All descriptions found:', allDescriptions);
  }

  await browser.close();
  console.log('\nAudit complete.');
}

run().catch(err => {
  console.error('Error during execution:', err);
  process.exit(1);
});
