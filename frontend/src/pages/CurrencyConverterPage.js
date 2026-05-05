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
    <div className="min-h-screen bg-[#050816] text-white">
      <SEOHead {...seo} />

      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* H1 */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" /> Live Rates · 160+ Currencies · Free
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Free Currency Converter — Live Exchange Rates
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
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
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Popular Currency Pairs</h2>
          <p className="text-white/60 mb-5 text-sm">Click any pair to open it instantly with live rates.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIRS.map(p => (
              <button
                key={`${p.from}-${p.to}`}
                onClick={() => navigate(`/dashboard?q=Convert 1 ${p.from} to ${p.to}`)}
                className="text-left bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm">{p.from} → {p.to}</div>
                    <div className="text-xs text-white/40 mt-0.5">{p.name}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* pSEO index — Currency pair deep-dive pages */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-white mb-2">Currency Pair Converter Pages</h2>
          <p className="text-white/60 mb-5 text-sm">Dedicated live-rate pages for the most-searched currency pairs — with real-time rates, quick conversion tables, and remote worker tips.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_CURRENCY_PAIR_SLUGS.map(slug => {
              const pair = CURRENCY_PAIRS[slug];
              const from = CURRENCIES_META[pair.from];
              const to   = CURRENCIES_META[pair.to];
              return (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group flex items-center justify-between"
                  data-testid={`currency-pair-link-${slug}`}
                >
                  <div>
                    <div className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">
                      {from.code} to {to.code} — Live Rate
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">{from.name} to {to.name}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Currency Converter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["160+ Currencies", "From USD, EUR, GBP to PKR, AED, NGN, BDT, KWD and 150+ more worldwide currencies."],
              ["Live Exchange Rates", "Rates updated daily from ExchangeRate-API using global forex market data."],
              ["7-Day Trend Chart", "See whether a currency is strengthening or weakening over the last 7 trading days."],
              ["AI Natural Language", 'Just type "convert 500 dollars to euros" — the AI handles the rest automatically.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-white/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-[#0A0F1E] rounded-xl border border-white/10 p-5">
                <h3 className="font-semibold text-white mb-2">{f.q}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial — How Exchange Rates Work */}
        <section className="mb-12 bg-[#0A0F1E] rounded-2xl border border-white/10 p-7">
          <h2 className="font-heading text-2xl font-bold text-white mb-5">The Real Cost of Getting Paid in a Foreign Currency</h2>
          <div className="space-y-4 text-white/70 text-[15px] leading-relaxed">
            <p>
              If you've ever landed a lucrative freelance contract with a foreign client, you know the exact feeling: you calculate your massive payout in your head, wait weeks for the wire transfer to clear, and then stare at your bank account wondering where the rest of your money went. Welcome to the brutal reality of exchange rates and hidden banking fees. We built this tool so you can actually see what your money is worth <em>before</em> the banks take their cut.
            </p>
            <p>
              <strong className="text-white">The "Mid-Market" Myth.</strong> When you Google "1000 USD to EUR," you are seeing the mid-market rate. This is the wholesale price that massive banks use to trade billions of dollars with each other. The harsh truth? You are never going to get that rate. Traditional banks usually mark up the exchange rate by 3% to 5% and then slap a "wire receiving fee" on top of it.
            </p>
            <p>
              <strong className="text-white">Who takes the currency risk?</strong> When you agree to a $5,000/month retainer with a US client, but your rent and groceries are paid in British Pounds or Indian Rupees, you are taking on 100% of the currency risk. If the US dollar drops 5% in value next month, you effectively just took a 5% pay cut, even though you're doing the exact same amount of work. It sucks, but it's the reality of global freelancing. The best way to protect yourself is to add a small buffer to your international rates to absorb those fluctuations.
            </p>
            <p>
              <strong className="text-white">Stop driving yourself crazy staring at charts.</strong> It's incredibly tempting to look at the 7-day trend chart and try to "time the market" so you can withdraw your cash at the exact moment your currency peaks. Don't do it. Pick a specific day of the month—say, the 1st or the 15th—and just routinely convert your funds then. It evens out over the long run.
            </p>
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Popular Pairs Links */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-white mb-4">Popular Currency Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/currency/usd-to-inr", label: "Convert USD to INR with Live Rates", desc: "US Dollar to Indian Rupee" },
              { to: "/currency/usd-to-eur", label: "Convert USD to EUR with Live Rates", desc: "US Dollar to Euro" },
              { to: "/currency/gbp-to-inr", label: "Convert GBP to INR with Live Rates", desc: "British Pound to Indian Rupee" },
              { to: "/currency/usd-to-ngn", label: "Convert USD to NGN with Live Rates", desc: "US Dollar to Nigerian Naira" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group">
                <div className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-white/40">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-white mb-4">Freelancer and transparency resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/freelancer-rate-converter" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">Freelancer Rate Converter</div>
              <div className="text-xs text-white/40">Turn live rates into practical pricing decisions</div>
            </Link>
            <Link to="/data-sources" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">Data Sources</div>
              <div className="text-xs text-white/40">See where exchange-rate data comes from</div>
            </Link>
            <Link to="/methodology" className="bg-[#0A0F1E] rounded-xl border border-white/10 p-4 hover:border-emerald-500/50 transition-all group">
              <div className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">Methodology</div>
              <div className="text-xs text-white/40">Understand limitations, updates, and disclaimers</div>
            </Link>
          </div>
        </section>

        {/* Internal links */}
        <section className="bg-emerald-900/20 rounded-2xl border border-emerald-500/20 p-6">
          <h2 className="font-heading text-lg font-bold text-white mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-[#0A0F1E] rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-blue-400 bg-blue-500/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-white text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-white/50">Live clocks for 25+ cities, updated every second</div>
              </div>
            </Link>
            <Link to="/freelancer-rate-converter" className="bg-[#0A0F1E] rounded-xl p-4 border border-white/10 hover:border-emerald-500/50 transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-emerald-400 bg-emerald-500/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-white text-sm">Freelancer Rate Converter</div>
                <div className="text-xs text-white/50">Convert rates for global clients</div>
              </div>
            </Link>
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
