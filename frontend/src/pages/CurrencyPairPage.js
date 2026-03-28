import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, RefreshCw } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { CURRENCIES_META, CURRENCY_PAIRS, getCurrencyPair, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";

const API = process.env.REACT_APP_BACKEND_URL;

const fmt = (n, dec = 4) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: dec });

// ─── Live rate display (props-driven) ─────────────────────────────────────────
function LiveRateWidget({ from, to, fromMeta, toMeta, rate, loading, refreshed, onRefresh }) {
  const AMOUNTS = [1, 10, 100, 500, 1000];
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6" data-testid="live-rate-widget">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-zinc-400 mb-1">Live Exchange Rate</div>
          {loading ? (
            <div className="h-10 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          ) : rate ? (
            <div className="font-heading text-3xl font-bold text-zinc-900" data-testid="live-rate-value">
              1 {from.toUpperCase()} = {fmt(rate)} {to.toUpperCase()}
            </div>
          ) : (
            <div className="text-zinc-500 text-sm">Rate unavailable — try the full converter</div>
          )}
          <div className="text-xs text-zinc-400 mt-1">Updated: {refreshed.toLocaleTimeString()}</div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 transition-colors"
          title="Refresh rate"
          data-testid="refresh-rate-btn"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {rate && (
        <div className="border-t border-zinc-100 pt-4">
          <div className="text-xs text-zinc-400 uppercase tracking-wide mb-3 font-medium">Quick Conversions</div>
          <div className="grid grid-cols-2 gap-2">
            {AMOUNTS.map(amt => (
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

// ─── Quick Amount Converter Widget ────────────────────────────────────────────
const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000];

function QuickConvertWidget({ rate, fromMeta, toMeta }) {
  const [amount,   setAmount]   = useState("100");
  const [reversed, setReversed] = useState(false);

  const fromM        = reversed ? toMeta   : fromMeta;
  const toM          = reversed ? fromMeta : toMeta;
  const effectiveRate = rate ? (reversed ? 1 / rate : rate) : null;
  const numAmount    = parseFloat(amount) || 0;

  return (
    <section className="mb-8 bg-white rounded-2xl border border-zinc-200 p-6" data-testid="quick-convert-widget">
      <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-600" />
        Quick Amount Converter
      </h2>

      {/* Input row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-200 focus-within:border-emerald-300 transition-all">
          <span className="text-zinc-500 font-semibold text-sm">{fromM.symbol}</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent w-28 text-zinc-900 font-bold text-lg focus:outline-none tabular-nums"
            min="0"
            placeholder="100"
            data-testid="amount-input"
            aria-label={`Amount in ${fromM.code}`}
          />
          <span className="text-zinc-400 text-sm font-medium">{fromM.code}</span>
        </div>
        <button
          onClick={() => setReversed(r => !r)}
          className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-3 py-2.5 transition-colors"
          data-testid="currency-swap-btn"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-90" /> Swap
        </button>
      </div>

      {/* Result */}
      {effectiveRate ? (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-5 mb-6">
          <div className="text-xs text-zinc-500 mb-2">
            {fromM.symbol}{numAmount.toLocaleString()} {fromM.code} =
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <span
              className="font-heading text-3xl font-bold text-zinc-900 tabular-nums"
              data-testid="converted-amount-result"
            >
              {toM.symbol}{fmt(numAmount * effectiveRate, 2)}
            </span>
            <span className="text-zinc-600 font-semibold text-base pb-0.5">{toM.code}</span>
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Rate: 1 {fromM.code} = {fmt(effectiveRate)} {toM.code}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-400 mb-6 animate-pulse">
          Loading live rate…
        </div>
      )}

      {/* Quick reference table — clickable amounts */}
      {effectiveRate && (
        <div>
          <div className="text-xs text-zinc-400 uppercase tracking-wide mb-3 font-medium">Quick Reference — click to convert</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {QUICK_AMOUNTS.map(a => (
              <button
                key={a}
                onClick={() => setAmount(String(a))}
                className="text-left bg-zinc-50 hover:bg-emerald-50 border border-zinc-100 hover:border-emerald-200 rounded-lg px-3 py-2 transition-all group"
                data-testid={`quick-ref-${a}`}
              >
                <div className="text-xs text-zinc-400 group-hover:text-emerald-600 truncate">{fromM.symbol}{a.toLocaleString()}</div>
                <div className="text-sm font-semibold text-zinc-800 truncate">{toM.symbol}{fmt(a * effectiveRate, 2)}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CurrencyPairPage() {
  const { pair } = useParams();

  // Rate state — hoisted so both widgets share one fetch
  const [rate,        setRate]        = useState(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [refreshed,   setRefreshed]   = useState(new Date());

  const pairData = getCurrencyPair(pair);

  const fetchRate = useCallback(async () => {
    if (!pairData) return;
    setRateLoading(true);
    try {
      const res = await axios.get(`${API}/api/currency/convert`, {
        params: { from_currency: pairData.from.toUpperCase(), to_currency: pairData.to.toUpperCase(), amount: 1 },
      });
      setRate(res.data.rate);
      setRefreshed(new Date());
    } catch (e) {
      console.error("Rate fetch error:", e);
    }
    setRateLoading(false);
  }, [pairData]);

  useEffect(() => { fetchRate(); }, [fetchRate]);

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
          <LiveRateWidget
            from={pairData.from}
            to={pairData.to}
            fromMeta={fromMeta}
            toMeta={toMeta}
            rate={rate}
            loading={rateLoading}
            refreshed={refreshed}
            onRefresh={fetchRate}
          />
        </section>

        {/* Quick Amount Converter */}
        <QuickConvertWidget rate={rate} fromMeta={fromMeta} toMeta={toMeta} />

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
