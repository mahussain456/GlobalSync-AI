import { Helmet } from "react-helmet-async";

const BASE_URL = "https://globalsync-ai.com";

export default function SEOHead({
  title,
  description,
  canonical,
  keywords,
  ogType = "website",
  structuredData,
}) {
  const fullTitle = title
    ? `${title} | GlobalSync AI`
    : "GlobalSync AI — Free Time Zone & Currency Converter for Remote Teams";
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph — full spec for rich previews */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="GlobalSync AI" />
      <meta property="og:image" content="https://globalsync-ai.com/logo.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="GlobalSync AI — Free Time Zone & Currency Converter for Remote Teams" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card — full spec */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GlobalSyncAI" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://globalsync-ai.com/logo.png" />
      <meta name="twitter:image:alt" content="GlobalSync AI — Free AI-Powered World Clock & Currency Converter" />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
