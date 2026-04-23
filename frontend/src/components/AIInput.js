import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const INTENT_LABELS = {
  time_conversion: { label: "Time Zone", color: "bg-blue-50 text-blue-700 border-blue-200" },
  meeting_overlap: { label: "Meeting Overlap", color: "bg-orange-50 text-orange-700 border-orange-200" },
  currency_conversion: { label: "Currency", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function AIInput({ onResult, initialQuery = "", autoSubmit = false, onAutoSubmitDone }) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [detectedIntent, setDetectedIntent] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
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
      // Auto-clear intent badge after 3s
      setTimeout(() => setDetectedIntent(null), 3000);
    } catch (err) {
      toast.error("Failed to parse query — check your connection");
    } finally {
      setLoading(false);
    }
  };

  const intentMeta = detectedIntent ? INTENT_LABELS[detectedIntent] : null;

  return (
    <div data-testid="ai-input-section" className={`ai-glow-wrap${isFocused ? " focused" : ""}`}>
      <div className="glass-light rounded-2xl p-3 shadow-lg shadow-zinc-900/5 border border-zinc-200/60">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDetectedIntent(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='Ask anything: "Best meeting time for NY, London, Tokyo" or "Convert 100 USD to EUR"'
              className="w-full pl-14 pr-10 py-3.5 bg-transparent text-zinc-800 placeholder-zinc-400 outline-none text-sm sm:text-base font-medium"
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
            className="rounded-xl btn-gradient px-5 py-3 font-semibold flex items-center gap-2 shrink-0 border-0"
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
