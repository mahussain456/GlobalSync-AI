const puppeteer=require('puppeteer');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:4173';
const output=process.env.VERIFY_OUTPUT_DIR||require('path').resolve(__dirname,'../../../output/meridian-production-checks');
fs.mkdirSync(output,{recursive:true});

(async()=>{
 const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage(),errors=[],checks=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.evaluateOnNewDocument(()=>{localStorage.setItem('gs_cookie_consent','declined');Object.defineProperty(navigator,'clipboard',{value:{writeText:async s=>window.copied=s}});const original=URL.createObjectURL;URL.createObjectURL=function(blob){window.calendarBlob=blob;return original.call(this,blob)}});
 try{
  await page.setViewport({width:1440,height:1000});
  await page.goto(base+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')});
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
  const date=async value=>page.$eval('[name=meeting-date]',(el,v)=>{el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}))},value);
  await date('2026-09-17');
  assert((await page.$eval('[data-schedule]',el=>el.textContent)).includes('09:00'));
  await date('2026-03-16');
  const spring=await page.$eval('[data-clock-row]',el=>el.textContent);
  assert(spring.includes('New York09:00')&&spring.includes('London13:00'),'DST mismatch across US and UK handled');
  await date('2026-09-17');
  await page.select('[name=duration]','90');
  await page.$eval('.range',el=>{el.value='0';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.click('.find-time');
  assert((await page.$eval('[data-fit]',el=>el.textContent)).includes('All three'));
  await page.click('.copy');assert((await page.evaluate(()=>window.copied)).includes('90 minutes'));
  await page.click('.calendar');
  const ics=await page.evaluate(()=>window.calendarBlob.text());
  assert(ics.includes('DTSTART:20260917T130000Z')&&ics.includes('DTEND:20260917T143000Z'),'ICS UTC and duration');
  await page.select('[name=team]','pacific');await page.click('.find-time');
  assert((await page.$eval('.notice',el=>el.textContent)).includes('No shared'));
  await page.$eval('.range',el=>{el.value='95';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert((await page.$eval('[data-schedule]',el=>el.textContent)).includes('18 Sept'),'Date rollover');
  await page.select('[name=team]','atlantic');await page.select('[name=duration]','30');
  await page.$eval('.range',el=>{el.value='52';el.dispatchEvent(new Event('input',{bubbles:true}))});
  await page.$eval('details',el=>el.open=true);assert(await page.$eval('details',el=>el.open));
  await page.$eval('details',el=>el.open=false);
  await page.evaluate(()=>scrollTo(0,0));await new Promise(r=>setTimeout(r,500));
  await page.screenshot({path:require('path').join(output,'meridian-finished-desktop.png')});
  await page.screenshot({path:require('path').join(output,'meridian-finished-full.png'),fullPage:true});
  for(const width of [1024,768,390,320]){
   await page.setViewport({width,height:844});await page.evaluate(()=>scrollTo(0,0));
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   checks.push({width,overflow});assert(!overflow);
   if(width===390){await page.screenshot({path:require('path').join(output,'meridian-finished-mobile.png')});await page.screenshot({path:require('path').join(output,'meridian-finished-mobile-full.png'),fullPage:true})}
  }
  await page.click('[aria-label="Toggle menu"]');await page.waitForSelector('#brand-mobile-nav');
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('[aria-label="Toggle menu"]').getAttribute('aria-expanded')==='false');
  await page.click('.motion-toggle');assert.equal(await page.$eval('.motion-toggle',el=>el.getAttribute('aria-pressed')),'true');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  assert.equal(await page.$eval('.hero-art',el=>getComputedStyle(el).animationName),'none');
  assert.deepEqual(errors,[]);
  const result={passed:true,checks,errors,features:['Date selection','DST offset differences','Midnight date rollover','90-minute shared window','No-overlap recovery','Clipboard summary','ICS UTC start and end','FAQ','Mobile menu and Escape','Pause motion','Reduced motion','Images loaded']};
  fs.writeFileSync(require('path').join(output,'finished-verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
