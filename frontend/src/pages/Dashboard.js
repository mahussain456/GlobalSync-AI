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
      const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
      await axios.post(`${API}/history`, { query: originalQuery || "", intent, result: result.entities || {} });
    } catch { /* non-critical */ }
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}

      <div className="min-h-screen bg-[#F8FAFC]" data-testid="dashboard">
        {/* Header — gradient accent */}
        <header className="bg-white border-b border-zinc-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-zinc-400 hover:text-zinc-700 transition-colors" data-testid="back-to-home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="GlobalSync AI" className="h-9 w-auto" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium border border-emerald-200">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live rates active
              </div>
              {user && user.name !== "Guest" && (
                <div className="hidden sm:flex items-center gap-1.5 stat-badge rounded-full px-3 py-1 text-xs font-medium text-blue-700">
                  <Sparkles className="w-3 h-3" />
                  {user.name}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* AI Input */}
          <div className="mb-8 fade-in-up">
            <AIInput
              onResult={handleAIResult}
              initialQuery={pendingQuery}
              autoSubmit={!!pendingQuery}
              onAutoSubmitDone={() => setPendingQuery("")}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="dashboard-tabs">
            <TabsList className="bg-white border border-zinc-200 p-1 rounded-2xl mb-6 w-full sm:w-auto shadow-sm">
              <TabsTrigger
                value="time"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                data-testid="tab-time"
              >
                <Clock className="w-4 h-4" /> Time Zones
              </TabsTrigger>
              <TabsTrigger
                value="currency"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                data-testid="tab-currency"
              >
                <TrendingUp className="w-4 h-4" /> Currency
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-zinc-700 data-[state=active]:to-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
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
        </div>
      </div>
    </>
  );
}
