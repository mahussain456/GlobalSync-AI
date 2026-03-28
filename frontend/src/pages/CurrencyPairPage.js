import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { CURRENCIES_META, CURRENCY_PAIRS, getCurrencyPair, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";

const API = process.env.REACT_APP_BACKEND_URL;

// ─── Live rate widget ─────────────────────────────────────────────────────────
function LiveRateWidget({ from, to, fromMeta, toMeta }) {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amounts] = useState([1, 10, 100, 500, 1000]);
  const [refreshed, setRefreshed] = useState(new Date());

  const fetchRate = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/currency/convert`, { params: { from: from.toUpperCase(), to: to.toUpperCase(), amount: 1 } });
      setRate(res.data.rate || res.data.converted_amount);
      setRefreshed(new Date());
    } catch (e) {
      console.error("Rate fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRate(); }, []);

  const fmt = (n, decimals = 4) => Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals > 2 ? 2 : 2, maximumFractionDigits: decimals });

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6">
      {/* Rate display */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-zinc-400 mb-1">Live Exchange Rate</div>
          {loading ? (
            <div className="h-10 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          ) : rate ? (
            <div className="font-heading text-3xl font-bold text-zinc-900">
              1 {from.toUpperCase()} = {fmt(rate)} {to.toUpperCase()}
            </div>
          ) : (
            <div className="text-zinc-500 text-sm">Rate unavailable — try the full converter</div>
          )}
          <div className="text-xs text-zinc-400 mt-1">Updated: {refreshed.toLocaleTimeString()}</div>
        </div>
        <button onClick={fetchRate} className="p-2 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors" title="Refresh rate">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Quick conversion table */}
      {rate && (
        <div className="border-t border-zinc-100 pt-4">
          <div className="text-xs text-zinc-400 uppercase tracking-wide mb-3 font-medium">Quick Conversions</div>
          <div className="grid grid-cols-2 gap-2">
            {amounts.map(amt => (
              <div key={amt} className="flex items-center justify-between text-sm bg-zinc-50 rounded-lg px-3 py-2">
                <span className="text-zinc-500">{fromMeta.symbol}{amt.toLocaleString()}</span>
                <span className="font-semibold text-zinc-800">{toMeta.symbol}{fmt(amt * rate, 2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CurrencyPairPage() {
  const { pair } = useParams();
  const pairData = getCurrencyPair(pair);

  if (!pairData) return <Navigate to="/currency-converter" replace />;

  const fromMeta = CURRENCIES_META[pairData.from];
  const toMeta   = CURRENCIES_META[pairData.to];

  const relatedPairs = pairData.related
    .map(slug => ({ slug, pair: CURRENCY_PAIRS[slug] }))
    .filter(r => r.pair && CURRENCIES_META[r.pair.from] && CURRENCIES_META[r.pair.to])
    .map(r => ({ slug: r.slug, from: CURRENCIES_META[r.pair.from], to: CURRENCIES_META[r.pair.to] }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${pairData.from.toUpperCase()} to ${pairData.to.toUpperCase()} Live Exchange Rate`,
    "url": `https://globalsync-ai.com/currency/${pair}`,
    "description": `Live ${pairData.from.toUpperCase()} to ${pairData.to.toUpperCase()} exchange rate converter. Real-time rates, quick conversion table, and remote worker tips.`,
    "applicationCategory": "FinanceApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title={`${fromMeta.code} to ${toMeta.code} Live Exchange Rate — ${fromMeta.name} to ${toMeta.name}`}
        description={`Live ${fromMeta.code} to ${toMeta.code} exchange rate converter. Get real-time ${fromMeta.name} to ${toMeta.name} rates, quick conversion table, and tips for remote workers. Free, no signup.`}
        canonical={`/currency/${pair}`}
        keywords={`${fromMeta.code} to ${toMeta.code}, ${fromMeta.name} to ${toMeta.name}, live exchange rate, ${pairData.from} ${pairData.to} converter, real-time currency converter, ${fromMeta.code} ${toMeta.code} rate today, free currency converter`}
        structuredData={structuredData}
      />
      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <span>/</span>
          <Link to="/currency-converter" className="hover:text-zinc-600">Currency Converter</Link>
          <span>/</span>
          <span className="text-zinc-600">{fromMeta.code} to {toMeta.code}</span>
        </nav>

        {/* H1 */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium mb-4 border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5" /> Live Rate · 160+ Currencies · Free
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
            {fromMeta.code} to {toMeta.code} Live Exchange Rate — {fromMeta.name} to {toMeta.name}
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-2xl">
            Real-time {fromMeta.name} to {toMeta.name} exchange rate. Free converter with live data — no account required.
          </p>
        </header>

        {/* Live rate widget */}
        <section className="mb-8" aria-label="Live exchange rate">
          <LiveRateWidget from={pairData.from} to={pairData.to} fromMeta={fromMeta} toMeta={toMeta} />
        </section>

        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Context */}
        <section className="mb-8 bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">
            About {fromMeta.code}/{toMeta.code} — {fromMeta.name} and {toMeta.name}
          </h2>
          <p className="text-zinc-600 leading-relaxed mb-4">{pairData.context}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[fromMeta, toMeta].map(c => (
              <div key={c.code} className="bg-zinc-50 rounded-xl p-4">
                <div className="font-semibold text-zinc-800 text-sm mb-1">{c.code} — {c.name}</div>
                <div className="text-xs text-zinc-500">{c.description}.</div>
              </div>
            ))}
          </div>
        </section>

        {/* Remote worker tip */}
        <section className="mb-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-3">
            {fromMeta.code} to {toMeta.code} for Remote Workers &amp; Freelancers
          </h2>
          <p className="text-zinc-700 leading-relaxed">{pairData.remoteTip}</p>
          <Link
            to="/currency-converter"
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Open full currency converter <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-5">
            Frequently Asked Questions — {fromMeta.code} to {toMeta.code}
          </h2>
          <div className="space-y-4">
            {pairData.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5">
                <h3 className="font-semibold text-zinc-900 mb-2">{faq.q}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full tool CTA */}
        <section className="mb-8 bg-zinc-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold mb-1">Convert any amount or currency</h2>
            <p className="text-zinc-400 text-sm">160+ currencies, 7-day trend chart, and AI natural language input.</p>
          </div>
          <Link
            to="/currency-converter"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors"
          >
            Open converter <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <AdBanner slot="rectangle" className="mb-8" />

        {/* Related pairs */}
        {relatedPairs.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">Related Currency Pairs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPairs.map(({ slug, from, to }) => (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="bg-white rounded-xl border border-zinc-200 p-4 hover:shadow-sm hover:border-emerald-200 transition-all group"
                >
                  <div className="font-semibold text-zinc-800 text-sm group-hover:text-emerald-600 transition-colors">
                    {from.code} → {to.code}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">{from.name} to {to.name}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
