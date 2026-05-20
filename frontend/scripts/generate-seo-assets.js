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
    // 1. Remove scripts and styles
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    // 2. Remove tags
    text = text.replace(/<[^>]+>/g, ' ');
    // 3. Clean up whitespace
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
let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const route of routes) {
  // Determine priority and frequency based on route depth/type
  let priority = "0.7";
  let changefreq = "monthly";
  
  if (route === '/') { priority = "1.0"; changefreq = "weekly"; }
  else if (['/time-zone-converter', '/currency-converter', '/meeting-planner'].includes(route)) { priority = "0.9"; }
  else if (route === '/blog') { priority = "0.8"; changefreq = "weekly"; }
  
  sitemapXML += `  <url>\n`;
  sitemapXML += `    <loc>https://www.globalsync-ai.com${route}</loc>\n`;
  sitemapXML += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
  sitemapXML += `    <changefreq>${changefreq}</changefreq>\n`;
  sitemapXML += `    <priority>${priority}</priority>\n`;
  sitemapXML += `  </url>\n`;
}

sitemapXML += `</urlset>\n`;

// Write to both build/sitemap.xml (for serving) and public/sitemap.xml (for future commits if desired)
fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemapXML);
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXML);
console.log('Wrote sitemap.xml to build/ and public/');
