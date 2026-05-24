import os
import re
from urllib.parse import urlparse

build_dir = r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\build"

html_files = []
for root, dirs, files in os.walk(build_dir):
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

print(f"Found {len(html_files)} HTML files to inspect.")

og_mismatch = []
links = []

for file_path in html_files:
    relative_path = "/" + os.path.relpath(file_path, build_dir).replace("\\", "/").replace("/index.html", "").replace("index.html", "")
    if relative_path == "/": relative_path = ""
    full_url = f"https://www.globalsync-ai.com{relative_path}"
    
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Check Canonical vs OG URL
    canon = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', content, re.IGNORECASE)
    if not canon:
        canon = re.search(r'<link[^>]+href=["\'](.*?)["\'][^>]+rel=["\']canonical["\']', content, re.IGNORECASE)
    og = re.search(r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\'](.*?)["\']', content, re.IGNORECASE)
    if not og:
        og = re.search(r'<meta[^>]+content=["\'](.*?)["\'][^>]+property=["\']og:url["\']', content, re.IGNORECASE)
        
    c_url = canon.group(1).strip() if canon else None
    o_url = og.group(1).strip() if og else None
    
    if c_url != o_url:
        og_mismatch.append((full_url, c_url, o_url))
        
    # Extract internal links
    page_links = re.findall(r'<a[^>]+href=["\'](.*?)["\']', content, re.IGNORECASE)
    for l in page_links:
        if not l.startswith("http") and not l.startswith("#") and not l.startswith("mailto:"):
            # Internal link
            links.append((full_url, l))
        elif l.startswith("https://www.globalsync-ai.com"):
            links.append((full_url, l))

print(f"\n--- OG/Canonical Mismatches ({len(og_mismatch)}) ---")
for f, c, o in og_mismatch:
    print(f"Page: {f}\n  Canonical: {c}\n  OG: {o}")

# Process link targets
from collections import defaultdict
incoming = defaultdict(set)
for source, target in links:
    # Normalize target
    if target.startswith("https://www.globalsync-ai.com"):
        target = target.replace("https://www.globalsync-ai.com", "")
    target = target.split("?")[0].split("#")[0] # strip query/hash
    if not target.startswith("/"): target = "/" + target
    if target.endswith("/") and target != "/": target = target[:-1]
    
    incoming[target].add(source)

one_link_pages = []
for file_path in html_files:
    target = "/" + os.path.relpath(file_path, build_dir).replace("\\", "/").replace("/index.html", "").replace("index.html", "")
    if target == "//": target = "/"
    if target.endswith("/") and target != "/": target = target[:-1]
    
    # Exclude 200.html
    if "200.html" in file_path: continue
    
    count = len(incoming[target])
    if count <= 1:
        sources = list(incoming[target])
        one_link_pages.append((target, count, sources))

print(f"\n--- Pages with <= 1 incoming link ({len(one_link_pages)}) ---")
for t, c, s in one_link_pages[:10]:
    print(f"{t}: {c} links from {s}")
if len(one_link_pages) > 10:
    print(f"... and {len(one_link_pages) - 10} more.")

