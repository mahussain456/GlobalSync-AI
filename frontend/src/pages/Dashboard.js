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
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import SavedTeamsPanel from "@/components/SavedTeamsPanel";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("time");
  const [aiDispatch, setAiDispatch] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(searchParams.get("q") || "");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("gs_user");
    try { if (stored) setUser(JSON.parse(stored)); } catch { /* Continue as guest. */ }
  }, []);

  useEffect(() => { setPendingQuery(searchParams.get("q") || ""); }, [searchParams]);

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
    setShowOnboarding(false);
  };

  const handleAIResult = async (result) => {
    setAiDispatch({ ...result, ts: Date.now() });
    const { intent, originalQuery } = result;
    if (intent === "currency_conversion") setActiveTab("currency");
    else if (intent === "time_conversion" || intent === "meeting_overlap") setActiveTab("time");

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
        <SiteNav />

        <div className="max-w-6xl mx-auto px-6 py-8">
          <header className="workspace-heading"><div><h1>Your global workspace.</h1><p>Compare time zones, check currencies, and find a shared moment to connect.</p></div><SavedTeamsPanel /></header>
          {/* AI Input */}
          <div className="mb-6 fade-in-up">
            <AIInput
              onResult={handleAIResult}
              key={searchParams.get("q") || "manual"}
              initialQuery={pendingQuery}
              autoSubmit={!!pendingQuery}
              onAutoSubmitDone={() => setPendingQuery("")}
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Globe,      label: "25+ Cities",       sub: "Time Zones",       color: "text-pine",   bg: "bg-surface"   },
              { icon: TrendingUp, label: "160+ Currencies",  sub: "Live Rates",        color: "text-pine",bg: "bg-surface"},
              { icon: Sparkles,   label: "AI-Powered",       sub: "Natural Language",  color: "text-pine", bg: "bg-surface" },
            ].map(({ icon: Icon, label, sub, color, bg }) => (
              <div key={label} className="dash-stat-card">
                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink font-heading truncate">{label}</div>
                  <div className="text-xs text-quiet truncate">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="dashboard-tabs">
            <TabsList className="bg-surface  rounded-xl border border-line text-ink p-1 mb-6 w-full sm:w-auto ">
              <TabsTrigger
                value="time"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest   transition-all"
                data-testid="tab-time"
              >
                <Clock className="w-4 h-4" /> Time Zones
              </TabsTrigger>
              <TabsTrigger
                value="currency"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest   transition-all"
                data-testid="tab-currency"
              >
                <TrendingUp className="w-4 h-4" /> Currency
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gem-gold data-[state=active]:text-gem-forest   transition-all"
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
          <div className="mt-16 bg-surface  rounded-xl p-8 md:p-10 border border-line text-ink  fade-in-up stagger-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6">
              How to Get the Most Out of GlobalSync
            </h2>
            <div className="space-y-5 text-quiet text-[15px] leading-relaxed">
              <p>
                Hey there! If you're working remotely or managing a distributed team, you already know the struggle. Trying to figure out what time it is for your co-worker in London while simultaneously calculating how much that invoice from Europe is actually worth in US dollars... it's just exhausting. We built the GlobalSync Dashboard specifically to solve that headache so you don't have to keep doing mental math.
              </p>
              <p>
                <strong className="text-ink block mb-1">Just type exactly like you talk</strong>
                The best part about this tool is the AI input box right at the top. You don't have to click through clunky dropdown menus or manually select time zones. Just type what's on your mind. Trying to set up a group call? Literally just type <em>"Best meeting time for New York, Dubai, and Singapore"</em> and hit enter. The AI will instantly calculate the business hour overlap for all three cities and show you the perfect window to schedule your call.
              </p>
              <p>
                <strong className="text-ink block mb-1">Currency conversion with dated reference rates</strong>
                Currency tools show the provider and update time for reference rates. As freelancers and remote workers, we're constantly dealing with cross-border payments, and knowing the exact rate is crucial. If you need to check how much 1,500 Euros is in USD today, just type <em>"1500 EUR to USD"</em>. The dashboard immediately flips to the Currency tab and gives you the exact conversion based on the latest global forex data. Cached snapshots are labeled when current provider data is unavailable.
              </p>
              <p>
                <strong className="text-ink block mb-1">Save your brainpower for the work that matters</strong>
                Honestly, messing up time zone conversions is a guaranteed recipe for missed meetings and frustrated clients. By relying on our live world clocks and the meeting planner, you can finally stop triple-checking your Google Calendar invites. Feel free to bookmark this page—it's completely free to use, and you'll never be forced to create an account or sign in.
              </p>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
