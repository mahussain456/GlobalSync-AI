import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  TrendingUp, ArrowRight, ShieldCheck, Copy, Calculator, Info, Check, RefreshCw, AlertCircle
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { toast } from "sonner";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const PLATFORMS = {
  wise: {
    name: "Wise (TransferWise)",
    feePercent: 0.4,
    feeFlat: 0,
    markupPercent: 0.0, // uses mid-market
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    pros: ["Uses real mid-market exchange rate", "Ultra-low transparent fee", "Fast transfer speeds"],
    cons: ["Both sender and receiver need Wise accounts for optimal rates"]
  },
  stripe: {
    name: "Stripe Invoices",
    feePercent: 2.9,
    feeFlat: 0.30,
    markupPercent: 2.0, // standard Stripe fx conversion markup
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    pros: ["Clients can pay directly with card", "Highly professional invoice UX", "Solid automation integrations"],
    cons: ["High base fee + standard double conversion fx margin"]
  },
  payoneer: {
    name: "Payoneer",
    feePercent: 2.0,
    feeFlat: 0,
    markupPercent: 1.5,
    color: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    pros: ["Local receiving accounts in USD, EUR, GBP", "Direct billing triggers", "Great platform integrations"],
    cons: ["Annual fees apply", "High conversion markups on small volumes"]
  },
  paypal: {
    name: "PayPal (Merchant Invoice)",
    feePercent: 4.4,
    feeFlat: 0.49,
    markupPercent: 4.0, // standard retail fx markup
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    pros: ["Accepted globally by almost all clients", "Easy disputes protection"],
    cons: ["Extremely high fee structure", "Padded hidden exchange rate margins"]
  }
};

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR", "PHP", "NGN", "CAD", "AUD", "AED", "ZAR"];

export default function InvoiceIntelligencePage() {
  const [amount, setAmount] = useState(1500);
  const [billingCurrency, setBillingCurrency] = useState("USD");
  const [payoutCurrency, setPayoutCurrency] = useState("INR");
  const [selectedPlatform, setSelectedPlatform] = useState("paypal");
  const [customFeeBuffer, setCustomFeeBuffer] = useState(0);

  const [liveRate, setLiveRate] = useState(1);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [copiedClause, setCopiedClause] = useState(false);

  // Fetch live exchange rate
  useEffect(() => {
    const fetchRate = async () => {
      if (billingCurrency === payoutCurrency) {
        setLiveRate(1);
        return;
      }
      setIsLoadingRate(true);
      try {
        const res = await axios.get(`${API}/currency/convert`, {
          params: { amount: 1, from_currency: billingCurrency, to_currency: payoutCurrency }
        });
        setLiveRate(res.data.rate || 1);
      } catch (err) {
        console.warn("Failed to fetch live rate, falling back to static approximations.");
        // Simple static fallbacks
        const approximations = {
          "USD-INR": 83.5, "USD-PKR": 278.5, "USD-EUR": 0.92, "USD-GBP": 0.79,
          "EUR-INR": 90.4, "GBP-INR": 105.8, "USD-PHP": 58.2, "USD-NGN": 1450
        };
        const key = `${billingCurrency}-${payoutCurrency}`;
        const reverseKey = `${payoutCurrency}-${billingCurrency}`;
        if (approximations[key]) setLiveRate(approximations[key]);
        else if (approximations[reverseKey]) setLiveRate(1 / approximations[reverseKey]);
        else setLiveRate(1);
      } finally {
        setIsLoadingRate(false);
      }
    };
    fetchRate();
  }, [billingCurrency, payoutCurrency]);

  const platform = PLATFORMS[selectedPlatform];

  // Calculations
  const rawMidMarketValue = amount * liveRate;
  
  // Platform fees
  const platformFeeAmountBilling = (amount * (platform.feePercent / 100)) + platform.feeFlat;
  const platformFeeAmountPayout = platformFeeAmountBilling * liveRate;
  
  // Exchange rate markup losses (deducted from target exchange rate)
  const actualRateUsed = liveRate * (1 - (platform.markupPercent / 100));
  const payoutAfterMarkupBeforeFee = amount * actualRateUsed;
  const payoutAfterAll = payoutAfterMarkupBeforeFee - platformFeeAmountPayout;
  
  // Total losses in payout currency
  const totalLosesPayout = rawMidMarketValue - payoutAfterAll;
  const totalLosesBilling = totalLosesPayout / liveRate;
  const totalLosesPercent = (totalLosesBilling / amount) * 100;

  // Fair invoice buffer calculation
  // We want: payout = target_amount.
  // Equation: (Invoice * (1 - markup) * LiveRate) - (Invoice * Fee% * LiveRate) - FlatFee*LiveRate = target_amount * LiveRate
  // Invoice * LiveRate * [ (1 - markup) - Fee% ] = (target_amount + FlatFee) * LiveRate
  // Invoice = (target_amount + FlatFee) / [ 1 - markup - Fee% ]
  const feePercentDecimal = platform.feePercent / 100;
  const markupPercentDecimal = platform.markupPercent / 100;
  const divisor = 1 - markupPercentDecimal - feePercentDecimal;
  
  let recommendedInvoiceAmount = amount;
  if (divisor > 0) {
    recommendedInvoiceAmount = (amount + platform.feeFlat) / divisor;
  }
  const fairBufferPercent = ((recommendedInvoiceAmount - amount) / amount) * 100;

  // Clause Generator
  const contractClause = `Invoices are issued in ${billingCurrency}. Client covers all payment processing and wire transfer fees. If payment is completed in ${payoutCurrency}, conversion uses the live mid-market exchange rate (retrieved from globalsync-ai.com) on the invoice date. Freelancer retainer rates are subject to adjustment if exchange rates move by more than 5% for a sustained period of 30 days.`;

  const copyClauseToClipboard = () => {
    navigator.clipboard.writeText(contractClause).then(() => {
      setCopiedClause(true);
      toast.success("Contract billing clause copied to clipboard!");
      setTimeout(() => setCopiedClause(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative flex flex-col justify-between">
      <SEOHead
        rawTitle="Freelancer Invoice Intelligence: Platform Payout & Fee Calculator"
        description="Verify net payouts, analyze exchange rate markups, and calculate invoice protection buffers for Stripe, Wise, Payoneer, and PayPal."
        canonical="/invoice-intelligence"
        keywords="freelancer invoice calculator, payment fees, currency markup, paypal fees, stripe fx rate, wise mid-market rate"
      />

      {/* Luxury Background Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10" />
        <div 
          className="absolute inset-0 opacity-[0.10] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        />
      </div>

      <SiteNav />

      <main className="flex-1 max-w-6xl mx-auto px-6 pt-36 pb-12 w-full z-10 space-y-8">
        {/* Title */}
        <header className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-semibold border border-gem-gold/25 mb-4">
            <Calculator className="w-3.5 h-3.5" /> Solopreneur Finance
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-4">
            Freelancer Invoice Intelligence
          </h1>
          <p className="text-lg text-gem-sage">
            Calculate payment processor fees, identify hidden exchange rate markups, and compute the fair buffer to charge global clients.
          </p>
        </header>

        {/* Inputs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column Left: Input Panel */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-6">
            <h2 className="font-heading font-bold text-gem-beige text-lg flex items-center gap-2 border-b border-white/5 pb-4">
              <Calculator className="w-5 h-5 text-gem-gold" /> Parameters
            </h2>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-gem-beige/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Invoice Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full h-11 px-4 bg-gem-forest border border-white/10 rounded-xl text-gem-beige outline-none focus:border-gem-gold/45 text-sm font-semibold"
                  />
                  <span className="absolute right-4 top-3 text-xs text-gem-sage font-bold">{billingCurrency}</span>
                </div>
              </div>

              {/* Currency Select */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Billing Currency</label>
                  <select
                    value={billingCurrency}
                    onChange={(e) => setBillingCurrency(e.target.value)}
                    className="w-full h-11 px-3 bg-gem-forest border border-white/10 rounded-xl text-gem-beige outline-none focus:border-gem-gold/45 text-xs font-bold cursor-pointer"
                  >
                    {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-2 block uppercase tracking-wider">Your Payout Currency</label>
                  <select
                    value={payoutCurrency}
                    onChange={(e) => setPayoutCurrency(e.target.value)}
                    className="w-full h-11 px-3 bg-gem-forest border border-white/10 rounded-xl text-gem-beige outline-none focus:border-gem-gold/45 text-xs font-bold cursor-pointer"
                  >
                    {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Exchange Rate Status Indicator */}
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5 text-xs">
                <span className="text-gem-sage font-semibold">Live Market Exchange Rate:</span>
                {isLoadingRate ? (
                  <RefreshCw className="w-3.5 h-3.5 text-gem-gold animate-spin" />
                ) : (
                  <span className="text-gem-gold font-bold">
                    1 {billingCurrency} = {liveRate.toFixed(4)} {payoutCurrency}
                  </span>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-gem-beige/60 text-xs font-semibold mb-2.5 block uppercase tracking-wider">Payment Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(PLATFORMS).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlatform(key)}
                      className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedPlatform === key 
                          ? "border-gem-gold bg-gem-gold/10 text-gem-gold shadow-md"
                          : "border-white/10 bg-white/5 text-gem-sage hover:border-white/20"
                      }`}
                    >
                      {PLATFORMS[key].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column Right: calculations outputs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Payout Breakdown glass card */}
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-5">
              <h2 className="font-heading font-bold text-gem-beige text-lg flex items-center gap-2 border-b border-white/5 pb-4">
                <TrendingUp className="w-5 h-5 text-gem-gold" /> Net Payout Analysis
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="text-[10px] text-gem-sage/75 font-bold uppercase tracking-wider">Gross Mid-Market Value</div>
                  <div className="font-heading font-extrabold text-2xl text-gem-beige mt-1.5">
                    {rawMidMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gem-sage font-medium">{payoutCurrency}</span>
                  </div>
                  <p className="text-[10px] text-gem-sage/50 mt-1">If zero conversion markups or processor fees applied.</p>
                </div>

                <div className="bg-gem-gold/10 rounded-2xl p-4 border border-gem-gold/25">
                  <div className="text-[10px] text-gem-gold font-bold uppercase tracking-wider">Estimated Net Payout</div>
                  <div className="font-heading font-extrabold text-2xl text-gem-gold mt-1.5">
                    {payoutAfterAll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-gem-forest font-bold bg-gem-gold px-1 py-0.5 rounded">{payoutCurrency}</span>
                  </div>
                  <p className="text-[10px] text-gem-gold/60 mt-1">Net amount expected to land in local account.</p>
                </div>
              </div>

              {/* Losses Breakdown Table */}
              <div className="border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white/5 text-gem-sage font-bold border-b border-white/5">
                    <tr>
                      <th className="p-3">Fee Category</th>
                      <th className="p-3">Platform Cost</th>
                      <th className="p-3 text-right">Value Loss ({payoutCurrency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold text-gem-beige/90">
                    <tr>
                      <td className="p-3 flex items-center gap-1.5">Platform Transaction Fee</td>
                      <td className="p-3">{platform.feePercent}% {platform.feeFlat > 0 ? `+ ${platform.feeFlat} ${billingCurrency}` : ""}</td>
                      <td className="p-3 text-right text-orange-400">-{platformFeeAmountPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Hidden Exchange Rate Markup</td>
                      <td className="p-3">{platform.markupPercent}%</td>
                      <td className="p-3 text-right text-orange-400">-{((rawMidMarketValue - payoutAfterMarkupBeforeFee)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="bg-white/5 font-extrabold text-gem-beige">
                      <td className="p-3">Total Transaction Loss</td>
                      <td className="p-3">{totalLosesPercent.toFixed(2)}% of Gross</td>
                      <td className="p-3 text-right text-red-400">-{totalLosesPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fair Invoice Buffer Panel */}
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-4">
              <h3 className="font-heading font-bold text-gem-beige text-md flex items-center gap-1.5 text-gem-gold">
                <ShieldCheck className="w-5 h-5 text-gem-gold shrink-0" /> Recommended Invoice Buffer
              </h3>
              <p className="text-xs text-gem-sage leading-relaxed">
                To counter platform fees and rate markups, adjust your invoice gross amount. By billing the amount below, you guarantee your net home currency yield matches your target.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div>
                  <div className="text-[10px] text-gem-sage/60 uppercase font-bold tracking-wider">Invoice Billing Target</div>
                  <div className="text-xl font-heading font-bold text-gem-beige mt-1">
                    {recommendedInvoiceAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {billingCurrency}
                  </div>
                </div>
                <div className="bg-gem-gold/25 border border-gem-gold/40 px-4 py-2 rounded-xl text-center shrink-0 self-start sm:self-center">
                  <div className="text-[9px] uppercase font-bold text-gem-gold tracking-wider">Required Markup Buffer</div>
                  <div className="text-lg font-bold text-gem-beige mt-0.5">+{fairBufferPercent.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Smart Clause generator */}
            <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-heading font-bold text-gem-beige text-md flex items-center gap-1.5">
                  Smart Contract Payment Clause
                </h3>
                <button
                  onClick={copyClauseToClipboard}
                  className="text-xs font-bold text-gem-gold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedClause ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedClause ? "Copied" : "Copy Clause"}
                </button>
              </div>
              <p className="text-xs text-gem-sage leading-relaxed">
                Append this legal protection clause directly to your master services agreement (MSA) or proposal terms to protect your income margins:
              </p>
              <div className="p-4 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-sage font-mono leading-relaxed select-all">
                "{contractClause}"
              </div>
            </div>

          </div>

        </div>

      </main>

      <SiteFooter />
    </div>
  );
}
