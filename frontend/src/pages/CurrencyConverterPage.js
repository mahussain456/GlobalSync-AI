import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CURRENCIES_META, CURRENCY_PAIRS, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";

const FAQ = [
  { q: "What is the current USD to EUR exchange rate?", a: "The USD to EUR exchange rate changes daily based on global markets. GlobalSync AI uses real-time ECB and ExchangeRate-API data to show the latest rate. Open the currency converter to see today's live rate." },
  { q: "How do I convert USD to INR (Indian Rupee)?", a: "1 US Dollar (USD) is approximately 85–93 Indian Rupees (INR) depending on current market rates. Use GlobalSync AI's currency converter to get the exact live rate. Just select USD as the source and INR as the target currency." },
  { q: "How do I convert USD to PKR (Pakistani Rupee)?", a: "1 USD is approximately 278–285 Pakistani Rupees (PKR) based on current exchange rates. GlobalSync AI supports PKR conversion in real time using live market data. Select USD → PKR in the converter." },
  { q: "Are the exchange rates accurate and real-time?", a: "Yes. GlobalSync AI fetches live exchange rates from ExchangeRate-API (updated daily from global forex markets) for all currency conversions. For 7-day trend charts, we use the European Central Bank (ECB) data via the Frankfurter API." },
  { q: "Which currencies does GlobalSync AI support?", a: "GlobalSync AI supports 60+ worldwide currencies including USD, EUR, GBP, JPY, INR, PKR, AED, SAR, NGN, BDT, CNY, CAD, AUD, CHF, KWD, and many more. See the full list in the currency converter." },
  { q: "What is the difference between buy and sell exchange rates?", a: "Banks use a 'buy' rate when they buy foreign currency from you, and a 'sell' rate when they sell it to you. GlobalSync AI shows mid-market rates (the midpoint between buy and sell), which are the fairest reference rates. Actual bank or remittance rates may differ slightly." },
  { q: "What is a mid-market exchange rate?", a: "The mid-market rate (also called the interbank rate or 'real rate') is the midpoint between the buy and sell prices of a currency in the global forex market. Banks and exchange services add a margin on top of this rate — their fee. GlobalSync AI always displays the mid-market rate as a neutral benchmark. Specialist services like Wise or Revolut typically charge 0.5–1.5% above mid-market; traditional banks charge 2–4%. On a $10,000 transaction, this difference can mean $150–$350." },
  { q: "When is the best time to convert currency?", a: "Exchange rates fluctuate continuously during forex market hours (Monday–Friday, 24 hours). Rates tend to be most liquid during the London–New York session overlap (roughly 8 AM–12 PM EST), where spreads are tightest. For large conversions, monitoring the 7-day trend chart helps you see whether a currency is strengthening or weakening. Converting when a currency is trending in your favor can meaningfully improve your outcome over days or weeks." },
  { q: "Which currencies does GlobalSync AI not support?", a: "GlobalSync AI covers 160+ currencies via ExchangeRate-API, including virtually all freely traded currencies worldwide. A very small number of restricted or closed currencies — such as the North Korean Won — are unavailable as they have no free-market exchange rate. For any currency, search by ISO code (e.g., USD, EUR, NGN, INR) or country name in the full converter." },
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

      <SiteNav />

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

        {/* Ad — below hero */}
        <AdBanner slot="leaderboard" className="mb-8" />

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

        {/* pSEO index — Currency pair deep-dive pages */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-2">Currency Pair Converter Pages</h2>
          <p className="text-zinc-500 mb-5 text-sm">Dedicated live-rate pages for the most-searched currency pairs — with real-time rates, quick conversion tables, and remote worker tips.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_CURRENCY_PAIR_SLUGS.map(slug => {
              const pair = CURRENCY_PAIRS[slug];
              const from = CURRENCIES_META[pair.from];
              const to   = CURRENCIES_META[pair.to];
              return (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group flex items-center justify-between"
                  data-testid={`currency-pair-link-${slug}`}
                >
                  <div>
                    <div className="font-semibold text-zinc-800 text-sm group-hover:text-emerald-600 transition-colors">
                      {from.code} to {to.code} — Live Rate
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">{from.name} to {to.name}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
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

        {/* Editorial — How Exchange Rates Work */}
        <section className="mb-12 bg-white rounded-2xl border border-zinc-200 p-7">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">How Exchange Rates Work: A Guide for Remote Workers and Freelancers</h2>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
            <p>
              <strong className="text-zinc-800">What sets an exchange rate?</strong> Exchange rates are determined in the global foreign exchange (forex) market — the largest financial market in the world, trading over $7 trillion daily. Banks, central banks, corporations, and institutional investors constantly buy and sell currencies, and the rate at any moment reflects their collective assessment of each currency's value. Key drivers include central bank interest rates (higher rates attract foreign capital, strengthening the currency), inflation differentials, trade balances, and geopolitical stability. A single Federal Reserve interest rate announcement can shift USD/EUR by 0.5–1% in minutes.
            </p>
            <p>
              <strong className="text-zinc-800">The mid-market rate vs. what you actually pay.</strong> The rate shown in GlobalSync AI (and on Google) is the mid-market rate — the true interbank rate that major banks exchange at with each other. Individual users never receive exactly this rate. Traditional banks typically charge 2–4% above mid-market for consumer currency exchange or transfers. Specialist services like Wise, Revolut, and Remitly typically charge 0.5–1.5%. On a $10,000 international transfer, the difference is $150–$350. Always evaluate the total amount you receive in the destination currency — not just the advertised rate — when comparing services.
            </p>
            <p>
              <strong className="text-zinc-800">Currency risk for freelancers and remote workers.</strong> If your income is denominated in a different currency from your expenses, you carry exchange rate risk. An Indian freelancer invoicing US clients in USD earns more rupees when the dollar is strong — and fewer when it weakens. A 5% USD/INR shift over a quarter changes the real value of every invoice you send. Strategies to manage this risk include: invoicing in your home currency (shifting rate risk to the client), converting on a consistent schedule (per invoice or monthly) rather than holding large currency balances, or using a "currency clause" in contracts that adjusts rates if the exchange rate moves more than 3–5% from the invoice date.
            </p>
            <p>
              <strong className="text-zinc-800">Reading the 7-day trend chart.</strong> The trend chart on each currency pair page uses data from the European Central Bank (ECB) via the Frankfurter API — one of the most reliable sources of historical forex rates. A rising chart line means the base currency is strengthening (e.g., 1 USD buys more EUR than last week). A falling line means it's weakening. The percentage badge shows the total change over the 7-day period. This short-term view is useful for spotting momentum and deciding whether to convert now or wait — though past trends do not guarantee future movements.
            </p>
            <p>
              <strong className="text-zinc-800">Covered currencies and common use cases.</strong> GlobalSync AI's converter covers 160+ currencies via ExchangeRate-API, including all major pairs (USD/EUR, USD/GBP, USD/JPY), high-volume emerging market pairs (USD/INR, USD/NGN, USD/BRL, USD/PKR), and Gulf pegged currencies (USD/AED at 3.6725, USD/SAR at 3.75). Common use cases include freelance invoice conversion, international salary benchmarking, remittance planning, import/export cost calculations, and travel budgeting. For any currency — search by ISO code or country name. No account or signup is ever required.
            </p>
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Internal links */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
          <h2 className="font-heading text-lg font-bold text-zinc-900 mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-600 bg-blue-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-zinc-400">Live clocks for 25+ cities, updated every second</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="bg-white rounded-xl p-4 border border-zinc-200 hover:border-orange-300 hover:shadow-sm transition-all flex items-center gap-3">
              <Users className="w-9 h-9 text-orange-500 bg-orange-100 rounded-lg p-2" />
              <div>
                <div className="font-medium text-zinc-800 text-sm">Find the Best Meeting Time Across Time Zones</div>
                <div className="text-xs text-zinc-400">Business hours overlap for up to 5 cities</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
