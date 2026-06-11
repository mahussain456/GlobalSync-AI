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
  const faqs = [
    {
      q: "How do I calculate my freelance hourly rate?",
      a: "To calculate your freelance hourly rate, take your target annual salary, add 30% for expenses and self-employment taxes, and divide by your billable hours (usually 1,000 to 1,500 hours per year, not 2,080)."
    },
    {
      q: "Why shouldn't I just divide a W-2 salary by 2,080 hours?",
      a: "Dividing a $100,000 salary by 2,080 hours gives you $48/hr. However, freelancers must pay for their own health insurance, self-employment tax (15.3% in the US), retirement, software, and hardware. Plus, you won't bill 40 hours every week. A true equivalent freelance rate for $100,000 is closer to $80-$100/hr."
    }
  ];

  const seo = getStaticPageSEO("freelancer-rate-converter", { faqs });

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
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-36 pb-12 w-full">
        <div className="mb-10 text-center">
          <p className="text-gem-gold text-sm font-semibold mb-2">Last updated: May 2026</p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4 text-gem-beige">
            Freelancer Rate Calculator: Hourly, Retainer & Project to W-2 Salary
          </h1>
          <p className="text-gem-beige/60 text-lg">
            Convert hourly rates, project fees, and monthly retainers across 160+ currencies.
          </p>
        </div>
        
        {/* Placeholder UI for Converter */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-8 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="w-full">
              <label className="block text-gem-beige/50 text-xs uppercase tracking-wider mb-2 font-semibold">Rate Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-gem-forest border border-white/10 rounded-xl px-4 py-3 text-gem-beige outline-none focus:border-gem-gold/50 transition-colors" />
            </div>
            <div className="w-full">
              <label className="block text-gem-beige/50 text-xs uppercase tracking-wider mb-2 font-semibold">Base Currency</label>
              <select value={baseCurrency} onChange={e => setBaseCurrency(e.target.value)} className="w-full bg-gem-forest border border-white/10 rounded-xl px-4 py-3 text-gem-beige outline-none focus:border-gem-gold/50 transition-colors">
                {Object.keys(EXCHANGE_RATES).map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gem-beige/50 text-xs uppercase tracking-wider mb-2 font-semibold">Target Currency</label>
              <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)} className="w-full bg-gem-forest border border-white/10 rounded-xl px-4 py-3 text-gem-beige outline-none focus:border-gem-gold/50 transition-colors">
                {Object.keys(EXCHANGE_RATES).map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-gem-beige/50 text-xs uppercase tracking-wider mb-2 font-semibold">Billing Type</label>
              <select value={rateType} onChange={e => setRateType(e.target.value)} className="w-full bg-gem-forest border border-white/10 rounded-xl px-4 py-3 text-gem-beige outline-none focus:border-gem-gold/50 transition-colors">
                <option value="hourly">Hourly Rate</option>
                <option value="project">Fixed Project Fee</option>
                <option value="monthly">Monthly Retainer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-gem-beige/40 text-sm mb-2">Equivalent to approx.</p>
            <div className="text-4xl font-bold text-gem-gold">
              {SYMBOLS[targetCurrency]}{convertedAmount} {targetCurrency}
            </div>
            <p className="text-gem-beige/30 text-xs mt-2">Example calculation based on recent market rates. For actual real-time conversions, use our main <Link to="/currency-converter" className="text-gem-gold hover:underline">Currency Converter</Link>.</p>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-invert max-w-none text-gem-beige/70 leading-relaxed text-[15px] space-y-6">
          <h2 className="text-2xl font-bold text-gem-beige mb-4">How Freelancers Can Quote and Manage International Clients</h2>
          
          <p>
            When working with international clients, determining your rate is about far more than just picking a number—it’s about choosing the right currency and understanding the hidden fees that come with global financial transactions. Fluctuating exchange rates can wipe out 3% to 5% of your invoice value before the money even hits your local bank account. If you aren’t proactive, you are essentially taking an involuntary pay cut while delivering the exact same quality of work.
          </p>

          <p>
            <strong className="text-gem-beige">Understanding the Three Layers of Global Payment Fees.</strong> Many freelancers look at a payment service and think a flat $15 transfer fee is the only cost they have to pay. In reality, your earnings are depleted by three distinct financial layers: the sender's fee, the receiving/intermediary bank fee, and the currency conversion markup. While a payment provider might boast "zero transfer fees," they almost always make their money by baking a heavy markup (often between 1.5% and 4%) into the exchange rate they give you. Always compare their offered rate against the live rate on GlobalSync AI to calculate the true cost of your invoice.
          </p>

          <h3 className="text-xl font-semibold text-gem-beige">Setting Rates: Hourly, Fixed Project, or Monthly Retainers?</h3>
          <p>
            The billing structure you choose can dramatically affect your exposure to currency volatility. Here is how each model performs on the global stage:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-gem-beige">Hourly Rates:</strong> Hourly rates are great for flexible scopes of work, but they expose you to monthly fluctuations. If you invoice monthly in USD while living in Europe, a sudden strengthening of the Euro means your hourly rate is worth less in your home country next month.
            </li>
            <li>
              <strong className="text-gem-beige">Fixed Project Fees:</strong> Fixed fees allow you to charge based on the value you deliver rather than the hours you spend. However, because projects can take months to complete, you are exposed to long-term currency trends. If you quote a $10,000 fixed fee for a 3-month project, make sure to add a 3% currency buffer in your proposal to shield yourself from market shifts.
            </li>
            <li>
              <strong className="text-gem-beige">Monthly Retainers:</strong> Retainers provide predictable recurring income, making them the holy grail for freelancers. To manage currency risk here, include a clause in your contract stating that your rates will be reviewed every 6 months to adjust for extreme exchange rate fluctuations.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gem-beige">Comparing Global Payment Methods for Remote Workers</h3>
          <p>
            Where you tell your client to send the money is just as important as the amount you bill. Let's look at the primary payment methods available to global freelancers today:
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong className="text-gem-beige">Wise (formerly TransferWise):</strong> Highly recommended for global freelancers. Wise offers multi-currency accounts that provide you with local bank details in the US, UK, Europe, Australia, and Canada. Your client pays a local bank transfer (which is cheap or free for them), and you can hold the balance or convert it using the real, live mid-market rate with an transparent, ultra-low conversion fee.
            </li>
            <li>
              <strong className="text-gem-beige">Payoneer:</strong> Similar to Wise, Payoneer provides local receiving accounts and integrates smoothly with freelance platforms like Upwork and Fiverr. While their conversion fees are slightly higher than Wise, they are still vastly superior to traditional retail banks.
            </li>
            <li>
              <strong className="text-gem-beige">Stripe:</strong> Excellent if you want to allow clients to pay your invoices directly via credit or debit card. Stripe is incredibly convenient and professional, but keep in mind they charge a standard 2.9% + $0.30 processing fee, plus an additional 1% to 2% fee if currency conversion is required.
            </li>
            <li>
              <strong className="text-gem-beige">PayPal:</strong> While it is the most widely recognized payment network, PayPal is also the most expensive option for global freelancers. They charge cross-border fees, high merchant receiving fees, and their exchange rates usually include a heavily marked-up conversion margin of 3% to 4%. Use PayPal only as a last resort if your client refuses to use any other method.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gem-beige">Protecting Yourself in Your Freelance Contract</h3>
          <p>
            The ultimate shield against currency risk is a well-drafted contract. Here are three critical rules you should negotiate with your international clients:
          </p>
          <p>
            First, <strong className="text-gem-beige">invoice in the client's local currency if possible, but adjust your pricing.</strong> Clients hate paying foreign currency conversion fees because it complicates their bookkeeping. By invoicing in their currency, you make it extremely easy for them to pay you. However, since you are absorbing the currency risk, increase your quote by 3% to 5% to pay for that convenience.
          </p>
          <p>
            Second, <strong className="text-gem-beige">establish a currency threshold clause.</strong> For long-term retainer clients, add a clause to your contract stating that if the exchange rate between your local currency and their billing currency changes by more than 5% for a sustained period of 30 days, both parties agree to renegotiate the billing rate to restore the original value.
          </p>
          <p>
            Third, <strong className="text-gem-beige">leverage a multi-currency digital wallet.</strong> When a client pays you in USD or EUR, do not immediately convert it to your local currency. Keep the money in a multi-currency account. You can use those stable funds to pay for your software subscriptions (like Adobe, Figma, or GitHub), purchase equipment, or pay international subcontractors directly without ever losing money on double-conversion fees.
          </p>

          <h3 className="text-xl font-semibold text-gem-beige mt-8">Popular Freelancer Conversions</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>USD to INR:</strong> Standard for Indian developers and designers working with US clients.</li>
            <li><strong>USD to PKR:</strong> Common for Pakistani tech talent and agencies.</li>
            <li><strong>EUR to GBP:</strong> Frequent for European and UK cross-border remote work.</li>
            <li><strong>USD to PHP:</strong> Standard for virtual assistants and customer support specialists in the Philippines.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gem-beige mt-12 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6 mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-gem-beige mb-2">{faq.q}</h4>
                <p className="text-gem-beige/70 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-gem-beige mt-8">Related guides</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><Link to="/blog/mid-market-exchange-rate-freelancers" className="text-gem-gold hover:underline">Why freelancers need to understand the mid-market exchange rate</Link></li>
            <li><Link to="/currency-converter" className="text-gem-gold hover:underline">Open the live currency converter</Link></li>
            <li><Link to="/methodology" className="text-gem-gold hover:underline">Review our rate and data methodology</Link></li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
