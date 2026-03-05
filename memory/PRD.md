# GlobalSync AI — Product Requirements Document

**Last Updated:** 2026-03-05  
**Version:** 1.0 MVP  
**Status:** Live

---

## Product Overview
GlobalSync AI is a free, AI-powered time zone and currency conversion assistant for remote teams, freelancers, and global workers. Users can ask questions in plain English and the app intelligently routes to the right tool.

**URL:** https://remote-sync-hub.preview.emergentagent.com

---

## Architecture

### Tech Stack
- **Frontend:** React 19 + Tailwind CSS + shadcn/ui + Recharts
- **Backend:** FastAPI (Python) on port 8001
- **Database:** MongoDB (via Motor async driver)
- **AI:** Claude Sonnet 4.5 via Emergent Universal Key (emergentintegrations)
- **Currency API:** Frankfurter API (free, no key, ECB data)
- **Fonts:** Outfit (headings) + Inter (body) from Google Fonts

### Folder Structure
```
/app/
├── backend/
│   ├── server.py          # All FastAPI routes
│   └── .env               # MONGO_URL, DB_NAME, EMERGENT_LLM_KEY
└── frontend/src/
    ├── App.js             # Router + Toaster
    ├── pages/
    │   ├── LandingPage.js
    │   └── Dashboard.js
    └── components/
        ├── AIInput.js
        ├── TimeConverter.js
        ├── CurrencyConverter.js
        └── HistoryPanel.js
```

### API Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/ | Health check |
| POST | /api/ai/parse | AI intent classification |
| POST | /api/timezone/convert | Get/convert city times |
| POST | /api/timezone/overlap | Find meeting overlap |
| GET | /api/currency/convert | Live currency conversion |
| GET | /api/currency/trend | 7-day trend data |
| POST | /api/history | Save query to history |
| GET | /api/history | Get last 30 history items |
| DELETE | /api/history | Clear all history |

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
- Frankfurter API (European Central Bank data, free, no auth)
- 20 currencies supported (USD, EUR, GBP, JPY, INR, CAD, AUD, CHF, CNY, SGD, HKD, KRW, MXN, BRL, ZAR, SEK, NOK, NZD, TRY, DKK)
- Live exchange rate display
- 7-day trend chart (Recharts AreaChart with gradient)
- Swap currencies button

### 5. Query History
- MongoDB persistent storage
- Intent badges (Time Zone / Currency / Meeting Overlap)
- Last 30 queries displayed
- Clear history button

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

---

## Design System (Swiss Utility)
- **Primary:** Cobalt Blue (#2563EB)
- **Secondary:** Sunset Orange (#F97316)
- **Accent:** Emerald Green (#10B981)
- **Background:** #FAFAFA
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

---

## Prioritized Backlog

### P0 (Critical for user value)
- None blocking

### P1 (High Value, Next Sprint)
- [ ] Specific time conversion UI (e.g. "Show me 3 PM NY time in all cities")
- [ ] More city names in fuzzy matching
- [ ] Copy result to clipboard button
- [ ] Share query as URL

### P2 (Nice to Have)
- [ ] Dark mode toggle
- [ ] Export history as CSV
- [ ] Multi-city timezone comparison table view
- [ ] User accounts for saved preferences
- [ ] SEO pages for /usd-to-eur, /timezone-converter etc.
- [ ] PWA support (offline first load)
