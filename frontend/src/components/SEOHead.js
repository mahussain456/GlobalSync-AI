/**
 * SEOHead — Universal metadata component for GlobalSync AI
 *
 * Props:
 *   rawTitle    {string}  — Complete, final <title>. Skips brand auto-suffix.
 *                           Use this with seo.js helpers: <SEOHead {...seo} />
 *   title       {string}  — Page title. Brand " | GlobalSync AI" is auto-appended.
 *                           Legacy prop — kept for backward compatibility.
 *   description {string}  — Meta description
 *   canonical   {string}  — Path portion only e.g. "/time/new-york-to-london"
 *   keywords    {string}  — Comma-separated keyword list
 *   ogType      {string}  — Open Graph type (default: "website", use "article" for blog posts)
 *   structuredData        — Single schema object OR array (rendered as @graph)
 *   noIndex     {bool}    — Emits noindex,nofollow robots tag when true (default: false)
 */
import { Helmet } from "react-helmet-async";

const BASE_URL     = "https://www.globalsync-ai.com";
const BRAND        = "GlobalSync AI";
const DEFAULT_TITLE = `${BRAND} — Free Time Zone & Currency Converter for Remote Teams`;
const OG_IMAGE     = `${BASE_URL}/globalsync-ai-logo-1600x400.png`;

export default function SEOHead({
  rawTitle,          // complete title — no brand suffix appended
  title,             // legacy: brand suffix auto-appended
  description,
  canonical,
  keywords,
  ogType = "website",
  structuredData,
  noIndex = false,
}) {
  // rawTitle wins → title with suffix → fallback default
  const fullTitle = rawTitle
    ?? (title ? `${title} | ${BRAND}` : DEFAULT_TITLE);

  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  // Single schema object or array → always emit as @graph for consistency
  const schemaOutput = structuredData
    ? Array.isArray(structuredData)
      ? { "@context": "https://schema.org", "@graph": structuredData }
      : structuredData
    : null;

  const ogTitle = encodeURIComponent(fullTitle);
  const ogSubtitle = encodeURIComponent(description || 'One Platform. Every Time Zone. Total Alignment.');
  const dynamicOgImage = `${BASE_URL}/api/og?title=${ogTitle}&subtitle=${ogSubtitle}&type=${ogType}`;

  return (
    <Helmet>
      {/* ── Primary ────────────────────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* ── Open Graph ─────────────────────────────────────────────────────── */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:url"         content={fullCanonical} />
      <meta property="og:site_name"   content={BRAND} />
      <meta property="og:image"       content={dynamicOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"   content={`${BRAND} — Free Time Zone & Currency Converter`} />
      <meta property="og:locale"      content="en_US" />

      {/* ── Twitter Card ───────────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@GlobalSyncAI" />
      <meta name="twitter:creator"     content="@GlobalSyncAI" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={dynamicOgImage} />
      <meta name="twitter:image:alt"   content={`${BRAND} — Free Time Zone & Currency Converter`} />

      {/* ── Robots ─────────────────────────────────────────────────────────── */}
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {/* ── JSON-LD Structured Data ─────────────────────────────────────────── */}
      {schemaOutput && (
        <script type="application/ld+json">
          {JSON.stringify(schemaOutput)}
        </script>
      )}
    </Helmet>
  );
}
