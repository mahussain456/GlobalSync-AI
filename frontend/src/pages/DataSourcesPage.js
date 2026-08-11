import React from 'react';
import { Link } from 'react-router-dom';
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
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />
      <main className="flex-1 max-w-3xl mx-auto px-6 pt-36 pb-12 w-full relative z-10">
        <h1 className="text-3xl font-bold mb-6 font-heading text-gem-beige">GlobalSync AI Data Sources</h1>
        <div className="prose prose-invert max-w-none text-gem-beige/70 text-sm leading-relaxed space-y-6">
          <p>
            GlobalSync AI is committed to transparency, reliability, and data integrity. This page outlines the specific time zone, exchange rate, and scheduling data sources used to power our utilities, along with details on update frequencies and methodology.
          </p>
          
          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">Time Zone Data Sources</h2>
          <p>
            All time zone calculations, offsets, and daylight saving time (DST) transitions are computed using the official <strong className="text-gem-beige">IANA Time Zone Database (tzdata)</strong>. This database is the authoritative global standard used by major operating systems (including Linux, macOS, and Android), databases, and web browsers to maintain accurate, up-to-date regional clock offsets.
          </p>

          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">Currency Exchange Rate Sources</h2>
          <p>
            Real-time exchange rate conversions are processed via secure API integrations with the <strong className="text-gem-beige">European Central Bank (ECB)</strong> and supplementary market feed providers (such as ExchangeRate-API). We display the mid-market rate—the midpoint between the buy and sell rates on the global interbank market—providing a clean, margin-free baseline index.
          </p>

          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">Data Refresh Rates and Update Schedules</h2>
          <p>
            Our currency conversion feeds are refreshed in real-time on every query to ensure accuracy. Time zone rules are updated automatically upon every new release of the IANA Time Zone Database, typically 3 to 6 times per year. Historical rate data for trend charts is updated once daily.
          </p>

          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">Accuracy and Limitations</h2>
          <p>
            While we strive for absolute precision, financial markets fluctuate constantly, and local governments occasionally implement time zone or daylight saving changes with short notice. The exchange rates displayed are for informational purposes only; they do not include the markup or retail transaction fees that your bank or money transfer operator may charge. For high-value transactions or critical scheduling, we advise verifying data with official banking institutions or local government publications.
          </p>

          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">How GlobalSync AI Calculates Meeting Overlap</h2>
          <p>
            Our Meeting Planner uses a standard, equitable overlap algorithm. By default, it defines "fair working hours" as 9:00 AM to 5:00 PM local time in each participant's zone. The algorithm maps all selected cities to Coordinated Universal Time (UTC), identifies overlapping hours, and generates a visual grid. It calculates a Meeting Overlap Score (from 0 to 100) based on how many participants are within standard working hours, flag-warning users of late-night or early-morning conflicts to promote respectful scheduling.
          </p>

          <h2 className="text-xl font-bold text-gem-beige mt-8 mb-3">Learn More & Support</h2>
          <p>
            For a deeper dive into our calculations, technology stack, and AI parameters, explore our detailed <Link to="/methodology" className="text-gem-gold hover:underline">Methodology Page</Link>.
          </p>
          <p>
            If you have questions about our data feeds, identify a database inaccuracy, or want to suggest a new feature, please get in touch via the <Link to="/contact" className="text-gem-gold hover:underline">Contact Page</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
