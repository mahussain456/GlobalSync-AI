import re

def count_words(text):
    words = re.findall(r'\b\w+\b', text)
    return len(words)

# Read blogData.js
with open(r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\src\data\blogData.js", "r", encoding="utf-8") as f:
    content = f.read()

# Let's parse BLOG_POSTS roughly or count words in sections
# Since it's javascript, let's extract each block content
posts = re.split(r'slug:\s*"', content)[1:]

for i, post in enumerate(posts):
    slug = post.split('"')[0]
    # find all strings inside text fields
    texts = re.findall(r'text:\s*"([^"]+)"', post)
    # also find items in lists
    items = re.findall(r'"([^"]+)"', post)
    # combine all text
    combined_text = " ".join(texts + items)
    print(f"Post {i+1} ({slug}): {count_words(combined_text)} words")
