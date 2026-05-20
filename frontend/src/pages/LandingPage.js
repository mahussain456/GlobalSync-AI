import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Play, Sun, Moon, CheckCircle2, DollarSign, Clock, Users, Sparkles, Map, TrendingUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const SUPPORTED_CURRENCIES = [
  // Popular / major currencies first for premium UX
  "USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "JPY",
  // 150+ other currencies sorted alphabetically
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB",
  "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CDF", "CHF", "CLP",
  "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP",
  "DZD", "EGP", "ERN", "ETB", "FJD", "FKP", "FOK", "GEL", "GGP",
  "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK",
  "HTG", "HUF", "IDR", "ILS", "IMP", "IQD", "IRR", "ISK", "JEP",
  "JMD", "JOD", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD",
  "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD",
  "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MUR", "MVR",
  "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR",
  "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG",
  "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG",
  "SEK", "SHP", "SLE", "SLL", "SOS", "SRD", "SSP", "STN", "SYP",
  "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TVD",
  "TWD", "TZS", "UAH", "UGX", "UYU", "UZS", "VES", "VND", "VUV",
  "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW",
  "ZWL"
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Real-time ticking world clocks state
  const [clocks, setClocks] = useState({
    sfo: { time: "08:42", ampm: "AM", date: "May 20 · Tue", tz: "PDT", isNight: false },
    nyc: { time: "11:42", ampm: "AM", date: "May 20 · Tue", tz: "EDT", isNight: false },
    lon: { time: "04:42", ampm: "PM", date: "May 20 · Tue", tz: "BST", isNight: false },
    sgp: { time: "11:42", ampm: "PM", date: "May 20 · Tue", tz: "SGT", isNight: true }
  });


  // Currency converter state
  const [currencyAmount, setCurrencyAmount] = useState("1250.00");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("EUR");
  const [currencyRate, setCurrencyRate] = useState(0.9266);

  // Ask AI search query state
  const [aiQuery, setAiQuery] = useState("");


  // Fetch live currency rates when currency inputs change
  useEffect(() => {
    if (!mounted) return;
    
    let isMounted = true;
    const fetchRate = async () => {
      try {
        const res = await fetch(`https://open.exchangerate-api.com/v6/latest/${currencyFrom}`);
        const data = await res.json();
        if (isMounted && data?.rates && data.rates[currencyTo]) {
          setCurrencyRate(data.rates[currencyTo]);
        }
      } catch (err) {
        console.warn("Failed to fetch live currency rate", err);
        const fallbackRates = {
          USD: { EUR: 0.9266, GBP: 0.785, AUD: 1.51, CAD: 1.36, SGD: 1.35, USD: 1.0 },
          EUR: { USD: 1.079, GBP: 0.847, AUD: 1.63, CAD: 1.47, SGD: 1.46, EUR: 1.0 },
          GBP: { USD: 1.274, EUR: 1.18, AUD: 1.92, CAD: 1.73, SGD: 1.72, GBP: 1.0 },
          AUD: { USD: 0.662, EUR: 0.613, GBP: 0.521, CAD: 0.901, SGD: 0.894, AUD: 1.0 },
          CAD: { USD: 0.735, EUR: 0.68, GBP: 0.578, AUD: 1.11, SGD: 0.993, CAD: 1.0 },
          SGD: { USD: 0.741, EUR: 0.685, GBP: 0.581, AUD: 1.12, CAD: 1.01, SGD: 1.0 }
        };
        if (isMounted) {
          const fromRates = fallbackRates[currencyFrom] || {};
          const rate = fromRates[currencyTo] || 1.0;
          setCurrencyRate(rate);
        }
      }
    };

    fetchRate();
    return () => { isMounted = false; };
  }, [currencyFrom, currencyTo, mounted]);

  useEffect(() => {
    // Avoid running ticking updates during react-snap static pre-rendering
    if (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap") {
      return;
    }

    setMounted(true);

    const getCityTime = (timeZone) => {
      try {
        const now = new Date();
        const formatterTime = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        const formatterDate = new Intl.DateTimeFormat("en-US", {
          timeZone,
          month: "short",
          day: "numeric",
          weekday: "short"
        });
        const formatterTZ = new Intl.DateTimeFormat("en-US", {
          timeZone,
          timeZoneName: "short"
        });

        // Time parts
        const timeParts = formatterTime.formatToParts(now);
        let hour = "";
        let minute = "";
        let dayPeriod = "";
        for (const part of timeParts) {
          if (part.type === "hour") hour = part.value;
          if (part.type === "minute") minute = part.value;
          if (part.type === "dayPeriod") dayPeriod = part.value;
        }

        // Date parts
        const dateParts = formatterDate.formatToParts(now);
        let month = "";
        let day = "";
        let weekday = "";
        for (const part of dateParts) {
          if (part.type === "month") month = part.value;
          if (part.type === "day") day = part.value;
          if (part.type === "weekday") weekday = part.value;
        }

        // Timezone code
        const tzParts = formatterTZ.formatToParts(now);
        let tzName = "";
        for (const part of tzParts) {
          if (part.type === "timeZoneName") tzName = part.value;
        }

        // Determine if local hour is night (6pm to 6am)
        const hour24Str = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "numeric",
          hour12: false
        }).format(now);
        const localHour24 = parseInt(hour24Str, 10);
        const isNight = localHour24 >= 18 || localHour24 < 6;

        return {
          time: `${hour}:${minute}`,
          ampm: dayPeriod,
          date: `${month} ${day} · ${weekday}`,
          tz: tzName,
          isNight
        };
      } catch (e) {
        console.error("Error calculating city time for timezone:", timeZone, e);
        return null;
      }
    };

    const updateClocks = () => {
      const sfoTime = getCityTime("America/Los_Angeles");
      const nycTime = getCityTime("America/New_York");
      const lonTime = getCityTime("Europe/London");
      const sgpTime = getCityTime("Asia/Singapore");

      setClocks(prev => ({
        sfo: sfoTime || prev.sfo,
        nyc: nycTime || prev.nyc,
        lon: lonTime || prev.lon,
        sgp: sgpTime || prev.sgp
      }));
    };

    // Update immediately and then every second
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const fallbackClocks = {
    sfo: { time: "08:42", ampm: "AM", date: "May 20 · Tue", tz: "PDT", isNight: false },
    nyc: { time: "11:42", ampm: "AM", date: "May 20 · Tue", tz: "EDT", isNight: false },
    lon: { time: "04:42", ampm: "PM", date: "May 20 · Tue", tz: "BST", isNight: false },
    sgp: { time: "11:42", ampm: "PM", date: "May 20 · Tue", tz: "SGT", isNight: true }
  };

  const displayClocks = mounted ? clocks : fallbackClocks;


  const amt = parseFloat(currencyAmount);
  const receiveAmount = isNaN(amt) ? 0 : amt * currencyRate;

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige font-sans relative">
      <SEOHead title="GlobalSync AI | Total Alignment" description="GlobalSync AI helps remote teams coordinate across time zones, currencies, and cultures with AI-powered intelligence." />
      
      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[1100px] pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient overlay to soften */}
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10"></div>
        {/* World Map Background */}
        <div 
          className="absolute inset-0 opacity-[0.35] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      {/* HERO SECTION — reduced padding so content is above the fold */}
      <main className="relative z-10 pt-8 lg:pt-12 pb-20 px-5 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 z-20 pt-0 lg:pt-2">
            <div className="inline-block border border-gem-gold/45 bg-[#0e2a1f]/55 text-gem-gold rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] mb-7 backdrop-blur-md">
              <Sparkles className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              AI-Powered. Globally Minded.
            </div>

            <h1 className="font-serif text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.04em] font-semibold text-[#E9F1EC] mb-6">
              One Platform.<br />
              Every Time Zone.<br />
              <span className="text-gem-gold italic">Total Alignment.</span>
            </h1>

            <p className="text-[17px] leading-[1.65] text-[#F4EFE6]/75 max-w-[480px] mb-8">
              GlobalSync AI helps remote teams and freelancers coordinate across time zones, currencies, and cultures with AI-powered intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link to="/time-zone-converter" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-[15px]">
                Timezone Converter <Clock className="w-4 h-4" />
              </Link>
              <Link to="/currency-converter" className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2.5 text-[15px] group">
                Currency Converter <DollarSign className="w-4 h-4 text-gem-gold" />
              </Link>
            </div>

            {/* Trusted Logos */}
            <div>
              <p className="text-[11px] font-bold text-[#A7BFAE]/60 uppercase tracking-widest mb-5">Trusted by global teams</p>
              <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale mix-blend-screen">
                <span className="font-bold text-xl tracking-tighter">stripe</span>
                <span className="font-bold text-xl flex items-center gap-1"><span className="text-2xl font-black">H</span> HubSpot</span>
                <span className="font-semibold text-xl border border-white p-1 rounded">N</span>
                <span className="font-bold text-xl tracking-tight">deel.</span>
                <span className="font-bold text-xl italic font-serif">Canva</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Asymmetrical Bento Grid */}
          <div className="lg:col-span-7 w-full hidden lg:block z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Bento Card 1: World Clocks (Spans 2 columns) */}
              <div className="col-span-1 md:col-span-2 card-dark p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(200,169,106,0.15)] border border-white/10 rounded-[28px] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5 text-[#E9F1EC] text-sm font-semibold tracking-wide">
                    <Globe className="w-4 h-4 text-gem-gold animate-pulse" /> Real-Time World Clocks
                  </div>
                  <span className="text-xs text-gem-gold font-bold uppercase tracking-wider cursor-pointer hover:underline">Live sync</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* San Francisco */}
                  <div className="bg-gradient-to-br from-[#E6C687] to-[#C8A96A] border border-[#C8A96A]/20 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_12px_rgba(200,169,106,0.15)]">
                    <div className="text-[10px] flex items-center gap-1 mb-2 font-bold tracking-wider opacity-75">
                      {displayClocks.sfo.isNight ? <Moon className="w-3 h-3 text-[#0E2A1F]" /> : <Sun className="w-3 h-3 text-[#0E2A1F]" />} {displayClocks.sfo.tz}
                    </div>
                    <div className="text-xs font-bold tracking-tight">San Francisco</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">
                      {displayClocks.sfo.time} <span className="text-xs font-normal opacity-75">{displayClocks.sfo.ampm}</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-1">{displayClocks.sfo.date}</div>
                  </div>
                  {/* New York */}
                  <div className="bg-gradient-to-br from-[#C3D8CB] to-[#A7BFAE] border border-[#A7BFAE]/20 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_12px_rgba(167,191,174,0.15)]">
                    <div className="text-[10px] flex items-center gap-1 mb-2 font-bold tracking-wider opacity-75">
                      {displayClocks.nyc.isNight ? <Moon className="w-3 h-3 text-[#0E2A1F]" /> : <Sun className="w-3 h-3 text-[#0E2A1F]" />} {displayClocks.nyc.tz}
                    </div>
                    <div className="text-xs font-bold tracking-tight">New York</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">
                      {displayClocks.nyc.time} <span className="text-xs font-normal opacity-75">{displayClocks.nyc.ampm}</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-1">{displayClocks.nyc.date}</div>
                  </div>
                  {/* London */}
                  <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F4EFE6] border border-[#F4EFE6]/20 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_12px_rgba(244,239,230,0.1)]">
                    <div className="text-[10px] flex items-center gap-1 mb-2 font-bold tracking-wider opacity-75">
                      {displayClocks.lon.isNight ? <Moon className="w-3 h-3 text-[#0E2A1F]" /> : <Sun className="w-3 h-3 text-[#0E2A1F]" />} {displayClocks.lon.tz}
                    </div>
                    <div className="text-xs font-bold tracking-tight">London</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">
                      {displayClocks.lon.time} <span className="text-xs font-normal opacity-75">{displayClocks.lon.ampm}</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-1">{displayClocks.lon.date}</div>
                  </div>
                  {/* Singapore */}
                  <div className="bg-gradient-to-br from-[#F5F8F6] to-[#E9F1EC] border border-[#E9F1EC]/20 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_12px_rgba(233,241,236,0.1)]">
                    <div className="text-[10px] flex items-center gap-1 mb-2 font-bold tracking-wider opacity-75">
                      {displayClocks.sgp.isNight ? <Moon className="w-3 h-3 text-[#0E2A1F]" /> : <Sun className="w-3 h-3 text-[#0E2A1F]" />} {displayClocks.sgp.tz}
                    </div>
                    <div className="text-xs font-bold tracking-tight">Singapore</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">
                      {displayClocks.sgp.time} <span className="text-xs font-normal opacity-75">{displayClocks.sgp.ampm}</span>
                    </div>
                    <div className="text-[10px] opacity-75 mt-1">{displayClocks.sgp.date}</div>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Currency Exchange (Left column) */}
              <div className="card-light p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-gem-sage/20 rounded-[28px] text-[#0E2A1F] flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                    <DollarSign className="w-4 h-4 text-gem-forest" /> Currency Exchange
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-gem-forest/10 px-2 py-0.5 rounded text-gem-forest">Live conversion</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-[#F4EFE6]/80 border border-gem-forest/5 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                    <div>
                      <div className="text-[10px] font-bold opacity-60 mb-1">Send Amount</div>
                      <div className="text-sm font-bold flex items-center gap-1">
                        <div className="relative inline-block cursor-pointer">
                          {mounted ? (
                            <select
                              value={currencyFrom}
                              onChange={(e) => setCurrencyFrom(e.target.value)}
                              className="appearance-none bg-transparent border-none p-0 pr-4 font-bold text-sm text-[#0E2A1F] focus:outline-none focus:ring-0 cursor-pointer"
                            >
                              {SUPPORTED_CURRENCIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-bold text-sm text-[#0E2A1F]">USD</span>
                          )}
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] opacity-50 pointer-events-none">▼</span>
                        </div>
                      </div>
                    </div>
                    {mounted ? (
                      <input
                        type="text"
                        value={currencyAmount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          setCurrencyAmount(val);
                        }}
                        className="bg-transparent border-none p-0 text-right text-xl font-extrabold text-[#0E2A1F] focus:outline-none focus:ring-0 w-32 placeholder-[#0E2A1F]/30"
                        placeholder="0.00"
                      />
                    ) : (
                      <div className="text-xl font-extrabold tracking-tight">1,250.00</div>
                    )}
                  </div>
                  <div className="bg-[#F4EFE6]/80 border border-gem-forest/5 rounded-2xl p-4 flex justify-between items-center shadow-inner">
                    <div>
                      <div className="text-[10px] font-bold opacity-60 mb-1">Receive Amount</div>
                      <div className="text-sm font-bold flex items-center gap-1">
                        <div className="relative inline-block cursor-pointer">
                          {mounted ? (
                            <select
                              value={currencyTo}
                              onChange={(e) => setCurrencyTo(e.target.value)}
                              className="appearance-none bg-transparent border-none p-0 pr-4 font-bold text-sm text-[#0E2A1F] focus:outline-none focus:ring-0 cursor-pointer"
                            >
                              {SUPPORTED_CURRENCIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-bold text-sm text-[#0E2A1F]">EUR</span>
                          )}
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] opacity-50 pointer-events-none">▼</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-extrabold tracking-tight text-[#0E2A1F]">
                      {mounted ? (receiveAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : "1,158.24"}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#1B4D3E]/60 border-t border-[#1B4D3E]/10 pt-4">
                  <div className="flex items-center gap-1.5">
                    <span>1 {mounted ? currencyFrom : "USD"} = {mounted ? currencyRate.toFixed(4) : "0.9266"} {mounted ? currencyTo : "EUR"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="40" height="12" viewBox="0 0 48 16" fill="none" className="opacity-50">
                      <path d="M0 12 L4 10 L8 11 L12 8 L16 9 L20 6 L24 7 L28 4 L32 5 L36 3 L40 5 L44 4 L48 2" stroke="#C8A96A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm text-[9px] border border-[#1B4D3E]/5"><div className="w-1.5 h-1.5 rounded-full bg-gem-forest animate-pulse"></div> Live</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 3: AI Ask (Right column) */}
              <div className="card-light p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-gem-sage/20 rounded-[28px] text-[#0E2A1F] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold tracking-wide mb-4">
                    <Sparkles className="w-4 h-4 text-gem-forest animate-pulse" /> Ask GlobalSync AI
                  </div>
                  <p className="text-[13px] font-medium text-[#1B4D3E]/70 mb-6 leading-relaxed">
                    Get instant help with timezone math, cultural etiquette, or currency trends.
                  </p>
                </div>
                
                <div className="bg-[#E9F1EC] rounded-2xl relative border border-[#1B4D3E]/10 shadow-inner overflow-hidden mt-auto">
                  {mounted ? (
                    <textarea
                      placeholder="What's the best time to meet between NY, London, and Singapore next week?"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const query = aiQuery.trim() || "What's the best time to meet between NY, London, and Singapore next week?";
                          navigate(`/dashboard?q=${encodeURIComponent(query)}`);
                        }
                      }}
                      className="w-full h-32 bg-transparent border-none py-4 pl-4 pr-12 text-[13px] font-medium text-[#1B4D3E] placeholder-[#1B4D3E]/60 focus:outline-none focus:ring-0 resize-none"
                    />
                  ) : (
                    <div className="text-[13px] font-medium text-[#1B4D3E] leading-relaxed py-4 pl-4 pr-12 select-none h-32">
                      "What's the best time to meet between NY, London, and Singapore next week?"
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const query = aiQuery.trim() || "What's the best time to meet between NY, London, and Singapore next week?";
                      navigate(`/dashboard?q=${encodeURIComponent(query)}`);
                    }}
                    className="absolute right-3.5 bottom-3.5 w-10 h-10 rounded-full bg-[#0E2A1F] flex items-center justify-center hover:bg-[#1B4D3E] cursor-pointer transition-colors shadow-lg border-none"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FEATURE STRIP */}
      <section className="bg-[#F4EFE6] text-[#0E2A1F] py-16 px-6 relative z-20 rounded-t-[40px] mt-16 shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          
          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 bg-[#0E2A1F] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Globe className="w-7 h-7 text-[#A7BFAE]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">World Clocks</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Real-time clocks for any city in the world.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 bg-[#A7BFAE] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Users className="w-7 h-7 text-[#0E2A1F]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">Smart Scheduling</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Find the best meeting times across time zones.</p>
            </div>
          </div>

          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 border border-[#1B4D3E]/30 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-7 h-7 text-[#1B4D3E]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">Live Currency</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Real-time exchange rates with no hidden fees.</p>
            </div>
          </div>

          <div className="flex items-start gap-5 lg:pr-6">
            <div className="w-14 h-14 bg-[#F4EFE6] border border-[#0E2A1F]/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-7 h-7 text-[#0E2A1F]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">AI Copilot</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Ask anything. Get instant, accurate answers.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* REMAINDER OF THE PAGE */}
      <div className="bg-[#F4EFE6] text-[#0E2A1F] pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-serif text-[40px] md:text-5xl font-semibold text-center mb-20 pt-20 border-t border-[#0E2A1F]/10">Built for teams that work across borders.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <Link to="/time-zone-converter" className="group p-10 rounded-[32px] bg-[#E9F1EC] hover:bg-white transition-all border border-[#0E2A1F]/5 hover:border-[#C8A96A]/50 hover:shadow-xl">
               <Clock className="w-10 h-10 text-[#1B4D3E] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Time Zone Converter</h3>
               <p className="text-[#1B4D3E]/70 font-medium mb-8 leading-relaxed">Compare multiple cities instantly and understand the exact local time for every participant.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/meeting-planner" className="group p-10 rounded-[32px] bg-[#0E2A1F] text-white hover:border-[#C8A96A]/50 border border-transparent transition-all hover:shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
               <Map className="w-10 h-10 text-[#C8A96A] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Meeting Overlap Finder</h3>
               <p className="text-[#A7BFAE] font-medium mb-8 leading-relaxed">Find the most respectful time slots across regions without forcing someone into midnight meetings.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/currency-converter" className="group p-10 rounded-[32px] bg-[#0E2A1F] text-white hover:border-[#C8A96A]/50 border border-transparent transition-all hover:shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
               <TrendingUp className="w-10 h-10 text-[#C8A96A] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Currency Converter</h3>
               <p className="text-[#A7BFAE] font-medium mb-8 leading-relaxed">Convert live exchange rates for invoices, travel, consulting, and international planning.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/dashboard" className="group p-10 rounded-[32px] bg-white hover:bg-[#E9F1EC] transition-all border border-[#0E2A1F]/5 hover:border-[#C8A96A]/50 hover:shadow-xl">
               <Sparkles className="w-10 h-10 text-[#1B4D3E] mb-6" />
               <h3 className="text-2xl font-bold mb-3">AI Global Assistant</h3>
               <p className="text-[#1B4D3E]/70 font-medium mb-8 leading-relaxed">Type a real-world question and get a direct answer without switching tabs or doing mental math.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>
          
          <div className="bg-[#0E2A1F] rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
             <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-6 relative z-10">Bring your global work into perfect sync.</h2>
             <p className="text-[19px] text-[#A7BFAE] max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">Plan meetings, convert currencies, compare time zones, and ask AI for global answers in one elegant workspace.</p>
             <Link to="/dashboard" className="inline-block btn-primary relative z-10 text-[17px] px-8 py-4">
               Start using GlobalSync AI
             </Link>
          </div>
          
        </div>
      </div>
      
      <div className="bg-[#0A1E16]">
        <SiteFooter />
      </div>
    </div>
  );
}
