const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
if (!fs.existsSync(filePath)) {
  console.log('File not found!');
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');
console.log('Original length:', html.length);

const fallbackBody = '<!-- FALLBACK SEO BODY --><h1>GlobalSync AI</h1>';
const replaced = html.replace(/<div id="root">[\s\S]*?<\/div>(?=\s*<script)/i, `<div id="root">${fallbackBody}</div>`);

console.log('Replaced length:', replaced.length);
const rootIdx = replaced.indexOf('<div id="root">');
if (rootIdx === -1) {
  console.log('Replaced root not found!');
} else {
  console.log('Replaced section:');
  console.log(replaced.substring(rootIdx, rootIdx + 200));
}
