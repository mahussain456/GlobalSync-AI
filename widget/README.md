# GlobalSync World Clock

A lightweight desktop world-clock widget for remote teams, in the globalsync-ai brand. Windows + macOS.

![icon](build/icon.png)

| | |
|---|---|
| Windows installer | **1.6 MB** (`GlobalSync World Clock_1.1.0_x64-setup.exe`) |
| Installed size | about 4 MB |
| Memory while running | about 140 MB private (uses the system browser engine: WebView2 on Windows, WebKit on Mac) |
| Admin rights needed | None. Installs per user |

## Install (for users)
**Windows 10/11:** run `GlobalSync World Clock_…_x64-setup.exe` and click through. No admin prompt. The widget appears at the top-right of your screen and in the tray.
> Until the app is code-signed, Windows SmartScreen may say "Windows protected your PC". Click **More info → Run anyway**.

**macOS 11+ (Intel and Apple Silicon):** open the `.dmg` and drag *GlobalSync World Clock* into Applications. It lives in the menu bar (no Dock icon).
> Until the app is notarized, the first launch is blocked. **Right-click the app → Open → Open**, or go to System Settings → Privacy & Security → **Open Anyway**. You only need to do this once.

## What it does
- **Up to 4 clocks**, each with a live sky for that city's local time. 13 cities have hand-drawn landmarks.
- **Call status**: *Good time to call*, *Starts in 40m*, *After hours*, *Asleep*, *Weekend* (each country's own weekend).
- **Time preview**: drag the bottom timeline or use the arrow keys. Preview times are shown in gold italics with dashed borders, and snap back to live after 90 seconds. **Copy times** gives you a ready-to-paste list.
- **Move it anywhere**: grab any part of the widget except the buttons and the timeline. It snaps to screen edges and remembers its spot, including across monitors with different scaling.
- Themes: Forest, Paper or Auto. Sizes S/M/L, Scenic or Compact layout, opacity, always-on-top, launch at login.
- Tray / menu-bar icon plus a hotkey to show or hide: **Ctrl+Alt+Shift+W** (⌘⌥⇧W on Mac).
- Footer link: *Free meeting planner → globalsync-ai.com* (`?ref=world-clock`).

## Build
Needs Node 18+ and Rust (install with [rustup](https://rustup.rs)).
```bash
npm install
npm run dev         # run it with live reload
npm run build:win   # → src-tauri/target/release/bundle/nsis/*.exe
npm run build:mac   # on a Mac → src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg
```
**No Mac? Use GitHub.** Push this folder to a GitHub repo, then push a tag (`git tag v1.1.0 && git push --tags`). `.github/workflows/release.yml` builds the Windows `.exe` and the universal macOS `.dmg`, then attaches both to a draft Release.

This Windows machine builds with the GNU Rust toolchain (no Visual Studio needed). `dlltool`/`as` come from a portable WinLibs MinGW in `~/.winlibs/mingw64/bin`, which must be on `PATH` when building.

Debug: set `WC_DEBUG=1` to log window placement to `%TEMP%/world-clock-debug.log`.

## Where things live
| Path | Job |
|---|---|
| `src/` | The widget UI: plain HTML/CSS/JS, no framework or bundler |
| `src/app.js` | Clocks, time preview, search, settings |
| `src/scene.js` | Sky and skyline and landmark renderer (SVG) |
| `src/cities.js` | City catalog. Add a row to add a city |
| `src/bridge.js` | Connects the UI to the native shell |
| `src-tauri/src/main.rs` | Window, tray, hotkey, edge snapping, launch at login |
| `scripts/make_icons.py` | Rebuilds all icons from the logo |

## Before a public launch
- **Code signing** removes the SmartScreen and Gatekeeper warnings above. On Windows you need an OV/EV certificate (about $200–400/yr). On Mac you need an Apple Developer ID ($99/yr) plus notarization. Both plug into `tauri-action` through repo secrets.
