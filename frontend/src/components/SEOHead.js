/**
 * SEOHead — Universal metadata component for GlobalSync AI
 *
 * Uses react-helmet-async (not React 19 native metadata hoisting) so that
 * react-snap pre-rendered tags get properly deduplicated on hydrateRoot.
 *
 * Root cause of the 572 Ahrefs duplicate-tag errors (286 title + 286 description):
 *   React 19's native <title>/<meta> hoisting baked tags into the pre-rendered HTML,
 *   then hydrateRoot injected them AGAIN — two identical tags per page.
 *   react-helmet-async marks every tag with data-rh="true" and strips the old set
 *   before writing the new one, giving exactly one tag per type after hydration.
 *
 * Props:
 *   rawTitle    {string}  — Complete, final <title>. Skips brand auto-suffix.
 *   title       {string}  — Legacy: brand " | GlobalSync AI" is auto-appended.
 *   description {string}  — Meta description
 *   canonical   {string}  — Path portion only e.g. "/time/new-york-to-london"
 *   keywords    {string}  — Comma-separated keyword list
 *   ogType      {string}  — OG type (default: "website", use "article" for blog posts)
 *   structuredData        — Single schema object OR array (rendered as @graph)
 *   noIndex     {bool}    — Emits noindex,nofollow robots tag when true (default: false)
 */
import { Helmet } from "react-helmet-async";

const BASE_URL      = "https://www.globalsync-ai.com";
const BRAND         = "GlobalSync AI";
const DEFAULT_TITLE = `${BRAND} — Free Time Zone & Currency Converter for Remote Teams`;

export default function SEOHead({
  rawTitle,
  title,
  description,
  canonical,
  keywords,
  ogType = "website",
  structuredData,
  noIndex = false,
  author,
}) {
  const fullTitle = rawTitle
    ?? (title ? `${title} | ${BRAND}` : DEFAULT_TITLE);

  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  const schemaOutput = structuredData
    ? Array.isArray(structuredData)
      ? { "@context": "https://schema.org", "@graph": structuredData }
      : structuredData
    : null;

  const ogTitle    = encodeURIComponent(fullTitle);
  const ogSubtitle = encodeURIComponent(description || "One Platform. Every Time Zone. Total Alignment.");
  const dynamicOgImage = `${BASE_URL}/api/og?title=${ogTitle}&subtitle=${ogSubtitle}&type=${ogType}`;

  return (
    <Helmet
      script={schemaOutput ? [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify(schemaOutput),
        }
      ] : []}
    >
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author  && <meta name="author"   content={author}   />}
      <link rel="canonical" href={fullCanonical} />

      <meta property="og:title"        content={fullTitle}       />
      <meta property="og:description"  content={description}     />
      <meta property="og:type"         content={ogType}          />
      <meta property="og:url"          content={fullCanonical}   />
      <meta property="og:site_name"    content={BRAND}           />
      <meta property="og:image"        content={dynamicOgImage}  />
      <meta property="og:image:width"  content="1200"            />
      <meta property="og:image:height" content="630"             />
      <meta property="og:image:alt"    content={`${BRAND} — Free Time Zone & Currency Converter`} />
      <meta property="og:locale"       content="en_US"           />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@GlobalSyncAI"       />
      <meta name="twitter:creator"     content="@GlobalSyncAI"       />
      <meta name="twitter:title"       content={fullTitle}            />
      <meta name="twitter:description" content={description}          />
      <meta name="twitter:image"       content={dynamicOgImage}       />
      <meta name="twitter:image:alt"   content={`${BRAND} — Free Time Zone & Currency Converter`} />

      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }
    </Helmet>
  );
}
