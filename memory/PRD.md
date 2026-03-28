# GlobalSync AI — Product Requirements Document

**Last Updated:** 2026-03-05  
**Version:** 1.1 MVP  
**Status:** Live

---

## Product Overview
GlobalSync AI is a free, AI-powered time zone and currency conversion assistant for remote teams, freelancers, and global workers. Users can ask questions in plain English and the app intelligently routes to the right tool.

**URL:** https://globalsync-ai.com

---

## Architecture

### Tech Stack
- **Frontend:** React 19 + Tailwind CSS + shadcn/ui + Recharts + react-helmet-async
- **Backend:** FastAPI (Python) on port 8001 + slowapi rate limiting
- **Database:** MongoDB (via Motor async driver)
- **AI:** Claude Sonnet 4.5 via Emergent Universal Key (emergentintegrations)
- **Currency API (live):** ExchangeRate-API (160+ currencies, free, no key)
- **Currency API (trend):** Frankfurter API (31 ECB currencies, 7-day history)
- **Fonts:** Outfit (headings) + Inter (body) from Google Fonts

### Folder Structure
```
/app/
├── backend/
│   ├── server.py          # All FastAPI routes + slowapi rate limiting
│   ├── requirements.txt   # includes slowapi
│   └── .env               # MONGO_URL, DB_NAME, EMERGENT_LLM_KEY
└── frontend/src/
    ├── App.js             # Router + Toaster (6 routes)
    ├── index.js           # HelmetProvider wrapper
    ├── pages/
    │   ├── LandingPage.js           # Home page with SEO footer links
    │   ├── Dashboard.js             # Main converter app
    │   ├── TimeZoneConverterPage.js # SEO landing /time-zone-converter
    │   ├── CurrencyConverterPage.js # SEO landing /currency-converter
    │   ├── MeetingPlannerPage.js    # SEO landing /meeting-planner
    │   └── AdminPage.js             # Lead dashboard /admin
    └── components/
        ├── AIInput.js
        ├── TimeConverter.js
        ├── CurrencyConverter.js
        ├── HistoryPanel.js
        ├── OnboardingModal.js
        └── SEOHead.js               # react-helmet-async wrapper
```

### API Routes
| Method | Route | Rate Limit | Description |
|--------|-------|------------|-------------|
| GET | /api/ | — | Health check |
| POST | /api/ai/parse | 20/min | AI intent classification |
| POST | /api/timezone/convert | — | Get/convert city times |
| POST | /api/timezone/overlap | — | Find meeting overlap |
| GET | /api/currency/convert | 60/min | Live currency conversion (ExchangeRate-API) |
| GET | /api/currency/trend | 30/min | 7-day trend data (Frankfurter) |
| GET | /api/currency/supported | — | List supported currencies |
| POST | /api/history | — | Save query to history |
| GET | /api/history | — | Get last 30 history items |
| DELETE | /api/history | — | Clear all history |
| POST | /api/users/register | — | Save lead (name + email) |
| GET | /api/users | — | List all leads (admin) |

---

## Core Features Implemented

### 1. AI Natural Language Input
- Claude claude-sonnet-4-5-20250929 via EMERGENT_LLM_KEY
- Detects intent: `time_conversion`, `meeting_overlap`, `currency_conversion`
- Extracts entities (cities, time, currencies, amounts)
- Falls back to regex parser if AI fails
- Auto-routes to correct dashboard tab
- Saves to MongoDB history

### 2. Time Zone Converter
- Live clocks using browser Intl.DateTimeFormat API (updates every second)
- 25+ supported cities globally
- Add up to 5 cities via search dropdown
- In Office / Off Hours status badge
- Business hours visualization (9am–5pm default)

### 3. Meeting Overlap
- POST /api/timezone/overlap with city list
- Finds UTC intersection of business hours
- Visual timeline bar showing each city's business hours + overlap in green
- Returns best meeting time in each city's local time
- Handles cross-midnight UTC business hours

### 4. Currency Converter
- ExchangeRate-API (160+ worldwide currencies, free, no auth)
- Frankfurter API for 7-day ECB trend charts (31 major currencies)
- Live exchange rate display
- Swap currencies button
- Recharts AreaChart with gradient for trends

### 5. Query History
- MongoDB persistent storage
- Intent badges (Time Zone / Currency / Meeting Overlap)
- Last 30 queries displayed
- Clear history button

### 6. Lead Collection
- Skippable onboarding modal collects name + email
- Stored in MongoDB `users` collection
- Admin dashboard at /admin to view/export as CSV

### 7. SEO Implementation
- `robots.txt` at /robots.txt — allows all crawlers, disallows /api/
- `sitemap.xml` at /sitemap.xml — 5 URLs with priorities
- `SEOHead` component with react-helmet-async: title, description, keywords, canonical, og:*, twitter:*, JSON-LD
- `HelmetProvider` wrapper in index.js
- 3 SEO landing pages with FAQs, breadcrumbs, structured data, internal links:
  - `/time-zone-converter` — TimeZoneConverterPage.js
  - `/currency-converter` — CurrencyConverterPage.js
  - `/meeting-planner` — MeetingPlannerPage.js
- LandingPage footer has 3 internal links to SEO pages

### 8. API Rate Limiting
- slowapi library added to FastAPI
- IP-based rate limiting: 20/min (AI parse), 60/min (currency convert), 30/min (trend)

---

## Database Schema

### Collection: `history`
```json
{
  "_id": "uuid-string",
  "id": "uuid-string",
  "query": "Convert 100 USD to EUR",
  "intent": "currency_conversion",
  "result": { "entities": {...} },
  "timestamp": "2026-03-05T00:00:00Z"
}
```

### Collection: `users` (leads)
```json
{
  "_id": "uuid-string",
  "id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "timestamp": "2026-03-05T00:00:00Z"
}
```

---

## Design System (Swiss Utility Dark)
- **Primary:** Cobalt Blue (#2563EB)
- **Secondary:** Sunset Orange (#F97316)
- **Accent:** Emerald Green (#10B981)
- **Background:** #050816 (hero) / #FAFAFA (landing pages)
- **Cards:** Glass morphism (rgba white + backdrop blur)
- **Headings:** Outfit font
- **Body:** Inter font

---

## What's Been Implemented
- [2026-03-05] Full MVP: Landing page, Dashboard, AI Input, Time Converter, Currency Converter, History Panel
- [2026-03-05] AI intent classification with Claude Sonnet 4.5
- [2026-03-05] Live currency rates (Frankfurter API)
- [2026-03-05] Live world clocks (Intl.DateTimeFormat)
- [2026-03-05] Meeting overlap visualization
- [2026-03-05] 7-day trend chart (Recharts)
- [2026-03-05] MongoDB history with save/clear
- [2026-03-05] V2 Redesign: Dark gradient hero with live world clock grid, animated orbs, stats ticker
- [2026-03-05] Email/name onboarding modal (soft gate, skippable, saves to MongoDB)
- [2026-03-05] Gradient feature cards (blue/green/purple), gradient tab active states
- [2026-03-05] User name displayed in dashboard header after onboarding
- [2026-03-05] Currency API expanded to ExchangeRate-API (160+ currencies worldwide)
- [2026-03-05] Deployment bug fix: graceful 422 error for unsupported currencies
- [2026-03-05] SEO implementation: robots.txt, sitemap.xml, SEOHead component, HelmetProvider, 3 SEO landing pages
- [2026-03-05] Admin dashboard at /admin: view leads, export CSV
- [2026-03-05] Share Result feature: Copy + Share buttons on currency result, Copy + Share on meeting overlap result, Share on time conversion result
- [2026-03-28] Consistent design: shared SiteNav (sticky, logo + 5 nav links + Open App + mobile drawer) and SiteFooter (4-column: Brand/Tools/Resources/Legal) applied to all 10 inner pages
- [2026-03-28] AdSense fix: consistent branding/nav across all pages removes "Low value content" UX signals
- [2026-03-25] "Today's Feed" homepage widget (2x2 grid) with link to /news
- [2026-03-25] Daily Feed link added to all nav bars; /news added to sitemap.xml
- [2026-03-18] Blog link added to: LandingPage nav + footer, all 3 SEO pages' nav headers
- [2026-03-18] sitemap.xml updated with /blog and all 5 post URLs (7 new entries)
- [2026-03-17] Google AdSense publisher script (ca-pub-3241670070120503) added to index.html <head>
- [2026-03-17] AdBanner component created; 2 ad slots placed on all 3 SEO landing pages (after H1, before footer links)
- [2026-03-28] **pSEO Phase 2 COMPLETE**: 10 city-pair pages (/time/:pair) + 10 currency-pair pages (/currency/:pair) routed and live; data file fully populated (20 pages total); index sections added to /time-zone-converter and /currency-converter
- [2026-03-28] **pSEO Phase 1 COMPLETE**: Homepage SEOHead updated with transactional keywords; FAQPage structured data added to HOMEPAGE_SCHEMA
- [2026-03-28] **pSEO Phase 3 COMPLETE**: 3 new pillar blog posts added (remote work time zones, freelancer invoice currency, work-from-anywhere guide) — blog now has 8 total posts
- [2026-03-28] **pSEO Phase 4 COMPLETE**: 6-item FAQ accordion section added to homepage before footer (expand/collapse, targets question-based searches)
- [2026-03-28] **Compare widget COMPLETE**: "Convert a Specific Time" interactive widget added to all 10 city-pair pSEO pages. Users pick hour/minute/AM-PM, city label shows which direction, result updates instantly. Swap button reverses direction. Day-shift indicator shows "Next day"/"Previous day" when applicable. Half-hour timezone offsets (e.g. Dubai UTC+4 → Mumbai UTC+5:30) handled correctly.

---

## Prioritized Backlog

- [2026-03-05] Share Result feature: Copy + Share buttons on currency result, Copy + Share on meeting overlap result, Share on time conversion result

- [2026-03-16] SEO audit implementation: About, Contact, Privacy Policy, Terms of Service pages; footer legal links; optimised title/meta tags; WebApplication schema; sitemap expanded to 9 URLs

### P0 (Completed)
- [x] Full pSEO implementation: 20 dynamic pages (10 city pairs + 10 currency pairs) [2026-03-28]
- [x] Homepage meta/schema transactional keyword upgrade [2026-03-28]
- [x] 3 pillar blog posts added (8 total) [2026-03-28]
- [x] Homepage FAQ accordion section [2026-03-28]

### P1 (High Value, Next Sprint)
- [ ] Copy result to clipboard button on converter outputs
- [ ] Share query as URL (e.g. /dashboard?q=Convert+100+USD+to+EUR)

### P2 (Nice to Have)
- [ ] Expand pSEO to 50+ pages (add more city/currency pairs to programmaticData.js)
- [ ] Dark mode toggle on SEO landing pages
- [ ] Export history as CSV
- [ ] Google AdSense slot ID activation (pending site approval — update AdBanner.js)
- [ ] Custom logo (user expressed interest, pending logo file)
- [ ] PWA support (offline first load)
- [ ] More city names in fuzzy matching
- [ ] Admin page authentication (currently public — not critical for low-traffic MVP)

### P3 (Future)
- [ ] Directory submissions (Product Hunt, AlternativeTo, Toolify.ai)
- [ ] Google Search Console submission with new sitemap (38 URLs)
