#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const PUBLIC_DIR = path.join(__dirname, '../public');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const routes = (pkg.reactSnap && pkg.reactSnap.include) || [];

console.log('Generating SEO assets...');

// Generate llms-full.txt by scraping the text from all pre-rendered HTML files
let llmsFullContent = `# GlobalSync AI - Full Content Snapshot\n\n`;

for (const route of routes) {
  const filePath = route === '/'
    ? path.join(BUILD_DIR, 'index.html')
    : path.join(BUILD_DIR, route, 'index.html');

  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');

    // Naive HTML text extraction for bots
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    text = text.replace(/<[^>]+>/g, ' ');
    text = text.replace(/\s+/g, ' ').trim();

    llmsFullContent += `\n\n==========================================\n`;
    llmsFullContent += `URL: https://www.globalsync-ai.com${route}\n`;
    llmsFullContent += `==========================================\n\n`;
    llmsFullContent += text;
  }
}

fs.writeFileSync(path.join(BUILD_DIR, 'llms-full.txt'), llmsFullContent);
console.log('Wrote build/llms-full.txt');

// Generate sitemap.xml dynamically from reactSnap.include
// FIX: Exclude noindex pages — /dashboard (app UI) and /404 (not found page).
// Including a noindex page in the sitemap triggers an Ahrefs "Noindex page in sitemap" error.
const SITEMAP_EXCLUDE = new Set(['/dashboard', '/404', '/admin', '/stripe-checkout', '/upgrade-success']);

// ─── lastmod ───
// 原本这里完全不发 lastmod，理由是「部署日期不是编辑日期」—— 这个判断是对的，
// 所以下面没有退回到构建时间。只有确实知道某一页内容变更日期时才发 lastmod，
// 其余的继续省略。部分页面带 lastmod 的 sitemap 是合法的。
//
// 汇率页每天随数据变化，而它们正是最需要重抓信号的一批。
const RATE_SNAPSHOT_DATE = (() => {
  try {
    const snapshot = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../src/data/prebuiltRates.json'), 'utf8')
    );
    const d = new Date(snapshot.USD && snapshot.USD.updatedUtc);
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  } catch (e) { return null; }
})();

// 信任页的编辑修订日期，与 src/lib/seo.js 里的 PAGE_DATES 保持一致。
const REVISION_DATES = {
  '/methodology':      '2026-09-23',
  '/editorial-policy': '2026-09-23',
  '/data-sources':     '2026-09-23',
};

function lastmodFor(route) {
  if (REVISION_DATES[route]) return REVISION_DATES[route];
  if (route.startsWith('/currency/') || route.startsWith('/freelance-rate/')) {
    return RATE_SNAPSHOT_DATE;
  }
  return null;
}

let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const route of routes) {
  if (SITEMAP_EXCLUDE.has(route)) continue;

  sitemapXML += `  <url>\n`;
  sitemapXML += `    <loc>https://www.globalsync-ai.com${route}</loc>\n`;
  const lastmod = lastmodFor(route);
  if (lastmod) sitemapXML += `    <lastmod>${lastmod}</lastmod>\n`;
  sitemapXML += `  </url>\n`;
}

sitemapXML += `</urlset>\n`;

// Write to both build/sitemap.xml (for serving) and public/sitemap.xml
fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemapXML);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXML);
console.log('Wrote sitemap.xml to build/ and public/');
