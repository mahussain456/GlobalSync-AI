import { useState, useEffect } from "react";
import axios from "axios";
import { History, Clock, TrendingUp, Users, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const INTENT_META = {
  time_conversion: { label: "Time Zone", icon: Clock, color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" },
  meeting_overlap: { label: "Meeting Overlap", icon: Users, color: "bg-orange-500/10 text-orange-300 border-orange-500/30" },
  currency_conversion: { label: "Currency", icon: TrendingUp, color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
};

function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ResultSummary({ intent, result }) {
  if (intent === "currency_conversion") {
    const r = result?.conversion || result;
    return r?.formatted ? (
      <p className="text-sm text-[#4F7C82] mt-1">{r.formatted}</p>
    ) : null;
  }
  if (intent === "meeting_overlap") {
    const r = result?.overlap || result;
    return r?.has_overlap ? (
      <p className="text-sm text-[#4F7C82] mt-1">Overlap: {r.overlap_start_utc} – {r.overlap_end_utc}</p>
    ) : (
      <p className="text-sm text-[#4F7C82] mt-1">No overlap found</p>
    );
  }
  if (intent === "time_conversion") {
    const cities = result?.cities || [];
    return cities.length ? (
      <p className="text-sm text-[#4F7C82] mt-1">{cities.map(c => `${c.name}: ${c.current_time_12h}`).join(" · ")}</p>
    ) : null;
  }
  return null;
}

export default function HistoryPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/history`);
      setItems(res.data.items || []);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${API}/history`);
      setItems([]);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="space-y-4" data-testid="history-panel">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#4F7C82]" />
          Query History
          {items.length > 0 && (
            <span className="text-xs bg-white/5 text-[#93B1B5] rounded-full px-2 py-0.5">{items.length}</span>
          )}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={fetchHistory} className="text-[#93B1B5] hover:text-white hover:bg-white/5" data-testid="refresh-history-btn">
            <RefreshCw className="w-4 h-4" />
          </Button>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10" data-testid="clear-history-btn">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12" data-testid="history-loading">
          <Loader2 className="w-6 h-6 text-[#4F7C82] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#0B2E33]/40 backdrop-blur-xl rounded-2xl border border-white/10" data-testid="history-empty">
          <History className="w-10 h-10 text-[#4F7C82] mx-auto mb-3" />
          <p className="text-sm text-[#93B1B5]">No queries yet. Use the AI input to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const meta = INTENT_META[item.intent] || INTENT_META.time_conversion;
            const Icon = meta.icon;
            return (
              <div key={item.id} className="bg-[#0B2E33]/40 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:border-[#4F7C82]/50 transition-colors shadow-lg" data-testid={`history-item-${item.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-medium border rounded-full px-2 py-0.5 flex items-center gap-1 ${meta.color}`}>
                        <Icon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#B8E3E9] truncate" data-testid={`history-query-${item.id}`}>
                      "{item.query}"
                    </p>
                    <ResultSummary intent={item.intent} result={item.result} />
                  </div>
                  <span className="text-xs text-[#4F7C82] shrink-0 mt-0.5">{formatTime(item.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
