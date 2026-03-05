import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Clock, TrendingUp, Zap, Users, Star } from "lucide-react";

const HERO_CITIES = [
  { name: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { name: "London", tz: "Europe/London", flag: "🇬🇧" },
  { name: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  { name: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
  { name: "Mumbai", tz: "Asia/Kolkata", flag: "🇮🇳" },
];

const EXAMPLE_QUERIES = [
  "Best meeting time for SF, London, Dubai",
  "Convert 500 USD to EUR",
  "What time is 9 AM Dubai in New York?",
];

const STATS = ["25+ Global Cities", "30+ Currencies", "AI-Powered", "Free Forever", "Live ECB Rates", "Real-Time Clocks"];

function LiveClock({ city }) {
  const [time, setTime] = useState({ t: "", h: 0 });
  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-US", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const h = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: city.tz, hour: "numeric", hour12: false }).format(new Date())) % 24;
      setTime({ t, h });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [city.tz]);
  const isBiz = time.h >= 9 && time.h < 17;
  return (
    <div className="clock-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{city.flag}</span>
          <span className="text-white/70 text-xs font-medium">{city.name}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isBiz ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/30"}`}>
          {isBiz ? "Active" : "Offline"}
        </span>
      </div>
      <div className="font-heading text-2xl font-bold text-white tabular-nums tracking-tight">{time.t}</div>
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
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-white text-lg">GlobalSync AI</span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-white/80 hover:text-white text-sm font-medium transition-all hover:bg-white/10"
            data-testid="open-dashboard-btn"
          >
            Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1 fade-in-up">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs text-white/70 font-medium mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live exchange rates · AI-powered · Free
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6">
              Work Global.<br />
              <span className="gradient-text">Sync Smart.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              Ask in plain English. GlobalSync AI handles time zones, meeting overlaps, and live currency rates — all in one place.
            </p>

            {/* Omnibar */}
            <div className="glass-dark rounded-2xl p-3 max-w-xl mb-5" data-testid="landing-omnibar">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
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
          <div className="w-full lg:w-80 flex-shrink-0 fade-in-up stagger-2">
            <div className="glass-dark rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-blue-400" />
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
                <div className="text-emerald-600/60 text-xs mt-0.5">ECB · Updated live</div>
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
      <footer className="bg-[#050816] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-heading text-white/70 font-medium">GlobalSync AI</span>
          </div>
          <p className="text-white/20 text-xs">Free · Open · AI-Powered · Live Rates</p>
          <button onClick={() => navigate("/dashboard")} className="text-white/30 hover:text-white/60 text-sm transition-colors flex items-center gap-1">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
