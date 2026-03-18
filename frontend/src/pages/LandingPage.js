import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Globe, ArrowRight, Clock, TrendingUp, Zap, Users, Star } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const HOMEPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "GlobalSync AI",
      "url": "https://globalsync-ai.com",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "description": "Free AI-powered time zone converter, currency converter, and meeting overlap planner for remote teams and global workers."
    },
    {
      "@type": "Organization",
      "name": "GlobalSync AI",
      "url": "https://globalsync-ai.com",
      "logo": "https://globalsync-ai.com/logo-primary.png"
    }
  ]
};

const HERO_CITIES = [
  { name: "New York",  tz: "America/New_York",  code: "us" },
  { name: "London",    tz: "Europe/London",     code: "gb" },
  { name: "Tokyo",     tz: "Asia/Tokyo",        code: "jp" },
  { name: "Dubai",     tz: "Asia/Dubai",        code: "ae" },
  { name: "Sydney",    tz: "Australia/Sydney",  code: "au" },
  { name: "Mumbai",    tz: "Asia/Kolkata",      code: "in" },
];

const EXAMPLE_QUERIES = [
  "Best meeting time for SF, London, Dubai",
  "Convert 500 USD to EUR",
  "What time is 9 AM Dubai in New York?",
];

const STATS = ["25+ Global Cities", "30+ Currencies", "AI-Powered", "Free Forever", "Live ECB Rates", "Real-Time Clocks"];

function LiveClock({ city }) {
  const [td, setTd] = useState({ hhmm: "", ss: "", ampm: "", h: 0, date: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const full = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const match = full.match(/^(\d{2}:\d{2}):(\d{2})\s+(AM|PM)$/);
      const hhmm = match ? match[1] : "--:--";
      const ss   = match ? match[2] : "00";
      const ampm = match ? match[3] : "";
      const h = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: city.tz, hour: "numeric", hour12: false }).format(now)) % 24;
      const date = now.toLocaleDateString("en-US", { timeZone: city.tz, weekday: "short", month: "short", day: "numeric" });
      setTd({ hhmm, ss, ampm, h, date });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [city.tz]);

  const isBiz = td.h >= 9 && td.h < 17;

  return (
    <div className="clock-card p-4 flex flex-col gap-3">
      {/* Header row: flag + city name | status dot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${city.code}.png`}
            alt={city.name}
            className="w-6 h-auto rounded-sm flex-shrink-0 shadow-sm"
            loading="lazy"
          />
          <span className="text-white/90 text-sm font-semibold truncate">{city.name}</span>
        </div>
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${isBiz ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-white/20"}`}
          title={isBiz ? "In Office" : "Off Hours"}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8" />

      {/* Time */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-bold text-white tabular-nums tracking-tight leading-none">{td.hhmm}</span>
            <span className="text-white/55 text-sm font-semibold leading-none mb-0.5">{td.ampm}</span>
          </div>
          <div className="text-white/25 text-xs tabular-nums font-mono mt-1">:{td.ss}</div>
        </div>
        {isBiz && (
          <div className="flex flex-col items-end gap-1 mb-1">
            <div className="w-1 h-4 bg-emerald-500/40 rounded-full" />
            <div className="w-1 h-6 bg-emerald-500/60 rounded-full" />
            <div className="w-1 h-3 bg-emerald-500/30 rounded-full" />
          </div>
        )}
      </div>

      {/* Date + status label */}
      <div className="flex items-center justify-between">
        <div className="text-white/30 text-xs">{td.date}</div>
        <div className={`text-xs font-medium ${isBiz ? "text-emerald-400/80" : "text-white/20"}`}>
          {isBiz ? "In Office" : "Off Hours"}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleGo = (q) => {
    const text = (q || query).trim();
    navigate(text ? `/dashboard?q=${encodeURIComponent(text)}` : "/dashboard");
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Free Time Zone & Currency Converter for Remote Teams"
        description="GlobalSync AI offers free time zone conversion, meeting overlap planning, and live currency rates for 160+ currencies. Built for remote teams, freelancers, and global workers. No signup required."
        keywords="time zone converter, currency converter, world clock, meeting planner time zones, remote team time zone tool, AI time zone converter, free world clock multiple cities, live exchange rates, meeting overlap finder"
        canonical="/"
        structuredData={HOMEPAGE_SCHEMA}
      />
      {/* ===== DARK HERO ===== */}
      <div className="hero-bg min-h-screen flex flex-col">
        {/* Grid overlay */}
        <div className="hero-grid" />
        {/* Orbs */}
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />
        <div className="orb orb-pink" />

        {/* Navbar */}
        <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
          <div className="flex items-center">
            {/* Desktop logo */}
            <img
              src="/logo-primary.png"
              alt="GlobalSync AI — Free Time Zone & Currency Converter"
              className="hidden lg:block h-16 w-auto"
              style={{ filter: "drop-shadow(0 0 12px rgba(51,181,229,0.25))" }}
            />
            {/* Mobile: stacked logo */}
            <img
              src="/logo-stacked.png"
              alt="GlobalSync AI"
              className="block lg:hidden h-14 w-auto"
              style={{ filter: "drop-shadow(0 0 10px rgba(51,181,229,0.3))" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden md:block"
              data-testid="nav-blog-link"
            >
              Blog
            </Link>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/80 hover:text-white text-sm font-medium transition-all hover:bg-white/10"
              data-testid="open-dashboard-btn"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1 fade-in-up">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs text-white/70 font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live exchange rates · AI-powered · Free
            </div>
            <p className="gradient-text text-xs font-bold uppercase tracking-[0.2em] mb-3">Sync Beyond Borders</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-3">
              Free Time Zone<br />
              <span className="gradient-text">&amp; Currency Converter</span><br />
              <span className="text-white/65 text-2xl md:text-3xl lg:text-4xl font-semibold">for Remote Teams</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-lg">
              Ask in plain English. GlobalSync AI handles time zone conversion, meeting overlap planning, and live currency rates for 160+ currencies — all in one free tool.
            </p>

            {/* Omnibar */}
            <div className="glass-dark rounded-2xl p-3 max-w-xl mb-5" data-testid="landing-omnibar">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGo()}
                    placeholder='e.g. "Best time for NY, London, Tokyo"'
                    className="w-full pl-9 pr-3 py-3 bg-transparent text-white placeholder-white/30 outline-none text-sm"
                    data-testid="landing-query-input"
                  />
                </div>
                <button
                  onClick={() => handleGo()}
                  className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shrink-0"
                  data-testid="landing-try-btn"
                >
                  Try Free <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Example chips */}
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleGo(q)}
                  className="text-xs glass-dark text-white/50 hover:text-white rounded-full px-3 py-1.5 transition-all hover:bg-white/10"
                  data-testid={`example-${q.slice(0, 8)}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live clocks grid */}
          <div className="w-full lg:w-[400px] flex-shrink-0 fade-in-up stagger-2">
            <div className="glass-dark rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Live World Clocks</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {HERO_CITIES.map((city) => (
                  <LiveClock key={city.name} city={city} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats ticker */}
        <div className="relative z-10 border-t border-white/5 py-4">
          <div className="ticker-wrap">
            <div className="ticker-content">
              {[...STATS, ...STATS].map((s, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-white/30 text-sm font-medium mx-8">
                  <Star className="w-3 h-3 text-blue-400/60" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES SECTION (light) ===== */}
      <section className="bg-[#FAFAFA] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-blue-600 font-semibold uppercase tracking-widest">Everything you need</span>
            <h2 className="font-heading text-4xl font-bold text-zinc-900 mt-3">Built for the global workforce</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto">Three powerful tools unified under AI-driven natural language understanding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="feature-card-blue rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-1">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-blue-900 mb-2">Smart Time Zones</h3>
              <p className="text-blue-700/70 text-sm leading-relaxed mb-5">
                Live clocks for up to 5 cities. Instantly see who's in office, find business hour overlaps, and get perfect meeting time suggestions.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["NYC", "London", "Tokyo", "Sydney"].map((c) => (
                  <span key={c} className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium border border-blue-200">{c}</span>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            <div className="feature-card-green rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-2">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-emerald-900 mb-2">Live Currency Rates</h3>
              <p className="text-emerald-700/70 text-sm leading-relaxed mb-5">
                Real-time exchange rates from ECB. Convert any pair, view 7-day trend charts, and track USD, EUR, GBP, INR, JPY + 15 more.
              </p>
              <div className="bg-emerald-100 rounded-xl p-3 border border-emerald-200">
                <div className="text-emerald-800 font-semibold text-sm">1 USD ≈ 92.09 INR</div>
                <div className="text-emerald-600/60 text-xs mt-0.5">Example · Live via ECB</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="feature-card-purple rounded-3xl p-7 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-3">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-violet-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-bold text-xl text-violet-900 mb-2">AI Natural Language</h3>
              <p className="text-violet-700/70 text-sm leading-relaxed mb-5">
                Claude AI understands your query, detects intent, extracts cities and currencies, then routes automatically.
              </p>
              <div className="space-y-2">
                {['"3 PM NY → What time in Tokyo?"', '"Convert 200 EUR to GBP"'].map((ex) => (
                  <div key={ex} className="text-xs font-mono bg-violet-100 text-violet-700 rounded-lg px-3 py-2 border border-violet-200">{ex}</div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Content Block — visible to Google and users */}
          <div className="mt-16 bg-zinc-50 rounded-3xl border border-zinc-200 p-8">
            <h2 className="font-heading text-xl font-bold text-zinc-900 mb-4">
              The Free World Clock &amp; AI Time Zone Converter for Remote Teams
            </h2>
            <p className="text-zinc-600 leading-relaxed text-sm mb-4">
              GlobalSync AI is a free AI-powered tool for remote teams and global workers. Use our <strong>time zone converter</strong> to compare clocks across 25+ cities including New York, London, Tokyo, Dubai, and Mumbai with a live <strong>world clock</strong>. Convert currencies with live exchange rates for 160+ currencies including USD, EUR, GBP, INR, PKR, AED, SAR, and NGN using our <strong>currency converter</strong>.
            </p>
            <p className="text-zinc-600 leading-relaxed text-sm mb-5">
              Use the <strong>meeting planner for time zones</strong> to find the best meeting time across multiple time zones instantly — our AI automatically finds business hour overlaps so your remote team stays in sync. Whether you need a <strong>remote team time zone tool</strong>, a <strong>free world clock for multiple cities</strong>, or an <strong>AI time zone converter</strong> that understands plain English, GlobalSync AI does it all. No signup. No subscription. Free forever.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Time Zone Converter", "World Clock", "Currency Converter", "Meeting Planner", "Remote Team Tool", "AI-Powered", "160+ Currencies", "25+ Cities", "Free Forever"].map(tag => (
                <span key={tag} className="text-xs bg-white border border-zinc-200 text-zinc-500 rounded-full px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Users className="w-4 h-4 text-blue-500" />
                Join global teams already using GlobalSync
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-gradient rounded-2xl px-10 py-4 text-base font-semibold flex items-center gap-2 shadow-xl shadow-blue-500/25"
                data-testid="hero-cta-btn"
              >
                <Zap className="w-5 h-5" />
                Launch Dashboard — Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050816] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Tool links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 pb-8 border-b border-white/10">
            <Link to="/time-zone-converter" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">Time Zone Converter</div>
                <div className="text-white/30 text-xs">Live clocks · 25+ cities</div>
              </div>
            </Link>
            <Link to="/currency-converter" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">Currency Converter</div>
                <div className="text-white/30 text-xs">Live rates · 160+ currencies</div>
              </div>
            </Link>
            <Link to="/meeting-planner" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">Meeting Planner</div>
                <div className="text-white/30 text-xs">Business hour overlaps</div>
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <img
                src="/logo-primary.png"
                alt="GlobalSync AI"
                className="h-8 w-auto opacity-70"
              />
              </div>
              <p className="text-white/20 text-xs">Free · Open · AI-Powered · Live Rates</p>
              <button onClick={() => navigate("/dashboard")} className="text-white/30 hover:text-white/60 text-sm transition-colors flex items-center gap-1">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 border-t border-white/5">
              <Link to="/about" className="text-white/25 hover:text-white/50 text-xs transition-colors">About</Link>
              <Link to="/blog" className="text-white/25 hover:text-white/50 text-xs transition-colors">Blog</Link>
              <Link to="/contact" className="text-white/25 hover:text-white/50 text-xs transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="text-white/25 hover:text-white/50 text-xs transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-white/25 hover:text-white/50 text-xs transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
