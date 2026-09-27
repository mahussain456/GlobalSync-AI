"""Builds app + tray icons from the globalsync-ai logo.

Source: the cream "g" in GlobalSyncAI/Explainer_Video/brand/logo-trim-cream.png.
Output: build/icon.png (1024), build/icon.ico, assets/tray-*.png
Run:    python scripts/make_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
LOGO = Path(r"D:\AI_Stuff\GlobalSyncAI\Explainer_Video\brand\logo-trim-cream.png")

FOREST = (14, 42, 31)
DEEP = (27, 77, 62)
GOLD = (200, 169, 106)
CREAM = (244, 239, 230)


def glyph_g():
    """Crop the lowercase 'g' out of the wordmark, trimmed to its alpha box."""
    logo = Image.open(LOGO).convert("RGBA")
    g = logo.crop((0, 0, 270, logo.height))
    solid_alpha = g.getchannel("A").point(lambda a: 255 if a > 40 else 0)  # ignore faint AA noise
    return g.crop(solid_alpha.getbbox())


def app_icon(size=1024):
    s = size
    # vertical forest gradient
    bg = Image.new("RGBA", (s, s))
    px = bg.load()
    for y in range(s):
        t = y / (s - 1)
        c = tuple(int(DEEP[i] * (1 - t) + FOREST[i] * t) for i in range(3)) + (255,)
        for x in range(s):
            px[x, y] = c
    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.225), fill=255)
    icon = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    icon.paste(bg, (0, 0), mask)

    # gold meridian orbit + dot
    ring = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(ring)
    pad = int(s * 0.14)
    d.arc((pad, pad, s - pad, s - pad), start=235, end=520, fill=GOLD + (230,), width=int(s * 0.018))
    r = int(s * 0.035)
    cx, cy = int(s * 0.5 + (s / 2 - pad) * 0.94), int(s * 0.5 - (s / 2 - pad) * 0.34)
    glow = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((cx - r * 3, cy - r * 3, cx + r * 3, cy + r * 3), fill=GOLD + (120,))
    ring = Image.alpha_composite(glow.filter(ImageFilter.GaussianBlur(s * 0.03)), ring)
    ImageDraw.Draw(ring).ellipse((cx - r, cy - r, cx + r, cy + r), fill=GOLD + (255,))
    icon = Image.alpha_composite(icon, ring)

    g = glyph_g()
    gh = int(s * 0.50)
    g = g.resize((int(g.width * gh / g.height), gh), Image.LANCZOS)
    icon.alpha_composite(g, ((s - g.width) // 2, (s - g.height) // 2 + int(s * 0.02)))
    return icon


def tray(size, color, plate=None):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if plate:
        ImageDraw.Draw(img).rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 4, fill=plate)
    g = glyph_g()
    gh = int(size * (0.78 if plate else 0.95))
    g = g.resize((max(1, int(g.width * gh / g.height)), gh), Image.LANCZOS)
    solid = Image.new("RGBA", g.size, color + (255,))
    solid.putalpha(g.getchannel("A"))
    img.alpha_composite(solid, ((size - g.width) // 2, (size - g.height) // 2))
    return img


def main():
    (ROOT / "build").mkdir(exist_ok=True)
    (ROOT / "assets").mkdir(exist_ok=True)
    (ROOT / "src" / "img").mkdir(exist_ok=True)
    icon = app_icon()
    icon.save(ROOT / "build" / "icon.png")
    icon.save(ROOT / "src" / "img" / "mark.png")
    icon.save(ROOT / "build" / "icon.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    # Windows tray: cream g on forest plate. macOS: black template glyph (OS tints it).
    tray(32, CREAM, FOREST + (255,)).save(ROOT / "assets" / "tray-win.png")
    tray(16, (0, 0, 0)).save(ROOT / "assets" / "trayTemplate.png")
    tray(32, (0, 0, 0)).save(ROOT / "assets" / "trayTemplate@2x.png")
    print("icons written")


if __name__ == "__main__":
    main()
