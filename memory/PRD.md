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

---

## Prioritized Backlog

- [2026-03-05] Share Result feature: Copy + Share buttons on currency result, Copy + Share on meeting overlap result, Share on time conversion result

- [2026-03-16] SEO audit implementation: About, Contact, Privacy Policy, Terms of Service pages; footer legal links; optimised title/meta tags; WebApplication schema; sitemap expanded to 9 URLs

### P1 (High Value, Next Sprint)
- [ ] Currency search box in dropdown (160+ currencies is hard to browse)
- [ ] Copy result to clipboard button on converter outputs
- [ ] Share query as URL (e.g. /dashboard?q=Convert+100+USD+to+EUR)

### P2 (Nice to Have)
- [ ] Dark mode toggle on SEO landing pages
- [ ] Export history as CSV
- [ ] Google AdSense integration (user needs to sign up and provide Publisher ID)
- [ ] Custom logo (user expressed interest, pending logo file)
- [ ] PWA support (offline first load)
- [ ] More city names in fuzzy matching
- [ ] Admin page authentication (currently public — not critical for low-traffic MVP)
