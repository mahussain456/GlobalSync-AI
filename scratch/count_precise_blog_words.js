const { BLOG_POSTS } = require('../frontend/src/data/blogData.js');

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
  console.log(`Post ${i+1} (${post.slug}): ${countWords(text)} words`);
});
