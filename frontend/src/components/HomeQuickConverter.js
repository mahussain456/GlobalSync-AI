import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { CITY_TIMEZONES, CITY_NAMES } from "@/lib/cityTimezones";
import { resolveWallTime } from "@/lib/timeCalculations";
import { trueNow, syncClock } from "@/lib/trueTime";
import { markToolUsed, fireAnalyticsEvent } from "@/lib/analytics";

// The homepage's first-screen tool: type a time in one city, see it everywhere else.
// Planning a meeting (working-hours overlap, .ics) lives on /meeting-planner.

const CITIES = CITY_NAMES.map((name) => [name, CITY_TIMEZONES[name]]);
const DEFAULT_TO = ["London", "Mumbai", "Sydney"];
const MAX_CITIES = 4;

const fmt = (instant, timeZone, opts) => new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(instant);
const localDate = (instant, timeZone) => new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);

function status(hour, weekday) {
  if (weekday === "Sat" || weekday === "Sun") return { label: "Weekend", tone: "off" };
  if (hour >= 9 && hour < 17) return { label: "Working hours", tone: "on" };
  if (hour >= 7 && hour < 22) return { label: "Evening / early", tone: "mid" };
  return { label: "Night", tone: "off" };
}

export default function HomeQuickConverter() {
  const [fromCity, setFromCity] = useState("New York");
  const [toCities, setToCities] = useState(DEFAULT_TO);
  const [time, setTime] = useState(""); // "" = follow the live clock
  const [now, setNow] = useState(null); // null until mount, so prerender and hydration match
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNow(trueNow());
    syncClock().then(() => setNow(trueNow()));
    const id = setInterval(() => setNow(trueNow()), 15000);
    return () => clearInterval(id);
  }, []);

  const fromZone = CITY_TIMEZONES[fromCity];
  const instant = useMemo(() => {
    if (!now) return null;
    if (!time) return now;
    try {
      return resolveWallTime(localDate(now, fromZone), time, fromZone);
    } catch {
      return null;
    }
  }, [now, time, fromZone]);

  const rows = toCities.map((city) => {
    const zone = CITY_TIMEZONES[city];
    if (!instant) return { city, time: "--:--", day: "", status: null };
    const hour = Number(fmt(instant, zone, { hour: "2-digit", hourCycle: "h23" }));
    const weekday = fmt(instant, zone, { weekday: "short" });
    const shift = localDate(instant, zone).localeCompare(localDate(instant, fromZone));
    return {
      city,
      time: fmt(instant, zone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      day: `${weekday}${shift > 0 ? " · next day" : shift < 0 ? " · previous day" : ""}`,
      status: status(hour, weekday),
    };
  });

  const touched = () => markToolUsed("homepage_converter");
  const setTo = (i, city) => { touched(); setToCities((list) => list.map((c, j) => (j === i ? city : c))); };
  const addCity = () => { touched(); setToCities((list) => [...list, CITIES.find(([n]) => !list.includes(n) && n !== fromCity)[0]]); };
  const removeCity = (i) => setToCities((list) => list.filter((_, j) => j !== i));

  const copy = async () => {
    if (!instant) return;
    const head = `${fromCity}: ${fmt(instant, fromZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" })}`;
    const text = [head, ...rows.map((r) => `${r.city}: ${r.time} (${r.day})`)].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked: the times stay on screen */ }
    fireAnalyticsEvent("calculation_succeeded", { tool: "homepage_converter" });
  };

  const fromTimeLabel = instant ? fmt(instant, fromZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) : "";

  return (
    <section className="hero-tool" aria-labelledby="quick-convert-title" data-testid="home-quick-converter">
      <div className="hero-tool-head">
        <h2 id="quick-convert-title">Convert a time</h2>
        <span>{time ? "Your chosen time" : "Live now"}</span>
      </div>
      <div className="hero-tool-from">
        <label>
          When it&rsquo;s
          <input type="time" value={time || fromTimeLabel} step="900" onChange={(e) => { touched(); setTime(e.target.value); }} aria-label="Time in the first city" />
        </label>
        <label>
          in
          <select value={fromCity} onChange={(e) => { touched(); setFromCity(e.target.value); }} aria-label="First city">
            {CITIES.map(([name]) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        {time && <button type="button" className="hero-tool-reset" onClick={() => setTime("")}>Back to now</button>}
      </div>
      <ul className="hero-tool-rows" aria-live="polite">
        {rows.map((r, i) => (
          <li key={i}>
            <select value={r.city} onChange={(e) => setTo(i, e.target.value)} aria-label={`City ${i + 1}`}>
              {CITIES.map(([name]) => <option key={name} value={name}>{name}</option>)}
            </select>
            <strong suppressHydrationWarning>{r.time}</strong>
            <small suppressHydrationWarning>{r.day}{r.status && <em className={`tone-${r.status.tone}`}>{r.status.label}</em>}</small>
            {toCities.length > 1 && (
              <button type="button" className="hero-tool-remove" onClick={() => removeCity(i)} aria-label={`Remove ${r.city}`}><X aria-hidden="true" /></button>
            )}
          </li>
        ))}
      </ul>
      <div className="hero-tool-actions">
        {toCities.length < MAX_CITIES && (
          <button type="button" className="hero-tool-add" onClick={addCity}><Plus aria-hidden="true" /> Add a city</button>
        )}
        <button type="button" className="hero-tool-copy" onClick={copy}>{copied ? "Copied" : "Copy times"}</button>
      </div>
      <a className="hero-tool-next" href="/meeting-planner">Need a time that works for everyone? Open the meeting planner <ArrowRight aria-hidden="true" /></a>
    </section>
  );
}
