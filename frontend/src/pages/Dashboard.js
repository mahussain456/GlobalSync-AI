import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Globe, ArrowLeft, Clock, TrendingUp, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIInput from "@/components/AIInput";
import TimeConverter from "@/components/TimeConverter";
import CurrencyConverter from "@/components/CurrencyConverter";
import HistoryPanel from "@/components/HistoryPanel";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("time");
  const [aiDispatch, setAiDispatch] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(searchParams.get("q") || "");

  const handleAIResult = async (result) => {
    setAiDispatch({ ...result, ts: Date.now() });
    const { intent, originalQuery } = result;
    if (intent === "currency_conversion") setActiveTab("currency");
    else if (intent === "time_conversion" || intent === "meeting_overlap") setActiveTab("time");
    // Save to history
    try {
      const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
      await axios.post(`${API}/history`, { query: originalQuery || "", intent, result: result.entities || {} });
    } catch { /* non-critical */ }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" data-testid="dashboard">
      {/* Header */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-zinc-400 hover:text-zinc-700 transition-colors" data-testid="back-to-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="font-heading font-semibold text-zinc-900">GlobalSync AI</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium border border-blue-100">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Live rates active
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
          <TabsList className="bg-white border border-zinc-200 p-1 rounded-xl mb-6 w-full sm:w-auto">
            <TabsTrigger value="time" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white" data-testid="tab-time">
              <Clock className="w-4 h-4" />
              Time Zones
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white" data-testid="tab-currency">
              <TrendingUp className="w-4 h-4" />
              Currency
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-zinc-900 data-[state=active]:text-white" data-testid="tab-history">
              <History className="w-4 h-4" />
              History
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
  );
}
