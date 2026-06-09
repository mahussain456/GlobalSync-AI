#!/usr/bin/env node
/**
 * scripts/seo-check.js
 * GlobalSync AI — Automated SEO Verification Script
 *
 * Usage (from the frontend/ directory):
 *   node scripts/seo-check.js
 *   node scripts/seo-check.js --base http://localhost:3000
 *
 * Exits with:
 *   0 — all checks passed
 *   1 — one or more checks failed
 *
 * Checks:
 *   - /api/og returns image/png or image/jpeg (not HTML)
 *   - Homepage has <title>, meta description, canonical, H1, JSON-LD
 *   - Tool page /time-zone-converter has JSON-LD, title, H1
 *   - Programmatic page /time/new-york-to-london has JSON-LD, H1
 *   - Programmatic currency page /currency/usd-to-inr has JSON-LD, H1
 *   - /sitemap.xml returns 200 with valid XML
 *   - /robots.txt returns 200 with expected directives
 */

const https = require('https');
const http  = require('http');
const url   = require('url');

const BASE_URL = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'https://www.globalsync-ai.com';

// Allow bypassing TLS verification (for Windows/CI environments with missing CA bundle)
const noTLS = process.argv.includes('--no-tls-verify') ||
              process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';
if (noTLS) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('  ⚠️  TLS verification disabled (--no-tls-verify)');
}
let passed = 0;
let failed = 0;

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

    const req = lib.request(targetUrl, { method }, (res) => {
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

/** Get the HEAD response for a URL (efficient content-type check) */
function head(targetUrl) {
  return fetch(targetUrl, { method: 'HEAD' });
}

async function checkOGImage() {
  console.log('\n📸 Checking /api/og endpoint...');
  const ogUrl = `${BASE_URL}/api/og?title=SEO+Check&type=default`;

  try {
    // Use HEAD to avoid downloading the full image
    const res = await head(ogUrl);
    const ct  = (res.headers['content-type'] || '').toLowerCase();

    if (res.status !== 200) {
      fail('/api/og HTTP status', `Got ${res.status}, expected 200`);
      return;
    }
    if (ct.includes('image/png') || ct.includes('image/jpeg') || ct.includes('image/webp')) {
      pass(`/api/og returns image (${ct})`);
    } else if (ct.includes('text/html')) {
      fail('/api/og content-type', `Returns text/html — Vercel rewrite likely intercepting. Expected image/png or image/jpeg.`);
    } else {
      fail('/api/og content-type', `Unexpected content-type: ${ct}`);
    }
  } catch (e) {
    // HEAD may fail if the edge function doesn't support it; fall back to GET
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

async function checkPage(label, path, checks) {
  const pageUrl = `${BASE_URL}${path}`;
  console.log(`\n🔍 Checking ${label} (${path})...`);

  let body;
  try {
    const res = await fetch(pageUrl);
    if (res.status !== 200) {
      fail(`${label} HTTP status`, `Got ${res.status}, expected 200`);
      return;
    }
    body = res.body;
  } catch (e) {
    fail(`${label} fetch failed`, e.message);
    return;
  }

  // --- Title ---
  if (checks.title !== false) {
    const m = body.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (m && m[1].trim().length > 5) {
      pass(`<title> present: "${m[1].trim().slice(0, 60)}…"`);
    } else {
      fail(`<title> missing or empty`);
    }
  }

  // --- Meta description ---
  if (checks.description !== false) {
    const m = body.match(/<meta\s+name=["']description["'][^>]+content=["']([^"']+)["']/i)
           || body.match(/<meta\s+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    if (m && m[1].trim().length > 20) {
      pass(`meta description present (${m[1].trim().slice(0, 60)}…)`);
    } else {
      fail(`meta description missing or too short`);
    }
  }

  // --- Canonical ---
  if (checks.canonical !== false) {
    const m = body.match(/<link\s+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (m) {
      pass(`canonical: ${m[1]}`);
    } else {
      fail(`canonical link missing`);
    }
  }

  // --- H1 ---
  if (checks.h1 !== false) {
    const m = body.match(/<h1[^>]*>([^<]+)<\/h1>/i)
           || body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (m && m[1].replace(/<[^>]+>/g,'').trim().length > 3) {
      const text = m[1].replace(/<[^>]+>/g,'').trim();
      pass(`H1 present: "${text.slice(0, 60)}…"`);
    } else {
      fail(`H1 missing or empty`);
    }
  }

  // --- JSON-LD ---
  if (checks.jsonLd !== false) {
    const m = body.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (m && m.length > 0) {
      // Validate it's parseable JSON
      try {
        const raw = m[0].replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        JSON.parse(raw);
        pass(`JSON-LD present (${m.length} block${m.length > 1 ? 's' : ''})`);
      } catch (e) {
        fail(`JSON-LD present but invalid JSON`, e.message);
      }
    } else {
      fail(`JSON-LD (application/ld+json) missing`);
    }
  }

  // --- OG title ---
  if (checks.ogTitle !== false) {
    const m = body.match(/<meta\s+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (m) {
      pass(`og:title: "${m[1].slice(0, 60)}…"`);
    } else {
      fail(`og:title missing`);
    }
  }

  // --- No noindex ---
  if (checks.noNoIndex !== false) {
    const noindex = /<meta\s+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["']/i.test(body);
    if (noindex) {
      fail(`Page has noindex robots meta tag!`);
    } else {
      pass(`No noindex robots tag`);
    }
  }
}

async function checkSitemap() {
  console.log('\n🗺️  Checking /sitemap.xml...');
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (res.status !== 200) {
      fail('sitemap.xml HTTP status', `Got ${res.status}`);
      return;
    }
    const ct = (res.headers['content-type'] || '').toLowerCase();
    if (!ct.includes('xml') && !ct.includes('text')) {
      fail('sitemap.xml content-type', `Got: ${ct}`);
    }
    if (res.body.includes('<urlset') && res.body.includes('<loc>')) {
      const count = (res.body.match(/<loc>/g) || []).length;
      pass(`sitemap.xml valid XML with ${count} <loc> entries`);
    } else {
      fail('sitemap.xml content', 'Missing <urlset> or <loc> elements');
    }
  } catch (e) {
    fail('sitemap.xml fetch failed', e.message);
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
      fail('robots.txt blocks all crawlers', 'Found "Disallow: /" — check for Googlebot block');
    } else {
      pass('robots.txt does not block all crawlers');
    }
  } catch (e) {
    fail('robots.txt fetch failed', e.message);
  }
}

async function run() {
  console.log(`\n🌐 GlobalSync AI — SEO Check`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log('   ─────────────────────────────────────────\n');

  await checkOGImage();

  await checkPage('Homepage', '/', {});
  await checkPage('Time Zone Converter', '/time-zone-converter', {});
  await checkPage('City Pair: New York → London', '/time/new-york-to-london', {});
  await checkPage('Currency Pair: USD → INR', '/currency/usd-to-inr', {});
  await checkPage('Meeting Planner', '/meeting-planner', {});

  await checkSitemap();
  await checkRobots();

  console.log('\n─────────────────────────────────────────');
  console.log(`  Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('  🎉 All SEO checks passed!\n');
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
