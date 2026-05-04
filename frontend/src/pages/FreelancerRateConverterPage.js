import React, { useState } from 'react';
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function FreelancerRateConverterPage() {
  const [amount, setAmount] = useState(50);
  const [rateType, setRateType] = useState("hourly");
  
  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-white">
      <SEOHead 
        title="Freelancer Rate Converter | Calculate Hourly & Project Fees Across Currencies"
        description="Convert freelancer hourly rates, monthly retainers, and project fees across USD, EUR, GBP, INR, and 160+ currencies with live exchange rates."
      />
      <SiteNav />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-white">
            Freelancer Rate Converter
          </h1>
          <p className="text-white/60 text-lg">
            Convert hourly rates, project fees, and monthly retainers across 160+ currencies.
          </p>
        </div>
        
        {/* Placeholder UI for Converter */}
        <div className="bg-[#0A0F1E] border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Rate Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Billing Type</label>
              <select value={rateType} onChange={e => setRateType(e.target.value)} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500">
                <option value="hourly">Hourly Rate</option>
                <option value="project">Fixed Project Fee</option>
                <option value="monthly">Monthly Retainer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm mb-2">Equivalent to approx.</p>
            <div className="text-4xl font-bold text-emerald-400">
              {rateType === 'hourly' ? `₹${amount * 83}` : rateType === 'project' ? `₹${amount * 83}` : `₹${amount * 83}`} INR
            </div>
            <p className="text-white/30 text-xs mt-2">Live market rate calculation example</p>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-white mb-4">How Freelancers Can Quote International Clients</h2>
          <p className="text-white/70 leading-relaxed mb-6">
            When working with international clients, determining your rate isn't just about the number—it's about the currency. Fluctuating exchange rates can wipe out 3-5% of your invoice value if you're not careful. Always quote in a stable currency (like USD, EUR, or GBP) or build a buffer into your local currency quotes to absorb exchange rate volatility.
          </p>
          <h3 className="text-xl font-semibold text-white mb-3">Popular Freelancer Conversions</h3>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li><strong>USD to INR:</strong> Standard for Indian developers and designers working with US clients.</li>
            <li><strong>USD to PKR:</strong> Common for Pakistani tech talent and agencies.</li>
            <li><strong>EUR to GBP:</strong> Frequent for European and UK cross-border remote work.</li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
