import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

export default function FreelancerRateConverterPage() {
  const [amount, setAmount] = useState(50);
  const [rateType, setRateType] = useState("hourly");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("INR");
  const seo = getStaticPageSEO("freelancer-rate-converter");

  const EXCHANGE_RATES = {
    USD: 1,
    INR: 83.5,
    PKR: 278.5,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    NGN: 1450,
    PHP: 56.5,
    ZAR: 18.9,
    CAD: 1.36,
    AUD: 1.52
  };

  const SYMBOLS = {
    USD: "$", INR: "₹", PKR: "Rs", EUR: "€", GBP: "£", AED: "د.إ", NGN: "₦", PHP: "₱", ZAR: "R", CAD: "C$", AUD: "A$"
  };

  const conversionRate = EXCHANGE_RATES[targetCurrency] / EXCHANGE_RATES[baseCurrency];
  const convertedAmount = (amount * conversionRate).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 });

  return (
    <div className="min-h-screen flex flex-col bg-[#050816] text-white">
      <SEOHead {...seo} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Rate Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Base Currency</label>
              <select value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors">
                {Object.keys(EXCHANGE_RATES).map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Target Currency</label>
              <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors">
                {Object.keys(EXCHANGE_RATES).map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Billing Type</label>
              <select value={rateType} onChange={e => setRateType(e.target.value)} className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors">
                <option value="hourly">Hourly Rate</option>
                <option value="project">Fixed Project Fee</option>
                <option value="monthly">Monthly Retainer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-white/40 text-sm mb-2">Equivalent to approx.</p>
            <div className="text-4xl font-bold text-emerald-400">
              {SYMBOLS[targetCurrency]}{convertedAmount} {targetCurrency}
            </div>
            <p className="text-white/30 text-xs mt-2">Example calculation based on recent market rates. For actual real-time conversions, use our main <Link to="/currency-converter" className="text-emerald-400 hover:underline">Currency Converter</Link>.</p>
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

          <h3 className="text-xl font-semibold text-white mt-8 mb-3">Related guides</h3>
          <ul className="list-disc pl-5 text-white/70 space-y-2">
            <li><Link to="/blog/usd-to-inr-freelancers-live-currency-converter-2026" className="text-blue-400 hover:text-blue-300">Why freelancers need a live currency converter</Link></li>
            <li><Link to="/currency-converter" className="text-blue-400 hover:text-blue-300">Open the live currency converter</Link></li>
            <li><Link to="/methodology" className="text-blue-400 hover:text-blue-300">Review our rate and data methodology</Link></li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
