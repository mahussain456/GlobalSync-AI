const fs = require('fs');
const path = require('path');

const runSnapPath = path.join(__dirname, '../frontend/scripts/run-snap-with-info.js');
const fileContent = fs.readFileSync(runSnapPath, 'utf8');

// We can extract BLOG_POSTS by evaluating it or evaluating the file in a sandbox/wrapper
// A quick way is to extract the BLOG_POSTS block and evaluate it with eval()
const startMarker = 'const BLOG_POSTS = [';
const startIndex = fileContent.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find BLOG_POSTS in run-snap-with-info.js');
  process.exit(1);
}

let bracketCount = 1;
let endIndex = -1;
for (let i = startIndex + startMarker.length; i < fileContent.length; i++) {
  if (fileContent[i] === '[') bracketCount++;
  if (fileContent[i] === ']') bracketCount--;
  if (bracketCount === 0) {
    endIndex = i;
    break;
  }
}

if (endIndex === -1) {
  console.error('Could not find matching bracket for BLOG_POSTS in run-snap-with-info.js');
  process.exit(1);
}

const rawPosts = fileContent.substring(startIndex, endIndex + 1);

// Safely evaluate the array
let BLOG_POSTS;
const codeToRun = rawPosts.replace('const BLOG_POSTS =', 'BLOG_POSTS =');
eval(codeToRun);

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

BLOG_POSTS.forEach((post, i) => {
  let text = '';
  text += post.title + ' ';
  text += post.excerpt + ' ';
  post.content.forEach(block => {
    if (typeof block === 'string') {
      text += block + ' ';
    } else if (block.type === 'p' || block.type === 'h2' || block.type === 'h3') {
      text += block.text + ' ';
    } else if (block.type === 'ul' || block.type === 'ul-bold' || block.type === 'ol') {
      block.items.forEach(item => {
        if (typeof item === 'string') {
          text += item + ' ';
        } else {
          if (item.title) text += item.title + ' ';
          if (item.desc) text += item.desc + ' ';
        }
      });
    }
  });
  console.log(`Synced Snap Post ${i+1} (${post.slug}): ${countWords(text)} words`);
});
