const fs = require('fs');
const path = require('path');

const blogDataPath = path.join(__dirname, '../frontend/src/data/blogData.js');
const runSnapPath = path.join(__dirname, '../frontend/scripts/run-snap-with-info.js');

// 1. Read blogData.js
const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

// Extract BLOG_POSTS array
const startMarker = 'export const BLOG_POSTS = [';
const startIndex = blogDataContent.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find BLOG_POSTS start in blogData.js');
  process.exit(1);
}

// Find matching ending bracket for the array
let bracketCount = 1;
let endIndex = -1;
for (let i = startIndex + startMarker.length; i < blogDataContent.length; i++) {
  if (blogDataContent[i] === '[') bracketCount++;
  if (blogDataContent[i] === ']') bracketCount--;
  if (bracketCount === 0) {
    endIndex = i;
    break;
  }
}

if (endIndex === -1) {
  console.error('Could not find matching closing bracket for BLOG_POSTS in blogData.js');
  process.exit(1);
}

// Extract content and prepend const instead of export const
const rawPostsArray = blogDataContent.substring(startIndex, endIndex + 1);
const snappedPostsArray = rawPostsArray.substring('export '.length);

// 2. Read run-snap-with-info.js
let runSnapContent = fs.readFileSync(runSnapPath, 'utf8');

// Find BLOG_POSTS start and end in run-snap-with-info.js
const targetStartMarker = 'const BLOG_POSTS = [';
const targetStartIndex = runSnapContent.indexOf(targetStartMarker);
if (targetStartIndex === -1) {
  console.error('Could not find target BLOG_POSTS in run-snap-with-info.js');
  process.exit(1);
}

let targetBracketCount = 1;
let targetEndIndex = -1;
for (let i = targetStartIndex + targetStartMarker.length; i < runSnapContent.length; i++) {
  if (runSnapContent[i] === '[') targetBracketCount++;
  if (runSnapContent[i] === ']') targetBracketCount--;
  if (targetBracketCount === 0) {
    targetEndIndex = i;
    break;
  }
}

if (targetEndIndex === -1) {
  console.error('Could not find closing bracket for target BLOG_POSTS in run-snap-with-info.js');
  process.exit(1);
}

// Replace the old BLOG_POSTS array with the new one
const beforePosts = runSnapContent.substring(0, targetStartIndex);
const afterPosts = runSnapContent.substring(targetEndIndex + 1);
runSnapContent = beforePosts + snappedPostsArray + afterPosts;

// 3. Replace the renderer logic in run-snap-with-info.js
// Find the line that maps post.content to HTML paragraphs
const oldRenderer = 'const bodyText = post.content.map(t => `<p style="font-size: 1.05rem; color: #A5BCAE; line-height: 1.7; margin-bottom: 1.5rem;">${t}</p>`).join(\'\');';
const newRenderer = `const bodyText = post.content.map(block => {
        if (typeof block === 'string') {
          return \`<p style="font-size: 1.05rem; color: #A5BCAE; line-height: 1.7; margin-bottom: 1.5rem;">\${block}</p>\`;
        }
        switch (block.type) {
          case 'p':
            return \`<p style="font-size: 1.05rem; color: #A5BCAE; line-height: 1.7; margin-bottom: 1.5rem;">\${block.text}</p>\`;
          case 'h2':
            return \`<h2 style="font-size: 1.5rem; font-weight: 700; color: #F5F5F0; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">\${block.text}</h2>\`;
          case 'h3':
            return \`<h3 style="font-size: 1.2rem; font-weight: 700; color: #F5F5F0; margin-top: 1.5rem; margin-bottom: 0.75rem;">\${block.text}</h3>\`;
          case 'ul':
            return \`<ul style="list-style: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; color: #A5BCAE;">\${block.items.map(item => \`<li style="line-height: 1.6; margin-bottom: 0.5rem;">\${item}</li>\`).join('')}</ul>\`;
          case 'ul-bold':
            return \`<ul style="list-style: none; padding: 0; margin-bottom: 1.5rem;">\${block.items.map(item => \`<li style="margin-bottom: 1rem; display: flex; gap: 0.5rem;"><span style="color: #C8A96A; font-weight: bold; margin-right: 0.5rem;">✔</span><span style="color: #A5BCAE; line-height: 1.6;"><strong style="color: #F5F5F0;">\${item.title}</strong> \${item.desc}</span></li>\`).join('')}</ul>\`;
          case 'ol':
            return \`<ol style="list-style: none; padding: 0; margin-bottom: 1.5rem;">\${block.items.map((item, idx) => \`<li style="margin-bottom: 1.25rem; display: flex; gap: 0.75rem;"><div style="width: 1.75rem; height: 1.75rem; border-radius: 50%; background: rgba(200,169,106,0.15); color: #C8A96A; font-weight: bold; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; shrink-0; align-self: flex-start; line-height: 1.75rem; margin-right: 0.5rem;">\${idx + 1}</div><div><strong style="color: #F5F5F0; font-weight: 600;">\${item.title}</strong><p style="color: #A5BCAE; font-size: 0.9rem; margin-top: 0.25rem; line-height: 1.5;">\${item.desc}</p></div></li>\`).join('')}</ol>\`;
          default:
            return '';
        }
      }).join('');`;

if (runSnapContent.includes(oldRenderer)) {
  runSnapContent = runSnapContent.replace(oldRenderer, newRenderer);
  console.log('Successfully replaced standard renderer with structured block renderer in run-snap-with-info.js');
} else {
  // Let's search if it was already updated or has minor whitespace differences
  console.log('Renderer already updated or mismatch. Searching dynamically...');
  const searchStart = runSnapContent.indexOf('const bodyText = post.content.map(');
  if (searchStart !== -1) {
    const searchEnd = runSnapContent.indexOf(").join('');", searchStart) + ").join('');".length;
    const foundRenderer = runSnapContent.substring(searchStart, searchEnd);
    console.log('Found renderer matches:', foundRenderer);
    runSnapContent = runSnapContent.replace(foundRenderer, newRenderer);
    console.log('Successfully replaced dynamically!');
  } else {
    console.warn('Could not find bodyText renderer line to replace. Please check run-snap-with-info.js manually.');
  }
}

// Write the updated file
fs.writeFileSync(runSnapPath, runSnapContent, 'utf8');
console.log('Successfully synced BLOG_POSTS to run-snap-with-info.js!');
