import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const FAQ = [
  { q: "What is the current USD to EUR exchange rate?", a: "The USD to EUR exchange rate changes daily based on global markets. GlobalSync AI uses real-time ECB and ExchangeRate-API data to show the latest rate. Open the currency converter to see today's live rate." },
  { q: "How do I convert USD to INR (Indian Rupee)?", a: "1 US Dollar (USD) is approximately 85–93 Indian Rupees (INR) depending on current market rates. Use GlobalSync AI's currency converter to get the exact live rate. Just select USD as the source and INR as the target currency." },
  { q: "How do I convert USD to PKR (Pakistani Rupee)?", a: "1 USD is approximately 278–285 Pakistani Rupees (PKR) based on current exchange rates. GlobalSync AI supports PKR conversion in real time using live market data. Select USD → PKR in the converter." },
  { q: "Are the exchange rates accurate and real-time?", a: "Yes. GlobalSync AI fetches live exchange rates from ExchangeRate-API (updated daily from global forex markets) for all currency conversions. For 7-day trend charts, we use the European Central Bank (ECB) data via the Frankfurter API." },
  { q: "Which currencies does GlobalSync AI support?", a: "GlobalSync AI supports 60+ worldwide currencies including USD, EUR, GBP, JPY, INR, PKR, AED, SAR, NGN, BDT, CNY, CAD, AUD, CHF, KWD, and many more. See the full list in the currency converter." },
  { q: "What is the difference between buy and sell exchange rates?", a: "Banks use a 'buy' rate when they buy foreign currency from you, and a 'sell' rate when they sell it to you. GlobalSync AI shows mid-market rates (the midpoint between buy and sell), which are the fairest reference rates. Actual bank or remittance rates may differ slightly." },
];

const PAIRS = [
  { from: "USD", to: "EUR", name: "US Dollar to Euro" },
  { from: "USD", to: "INR", name: "US Dollar to Indian Rupee" },
  { from: "USD", to: "GBP", name: "US Dollar to British Pound" },
  { from: "USD", to: "PKR", name: "US Dollar to Pakistani Rupee" },
  { from: "USD", to: "AED", name: "US Dollar to UAE Dirham" },
  { from: "EUR", to: "GBP", name: "Euro to British Pound" },
  { from: "GBP", to: "INR", name: "British Pound to Indian Rupee" },
  { from: "USD", to: "JPY", name: "US Dollar to Japanese Yen" },
  { from: "USD", to: "SAR", name: "US Dollar to Saudi Riyal" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "GlobalSync AI Currency Converter",
      "url": "https://globalsync-ai.com/currency-converter",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Free currency converter with live exchange rates for 160+ currencies worldwide. USD to EUR, INR, GBP, AED, PKR and more."
    },
    {
      "@type": "FAQPage",
      "mainEntity": FAQ.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

export default function CurrencyConverterPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Currency Converter — Live Exchange Rates for 160+ Currencies"
        description="Convert between 160+ currencies with live exchange rates. USD to INR, EUR, GBP, AED, PKR and more. Free, real-time, no registration required."
        canonical="/currency-converter"
        keywords="currency converter, USD to EUR, USD to INR, USD to PKR, live exchange rates, free currency converter, AED converter, SAR converter, GBP to INR, forex rates"
        structuredData={structuredData}
      />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <Link to="/"><img src="/logo.png" alt="GlobalSync AI" className="h-12 w-auto" /></Link>
        <ol className="flex items-center gap-2 text-sm text-zinc-400" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <Link to="/" className="hover:text-teal-600 transition-colors" itemProp="item"><span itemProp="name">Home</span></Link>
            <meta itemProp="position" content="1" />
          </li>
          <span>/</span>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span className="text-zinc-600 font-medium" itemProp="name">Currency Converter</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5" /> Live Rates · 160+ Currencies · Free
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-4">
            Free Currency Converter — Live Exchange Rates
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Convert between 160+ currencies with real-time exchange rates. USD to EUR, USD to INR, USD to PKR, AED, SAR, NGN and more — updated daily from global forex markets.
          </p>
          <button
            onClick={() => navigate("/dashboard?q=Convert 100 USD to EUR")}
            className="mt-6 btn-gradient rounded-xl px-6 py-3 text-sm font-semibold flex items-center gap-2 inline-flex"
            data-testid="currency-cta-btn"
          >
            <TrendingUp className="w-4 h-4" /> Open Currency Converter <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        {/* Popular pairs */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-2">Popular Currency Pairs</h2>
          <p className="text-zinc-500 mb-5 text-sm">Click any pair to open it instantly with live rates.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIRS.map(p => (
              <button
                key={`${p.from}-${p.to}`}
                onClick={() => navigate(`/dashboard?q=Convert 1 ${p.from} to ${p.to}`)}
                className="text-left bg-white rounded-xl border border-zinc-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-zinc-800 text-sm">{p.from} → {p.to}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{p.name}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Currency Converter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["160+ Currencies", "From USD, EUR, GBP to PKR, AED, NGN, BDT, KWD and 150+ more worldwide currencies."],
              ["Live Exchange Rates", "Rates updated daily from ExchangeRate-API using global forex market data."],
              ["7-Day Trend Chart", "See whether a currency is strengthening or weakening over the last 7 trading days."],
              ["AI Natural Language", 'Just type "convert 500 dollars to euros" — the AI handles the rest automatically.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-zinc-800 text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-white rounded-xl border border-zinc-200 p-5">
                <h3 className="font-semibold text-zinc-800 mb-2">{f.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-600 bg-blue-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Time Zone Converter</div>
                <div className="text-xs text-zinc-400">Live clocks for 25+ cities</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-orange-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Users className="w-9 h-9 text-orange-500 bg-orange-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Meeting Planner</div>
                <div className="text-xs text-zinc-400">Find business hour overlaps</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
