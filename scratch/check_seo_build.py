import os
import re

build_dir = r"d:\AI_Stuff\Gravity\GlobalSync-AI\frontend\build"

html_files = []
for root, dirs, files in os.walk(build_dir):
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

print(f"Found {len(html_files)} HTML files to inspect.")

duplicate_titles = 0
duplicate_descs = 0
total_inspected = 0

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    # Check title tags (both opening and closing/content-wise)
    # Using case-insensitive regex for <title... >...</title> or just count <title
    titles = re.findall(r"<title[^>]*>", content, re.IGNORECASE)
    descs = re.findall(r'<meta[^>]+name=["\']description["\'][^>]*>', content, re.IGNORECASE)
    
    if len(titles) > 1:
        print(f"[DUPLICATE TITLE] {file_path} has {len(titles)} titles: {titles}")
        duplicate_titles += 1
    if len(descs) > 1:
        print(f"[DUPLICATE DESC] {file_path} has {len(descs)} descriptions: {descs}")
        duplicate_descs += 1
        
    total_inspected += 1

print("\n--- Summary ---")
print(f"Total files checked: {total_inspected}")
print(f"Files with duplicate titles: {duplicate_titles}")
print(f"Files with duplicate descriptions: {duplicate_descs}")
