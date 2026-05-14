import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Globe, ArrowRight, Clock, TrendingUp, Zap, Users, Star, BookOpen, CheckCircle2, ChevronDown, Mail } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, CATEGORY_STYLES } from "@/data/blogData";
import { getHomepageSEO } from "@/lib/seo";

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
    <div className="bg-[#0B2E33]/30 backdrop-blur-md rounded-xl p-4 flex flex-col gap-3 border border-white/5 shadow-md hover:bg-[#0B2E33]/50 hover:border-white/10 hover:shadow-xl transition-all duration-300 group">
      {/* Header row: flag + city name | status dot */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={`https://flagcdn.com/w40/${city.code}.png`}
            alt={city.name}
            className="w-5 h-auto rounded-sm flex-shrink-0 opacity-90"
            loading="lazy"
          />
          <span className="text-[#93B1B5] text-sm font-semibold truncate">{city.name}</span>
        </div>
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${isBiz ? "bg-cyan-500" : "bg-white/10"}`}
          title={isBiz ? "In Office" : "Off Hours"}
        />
      </div>

      {/* Time */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-3xl font-bold text-white/90 tabular-nums tracking-tight leading-none group-hover:text-white transition-colors">{td.hhmm}</span>
            <span className="text-[#93B1B5]/80 text-sm font-semibold leading-none mb-0.5">{td.ampm}</span>
          </div>
          <div className="text-[#4F7C82] text-xs tabular-nums font-mono mt-1">:{td.ss}</div>
        </div>
        {isBiz && (
          <div className="flex flex-col items-end gap-0.5 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-3 bg-cyan-500/80 rounded-full" />
            <div className="w-1 h-5 bg-cyan-500/80 rounded-full" />
            <div className="w-1 h-2 bg-cyan-500/80 rounded-full" />
          </div>
        )}
      </div>

      {/* Date + status label */}
      <div className="flex items-center justify-between mt-1">
        <div className="text-white/30 text-xs font-medium">{td.date}</div>
        <div className={`text-xs font-semibold ${isBiz ? "text-cyan-500/80" : "text-white/20"}`}>
          {isBiz ? "In Office" : "Off Hours"}
        </div>
      </div>
    </div>
  );
}



// ─── Homepage FAQ Section ─────────────────────────────────────────────────────
function HomepageFAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="bg-[#0B2E33] py-20 px-6 border-t border-white/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="font-heading text-3xl font-bold text-white mt-2">Frequently Asked Questions</h2>
          <p className="text-white/60 text-sm mt-2">Everything you need to know about GlobalSync AI.</p>
        </div>
        <div className="space-y-3">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-[#0B2E33]/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-lg"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-white/5 transition-colors"
                aria-expanded={openIdx === i}
              >
                <span className="font-semibold text-white text-sm leading-snug">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`faq-answer${openIdx === i ? " open" : ""}`}>
                <div className="flex gap-3 px-5 pb-5 border-t border-white/10 pt-4">
                  <div className={`faq-left-bar ${openIdx === i ? "opacity-100" : "opacity-0"}`} />
                  <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
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
    <div className="min-h-screen bg-[#0B2E33] text-white">
      <SEOHead {...seo} />
      <SiteNav />
      {/* ===== DARK HERO ===== */}
      <div className="hero-bg flex flex-col pt-10">
        {/* Grid overlay */}
        <div className="hero-grid" />
        {/* Orbs */}
        <div className="orb orb-blue" />
        <div className="orb orb-purple" />
        <div className="orb orb-pink" />
        <div className="orb orb-teal" />

        {/* SiteNav is now global, removing hero-specific nav */}

        {/* Hero content */}
        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="flex-1 fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-[#64848a] border border-[#2d3748] bg-[#1a202c]/50 font-medium mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              Built for remote teams and freelancers
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] mb-6">
              <span className="text-[#93B1B5]">Plan global meetings</span><br />
              <span className="text-[#06b6d4]">and payments without</span><br />
              <span className="text-[#93B1B5]">time zone confusion.</span>
            </h1>
            <p className="text-[#4F7C82] text-lg leading-relaxed mb-8 max-w-xl">
              GlobalSync AI helps remote teams, freelancers, and international clients find fair meeting times, compare time zones, and convert currencies in one clean workspace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto bg-cyan-500/10 backdrop-blur-md border border-cyan-500/40 rounded-xl px-7 py-3.5 text-sm font-semibold text-cyan-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
              >
                Try GlobalSync AI Free <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/meeting-planner"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" /> Plan a Global Meeting
              </Link>
            </div>

            {/* Trust points */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-medium text-white/30">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Free to use</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> No signup required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> All-in-one workspace</span>
            </div>
          </div>

          {/* Right: Live clocks grid */}
          <div className="w-full lg:w-[480px] flex-shrink-0 fade-in-up stagger-2">
            <div className="bg-[#0B2E33]/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 ml-2">
                <Clock className="w-4 h-4 text-[#06b6d4]" />
                <span className="text-[#4F7C82] text-xs font-bold uppercase tracking-widest">Live World Clocks</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
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

      {/* ===== FEATURES SECTION (dark) ===== */}
      <section className="bg-[#0B2E33] py-24 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">Everything you need</span>
            <h2 className="font-heading text-4xl font-bold text-white mt-3">Built for the global workforce</h2>
            <p className="text-[#93B1B5] mt-3 max-w-lg mx-auto">Three powerful tools unified under AI-driven natural language understanding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div
              className="bg-[#0B2E33]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7 fade-in-up stagger-1 shadow-xl"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
              <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-cyan-500/30">
                <Clock className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Smart Meeting Planner</h3>
              <p className="text-[#93B1B5] text-sm leading-relaxed mb-5">
                Calculate the perfect meeting time with our AI Meeting Overlap Score. Automatically avoid weekends, late nights, and early mornings for your remote team.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-cyan-500/10 text-cyan-300 rounded-full px-3 py-1 font-medium border border-cyan-500/30">Overlap Score: 87/100</span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="bg-[#0B2E33]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7 fade-in-up stagger-2 shadow-xl"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
              <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-teal-500/30">
                <TrendingUp className="w-6 h-6 text-teal-300" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Live Currency Rates</h3>
              <p className="text-[#93B1B5] text-sm leading-relaxed mb-5">
                Real-time exchange rates. Convert any pair, calculate freelancer rates across countries, and track USD, EUR, GBP, INR + 150 more.
              </p>
              <div className="bg-teal-500/10 rounded-xl p-3 border border-teal-500/20">
                <div className="text-teal-300 font-semibold text-sm">1 USD ≈ 83.20 INR</div>
                <div className="text-[#4F7C82] text-xs mt-0.5">Example · Live via API</div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="bg-[#0B2E33]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-7 fade-in-up stagger-3 shadow-xl"
              onMouseMove={handleTilt}
              onMouseLeave={handleTiltReset}
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5 shadow-lg border border-blue-500/30">
                <Zap className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">AI Natural Language</h3>
              <p className="text-[#93B1B5] text-sm leading-relaxed mb-5">
                Our AI understands your query, detects intent, extracts cities and currencies, and routes you to the best tool.
              </p>
              <div className="space-y-2">
                {['"3 PM NY → What time in Tokyo?"', '"Convert 200 EUR to GBP"'].map((ex) => (
                  <div key={ex} className="text-xs font-mono bg-blue-500/10 text-blue-300 rounded-lg px-3 py-2 border border-blue-500/20">{ex}</div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Content Block */}
          <div className="mt-16 bg-[#0B2E33]/40 backdrop-blur-xl shadow-xl rounded-3xl border border-white/10 p-8">
            <h2 className="font-heading text-xl font-bold text-white mb-4">
              The AI Meeting and Payment Planner for Remote Teams
            </h2>
            <p className="text-[#93B1B5] leading-relaxed text-sm mb-4">
              GlobalSync AI is a free AI-powered global work assistant. Use our <strong>meeting planner</strong> with the AI Meeting Overlap Score to schedule fair meetings. Compare clocks across 25+ cities including New York, London, Tokyo, Dubai, and Mumbai. Convert currencies with live exchange rates for 160+ currencies using our <strong>freelancer rate converter</strong>.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Time Zone Converter", "AI Meeting Planner", "Currency Converter", "Freelancer Rates", "160+ Currencies", "Free Forever"].map(tag => (
                <span key={tag} className="text-xs bg-white/5 border border-white/10 text-[#4F7C82] rounded-full px-3 py-1">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#4F7C82]">
                <Users className="w-4 h-4 text-cyan-500" />
                Join global teams already using GlobalSync
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/40 text-cyan-300 rounded-2xl px-10 py-4 text-base font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-cyan-500/20 hover:text-cyan-100 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
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



      {/* ===== FROM THE BLOG ===== */}
      <section className="bg-[#0B2E33] py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-300 rounded-full px-3 py-1 text-xs font-semibold mb-3 border border-cyan-500/30">
                <BookOpen className="w-3.5 h-3.5" /> Resources &amp; Guides
              </div>
              <h2 className="font-heading text-3xl font-bold text-white">From the Blog</h2>
              <p className="text-[#93B1B5] text-sm mt-1">Practical tips for remote teams, freelancers &amp; digital nomads.</p>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
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
                  className={`bg-[#0B2E33]/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-[#4F7C82]/50 hover:-translate-y-0.5 shadow-lg transition-all group`}
                  data-testid={`homepage-blog-card-${post.slug}`}
                >
                  <div className={`h-1 ${style.accent}`} />
                  <div className="p-5 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-[#4F7C82] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-white leading-snug mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#93B1B5] leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        post.categoryColor === "blue"    ? "text-blue-400 hover:text-blue-300" :
                        post.categoryColor === "emerald" ? "text-emerald-400 hover:text-emerald-300" :
                        post.categoryColor === "orange"  ? "text-orange-400 hover:text-orange-300" :
                        "text-violet-400 hover:text-violet-300"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-[#0B2E33]/40 backdrop-blur-md text-white hover:bg-white/10 hover:border-[#4F7C82]/50 text-sm font-medium transition-all shadow-lg"
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

      <SiteFooter />
    </div>
  );
}
