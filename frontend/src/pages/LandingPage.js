import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Clock, TrendingUp, Zap, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_QUERIES = [
  "Best meeting time for NY, London, Tokyo",
  "Convert 500 USD to EUR",
  "What time is 9 AM in Dubai in New York?",
  "100 GBP to INR",
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleGo = () => {
    const q = query.trim();
    navigate(q ? `/dashboard?q=${encodeURIComponent(q)}` : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Orbs */}
      <div className="hero-orb w-96 h-96 bg-blue-400/20 top-[-100px] right-[-80px]" />
      <div className="hero-orb w-80 h-80 bg-purple-400/15 top-[200px] left-[-100px]" />
      <div className="hero-orb w-64 h-64 bg-orange-300/20 bottom-[100px] right-[200px]" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-7 h-7 text-blue-600" />
          <span className="font-heading font-semibold text-xl text-zinc-900">GlobalSync AI</span>
        </div>
        <Button
          onClick={() => navigate("/dashboard")}
          className="rounded-full bg-zinc-900 text-white hover:bg-zinc-700 px-5 py-2 text-sm font-medium"
          data-testid="open-dashboard-btn"
        >
          Open Dashboard
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-blue-100">
          <Zap className="w-3.5 h-3.5" />
          AI-powered for remote teams
        </div>

        <h1 className="font-heading text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
          Time Zones & Currency,{" "}
          <span className="gradient-text">Effortlessly Synced</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Ask anything in plain English. GlobalSync AI handles time conversions, meeting overlaps,
          and live currency rates — powered by AI intent detection.
        </p>

        {/* Omnibar */}
        <div className="glass-card rounded-2xl p-3 max-w-2xl mx-auto shadow-xl shadow-zinc-900/5 mb-4" data-testid="landing-omnibar">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGo()}
                placeholder='Try: "Best meeting time for SF, London, Dubai"'
                className="w-full pl-10 pr-3 py-3 bg-transparent text-zinc-800 placeholder-zinc-400 outline-none text-base"
                data-testid="landing-query-input"
              />
            </div>
            <Button
              onClick={handleGo}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-medium flex items-center gap-2 transition-transform active:scale-95"
              data-testid="landing-try-btn"
            >
              Try Free <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); navigate(`/dashboard?q=${encodeURIComponent(q)}`); }}
              className="text-xs bg-white border border-zinc-200 text-zinc-600 rounded-full px-3 py-1.5 hover:border-blue-300 hover:text-blue-600 transition-colors"
              data-testid={`example-query-${q.slice(0, 10)}`}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Bento */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-1">
            <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-zinc-900 mb-2">Smart Time Zones</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Track multiple cities live, find business hour overlaps, and get the perfect meeting time suggestion.
            </p>
            <div className="mt-4 flex gap-2">
              {["NYC", "London", "Tokyo"].map((c) => (
                <span key={c} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-1 border border-blue-100">{c}</span>
              ))}
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-2">
            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-zinc-900 mb-2">Live Currency Rates</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Real-time exchange rates powered by ECB data. View 7-day trends and convert any currency pair instantly.
            </p>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
              <div className="text-xs text-emerald-700 font-medium">1 USD = 0.923 EUR</div>
              <div className="text-xs text-zinc-400 mt-0.5">Updated just now</div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 fade-in-up stagger-3">
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-zinc-900 mb-2">AI Natural Language</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Just type what you need. The AI understands intent, extracts details, and routes to the right tool automatically.
            </p>
            <div className="mt-4 space-y-1">
              {['"Convert 500 USD to GBP"', '"3 PM NY → Tokyo?"'].map((ex) => (
                <div key={ex} className="text-xs font-mono bg-zinc-50 text-zinc-600 rounded-lg px-3 py-1.5 border border-zinc-100">{ex}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-heading">GlobalSync AI</span>
          </div>
          <p className="text-xs text-zinc-400">Free · Open · Fast</p>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
          >
            Launch App <ChevronRight className="w-3 h-3" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
