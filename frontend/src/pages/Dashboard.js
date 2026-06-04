import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Globe, ArrowLeft, Clock, TrendingUp, History, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIInput from "@/components/AIInput";
import TimeConverter from "@/components/TimeConverter";
import CurrencyConverter from "@/components/CurrencyConverter";
import HistoryPanel from "@/components/HistoryPanel";
import OnboardingModal from "@/components/OnboardingModal";
import SEOHead from "@/components/SEOHead";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("time");
  const [aiDispatch, setAiDispatch] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(searchParams.get("q") || "");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("gs_user");
    if (!stored) setShowOnboarding(true);
    else setUser(JSON.parse(stored));
  }, []);

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setShowOnboarding(false);
  };

  const handleAIResult = async (result) => {
    setAiDispatch({ ...result, ts: Date.now() });
    const { intent, originalQuery } = result;
    if (intent === "currency_conversion") setActiveTab("currency");
    else if (intent === "time_conversion" || intent === "meeting_overlap") setActiveTab("time");
    try {
      const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";
      await axios.post(`${API}/history`, { query: originalQuery || "", intent, result: result.entities || {} });
    } catch { /* non-critical */ }
  };

  return (
    <>
      <SEOHead
        rawTitle="GlobalSync AI Dashboard | Time Zone & Currency Converter"
        description="Convert time zones, plan meetings across cities, and check live currency rates for 160+ currencies. Free AI-powered dashboard — no signup required."
        canonical="/dashboard"
        keywords="time zone converter, currency converter, meeting planner, world clock, live exchange rates"
        noIndex={true}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "GlobalSync AI Dashboard",
          "url": "https://www.globalsync-ai.com/dashboard",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
        }}
      />
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <div className="min-h-screen bg-background" data-testid="dashboard">
        {/* Header — gradient accent */}
        <header className="bg-gem-forest/90 backdrop-blur-md border-b border-white/10 text-gem-beige sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gem-sage hover:text-gem-beige transition-colors" data-testid="back-to-home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/" className="block">
                  <img
                    src="/logo-dark.png"
                    alt="GlobalSync AI"
                    loading="lazy"
                    className="w-auto transition-transform duration-300 hover:scale-105 logo-glowing-effect"
                    style={{ height: "70px" }}
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/5 text-gem-gold rounded-full px-3 py-1 text-xs font-medium border border-gem-gold/30">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
                Live rates active
              </div>
              {user && user.name !== "Guest" && (
                <div className="hidden sm:flex items-center gap-1.5 stat-badge rounded-full px-3 py-1 text-xs font-medium text-gem-gold">
                  <Sparkles className="w-3 h-3" />
                  {user.name}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="sr-only">GlobalSync AI Dashboard</h1>
          {/* AI Input */}
          <div className="mb-6 fade-in-up">
            <AIInput
              onResult={handleAIResult}
              initialQuery={pendingQuery}
              autoSubmit={!!pendingQuery}
              onAutoSubmitDone={() => setPendingQuery("")}
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Globe,      label: "25+ Cities",       sub: "Time Zones",       color: "text-gem-gold",   bg: "bg-white/5"   },
              { icon: TrendingUp, label: "160+ Currencies",  sub: "Live Rates",        color: "text-gem-gold",bg: "bg-white/5"},
              { icon: Sparkles,   label: "AI-Powered",       sub: "Natural Language",  color: "text-gem-gold", bg: "bg-white/5" },
            ].map(({ icon: Icon, label, sub, color, bg }) => (
              <div key={label} className="dash-stat-card">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gem-beige font-heading truncate">{label}</div>
                  <div className="text-xs text-gem-sage truncate">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="dashboard-tabs">
            <TabsList className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 text-gem-beige p-1 mb-6 w-full sm:w-auto shadow-sm">
              <TabsTrigger
                value="time"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest  data-[state=active]:shadow-md transition-all"
                data-testid="tab-time"
              >
                <Clock className="w-4 h-4" /> Time Zones
              </TabsTrigger>
              <TabsTrigger
                value="currency"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest  data-[state=active]:shadow-md transition-all"
                data-testid="tab-currency"
              >
                <TrendingUp className="w-4 h-4" /> Currency
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest  data-[state=active]:shadow-md transition-all"
                data-testid="tab-history"
              >
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="time">
              <TimeConverter aiDispatch={aiDispatch?.intent === "time_conversion" || aiDispatch?.intent === "meeting_overlap" ? aiDispatch : null} />
            </TabsContent>
            <TabsContent value="currency">
              <CurrencyConverter aiDispatch={aiDispatch?.intent === "currency_conversion" ? aiDispatch : null} />
            </TabsContent>
            <TabsContent value="history">
              <HistoryPanel />
            </TabsContent>
          </Tabs>

          {/* Humanized SEO Guide */}
          <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-[28px] p-8 md:p-10 border border-white/10 text-gem-beige shadow-sm fade-in-up stagger-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gem-beige mb-6">
              How to Get the Most Out of GlobalSync
            </h2>
            <div className="space-y-5 text-gem-mist text-[15px] leading-relaxed">
              <p>
                Hey there! If you're working remotely or managing a distributed team, you already know the struggle. Trying to figure out what time it is for your co-worker in London while simultaneously calculating how much that invoice from Europe is actually worth in US dollars... it's just exhausting. We built the GlobalSync Dashboard specifically to solve that headache so you don't have to keep doing mental math.
              </p>
              <p>
                <strong className="text-gem-beige block mb-1">Just type exactly like you talk</strong>
                The best part about this tool is the AI input box right at the top. You don't have to click through clunky dropdown menus or manually select time zones. Just type what's on your mind. Trying to set up a group call? Literally just type <em>"Best meeting time for New York, Dubai, and Singapore"</em> and hit enter. The AI will instantly calculate the business hour overlap for all three cities and show you the perfect window to schedule your call.
              </p>
              <p>
                <strong className="text-gem-beige block mb-1">Live currency conversions without the fluff</strong>
                We also baked in live, mid-market exchange rates. As freelancers and remote workers, we're constantly dealing with cross-border payments, and knowing the exact rate is crucial. If you need to check how much 1,500 Euros is in USD today, just type <em>"1500 EUR to USD"</em>. The dashboard immediately flips to the Currency tab and gives you the exact conversion based on the latest global forex data. No annoying pop-ups, no confusing charts you don't need—just the actual numbers.
              </p>
              <p>
                <strong className="text-gem-beige block mb-1">Save your brainpower for the work that matters</strong>
                Honestly, messing up time zone conversions is a guaranteed recipe for missed meetings and frustrated clients. By relying on our live world clocks and the meeting planner, you can finally stop triple-checking your Google Calendar invites. Feel free to bookmark this page—it's completely free to use, and you'll never be forced to create an account or sign in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
