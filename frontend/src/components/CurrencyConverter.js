import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, Loader2, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import CurrencySelect from "@/components/CurrencySelect";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

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
    <div className="bg-[#0B2E33]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-[#93B1B5] mb-1">{label}</p>
      <p className="font-semibold text-cyan-400">{payload[0]?.value?.toFixed(4)}</p>
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
  const [errorMsg, setErrorMsg] = useState(null);

  const handleConvert = async (amt = amount, from = fromCurrency, to = toCurrency) => {
    const numAmt = parseFloat(amt);
    if (!numAmt || isNaN(numAmt)) { toast.warning("Enter a valid amount"); return; }
    if (from === to) { toast.warning("Select different currencies"); return; }
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API}/currency/convert`, { params: { amount: numAmt, from_currency: from, to_currency: to } });
      setResult(res.data);
      fetchTrend(from, to);
    } catch (err) {
      const msg = err.response?.data?.detail || "Conversion failed. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
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

  const shareLink = () => {
    const q = `Convert ${amount} ${fromCurrency} to ${toCurrency}`;
    const url = `${window.location.origin}/dashboard?q=${encodeURIComponent(q)}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Share link copied!"));
  };

  const copyResult = () => {
    if (!result) return;
    const text = `${result.amount.toLocaleString()} ${result.from} = ${result.converted >= 1 ? result.converted.toLocaleString("en-US", { maximumFractionDigits: 4 }) : result.converted.toFixed(6)} ${result.to} (Rate: 1 ${result.from} = ${result.rate} ${result.to})`;
    navigator.clipboard.writeText(text).then(() => toast.success("Result copied!"));
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
      <div className="bg-[#0B2E33]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl">
        <h2 className="font-heading font-semibold text-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" /> Currency Converter
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          {/* Amount */}
          <div className="flex-1">
            <label className="text-xs text-[#93B1B5] mb-1 block font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
              className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium text-base outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all placeholder-[#4F7C82]"
              placeholder="100"
              data-testid="currency-amount-input"
            />
          </div>

          {/* From */}
          <div className="flex-1">
            <label className="text-xs text-[#93B1B5] mb-1 block font-medium">From</label>
            <CurrencySelect
              currencies={CURRENCIES}
              value={fromCurrency}
              onChange={(code) => { setFromCurrency(code); setResult(null); }}
              testId="from-currency-select"
            />
          </div>

          {/* Swap */}
          <button
            onClick={handleSwap}
            className="h-12 w-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[#93B1B5] hover:text-white hover:border-cyan-400/50 hover:bg-white/10 transition-all self-end shrink-0"
            data-testid="swap-currencies-btn"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>

          {/* To */}
          <div className="flex-1">
            <label className="text-xs text-[#93B1B5] mb-1 block font-medium">To</label>
            <CurrencySelect
              currencies={CURRENCIES}
              value={toCurrency}
              onChange={(code) => { setToCurrency(code); setResult(null); }}
              testId="to-currency-select"
            />
          </div>

          {/* Convert Button */}
          <Button
            onClick={() => handleConvert()}
            disabled={loading}
            className="h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 px-6 font-medium flex items-center gap-2 self-end shrink-0 transition-transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] border-0"
            data-testid="convert-btn"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : "Convert"}
          </Button>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/30 text-sm text-orange-300 fade-in-up" data-testid="currency-error">
            <strong>Not supported:</strong> {errorMsg.split("Supported currencies:")[0]}
            {errorMsg.includes("Supported currencies:") && (
              <span className="block mt-1 text-xs text-orange-400/70">
                Supported: {errorMsg.split("Supported currencies:")[1]?.trim()}
              </span>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-5 p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl border border-cyan-500/20 fade-in-up shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]" data-testid="conversion-result-display">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-[#93B1B5] mb-1">
                  {result.amount.toLocaleString()} {fromMeta?.name || result.from}
                </div>
                <div className="font-heading text-3xl font-bold text-white" data-testid="converted-amount">
                  {result.converted >= 1 ? result.converted.toLocaleString("en-US", { maximumFractionDigits: 4 }) : result.converted.toFixed(6)}
                  <span className="text-lg ml-2 text-[#4F7C82]">{toMeta?.code || result.to}</span>
                </div>
                <div className="text-xs text-[#4F7C82] mt-1.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  1 {result.from} = {result.rate} {result.to} · Updated {result.date}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {trend && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-teal-400" : "text-orange-400"}`} data-testid="trend-change">
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {isPositive ? "+" : ""}{trend.change_percent}%
                    <span className="text-xs font-normal text-[#4F7C82] ml-0.5">7d</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#93B1B5] hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
                    data-testid="copy-result-btn"
                    title="Copy result"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button
                    onClick={shareLink}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-medium transition-all border border-cyan-500/30"
                    data-testid="share-link-btn"
                    title="Copy shareable link"
                  >
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trend Chart */}
      {(trend || loadingTrend) && (
        <div className="bg-[#0B2E33]/40 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-xl fade-in-up" data-testid="trend-chart">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-white">7-Day Rate Trend</h3>
            {trend?.available && (
              <div className={`text-sm font-medium flex items-center gap-1 ${isPositive ? "text-teal-400" : "text-orange-400"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {fromCurrency}/{toCurrency}
              </div>
            )}
          </div>
          {loadingTrend ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#4F7C82] animate-spin" />
            </div>
          ) : trend?.available === false ? (
            <div className="h-24 flex items-center justify-center text-center" data-testid="trend-unavailable">
              <div>
                <p className="text-sm text-[#93B1B5]">{trend.message}</p>
                <p className="text-xs text-[#4F7C82] mt-1">Trend available for major ECB pairs (USD, EUR, GBP, INR…)</p>
              </div>
            </div>
          ) : trend?.trend?.length ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trend.trend} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#4F7C82" }} tickFormatter={(d) => d.slice(5)} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "#4F7C82" }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => v.toFixed(3)} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" stroke="#22d3ee" strokeWidth={2} fill="url(#rateGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </div>
      )}
    </div>
  );
}
