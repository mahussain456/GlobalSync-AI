# Audit implementation

This release implements the reliability, homepage, accessibility and SEO repairs from [the audit](README.md). The longer-term growth proposals remain experiments to measure after deployment.

## Changes

- **Currency:** homepage, dashboard, pair pages, freelance calculators and invoices share one timestamped USD reference snapshot and derive cross rates from it. Cached build rates retain their original timestamp and are labeled. Missing currencies and unavailable providers no longer silently become a rate of 1 or invented “live” data.
- **Time:** current offsets replace hard-coded winter labels. Meeting windows exclude the closing boundary, preserve fractional offsets and separate windows across UTC midnight. The planner accepts a meeting date. Explicit date/time queries produce a dated conversion; skipped and repeated daylight-saving times require a new input. Abbreviation converters consistently use fixed offsets.
- **Invoices:** preview and downloaded PDF show the client amount due. Personal tax deductions are removed from client documents. Rate-to-invoice navigation carries the quote; non-hourly quotes become one line item. Provider failures prevent misleading conversion exports.
- **Plans:** simulated checkout and simulated upgrades are disabled. A clear availability page documents free limits and explains that Pro upgrades are unavailable. Email delivery without a configured provider returns an error instead of claiming the invoice was sent.
- **Homepage:** shorter headline and a meeting-first action, working freelance entry point, visible FAQs, descriptive controls, visible keyboard focus and an opaque navigation background. Homepage tools are available on mobile, city-removal controls move off the map, and the meeting timeline stays inside its container.
- **Content:** remove public drafting instructions, hide unconfigured advertising, align rate methodology and remove unsupported universal payment-fee comparisons. Mark illustrative overhead assumptions as examples.
- **SEO:** render all pages from the application instead of maintaining separate fallback prose. Remove the DOM mutation guard that conflicts with React; replace the snapshot once at startup and let Helmet own metadata. Support existing schema props, normalize absolute canonicals, remove duplicate Twitter tags and exclude noindex utility pages from the sitemap.
- **Measurement:** analytics loads after affirmative cookie consent. Calculation and meeting-share events contain tool-level properties; automatic posting of raw queries to history is removed.

## Verification

- Production React compilation with `CI=true` and warnings treated as errors.
- 13 deterministic tests covering rates, unsupported currencies, fractional offsets, meeting end boundaries, UTC midnight, month boundaries, date parsing and both daylight-saving transition cases.
- Full prerender of the 359 configured routes; generated-page assertions check one title, canonical and H1, no draft content, one homepage schema graph, and sitemap exclusions.
- Desktop and mobile Chrome checks cover internal meeting navigation, future-date conversion, fixed EST-to-IST conversion, offline rate labeling, invoice export, Pro availability and HTTP 404 behavior. Tests mock currency responses for repeatability and never send an email or initiate payment.
- A downloaded PDF is checked for the full amount due and absence of personal tax deductions.
- Python API syntax and preservation of unrelated endpoints are checked. Real email delivery and paid billing are not exercised.

## Running the checks

From `frontend`:

```text
npm ci --legacy-peer-deps
npm run test:ci
npm run build
node scripts/check-built-site.js
```

The build needs Chrome. Puppeteer installs a compatible browser during normal dependency installation; `PUPPETEER_EXECUTABLE_PATH` can select a preinstalled browser. Browser downloads are cached inside the project's `node_modules/.cache/puppeteer`. If CI disables install scripts, run `npx puppeteer browsers install chrome` before building. The build fails on rendering errors so it cannot publish fabricated fallback pages. Configuration follows the [Puppeteer documentation](https://pptr.dev/guides/configuration).

For browser checks, start `node static-server.js` with `PORT=4173`, then run `node scripts/verify-browser.js`. `VERIFY_BASE_URL` and `VERIFY_OUTPUT_DIR` can override the local server and artifact directory. Screenshots, the test PDF and a JSON result are saved outside the source tree by default.

## Follow-up work requiring production data or configuration

- Real billing needs authenticated entitlements and verified payment webhooks before Pro can reopen. Existing browser-local entitlement flags are not a production authorization system.
- Confirm email delivery with the production provider and a designated test recipient.
- Measure Core Web Vitals and funnel baselines on the deployed site; local browser checks do not establish field performance or conversion improvement.
- Validate production hosting redirects/404 behavior, Search Console indexing and deployment success after the GitHub push.
- Run content, acquisition and connected-workflow experiments against measured user behavior. No traffic, revenue or ranking uplift is claimed.
- Mobile checks use Chrome emulation, not physical iOS/Android hardware. The build snapshot is replaced on client startup; assess its effect on field layout and loading metrics.
