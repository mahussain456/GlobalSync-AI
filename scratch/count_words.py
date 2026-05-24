import os
import re

BUILD_DIR = r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\build"
routes = [
    ("", 600),
    ("time-zone-converter", 800),
    ("meeting-planner", 800),
    ("currency-converter", 800),
    ("freelancer-rate-converter", 800),
    ("about", 400),
    ("methodology", 600)
]

for route, target in routes:
    if route == "":
        path = os.path.join(BUILD_DIR, "index.html")
    else:
        path = os.path.join(BUILD_DIR, route, "index.html")
        
    if not os.path.exists(path):
        print(f"[-] {route if route else '/'}: File not found at {path}")
        continue
        
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
        
    # Remove script and style tags
    text = re.sub(r"<script\b[^<]*(?:(?!</script>)<[^<]*)*</script>", " ", html, flags=re.IGNORECASE)
    text = re.sub(r"<style\b[^<]*(?:(?!</style>)<[^<]*)*</style>", " ", text, flags=re.IGNORECASE)
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Tokenize and count words
    words = [w for w in text.split() if w.strip()]
    count = len(words)
    
    status = "[PASS]" if count >= target else "[FAIL]"
    print(f"{status} {route if route else '/'}: {count} words (Target: {target})")
