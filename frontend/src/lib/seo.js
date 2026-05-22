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
const OG_IMAGE  = `${BASE_URL}/globalsync-ai-logo-1600x400.png`;
const LOGO_URL  = `${BASE_URL}/favicon-512.png`;

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
  "jobTitle": "Founder & Developer",
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
  "description": "Ahmed Hussain is the founder and developer of GlobalSync AI, building free tools for remote teams and freelancers working across time zones and currencies."
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

export const buildWebApplicationSchema = ({ name, path, description, category = "UtilityApplication" }) => ({
  "@type": "WebApplication",
  "name": name,
  "url": `${BASE_URL}${path}`,
  "description": description,
  "applicationCategory": category,
  "operatingSystem": "All",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
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
  "image": OG_IMAGE,
});

// ─────────────────────────────────────────────────────────────────────────────
// Metadata Factories
// Each returns a props object to spread directly into <SEOHead {...seo} />
// rawTitle = complete title (bypasses SEOHead auto-suffix)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Homepage — /
 */
export const getHomepageSEO = ({ faqs = [] } = {}) => ({
  rawTitle: `${BRAND} | Time Zone & Currency Converter`,
  description: `Free AI-powered time zone converter, meeting planner, and live exchange rates for 160+ currencies. Built for remote teams and freelancers. No signup required.`,
  canonical: "/",
  keywords: "AI time zone converter, free world clock, meeting planner remote teams, currency converter 160 currencies, live exchange rates, best meeting time multiple time zones",
  ogType: "website",
  structuredData: [
    buildWebSiteSchema(),
    buildWebApplicationSchema({
      name: BRAND,
      path: "/",
      description: "Free AI-powered world clock, time zone converter, meeting planner, and live currency converter for remote teams.",
    }),
    buildOrganizationSchema(),
    ...(faqs.length ? [buildFAQSchema(faqs)] : []),
  ],
});

/**
 * Time Zone Converter hub — /time-zone-converter
 */
export const getTimeZoneHubSEO = () => ({
  rawTitle: `Free Time Zone Converter | World Clock | ${BRAND}`,
  description: `Compare live time across 25+ cities instantly. Convert any time zone, find business-hour overlaps, and plan meetings across continents. Free, no account needed.`,
  canonical: "/time-zone-converter",
  keywords: "time zone converter, world clock, city time comparison, international time zones, business hour overlap, EST to IST, GMT to PST, free world clock online",
  ogType: "website",
  structuredData: [
    buildWebApplicationSchema({
      name: `Time Zone Converter — ${BRAND}`,
      path: "/time-zone-converter",
      description: "Live world clock and time zone converter for 25+ cities worldwide.",
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Time Zone Converter", path: "/time-zone-converter" },
    ]),
  ],
});

/**
 * Currency Converter hub — /currency-converter
 */
export const getCurrencyHubSEO = () => ({
  rawTitle: `Free Live Currency Converter | 160+ Rates | ${BRAND}`,
  description: `Convert 160+ currencies with live mid-market exchange rates. USD to INR, EUR to GBP, AED, PKR, NGN and hundreds more. Real-time, accurate, and completely free.`,
  canonical: "/currency-converter",
  keywords: "live currency converter, real-time exchange rates, USD to INR, EUR to GBP, free currency converter, 160 currencies, mid-market rate",
  ogType: "website",
  structuredData: [
    buildWebApplicationSchema({
      name: `Currency Converter — ${BRAND}`,
      path: "/currency-converter",
      description: "Live currency converter for 160+ currencies with real-time mid-market exchange rates.",
      category: "FinanceApplication",
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Currency Converter", path: "/currency-converter" },
    ]),
  ],
});

/**
 * Meeting Planner hub — /meeting-planner
 */
export const getMeetingPlannerSEO = () => ({
  rawTitle: `Free Meeting Planner | Global Time Zones | ${BRAND}`,
  description: `Find the best meeting time across multiple cities. Instantly see business-hour overlaps and schedule global team calls without forcing anyone into off-hours. Free.`,
  canonical: "/meeting-planner",
  keywords: "meeting planner, best meeting time multiple time zones, business hour overlap calculator, global team scheduling, meeting overlap finder, remote team meeting tool",
  ogType: "website",
  structuredData: [
    buildWebApplicationSchema({
      name: `Meeting Planner — ${BRAND}`,
      path: "/meeting-planner",
      description: "Find the best meeting time for global teams. Instantly see business-hour overlaps for any city combination.",
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Meeting Planner", path: "/meeting-planner" },
    ]),
  ],
});

/**
 * City-pair time zone page — /time/:pair
 * @param {object} cityA    — CITIES[from] object { name, abbr, tz, … }
 * @param {object} cityB    — CITIES[to]   object
 * @param {string} pair     — route slug e.g. "new-york-to-london"
 * @param {object} pairData — entry from CITY_PAIRS[pair] (has .faqs etc.)
 */
export const getCityPairSEO = ({ cityA, cityB, pair, pairData }) => ({
  rawTitle: `${cityA.name} to ${cityB.name} Time Difference | ${BRAND}`,
  description: `See the current time in ${cityA.name} and ${cityB.name}, find the best overlap window for meetings, and check the time difference.`,
  canonical: `/time/${pair}`,
  keywords: `${cityA.name} to ${cityB.name} time, ${cityA.abbr} to ${cityB.abbr}, time difference ${cityA.name} ${cityB.name}, ${cityA.name} time now, ${cityB.name} time now, meeting overlap ${cityA.name} ${cityB.name}`,
  ogType: "website",
  noIndex: !pairData,
  structuredData: [
    buildWebApplicationSchema({
      name: `${cityA.name} to ${cityB.name} Time Converter`,
      path: `/time/${pair}`,
      description: `Live ${cityA.name} to ${cityB.name} time converter. See current local time in both cities and find the best meeting window.`,
    }),
    ...(pairData?.faqs?.length ? [buildFAQSchema(pairData.faqs)] : []),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Time Zone Converter", path: "/time-zone-converter" },
      { name: `${cityA.name} to ${cityB.name}`, path: `/time/${pair}` },
    ]),
  ],
});

/**
 * Currency pair page — /currency/:pair
 * @param {object} fromMeta — CURRENCIES_META[from] { code, name, symbol }
 * @param {object} toMeta   — CURRENCIES_META[to]
 * @param {string} pair     — route slug e.g. "usd-to-inr"
 * @param {object} pairData — entry from CURRENCY_PAIRS[pair] (has .faqs etc.)
 */
export const getCurrencyPairSEO = ({ fromMeta, toMeta, pair, pairData }) => ({
  rawTitle: `${fromMeta.code} to ${toMeta.code} Live Exchange Rate | ${BRAND}`,
  description: `Convert ${fromMeta.code} to ${toMeta.code} live. Check real-time exchange rates, view the 7-day trend, and calculate costs for freelancers instantly.`,
  canonical: `/currency/${pair}`,
  keywords: `${fromMeta.code} to ${toMeta.code}, ${fromMeta.name} to ${toMeta.name}, live exchange rate, ${fromMeta.code} ${toMeta.code} converter, ${fromMeta.code} rate today, real-time currency converter`,
  ogType: "website",
  noIndex: !pairData,
  structuredData: [
    buildWebApplicationSchema({
      name: `${fromMeta.code} to ${toMeta.code} Live Exchange Rate`,
      path: `/currency/${pair}`,
      description: `Live ${fromMeta.code} to ${toMeta.code} exchange rate converter with real-time mid-market rates and 7-day trend chart.`,
      category: "FinanceApplication",
    }),
    buildExchangeRateSchema(fromMeta.code, toMeta.code),
    ...(pairData?.faqs?.length ? [buildFAQSchema(pairData.faqs)] : []),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Currency Converter", path: "/currency-converter" },
      { name: `${fromMeta.code} to ${toMeta.code}`, path: `/currency/${pair}` },
    ]),
  ],
});

/**
 * Blog index page — /blog
 */
export const getBlogIndexSEO = () => ({
  rawTitle: `Blog | Remote Work, Time Zones & Currency Guides | ${BRAND}`,
  description: `Practical guides for remote teams, freelancers, and digital nomads. Learn to schedule meetings across time zones, manage multi-currency income, and work efficiently across borders.`,
  canonical: "/blog",
  keywords: "remote work blog, time zone tips, currency converter guide, digital nomad tools, remote team scheduling, freelancer currency, best meeting time",
  ogType: "website",
  structuredData: [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ],
});

/**
 * Blog post page — /blog/:slug
 * @param {object} post — full BLOG_POSTS entry
 */
export const getBlogPostSEO = ({ post }) => ({
  rawTitle: post.metaTitle ? post.metaTitle : `${post.title} | ${BRAND}`,
  description: post.metaDescription,
  canonical: `/blog/${post.slug}`,
  keywords: post.keywords,
  ogType: "article",
  structuredData: [
    buildArticleSchema(post),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// Static Pages  (About, Contact, Legal, Trust)
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_META = {
  about: {
    rawTitle: `About ${BRAND} | Time Zone & Currency Tools`,
    description: `Learn about ${BRAND} — a free, AI-powered platform combining a world clock, time zone converter, meeting planner, and live currency converter for remote teams.`,
    canonical: "/about",
    keywords: "about GlobalSync AI, free time zone tool, remote team tools, who we are",
  },
  contact: {
    rawTitle: `Contact ${BRAND} | Get in Touch`,
    description: `Have a question, suggestion, or found a bug? Contact the ${BRAND} team. We read every message and typically respond within 2 business days. No bots, no ticket queue.`,
    canonical: "/contact",
    keywords: "contact GlobalSync AI, feedback, support",
  },
  "privacy-policy": {
    rawTitle: `Privacy Policy | ${BRAND}`,
    description: `Read the ${BRAND} privacy policy. Learn how we handle data when you use our free time zone converter, currency converter, and meeting planner tools.`,
    canonical: "/privacy-policy",
    keywords: "GlobalSync AI privacy policy, data protection",
  },
  "terms-of-service": {
    rawTitle: `Terms of Service | ${BRAND}`,
    description: `Read the ${BRAND} terms of service. By using our free time zone converter and currency tools, you agree to these straightforward terms and conditions.`,
    canonical: "/terms-of-service",
    keywords: "GlobalSync AI terms of service",
  },
  "editorial-policy": {
    rawTitle: `Editorial Policy | ${BRAND}`,
    description: `Learn how ${BRAND} creates, reviews, and corrects content across our tools and blog. Our editorial standards are transparent, independent, and publicly documented.`,
    canonical: "/editorial-policy",
    keywords: "GlobalSync AI editorial policy, content standards",
  },
  methodology: {
    rawTitle: `Methodology | Data Sources & AI | ${BRAND}`,
    description: `How ${BRAND} sources time zone rules, live exchange rates, and generates AI responses. Update frequencies, data providers, and known limitations explained.`,
    canonical: "/methodology",
    keywords: "GlobalSync AI methodology, IANA time zone database, ECB exchange rates, AI transparency",
  },
  "data-sources": {
    rawTitle: `Data Sources | Time Zones & Exchange Rates | ${BRAND}`,
    description: `See the data sources powering ${BRAND}: IANA time zone rules, ECB and ExchangeRate-API currency data, and AI model details, including accuracy limitations.`,
    canonical: "/data-sources",
    keywords: "GlobalSync AI data sources, exchange rate sources, IANA time zone database, ECB exchange rates",
  },
  "freelancer-rate-converter": {
    rawTitle: `Freelancer Rate Converter | Hourly & Project | ${BRAND}`,
    description: `Convert freelancer hourly rates, project fees, and retainers across major currencies. Practical guidance and live exchange rates for remote workers and global clients.`,
    canonical: "/freelancer-rate-converter",
    keywords: "freelancer rate converter, hourly rate converter, project fee converter, international freelancer pricing",
  },
  "author-ahmed-hussain": {
    rawTitle: `Ahmed Hussain — Founder & Developer | ${BRAND}`,
    description: `Ahmed Hussain is the founder and developer of ${BRAND}, a free toolkit for remote teams and freelancers working across time zones and currencies. Based in Karachi, Pakistan.`,
    canonical: "/authors/ahmed-hussain",
    keywords: "Ahmed Hussain, GlobalSync AI founder, remote work tools developer, Karachi Pakistan",
  },
};

/**
 * Static page SEO — pass the route key e.g. getStaticPageSEO("about")
 */
export const getStaticPageSEO = (pageKey) => {
  const meta = STATIC_META[pageKey];
  if (!meta) {
    console.warn(`[seo.js] No static meta found for key: "${pageKey}"`);
    return {};
  }
  return {
    ...meta,
    ogType: "website",
    structuredData: [
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: meta.rawTitle.split(" | ")[0], path: meta.canonical },
      ]),
      ...(pageKey === "about" ? [buildOrganizationSchema(), buildPersonSchema()] : []),
      ...(pageKey === "author-ahmed-hussain" ? [buildPersonSchema(), buildOrganizationSchema()] : [])
    ],
  };
};
