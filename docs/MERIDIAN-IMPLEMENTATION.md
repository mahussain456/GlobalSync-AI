# Meridian implementation

Approved direction: ivory, forest green and muted gold; Playfair Display headlines, DM Sans text, the supplied wordmark and a complete paper atlas. The user's final direction adds subtle hero animation with a seamless ivory treatment.

## What ships

- React homepage matching the approved composition, with an animated atlas, pointer response, reduced-motion support and off-screen pause.
- Shared branded navigation and footer. Existing time-zone, currency, invoice, rates, workspace and editorial routes remain available.
- Homepage quick planner with date and duration controls, team presets, whole-meeting working-hour checks, copying and calendar downloads. The full planner supports custom cities, working hours, weekday filtering and shareable links.
- Accessible cookie preferences, mobile navigation with Escape/outside handling, route scroll reset, visible keyboard focus and descriptive tool links.
- A lightweight homepage fallback for hosts that cannot run Chrome during the build. It shows the branded hero and usable navigation before JavaScript loads.

## Assets

`frontend/public/meridian/meridian-finished-hero.png` and `logo-finished.png` are approved ChatGPT image-tool edits, copied from the design preview. The logo is an AI-cleaned transparent raster derivative; the supplied originals are preserved in the user's New_Logo folder. `logo-original-transparent.png` and `logo-original-icon.png` are unchanged copies of supplied assets.

Hero prompt: Edit this supplied image for the GlobalSync AI Meridian homepage. Preserve the beautiful ivory paper world atlas sculpture, forest green continents and three delicate gold route connections. Main fix: zoom out substantially so EVERY edge and both ends of the paper sculpture are fully visible with at least 12 percent empty background margin on ALL sides. The artwork must look complete, meticulously finished, with smoothly rounded paper corners and realistic paper thickness. No paper or shadows cut by the frame. Entire sculpture centered, warm ivory seamless studio backdrop, soft elegant light and beautiful natural contact shadow, refined premium editorial photography. Keep image landscape 3:2. No text, no additional objects, no UI. The image will sit inside a rounded website picture frame.

Logo prompt: Clean up this exact supplied globalsync-ai wordmark for high-quality web use. Preserve the exact letterforms, spacing, proportions and distinctive lowercase g; do not redesign or change typography. Preserve dark forest green globalsync and muted gold -ai. Remove only the ivory background and paper texture, yielding a genuinely transparent alpha background, smooth crisp anti-aliased solid-color letter edges and solid interiors. Tight canvas around the whole wordmark with 4 percent padding. Wide horizontal transparent PNG. Exact text globalsync-ai. No shadow, no bevel, no mockup, no frame.

## Verification commands

From `frontend`: `npm run test:ci`, `npm run build`, `node scripts/check-built-site.js`, `node scripts/verify-meridian.cjs`, `node scripts/verify-browser.js`, `node scripts/verify-meeting-planner.js`.

Browser scripts accept `VERIFY_BASE_URL` and `VERIFY_OUTPUT_DIR`. The currency and workspace regression suites use clearly controlled rate fixtures for repeatable expectations. Live deployment checks must separately verify real asset and route responses.

Working hours in the homepage quick planner apply every day. Holidays and personal calendar availability are not checked. Calendar files create a draft; no invitations are sent automatically. Contact and invoice email delivery require a configured backend, and checks must not send real messages without user instruction.
