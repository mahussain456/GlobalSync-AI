import React from 'react';
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-white">
      <SEOHead 
        title="Data Sources & Accuracy | GlobalSync AI"
        description="Learn about the data sources powering GlobalSync AI's time zone and currency converters."
      />
      <SiteNav />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <h1 className="text-3xl font-bold mb-6 font-heading">Data Sources & Methodology</h1>
        <div className="prose prose-invert max-w-none">
          <p>GlobalSync AI is committed to transparency. Here is where our data comes from:</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Time Zone Data</h2>
          <p>We use the official IANA Time Zone Database for all time zone, daylight saving time (DST), and offset calculations. This ensures that historical and future dates correctly account for local political changes to time zones.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Currency Exchange Rates</h2>
          <p>Live currency rates are sourced primarily from the European Central Bank (ECB) and ExchangeRate-API. Rates are updated periodically to provide accurate mid-market exchange rates.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Accuracy Disclaimer</h2>
          <p>While we strive for 100% accuracy, currency markets fluctuate constantly. The rates displayed are for informational purposes and may not reflect the exact rate offered by your bank, payment processor, or remittance service.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
