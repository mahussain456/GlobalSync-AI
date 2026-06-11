const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '../frontend/build');

const urls = [
  { path: '/', file: 'index.html', label: 'Homepage' },
  { path: '/blog', file: 'blog/index.html', label: 'Blog Index Page' },
  { path: '/time-zone-converter', file: 'time-zone-converter/index.html', label: 'Time Zone Converter Hub' },
  { path: '/time/new-york-to-london', file: 'time/new-york-to-london/index.html', label: 'City Pair Page' },
  { path: '/currency/usd-to-inr', file: 'currency/usd-to-inr/index.html', label: 'Currency Pair Page' }
];

console.log('=== SEO Static Build Verification ===');
let failed = false;

urls.forEach(({ file, label }) => {
  const filePath = path.join(BUILD_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    failed = true;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Helper to count occurrences of a regex
  const countOccurrences = (regex) => (html.match(regex) || []).length;

  // 1. Check title count
  const titleCount = countOccurrences(/<title[^>]*>[\s\S]*?<\/title>/gi);
  if (titleCount === 1) {
    console.log(`✅ ${label}: Exactly 1 <title> tag found.`);
  } else {
    console.error(`❌ ${label}: Expected 1 <title> tag, found ${titleCount}`);
    failed = true;
  }

  // 2. Check meta description count
  const descCount = countOccurrences(/<meta[^>]+name=["']description["'][^>]*>/gi);
  if (descCount === 1) {
    console.log(`✅ ${label}: Exactly 1 meta description tag found.`);
  } else {
    console.error(`❌ ${label}: Expected 1 meta description tag, found ${descCount}`);
    failed = true;
  }

  // 3. Check robots count
  const robotsCount = countOccurrences(/<meta[^>]+name=["']robots["'][^>]*>/gi);
  if (robotsCount === 1) {
    console.log(`✅ ${label}: Exactly 1 meta robots tag found.`);
  } else {
    console.error(`❌ ${label}: Expected 1 meta robots tag, found ${robotsCount}`);
    failed = true;
  }

  // 4. Check canonical count
  const canonicalCount = countOccurrences(/<link[^>]+rel=["']canonical["'][^>]*>/gi);
  if (canonicalCount === 1) {
    console.log(`✅ ${label}: Exactly 1 link canonical tag found.`);
  } else {
    console.error(`❌ ${label}: Expected 1 link canonical tag, found ${canonicalCount}`);
    failed = true;
  }

  // 5. Check duplicate OG/Twitter tags
  const ogMatches = html.match(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi) || [];
  const ogProperties = ogMatches.map(m => {
    const match = m.match(/property=["'](og:[^"']+)["']/i);
    return match ? match[1] : null;
  }).filter(Boolean);

  const duplicateOg = ogProperties.filter((item, index) => ogProperties.indexOf(item) !== index);
  if (duplicateOg.length === 0) {
    console.log(`✅ ${label}: No duplicate og: properties.`);
  } else {
    console.error(`❌ ${label}: Duplicate og: properties found: ${[...new Set(duplicateOg)].join(', ')}`);
    failed = true;
  }

  const twitterMatches = html.match(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi) || [];
  const twitterNames = twitterMatches.map(m => {
    const match = m.match(/name=["'](twitter:[^"']+)["']/i);
    return match ? match[1] : null;
  }).filter(Boolean);

  const duplicateTwitter = twitterNames.filter((item, index) => twitterNames.indexOf(item) !== index);
  if (duplicateTwitter.length === 0) {
    console.log(`✅ ${label}: No duplicate twitter: names.`);
  } else {
    console.error(`❌ ${label}: Duplicate twitter: names found: ${[...new Set(duplicateTwitter)].join(', ')}`);
    failed = true;
  }
});

// Run a static metadata length check across the source metadata files
console.log('\n=== Meta Description Length Check ===');
const seoJsPath = path.resolve(__dirname, '../frontend/src/lib/seo.js');
const blogDataJsPath = path.resolve(__dirname, '../frontend/src/data/blogData.js');

function checkFileDescriptions(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Find strings matching description: "..." or metaDescription: "..."
  const regex = /(?:metaDescription|description)\s*:\s*["'`]([\s\S]*?)["'`]/g;
  let match;
  let fileFailed = false;
  while ((match = regex.exec(content)) !== null) {
    const desc = match[1].replace(/\n/g, ' ').trim();
    // Skip if it contains dynamic template expressions or schema/function calls
    if (desc.includes('${') || desc.startsWith('@') || desc.includes('this.') || desc.includes('description:')) continue;
    if (desc.length > 155) {
      console.error(`❌ Overly long description (${desc.length} chars) in ${path.basename(filePath)}:\n   "${desc}"`);
      fileFailed = true;
      failed = true;
    } else {
      console.log(`✅ Description length (${desc.length} chars) in ${path.basename(filePath)}`);
    }
  }
  if (!fileFailed) {
    console.log(`✅ All static descriptions in ${path.basename(filePath)} are <= 155 characters.`);
  }
}

checkFileDescriptions(seoJsPath);
checkFileDescriptions(blogDataJsPath);

if (failed) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL STATIC SEO VERIFICATIONS PASSED SUCCESSFULLY!');
  process.exit(0);
}
