import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="font-semibold text-zinc-900">{payload[0]?.value?.toFixed(4)}</p>
    </div>
  );
};

export default function CurrencyConverter({ aiDispatch }) {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(false);

  const handleConvert = async (amt = amount, from = fromCurrency, to = toCurrency) => {
    const numAmt = parseFloat(amt);
    if (!numAmt || isNaN(numAmt)) { toast.warning("Enter a valid amount"); return; }
    if (from === to) { toast.warning("Select different currencies"); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.get(`${API}/currency/convert`, { params: { amount: numAmt, from_currency: from, to_currency: to } });
      setResult(res.data);
      fetchTrend(from, to);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrend = async (from = fromCurrency, to = toCurrency) => {
    setLoadingTrend(true);
    try {
      const res = await axios.get(`${API}/currency/trend`, { params: { from_currency: from, to_currency: to } });
      setTrend(res.data);
    } catch {
      // trend is optional
    } finally {
      setLoadingTrend(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setTrend(null);
  };

  useEffect(() => {
    if (!aiDispatch?.entities) return;
    const { amount: amt, from_currency, to_currency } = aiDispatch.entities;
    if (from_currency) setFromCurrency(from_currency);
    if (to_currency) setToCurrency(to_currency);
    if (amt) setAmount(String(amt));
    setTimeout(() => handleConvert(String(amt || 1), from_currency || fromCurrency, to_currency || toCurrency), 100);
  }, [aiDispatch]);

  const fromMeta = CURRENCIES.find(c => c.code === fromCurrency);
  const toMeta = CURRENCIES.find(c => c.code === toCurrency);
  const isPositive = trend?.change_percent >= 0;

  return (
    <div className="space-y-5" data-testid="currency-converter">
      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <h2 className="font-heading font-semibold text-zinc-900 mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" /> Currency Converter
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          {/* Amount */}
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-zinc-900 font-medium text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="100"
              data-testid="currency-amount-input"
            />
          </div>

          {/* From */}
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block font-medium">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => { setFromCurrency(e.target.value); setResult(null); }}
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 cursor-pointer bg-white"
              data-testid="from-currency-select"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <button
            onClick={handleSwap}
            className="h-12 w-12 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-blue-600 hover:border-blue-300 transition-all self-end shrink-0"
            data-testid="swap-currencies-btn"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          {/* To */}
          <div className="flex-1">
            <label className="text-xs text-zinc-500 mb-1 block font-medium">To</label>
            <select
              value={toCurrency}
              onChange={(e) => { setToCurrency(e.target.value); setResult(null); }}
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 cursor-pointer bg-white"
              data-testid="to-currency-select"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {/* Convert Button */}
          <Button
            onClick={() => handleConvert()}
            disabled={loading}
            className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 font-medium flex items-center gap-2 self-end shrink-0 transition-transform active:scale-95"
            data-testid="convert-btn"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : "Convert"}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 fade-in-up" data-testid="conversion-result-display">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-zinc-500 mb-1">
                  {result.amount.toLocaleString()} {fromMeta?.name || result.from}
                </div>
                <div className="font-heading text-3xl font-bold text-zinc-900" data-testid="converted-amount">
                  {result.converted >= 1 ? result.converted.toLocaleString("en-US", { maximumFractionDigits: 4 }) : result.converted.toFixed(6)}
                  <span className="text-lg ml-2 text-zinc-500">{toMeta?.code || result.to}</span>
                </div>
                <div className="text-xs text-zinc-400 mt-1.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  1 {result.from} = {result.rate} {result.to} · Updated {result.date}
                </div>
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`} data-testid="trend-change">
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {isPositive ? "+" : ""}{trend.change_percent}%
                  <span className="text-xs font-normal text-zinc-400 ml-0.5">7d</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trend Chart */}
      {(trend || loadingTrend) && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 fade-in-up" data-testid="trend-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-zinc-900">7-Day Rate Trend</h3>
            {trend && (
              <div className={`text-sm font-medium flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {fromCurrency}/{toCurrency}
              </div>
            )}
          </div>
          {loadingTrend ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
            </div>
          ) : trend?.trend?.length ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trend.trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#a1a1aa" }}
                  tickFormatter={(d) => d.slice(5)}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 10, fill: "#a1a1aa" }}
                  axisLine={false} tickLine={false}
                  width={55}
                  tickFormatter={(v) => v.toFixed(3)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2} fill="url(#rateGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      )}
    </div>
  );
}
