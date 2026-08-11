import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const INTENT_LABELS = {
  time_conversion: { label: "Time Zone", color: "bg-gem-forest/60 text-gem-beige border-gem-gold/30 shadow-[0_0_10px_rgba(200,169,106,0.2)]" },
  meeting_overlap: { label: "Meeting Overlap", color: "bg-gem-forest/60 text-gem-beige border-gem-gold/30 shadow-[0_0_10px_rgba(200,169,106,0.2)]" },
  currency_conversion: { label: "Currency", color: "bg-gem-forest/60 text-gem-beige border-gem-gold/30 shadow-[0_0_10px_rgba(200,169,106,0.2)]" },
};

const KNOWN_CITIES = [
  "New York", "NYC", "New York City",
  "Los Angeles", "LA", "San Francisco", "SF",
  "Chicago", "Houston", "Dallas", "Denver", "Phoenix", "Seattle",
  "Boston", "Miami", "Atlanta", "Toronto", "Vancouver", "Montreal",
  "Mexico City", "São Paulo", "Sao Paulo", "Buenos Aires",
  "Bogota", "Lima", "Santiago", "London", "Paris", "Berlin",
  "Amsterdam", "Madrid", "Rome", "Milan", "Zurich", "Geneva",
  "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Warsaw", "Prague",
  "Vienna", "Brussels", "Lisbon", "Athens", "Moscow", "Istanbul",
  "Dubai", "Abu Dhabi", "Riyadh", "Doha", "Kuwait City",
  "Cairo", "Nairobi", "Lagos", "Johannesburg", "Cape Town", "Casablanca",
  "Mumbai", "Delhi", "New Delhi", "Bangalore", "Bengaluru", "Kolkata",
  "Chennai", "Hyderabad", "India", "Karachi", "Islamabad", "Lahore",
  "Dhaka", "Colombo", "Kathmandu", "Singapore", "Kuala Lumpur", "KL",
  "Jakarta", "Bangkok", "Ho Chi Minh City", "Hanoi", "Manila",
  "Hong Kong", "HK", "Taipei", "Seoul", "Tokyo", "Osaka",
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu",
  "Almaty", "Tashkent", "Sydney", "Melbourne", "Brisbane", "Perth",
  "Auckland", "Honolulu", "Hawaii"
];

function localParseQuery(query) {
  const qLower = query.toLowerCase().trim();
  const qUpper = query.toUpperCase().trim();

  let intent = "time_conversion";

  const currencyKeywords = ["convert", "exchange", "rate", "currency", "forex", "fx", "dollar", "euro", "pound", "yen", "rupee", "usd", "eur", "gbp", "jpy", "inr", "cad", "aud", "chf", "cny", "sgd"];
  const meetingKeywords = ["meeting", "overlap", "best time", "schedule", "call", "business hours", "sync", "slot"];

  const hasCurrencyWord = currencyKeywords.some(kw => {
    if (kw.length <= 3) {
      return new RegExp(`\\b${kw}\\b`, 'i').test(query);
    }
    return qLower.includes(kw);
  });
  const hasNumber = /\d+/.test(query);
  const hasMeetingWord = meetingKeywords.some(kw => qLower.includes(kw));

  if (hasCurrencyWord && (hasNumber || qLower.includes("to") || qLower.includes("convert"))) {
    intent = "currency_conversion";
  } else if (hasMeetingWord) {
    intent = "meeting_overlap";
  }

  if (intent === "currency_conversion") {
    const amtMatch = query.match(/(\d+(?:\.\d+)?)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : 1.0;

    const currencyCodes = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY", "SGD"];
    const currencyMap = {
      "$": "USD", "€": "EUR", "£": "GBP", "¥": "JPY", "₹": "INR",
      "usd": "USD", "eur": "EUR", "gbp": "GBP", "jpy": "JPY", "inr": "INR",
      "cad": "CAD", "aud": "AUD", "chf": "CHF", "cny": "CNY", "sgd": "SGD",
      "dollar": "USD", "dollars": "USD", "euro": "EUR", "euros": "EUR",
      "pound": "GBP", "pounds": "GBP", "yen": "JPY", "rupee": "INR", "rupees": "INR"
    };

    const foundCurrencies = [];
    const words = qLower.split(/[^a-z0-9$€£¥₹]/);
    for (const word of words) {
      if (currencyMap[word]) {
        foundCurrencies.push(currencyMap[word]);
      }
    }
    for (const sym of ["$", "€", "£", "¥", "₹"]) {
      if (query.includes(sym)) {
        foundCurrencies.push(currencyMap[sym]);
      }
    }
    const upperWords = qUpper.split(/[^A-Z]/);
    for (const uw of upperWords) {
      if (currencyCodes.includes(uw)) {
        foundCurrencies.push(uw);
      }
    }

    const uniqueCurrencies = Array.from(new Set(foundCurrencies));
    const from_currency = uniqueCurrencies[0] || "USD";
    const to_currency = uniqueCurrencies[1] || (from_currency === "USD" ? "EUR" : "USD");

    return {
      intent,
      entities: { amount, from_currency, to_currency }
    };
  }

  let tempQuery = query;
  const foundCities = [];
  const sortedKnownCities = [...KNOWN_CITIES].sort((a, b) => b.length - a.length);

  for (const city of sortedKnownCities) {
    let matched = false;
    if (city.length <= 3) {
      const rx = new RegExp(`\\b${city}\\b`, 'i');
      if (rx.test(tempQuery)) {
        matched = true;
        tempQuery = tempQuery.replace(rx, " ");
      }
    } else {
      const idx = tempQuery.toLowerCase().indexOf(city.toLowerCase());
      if (idx !== -1) {
        matched = true;
        tempQuery = tempQuery.substring(0, idx) + " " + tempQuery.substring(idx + city.length);
      }
    }
    if (matched) {
      foundCities.push(city);
    }
  }

  if (intent === "meeting_overlap") {
    const cities = foundCities.length > 0 ? foundCities : ["New York", "London", "Tokyo"];
    return {
      intent,
      entities: { cities }
    };
  }

  const timeRegex = /\b((?:1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:am|pm)?|(?:[01]?[0-9]|2[0-3]):[0-5][0-9]|noon|midnight|[1-9]\s*(?:am|pm))\b/i;
  const timeMatch = query.match(timeRegex);
  const time = timeMatch ? timeMatch[1].trim() : null;

  const from_city = foundCities[0] || null;
  const to_cities = foundCities.length > 1 ? foundCities.slice(1) : (from_city ? [] : ["London"]);

  return {
    intent,
    entities: {
      from_city,
      to_cities,
      from_time: time,
      time
    }
  };
}

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
      handleSubmit(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Offline fallback: parse locally and trigger UI gracefully without errors
      const localResult = localParseQuery(text);
      setDetectedIntent(localResult.intent);
      onResult?.({ ...localResult, originalQuery: text });
      onAutoSubmitDone?.();
      setTimeout(() => setDetectedIntent(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const intentMeta = detectedIntent ? INTENT_LABELS[detectedIntent] : null;

  return (
    <div data-testid="ai-input-section" className={`ai-glow-wrap${isFocused ? " focused" : ""}`}>
      <div className="bg-white/5 backdrop-blur-xl rounded-[28px] p-3 shadow-2xl border border-white/10 transition-all">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-gem-gold text-gem-forest flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-gem-forest" />
            </div>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setDetectedIntent(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder='Ask anything: "Best meeting time for NY, London, Tokyo" or "Convert 100 USD to EUR"'
              className="w-full pl-14 pr-10 py-3.5 bg-transparent text-gem-beige placeholder-gem-mist/50 outline-none text-sm sm:text-base font-medium"
              data-testid="ai-query-input"
              disabled={loading}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setDetectedIntent(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gem-sage hover:text-gem-beige"
                data-testid="ai-input-clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="rounded-[28px] bg-gem-gold text-gem-forest px-5 py-3 font-semibold flex items-center gap-2 shrink-0 border-0 shadow-md hover:opacity-90 transition-all"
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
          <span className="text-xs text-gem-sage">Routing to the correct tool...</span>
        </div>
      )}
    </div>
  );
}
