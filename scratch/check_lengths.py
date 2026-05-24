import os
import re

build_dir = r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\build"

html_files = []
for root, dirs, files in os.walk(build_dir):
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

print(f"Found {len(html_files)} HTML files to inspect.")

long_titles = []
long_descs = []
short_descs = []

for file_path in html_files:
    relative_path = os.path.relpath(file_path, build_dir)
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Title extraction
    title_match = re.search(r"<title[^>]*>(.*?)</title>", content, re.IGNORECASE)
    if title_match:
        title = title_match.group(1).strip()
        if len(title) > 60:
            long_titles.append((relative_path, title, len(title)))
            
    # Description extraction
    desc_match = re.search(r'<meta[^>]+name=["\']description["\'][^>]*content=["\'](.*?)["\']', content, re.IGNORECASE)
    if not desc_match:
        # Try alternate attribute ordering
        desc_match = re.search(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']', content, re.IGNORECASE)
        
    if desc_match:
        desc = desc_match.group(1).strip()
        if len(desc) > 155:
            long_descs.append((relative_path, desc, len(desc)))
        elif len(desc) < 120:
            short_descs.append((relative_path, desc, len(desc)))

print("\n--- Long Titles (> 60 chars) ---")
for r, t, l in long_titles:
    print(f"[{l} chars] {r}: {t}")

print("\n--- Long Descriptions (> 155 chars) ---")
for r, d, l in long_descs:
    print(f"[{l} chars] {r}: {d}")

print("\n--- Short Descriptions (< 120 chars) ---")
for r, d, l in short_descs:
    print(f"[{l} chars] {r}: {d}")
