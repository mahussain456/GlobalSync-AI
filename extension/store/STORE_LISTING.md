# GlobalSync World Clock — store listing kit

Package: `GlobalSync-World-Clock-Extension-1.0.0-chrome.zip` (Chrome Web Store, Microsoft Edge Add-ons, Opera add-ons)
and `GlobalSync-World-Clock-Extension-1.0.0-firefox.zip` (addons.mozilla.org).

## Basics
- **Name:** GlobalSync World Clock
- **Summary (132 characters max):** Select any time on a page, like “Thursday 3pm EST”, and see it in your cities, with who's at work. Private and tiny.
- **Category:** Productivity → Tools (Chrome) · Productivity (Edge) · Other/Productivity (Firefox)
- **Language:** English
- **Website:** https://www.globalsync-ai.com/world-clock-widget
- **Support:** https://www.globalsync-ai.com/contact
- **Privacy policy:** https://www.globalsync-ai.com/privacy-policy

## Description
Stop doing time-zone math in your head.

Select any time on a web page, like “Thursday at 3pm EST” in an email, “15:00 CET” in a doc or “10am PT” in a chat, and World Clock shows it in your four cities, with a quiet signal for who's at work, finishing up or asleep.

HOW IT WORKS
• Select a time. A small clock button appears above it. Click it for the conversion.
• Right-click any selection and choose “Convert with World Clock”.
• Open the toolbar popup (Alt+Shift+T) and type: “9:30am IST tomorrow”, “noon PT”, “Apr 16 3pm CET”.
• Copy the converted times straight into your invite.

MADE TO STAY OUT OF YOUR WAY
• Nothing appears until you select a time. Everything else on the page is left alone.
• The card is compact, draggable and closes with Esc, a click elsewhere, or scrolling.
• Optional floating mini clock for your cities. Drag it anywhere. It fades back until you hover and hides during full-screen video.
• Switch it off for any site with one toggle.

SMART ABOUT TIME
• Understands abbreviations (EST, PT, CET, IST, JST, AEST…), 160+ city names, offsets like GMT+5, and days: today, tomorrow, weekdays, “April 16”.
• Daylight saving is handled automatically from your browser's built-in time-zone data.
• Weekends follow each country (Friday is the weekend in Riyadh, a workday in Dubai).
• 12 or 24-hour time, your own work hours, Forest or Paper theme. Settings sync across your devices.

PRIVATE BY DESIGN
• Converts entirely on your device. No servers, no account, no analytics, no ads.
• What you select never leaves your browser.
• About 41 KB, with no frameworks.

Also available as a free desktop widget for Windows and Mac, from GlobalSync AI.

## Permission justifications (Chrome "Privacy practices" tab)
- **Single purpose:** Converts times the user selects or types into the user's chosen cities.
- **storage:** Saves the user's cities and preferences (and syncs them across the user's own browsers).
- **contextMenus:** Adds “Convert with World Clock” to the right-click menu for selected text.
- **Host permissions / content script on http(s) pages:** Needed to notice when the user selects a time on a page and show the conversion next to it. The script reads only the user's own text selection, only after they make it, and never sends it anywhere.
- **Remote code:** No. All code ships in the package.

## Data usage answers
- Collects: **nothing** (tick none of the data categories).
- Certify: not sold or transferred to third parties; not used for unrelated purposes; not used for creditworthiness or lending.
- Firefox: `data_collection_permissions: none` is already set in the manifest.

## Images (in `assets/`)
| Store field | File |
|---|---|
| Store icon 128×128 | `app/icons/128.png` |
| Screenshots 1280×800 (upload all 5, in order) | `screenshot-1…5*.png` |
| Small promo tile 440×280 | `promo-tile_440x280.png` |
| Marquee 1400×560 (optional) | `marquee_1400x560.png` |
