import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const INTENT_LABELS = {
  time_conversion: { label: "Time Zone", color: "bg-blue-50 text-blue-700 border-blue-200" },
  meeting_overlap: { label: "Meeting Overlap", color: "bg-orange-50 text-orange-700 border-orange-200" },
  currency_conversion: { label: "Currency", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function AIInput({ onResult, initialQuery = "", autoSubmit = false, onAutoSubmitDone }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState(null);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (autoSubmit && initialQuery && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      setQuery(initialQuery);
      setTimeout(() => handleSubmit(initialQuery), 400);
    }
  }, [autoSubmit, initialQuery]);

  const handleSubmit = async (q = query) => {
    const text = (q || query).trim();
    if (!text) return;
    setLoading(true);
    setDetectedIntent(null);
    try {
      const res = await axios.post(`${API}/ai/parse`, { query: text });
      setDetectedIntent(res.data.intent);
      onResult?.({ ...res.data, originalQuery: text });
      onAutoSubmitDone?.();
    } catch (err) {
      toast.error("Failed to parse query — check your connection");
    } finally {
      setLoading(false);
    }
  };

  const intentMeta = detectedIntent ? INTENT_LABELS[detectedIntent] : null;

  return (
    <div data-testid="ai-input-section">
      <div className="glass-card rounded-2xl p-3 shadow-lg shadow-zinc-900/5">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDetectedIntent(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder='Ask anything: "Best meeting time for NY, London, Tokyo" or "Convert 100 USD to EUR"'
              className="w-full pl-10 pr-10 py-3 bg-transparent text-zinc-800 placeholder-zinc-400 outline-none text-sm sm:text-base"
              data-testid="ai-query-input"
              disabled={loading}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setDetectedIntent(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                data-testid="ai-input-clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-medium flex items-center gap-2 shrink-0 transition-transform active:scale-95"
            data-testid="ai-submit-btn"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Parsing...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Ask AI</>
            )}
          </Button>
        </div>
      </div>

      {intentMeta && (
        <div className="mt-2.5 flex items-center gap-2" data-testid="ai-intent-badge">
          <span className={`text-xs font-medium border rounded-full px-3 py-1 ${intentMeta.color}`}>
            Detected: {intentMeta.label}
          </span>
          <span className="text-xs text-zinc-400">Routing to the correct tool...</span>
        </div>
      )}
    </div>
  );
}
