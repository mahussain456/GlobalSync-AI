import re

def count_words(text):
    words = re.findall(r'\b\w+\b', text)
    return len(words)

# Read run-snap-with-info.js
with open(r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\scripts\run-snap-with-info.js", "r", encoding="utf-8") as f:
    content = f.read()

# find the section with BLOG_POSTS in run-snap-with-info.js
start_idx = content.find("const BLOG_POSTS = [")
end_idx = content.find("const CATEGORY_STYLES =", start_idx)
blog_posts_section = content[start_idx:end_idx]

posts = re.split(r'slug:\s*"', blog_posts_section)[1:]

for i, post in enumerate(posts):
    slug = post.split('"')[0]
    # find all strings inside the content array
    content_array_match = re.search(r'content:\s*\[(.*?)\]', post, re.DOTALL)
    if content_array_match:
        content_text = content_array_match.group(1)
        # find all quoted strings
        strings = re.findall(r'"([^"]+)"', content_text)
        combined_text = " ".join(strings)
        print(f"Post {i+1} ({slug}): {count_words(combined_text)} words")
