"""Packages GlobalSync Time Lens.

python build.py  ->  dist/GlobalSync-Time-Lens-<v>-chrome.zip   (Chrome Web Store · Edge Add-ons · Opera · Brave/Arc/Vivaldi)
                     dist/GlobalSync-Time-Lens-<v>-firefox.zip  (Firefox Add-ons)
                     dist/GlobalSync-Time-Lens-<v>-unpacked/    (Load unpacked / developer mode)
"""
import json, shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP, DIST = ROOT / "app", ROOT / "dist"
manifest = json.loads((APP / "manifest.json").read_text(encoding="utf-8"))
V = manifest["version"]
FILES = sorted(p for p in APP.rglob("*") if p.is_file())


def pack(name, mf):
    out = DIST / name
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in FILES:
            arc = p.relative_to(APP).as_posix()
            z.writestr(arc, json.dumps(mf, ensure_ascii=False, indent=2) if arc == "manifest.json" else p.read_bytes())
    print(f"{out.name}: {out.stat().st_size / 1024:.0f} KB")


DIST.mkdir(exist_ok=True)
pack(f"GlobalSync-Time-Lens-{V}-chrome.zip", manifest)

ff = json.loads(json.dumps(manifest))
ff["background"] = {"scripts": ["core.js", "background.js"]}          # Firefox MV3 uses event pages
ff.pop("minimum_chrome_version", None)
ff["browser_specific_settings"] = {"gecko": {"id": "time-lens@globalsync-ai.com", "strict_min_version": "140.0",
                                             "data_collection_permissions": {"required": ["none"]}},
                                "gecko_android": {"strict_min_version": "142.0"}}
pack(f"GlobalSync-Time-Lens-{V}-firefox.zip", ff)

unpacked = DIST / f"GlobalSync-Time-Lens-{V}-unpacked"
shutil.rmtree(unpacked, ignore_errors=True)
shutil.copytree(APP, unpacked)
print("unpacked:", unpacked.name)
