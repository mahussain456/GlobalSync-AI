const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..', 'build');
const routes = require('../package.json').reactSnap.include;
const failures = [];
for (const route of routes) {
  const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
  const titles = [...html.matchAll(/<title[^>]*>(.*?)<\/title>/g)];
  const canonicals = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/g) || [];
  const headings = html.match(/<h1\b/g) || [];
  if (titles.length !== 1 || titles[0][1] === 'GlobalSync AI | Time Zone & Currency Converter') failures.push(`${route}: title`);
  if (canonicals.length !== 1 || canonicals[0].includes('https://www.globalsync-ai.comhttps:')) failures.push(`${route}: canonical`);
  if (headings.length !== 1) failures.push(`${route}: ${headings.length} H1 headings`);
  if (/⚠️ TODO|Ad placeholder|630-hour|data-gs-fallback/.test(html)) failures.push(`${route}: unfinished content`);
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const route of ['/dashboard', '/404', '/admin', '/stripe-checkout', '/upgrade-success']) {
  assert(!sitemap.includes(`https://www.globalsync-ai.com${route}</loc>`), `${route} must not be in the sitemap`);
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal((home.match(/type="application\/ld\+json"/g)||[]).length, 1, 'Homepage must have one structured-data graph');
assert.deepEqual(failures, []);
console.log(`PASS: ${routes.length} rendered routes, one title/canonical/H1 per page, no draft content, one homepage schema graph, noindex pages excluded from sitemap.`);
