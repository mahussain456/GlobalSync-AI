import { fireAnalyticsEvent } from "@/lib/analytics";
import { getExchangeRate } from "@/lib/exchangeRates";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, Loader2, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import CurrencySelect from "@/components/CurrencySelect";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const CURRENCIES = [
  // Major / Most Used
  { code: "USD", name: "US Dollar", symbol: "$", region: "Americas" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", region: "Europe" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", region: "Americas" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  // Asia
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "Asia" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "Asia" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨", region: "Asia" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", region: "Asia" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "Asia" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", region: "Asia" },
  { code: "THB", name: "Thai Baht", symbol: "฿", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", region: "Asia" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "Asia" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", region: "Asia" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", region: "Asia" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", region: "Asia" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "so'm", region: "Asia" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K", region: "Asia" },
  // Middle East
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", region: "Middle East" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", region: "Middle East" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", region: "Middle East" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", region: "Middle East" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", region: "Middle East" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", region: "Middle East" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD", region: "Middle East" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", region: "Middle East" },
  // Africa
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD", region: "Africa" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
  // Americas
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", region: "Americas" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "Americas" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", region: "Americas" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", region: "Americas" },
  { code: "COP", name: "Colombian Peso", symbol: "$", region: "Americas" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", region: "Americas" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "Oceania" },
  // Europe
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: "Europe" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", region: "Europe" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", region: "Europe" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", region: "Europe" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", region: "Europe" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", region: "Europe" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", region: "Europe" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", region: "Europe" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", region: "Europe" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", region: "Europe" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", region: "Europe" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-paper  border border-line rounded-xl p-3  text-xs">
      <p className="text-quiet mb-1">{label}</p>
      <p className="font-semibold text-pine">{payload[0]?.value?.toFixed(4)}</p>
    </div>
  );
};

export default function CurrencyConverter({ aiDispatch }) {
  const requestVersion = useRef(0);
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [trend, setTrend] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const invalidateResult = () => {
    requestVersion.current++;
    setResult(null); setTrend(null); setErrorMsg(null);
    setLoading(false); setLoadingTrend(false);
  };

  const handleConvert = async (amt = amount, from = fromCurrency, to = toCurrency) => {
    invalidateResult();
    const numAmt = Number(amt);
    if (String(amt).trim() === '' || !Number.isFinite(numAmt) || numAmt < 0) { setErrorMsg("Enter an amount of zero or more, then convert again."); return; }

    // Normalize codes to uppercase immediately
    const fromUpper = (from || "USD").toUpperCase();
    const toUpper = (to || "EUR").toUpperCase();

    if (fromUpper === toUpper) { toast.warning("Select different currencies"); return; }
    setErrorMsg(null);

    const version = ++requestVersion.current;
    setLoading(true);
    setResult(null);
    try {
      const data = await getExchangeRate(fromUpper, toUpper);
      if (version !== requestVersion.current) return;
      const converted = numAmt * data.rate;
      fireAnalyticsEvent("calculation_succeeded", {tool: "currency", cached: data.isFallback});
      setResult({ from: fromUpper, to: toUpper, amount: numAmt, rate: data.rate,
        converted, date: data.source + " · " + data.date, is_fallback: data.isFallback,
        formatted: `${numAmt.toLocaleString()} ${fromUpper} = ${converted.toLocaleString()} ${toUpper}` });
    } catch (error) { if (version !== requestVersion.current) return; setErrorMsg(error.message); }
    fetchTrend(fromUpper, toUpper, version);
    setLoading(false);
  };

  const fetchTrend = async (from, to, version) => {
    setLoadingTrend(true);
    const fromUpper = (from || "USD").toUpperCase();
    const toUpper = (to || "EUR").toUpperCase();
    try {
      const res = await axios.get(`${API}/currency/trend`, {
        params: { from_currency: fromUpper, to_currency: toUpper },
        timeout: 2500
      });
      if (version === requestVersion.current) setTrend(res.data);
    } catch {
      if (version === requestVersion.current) setTrend({ available: false, message: 'Historical rates are unavailable for this pair right now.' });
    } finally {
      if (version === requestVersion.current) setLoadingTrend(false);
    }
  };

  const handleSwap = () => {
    const nextFrom = (toCurrency || "EUR").toUpperCase();
    const nextTo = (fromCurrency || "USD").toUpperCase();
    setFromCurrency(nextFrom);
    setToCurrency(nextTo);
    handleConvert(amount, nextFrom, nextTo);
  };

  const shareLink = async () => {
    const fromUpper = (fromCurrency || "USD").toUpperCase();
    const toUpper = (toCurrency || "EUR").toUpperCase();
    const q = `Convert ${amount} ${fromUpper} to ${toUpper}`;
    const url = `${window.location.origin}/dashboard?q=${encodeURIComponent(q)}`;
    try { await navigator.clipboard.writeText(url); toast.success("Share link copied!"); }
    catch { toast.error("Clipboard access failed. Please copy the page address manually."); }
  };

  const copyResult = async () => {
    if (!result) return;
    const fromUpper = (result.from || "USD").toUpperCase();
    const toUpper = (result.to || "EUR").toUpperCase();
    const text = `${result.amount.toLocaleString()} ${fromUpper} = ${result.converted >= 1 ? result.converted.toLocaleString("en-US", { maximumFractionDigits: 4 }) : result.converted.toFixed(6)} ${toUpper} (Reference rate: 1 ${fromUpper} = ${result.rate} ${toUpper}; ${result.date}${result.is_fallback ? '; offline cache' : ''}). Transfer provider fees and rates may differ.`;
    try { await navigator.clipboard.writeText(text); toast.success("Result copied!"); }
    catch { toast.error("Clipboard access failed. Select and copy the displayed result."); }
  };

  // Convert automatically on mount so user sees instant result
  useEffect(() => {
    if (aiDispatch?.entities) {
      const { amount: amt, from_currency, to_currency } = aiDispatch.entities;
      const cleanFrom = (from_currency || "USD").toUpperCase();
      const cleanTo = (to_currency || "EUR").toUpperCase();
      setFromCurrency(cleanFrom);
      setToCurrency(cleanTo);
      setAmount(String(amt ?? 1));
      handleConvert(String(amt ?? 1), cleanFrom, cleanTo);
    } else {
      handleConvert(amount, fromCurrency, toCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiDispatch]);

  const fromMeta = CURRENCIES.find(c => c.code === (fromCurrency || "USD").toUpperCase()) || CURRENCIES[0];
  const toMeta = CURRENCIES.find(c => c.code === (toCurrency || "EUR").toUpperCase()) || CURRENCIES[1];
  const isPositive = trend?.available && (trend?.change_percent ?? 0) >= 0;

  return (
    <div className="space-y-5" data-testid="currency-converter">
      {/* Input Card */}
      <div className="bg-surface  rounded-xl border border-line p-5 ">
        <h2 className="font-heading font-semibold text-ink mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pine" /> Currency Converter
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          {/* Amount */}
          <div className="flex-1">
            <label htmlFor="conversion-amount" className="text-xs text-quiet mb-1 block font-medium">Amount</label>
            <input
              id="conversion-amount"
              min="0"
              step="any"
              type="number"
              value={amount}
              onChange={(e) => { invalidateResult(); setAmount(e.target.value); }}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              className="w-full h-12 px-4 rounded-xl border border-line bg-surface text-ink font-medium text-base outline-none focus:border-line400/50 focus:bg-surface transition-all placeholder-gem-mist/50"
              placeholder="100"
              data-testid="currency-amount-input"
            />
          </div>

          {/* From */}
          <div className="flex-1">
            <label className="text-xs text-quiet mb-1 block font-medium">From</label>
            <CurrencySelect
              currencies={CURRENCIES}
              value={fromCurrency}
              onChange={(code) => { invalidateResult(); setFromCurrency(code); }}
              testId="from-currency-select"
            />
          </div>

          {/* Swap */}
          <button
            onClick={handleSwap}
            aria-label="Swap currencies"
            className="h-12 w-12 rounded-xl border border-line bg-surface flex items-center justify-center text-quiet hover:text-ink hover:border-line400/50 hover:bg-surface transition-all self-end shrink-0"
            data-testid="swap-currencies-btn"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          {/* To */}
          <div className="flex-1">
            <label className="text-xs text-quiet mb-1 block font-medium">To</label>
            <CurrencySelect
              currencies={CURRENCIES}
              value={toCurrency}
              onChange={(code) => { invalidateResult(); setToCurrency(code); }}
              testId="to-currency-select"
            />
          </div>

          {/* Convert Button */}
          <Button
            onClick={() => handleConvert()}
            disabled={loading}
            className="h-12 rounded-xl bg-pine text-paper hover:opacity-90 px-6 font-medium flex items-center gap-2 self-end shrink-0 transition-transform active:scale-95  border-0"
            data-testid="convert-btn"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : "Convert"}
          </Button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div role="alert" className="mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/30 text-sm text-orange-800 fade-in-up" data-testid="currency-error">
            {errorMsg.split("Supported currencies:")[0]}
            {errorMsg.includes("Supported currencies:") && (
              <span className="block mt-1 text-xs text-orange-800/70">
                Supported: {errorMsg.split("Supported currencies:")[1]?.trim()}
              </span>
            )}
          </div>
        )}

        {/* Result */}
        {result && typeof result === 'object' && typeof result.converted === 'number' && (
          <div role="status" className="mt-5 p-4 bg-wash rounded-xl border border-line" data-testid="conversion-result-display">
            <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div>
                {result.is_fallback && (
                  <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-800 rounded-full px-2 py-0.5 text-[10px] font-semibold border border-amber-500/30 mb-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                    Offline Cache Rates
                  </div>
                )}
                <div className="text-sm text-quiet mb-1">
                  {(result.amount ?? 0).toLocaleString()} {fromMeta?.name || result.from}
                </div>
                <div className="font-heading text-3xl font-bold text-ink break-all" data-testid="converted-amount">
                  {result.converted >= 1 ? result.converted.toLocaleString("en-US", { maximumFractionDigits: 4 }) : result.converted.toFixed(6)}
                  <span className="text-lg ml-2 text-quiet">{toMeta?.code || result.to}</span>
                </div>
                <div className="text-xs text-quiet mt-1.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  1 {result.from} = {result.rate} {result.to} · {result.date}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {trend?.available && typeof trend.change_percent === 'number' && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-quiet" : "text-orange-800"}`} data-testid="trend-change">
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? "+" : ""}{trend.change_percent.toFixed(2)}%
                    <span className="text-xs font-normal text-quiet ml-0.5">7d</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface border border-line text-quiet hover:text-ink hover:bg-surface text-xs font-medium transition-all"
                    data-testid="copy-result-btn"
                    title="Copy result"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button
                    onClick={shareLink}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gem-gold/20 text-pine hover:bg-gem-gold/30 text-xs font-medium transition-all border border-line"
                    data-testid="share-link-btn"
                    title="Copy shareable link"
                  >
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-quiet">Reference estimate only. GlobalSync does not transfer money. Your provider's rate and fees determine the final amount received.</p>
          </div>
        )}
      </div>

      {/* Trend Chart */}
      {(trend || loadingTrend) && (
        <div className="bg-surface  rounded-xl border border-line p-5  fade-in-up" data-testid="trend-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-ink">7-Day Rate Trend</h3>
            {trend?.available && (
              <div className={`text-sm font-medium flex items-center gap-1 ${isPositive ? "text-quiet" : "text-orange-800"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {fromCurrency}/{toCurrency}
              </div>
            )}
          </div>
          {loadingTrend ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-quiet animate-spin" />
            </div>
          ) : trend?.available === false ? (
            <div className="h-24 flex items-center justify-center text-center" data-testid="trend-unavailable">
              <div>
                <p className="text-sm text-quiet">{trend.message}</p>
                <p className="text-xs text-quiet mt-1">Trend available for major ECB pairs (USD, EUR, GBP, INR…)</p>
              </div>
            </div>
          ) : trend?.trend?.length ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trend.trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1b4d3e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1b4d3e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#526659" }} tickFormatter={(d) => d.slice(5)} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "#526659" }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => v.toFixed(3)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="#1b4d3e" strokeWidth={2} fill="url(#rateGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      )}
    </div>
  );
}
