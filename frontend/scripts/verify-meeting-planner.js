const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.VERIFY_OUTPUT_DIR || path.join(require('os').tmpdir(), 'globalsync-planner-verification');

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', puppeteer.executablePath()].filter(Boolean).find(p => fs.existsSync(p));
  const browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [], findings = [];
  let holdRates = false, pendingRate;
  page.on('pageerror', e => errors.push(e.message));
  const rateResponse = { status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ result: 'success', rates: { USD: 1, EUR: 0.8, GBP: 0.5 }, time_last_update_utc: 'Wed, 16 Sep 2026 00:00:00 +0000' }) };
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('open.exchangerate-api.com')) {
      if (holdRates) { pendingRate = request; return; }
      return request.respond(rateResponse);
    }
    if (request.url().startsWith('blob:')) return request.continue();
    if (!request.url().startsWith(base) || request.url().includes('/api/')) return request.respond({ status: 503, contentType: 'application/json', body: '{}' });
    return request.continue();
  });
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('gs_cookie_consent', 'declined');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.copied = value; } } });
  });
  const open = async route => { await page.goto(base + route, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('h1'); };
  const input = async (selector, value) => page.$eval(selector, (el, value) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
  const click = async text => {
    const handle = await page.evaluateHandle(text => [...document.querySelectorAll('button')].find(el => el.textContent.includes(text)), text);
    assert(handle.asElement(), text); await handle.asElement().click();
  };
  const shared = '/meeting-planner?date=2026-09-16&duration=30&cities=New+York%7CLondon&weekdays=1';
  try {
    await page.setViewport({ width: 1440, height: 1000 });
    await open(shared);
    await page.waitForFunction(() => document.body.innerText.includes('11 start times'));
    await page.select('[aria-label="Meeting duration"]', '60');
    await page.select('[aria-label="Meeting start time"]', '2026-09-16T14:00:00.000Z');
    await click('Copy plan link');
    const link = await page.evaluate(() => window.copied);
    assert.equal(new URL(link).searchParams.get('start'), '2026-09-16T14:00:00.000Z');
    await open(link.slice(base.length));
    assert.equal(await page.$eval('[aria-label="Meeting duration"]', el => el.value), '60');
    assert.equal(await page.$eval('[aria-label="Meeting start time"]', el => el.value), '2026-09-16T14:00:00.000Z');
    const google = await page.$eval('a[href^="https://calendar.google.com"]', el => el.href);
    assert.equal(new URL(google).searchParams.get('dates'), '20260916T140000Z/20260916T150000Z');
    const session = await page.createCDPSession();
    await session.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: output });
    await click('Download calendar file');
    for (let i = 0; i < 40 && !fs.existsSync(path.join(output, 'globalsync-meeting.ics')); i++) await new Promise(r => setTimeout(r, 100));
    const ics = fs.readFileSync(path.join(output, 'globalsync-meeting.ics'), 'utf8');
    assert(ics.includes('DTSTART:20260916T140000Z\r\nDTEND:20260916T150000Z'));
    await click('Copy local times');
    assert((await page.evaluate(() => window.copied)).includes('10:00 AM EDT'));
    await page.select('[aria-label="Time format"]', '24');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, 'planner-desktop.png'), fullPage: true });
    await click('New York + Mumbai');
    await page.waitForFunction(() => document.body.innerText.includes('No shared working time'));
    assert.equal(await page.$('a[href^="https://calendar.google.com"]'), null);
    await click('New York + London');
    await input('[aria-label="London work ends"]', '08:00');
    await page.waitForSelector('[role="alert"]');
    assert((await page.$eval('[role="alert"]', el => el.textContent)).includes('end after the start'));
    await open('/meeting-planner?cities=Unknown%7CLondon&date=2026-09-16');
    await page.waitForFunction(() => document.body.innerText.includes('unsupported city'));
    await open(shared);
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
    await click('Copy plan link');
    await page.waitForSelector('textarea');
    assert((await page.$eval('textarea', el => el.value)).includes('cities=New+York'));
    for (const width of [390, 320]) {
      await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
      await open(shared);
      await page.waitForSelector('[aria-label="Meeting start time"]');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: path.join(output, `planner-${width}.png`), fullPage: true });
      findings.push({ route: '/meeting-planner', width, horizontalOverflow: false });
    }
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await open('/currency-converter');
    await page.waitForSelector('[data-testid="conversion-result-display"]');
    await input('#conversion-amount', '250');
    assert.equal(await page.$('[data-testid="conversion-result-display"]'), null);
    await click('Convert');
    await page.waitForSelector('[data-testid="conversion-result-display"]');
    assert((await page.$eval('[data-testid="conversion-result-display"]', el => el.textContent)).includes('200'));
    await click('Copy');
    assert((await page.evaluate(() => window.copied)).includes('ExchangeRate-API'));
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, 'currency-mobile.png') });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    // A delayed provider response must not overwrite newly edited input.
    holdRates = true;
    await open('/currency-converter');
    await page.waitForSelector('#conversion-amount');
    for (let i = 0; i < 30 && !pendingRate; i++) await new Promise(r => setTimeout(r, 100));
    assert(pendingRate, 'Expected a delayed rate request');
    await input('#conversion-amount', '999');
    await pendingRate.respond(rateResponse);
    await page.waitForNetworkIdle({ idleTime: 500 });
    assert.equal(await page.$('[data-testid="conversion-result-display"]'), null);
    assert.equal(await page.$('[data-testid="trend-chart"]'), null);
    assert.deepEqual(errors, []);
    const result = { passed: true, findings, errors, checks: ['share restoration', 'ICS download', 'Google Calendar UTC times', 'local copy', 'clipboard fallback', 'no overlap', 'invalid hours', 'invalid shared city', '320/390px layouts', 'currency stale-response suppression'], output };
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
