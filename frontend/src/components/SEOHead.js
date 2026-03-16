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

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="GlobalSync AI" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
