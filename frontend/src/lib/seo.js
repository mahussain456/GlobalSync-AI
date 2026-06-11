/**
 * seo.js — Centralized SEO Metadata Factory
 * GlobalSync AI | https://www.globalsync-ai.com
 *
 * Usage:
 *   import { getCityPairSEO } from "@/lib/seo";
 *   const seo = getCityPairSEO({ cityA, cityB, pair, pairData });
 *   return <SEOHead {...seo} />;
 *
 * All functions return a props object compatible with <SEOHead>.
 * Use `rawTitle` (not `title`) so SEOHead does NOT auto-append the brand suffix.
 */

const BASE_URL  = "https://www.globalsync-ai.com";
const BRAND     = "GlobalSync AI";
const LOGO_URL  = `${BASE_URL}/logo-dark.png`;

// ─────────────────────────────────────────────────────────────────────────────
// Schema Builders
// Each returns a plain schema object (no @context — that's added by SEOHead
// when it wraps an array in @graph, or you pass it standalone with @context).
// ─────────────────────────────────────────────────────────────────────────────

export const buildPersonSchema = () => ({
  "@type": "Person",
  "name": "Ahmed Hussain",
  "url": `${BASE_URL}/authors/ahmed-hussain`,
  "sameAs": [
    `${BASE_URL}/about`,
    "https://twitter.com/GlobalSyncAI"
  ],
  "jobTitle": "Founder",
  "worksFor": {
    "@type": "Organization",
    "name": BRAND,
    "url": BASE_URL
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  },
  "description": "Ahmed Hussain is the founder of GlobalSync AI, building free time zone, meeting planner, and currency tools for remote teams, freelancers, and global businesses."
});

export const buildOrganizationSchema = () => ({
  "@type": "Organization",
  "name": BRAND,
  "url": BASE_URL,
  "logo": { "@type": "ImageObject", "url": LOGO_URL },
  "sameAs": [
    "https://twitter.com/GlobalSyncAI",
    "https://www.linkedin.com/company/globalsync-ai"
  ]
});

export const buildWebSiteSchema = () => ({
  "@type": "WebSite",
  "name": BRAND,
  "url": BASE_URL,
  "description": `Free AI-powered time zone converter, meeting planner, and live currency converter for remote teams.`,
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${BASE_URL}/dashboard?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const buildWebApplicationSchema = ({ name, path, description, category = "BusinessApplication" }) => ({
  "@type": "WebApplication",
  "name": name,
  "url": `${BASE_URL}${path}`,
  "applicationCategory": category,
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
});

export const buildSoftwareApplicationSchema = ({ name, path, description, category = "UtilitiesApplication" }) => ({
  "@type": "SoftwareApplication",
  "name": name,
  "url": `${BASE_URL}${path}`,
  "applicationCategory": category,
  "operatingSystem": "Web",
  "description": description,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "publisher": { "@id": `${BASE_URL}/#org` }
});

export const buildWebPageSchema = ({ name, path, description, crumbs }) => ({
  "@type": "WebPage",
  "name": name,
  "url": `${BASE_URL}${path}`,
  "description": description,
  "breadcrumb": buildBreadcrumbSchema(crumbs)
});

export const buildFAQSchema = (faqs) => ({
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a },
  })),
});

export const buildBreadcrumbSchema = (crumbs) => ({
  "@type": "BreadcrumbList",
  "itemListElement": crumbs.map(({ name, path }, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": name,
    "item": `${BASE_URL}${path}`,
  })),
});

export const buildExchangeRateSchema = (fromCode, toCode) => ({
  "@type": "ExchangeRateSpecification",
  "currency": toCode,
  "currentExchangeRate": {
    "@type": "UnitPriceSpecification",
    "priceCurrency": fromCode
  }
});

export const buildArticleSchema = (post) => ({
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.metaDescription,
  "keywords": post.keywords,
  "datePublished": post.datePublished || "2026-03-01",
  "dateModified": post.dateModified || post.datePublished || "2026-03-01",
  "author": { 
    "@type": "Person", 
    "name": post.authorName || "Ahmed Hussain", 
    "url": `${BASE_URL}/authors/ahmed-hussain` 
  },
  "publisher": {
    "@type": "Organization",
    "name": BRAND,
    "url": BASE_URL,
    "logo": { "@type": "ImageObject", "url": LOGO_URL },
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
  "url": `${BASE_URL}/blog/${post.slug}`,
  "image": `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
});

// ─────────────────────────────────────────────────────────────────────────────
// Metadata Factories
// Each returns a props object to spread directly into <SEOHead {...seo} />
// rawTitle = complete title (bypasses SEOHead auto-suffix)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Homepage — /
 */
export const getHomepageSEO = ({ faqs = [] } = {}) => {
  const title = "GlobalSync AI — Free Time Zone Converter, World Clock & Currency Tools";
  const desc  = "Free time zone converter, world clock, and live currency converter for remote teams. Plan meetings, find overlap hours, and convert 160+ currencies.";
  return {
    rawTitle: title,
    description: desc,
    canonical: "/",
    keywords: "time zone converter, world clock, currency converter, meeting planner, business hours overlap, remote team scheduling, free currency converter 160 currencies, city to city time conversion",
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent("Time Zone Converter, World Clock & Currency Tools")}&subtitle=${encodeURIComponent("Free tools for remote teams — No signup")}&type=default`,
    structuredData: [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#org`,
        "name": BRAND,
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": LOGO_URL,
          "width": 512,
          "height": 512
        },
        "description": "Free AI-powered time zone, meeting planner, and currency tools for remote teams and freelancers.",
        "sameAs": [
          "https://www.linkedin.com/company/globalsync-ai",
          "https://x.com/GlobalSyncAI"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#site`,
        "url": BASE_URL,
        "name": BRAND,
        "publisher": { "@id": `${BASE_URL}/#org` },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${BASE_URL}/dashboard?q={search_term_string}` },
          "query-input": "required name=search_term_string"
        }
      },
      buildWebApplicationSchema({
        name: BRAND,
        path: "/",
        description: "Free AI-powered world clock, time zone converter, meeting planner, and live currency converter for remote teams.",
      }),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};

/**
 * Time Zone Converter hub — /time-zone-converter
 */
export const getTimeZoneHubSEO = ({ faqs = [] } = {}) => {
  const title = `Free Time Zone Converter | World Clock | ${BRAND}`;
  return {
    rawTitle: title,
    description: `Compare live time across 25+ cities instantly. Convert any time zone, find business hour overlaps, and plan meetings across continents. Free.`,
    canonical: "/time-zone-converter",
    keywords: "time zone converter, world clock, city time comparison, international time zones, business hour overlap, EST to IST, GMT to PST, free world clock online",
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent("Free Time Zone Converter")}&subtitle=${encodeURIComponent("Compare live time across 25+ cities")}&type=tool`,
    structuredData: [
      buildSoftwareApplicationSchema({
        name: "Free Time Zone Converter",
        path: "/time-zone-converter",
        description: "Compare live time across 25+ cities instantly. Convert any time zone, find business hour overlaps, and plan meetings across continents.",
        category: "UtilitiesApplication",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Time Zone Converter", path: "/time-zone-converter" },
      ]),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};

/**
 * Currency Converter hub — /currency-converter
 */
export const getCurrencyHubSEO = ({ faqs = [] } = {}) => {
  const title = `Free Live Currency Converter | 160+ Rates | ${BRAND}`;
  return {
    rawTitle: title,
    description: `Convert 160+ currencies with live mid-market exchange rates. USD to INR, EUR to GBP, PKR, NGN and more.`,
    canonical: "/currency-converter",
    keywords: "live currency converter, real-time exchange rates, USD to INR, EUR to GBP, free currency converter, 160 currencies, mid-market rate",
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent("Free Live Currency Converter")}&subtitle=${encodeURIComponent("160+ Currencies, Mid-Market Rates")}&type=tool`,
    structuredData: [
      buildSoftwareApplicationSchema({
        name: "Free Live Currency Converter",
        path: "/currency-converter",
        description: "Convert 160+ currencies with live mid-market exchange rates. USD to INR, EUR to GBP, PKR, NGN and more.",
        category: "FinanceApplication",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Currency Converter", path: "/currency-converter" },
      ]),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};

/**
 * Meeting Planner hub — /meeting-planner
 */
export const getMeetingPlannerSEO = ({ faqs = [] } = {}) => {
  const title = `Meeting Time Planner for Distributed Teams | Find Overlap Hours`;
  return {
    rawTitle: title,
    description: `Find the perfect meeting time across distributed teams. Visual overlap planner shows fair business hours for every member. Free, no signup.`,
    canonical: "/meeting-planner",
    keywords: "meeting planner, best meeting time multiple time zones, business hour overlap calculator, global team scheduling, meeting overlap finder, remote team meeting tool",
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent("Meeting Time Planner")}&subtitle=${encodeURIComponent("Find Overlap Hours")}&type=tool`,
    structuredData: [
      buildSoftwareApplicationSchema({
        name: "Meeting Planner for Distributed Teams",
        path: "/meeting-planner",
        description: "Find the perfect meeting time across distributed teams. Visual overlap planner shows fair business hours for every member.",
        category: "BusinessApplication",
      }),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Meeting Planner", path: "/meeting-planner" },
      ]),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};

/**
 * City-pair time zone page — /time/:pair
 * @param {object} cityA    — CITIES[from] object { name, abbr, tz, … }
 * @param {object} cityB    — CITIES[to]   object
 * @param {string} pair     — route slug e.g. "new-york-to-london"
 * @param {object} pairData — entry from CITY_PAIRS[pair] (has .faqs etc.)
 */
export const getCityPairSEO = ({ cityA, cityB, pair, pairData }) => {
  const title = `${cityA.name} to ${cityB.name} Time Converter`;
  const desc = `Convert ${cityA.name} time to ${cityB.name} time instantly. Live current time, hour-by-hour comparison, and meeting-overlap finder.`;
  return {
    rawTitle: `${cityA.name} to ${cityB.name} Time | ${BRAND}`,
    description: desc,
    canonical: `/time/${pair}`,
    keywords: `${cityA.name} to ${cityB.name} time, ${cityA.abbr} to ${cityB.abbr}, time difference ${cityA.name} ${cityB.name}, ${cityA.name} time now, ${cityB.name} time now, meeting overlap ${cityA.name} ${cityB.name}`,
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent("Time Zone & Meeting Overlap")}&type=tool`,
    noIndex: !pairData,
    structuredData: [
      buildWebPageSchema({
        name: title,
        path: `/time/${pair}`,
        description: desc,
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Time Zone Converter", path: "/time-zone-converter" },
          { name: `${cityA.name} to ${cityB.name}`, path: `/time/${pair}` },
        ]
      }),
      ...(pairData?.faqs?.length ? [buildFAQSchema(pairData.faqs)] : []),
    ],
  };
};

/**
 * Currency pair page — /currency/:pair
 * @param {object} fromMeta — CURRENCIES_META[from] { code, name, symbol }
 * @param {object} toMeta   — CURRENCIES_META[to]
 * @param {string} pair     — route slug e.g. "usd-to-inr"
 * @param {object} pairData — entry from CURRENCY_PAIRS[pair] (has .faqs etc.)
 */
export const getCurrencyPairSEO = ({ fromMeta, toMeta, pair, pairData }) => {
  const title = `${fromMeta.code} to ${toMeta.code} Live Exchange Rate`;
  const desc = `Convert ${fromMeta.code} to ${toMeta.code} live. Check real-time exchange rates, view the 7-day trend, and calculate costs for freelancers instantly.`;
  return {
    rawTitle: `${title} | ${BRAND}`,
    description: desc,
    canonical: `/currency/${pair}`,
    keywords: `${fromMeta.code} to ${toMeta.code}, ${fromMeta.name} to ${toMeta.name}, live exchange rate, ${fromMeta.code} ${toMeta.code} converter, ${fromMeta.code} rate today, real-time currency converter`,
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent("Live Currency Exchange Rate")}&type=tool`,
    noIndex: !pairData,
    structuredData: [
      buildWebPageSchema({
        name: title,
        path: `/currency/${pair}`,
        description: desc,
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Currency Converter", path: "/currency-converter" },
          { name: `${fromMeta.code} to ${toMeta.code}`, path: `/currency/${pair}` },
        ]
      }),
      buildExchangeRateSchema(fromMeta.code, toMeta.code),
      ...(pairData?.faqs?.length ? [buildFAQSchema(pairData.faqs)] : []),
    ],
  };
};

/**
 * Blog index page — /blog
 */
export const getBlogIndexSEO = () => {
  const title = `Remote Work, Time Zones & Currency Blog | ${BRAND}`;
  return {
    rawTitle: title,
    description: `Practical guides for remote teams, freelancers, and digital nomads. Learn to schedule meetings across time zones and manage multi-currency income.`,
    canonical: "/blog",
    keywords: "remote work blog, time zone tips, currency converter guide, digital nomad tools, remote team scheduling, freelancer currency, best meeting time",
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent("Remote Work Blog")}&subtitle=${encodeURIComponent("Guides for Global Teams")}&type=blog`,
    structuredData: [
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
    ],
  };
};

/**
 * Blog post page — /blog/:slug
 * @param {object} post — full BLOG_POSTS entry
 */
export const getBlogPostSEO = ({ post }) => {
  const title = post.metaTitle ? post.metaTitle : `${post.title} | ${BRAND}`;
  return {
    rawTitle: title,
    description: post.metaDescription,
    canonical: `/blog/${post.slug}`,
    keywords: post.keywords,
    ogType: "article",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent("GlobalSync AI Blog")}&type=blog`,
    structuredData: [
      buildArticleSchema(post),
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Static Pages  (About, Contact, Legal, Trust)
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_META = {
  about: {
    rawTitle: `About ${BRAND} | Time Zone & Currency Tools`,
    description: `Learn about GlobalSync AI, a free platform combining a world clock, time zone converter, meeting planner, and currency tools for global remote teams.`,
    canonical: "/about",
    keywords: "about GlobalSync AI, free time zone tool, remote team tools, who we are",
    author: "Ahmed Hussain",
  },
  contact: {
    rawTitle: `Contact ${BRAND} | Get in Touch`,
    description: `Have questions, suggestions, or bug reports? Contact the GlobalSync AI team. We respond directly to every message, usually within 2 business days.`,
    canonical: "/contact",
    keywords: "contact GlobalSync AI, feedback, support",
  },
  "privacy-policy": {
    rawTitle: `Privacy Policy | ${BRAND}`,
    description: `Read the GlobalSync AI privacy policy. Learn how we handle data when you use our free time zone converter, currency converter, and meeting planner tools.`,
    canonical: "/privacy-policy",
    keywords: "GlobalSync AI privacy policy, data protection",
  },
  "terms-of-service": {
    rawTitle: `Terms of Service | ${BRAND}`,
    description: `Read the GlobalSync AI terms of service. By using our free time zone converter, currency, and meeting tools, you agree to our terms and conditions.`,
    canonical: "/terms-of-service",
    keywords: "GlobalSync AI terms of service",
  },
  "editorial-policy": {
    rawTitle: `Editorial Policy | ${BRAND}`,
    description: `Learn how GlobalSync AI creates, reviews, and corrects content. Our editorial standards are transparent, independent, and publicly documented.`,
    canonical: "/editorial-policy",
    keywords: "GlobalSync AI editorial policy, content standards",
  },
  methodology: {
    rawTitle: `Methodology | Data Sources & AI | ${BRAND}`,
    description: `How GlobalSync AI sources time zone rules, live exchange rates, and AI data. Update frequencies, data providers, and accuracy details explained.`,
    canonical: "/methodology",
    keywords: "GlobalSync AI methodology, IANA time zone database, ECB exchange rates, AI transparency",
  },
  "data-sources": {
    rawTitle: "Data Sources | GlobalSync AI Time Zone & Currency Data",
    description: "See the time zone, exchange rate, and scheduling data sources used by GlobalSync AI, including update frequency, accuracy notes, and methodology.",
    canonical: "/data-sources",
    keywords: "GlobalSync AI data sources, exchange rate sources, IANA time zone database, ECB exchange rates",
  },
  "freelancer-rate-converter": {
    rawTitle: `Freelancer Rate Calculator — Hourly to Annual Salary Equivalent`,
    description: `Convert freelance hourly rates to annual W-2 salary equivalents. Factors in self-employment tax, holidays, and unbillable time. Free calculator.`,
    canonical: "/freelancer-rate-converter",
    keywords: "freelancer rate converter, hourly rate converter, project fee converter, international freelancer pricing",
  },
  "author-ahmed-hussain": {
    rawTitle: "Ahmed Hussain, Founder of GlobalSync AI | Author Profile",
    description: "Ahmed Hussain is the founder of GlobalSync AI, building free time zone, meeting planner, and currency tools for remote teams and freelancers.",
    canonical: "/authors/ahmed-hussain",
    keywords: "Ahmed Hussain, GlobalSync AI founder, remote work tools developer, Karachi Pakistan",
  },
  press: {
    rawTitle: `Press & Media | ${BRAND}`,
    description: `Get the latest press releases, media kits, brand assets, and contact information for GlobalSync AI time zone and currency tools.`,
    canonical: "/press",
    keywords: "GlobalSync AI press, media kit, press release, brand assets",
  },
  "global-meeting-planner-for-remote-teams": {
    rawTitle: `Remote Teams Meeting Planner | ${BRAND}`,
    description: `Plan and schedule meetings for international remote teams. Find optimal overlaps across EST, PST, GMT, IST, and multiple time zones.`,
    canonical: "/global-meeting-planner-for-remote-teams",
    keywords: "remote teams meeting planner, group meeting time finder, multi zone meeting scheduler",
  },
  "us-india-meeting-time": {
    rawTitle: `US & India Meeting Times | ${BRAND}`,
    description: `Find the best meeting times between the United States and India. Convert EST and PST to IST, and check business hour overlaps.`,
    canonical: "/us-india-meeting-time",
    keywords: "EST to IST meeting time, PST to IST, US India time converter, US India meeting planner",
  },
};

/**
 * Static page SEO — pass the route key e.g. getStaticPageSEO("about", { faqs: [...] })
 */
export const getStaticPageSEO = (pageKey, { faqs = [] } = {}) => {
  const meta = STATIC_META[pageKey];
  if (!meta) {
    console.warn(`[seo.js] No static meta found for key: "${pageKey}"`);
    return {};
  }
  return {
    ...meta,
    ogType: "website",
    ogImage: `${BASE_URL}/api/og?title=${encodeURIComponent(meta.rawTitle.split(" | ")[0])}&subtitle=${encodeURIComponent("GlobalSync AI")}&type=tool`,
    structuredData: [
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: meta.rawTitle.split(" | ")[0], path: meta.canonical },
      ]),
      ...(pageKey === "about" ? [buildOrganizationSchema(), buildPersonSchema()] : []),
      ...(pageKey === "author-ahmed-hussain" ? [buildPersonSchema(), buildOrganizationSchema()] : []),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};
