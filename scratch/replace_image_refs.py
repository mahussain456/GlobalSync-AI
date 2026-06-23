import os

src_dir = 'frontend/src'

replacements = {
    'world-map-bg.png': 'world-map-bg.webp',
    'logo-dark.png': 'logo-dark.webp'
}

count = 0
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
            
            if modified:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated references in: {file_path}")
                count += 1

print(f"Replacement complete. Updated {count} files.")
