import os
from PIL import Image

public_dir = 'frontend/public'

# 1. Optimize world-map-bg.png
map_png_path = os.path.join(public_dir, 'world-map-bg.png')
map_webp_path = os.path.join(public_dir, 'world-map-bg.webp')

if os.path.exists(map_png_path):
    print(f"Optimizing {map_png_path}...")
    img = Image.open(map_png_path)
    # Convert RGBA to RGB using a dark background since the site theme is dark
    # or just convert to WebP directly (WebP supports alpha channel)
    img.save(map_webp_path, 'WEBP', quality=75)
    print(f"Saved to {map_webp_path} (Size: {os.path.getsize(map_webp_path) / 1024:.1f} KB, was {os.path.getsize(map_png_path) / 1024:.1f} KB)")
else:
    print(f"File not found: {map_png_path}")

# 2. Optimize logo-dark.png (Resize to 300x100 max and convert to WebP)
logo_png_path = os.path.join(public_dir, 'logo-dark.png')
logo_webp_path = os.path.join(public_dir, 'logo-dark.webp')

if os.path.exists(logo_png_path):
    print(f"Optimizing {logo_png_path}...")
    img = Image.open(logo_png_path)
    # Resize keeping aspect ratio (target height 80px)
    target_height = 80
    aspect_ratio = img.width / img.height
    target_width = int(target_height * aspect_ratio)
    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    img_resized.save(logo_webp_path, 'WEBP', quality=85)
    print(f"Saved to {logo_webp_path} (Size: {os.path.getsize(logo_webp_path) / 1024:.1f} KB, was {os.path.getsize(logo_png_path) / 1024:.1f} KB)")
else:
    print(f"File not found: {logo_png_path}")
