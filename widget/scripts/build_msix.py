"""Builds the Microsoft Store package (MSIX) for GlobalSync World Clock.

The Store signs MSIX packages itself, so the Store version installs with no "unknown publisher" warning.

1. Reserve the app name in Partner Center, then copy the three identity values from
   Product management -> Product identity into msix.json (Name, Publisher, PublisherDisplayName).
2. cargo build --release   (in src-tauri)
3. python scripts/build_msix.py
   -> dist/msix/GlobalSync-World-Clock_<version>.0_x64.msix   (upload this in Partner Center)
"""
import json
import shutil
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "msix.json").read_text(encoding="utf-8"))
VERSION = json.loads((ROOT / "src-tauri" / "tauri.conf.json").read_text(encoding="utf-8"))["version"] + ".0"
REL = ROOT / "src-tauri" / "target" / "release"
TOOLS = Path.home() / ".sdkbt" / "bin" / "10.0.28000.0" / "x64"   # Microsoft.Windows.SDK.BuildTools (NuGet)
MAKEAPPX, MAKEPRI = TOOLS / "makeappx.exe", TOOLS / "makepri.exe"
OUT = ROOT / "dist" / "msix"
LAYOUT = OUT / "layout"

FOREST = (14, 42, 31, 255)


def assets(icon: Image.Image):
    a = LAYOUT / "Assets"
    a.mkdir(parents=True, exist_ok=True)

    def square(name, size, pad=0.0, bg=None):
        canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
        inner = int(size * (1 - pad * 2))
        canvas.alpha_composite(icon.resize((inner, inner), Image.LANCZOS), ((size - inner) // 2, (size - inner) // 2))
        canvas.save(a / name)

    for scale in (100, 200, 400):
        k = scale / 100
        square(f"Square150x150Logo.scale-{scale}.png", int(150 * k), pad=.08)
        square(f"Square44x44Logo.scale-{scale}.png", int(44 * k))
        square(f"StoreLogo.scale-{scale}.png", int(50 * k))
        w, h = int(310 * k), int(150 * k)          # wide tile: icon on forest
        wide = Image.new("RGBA", (w, h), FOREST)
        s = int(h * .7)
        wide.alpha_composite(icon.resize((s, s), Image.LANCZOS), ((w - s) // 2, (h - s) // 2))
        wide.save(a / f"Wide310x150Logo.scale-{scale}.png")
    for t in (16, 24, 32, 48, 256):               # taskbar / Start icons
        square(f"Square44x44Logo.targetsize-{t}.png", t)
        square(f"Square44x44Logo.targetsize-{t}_altform-unplated.png", t)


def manifest():
    c = {k: escape(v) for k, v in CFG.items()}
    return f"""<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
         xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
         xmlns:desktop="http://schemas.microsoft.com/appx/manifest/desktop/windows10"
         xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities"
         IgnorableNamespaces="uap desktop rescap">
  <Identity Name="{c['Name']}" Publisher="{c['Publisher']}" Version="{VERSION}" ProcessorArchitecture="x64" />
  <Properties>
    <DisplayName>GlobalSync World Clock</DisplayName>
    <PublisherDisplayName>{c['PublisherDisplayName']}</PublisherDisplayName>
    <Logo>Assets\\StoreLogo.png</Logo>
    <Description>A free desktop world clock for remote teams.</Description>
  </Properties>
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.26100.0" />
  </Dependencies>
  <Resources>
    <Resource Language="en-us" />
  </Resources>
  <Applications>
    <Application Id="WorldClock" Executable="globalsync-world-clock.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="GlobalSync World Clock" Description="Four cities, live call status, on your desktop."
        BackgroundColor="transparent" Square150x150Logo="Assets\\Square150x150Logo.png" Square44x44Logo="Assets\\Square44x44Logo.png">
        <uap:DefaultTile Wide310x150Logo="Assets\\Wide310x150Logo.png" ShortName="World Clock" />
      </uap:VisualElements>
      <Extensions>
        <!-- Appears in Settings > Apps > Startup so users can launch it at sign-in. -->
        <desktop:Extension Category="windows.startupTask" Executable="globalsync-world-clock.exe" EntryPoint="Windows.FullTrustApplication">
          <desktop:StartupTask TaskId="GlobalSyncWorldClockStartup" Enabled="false" DisplayName="GlobalSync World Clock" />
        </desktop:Extension>
      </Extensions>
    </Application>
  </Applications>
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
</Package>
"""


def main():
    if LAYOUT.exists():
        shutil.rmtree(LAYOUT)
    LAYOUT.mkdir(parents=True)
    for f in ("globalsync-world-clock.exe", "WebView2Loader.dll"):
        shutil.copy2(REL / f, LAYOUT / f)
    assets(Image.open(ROOT / "build" / "icon.png").convert("RGBA"))
    (LAYOUT / "AppxManifest.xml").write_text(manifest(), encoding="utf-8")
    # Resource index so Windows picks the right logo for each display scale.
    cfg = OUT / "priconfig.xml"
    subprocess.run([str(MAKEPRI), "createconfig", "/cf", str(cfg), "/dq", "en-US", "/o"], check=True, capture_output=True)
    subprocess.run([str(MAKEPRI), "new", "/pr", str(LAYOUT), "/cf", str(cfg), "/mn", str(LAYOUT / "AppxManifest.xml"),
                    "/of", str(LAYOUT / "resources.pri"), "/o"], check=True, capture_output=True)
    pkg = OUT / f"GlobalSync-World-Clock_{VERSION}_x64.msix"
    subprocess.run([str(MAKEAPPX), "pack", "/d", str(LAYOUT), "/p", str(pkg), "/o", "/h", "SHA256"], check=True)
    print("built", pkg, f"{pkg.stat().st_size / 1048576:.1f} MB")


if __name__ == "__main__":
    main()
