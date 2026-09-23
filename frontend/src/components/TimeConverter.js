import { CITY_TIMEZONES } from "@/lib/cityTimezones";
import { fireAnalyticsEvent } from "@/lib/analytics";
import { meetingWindows, resolveWallTime } from "@/lib/timeCalculations";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Clock, Plus, X, Users, AlertCircle, CheckCircle2, Share2, Copy, Star, Sun, Moon, Sunrise, Sunset, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const POPULAR_CITIES = [
  "New York", "San Francisco", "Chicago", "Toronto", "London", "Paris", "Berlin",
  "Amsterdam", "Dubai", "Mumbai", "Bangalore", "Singapore", "Tokyo", "Seoul",
  "Hong Kong", "Shanghai", "Bangkok", "Sydney", "Auckland", "São Paulo",
  "Mexico City", "Los Angeles", "Seattle", "Moscow", "Istanbul",
];

// Helper to parse timezone offsets (e.g., "UTC-5", "UTC+5:30", "UTC+0") into numerical decimal hours
export function parseOffset(offsetStr) {
  if (!offsetStr) return 0;
  const match = offsetStr.match(/UTC([+-])?(\d+)?(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = match[2] ? parseInt(match[2], 10) : 0;
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours + minutes / 60);
}

// Client-side fallback database for city-to-timezone matching
export { CITY_TIMEZONES } from "@/lib/cityTimezones";

export function getLocalCityTimezone(cityName) {
  const clean = cityName.trim();
  if (CITY_TIMEZONES[clean]) return { name: clean, timezoneId: CITY_TIMEZONES[clean] };

  // Title case check
  const titleCase = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  if (CITY_TIMEZONES[titleCase]) return { name: titleCase, timezoneId: CITY_TIMEZONES[titleCase] };

  const lower = clean.toLowerCase();

  // Try exact case-insensitive match
  for (const [k, v] of Object.entries(CITY_TIMEZONES)) {
    if (k.toLowerCase() === lower) {
      return { name: k, timezoneId: v };
    }
  }

  // Try substring match
  for (const [k, v] of Object.entries(CITY_TIMEZONES)) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) {
      return { name: k, timezoneId: v };
    }
  }

  return null;
}

export function isValidTimezone(tz) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (ex) {
    return false;
  }
}

export function getNormalizedUtcOffset(timezoneId, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneId,
      timeZoneName: "longOffset",
    }).formatToParts(date);
    const tzPart = parts.find(p => p.type === "timeZoneName");
    if (tzPart) {
      const val = tzPart.value;
      if (val === "GMT" || val === "UTC" || val === "GMT+0" || val === "GMT-0") {
        return "UTC+0";
      }
      const match = val.match(/(?:GMT|UTC)([+-])(\d+)(?::(\d+))?/);
      if (match) {
        const sign = match[1];
        const hours = parseInt(match[2], 10);
        const minutes = match[3] ? parseInt(match[3], 10) : 0;
        if (minutes === 0) {
          return `UTC${sign}${hours}`;
        } else {
          return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
        }
      }
    }
  } catch (err) {
    console.error("Offset detection error:", err);
  }
  return "UTC+0";
}

export function getLocalHourInUtc(timezoneId, targetHour, referenceDate = new Date()) {
  const d = new Date(referenceDate);
  d.setUTCHours(targetHour, 0, 0, 0);

  const offsetDecimal = parseOffset(getNormalizedUtcOffset(timezoneId, d));
  const utcHour = (targetHour - offsetDecimal + 24) % 24;

  const result = new Date(d);
  result.setUTCHours(Math.floor(utcHour), (utcHour % 1) * 60, 0, 0);
  return result;
}

export function clientSideMeetingOverlap(selectedCities, startHour = 9, endHour = 17, referenceDate = new Date()) {
  try {
    const today = new Date(referenceDate);
    const cityRanges = [];
    const cityDetails = [];

    for (const city of selectedCities) {
      const tzName = city.timezone_id;
      if (!tzName) {
        cityDetails.push({ name: city.name, error: "City not found", known: false });
        continue;
      }

      const localStart = getLocalHourInUtc(tzName, startHour, today);
      const localEnd = getLocalHourInUtc(tzName, endHour, today);

      const startDec = localStart.getUTCHours() + localStart.getUTCMinutes() / 60;
      let endDec = localEnd.getUTCHours() + localEnd.getUTCMinutes() / 60;
      if (endDec <= startDec) {
        endDec += 24;
      }

      const abbr = new Intl.DateTimeFormat("en-US", { timeZone: tzName, timeZoneName: "short" })
        .formatToParts(today)
        .find(p => p.type === "timeZoneName")?.value || "";

      const formatTime12 = (d) => {
        return d.toLocaleTimeString("en-US", { timeZone: tzName, hour: "2-digit", minute: "2-digit", hour12: true });
      };

      cityRanges.push({
        name: city.name,
        localStart,
        localEnd,
        startDec,
        endDec,
        tzName
      });

      cityDetails.push({
        name: city.name,
        timezone_id: tzName,
        timezone_abbr: abbr,
        business_hours_local: `${formatTime12(localStart)} - ${formatTime12(localEnd)}`,
        business_start_utc_dec: startDec,
        business_end_utc_dec: endDec,
        known: true
      });
    }

    if (cityRanges.length < 2) {
      return { has_overlap: false, message: "Add at least 2 valid cities to find overlap", city_details: cityDetails };
    }

    const windows = meetingWindows(cityRanges.map(city => city.tzName), today, startHour, endHour);
    if (!windows.length) return {has_overlap: false, message: "No overlapping business hours between these cities", city_details: cityDetails};
    const best = [...windows].sort((a,b) => b.minutes-a.minutes)[0];
    const {startTick, endTick, start: overlapStartUtc, end: overlapEndUtc, minutes: overlapMins} = best;
    const bestUtc = new Date(overlapStartUtc.getTime() + Math.floor(overlapMins/2) * 60000);
    const overlapStartDec = startTick / 4;
    const overlapEndDec = endTick / 4;

    for (const detail of cityDetails) {
      if (!detail.known) continue;
      const tz = detail.timezone_id;
      const fmt = (d) => d.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
      detail.overlap_start_local = fmt(overlapStartUtc);
      detail.overlap_end_local = fmt(overlapEndUtc);
      detail.best_time_local = fmt(bestUtc);
    }

    const formatTime24 = (d) => {
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      return `${h}:${m} UTC`;
    };

    return {
      has_overlap: true,
      overlap_start_utc: formatTime24(overlapStartUtc),
      overlap_end_utc: formatTime24(overlapEndUtc),
      overlap_start_dec: overlapStartDec,
      overlap_end_dec: overlapEndDec,
      overlap_duration_hours: overlapMins / 60,
      best_meeting_time_utc: formatTime24(bestUtc),
      city_details: cityDetails,
      message: `${Math.floor(overlapMins / 60)}h ${overlapMins % 60}m overlap window found`
    };
  } catch (err) {
    console.error("Client-side overlap calculation failed:", err);
    return { has_overlap: false, message: "Error calculating meeting overlap client-side", city_details: [] };
  }
}


// Helper to get card visual theme classes and properties based on local hour
export function getCardTheme(hour) {
  // Night: 10 PM - 5 AM (22, 23, 0, 1, 2, 3, 4, 5)
  if (hour >= 22 || hour < 6) {
    return {
      bg: "bg-wash",
      border: "border-line hover:border-pine/40",
      glow: "bg-transparent",
      text: "text-pine",
      iconColor: "text-pine",
      label: "Night",
      icon: Moon
    };
  }
  // Sunrise: 6 AM - 8 AM (6, 7, 8)
  if (hour >= 6 && hour < 9) {
    return {
      bg: "bg-wash",
      border: "border-line hover:border-pine/40",
      glow: "bg-transparent",
      text: "text-pine",
      iconColor: "text-pine",
      label: "Sunrise",
      icon: Sunrise
    };
  }
  // Work Hours: 9 AM - 4 PM (9 to 16)
  if (hour >= 9 && hour < 17) {
    return {
      bg: "bg-wash",
      border: "border-line hover:border-pine/40",
      glow: "bg-transparent",
      text: "text-ink",
      iconColor: "text-pine",
      label: "In Office",
      icon: Sun
    };
  }
  // Sunset: 5 PM - 9 PM (17 to 21)
  return {
    bg: "bg-wash",
    border: "border-line hover:border-pine/40",
    glow: "bg-transparent",
    text: "text-pine",
    iconColor: "text-pine",
    label: "Sunset",
    icon: Sunset
  };
}

// Client-side shifted time mathematics
export function getShiftedTime(targetTimezoneId, targetUtcOffset, baseUtcOffset, baseLocalHour, baseDate = new Date()) {
  try {
    const baseOffset = parseOffset(baseUtcOffset);
    const targetOffset = parseOffset(targetUtcOffset);

    // Construct UTC base target date
    const utcDate = new Date(baseDate);
    utcDate.setUTCHours(baseLocalHour, 0, 0, 0);

    // Convert to actual target timestamp using difference
    const finalTimestamp = utcDate.getTime() - (baseOffset * 3600000);
    const targetDate = new Date(finalTimestamp);

    const time12 = targetDate.toLocaleTimeString("en-US", {
      timeZone: targetTimezoneId,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const date = targetDate.toLocaleDateString("en-US", {
      timeZone: targetTimezoneId,
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    const hourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimezoneId,
      hour: "numeric",
      hour12: false
    }).format(targetDate);

    const hour = parseInt(hourStr) % 24;

    return {
      time12,
      date,
      hour,
      isBusinessHours: hour >= 9 && hour < 17
    };
  } catch (err) {
    console.error("Shift computation error:", err);
    return { time12: "--:--", date: "", hour: 0, isBusinessHours: false };
  }
}

// Live ticking time format helper
export function getLocalTime(timezoneId, liveTime = new Date()) {
  // liveTime is null during SSR prerender (when useState(null) is used to avoid #418 hydration mismatch)
  if (!timezoneId || !liveTime) return { time12: "--:--", date: "", hour: 0, isBusinessHours: false };
  try {
    const time12 = liveTime.toLocaleTimeString("en-US", { timeZone: timezoneId, hour: "2-digit", minute: "2-digit", hour12: true });
    const date = liveTime.toLocaleDateString("en-US", { timeZone: timezoneId, weekday: "short", month: "short", day: "numeric" });
    const hourStr = new Intl.DateTimeFormat("en-US", { timeZone: timezoneId, hour: "numeric", hour12: false }).format(liveTime);
    const hour = parseInt(hourStr) % 24;
    return { time12, date, hour, isBusinessHours: hour >= 9 && hour < 17 };
  } catch {
    return { time12: "--:--", date: "", hour: 0, isBusinessHours: false };
  }
}

function CityCard({ city, isBase, makeBase, timeData, onRemove }) {
  const theme = getCardTheme(timeData.hour);
  const ThemeIcon = theme.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-500 ${theme.bg} ${theme.border} group`}
      data-testid={`city-card-${city.name}`}
    >
      {/* Glow highlight */}
      <div className={`absolute inset-0 ${theme.glow} pointer-events-none transition-opacity duration-500`} />

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-heading font-bold text-ink text-lg tracking-tight group-hover:text-pine transition-colors">{city.name}</h3>
            <button
              onClick={makeBase}
              className="p-1 rounded text-ink hover:text-pine hover:scale-115 transition-all"
              title={isBase ? "Base Reference City" : "Set as Base Reference City"}
              data-testid={`star-btn-${city.name}`}
            >
              <Star className={`w-4 h-4 ${isBase ? "fill-gem-gold text-pine filter drop-" : "text-ink"}`} />
            </button>
          </div>
          <p className="text-xs text-quiet font-medium mt-0.5">{city.utc_offset || city.timezone_id}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 font-bold flex items-center gap-1 bg-surface border border-line ${theme.text}`}>
            <ThemeIcon className="w-3 h-3" /> {theme.label}
          </span>
          {onRemove && (
            <button
              onClick={() => onRemove(city.name)}
              className="text-ink hover:text-orange-800 transition-colors p-1 rounded-full hover:bg-surface"
              data-testid={`remove-city-${city.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <div
          className="font-heading text-4xl font-bold text-ink tracking-tight tabular-nums flex items-baseline gap-1"
          data-testid={`city-time-${city.name}`}
        >
          {timeData.time12.split(" ")[0]}
          <span className="text-sm font-semibold text-quiet uppercase">{timeData.time12.split(" ")[1]}</span>
        </div>
        <div className="text-xs text-quiet mt-1.5 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-pine" /> {timeData.date}
        </div>
      </div>
    </div>
  );
}

function OverlapBar({ cityDetails, overlapStartDec, overlapEndDec }) {
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];
  return (
    <div className="space-y-4" data-testid="overlap-timeline">
      <div className="relative ml-[7.75rem] mr-2 mb-2 h-4">
        {hours.map((h) => (
          <div key={h} className="absolute text-[10px] font-bold text-quiet" style={{ left: `${(h / 24) * 100}%`, transform: "translateX(-50%)" }}>
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
          <div key={city.name} className="flex items-center gap-3 group">
            <span className="w-28 text-xs text-right text-quiet font-semibold truncate shrink-0 tracking-tight">{city.name}</span>
            <div className="flex-1 bg-surface h-2.5 rounded-full relative overflow-hidden border border-line">
              {/* Local Business Hours (Base Track) */}
              <div
                className="absolute h-full bg-gem-gold/15 rounded-full transition-all duration-300"
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
              />
              {/* Overlapping Zone (Highlight Track) */}
              {ovStartPct != null && ovWidthPct > 0 && (
                <div
                  className="absolute h-full bg-gem-gold rounded-full z-10  transition-all duration-300"
                  style={{ left: `${ovStartPct}%`, width: `${ovWidthPct}%` }}
                />
              )}
            </div>
            <span className="text-[10px] text-quiet shrink-0 w-32 hidden md:block font-medium">
              {city.overlap_start_local ? `${city.overlap_start_local}` : city.business_hours_local}
            </span>
          </div>
        );
      })}

      <div className="flex gap-4 pl-28 mt-4 pt-2 border-t border-line">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-quiet">
          <div className="w-3 h-1.5 bg-gem-gold/20 rounded" /> Local Business Hours (9am-5pm)
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-pine">
          <div className="w-3 h-1.5 bg-gem-gold rounded " /> Overlapping Time Window
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
  const [meetingDate, setMeetingDate] = useState("");
  const [queryAnswer, setQueryAnswer] = useState(null);
  const [baseCityName, setBaseCityName] = useState("New York");
  const [selectedHour, setSelectedHour] = useState(12);
  const [isCustomTime, setIsCustomTime] = useState(false);
  // ⚠️ Do NOT initialise with new Date() — causes React #418 SSR hydration mismatch.
  // Seeded to null; a useEffect sets it client-side after mount.
  const [liveTime, setLiveTime] = useState(null);

  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [overlapResult, setOverlapResult] = useState(null);
  const [loadingOverlap, setLoadingOverlap] = useState(false);

  // Maintain real-world clock updates
  useEffect(() => {
    // Set initial time immediately on mount (client-only)
    setLiveTime(new Date());
    setSelectedCities(cities => cities.map(city => ({...city, utc_offset: getNormalizedUtcOffset(city.timezone_id)})));
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update selected slider hour dynamically in live ticking mode
  useEffect(() => {
    if (!isCustomTime && liveTime) {  // liveTime is null during SSR prerender
      const baseCity = selectedCities.find(c => c.name === baseCityName) || selectedCities[0];
      if (baseCity?.timezone_id) {
        try {
          const hourStr = new Intl.DateTimeFormat("en-US", {
            timeZone: baseCity.timezone_id,
            hour: "numeric",
            hour12: false
          }).format(liveTime);
          setSelectedHour(parseInt(hourStr) % 24);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [liveTime, isCustomTime, baseCityName, selectedCities]);

  useEffect(() => {
    setOverlapResult(clientSideMeetingOverlap(selectedCities, 9, 17, meetingDate ? new Date(meetingDate + "T12:00:00Z") : new Date()));
  }, [selectedCities, meetingDate]);

  const fetchCityMeta = useCallback(async (cityNames) => cityNames.map(name => {
    const resolved = getLocalCityTimezone(name);
    const timezone = resolved?.timezoneId || (isValidTimezone(name) ? name : null);
    return {name: resolved?.name || name, timezone_id: timezone, known: !!timezone,
      utc_offset: timezone ? getNormalizedUtcOffset(timezone) : ""};
  }), []);

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
      toast.success(`Added ${meta[0].name}`);
    } else {
      toast.error(`City "${cityName}" not found`);
    }
    setCitySearch("");
    setShowDropdown(false);
  };

  const removeCity = (cityName) => {
    setSelectedCities(prev => {
      const updated = prev.filter(c => c.name !== cityName);
      // Recalibrate base city if we deleted it
      if (cityName === baseCityName && updated.length > 0) {
        setBaseCityName(updated[0].name);
      }
      return updated;
    });
  };

  // Click star selector helper
  const handleMakeBase = (city) => {
    if (isCustomTime) {
      const currentBase = selectedCities.find(c => c.name === baseCityName) || selectedCities[0];
      const newBaseOffset = parseOffset(city.utc_offset);
      const oldBaseOffset = parseOffset(currentBase.utc_offset);
      const newHour = (selectedHour + (newBaseOffset - oldBaseOffset) + 24) % 24;
      setSelectedHour(Math.round(newHour));
    }
    setBaseCityName(city.name);
    toast.success(`Starred ${city.name} as base reference`);
  };

  useEffect(() => {
    if (!aiDispatch) return;
    const { intent, entities } = aiDispatch;
    setQueryAnswer(null);
    setMeetingDate(entities?.date || "");
    const run = async () => {
      if (intent === "meeting_overlap" && entities?.cities?.length) {
        const meta = await fetchCityMeta(entities.cities);
        const valid = meta.filter(c => c.known !== false);
        if (valid.length) {
          setSelectedCities(valid);
          setBaseCityName(valid[0].name);
        }
      } else if (intent === "time_conversion" && entities) {
        const citiesToShow = [...(entities.from_city ? [entities.from_city] : []), ...(entities.to_cities || [])];
        if (citiesToShow.length) {
          const meta = await fetchCityMeta(citiesToShow);
          const valid = meta.filter(c => c.known !== false);
          if (valid.length) {
            setSelectedCities(valid);
            if (entities.from_time || entities.time) {
              try {
                const date = entities.date || new Date().toISOString().slice(0,10);
                const instant = resolveWallTime(date, entities.from_time || entities.time, valid[0].timezone_id);
                setQueryAnswer(valid.map(city => city.name + ": " + new Intl.DateTimeFormat("en-US", {timeZone: city.timezone_id, dateStyle: "full", timeStyle: "short"}).format(instant)).join(" · "));
              } catch (error) { setQueryAnswer(error.message); }
            }
            if (entities.from_city) {
              const matchingBase = valid.find(c => c.name.toLowerCase() === entities.from_city.toLowerCase());
              if (matchingBase) setBaseCityName(matchingBase.name);
            }
          }
        }
      }
    };
    run();
  }, [aiDispatch, fetchCityMeta]);

  const shareOverlap = () => {
    const cities = selectedCities.map(c => c.name).join(", ");
    const q = `Best meeting time for ${cities}${meetingDate ? " on " + meetingDate : ""}`;
    const url = `${window.location.origin}/dashboard?q=${encodeURIComponent(q)}`;
    navigator.clipboard.writeText(url).then(() => { fireAnalyticsEvent("meeting_shared", {tool: "meeting"}); toast.success("Scheduler link copied!"); });
  };

  const copyOverlapResult = () => {
    if (!overlapResult?.has_overlap) return;
    const lines = overlapResult.city_details?.filter(c => c.best_time_local)
      .map(c => `• ${c.name}: ${c.best_time_local}`) || [];
    const text = `Optimal Meeting Windows (${overlapResult.overlap_duration_hours}h Overlap):\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => toast.success("Schedule copied!"));
  };

  const filtered = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase()) &&
    !selectedCities.find(sc => sc.name.toLowerCase() === c.toLowerCase())
  );

  const ticks = [0, 3, 6, 9, 12, 15, 18, 21];
  const getTickLabel = (h) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  return (
    <div className="space-y-6" data-testid="time-converter">
      {queryAnswer && <div role="status" className="rounded-xl bg-gem-gold/15 p-5 text-ink leading-relaxed">{queryAnswer}</div>}
      <label className="flex flex-wrap items-center gap-3 text-ink text-sm mb-4">Meeting date (UTC)
        <input type="date" value={meetingDate || new Date().toISOString().slice(0,10)} onChange={event => setMeetingDate(event.target.value)} className="bg-paper border border-line rounded-lg p-2" />
      </label>
      {/* World Clocks Control Panel */}
      <div className="bg-surface  rounded-xl border border-line p-6 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-heading font-semibold text-ink flex items-center gap-2 text-xl">
              <Clock className="w-5.5 h-5.5 text-pine" /> Live World Clocks
            </h2>
            <p className="text-xs text-quiet mt-0.5">
              Click the star button on any city card to set it as the primary base reference.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-surface rounded-lg border border-line text-quiet shrink-0 self-start sm:self-center">
            {selectedCities.length}/5 Cities Added
          </span>
        </div>

        {/* Search & Add Input */}
        <div className="relative mb-6">
          <input
            value={citySearch}
            onChange={(e) => { setCitySearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
            placeholder="Search & add global cities (e.g. Tokyo, Dubai, Berlin)..."
            className="w-full h-11 px-4 rounded-xl border border-line bg-surface text-ink placeholder-gem-mist/50 text-sm outline-none focus:border-line focus:bg-surface transition-all font-medium"
            data-testid="city-search-input"
            onKeyDown={(e) => { if (e.key === "Enter" && citySearch.trim()) addCity(citySearch.trim()); }}
          />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute z-50 top-12 left-0 right-0 bg-surface  border border-line rounded-xl  max-h-56 overflow-y-auto" data-testid="city-dropdown">
              {filtered.slice(0, 10).map((city) => (
                <button
                  key={city}
                  onMouseDown={() => addCity(city)}
                  className="w-full text-left px-4 py-3 text-sm text-ink hover:bg-surface hover:text-pine transition-colors font-medium border-b border-line last:border-0"
                  data-testid={`city-option-${city}`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {selectedCities.map((city) => {
            const isBase = city.name === baseCityName;
            const timeData = isCustomTime
              ? getCityCustomTime(city)
              : getCityLiveTime(city);

            function getCityLiveTime(c) {
              return getLocalTime(c.timezone_id, liveTime);
            }

            function getCityCustomTime(c) {
              const baseCity = selectedCities.find(sc => sc.name === baseCityName) || selectedCities[0];
              return getShiftedTime(c.timezone_id, c.utc_offset, baseCity.utc_offset, selectedHour, liveTime);
            }

            return (
              <CityCard
                key={city.name}
                city={city}
                isBase={isBase}
                makeBase={() => handleMakeBase(city)}
                timeData={timeData}
                onRemove={selectedCities.length > 1 ? removeCity : null}
              />
            );
          })}
        </div>
      </div>

      {/* Dynamic Hour Slider Workspace */}
      <div className="bg-surface  rounded-xl border border-line p-6  space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading font-semibold text-ink flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-pine" /> Drag to Shift Time
            </h3>
            <p className="text-xs text-quiet mt-0.5">
              Shift hours to see daytime transitions and business openings worldwide.
            </p>
          </div>
          <div className="bg-gem-gold/10 px-3 py-1 rounded-full border border-line text-xs font-bold text-pine tracking-tight self-start sm:self-center">
            Reference Anchor: {baseCityName}
          </div>
        </div>

        <div className="py-2">
          <input
            type="range"
            min="0"
            max="23"
            value={selectedHour}
            onChange={(e) => {
              setSelectedHour(parseInt(e.target.value));
              setIsCustomTime(true);
            }}
            className="w-full h-2.5 bg-surface rounded-lg appearance-none cursor-pointer accent-gem-gold focus:outline-none focus:ring-2 focus:ring-gem-gold/40 transition-all slider-custom "
            data-testid="time-slider"
          />

          {/* Slider Tickmarks */}
          <div className="relative flex justify-between mt-4 px-1">
            {ticks.map((t) => {
              const isActive = selectedHour === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedHour(t);
                    setIsCustomTime(true);
                  }}
                  className={`text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${
                    isActive ? "text-pine scale-110" : "text-quiet hover:text-ink"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? "bg-gem-gold " : "bg-surface"}`} />
                  {getTickLabel(t)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Mode Toggling Banner */}
        {isCustomTime && (
          <div className="bg-gem-gold/10 border border-line rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3  fade-in-up">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gem-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gem-gold"></span>
              </span>
              <p className="text-sm text-quiet">
                Viewing timezone shift pause at <strong className="text-pine">{selectedHour === 0 ? "12 AM" : selectedHour === 12 ? "12 PM" : selectedHour > 12 ? `${selectedHour - 12} PM` : `${selectedHour} AM`}</strong> in <strong className="text-pine">{baseCityName}</strong>.
              </p>
            </div>
            <button
              onClick={() => setIsCustomTime(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pine text-paper hover:opacity-90 text-xs font-bold transition-all  active:scale-95 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resume Live clocks
            </button>
          </div>
        )}
      </div>

      {/* Automated Meeting Overlap Scheduler Card */}
      {selectedCities.length >= 2 && (
        <div className="bg-surface  rounded-xl border border-line p-6  space-y-6 fade-in-up" data-testid="overlap-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-semibold text-ink flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-pine" /> Meeting Overlap & Scheduler Helper
              </h3>
              <p className="text-xs text-quiet mt-0.5">
                Longest shared window within 9 AM–5 PM in every city on the selected UTC date.
              </p>
            </div>

            {loadingOverlap ? (
              <span className="flex items-center gap-1.5 text-xs text-pine bg-gem-gold/10 border border-line rounded-full px-3 py-1.5 animate-pulse font-semibold">
                Finding Overlaps...
              </span>
            ) : overlapResult?.has_overlap ? (
              <span className="flex items-center gap-1.5 text-xs text-quiet bg-gem-sage/10 border border-line rounded-full px-3 py-1.5 font-bold ">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {overlapResult.overlap_duration_hours}h Overlap Found
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-orange-800 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                No Working Overlap
              </span>
            )}
          </div>

          {overlapResult && (
            <div className="space-y-6">
              {overlapResult.has_overlap ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-surface rounded-2xl p-4 border border-line flex flex-col justify-center">
                    <div className="text-[10px] text-quiet mb-1.5 font-bold uppercase tracking-wider">Universal Clock Window (UTC)</div>
                    <div className="font-heading font-bold text-ink text-lg" data-testid="overlap-window">
                      {overlapResult.overlap_start_utc} – {overlapResult.overlap_end_utc}
                    </div>
                  </div>
                  <div className="bg-gem-gold/10 rounded-2xl p-4 border border-line col-span-1 sm:col-span-2">
                    <div className="text-[10px] text-pine mb-2 font-bold tracking-wider uppercase">Optimal Meeting Windows</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                      {overlapResult.city_details?.filter(c => c.best_time_local).map(city => (
                        <div key={city.name} className="text-sm text-ink font-semibold">
                          <span className="text-pine font-bold">{city.name}:</span> {city.best_time_local}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-sm text-orange-800 font-medium">
                  {overlapResult.message || "There are no overlapping business hours (9 AM - 5 PM) between these cities. You will need to schedule a call outside standard working hours."}
                </div>
              )}

              {/* Overlap timeline */}
              <div className="bg-surface rounded-2xl p-5 border border-line">
                <OverlapBar
                  cityDetails={overlapResult.city_details || []}
                  overlapStartDec={overlapResult.overlap_start_dec}
                  overlapEndDec={overlapResult.overlap_end_dec}
                />
              </div>

              {/* Share / Copy actions */}
              <div className="flex justify-end gap-3 pt-2">
                {overlapResult.has_overlap && (
                  <button
                    onClick={copyOverlapResult}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line text-quiet hover:text-ink hover:bg-surface text-xs font-bold transition-all cursor-pointer"
                    data-testid="copy-overlap-btn"
                    title="Copy details to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Schedule
                  </button>
                )}
                <button
                  onClick={shareOverlap}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gem-gold/20 border border-line text-pine hover:bg-gem-gold/30 text-xs font-bold transition-all  cursor-pointer"
                  data-testid="share-overlap-btn"
                  title="Share scheduler link"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Scheduler
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
