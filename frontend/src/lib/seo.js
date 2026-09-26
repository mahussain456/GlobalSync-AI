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
const LOGO_URL  = `${BASE_URL}/meridian/logo-original-icon.png`;

// 站内实体的稳定 @id。没有这个，每一页都会生成一个新的匿名 Organization /
// Person 节点，而不是指向同一个实体 —— 首页已经在用 `/#org`，其余对齐它。
const ORG_ID    = `${BASE_URL}/#org`;
const PERSON_ID = `${BASE_URL}/authors/ahmed-hussain#person`;
const WEBSITE_ID = `${BASE_URL}/#website`;

// 社交档案只在这里维护一处。可见链接和 sameAs 不一致，本身就是个弱信号。
const SAME_AS = [
  "https://x.com/GlobalSyncAI",
  "https://www.linkedin.com/company/globalsync-ai",
];

// 信任页的编辑修订日期。页面内容有实质更新时手动改这里。
// 部署日期不是编辑日期，所以不从构建时间推导。
const PAGE_DATES = {
  "methodology":      { published: "2026-06-04", modified: "2026-09-23" },
  "editorial-policy": { published: "2026-06-04", modified: "2026-09-23" },
  "data-sources":     { published: "2026-06-04", modified: "2026-09-23" },
  "blog":             { published: "2026-06-04", modified: "2026-09-23" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Schema Builders
// Each returns a plain schema object (no @context — that's added by SEOHead
// when it wraps an array in @graph, or you pass it standalone with @context).
// ─────────────────────────────────────────────────────────────────────────────

export const buildPersonSchema = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  "name": "Ahmed Hussain",
  "url": `${BASE_URL}/authors/ahmed-hussain`,
  "sameAs": [
    `${BASE_URL}/about`,
    "https://x.com/GlobalSyncAI"
  ],
  "jobTitle": "Founder",
  "worksFor": { "@id": ORG_ID },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  },
  "description": "Ahmed Hussain is the founder of GlobalSync AI, building free time zone, meeting planner, and currency tools for remote teams, freelancers, and global businesses."
});

export const buildOrganizationSchema = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  "name": BRAND,
  "url": BASE_URL,
  "logo": { "@type": "ImageObject", "url": LOGO_URL },
  "sameAs": SAME_AS,
});

/**
 * 每一页都应该带上的基础实体。SEOHead 会按 @id 去重后合并进 @graph，
 * 所以页面自己再发一次 Organization 也不会重复。
 */
export const buildSiteBaseGraph = () => [
  buildOrganizationSchema(),
  {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "name": BRAND,
    "url": BASE_URL,
    "inLanguage": "en",
    "publisher": { "@id": ORG_ID },
  },
];

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
  "isAccessibleForFree": true,
  "publisher": { "@id": ORG_ID },
});

export const buildSoftwareApplicationSchema = ({ name, path, description, category = "UtilitiesApplication" }) => ({
  "@type": "SoftwareApplication",
  "name": name,
  "url": `${BASE_URL}${path}`,
  "applicationCategory": category,
  "operatingSystem": "Web",
  "description": description,
  "isAccessibleForFree": true,
  "publisher": { "@id": ORG_ID },
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

/**
 * 把快照日期转成 ISO8601。解析失败就返回 null —— 宁可不发日期，
 * 也不要发一个编造的日期。
 */
const toISO = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

/**
 * @param {string} fromCode  基准货币，例如 "USD"
 * @param {string} toCode    报价货币，例如 "PHP"
 * @param {object} snapshot  { rate, date, source } —— 页面实际渲染的那个值
 *
 * price / validFrom 只在真有数值和可解析日期时才发出。没有就退回到
 * 不带数字的描述性块，绝不填占位数。
 */
export const buildExchangeRateSchema = (fromCode, toCode, snapshot) => {
  const { rate, date } = snapshot || {};
  const hasRate = Number.isFinite(rate) && rate > 0;
  const validFrom = toISO(date);
  const validThrough = validFrom
    ? new Date(new Date(validFrom).getTime() + 24 * 60 * 60 * 1000).toISOString()
    : null;
  const slug = `${fromCode.toLowerCase()}-to-${toCode.toLowerCase()}`;

  return {
    "@type": "ExchangeRateSpecification",
    "@id": `${BASE_URL}/currency/${slug}#rate`,
    "url": `${BASE_URL}/currency/${slug}`,
    "name": `${fromCode} to ${toCode} reference exchange rate`,
    "currency": toCode,
    "currentExchangeRate": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": toCode,
      ...(hasRate ? { "price": Number(rate.toFixed(6)) } : {}),
      "referenceQuantity": {
        "@type": "QuantitativeValue",
        "value": 1,
        "unitText": fromCode,
      },
      ...(validFrom ? { validFrom, validThrough } : {}),
    },
    "disambiguatingDescription": "Dated reference rate for planning and estimation. Not a live mid-market quote, and not the final transfer rate offered by a payment provider.",
  };
};

const MONTHS = {
  january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
  july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
};

/** "June 2026" -> "2026-06"（ISO 8601 的年月精度）。解析不了就返回 null。 */
const normalizePostDate = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(value)) return value;
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${month}` : null;
};

export const postDates = (post) => {
  const published = normalizePostDate(post.datePublished || post.publishDate);
  const modified = normalizePostDate(post.dateModified) || published;
  return { published, modified };
};

export const buildArticleSchema = (post) => ({
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.metaDescription,
  "keywords": post.keywords,
  ...(postDates(post).published ? { "datePublished": postDates(post).published } : {}),
  ...(postDates(post).modified ? { "dateModified": postDates(post).modified } : {}),
  "author": { "@id": PERSON_ID },
  "publisher": { "@id": ORG_ID },
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
  const title = "Sync Global Teams: Free Time Zone & Currency Tools";
  const desc  = "Free AI tools for global remote teams. Synchronize time zones, convert 160+ currencies, and plan team meetings effortlessly. No signup required.";
  return {
    rawTitle: title,
    description: desc,
    canonical: "/",
    keywords: "time zone converter, world clock, currency converter, meeting planner, business hours overlap, remote team scheduling, free currency converter 160 currencies, city to city time conversion",
    ogType: "website",
    ogTitle: "Sync Global Teams: Free Time Zone & Currency Tools",
    ogDescription: "Sync your global team effortlessly! Free AI-powered time zone, meeting, and currency tools.",
    twitterTitle: "GlobalSync: Free Time Zone & Currency Tools for Teams!",
    twitterDescription: "Sync global teams easily! Free time zone, world clock, & currency converter. No signup needed.",
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      {
        "@type": ["Organization", "OnlineBusiness"],
        "@id": ORG_ID,
        "name": BRAND,
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": LOGO_URL,
          "width": 512,
          "height": 512
        },
        "description": "Free AI-powered time zone, meeting planner, and currency tools for remote teams and freelancers.",
        "founder": { "@id": PERSON_ID },
        "knowsAbout": [
          "Time zone conversion",
          "Daylight saving time",
          "Foreign exchange reference rates",
          "Remote team scheduling",
          "Freelance invoicing",
        ],
        "sameAs": SAME_AS,
      },
      buildPersonSchema(),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "url": BASE_URL,
        "name": BRAND,
        "publisher": { "@id": ORG_ID },
        "inLanguage": "en",
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
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
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
  const title = `Free Currency Converter | 160+ Rates | ${BRAND}`;
  return {
    rawTitle: title,
    description: `Estimate amounts across 160+ currencies with dated reference rates, clear sources and labeled offline snapshots. Free, no signup.`,
    canonical: "/currency-converter",
    keywords: "currency converter, reference exchange rates, USD to INR, EUR to GBP, free currency converter, 160 currencies, dated rates",
    ogType: "website",
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      buildSoftwareApplicationSchema({
        name: "Free Currency Converter",
        path: "/currency-converter",
        description: "Estimate amounts across 160+ currencies with dated reference rates, clear sources and labeled offline snapshots. Free, no signup.",
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
  const title = `Meeting Time Planner for Remote Teams | ${BRAND}`;
  return {
    rawTitle: title,
    description: `Compare working hours across cities, choose a meeting duration, and share or export a time that fits. Free, no signup.`,
    canonical: "/meeting-planner",
    keywords: "global meeting times, distributed team scheduling, time zone overlap, remote work collaboration, international meeting planner",
    ogType: "website",
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      buildSoftwareApplicationSchema({
        name: "Meeting Planner for Distributed Teams",
        path: "/meeting-planner",
        description: "Compare working hours across cities, choose a meeting duration, and share or export a time that fits.",
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
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
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
      buildSoftwareApplicationSchema({
        name: `${cityA.name} to ${cityB.name} Time Converter`,
        path: `/time/${pair}`,
        description: desc,
        category: "UtilitiesApplication"
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
export const getCurrencyPairSEO = ({ fromMeta, toMeta, pair, pairData, rateSnapshot }) => {
  const title = `${fromMeta.code} to ${toMeta.code} Live Exchange Rates | ${BRAND}`;
  const desc = (fromMeta.code === "USD" && toMeta.code === "PHP")
    ? `Convert USD to PHP live with GlobalSync AI. Get real-time exchange rates for 160+ currencies. Free and no signup required.`
    : `Convert ${fromMeta.code} to ${toMeta.code} live with GlobalSync AI. Get real-time exchange rates across 160+ currencies. Free, fast, and no account signup required.`;
  return {
    rawTitle: title,
    description: desc,
    canonical: `/currency/${pair}`,
    keywords: `${fromMeta.code} to ${toMeta.code}, ${fromMeta.name} to ${toMeta.name}, live exchange rate, ${fromMeta.code} ${toMeta.code} converter, ${fromMeta.code} rate today, real-time currency converter`,
    ogType: "website",
    ogTitle: `${fromMeta.code} to ${toMeta.code}: Live Exchange Rate Converter | ${BRAND}`,
    twitterTitle: `${fromMeta.code} to ${toMeta.code}: Live Rates & Smart Currency Conversion!`,
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    noIndex: !pairData,
    structuredData: [
      {
        ...buildWebPageSchema({
          name: `${fromMeta.code} to ${toMeta.code} Live Exchange Rate`,
          path: `/currency/${pair}`,
          description: desc,
          crumbs: [
            { name: "Home", path: "/" },
            { name: "Currency Converter", path: "/currency-converter" },
            { name: `${fromMeta.code} to ${toMeta.code}`, path: `/currency/${pair}` },
          ]
        }),
        "@id": `${BASE_URL}/currency/${pair}#webpage`,
        ...(toISO(rateSnapshot?.date) ? { "dateModified": toISO(rateSnapshot.date) } : {}),
        "author": { "@id": PERSON_ID },
        "publisher": { "@id": ORG_ID },
        "isBasedOn": {
          "@type": "Dataset",
          "name": "ECB-benchmarked reference rates via ExchangeRate-API",
          "url": `${BASE_URL}/data-sources`,
        },
        "citation": {
          "@type": "CreativeWork",
          "name": "GlobalSync AI Methodology",
          "url": `${BASE_URL}/methodology`,
        },
        "mainEntity": { "@id": `${BASE_URL}/currency/${pair}#rate` },
      },
      buildSoftwareApplicationSchema({
        name: `${fromMeta.code} to ${toMeta.code} Currency Converter`,
        path: `/currency/${pair}`,
        description: desc,
        category: "FinanceApplication"
      }),
      buildExchangeRateSchema(fromMeta.code, toMeta.code, rateSnapshot),
      buildOrganizationSchema(),
      buildPersonSchema(),
      ...(pairData?.faqs?.length ? [buildFAQSchema(pairData.faqs)] : []),
    ],
  };
};

/**
 * Blog index page — /blog
 */
export const getBlogIndexSEO = ({ posts = [] } = {}) => {
  const title = `GlobalSync AI: Expert Guides for Global Remote Work`;
  return {
    rawTitle: title,
    description: `Practical guides for remote teams, freelancers, and digital nomads. Learn to schedule meetings across time zones and manage multi-currency income.`,
    canonical: "/blog",
    keywords: "remote work blog, time zone tips, currency converter guide, digital nomad tools, remote team scheduling, freelancer currency, best meeting time",
    ogType: "website",
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
      ]),
      buildOrganizationSchema(),
      buildPersonSchema(),
      {
        "@type": "Blog",
        "@id": `${BASE_URL}/blog#blog`,
        "name": title,
        "url": `${BASE_URL}/blog`,
        "inLanguage": "en",
        "publisher": { "@id": ORG_ID },
        ...(posts.length ? {
          "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": `${BASE_URL}/blog/${post.slug}`,
            ...(postDates(post).published ? { "datePublished": postDates(post).published } : {}),
            ...(postDates(post).modified ? { "dateModified": postDates(post).modified } : {}),
            "author": { "@id": PERSON_ID },
          })),
        } : {}),
      },
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
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      buildArticleSchema(post),
      buildOrganizationSchema(),
      buildPersonSchema(),
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
    rawTitle: `About GlobalSync AI: Free Tools for Remote Teams`,
    description: `Learn about GlobalSync AI, a free platform combining a world clock, time zone converter, meeting planner, and currency tools for global remote teams.`,
    canonical: "/about",
    keywords: "about GlobalSync AI, free time zone tool, remote team tools, who we are",
    author: "Ahmed Hussain",
  },
  contact: {
    rawTitle: `Contact GlobalSync AI: Support, Feedback & Partnerships`,
    description: `Have questions, suggestions, or bug reports? Contact the GlobalSync AI team. We respond directly to every message, usually within 2 business days.`,
    canonical: "/contact",
    keywords: "contact GlobalSync AI, feedback, support",
  },
  "privacy-policy": {
    rawTitle: `GlobalSync AI: Privacy Policy and Data Practices`,
    description: `Read the GlobalSync AI privacy policy. Learn how we handle data when you use our free time zone converter, currency converter, and meeting planner tools.`,
    canonical: "/privacy-policy",
    keywords: "GlobalSync AI privacy policy, data protection",
  },
  "terms-of-service": {
    rawTitle: `GlobalSync AI: Terms of Service and Usage Policies`,
    description: `Read the GlobalSync AI terms of service. By using our free time zone converter, currency, and meeting tools, you agree to our terms and conditions.`,
    canonical: "/terms-of-service",
    keywords: "GlobalSync AI terms of service",
  },
  "editorial-policy": {
    rawTitle: `GlobalSync AI: Our Editorial Standards and Accuracy Policy`,
    description: `Learn how GlobalSync AI creates, reviews, and corrects content. Our editorial standards are transparent, independent, and publicly documented.`,
    canonical: "/editorial-policy",
    keywords: "GlobalSync AI editorial policy, content standards",
  },
  methodology: {
    rawTitle: `GlobalSync AI: Our Data Sources and Methodology`,
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
    rawTitle: `Freelance Rate & Annual Revenue Calculator | GlobalSync AI`,
    description: `Convert hourly rates, retainers and project fees across 11 currencies. Estimate gross annual freelance revenue and use your rate in an invoice. Free, no signup.`,
    canonical: "/freelancer-rate-converter",
    keywords: "freelancer rate converter, hourly rate converter, project fee converter, international freelancer pricing",
  },
  "author-ahmed-hussain": {
    rawTitle: "About Ahmed Hussain: Founder of GlobalSync AI",
    description: "Ahmed Hussain, founder of GlobalSync AI, built free AI tools for remote teams. Discover his work on time zone, currency, and productivity tools.",
    canonical: "/authors/ahmed-hussain",
    keywords: "Ahmed Hussain, GlobalSync AI founder, remote work tools developer, Karachi Pakistan",
  },
  press: {
    rawTitle: `Press & Media Resources | GlobalSync AI`,
    description: `Get the latest press releases, media kits, brand assets, and media contact information for GlobalSync AI time zone, currency, and meeting tools.`,
    canonical: "/press",
    keywords: "GlobalSync AI press, media kit, press release, brand assets",
  },
  "global-meeting-planner-for-remote-teams": {
    rawTitle: `Remote Team Meeting Planner | GlobalSync AI`,
    description: `Plan and schedule meetings for international remote teams. Find optimal overlaps across EST, PST, GMT, IST, and multiple time zones.`,
    canonical: "/global-meeting-planner-for-remote-teams",
    keywords: "remote teams meeting planner, group meeting time finder, multi zone meeting scheduler",
  },
  "us-india-meeting-time": {
    rawTitle: `US & India Meeting Times Guide | GlobalSync AI`,
    description: `Find the best meeting times between the United States and India. Convert EST and PST to IST, and check business hour overlaps.`,
    canonical: "/us-india-meeting-time",
    keywords: "EST to IST meeting time, PST to IST, US India time converter, US India meeting planner",
  },
};

/**
 * Static page SEO — pass the route key e.g. getStaticPageSEO("about", { faqs: [...] })
 */
/** 把一个信任页描述成有作者、有日期的技术文章。 */
const buildTrustArticleSchema = (pageKey, { rawTitle, description, canonical }) => {
  const dates = PAGE_DATES[pageKey];
  if (!dates) return [];
  return [{
    "@type": "TechArticle",
    "@id": `${BASE_URL}${canonical}#article`,
    "headline": rawTitle,
    "url": `${BASE_URL}${canonical}`,
    "description": description,
    "datePublished": dates.published,
    "dateModified": dates.modified,
    "inLanguage": "en",
    "author": { "@id": PERSON_ID },
    "publisher": { "@id": ORG_ID },
    "proficiencyLevel": "Beginner",
  }];
};

/** /data-sources 上的两个 Dataset —— 这是可被引用为来源的那部分。 */
const buildDataSourceDatasets = () => {
  const modified = PAGE_DATES["data-sources"].modified;
  return [
    {
      "@type": "Dataset",
      "@id": `${BASE_URL}/data-sources#tzdata`,
      "name": "Time zone rules used by GlobalSync AI",
      "description": "Time zone offsets and daylight saving transition rules for 25+ cities, sourced from the IANA Time Zone Database.",
      "url": `${BASE_URL}/data-sources`,
      "license": "https://www.iana.org/time-zones",
      "isBasedOn": {
        "@type": "Dataset",
        "name": "IANA Time Zone Database",
        "url": "https://www.iana.org/time-zones",
      },
      "creator": { "@id": ORG_ID },
      "temporalCoverage": modified,
      "keywords": ["time zones", "daylight saving time", "IANA tzdata", "UTC offsets"],
    },
    {
      "@type": "Dataset",
      "@id": `${BASE_URL}/data-sources#fx`,
      "name": "Currency reference rates used by GlobalSync AI",
      "description": "Dated reference exchange rates for 160+ currencies, aligned with benchmark rates published by the European Central Bank and institutional liquidity pools via ExchangeRate-API. Estimates for planning, not final transfer rates.",
      "url": `${BASE_URL}/data-sources`,
      "creator": { "@id": ORG_ID },
      "temporalCoverage": modified,
      "measurementTechnique": "Benchmark reference rate aggregation",
      "keywords": ["exchange rates", "reference rates", "ECB", "currency conversion"],
    },
  ];
};

export const getStaticPageSEO = (pageKey, { faqs = [] } = {}) => {
  const meta = STATIC_META[pageKey];
  if (!meta) {
    console.warn(`[seo.js] No static meta found for key: "${pageKey}"`);
    return {};
  }
  return {
    ...meta,
    ogType: "website",
    ogImage: `${BASE_URL}/globalsync-ai-logo-1600x400.png`,
    structuredData: [
      buildBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: meta.rawTitle.split(" | ")[0], path: meta.canonical },
      ]),
      ...(pageKey === "about" ? [buildOrganizationSchema(), buildPersonSchema()] : []),
      ...(pageKey === "author-ahmed-hussain" ? [buildPersonSchema(), buildOrganizationSchema()] : []),
      ...(PAGE_DATES[pageKey] ? [buildOrganizationSchema(), buildPersonSchema()] : []),
      ...buildTrustArticleSchema(pageKey, meta),
      ...(pageKey === "data-sources" ? buildDataSourceDatasets() : []),
      ...(faqs.length ? [buildFAQSchema(faqs)] : []),
    ],
  };
};
