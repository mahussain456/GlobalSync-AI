import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CURRENCIES_META, CURRENCY_PAIRS, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCurrencyHubSEO } from "@/lib/seo";

const FAQ = [
  { q: "Why is the rate I see here different from what my bank gives me?", a: "Welcome to the world of hidden fees! The rate you see here is the 'mid-market' rate—the true, pure exchange rate that banks use to trade with each other. But when you go to your bank or PayPal to actually convert money, they shave off a percentage (usually 2-4%) as their profit margin. You're never going to get the exact mid-market rate in your bank account, but knowing it helps you realize exactly how much you're being overcharged." },
  { q: "Should I invoice my international clients in my currency or theirs?", a: "This is the million-dollar question for freelancers. If you invoice in their currency (like USD), you are taking on all the 'currency risk'—if the dollar tanks before they pay you, you lose money. If you invoice in your local currency, the client takes the risk. Generally, clients prefer to pay in their native currency, so you'll usually have to eat the risk. My advice? Bake a 3-5% buffer into your pricing to cover sudden rate drops." },
  { q: "What's the best time to convert my money?", a: "It's tempting to watch the charts like a Wall Street day trader, but honestly, you'll drive yourself crazy. If you have a massive invoice, check the 7-day trend chart. If your currency is on a clear downward slide, you might want to wait a few days to convert. Otherwise, just pick a day of the month to do all your conversions consistently." },
  { q: "How accurate are the rates on GlobalSync?", a: "They are real-time and pulled directly from the European Central Bank and ExchangeRate-API. It's the same baseline data that the big financial institutions look at. Just remember, it's the interbank rate, not the retail rate your local bank teller will hand you." },
  { q: "Which currencies do you support?", a: "Pretty much all of them! We track over 160 currencies globally. Whether you're getting paid in USD, Euros, Nigerian Naira, or Pakistani Rupees, you can check the exact conversion value right here." },
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

export default function CurrencyConverterPage() {
  const navigate = useNavigate();
  const seo = getCurrencyHubSEO();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead {...seo} />

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
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">The Real Cost of Getting Paid in a Foreign Currency</h2>
          <div className="space-y-4 text-zinc-600 text-[15px] leading-relaxed">
            <p>
              If you've ever landed a lucrative freelance contract with a foreign client, you know the exact feeling: you calculate your massive payout in your head, wait weeks for the wire transfer to clear, and then stare at your bank account wondering where the rest of your money went. Welcome to the brutal reality of exchange rates and hidden banking fees. We built this tool so you can actually see what your money is worth <em>before</em> the banks take their cut.
            </p>
            <p>
              <strong className="text-zinc-800">The "Mid-Market" Myth.</strong> When you Google "1000 USD to EUR," you are seeing the mid-market rate. This is the wholesale price that massive banks use to trade billions of dollars with each other. The harsh truth? You are never going to get that rate. Traditional banks usually mark up the exchange rate by 3% to 5% and then slap a "wire receiving fee" on top of it. If you're a remote worker, you should be using specialized fintech services like Wise, Revolut, or Payoneer, which usually only mark up the rate by about 0.5% to 1%.
            </p>
            <p>
              <strong className="text-zinc-800">Who takes the currency risk?</strong> When you agree to a $5,000/month retainer with a US client, but your rent and groceries are paid in British Pounds or Indian Rupees, you are taking on 100% of the currency risk. If the US dollar drops 5% in value next month, you effectively just took a 5% pay cut, even though you're doing the exact same amount of work. It sucks, but it's the reality of global freelancing. The best way to protect yourself is to add a small buffer to your international rates to absorb those fluctuations.
            </p>
            <p>
              <strong className="text-zinc-800">Stop driving yourself crazy staring at charts.</strong> It's incredibly tempting to look at the 7-day trend chart and try to "time the market" so you can withdraw your cash at the exact moment your currency peaks. Don't do it. Unless you are converting hundreds of thousands of dollars, the stress isn't worth the extra $12 you might make. Pick a specific day of the month—say, the 1st or the 15th—and just routinely convert your funds then. It evens out over the long run.
            </p>
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Popular Pairs Links */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">Popular Currency Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/currency/usd-to-inr", label: "Convert USD to INR with Live Rates", desc: "US Dollar to Indian Rupee" },
              { to: "/currency/usd-to-eur", label: "Convert USD to EUR with Live Rates", desc: "US Dollar to Euro" },
              { to: "/currency/gbp-to-inr", label: "Convert GBP to INR with Live Rates", desc: "British Pound to Indian Rupee" },
              { to: "/currency/usd-to-ngn", label: "Convert USD to NGN with Live Rates", desc: "US Dollar to Nigerian Naira" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all group">
                <div className="font-semibold text-zinc-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-zinc-400">{link.desc}</div>
              </Link>
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
