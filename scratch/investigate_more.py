import os
import re

build_dir = r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\build"

html_files = []
for root, dirs, files in os.walk(build_dir):
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

print(f"--- Long Descriptions (> 155 chars) ---")
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    desc_match = re.search(r'<meta[^>]+name=["\']description["\'][^>]*content=["\'](.*?)["\']', content, re.IGNORECASE)
    if not desc_match:
        desc_match = re.search(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']', content, re.IGNORECASE)
        
    if desc_match:
        desc = desc_match.group(1).strip()
        if len(desc) > 155:
            relative_path = os.path.relpath(file_path, build_dir)
            print(f"[{len(desc)} chars] {relative_path}: {desc}")

print("\n--- Potential 3XX Redirect Links ---")
# Check for links ending in trailing slash (except /) or http:// instead of https://
for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    page_links = re.findall(r'<a[^>]+href=["\'](.*?)["\']', content, re.IGNORECASE)
    for l in page_links:
        if l.startswith("http://"):
            print(f"HTTP Link in {file_path}: {l}")
        if l.startswith("/") and len(l) > 1 and l.endswith("/"):
            print(f"Trailing Slash Link in {os.path.relpath(file_path, build_dir)}: {l}")
