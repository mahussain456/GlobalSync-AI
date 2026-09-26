/**
 * SEOHead — Universal metadata component for GlobalSync AI
 *
 * Every tag rendered here carries data-seo="". That marker is the contract with
 * src/index.js, which strips the pre-rendered set before React writes a fresh
 * one. Without it you get two of everything.
 *
 * Worth recording, because this bug has now been "fixed" twice:
 *   React 19 hoists <title>, <meta> and <link> into <head> on its own. It does
 *   that even when they are written as children of another component, so
 *   react-helmet-async never saw them and never stamped them with data-rh.
 *   index.js was cleaning up [data-rh="true"], which matched nothing, so the
 *   pre-rendered tags survived and React appended a second copy on top —
 *   758 duplicate-tag errors over 379 pages, invisible to curl because the
 *   duplicate only exists once JavaScript has run.
 *   Helmet is gone now; React 19 does this natively. Verify by counting tags
 *   in a rendered DOM, never in the HTML source.
 *
 * Props:
 *   rawTitle    {string}  — Complete, final <title>. Skips brand auto-suffix.
 *   title       {string}  — Legacy: brand " | GlobalSync AI" is auto-appended.
 *   description {string}  — Meta description
 *   canonical   {string}  — Path portion only e.g. "/time/new-york-to-london"
 *   keywords    {string}  — Comma-separated keyword list
 *   ogType      {string}  — OG type (default: "website", "article" for posts)
 *   structuredData        — Single schema object OR array (rendered as @graph)
 *   noIndex     {bool}    — Emits noindex when true (default: false)
 */

import { buildSiteBaseGraph } from "@/lib/seo";

const BASE_URL      = "https://www.globalsync-ai.com";
const BRAND         = "GlobalSync AI";
const DEFAULT_TITLE = `Free Time Zone & Currency Converter | ${BRAND}`;

function normalizeMetaDescription(desc) {
  if (!desc || typeof desc !== "string") {
    return "Free time zone converter, world clock, and live currency converter for remote teams. Plan meetings and convert 160+ currencies.";
  }
  let cleaned = desc.trim().replace(/\s+/g, " ");
  if (cleaned.length < 50) {
    cleaned = `${cleaned} — Powered by GlobalSync AI free time zone & currency tools.`;
  }
  if (cleaned.length > 158) {
    const truncated = cleaned.slice(0, 155);
    const lastSpace = truncated.lastIndexOf(" ");
    cleaned = (lastSpace > 110 ? truncated.slice(0, lastSpace) : truncated) + "...";
  }
  return cleaned;
}

function formatCharLength(str, maxLen) {
  if (!str || typeof str !== "string") return "";
  const cleaned = str.trim().replace(/\s+/g, " ");
  if (cleaned.length <= maxLen) return cleaned;
  const truncated = cleaned.slice(0, maxLen - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > (maxLen * 0.6) ? truncated.slice(0, lastSpace) : truncated) + "...";
}

export default function SEOHead({
  rawTitle,
  title,
  description,
  canonical,
  keywords,
  ogType = "website",
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  structuredData,
  schema,
  noIndex = false,
  author,
}) {
  const fullTitle = rawTitle
    ?? (title ? `${title} | ${BRAND}` : DEFAULT_TITLE);

  const normalizedDescription = normalizeMetaDescription(description);
  const ogTitleText = formatCharLength(ogTitle || fullTitle, 60);
  const ogDescText = formatCharLength(ogDescription || normalizedDescription, 158);
  const twitterTitleText = formatCharLength(twitterTitle || fullTitle, 55);
  const twitterDescriptionText = formatCharLength(twitterDescription || normalizedDescription, 125);
  const fullCanonical = canonical ? new URL(canonical, BASE_URL).href : `${BASE_URL}/`;
  const data = structuredData || schema;

  // Organization and WebSite are referenced by @id from publisher/author all over
  // the site, so every page has to actually define them or those references
  // dangle. The page's own nodes come first and win on @id; the base graph only
  // fills what is missing, so a page that already describes the Organization in
  // more detail keeps its richer version.
  let schemaOutput = null;
  if (data) {
    const pageNodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
    const present = new Set(pageNodes.map(n => n["@id"]).filter(Boolean));
    const base = buildSiteBaseGraph().filter(n => !present.has(n["@id"]));
    schemaOutput = { "@context": "https://schema.org", "@graph": [...pageNodes, ...base] };
  }

  const socialImage = `${BASE_URL}/globalsync-ai-logo-1600x400.png`;
  const imageAlt = `${BRAND} — Free Time Zone & Currency Converter`;

  return (
    <>
      <title data-seo="">{fullTitle}</title>
      <meta data-seo="" name="description" content={normalizedDescription} />
      {keywords && <meta data-seo="" name="keywords" content={keywords} />}
      {author  && <meta data-seo="" name="author"   content={author}   />}
      <link data-seo="" rel="canonical" href={fullCanonical} />

      <meta data-seo="" property="og:title"        content={ogTitleText}   />
      <meta data-seo="" property="og:description"  content={ogDescText}    />
      <meta data-seo="" property="og:type"         content={ogType}        />
      <meta data-seo="" property="og:url"          content={fullCanonical} />
      <meta data-seo="" property="og:site_name"    content={BRAND}         />
      <meta data-seo="" property="og:image"        content={socialImage}   />
      <meta data-seo="" property="og:image:width"  content="1600"          />
      <meta data-seo="" property="og:image:height" content="400"           />
      <meta data-seo="" property="og:image:alt"    content={imageAlt}      />
      <meta data-seo="" property="og:locale"       content="en_US"         />

      <meta data-seo="" name="twitter:card"        content="summary_large_image" />
      <meta data-seo="" name="twitter:site"        content="@GlobalSyncAI"       />
      <meta data-seo="" name="twitter:creator"     content="@GlobalSyncAI"       />
      <meta data-seo="" name="twitter:title"       content={twitterTitleText}    />
      <meta data-seo="" name="twitter:description" content={twitterDescriptionText} />
      <meta data-seo="" name="twitter:image"       content={socialImage}         />
      <meta data-seo="" name="twitter:image:alt"   content={imageAlt}            />

      {noIndex
        ? <meta data-seo="" name="robots" content="noindex, follow" />
        : <meta data-seo="" name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {schemaOutput && (
        <script
          data-seo=""
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // The payload sits inside a <script>, so "<" is the only character
            // that can break out of it. Escaping it keeps the JSON valid.
            __html: JSON.stringify(schemaOutput).replace(/</g, "\u003c"),
          }}
        />
      )}
    </>
  );
}
