import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { CURRENCIES_META, CURRENCY_PAIRS, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCurrencyHubSEO } from "@/lib/seo";
import CurrencyConverter from "@/components/CurrencyConverter";



const PAIRS = [
  { from: "USD", to: "EUR", name: "US Dollar to Euro" },
  { from: "USD", to: "INR", name: "US Dollar to Indian Rupee" },
  { from: "USD", to: "GBP", name: "US Dollar to British Pound" },
  { from: "USD", to: "PKR", name: "US Dollar to Pakistani Rupee" },
  { from: "USD", to: "AED", name: "US Dollar to UAE Dirham" },
  { from: "EUR", to: "GBP", name: "Euro to British Pound" },
  { from: "GBP", to: "INR", name: "British Pound to Indian Rupee" },
  { from: "USD", to: "PHP", name: "US Dollar to Philippine Peso" },
  { from: "USD", to: "NGN", name: "US Dollar to Nigerian Naira" }
];

const FAQ = [
  { q: "How often are the exchange rates updated?", a: "The converter uses ExchangeRate-API reference data. Each result shows its source and provider date. If the provider is unavailable, a dated offline snapshot may be shown and is labeled as cached." },
  { q: "What is the mid-market exchange rate?", a: "The mid-market rate is the midpoint between buy and sell prices. Our reference estimate is not a transfer quote: your payment provider determines the rate, fees and final amount received." },
  { q: "How many currencies do you support?", a: "We support over 160 global currencies, including USD, EUR, GBP, INR, PKR, and NGN, covering almost every circulating currency in the world." },
  { q: "Are there any hidden fees for using the currency converter?", a: "No. GlobalSync AI's currency converter is 100% free. We don't take a cut, and we don't charge any subscription or conversion fees." }
];

export default function CurrencyConverterPage() {
  const navigate = useNavigate();
  const seo = getCurrencyHubSEO({ faqs: FAQ });
  const [selectedPair, setSelectedPair] = useState("");

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-8">
        {/* H1 */}
        <header className="mb-10 text-center md:text-left"><h1 className="font-heading text-4xl md:text-5xl font-bold text-ink leading-tight mb-4">
            Currency Converter
          </h1>
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-pine rounded-full px-3 py-1 text-xs font-medium mb-4 border border-line">
            <TrendingUp className="w-3.5 h-3.5" /> Reference Rates · 160+ Currencies · Free
          </div>

          <p className="text-lg text-quiet max-w-2xl leading-relaxed">
            Estimate amounts across 160+ currencies. See the source and date with each result, then check your payment provider for the final transfer rate and fees.
          </p>
          <div className="mt-8">
            <CurrencyConverter />
          </div>
        </header>

        {/* Ad — below hero */}
        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Popular pairs */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-ink mb-2">Popular Currency Pairs</h2>
          <p className="text-quiet mb-5 text-sm">Click any pair to open its rate guide and available historical chart.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAIRS.map(p => {
              const slug = `${p.from.toLowerCase()}-to-${p.to.toLowerCase()}`;
              return (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="text-left bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group block"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-ink text-sm">{p.from} → {p.to}</div>
                      <div className="text-xs text-quiet mt-0.5">{p.name}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-quiet group-hover:text-pine transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Currency Pair Dropdown Selector */}
        <section className="mb-12 bg-surface  rounded-xl border border-line p-6">
          <h2 className="font-heading text-2xl font-bold text-ink mb-2">Currency Pair Converter Pages</h2>
          <p className="text-quiet mb-6 text-sm">
            Select a dedicated guide for popular international currency pairs to view reference rates, available historical charts, and remote worker invoicing tips.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl">
            <div className="relative w-full">
              <select
                value={selectedPair}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedPair(val);
                  if (val) {
                    navigate(`/currency/${val}`);
                  }
                }}
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-line bg-paper text-ink text-sm outline-none focus:border-line transition-all appearance-none cursor-pointer font-medium"
                aria-label="Choose a currency pair guide"
                data-testid="currency-pair-select"
              >
                <option value="" className="text-quiet bg-paper">-- Choose a currency-to-currency guide --</option>
                {ALL_CURRENCY_PAIR_SLUGS.map(slug => {
                  const pair = CURRENCY_PAIRS[slug];
                  const from = CURRENCIES_META[pair.from];
                  const to   = CURRENCIES_META[pair.to];
                  return (
                    <option key={slug} value={slug} className="text-ink bg-paper font-medium">
                      {from.code} to {to.code} Exchange Rate ({from.name} → {to.name})
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-pine">
                ▼
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12 bg-surface  rounded-xl border border-line p-7">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6">Currency Converter Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["160+ Currencies", "From USD, EUR, GBP to PKR, AED, NGN, BDT, KWD and 150+ more worldwide currencies."],
              ["Dated Reference Rates", "Each result identifies ExchangeRate-API and its provider date, with cached rates clearly labeled."],
              ["Historical Context", "See recent history when available for your currency pair. Unavailable history is labeled clearly."],
              ["AI Natural Language", 'Just type "convert 500 dollars to euros" — the AI handles the rest automatically.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-pine shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink text-sm mb-0.5">{title}</h3>
                  <p className="text-sm text-quiet">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(f => (
              <div key={f.q} className="bg-surface  rounded-xl border border-line p-5">
                <h3 className="font-semibold text-ink mb-2">{f.q}</h3>
                <p className="text-sm text-quiet leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 border-t border-line pt-8">
          <h2 className="font-heading text-2xl font-bold mb-5">Understand your conversion estimate</h2>
          <div className="space-y-4 text-quiet leading-relaxed">
            <p><strong className="text-ink">Check the date.</strong> Exchange rates change. The date beside your result tells you when the provider updated the data; a cached result is a saved snapshot.</p>
            <p><strong className="text-ink">Check the final quote.</strong> GlobalSync calculates a reference estimate and does not transfer money. Your payment provider sets the actual rate and any fees.</p>
            <p><strong className="text-ink">Keep the context.</strong> Copying a result includes its source, date and cache status so you can share an estimate without losing that information.</p>
            <Link to="/data-sources" className="text-pine underline underline-offset-4">Read about our data sources</Link>
          </div>
        </section>

        {/* Ad — before internal links */}
        <AdBanner slot="rectangle" className="mb-8" />

        {/* Popular Pairs Links */}
        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-ink mb-4">Popular Currency Conversions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/currency/usd-to-inr", label: "Convert USD to INR with Reference Rates", desc: "US Dollar to Indian Rupee" },
              { to: "/currency/usd-to-eur", label: "Convert USD to EUR with Reference Rates", desc: "US Dollar to Euro" },
              { to: "/currency/gbp-to-inr", label: "Convert GBP to INR with Reference Rates", desc: "British Pound to Indian Rupee" },
              { to: "/currency/usd-to-ngn", label: "Convert USD to NGN with Reference Rates", desc: "US Dollar to Nigerian Naira" },
            ].map(link => (
              <Link key={link.to} to={link.to} className="bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group">
                <div className="font-semibold text-ink text-sm mb-1 group-hover:text-pine transition-colors leading-tight">{link.label}</div>
                <div className="text-xs text-quiet">{link.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-xl font-bold text-ink mb-4">Freelancer and transparency resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/freelancer-rate-converter" className="bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group">
              <div className="font-semibold text-ink text-sm mb-1 group-hover:text-pine transition-colors">Freelancer Rate Converter</div>
              <div className="text-xs text-quiet">Estimate pricing across currencies</div>
            </Link>
            <Link to="/data-sources" className="bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group">
              <div className="font-semibold text-ink text-sm mb-1 group-hover:text-pine transition-colors">Data Sources</div>
              <div className="text-xs text-quiet">See where exchange-rate data comes from</div>
            </Link>
            <Link to="/methodology" className="bg-surface  rounded-xl border border-line p-4 hover:border-line transition-all group">
              <div className="font-semibold text-ink text-sm mb-1 group-hover:text-pine transition-colors">Methodology</div>
              <div className="text-xs text-quiet">Understand limitations, updates, and disclaimers</div>
            </Link>
          </div>
        </section>


        {/* Internal links */}
        <section className="bg-wash rounded-2xl border border-line p-6">
          <h2 className="font-heading text-lg font-bold text-ink mb-4">More GlobalSync AI Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/time-zone-converter" className="bg-surface  rounded-xl p-4 border border-line hover:border-line transition-all flex items-center gap-3">
              <Clock className="w-9 h-9 text-pine bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-ink text-sm">Free World Time Zone Converter</div>
                <div className="text-xs text-quiet">Live clocks for 25+ cities, updated every second</div>
              </div>
            </Link>
            <Link to="/freelancer-rate-converter" className="bg-surface  rounded-xl p-4 border border-line hover:border-line transition-all flex items-center gap-3">
              <TrendingUp className="w-9 h-9 text-pine bg-gem-gold/20 rounded-lg p-2" />
              <div>
                <div className="font-medium text-ink text-sm">Freelancer Rate Converter</div>
                <div className="text-xs text-quiet">Convert rates for global clients</div>
              </div>
            </Link>
          </div>
        </section>
        {/* ── ALL CURRENCY PAIR GUIDES — static links for SEO crawlability ── */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-bold text-ink mb-2">All Currency Pair Converter Guides</h2>
          <p className="text-quiet text-sm mb-5">Browse all {ALL_CURRENCY_PAIR_SLUGS.length} dedicated currency converter pages — live rates, 7-day trend charts, and freelancer invoicing tips for every pair.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ALL_CURRENCY_PAIR_SLUGS.map(slug => {
              const pair = CURRENCY_PAIRS[slug];
              const from = CURRENCIES_META[pair.from];
              const to   = CURRENCIES_META[pair.to];
              if (!from || !to) return null;
              return (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="bg-surface rounded-xl border border-line p-3 hover:border-line transition-all group"
                >
                  <div className="font-medium text-quiet text-xs group-hover:text-pine transition-colors leading-tight">
                    {from.code} → {to.code}
                  </div>
                  <div className="text-[10px] text-quiet mt-0.5">{from.name} to {to.name}</div>
                </Link>
              );
            })}
          </div>
        </section>
      </article>
      <SiteFooter />
    </div>
  );
}
