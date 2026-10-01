# Install GlobalSync World Clock

## From the stores (once published)
Chrome Web Store · Microsoft Edge Add-ons · Firefox Add-ons: search “GlobalSync World Clock”.

## Install it yourself (any Chromium browser: Chrome, Edge, Brave, Opera, Vivaldi, Arc)
1. Unzip `GlobalSync-World-Clock-Extension-1.0.0-chrome.zip` (or use the `-unpacked` folder).
2. Open the extensions page:
   - Chrome / Brave / Vivaldi / Arc: `chrome://extensions`
   - Edge: `edge://extensions`
   - Opera: `opera://extensions`
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose the unzipped folder.
5. Pin it: click the puzzle icon in the toolbar and pin **World Clock**.

Keep the folder where it is; the browser loads the extension from it.

## Firefox
- Permanent: install from addons.mozilla.org once it's listed. Firefox only installs signed add-ons, and Mozilla signs it when you upload.
- Quick try: open `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → choose
  `GlobalSync-World-Clock-Extension-1.0.0-firefox.zip`. It stays until Firefox restarts. Requires Firefox 140+.

## Publish it
| Store | Link | Cost | Upload |
|---|---|---|---|
| Chrome Web Store | https://chrome.google.com/webstore/devconsole | One-time $5 registration | `…-chrome.zip` |
| Microsoft Edge Add-ons | https://partner.microsoft.com/dashboard/microsoftedge/overview | Free | `…-chrome.zip` (same file) |
| Firefox Add-ons | https://addons.mozilla.org/developers/ | Free | `…-firefox.zip` |
| Opera add-ons | https://addons.opera.com/developer/ | Free | `…-chrome.zip` |

Listing text, permission justifications and images: `store/STORE_LISTING.md` and `store/assets/`.

## Build from source
`python build.py` → `dist/` (Chrome zip, Firefox zip, unpacked folder). Source lives in `app/`.
