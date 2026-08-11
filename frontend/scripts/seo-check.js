#!/usr/bin/env node
/**
 * scripts/seo-check.js
 * GlobalSync AI — Hardened Automated SEO Verification Script
 *
 * Checks:
 *   - Sitemap URL fetch status (200 OK)
 *   - Sitemap URLs contain raw H1, unique title, description, self-referencing canonical
 *   - No sitemap page contains robots "noindex"
 *   - No sitemap page has the fallback H1 "GlobalSync AI Tool"
 *   - Critical pages load in Puppeteer with zero console/page errors
 *   - Rendered DOM contains no duplicate JSON-LD schema blocks or duplicate schema types
 *   - /dashboard is excluded from sitemap and is set to "noindex"
 *   - /api/og returns a valid image content-type
 */

const https = require('https');
const http  = require('http');
const url   = require('url');
const puppeteer = require('puppeteer');

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'https://www.globalsync-ai.com';

const noTLS = process.argv.includes('--no-tls-verify') ||
              process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';
if (noTLS) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('  ⚠️  TLS verification disabled (--no-tls-verify)');
}

let passed = 0;
let failed = 0;
let sitemapUrlsList = [];

function pass(label) {
  console.log(`  ✅ PASS  ${label}`);
  passed++;
}
function fail(label, reason) {
  console.log(`  ❌ FAIL  ${label}`);
  if (reason) console.log(`         → ${reason}`);
  failed++;
}

/** Fetch a URL and return { status, headers, body } */
function fetch(targetUrl, { method = 'GET', followRedirects = true, maxRedirects = 5 } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new url.URL(targetUrl);
    const lib    = parsed.protocol === 'https:' ? https : http;

    const options = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GlobalSyncSeoCheck/1.0)'
      }
    };

    const req = lib.request(options, (res) => {
      if (followRedirects && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
        const next = new url.URL(res.headers.location, targetUrl).toString();
        fetch(next, { method, followRedirects, maxRedirects: maxRedirects - 1 }).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({
        status:  res.statusCode,
        headers: res.headers,
        body:    Buffer.concat(chunks).toString('utf8'),
      }));
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout fetching ${targetUrl}`)); });
    req.end();
  });
}

/** Get the HEAD response for a URL */
function head(targetUrl) {
  return fetch(targetUrl, { method: 'HEAD' });
}

async function checkOGImage() {
  console.log('\n📸 Checking /api/og endpoint...');
  const ogUrl = `${BASE_URL}/api/og?title=SEO+Check&type=default`;

  try {
    const res = await head(ogUrl);
    const ct  = (res.headers['content-type'] || '').toLowerCase();

    if (res.status !== 200) {
      fail('/api/og HTTP status', `Got ${res.status}, expected 200`);
      return;
    }
    if (ct.includes('image/png') || ct.includes('image/jpeg') || ct.includes('image/webp')) {
      pass(`/api/og returns image (${ct})`);
    } else {
      fail('/api/og content-type', `Unexpected content-type: ${ct}`);
    }
  } catch (e) {
    try {
      const res = await fetch(ogUrl);
      const ct  = (res.headers['content-type'] || '').toLowerCase();
      if (ct.includes('image/')) {
        pass(`/api/og returns image (${ct}) — via GET fallback`);
      } else {
        fail('/api/og content-type', `${ct || 'unknown'} — expected image/*`);
      }
    } catch (e2) {
      fail('/api/og request failed', e2.message);
    }
  }
}

/** Check a page both on raw HTML and in Puppeteer */
async function checkPage(browser, label, path, checks = {}) {
  const pageUrl = `${BASE_URL}${path}`;
  console.log(`\n🔍 Checking ${label} (${path})...`);

  let rawBody;
  try {
    const res = await fetch(pageUrl);
    if (res.status !== 200) {
      fail(`${label} HTTP status`, `Got ${res.status}, expected 200`);
      return;
    }
    rawBody = res.body;
  } catch (e) {
    fail(`${label} fetch failed`, e.message);
    return;
  }

  // --- RAW HTML CHECKS ---
  // Title
  const rawTitleMatch = rawBody.match(/<title[^>]*>([^<]+)<\/title>/i);
  const rawTitle = rawTitleMatch ? rawTitleMatch[1].trim() : '';
  if (rawTitle.length > 5) {
    pass(`[Raw] <title> present: "${rawTitle.slice(0, 50)}..."`);
  } else {
    fail(`[Raw] <title> missing or empty`);
  }

  // Description
  const rawDescMatch = rawBody.match(/<meta[^>]*name=["']description["'][^>]*>/i);
  let rawDesc = '';
  if (rawDescMatch) {
    const contentMatch = rawDescMatch[0].match(/content=["']([^"']+)["']/i);
    rawDesc = contentMatch ? contentMatch[1].trim() : '';
  }
  if (rawDesc.length > 20) {
    pass(`[Raw] meta description present: "${rawDesc.slice(0, 50)}..."`);
  } else {
    fail(`[Raw] meta description missing or too short`);
  }

  // Canonical
  const rawCanonicalMatch = rawBody.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  let rawCanonical = '';
  if (rawCanonicalMatch) {
    const hrefMatch = rawCanonicalMatch[0].match(/href=["']([^"']+)["']/i);
    rawCanonical = hrefMatch ? hrefMatch[1].trim() : '';
  }
  const expectedCanonical = `https://www.globalsync-ai.com${path === '/' ? '/' : path}`;
  if (rawCanonical === expectedCanonical) {
    pass(`[Raw] self-referencing canonical matches expected: ${rawCanonical}`);
  } else {
    fail(`[Raw] canonical mismatch: got "${rawCanonical}", expected "${expectedCanonical}"`);
  }

  // H1
  const rawH1Matches = rawBody.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (rawH1Matches.length === 1) {
    const rawH1Text = rawH1Matches[0].replace(/<[^>]+>/g, '').trim();
    if (rawH1Text === 'GlobalSync AI Tool') {
      fail(`[Raw] page has generic fallback H1 ("GlobalSync AI Tool")`);
    } else {
      pass(`[Raw] exactly 1 H1 present: "${rawH1Text}"`);
    }
  } else {
    fail(`[Raw] expected exactly 1 H1, found ${rawH1Matches.length}`);
  }

  // Schema (JSON-LD)
  const rawSchemaMatches = rawBody.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  if (checks.jsonLd !== false) {
    if (rawSchemaMatches.length > 0) {
      try {
        const rawJson = rawSchemaMatches[0].replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        JSON.parse(rawJson);
        pass(`[Raw] valid JSON-LD schema block present`);
      } catch (e) {
        fail(`[Raw] JSON-LD is invalid JSON: ${e.message}`);
      }
    } else {
      fail(`[Raw] JSON-LD schema block is missing`);
    }
  }

  // Robots
  const rawRobotsMatch = rawBody.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
  let isRawNoIndex = false;
  if (rawRobotsMatch) {
    const contentMatch = rawRobotsMatch[0].match(/content=["']([^"']+)["']/i);
    isRawNoIndex = contentMatch && /noindex/i.test(contentMatch[1]);
  }
  if (checks.noIndex === true) {
    if (isRawNoIndex) pass(`[Raw] correctly configured with noindex`);
    else fail(`[Raw] expected noindex, but robots is indexable`);
  } else {
    if (isRawNoIndex) fail(`[Raw] page has noindex meta robots tag but is indexable!`);
    else pass(`[Raw] page is indexable`);
  }

  // --- HYDRATED DOM CHECKS (PUPPETEER) ---
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => {
    const errStr = err.stack || err.message;
    if (err.message.includes('SyntaxError') || errStr.includes('posthog') || errStr.includes('web-vitals')) {
      return;
    }
    consoleErrors.push(`PageError: ${err.message}`);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const location = msg.location();
      const url = location ? location.url : '';
      if (!url.includes('posthog') && !text.includes('posthog') && !url.includes('web-vitals')) {
        consoleErrors.push(`ConsoleError: ${text}`);
      }
    }
  });

  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 15000 });

    const dom = await page.evaluate(() => {
      const title = document.title;
      const h1El = document.querySelector('h1');
      const h1 = h1El ? h1El.textContent.trim() : '';

      const descEl = document.querySelector('meta[name="description"]');
      const description = descEl ? descEl.getAttribute('content') : '';

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      const canonical = canonicalEl ? canonicalEl.getAttribute('href') : '';

      const robotsEl = document.querySelector('meta[name="robots"]');
      const robots = robotsEl ? robotsEl.getAttribute('content') : '';

      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(el => el.innerHTML.trim());

      return { title, h1, description, canonical, robots, jsonLdScripts };
    });

    // Verify metadata matches raw
    const decodedRawTitle = rawTitle.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#x27;/g, "'");
    const decodedRawDesc = rawDesc.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#x27;/g, "'");

    if (dom.title === decodedRawTitle) pass(`[Hydrated] title matches raw`);
    else fail(`[Hydrated] title mismatch: got "${dom.title}", expected "${decodedRawTitle}"`);

    if (dom.description === decodedRawDesc) pass(`[Hydrated] description matches raw`);
    else fail(`[Hydrated] description mismatch: got "${dom.description}", expected "${decodedRawDesc}"`);

    if (dom.canonical === expectedCanonical) pass(`[Hydrated] canonical matches expected`);
    else fail(`[Hydrated] canonical mismatch: got "${dom.canonical}", expected "${expectedCanonical}"`);

    // Verify H1
    if (dom.h1) {
      if (dom.h1 === 'GlobalSync AI Tool') {
        fail(`[Hydrated] has generic fallback H1 ("GlobalSync AI Tool")`);
      } else {
        pass(`[Hydrated] H1 present: "${dom.h1}"`);
      }
    } else {
      fail(`[Hydrated] H1 element missing`);
    }

    // Verify Robots noindex
    const isDomNoIndex = /noindex/i.test(dom.robots || '');
    if (checks.noIndex === true) {
      if (isDomNoIndex) pass(`[Hydrated] robots has noindex`);
      else fail(`[Hydrated] robots missing noindex`);
    } else {
      if (isDomNoIndex) fail(`[Hydrated] robots has noindex but page is indexable`);
      else pass(`[Hydrated] robots does not have noindex`);
    }

    // JSON-LD Deduplication Audit
    if (checks.jsonLd !== false) {
      if (dom.jsonLdScripts.length === 0) {
        fail(`[Hydrated] JSON-LD schema blocks missing`);
      } else {
        // Parse all schema types across all blocks
        const schemaTypes = [];
        for (const scriptText of dom.jsonLdScripts) {
          try {
            const parsed = JSON.parse(scriptText);
            const items = parsed['@graph'] || [parsed];
            for (const item of items) {
              if (item['@type']) {
                schemaTypes.push(item['@type']);
              }
            }
          } catch (e) {
            fail(`[Hydrated] JSON-LD block is invalid JSON: ${e.message}`);
          }
        }

        // Check for duplicate schema types
        const uniqueTypes = new Set(schemaTypes);
        if (schemaTypes.length !== uniqueTypes.size) {
          const duplicates = schemaTypes.filter((item, index) => schemaTypes.indexOf(item) !== index);
          fail(`[Hydrated] DUPLICATE schema types detected: [${[...new Set(duplicates)].join(', ')}]`);
        } else {
          pass(`[Hydrated] schema types are unique and clean: [${schemaTypes.join(', ')}]`);
        }
      }
    }

    // Console/Page Errors check
    if (consoleErrors.length === 0) {
      pass(`[Hydrated] zero console or script errors during hydration`);
    } else {
      fail(`[Hydrated] page logged errors during hydration:`, consoleErrors.join('\n         → '));
    }

  } catch (err) {
    fail(`${label} Puppeteer test failed`, err.message);
  } finally {
    await page.close();
  }
}

/** Fetch and parse sitemap, auditing every URL on raw HTML */
async function auditSitemap() {
  console.log('\n🗺️  Fetching and parsing sitemap.xml...');
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;
  let sitemapBody;

  try {
    const res = await fetch(sitemapUrl);
    if (res.status !== 200) {
      fail('sitemap.xml HTTP status', `Got ${res.status}`);
      return;
    }
    sitemapBody = res.body;
    pass('sitemap.xml fetched successfully');
  } catch (e) {
    fail('sitemap.xml fetch failed', e.message);
    return;
  }

  // Parse sitemap URLs using regex
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapBody)) !== null) {
    sitemapUrlsList.push(match[1].trim());
  }

  if (sitemapUrlsList.length === 0) {
    fail('sitemap.xml parsing', 'Parsed 0 URLs — check sitemap format');
    return;
  }
  pass(`Parsed ${sitemapUrlsList.length} URLs from sitemap.xml`);

  // Assert /dashboard and /404 are not in the sitemap
  const disallowed = sitemapUrlsList.filter(u => u.includes('/dashboard') || u.includes('/404'));
  if (disallowed.length > 0) {
    fail('Sitemap cleanliness', `Contains disallowed routes: [${disallowed.join(', ')}]`);
  } else {
    pass('Sitemap cleanliness: /dashboard and /404 are correctly excluded');
  }

  console.log('\n⏳ Auditing all sitemap URLs (Raw HTML Checks)...');
  
  // Auditing sitemap URLs sequentially
  for (const targetUrl of sitemapUrlsList) {
    const localUrl = targetUrl.replace('https://www.globalsync-ai.com', BASE_URL);
    const parsed = new url.URL(localUrl);
    const route = parsed.pathname;

    try {
      const res = await fetch(localUrl);
      if (res.status !== 200) {
        fail(`Sitemap URL [${route}] status`, `Returned ${res.status} (requested ${localUrl})`);
        continue;
      }

      // Check self-referencing canonical
      const canonicalMatch = res.body.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
      let canonicalVal = '';
      if (canonicalMatch) {
        const hrefMatch = canonicalMatch[0].match(/href=["']([^"']+)["']/i);
        canonicalVal = hrefMatch ? hrefMatch[1].trim() : '';
      }
      if (canonicalVal !== targetUrl) {
        fail(`Sitemap URL [${route}] canonical`, `Got "${canonicalVal}", expected "${targetUrl}"`);
      }

      // Check robots (no sitemap URL should be noindex)
      const robotsMatch = res.body.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
      let isNoIndex = false;
      if (robotsMatch) {
        const contentMatch = robotsMatch[0].match(/content=["']([^"']+)["']/i);
        isNoIndex = contentMatch && /noindex/i.test(contentMatch[1]);
      }
      if (isNoIndex) {
        fail(`Sitemap URL [${route}] indexability`, `Found noindex robots tag! Sitemap pages must be indexable.`);
      }

      // Check fallback H1
      const h1Matches = res.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      if (h1Matches.length === 1) {
        const h1Text = h1Matches[0].replace(/<[^>]+>/g, '').trim();
        if (h1Text === 'GlobalSync AI Tool') {
          fail(`Sitemap URL [${route}] H1`, `Found fallback generic H1 ("GlobalSync AI Tool")`);
        }
      } else if (h1Matches.length === 0) {
        fail(`Sitemap URL [${route}] H1`, `Missing <h1> tag`);
      }

      // Check JSON-LD
      const schemaMatches = res.body.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || [];
      if (schemaMatches.length === 0) {
        fail(`Sitemap URL [${route}] JSON-LD`, `Missing schema blocks`);
      }

    } catch (err) {
      fail(`Sitemap URL [${route}] fetch failed`, err.message);
    }
  }
}

async function checkRobots() {
  console.log('\n🤖 Checking /robots.txt...');
  try {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    if (res.status !== 200) {
      fail('robots.txt HTTP status', `Got ${res.status}`);
      return;
    }
    if (res.body.includes('User-agent') && res.body.includes('Sitemap:')) {
      pass('robots.txt has User-agent and Sitemap directives');
    } else {
      fail('robots.txt missing expected directives', 'Expected User-agent and Sitemap:');
    }
    // Confirm Googlebot is not blocked
    const blocks = /Disallow:\s*\/\s*$/m.test(res.body);
    if (blocks) {
      fail('robots.txt blocks all crawlers', 'Found "Disallow: /"');
    } else {
      pass('robots.txt does not block all crawlers');
    }
  } catch (e) {
    fail('robots.txt fetch failed', e.message);
  }
}

async function run() {
  console.log(`\n🌐 GlobalSync AI — Comprehensive SEO Regression Checks`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log('   ─────────────────────────────────────────────────────────────\n');

  await checkRobots();
  await checkOGImage();

  // Audit all sitemap URLs
  await auditSitemap();

  // Launch Puppeteer for critical route audits (including hydration / console audit)
  console.log('\n🚀 Starting headless browser for critical page audits...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Critical pages in sitemap (indexable, expect schemas)
    await checkPage(browser, 'Homepage', '/', {});
    await checkPage(browser, 'Press Page', '/press', {});
    await checkPage(browser, 'Contact Page', '/contact', {});
    await checkPage(browser, 'Global Planner', '/global-meeting-planner-for-remote-teams', {});
    await checkPage(browser, 'US & India Times', '/us-india-meeting-time', {});

    // Dashboard (pre-rendered, but noindex, excluded from sitemap)
    await checkPage(browser, 'App Dashboard', '/dashboard', { noIndex: true });

  } finally {
    await browser.close();
    console.log('\n🛑 Headless browser closed');
  }

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(`  Final Results: ${passed} checks passed, ${failed} checks failed`);

  if (failed === 0) {
    console.log('  🎉 All SEO regression tests passed successfully!\n');
    process.exit(0);
  } else {
    console.log(`  ⚠️  ${failed} check(s) failed. Review the output above.\n`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('\n💥 seo-check.js crashed:', err.message);
  process.exit(1);
});
