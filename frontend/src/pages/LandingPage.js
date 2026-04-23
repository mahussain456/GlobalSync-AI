import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Globe, ArrowRight, Clock, TrendingUp, Zap, Users, Star, BookOpen, ExternalLink, Newspaper, Lightbulb, ChevronDown } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getHomepageSEO } from "@/lib/seo";

const API = process.env.REACT_APP_BACKEND_URL || "";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const HOMEPAGE_FAQS = [
  {
    q: "What is GlobalSync AI?",
    a: "GlobalSync AI is a free, AI-powered tool for remote teams, freelancers, and digital nomads. It combines a real-time world clock, time zone converter, meeting overlap planner, and live currency converter (160+ currencies) in one place — no account or signup required.",
  },
  {
    q: "Is GlobalSync AI free to use?",
    a: "Yes, completely free. There are no subscription fees, no signup requirement, and no usage limits. All features — time zone conversion, meeting planning, AI natural language input, and live currency conversion — are available to everyone at zero cost.",
  },
  {
    q: "What is the best free time zone converter for remote teams?",
    a: "The best time zone converter for remote teams shows live clocks for multiple cities simultaneously, calculates business-hour overlaps automatically, and supports natural language queries. GlobalSync AI does all three: compare up to 5 cities, find the best meeting window, and ask questions like 'What time is it in Tokyo when it's 9 AM in New York?'",
  },
  {
    q: "How do I find the best meeting time across multiple time zones?",
    a: "Use GlobalSync AI's Meeting Planner: select your cities (up to 5) and the tool instantly shows the window where all cities' business hours overlap. You can also type a natural language query like 'Best meeting time for New York, London, and Mumbai' for an immediate AI-generated recommendation.",
  },
  {
    q: "Does GlobalSync AI support live currency exchange rates?",
    a: "Yes. GlobalSync AI's currency converter fetches real-time exchange rates for 160+ currencies via ExchangeRate-API, plus 7-day trend charts via the European Central Bank. Convert USD to INR, EUR, GBP, AED, PKR, NGN, and many more currencies with a single query — no account needed.",
  },
  {
    q: "Can I use GlobalSync AI on mobile?",
    a: "Yes. GlobalSync AI is fully responsive and works on all devices — smartphones, tablets, and desktops. No app download is required; simply open globalsync-ai.com in any mobile browser and all features work instantly.",
  },
];

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

// ─── Today's Feed Widget ─────────────────────────────────────────────────────
function FeedMiniCard({ article, feedType }) {
  const isAI = feedType === "ai-news";
  const tagStyle = isAI
    ? { background: "#7F77DD", color: "#fff" }
    : { background: "#EF9F27", color: "#1a1200" };
  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4 hover:shadow-sm hover:border-zinc-200 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={tagStyle}>
          {isAI ? "AI News" : "Tips"}
        </span>
        <span className="text-xs text-zinc-400">{article.source}</span>
        <span className="text-xs text-zinc-300">· {timeAgo(article.pubDateParsed)}</span>
      </div>
      <h3 className="font-semibold text-zinc-900 text-sm leading-snug mb-2 line-clamp-2">
        <a href={article.link} target="_blank" rel="noopener noreferrer"
           className="hover:underline underline-offset-2 inline-flex items-start gap-1">
          {article.title}
          <ExternalLink className="w-3 h-3 text-zinc-300 shrink-0 mt-0.5" />
        </a>
      </h3>
      {article.aiSummary && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{article.aiSummary}</p>
      )}
    </div>
  );
}

function TodaysFeedWidget() {
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/news/feed`)
      .then(r => setFeed(r.data))
      .catch(() => {});
  }, []);

  const aiCards   = feed?.ai_news?.articles?.slice(0, 2)  || [];
  const tipsCards = feed?.tips?.articles?.slice(0, 2)     || [];
  const cards     = [...aiCards.map(a => ({ ...a, feedType: "ai-news" })),
                     ...tipsCards.map(a => ({ ...a, feedType: "tips"  }))];

  if (!feed && cards.length === 0) return null;  // hide widget while first load

  return (
    <section className="bg-[#FAFAFA] py-16 px-6 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-900 text-white rounded-full px-3 py-1 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </div>
            <h2 className="font-heading text-3xl font-bold text-zinc-900">Today's Feed</h2>
            <p className="text-zinc-500 text-sm mt-1">AI news &amp; remote work tips — summarized for global teams.</p>
          </div>
          <Link to="/news" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors shrink-0">
            See full feed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.length > 0
            ? cards.map((art, i) => <FeedMiniCard key={i} article={art} feedType={art.feedType} />)
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-zinc-100 p-4 animate-pulse">
                  <div className="h-4 bg-zinc-100 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-zinc-100 rounded w-full mb-1" />
                  <div className="h-3 bg-zinc-100 rounded w-4/5" />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}

// ─── Homepage FAQ Section ─────────────────────────────────────────────────────
function HomepageFAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="bg-zinc-50 py-20 px-6 border-t border-zinc-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs text-blue-600 font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="font-heading text-3xl font-bold text-zinc-900 mt-2">Frequently Asked Questions</h2>
          <p className="text-zinc-500 text-sm mt-2">Everything you need to know about GlobalSync AI.</p>
        </div>
        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-zinc-50 transition-colors"
                aria-expanded={openIdx === i}
              >
                <span className="font-semibold text-zinc-800 text-sm leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`faq-answer${openIdx === i ? " open" : ""}`}>
                <div className="flex gap-3 px-5 pb-5 border-t border-zinc-100 pt-4">
                  <div className={`faq-left-bar ${openIdx === i ? "opacity-100" : "opacity-0"}`} />
                  <p className="text-sm text-zinc-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function useTypewriter(items, typingSpeed = 70, deletingSpeed = 40, pauseMs = 2000) {
  const [text, setText] = useState("");
  useEffect(() => {
    let idx = 0, charIdx = 0, deleting = false, timer;
    const tick = () => {
      const current = items[idx];
      if (!deleting) {
        charIdx++;
        setText(current.slice(0, charIdx));
        if (charIdx === current.length) { deleting = true; timer = setTimeout(tick, pauseMs); return; }
      } else {
        charIdx--;
        setText(current.slice(0, charIdx));
        if (charIdx === 0) { deleting = false; idx = (idx + 1) % items.length; timer = setTimeout(tick, 500); return; }
      }
      timer = setTimeout(tick, deleting ? deletingSpeed : typingSpeed);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [items, typingSpeed, deletingSpeed, pauseMs]);
  return text;
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const typedPlaceholder = useTypewriter(EXAMPLE_QUERIES);

  const handleTilt = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  14;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.transition = "transform 0.1s ease";
    card.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
  };
  const handleTiltReset = (e) => {
    const card = e.currentTarget;
    card.style.transform = "";
    card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
    card.style.boxShadow = "";
  };

  const handleGo = (q) => {
    const text = (q || query).trim();
    navigate(text ? `/dashboard?q=${encodeURIComponent(text)}` : "/dashboard");
  };

  const seo = getHomepageSEO({ faqs: HOMEPAGE_FAQS });

  return (
    <div className="min-h-screen">
      <SEOHead {...seo} />
      {/* ===== DARK HERO ===== */}
      <div className="hero-bg min-h-screen flex flex-col">
        {/* Grid overlay */}
        <div className="hero-grid" />
        {/* Orbs */}
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />
        <div className="orb orb-pink" />
        <div className="orb orb-teal" />

        {/* Navbar */}
        <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between">
          <div className="flex items-center">
            {/* Desktop logo */}
            <img
              src="/globalsync-ai-logo-1024x256.png"
              alt="GlobalSync AI — Free Time Zone & Currency Converter"
              className="hidden lg:block h-16 w-auto transition-transform duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 0 24px rgba(27,122,154,0.5)) drop-shadow(0 0 8px rgba(51,181,229,0.25))" }}
            />
            {/* Mobile logo */}
            <img
              src="/globalsync-ai-logo-512x128.png"
              alt="GlobalSync AI"
              className="block lg:hidden h-12 w-auto transition-transform duration-300 hover:scale-105"
              style={{ filter: "drop-shadow(0 0 14px rgba(27,122,154,0.45))" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/news"
              className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden md:block"
              data-testid="nav-daily-feed-link"
            >
              Daily Feed
            </Link>
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
                    placeholder={typedPlaceholder || 'e.g. "Best meeting time for NY, London, Tokyo"'}
                    className="w-full pl-9 pr-3 py-3 bg-transparent text-white placeholder-white/40 outline-none text-sm"
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
            <div
              className="feature-card-blue rounded-3xl p-7 fade-in-up stagger-1"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
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
            <div
              className="feature-card-green rounded-3xl p-7 fade-in-up stagger-2"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
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
            <div
              className="feature-card-purple rounded-3xl p-7 fade-in-up stagger-3"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
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

      {/* ===== TODAY'S FEED ===== */}
      <TodaysFeedWidget />

      {/* ===== FROM THE BLOG ===== */}
      <section className="bg-white py-20 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold mb-3 border border-blue-100">
                <BookOpen className="w-3.5 h-3.5" /> Resources &amp; Guides
              </div>
              <h2 className="font-heading text-3xl font-bold text-zinc-900">From the Blog</h2>
              <p className="text-zinc-500 text-sm mt-1">Practical tips for remote teams, freelancers &amp; digital nomads.</p>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              data-testid="view-all-posts-link"
            >
              View all {BLOG_POSTS.length} articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3-column card grid — shows first 3 posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BLOG_POSTS.slice(0, 3).map((post) => {
              const style = CATEGORY_STYLES[post.categoryColor];
              return (
                <article
                  key={post.slug}
                  className={`bg-[#FAFAFA] rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group ${style.hover}`}
                  data-testid={`homepage-blog-card-${post.slug}`}
                >
                  <div className={`h-1 ${style.accent}`} />
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-zinc-900 leading-snug mb-2 group-hover:text-zinc-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        post.categoryColor === "blue"    ? "text-blue-600 hover:text-blue-700" :
                        post.categoryColor === "emerald" ? "text-emerald-600 hover:text-emerald-700" :
                        post.categoryColor === "orange"  ? "text-orange-500 hover:text-orange-600" :
                        "text-violet-600 hover:text-violet-700"
                      }`}
                      data-testid={`homepage-read-more-${post.slug}`}
                    >
                      Read More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* See all CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300 text-sm font-medium transition-all"
              data-testid="blog-see-all-btn"
            >
              <BookOpen className="w-4 h-4" />
              See all {BLOG_POSTS.length} articles in the blog
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <HomepageFAQSection />

      {/* Footer */}
      {/* Popular Global Conversions */}
      <section className="bg-white py-16 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-zinc-900 mb-8 text-center">Popular Global Conversions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> Time Zone Converters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { to: "/time/new-york-to-london", label: "Convert Time: New York to London" },
                  { to: "/time/london-to-tokyo", label: "Convert Time: London to Tokyo" },
                  { to: "/time/san-francisco-to-new-york", label: "Convert Time: San Francisco to New York" },
                  { to: "/time/dubai-to-mumbai", label: "Convert Time: Dubai to Mumbai" },
                ].map(link => (
                  <Link key={link.to} to={link.to} className="bg-zinc-50 rounded-xl border border-zinc-200 p-3 hover:border-blue-300 hover:bg-white transition-colors text-sm font-medium text-zinc-700 hover:text-blue-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Currency Exchange Rates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { to: "/currency/usd-to-inr", label: "Check USD to INR Exchange Rate" },
                  { to: "/currency/usd-to-eur", label: "Check USD to EUR Exchange Rate" },
                  { to: "/currency/gbp-to-inr", label: "Check GBP to INR Exchange Rate" },
                  { to: "/currency/usd-to-ngn", label: "Check USD to NGN Exchange Rate" },
                ].map(link => (
                  <Link key={link.to} to={link.to} className="bg-zinc-50 rounded-xl border border-zinc-200 p-3 hover:border-emerald-300 hover:bg-white transition-colors text-sm font-medium text-zinc-700 hover:text-emerald-600">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  src="/logo-dark.png.png"
                  alt="GlobalSync AI"
                  className="h-12 w-auto transition-transform duration-300 hover:scale-105"
                  style={{ filter: "drop-shadow(0 0 18px rgba(27,122,154,0.6)) drop-shadow(0 0 6px rgba(255,255,255,0.12))" }}
                />
              </div>
              <p className="text-white/20 text-xs">Free · Open · AI-Powered · Live Rates</p>
              <button onClick={() => navigate("/dashboard")} className="text-white/30 hover:text-white/60 text-sm transition-colors flex items-center gap-1">
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 border-t border-white/5">
              <Link to="/about" className="text-white/25 hover:text-white/50 text-xs transition-colors">About</Link>
              <Link to="/blog"  className="text-white/25 hover:text-white/50 text-xs transition-colors">Blog</Link>
              <Link to="/news"  className="text-white/25 hover:text-white/50 text-xs transition-colors">Daily Feed</Link>
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
