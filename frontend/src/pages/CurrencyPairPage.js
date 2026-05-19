import { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { TrendingUp, ArrowRight, RefreshCw, TrendingDown } from "lucide-react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdBanner from "@/components/AdBanner";
import { CURRENCIES_META, CURRENCY_PAIRS, getCurrencyPair, ALL_CURRENCY_PAIR_SLUGS } from "@/data/programmaticData";
import { getCurrencyPairSEO } from "@/lib/seo";

const API = process.env.REACT_APP_BACKEND_URL || "";

const fmt = (n, dec = 4) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: dec });

// ─── Live rate display (props-driven) ─────────────────────────────────────────
function LiveRateWidget({ from, to, fromMeta, toMeta, rate, loading, refreshed, onRefresh, isFallback }) {
  const AMOUNTS = [1, 10, 100, 500, 1000];
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6" data-testid="live-rate-widget">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-zinc-400 mb-1">Live Exchange Rate</div>
          {isFallback && (
            <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 rounded-full px-2 py-0.5 text-[10px] font-semibold border border-amber-500/30 mb-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Offline Cache Rates
            </div>
          )}
          {loading ? (
            <div className="h-10 w-48 bg-white/10 rounded-lg animate-pulse" />
          ) : rate ? (
            <div className="font-heading text-3xl font-bold text-gem-beige" data-testid="live-rate-value">
              1 {from.toUpperCase()} = {fmt(rate)} {to.toUpperCase()}
            </div>
          ) : (
            <div className="text-gem-sage text-sm">Rate unavailable — try the full converter</div>
          )}
          <div className="text-xs text-zinc-400 mt-1">Updated: {refreshed.toLocaleTimeString()}</div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-full border border-white/10 text-zinc-400 hover:text-gem-mist hover:border-zinc-300 transition-colors"
          title="Refresh rate"
          data-testid="refresh-rate-btn"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {rate && (
        <div className="border-t border-white/5 pt-4">
          <div className="text-xs text-zinc-400 uppercase tracking-wide mb-3 font-medium">Quick Conversions</div>
          <div className="grid grid-cols-2 gap-2">
            {AMOUNTS.map(amt => (
              <div key={amt} className="flex items-center justify-between text-sm bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gem-sage">{fromMeta.symbol}{amt.toLocaleString()}</span>
                <span className="font-semibold text-gem-beige/90">{toMeta.symbol}{fmt(amt * rate, 2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 7-Day Trend Chart ────────────────────────────────────────────────────────
function TrendChart({ from, to, fromMeta, toMeta }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/currency/trend`, {
        params: { from_currency: from.toUpperCase(), to_currency: to.toUpperCase() },
      })
      .then(res => { setData(res.data); })
      .catch(e => console.error("Trend fetch error:", e))
      .finally(() => setLoading(false));
  }, [from, to]);

  if (loading)
    return <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6 h-52 animate-pulse" />;
  if (!data || !data.available || !data.trend?.length) return null;

  const isPositive = data.change_percent >= 0;
  const lineColor  = isPositive ? "#059669" : "#dc2626";
  const minY = data.min_rate * 0.998;
  const maxY = data.max_rate * 1.002;

  const chartData = data.trend.map(d => ({
    date: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    rate: d.rate,
  }));

  const gradientId = `trendGrad-${from}-${to}`;

  return (
    <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6" data-testid="trend-chart">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-xl font-bold text-gem-beige">7-Day Rate Trend</h2>
        <div
          className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${
            isPositive
              ? "bg-white/5 text-gem-gold border-gem-gold/30"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
          data-testid="trend-change-badge"
        >
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {isPositive ? "+" : ""}{data.change_percent.toFixed(2)}% this week
        </div>
      </div>

      {/* Chart */}
      <div className="h-52" data-testid="trend-chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={lineColor} stopOpacity={0.18} />
                <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minY, maxY]}
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => Number(v).toFixed(2)}
              width={56}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", border: "1px solid #e4e4e7", fontSize: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              formatter={val => [`${toMeta.symbol}${Number(val).toFixed(4)}`, `1 ${fromMeta.code}`]}
              labelStyle={{ color: "#71717a", marginBottom: "2px" }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: lineColor, stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Min / Source / Max footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-zinc-400">
        <span>Low: {toMeta.symbol}{data.min_rate.toFixed(4)}</span>
        <span>Source: European Central Bank</span>
        <span>High: {toMeta.symbol}{data.max_rate.toFixed(4)}</span>
      </div>
    </section>
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
    <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6" data-testid="quick-convert-widget">
      <h2 className="font-heading text-xl font-bold text-gem-beige mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gem-gold" />
        Quick Amount Converter
      </h2>

      {/* Input row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-gem-gold/20 focus-within:border-gem-gold/30 transition-all">
          <span className="text-gem-sage font-semibold text-sm">{fromM.symbol}</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent w-28 text-gem-beige font-bold text-lg focus:outline-none tabular-nums"
            min="0"
            placeholder="100"
            data-testid="amount-input"
            aria-label={`Amount in ${fromM.code}`}
          />
          <span className="text-zinc-400 text-sm font-medium">{fromM.code}</span>
        </div>
        <button
          onClick={() => setReversed(r => !r)}
          className="flex items-center gap-1.5 text-xs font-medium text-gem-gold hover:text-gem-gold/80 bg-white/5 hover:bg-white/10 border border-gem-gold/30 rounded-xl px-3 py-2.5 transition-colors"
          data-testid="currency-swap-btn"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-90" /> Swap
        </button>
      </div>

      {/* Result */}
      {effectiveRate ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
          <div className="text-xs text-gem-sage mb-2">
            {fromM.symbol}{numAmount.toLocaleString()} {fromM.code} =
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <span
              className="font-heading text-3xl font-bold text-gem-beige tabular-nums"
              data-testid="converted-amount-result"
            >
              {toM.symbol}{fmt(numAmount * effectiveRate, 2)}
            </span>
            <span className="text-gem-mist font-semibold text-base pb-0.5">{toM.code}</span>
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Rate: 1 {fromM.code} = {fmt(effectiveRate)} {toM.code}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-zinc-400 mb-6 animate-pulse">
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
                className="text-left bg-white/5 hover:bg-white/5 border border-white/5 hover:border-gem-gold/30 rounded-lg px-3 py-2 transition-all group"
                data-testid={`quick-ref-${a}`}
              >
                <div className="text-xs text-zinc-400 group-hover:text-gem-gold truncate">{fromM.symbol}{a.toLocaleString()}</div>
                <div className="text-sm font-semibold text-gem-beige/90 truncate">{toM.symbol}{fmt(a * effectiveRate, 2)}</div>
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

  const [fromSlug, toSlug] = (pair || "").split("-to-");
  const fromMeta = CURRENCIES_META[fromSlug];
  const toMeta = CURRENCIES_META[toSlug];

  // Rate state — hoisted so both widgets share one fetch
  const [rate,        setRate]        = useState(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [refreshed,   setRefreshed]   = useState(new Date());
  const [isFallback,  setIsFallback]  = useState(false);

  const pairData = getCurrencyPair(pair);

  const fetchRate = useCallback(async () => {
    if (!fromMeta || !toMeta) return;
    setRateLoading(true);

    const isLocalhostBackend = API.includes("localhost") || API.includes("127.0.0.1");
    const shouldTryBackend = !isLocalhostBackend || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (shouldTryBackend) {
      try {
        const res = await axios.get(`${API}/api/currency/convert`, {
          params: { from_currency: fromMeta.code, to_currency: toMeta.code, amount: 1 },
          timeout: 2500
        });
        if (res.data && !res.data.is_fallback) {
          setRate(res.data.rate);
          setRefreshed(new Date());
          setIsFallback(false);
          setRateLoading(false);
          return;
        } else {
          console.warn("Backend returned fallback/offline rates. Attempting direct browser live rates fetch.");
        }
      } catch (e) {
        console.warn("Backend rate fetch error, attempting direct live rates fetch:", e);
      }
    } else {
      console.info("Skipping backend call for currency pair page (localhost backend in non-localhost browser)");
    }

    let rates = null;
    let rateVal = null;
    let fetchSuccess = false;

    // Try ExchangeRate-API
    try {
      const directRes = await axios.get(`https://open.exchangerate-api.com/v6/latest/${fromMeta.code}`, {
        timeout: 3000
      });
      rates = directRes.data?.rates || {};
      rateVal = rates[toMeta.code];
      if (rateVal !== undefined && rateVal !== null) {
        setRate(Number(rateVal.toFixed(6)));
        setRefreshed(new Date());
        setIsFallback(false);
        fetchSuccess = true;
      }
    } catch (directErr) {
      console.warn("Direct live rates fetch failed, trying Frankfurter", directErr);
    }

    // Try Frankfurter as secondary fallback
    if (!fetchSuccess) {
      try {
        const frankRes = await axios.get(`https://api.frankfurter.app/latest?from=${fromMeta.code}`, {
          timeout: 3000
        });
        rates = frankRes.data?.rates || {};
        if (fromMeta.code === toMeta.code) {
          rateVal = 1.0;
        } else {
          rateVal = rates[toMeta.code];
        }
        if (rateVal !== undefined && rateVal !== null) {
          setRate(Number(rateVal.toFixed(6)));
          setRefreshed(new Date());
          setIsFallback(false);
          fetchSuccess = true;
        }
      } catch (frankErr) {
        console.warn("Frankfurter fetch failed", frankErr);
      }
    }

    if (fetchSuccess) {
      setIsFallback(false);
    } else {
      const fallbackRates = {
        USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 156.2, CHF: 0.91, CNY: 7.24, CAD: 1.36, AUD: 1.50,
        INR: 83.3, PKR: 278.5, BDT: 117.2, LKR: 300.5, NPR: 133.3, SGD: 1.35, HKD: 7.81, KRW: 1360.0,
        MYR: 4.69, THB: 36.3, IDR: 16000.0, PHP: 58.0, VND: 25400.0, TWD: 32.2, KZT: 443.0, UZS: 12600.0,
        MMK: 2100.0, AED: 3.67, SAR: 3.75, QAR: 3.64, KWD: 0.31, BHD: 0.38, OMR: 0.38, JOD: 0.71,
        ILS: 3.68, ZAR: 18.2, NGN: 1450.0, EGP: 47.2, KES: 130.0, GHS: 14.5, MAD: 10.0, ETB: 57.0,
        TZS: 2600.0, MXN: 16.7, BRL: 5.15, ARS: 885.0, CLP: 910.0, COP: 3850.0, PEN: 3.72, NZD: 1.63,
        SEK: 10.6, NOK: 10.7, DKK: 6.87, PLN: 3.92, CZK: 22.8, HUF: 355.0, RON: 4.58, BGN: 1.80,
        TRY: 32.2, RUB: 91.0, UAH: 39.5, ISK: 138.0
      };
      const rFrom = fallbackRates[fromMeta.code] || 1.0;
      const rTo = fallbackRates[toMeta.code] || 1.0;
      setRate(Number((rTo / rFrom).toFixed(6)));
      setRefreshed(new Date());
      setIsFallback(true);
    }

    setRateLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairData]);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  if (!fromMeta || !toMeta) return <Navigate to="/currency-converter" replace />;

  const relatedPairs = (pairData?.related || [])
    .map(slug => ({ slug, pair: CURRENCY_PAIRS[slug] }))
    .filter(r => r.pair && CURRENCIES_META[r.pair.from] && CURRENCIES_META[r.pair.to])
    .map(r => ({ slug: r.slug, from: CURRENCIES_META[r.pair.from], to: CURRENCIES_META[r.pair.to] }));

  const seo = getCurrencyPairSEO({ fromMeta, toMeta, pair, pairData });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...seo} />
      <SiteNav />

      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-400 mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-gem-mist">Home</Link>
          <span>/</span>
          <Link to="/currency-converter" className="hover:text-gem-mist">Currency Converter</Link>
          <span>/</span>
          <span className="text-gem-mist">{fromMeta.code} to {toMeta.code}</span>
        </nav>

        {/* H1 */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-4 border border-gem-gold/20">
            <TrendingUp className="w-3.5 h-3.5" /> Live Rate · 160+ Currencies · Free
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gem-beige mb-3">
            {fromMeta.code} to {toMeta.code} Live Exchange Rate — {fromMeta.name} to {toMeta.name}
          </h1>
          <p className="text-gem-sage text-lg leading-relaxed max-w-2xl">
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
            isFallback={isFallback}
          />
        </section>

        {/* 7-day trend chart */}
        <TrendChart from={pairData.from} to={pairData.to} fromMeta={fromMeta} toMeta={toMeta} />

        {/* Quick Amount Converter */}
        <QuickConvertWidget rate={rate} fromMeta={fromMeta} toMeta={toMeta} />

        <AdBanner slot="leaderboard" className="mb-8" />

        {/* Context */}
        <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
            About the {fromMeta.code} to {toMeta.code} Exchange Rate
          </h2>
          <p className="text-gem-mist leading-relaxed mb-4">{pairData.context}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[fromMeta, toMeta].map(c => (
              <div key={c.code} className="bg-white/5 rounded-xl p-4">
                <div className="font-semibold text-gem-beige/90 text-sm mb-1">{c.code} — {c.name}</div>
                <div className="text-xs text-gem-sage">{c.description}.</div>
              </div>
            ))}
          </div>
        </section>

        {/* How this rate affects you — editorial */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">
            How the {fromMeta.code}/{toMeta.code} Rate Affects Your Income
          </h2>
          <div className="space-y-3 text-gem-mist text-sm leading-relaxed">
            <p>
              The {fromMeta.name} to {toMeta.name} exchange rate is more than a financial statistic — for anyone who earns, spends, or invoices across these two currencies, it directly determines their real-world purchasing power. A 5% shift in {fromMeta.code}/{toMeta.code} over a quarter changes the value of every invoice, salary payment, or remittance sent between these currencies.
            </p>
            <p>
              <strong className="text-gem-beige/90">The mid-market rate vs. what you actually receive.</strong> The rate shown above is the mid-market rate — the true benchmark used between major banks. When you convert through a bank or payment app, the provider adds a margin: traditional banks typically charge 2–4% above mid-market; specialist services like Wise, Revolut, or Remitly charge 0.5–1.5%. On a {fromMeta.symbol}10,000 transaction, that difference is {toMeta.symbol}500–{toMeta.symbol}2,500 in {toMeta.code}. Always compare the total amount you receive, not just the headline rate.
            </p>
            <p>
              <strong className="text-gem-beige/90">Timing your conversions.</strong> The 7-day trend chart above shows recent momentum in the {fromMeta.code}/{toMeta.code} pair. A rising chart means {fromMeta.code} is buying more {toMeta.code} than last week. A falling chart means the opposite. For large or predictable conversions, monitoring this trend can meaningfully improve your outcome — though short-term trends do not predict future movements. Convert when rates are favorable rather than on a rigid fixed schedule.
            </p>
          </div>
        </section>

        {/* Context */}
        {pairData && (
          <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
              {fromMeta.code} to {toMeta.code} Exchange Rate Explained
            </h2>
            <p className="text-gem-mist leading-relaxed mb-6">{pairData.context}</p>

            <h3 className="font-semibold text-gem-beige mb-2 mt-4 text-base">Key Drivers for {fromMeta.code}/{toMeta.code}</h3>
            <p className="text-gem-mist text-sm leading-relaxed mb-4">
              <strong className="text-gem-beige/90">Interest rate differentials.</strong> If the central bank for {fromMeta.code} raises interest rates faster than the bank for {toMeta.code}, {fromMeta.code} often strengthens as it attracts more capital seeking higher yields. Conversely, when rates fall, the currency tends to weaken.
            </p>
            <p className="text-gem-mist text-sm leading-relaxed mb-4">
              <strong className="text-gem-beige/90">Economic performance.</strong> Strong GDP growth, low unemployment, and high consumer spending in the country using {fromMeta.code} generally lead to a stronger currency relative to {toMeta.code}.
            </p>
            <p className="text-gem-mist text-sm leading-relaxed">
              <strong className="text-gem-beige/90">Managing currency risk in contracts.</strong> If you invoice in {fromMeta.code} but your expenses are in {toMeta.code}, you carry exchange rate risk on every outstanding invoice. Strategies to reduce this risk include: adding a currency-adjustment clause to contracts (price revises if the rate moves more than 3–5% from the invoice date), invoicing in {toMeta.code} to shift risk to the client, or using a multi-currency account to hold {fromMeta.code} until a favorable rate appears.
            </p>
          </section>
        )}

        {/* Remote worker tip */}
        {pairData && (
          <section className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-3">
              Who Needs This Conversion?
            </h2>
            <p className="text-gem-mist leading-relaxed">{pairData.remoteTip}</p>
            <Link
              to="/currency-converter"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-gem-gold hover:text-gem-gold/80 transition-colors"
            >
              Convert any of 160+ currencies with live exchange rates <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* Blog cross-link */}
        <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gem-beige/90 mb-0.5">Which currency should you invoice in?</p>
            <p className="text-xs text-gem-sage">USD, EUR, or GBP — a practical guide for freelancers working internationally.</p>
          </div>
          <Link to="/blog/best-currency-to-invoice-freelancers-usd-eur-gbp"
            className="shrink-0 text-sm font-semibold text-gem-gold hover:text-gem-gold/80 transition-colors whitespace-nowrap flex items-center gap-1">
            Read guide: Invoicing in USD, EUR, or GBP <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        {/* FAQ */}
        {pairData?.faqs && (
          <section className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-gem-beige mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {pairData.faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-gem-beige p-5">
                  <h3 className="font-semibold text-gem-beige mb-2 flex gap-2">
                    <span className="text-gem-gold font-black">Q.</span> {faq.q}
                  </h3>
                  <p className="text-gem-mist text-sm leading-relaxed flex gap-2">
                    <span className="text-gem-gold font-black">A.</span> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full tool CTA */}
        <section className="mb-8 bg-white/5 backdrop-blur-xl rounded-[28px] text-gem-beige border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold mb-1">Convert any amount or currency</h2>
            <p className="text-zinc-400 text-sm">160+ currencies, 7-day trend charts, and AI natural language input — free, no account needed.</p>
          </div>
          <Link
            to="/currency-converter"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gem-beige font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Open live currency converter <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <AdBanner slot="rectangle" className="mb-8" />

        {/* Related pairs */}
        {relatedPairs.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-xl font-bold text-gem-beige mb-4">Related Currency Pairs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPairs.map(({ slug, from, to }) => (
                <Link
                  key={slug}
                  to={`/currency/${slug}`}
                  className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 hover:shadow-sm hover:border-gem-gold/30 transition-all group"
                >
                  <div className="font-semibold text-gem-beige/90 text-sm group-hover:text-gem-gold transition-colors">
                    Check {from.code} to {to.code} Exchange Rate
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
