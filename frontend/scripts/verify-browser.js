const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const base = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173';
const output = process.env.VERIFY_OUTPUT_DIR || path.join(require('os').tmpdir(), 'globalsync-verification');

async function main() {
  fs.mkdirSync(output, {recursive: true});
  const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', puppeteer.executablePath()].filter(Boolean).find(p => fs.existsSync(p));
  const browser = await puppeteer.launch({headless:true, ...(executablePath ? {executablePath}:{}), args:['--no-sandbox']});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let fixtureCalls = 0;
  let providerOffline = false;
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().includes('open.exchangerate-api.com')) {
      fixtureCalls++;
      return request.respond({status:providerOffline ? 503:200, contentType:'application/json', headers:{'Access-Control-Allow-Origin':'*'}, body:JSON.stringify({result:'success', rates:{USD:1,EUR:0.8,GBP:0.5,INR:80}, time_last_update_utc:'Tue, 15 Sep 2026 00:00:00 +0000'})});
    }
    if (!request.url().startsWith(base)) return request.respond({status:503,contentType:'application/json',body:'{}'});
    return request.continue();
  });
  const open = async route => { await page.goto(base+route,{waitUntil:'networkidle0'}); await page.waitForSelector('h1'); };
  const clickText = async (selector, text) => {
    const element = await page.evaluateHandle((selector,text) => [...document.querySelectorAll(selector)].find(el => el.textContent.includes(text)),selector,text);
    assert(element.asElement(), `Missing ${selector}: ${text}`);
    await element.asElement().click();
  };
  const findings = [];
  try {
    await page.setViewport({width:1440,height:1000});
    await open('/');
    await page.evaluate(() => localStorage.setItem('gs_cookie_consent','declined'));
    await page.reload({waitUntil:'networkidle0'});
    await page.waitForFunction(() => document.body.innerText.includes('0.8000'));
    await page.screenshot({path:path.join(output,'homepage-desktop.png'),fullPage:true});
    await page.screenshot({path:path.join(output,'homepage-desktop-top.png')});
    findings.push({route:'/',viewport:'1440×1000',horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)});
    assert.equal(await page.$$eval('script[type="application/ld+json"]',nodes=>nodes.length),1);
    await page.focus('select[aria-label="From currency"]');
    assert.equal(await page.$eval('select[aria-label="From currency"]',el=>getComputedStyle(el).outlineStyle),'solid');
    await clickText('a','Find a meeting time');
    await page.waitForSelector('h1');
    await clickText('button','New York');
    await page.waitForSelector('[data-testid="time-converter"]');
    assert(page.url().includes('/dashboard'));
    assert.equal(await page.$('[data-testid="onboarding-modal"]'),null);
    await page.$eval('input[type="date"]',el=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'2026-09-15');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));});
    await page.waitForFunction(()=>document.body.innerText.includes('3h Overlap'));
    await open('/dashboard?q='+encodeURIComponent('What time is 3 PM New York in London on November 1, 2026?'));
    await page.waitForFunction(()=>document.querySelector('[role="status"]')?.textContent.includes('November 1, 2026'));
    const answer=await page.$eval('[role="status"]',el=>el.textContent);
    assert(answer.includes('8:00 PM'),answer);
    await open('/convert/est-to-ist');
    await page.waitForFunction(()=>document.body.innerText.includes('07:30 PM'));
    assert(!await page.evaluate(()=>document.body.innerText.includes('630-hour')));
    await open('/freelancer-rate-converter');
    await page.waitForFunction(()=>document.body.innerText.includes('ExchangeRate-API'));
    await clickText('a','Use this rate in an invoice');
    await page.waitForFunction(()=>document.body.innerText.includes('Amount due:'));
    await page.evaluate(()=>{ localStorage.removeItem('gs_rate_amount'); localStorage.removeItem('gs_rate_type'); localStorage.removeItem('gs_rate_currency'); for(const key of Object.keys(localStorage)) if(key.startsWith('gs_inv_count_')) localStorage.removeItem(key); });
    await page.reload({waitUntil:'networkidle0'});
    const invoiceText=await page.evaluate(()=>document.body.innerText);
    assert(invoiceText.includes('2000.00 USD'));
    assert(!invoiceText.includes('SE Tax ('));
    const session=await page.createCDPSession();
    await session.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:output});
    const existingPDFs=new Set(fs.readdirSync(output).filter(f=>f.endsWith('.pdf')));
    await clickText('button','Download PDF');
    await page.waitForFunction(()=>document.body.innerText.includes('PDF invoice generated successfully'));
    for(let i=0;i<30&&!fs.readdirSync(output).some(f=>f.endsWith('.pdf')&&!existingPDFs.has(f));i++) await new Promise(r=>setTimeout(r,100));
    const pdf=fs.readdirSync(output).find(f=>f.endsWith('.pdf')&&!existingPDFs.has(f));
    assert(pdf,'Invoice PDF was not downloaded');
    const pdfBytes=fs.readFileSync(path.join(output,pdf)).toString('latin1');
    assert(pdfBytes.includes('Amount due:'));
    assert(pdfBytes.includes('2000.00 USD'));
    assert(!pdfBytes.includes('Self-Employment Tax'));
    await open('/stripe-checkout');
    assert(await page.evaluate(()=>document.body.innerText.includes('Pro upgrades are not currently available')));
    providerOffline=true;
    await open('/currency/usd-to-eur');
    await page.waitForFunction(()=>document.body.innerText.includes('Offline Cache Rates'));
    assert(!await page.evaluate(()=>document.body.innerText.includes('0.9266')));
    await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
    await open('/');
    findings.push({route:'/',viewport:'390×844',horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>390)});
    await page.screenshot({path:path.join(output,'homepage-mobile.png'),fullPage:true});
    await page.screenshot({path:path.join(output,'homepage-mobile-top.png')});
    await page.click('[aria-label="Toggle menu"]');
    assert.equal(await page.$eval('[aria-label="Toggle menu"]',el=>el.getAttribute('aria-expanded')),'true');
    for(const route of ['/dashboard','/invoice','/convert/est-to-ist']) {
      await open(route);
      findings.push({route,viewport:'390×844',horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>390)});
      await page.screenshot({path:path.join(output,route.replaceAll('/','-')+'-mobile.png'),fullPage:true});
    }
    const response=await page.goto(base+'/does-not-exist-audit');
    assert.equal(response.status(),404);
    for (const finding of findings) assert.equal(finding.horizontalOverflow, false, JSON.stringify(finding));
    assert.deepEqual(errors,[]);
    const result={passed:true,fixtureCalls,errors,findings,pdf,output};
    fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(result,null,2));
    console.log(JSON.stringify(result,null,2));
  } finally { await browser.close(); }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
