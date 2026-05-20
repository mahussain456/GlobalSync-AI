# Audit Discovery: GlobalSync AI

## Framework & Rendering Mode
- **Framework**: React 19 (via Create React App + `craco`).
- **Routing**: React Router v7.
- **Rendering Mode**: Client-Side Rendered (SPA). The app attempts to generate static pre-renders at build time using `react-snap` (run as a `postbuild` script), but the audit shows this is currently yielding a JS-only shell with a "Please enable JavaScript..." message to crawlers.

## Routes Identified
- `/` (Homepage)
- `/dashboard`
- `/time-zone-converter`
- `/currency-converter`
- `/meeting-planner`
- `/blog`
- `/blog/:slug`
- `/time/:pair` (City pairs)
- `/currency/:pair` (Currency pairs)
- `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/editorial-policy`, `/methodology`, `/data-sources`
- `/freelancer-rate-converter`
- `/global-meeting-planner-for-remote-teams`
- `/us-india-meeting-time`
- `/admin`

## Data Sources
- **Time/Dates**: Relies on browser built-in `Intl.DateTimeFormat` APIs and `date-fns` (no heavy tzdb libraries like moment-timezone).
- **Currencies**: Fetched live from `https://open.exchangerate-api.com/v6/latest/[currency]`, with hardcoded offline fallback rates.
- **Blog Content**: Stored locally in JavaScript data files (e.g., `src/data/blogData.js`). No external CMS.

## Server-Rendered vs Client-Rendered
- **Currently**: All components are client-rendered. `react-snap` runs headlessly to generate static HTML, but interactive elements hydrate purely on the client. Next.js "Server Components" are not used here as this is a CRA SPA.

## Deployment Target
- **Vercel**: Indicated by the `.vercel` directory at the project root.

## SEO/Crawler Assets
- `public/robots.txt`: Exists. Currently allows `*` and disallows `/api/`, `/admin`, `/dashboard`.
- `public/sitemap.xml`: Exists. Contains a static list of URLs and hardcoded pairs.
- `public/llms.txt`: Does not exist.
