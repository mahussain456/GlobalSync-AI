import React from 'react';
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function DataSourcesPage() {
  const seo = getStaticPageSEO("data-sources");
  return (
    <div className="min-h-screen flex flex-col bg-gem-forest text-gem-beige relative">
      <SEOHead {...seo} />

      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient overlay to soften */}
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10"></div>
        {/* World Map Background */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-6 font-heading">Data Sources & Methodology</h1>
        <div className="prose prose-invert max-w-none">
          <p>GlobalSync AI is committed to transparency. This page explains where our time zone and currency data comes from, how often it is refreshed, and where accuracy limits apply.</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Time Zone Data</h2>
          <p>We use the official IANA Time Zone Database for all time zone, daylight saving time (DST), and offset calculations. This ensures that historical and future dates correctly account for local political changes to time zones.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Currency Exchange Rates</h2>
          <p>Live currency rates are sourced primarily from the European Central Bank (ECB) and ExchangeRate-API. Rates are updated periodically to provide accurate mid-market exchange rates.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Update Frequency</h2>
          <p>Time zone rules are based on the IANA time zone database used by modern operating systems and browsers. Currency rates are refreshed from live provider responses and reference data, but market conditions can move faster than any public display layer.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Accuracy Disclaimer</h2>
          <p>While we strive for 100% accuracy, currency markets fluctuate constantly. The rates displayed are for informational purposes and may not reflect the exact rate offered by your bank, payment processor, or remittance service.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Important Limitations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Displayed exchange rates are informational and may differ from the rate offered by your bank, card network, or remittance provider.</li>
            <li>Government changes to daylight saving rules can occasionally outpace public database updates.</li>
            <li>For legal, payroll, invoicing, or treasury decisions, verify data with the relevant official source before acting.</li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
