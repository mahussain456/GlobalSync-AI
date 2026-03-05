import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Clock, Plus, X, Users, AlertCircle, CheckCircle2, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const POPULAR_CITIES = [
  "New York", "San Francisco", "Chicago", "Toronto", "London", "Paris", "Berlin",
  "Amsterdam", "Dubai", "Mumbai", "Bangalore", "Singapore", "Tokyo", "Seoul",
  "Hong Kong", "Shanghai", "Bangkok", "Sydney", "Auckland", "São Paulo",
  "Mexico City", "Los Angeles", "Seattle", "Moscow", "Istanbul",
];

function getLocalTime(timezoneId) {
  if (!timezoneId) return { time: "--:--", time12: "-- : --", date: "", hour: 0 };
  try {
    const now = new Date();
    const time12 = now.toLocaleTimeString("en-US", { timeZone: timezoneId, hour: "2-digit", minute: "2-digit", hour12: true });
    const date = now.toLocaleDateString("en-US", { timeZone: timezoneId, weekday: "short", month: "short", day: "numeric" });
    const hourStr = new Intl.DateTimeFormat("en-US", { timeZone: timezoneId, hour: "numeric", hour12: false }).format(now);
    const hour = parseInt(hourStr) % 24;
    return { time12, date, hour, isBusinessHours: hour >= 9 && hour < 17 };
  } catch {
    return { time12: "--:--", date: "", hour: 0, isBusinessHours: false };
  }
}

function CityCard({ city, onRemove }) {
  const [timeData, setTimeData] = useState(getLocalTime(city.timezone_id));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(getLocalTime(city.timezone_id));
    }, 1000);
    return () => clearInterval(timer);
  }, [city.timezone_id]);

  return (
    <div className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${timeData.isBusinessHours ? "border-zinc-200" : "border-zinc-100 opacity-80"}`} data-testid={`city-card-${city.name}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-zinc-900">{city.name}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{city.utc_offset || city.timezone_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${timeData.isBusinessHours ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-50 text-zinc-500 border border-zinc-200"}`}>
            {timeData.isBusinessHours ? "In Office" : "Off Hours"}
          </span>
          {onRemove && (
            <button onClick={() => onRemove(city.name)} className="text-zinc-300 hover:text-zinc-600 transition-colors" data-testid={`remove-city-${city.name}`}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2">
        <div className="font-heading text-3xl font-semibold text-zinc-900 tabular-nums" data-testid={`city-time-${city.name}`}>
          {timeData.time12}
        </div>
        <div className="text-xs text-zinc-400 mt-1">{timeData.date}</div>
      </div>
    </div>
  );
}

function OverlapBar({ cityDetails, overlapStartDec, overlapEndDec }) {
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];
  return (
    <div className="space-y-3" data-testid="overlap-timeline">
      <div className="relative flex pl-24 pr-2 mb-1">
        {hours.map((h) => (
          <div key={h} className="absolute text-xs text-zinc-300" style={{ left: `calc(${(h / 24) * 100}% + 6rem)` }}>
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
      </div>
      {cityDetails.filter(c => c.known !== false).map((city) => {
        const start = city.business_start_utc_dec || 0;
        const end = city.business_end_utc_dec || 17;
        const endNorm = end > 24 ? 24 : end;
        const startPct = (start / 24) * 100;
        const widthPct = ((endNorm - start) / 24) * 100;
        const ovStartPct = overlapStartDec != null ? (overlapStartDec / 24) * 100 : null;
        const ovWidthPct = overlapStartDec != null && overlapEndDec != null
          ? ((overlapEndDec - overlapStartDec) / 24) * 100 : 0;
        return (
          <div key={city.name} className="flex items-center gap-3">
            <span className="w-24 text-xs text-right text-zinc-500 shrink-0 font-medium">{city.name}</span>
            <div className="flex-1 overlap-bar rounded-lg">
              <div
                className="overlap-segment bg-blue-100 rounded-lg"
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
              />
              {ovStartPct != null && ovWidthPct > 0 && (
                <div
                  className="overlap-segment bg-emerald-400 rounded-lg z-10"
                  style={{ left: `${ovStartPct}%`, width: `${ovWidthPct}%` }}
                />
              )}
            </div>
            <span className="text-xs text-zinc-400 shrink-0 w-32 hidden sm:block">
              {city.overlap_start_local ? `${city.overlap_start_local}` : city.business_hours_local}
            </span>
          </div>
        );
      })}
      <div className="flex gap-3 pl-24 mt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <div className="w-3 h-3 bg-blue-100 rounded" /> Business hrs
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <div className="w-3 h-3 bg-emerald-400 rounded" /> Overlap
        </div>
      </div>
    </div>
  );
}

export default function TimeConverter({ aiDispatch }) {
  const [selectedCities, setSelectedCities] = useState([
    { name: "New York", timezone_id: "America/New_York", utc_offset: "UTC-5" },
    { name: "London", timezone_id: "Europe/London", utc_offset: "UTC+0" },
    { name: "Mumbai", timezone_id: "Asia/Kolkata", utc_offset: "UTC+5:30" },
  ]);
  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [overlapResult, setOverlapResult] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [loadingOverlap, setLoadingOverlap] = useState(false);

  const fetchCityMeta = useCallback(async (cityNames) => {
    try {
      const res = await axios.post(`${API}/timezone/convert`, { cities: cityNames });
      return res.data.cities.filter(c => c.known !== false);
    } catch {
      return cityNames.map(name => ({ name, timezone_id: null, known: false }));
    }
  }, []);

  const addCity = async (cityName) => {
    if (selectedCities.find(c => c.name.toLowerCase() === cityName.toLowerCase())) {
      toast.info(`${cityName} is already added`);
      setCitySearch("");
      setShowDropdown(false);
      return;
    }
    if (selectedCities.length >= 5) {
      toast.warning("Maximum 5 cities allowed");
      return;
    }
    const meta = await fetchCityMeta([cityName]);
    if (meta.length && meta[0].timezone_id) {
      setSelectedCities(prev => [...prev, meta[0]]);
    } else {
      toast.error(`City "${cityName}" not found`);
    }
    setCitySearch("");
    setShowDropdown(false);
    setOverlapResult(null);
  };

  const removeCity = (cityName) => {
    setSelectedCities(prev => prev.filter(c => c.name !== cityName));
    setOverlapResult(null);
  };

  const handleFindOverlap = async () => {
    if (selectedCities.length < 2) { toast.warning("Add at least 2 cities"); return; }
    setLoadingOverlap(true);
    try {
      const res = await axios.post(`${API}/timezone/overlap`, { cities: selectedCities.map(c => c.name) });
      setOverlapResult(res.data);
      setConversionResult(null);
    } catch {
      toast.error("Failed to calculate overlap");
    } finally {
      setLoadingOverlap(false);
    }
  };

  useEffect(() => {
    if (!aiDispatch) return;
    const { intent, entities } = aiDispatch;
    const run = async () => {
      if (intent === "meeting_overlap" && entities?.cities?.length) {
        const meta = await fetchCityMeta(entities.cities);
        const valid = meta.filter(c => c.known !== false);
        if (valid.length) { setSelectedCities(valid); }
        setTimeout(async () => {
          setLoadingOverlap(true);
          try {
            const res = await axios.post(`${API}/timezone/overlap`, { cities: entities.cities });
            setOverlapResult(res.data);
          } catch { toast.error("Overlap failed"); }
          finally { setLoadingOverlap(false); }
        }, 300);
      } else if (intent === "time_conversion" && entities) {
        const citiesToShow = [...(entities.from_city ? [entities.from_city] : []), ...(entities.to_cities || [])];
        if (citiesToShow.length) {
          const meta = await fetchCityMeta(citiesToShow);
          const valid = meta.filter(c => c.known !== false);
          if (valid.length) setSelectedCities(valid);
        }
        if (entities.from_time && entities.from_city && entities.to_cities?.length) {
          try {
            const res = await axios.post(`${API}/timezone/convert`, {
              cities: entities.to_cities, from_time: entities.time || entities.from_time, from_city: entities.from_city,
            });
            setConversionResult(res.data);
            setOverlapResult(null);
          } catch { toast.error("Time conversion failed"); }
        }
      }
    };
    run();
  }, [aiDispatch, fetchCityMeta]);

  const shareOverlap = () => {
    const cities = selectedCities.map(c => c.name).join(", ");
    const q = `Best meeting time for ${cities}`;
    const url = `${window.location.origin}/dashboard?q=${encodeURIComponent(q)}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Share link copied!"));
  };

  const shareTimeConversion = () => {
    const cities = selectedCities.map(c => c.name).join(", ");
    const q = `What time is it in ${cities}`;
    const url = `${window.location.origin}/dashboard?q=${encodeURIComponent(q)}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Share link copied!"));
  };

  const copyOverlapResult = () => {
    if (!overlapResult?.has_overlap) return;
    const lines = overlapResult.city_details?.filter(c => c.best_time_local)
      .map(c => `${c.name}: ${c.best_time_local}`) || [];
    const text = `Best meeting time (${overlapResult.overlap_duration_hours}h window):\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => toast.success("Result copied!"));
  };

  const filtered = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase()) &&
    !selectedCities.find(sc => sc.name.toLowerCase() === c.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="time-converter">
      {/* City Selector */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-zinc-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> World Clocks
          </h2>
          <span className="text-xs text-zinc-400">{selectedCities.length}/5 cities</span>
        </div>

        {/* Add city input */}
        <div className="relative mb-5">
          <input
            value={citySearch}
            onChange={(e) => { setCitySearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Add a city (e.g. Tokyo, Dubai, Berlin)..."
            className="w-full h-10 px-4 rounded-xl border border-zinc-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            data-testid="city-search-input"
            onKeyDown={(e) => { if (e.key === "Enter" && citySearch.trim()) addCity(citySearch.trim()); }}
          />
          {showDropdown && (citySearch || true) && filtered.length > 0 && (
            <div className="absolute z-50 top-11 left-0 right-0 bg-white border border-zinc-200 rounded-xl shadow-xl max-h-48 overflow-y-auto" data-testid="city-dropdown">
              {filtered.slice(0, 12).map((city) => (
                <button
                  key={city}
                  onMouseDown={() => addCity(city)}
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  data-testid={`city-option-${city}`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCities.map((city) => (
            <CityCard key={city.name} city={city} onRemove={removeCity} />
          ))}
        </div>

        {/* Find Overlap Button */}
        {selectedCities.length >= 2 && (
          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleFindOverlap}
              disabled={loadingOverlap}
              className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-700 flex items-center gap-2"
              data-testid="find-overlap-btn"
            >
              <Users className="w-4 h-4" />
              {loadingOverlap ? "Finding overlap..." : "Find Meeting Overlap"}
            </Button>
          </div>
        )}
      </div>

      {/* Conversion Result */}
      {conversionResult?.conversion_note && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 fade-in-up" data-testid="conversion-result">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-zinc-900">{conversionResult.conversion_note}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={shareTimeConversion}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-all"
                data-testid="share-time-btn"
                title="Share this conversion"
              >
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversionResult.cities?.map(city => (
              <div key={city.name} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-sm font-medium text-zinc-700 mb-1">{city.name}</div>
                <div className="font-heading text-2xl font-semibold text-zinc-900" data-testid={`converted-time-${city.name}`}>{city.current_time_12h}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{city.date} · {city.timezone_abbr}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlap Result */}
      {overlapResult && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 fade-in-up" data-testid="overlap-result">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-heading font-semibold text-zinc-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Meeting Overlap
            </h3>
            <div className="flex items-center gap-2">
              {overlapResult.has_overlap ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {overlapResult.overlap_duration_hours}h window found
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  No overlap
                </span>
              )}
              {overlapResult.has_overlap && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={copyOverlapResult}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-800 text-xs font-medium transition-all"
                    data-testid="copy-overlap-btn"
                    title="Copy result"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                  <button
                    onClick={shareOverlap}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-all"
                    data-testid="share-overlap-btn"
                    title="Share this overlap"
                  >
                    <Share2 className="w-3 h-3" /> Share
                  </button>
                </div>
              )}
            </div>
          </div>

          {overlapResult.has_overlap ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <div className="text-xs text-zinc-400 mb-1">Window (UTC)</div>
                  <div className="font-heading font-semibold text-zinc-900 text-sm" data-testid="overlap-window">
                    {overlapResult.overlap_start_utc} – {overlapResult.overlap_end_utc}
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 col-span-1 sm:col-span-2">
                  <div className="text-xs text-emerald-600 mb-1">Best Meeting Time</div>
                  <div className="space-y-0.5">
                    {overlapResult.city_details?.filter(c => c.best_time_local).map(city => (
                      <div key={city.name} className="text-sm text-emerald-900 font-medium">
                        <span className="text-emerald-600">{city.name}:</span> {city.best_time_local}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <OverlapBar
                cityDetails={overlapResult.city_details || []}
                overlapStartDec={overlapResult.overlap_start_dec}
                overlapEndDec={overlapResult.overlap_end_dec}
              />
            </>
          ) : (
            <p className="text-sm text-zinc-500 py-2">{overlapResult.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
