import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, X } from "lucide-react";
import { CITY_TIMEZONES, CITY_NAMES } from "@/lib/cityTimezones";
import { resolveWallTime } from "@/lib/timeCalculations";
import { trueNow, syncClock } from "@/lib/trueTime";
import { markToolUsed, fireAnalyticsEvent } from "@/lib/analytics";

// The homepage time tool: type a time in one city, see it in others, on a world-time
// watch whose face is the atlas with live day and night. Planning lives on /meeting-planner.

const CITIES = CITY_NAMES.map((name) => [name, CITY_TIMEZONES[name]]);
const DEFAULT_TO = ["London", "Mumbai", "Sydney"];
const MAX_CITIES = 4;
const C = 130;

const fmt = (instant, timeZone, opts) => new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(instant);
const localDate = (instant, timeZone) => new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
const minutesIn = (instant, zone) => Number(fmt(instant, zone, { hour: "2-digit", hourCycle: "h23" })) * 60 + Number(fmt(instant, zone, { minute: "2-digit" }));
// UTC offset of a zone at an instant, in minutes (DST included).
const offsetMinutes = (instant, zone) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(instant).map((x) => [x.type, x.value]));
  return Math.round((Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) - Math.floor(instant.getTime() / 60000) * 60000) / 60000);
};
// Longitude where it is solar noon right now.
const sunLongitude = (instant) => { const h = instant.getUTCHours() + instant.getUTCMinutes() / 60; return ((-15 * (h - 12) + 540) % 360) - 180; };

function status(hour, weekday) {
  if (weekday === "Sat" || weekday === "Sun") return { label: "Weekend", tone: "off" };
  if (hour >= 9 && hour < 17) return { label: "Working hours", tone: "on" };
  if (hour >= 7 && hour < 22) return { label: "Off hours", tone: "mid" };
  return { label: "Asleep", tone: "off" };
}

function RollingTime({ value }) {
  return (
    <span className="mer-time" aria-label={value} suppressHydrationWarning>
      {value.split("").map((ch, i) => (
        <span key={`${i}-${ch}`} className={ch === ":" ? "mer-colon" : "mer-digit"} aria-hidden="true">{ch}</span>
      ))}
    </span>
  );
}

// A world-time watch: 24-hour bezel (midnight at the top), brass rim and hand, and
// the atlas inside the face, centred on the first city. Day and night on the map
// follow the sun's position at the chosen moment (terminator drawn north-south,
// ignoring the seasonal tilt). The other cities sit on the bezel's inner edge.
const MAP_W = 480, MAP_H = MAP_W * (378 / 1000); // atlas span ≈135° across the face
const pt2 = (deg, r) => { const t = (deg * Math.PI) / 180; return [C + r * Math.sin(t), C - r * Math.cos(t)]; };

function Dial({ fromCity, fromTime, fromAngle, fromLon, sunLon, rows }) {
  const BO = 124, BI = 96, FACE = 94;
  // place the atlas so fromLon sits at the centre; draw three copies for wrap-around
  const mapX = C - MAP_W / 2, mapY = C - MAP_H / 2 + 6; // atlas centred on 0°
  const shift = -(fromLon / 360) * MAP_W;
  const nightA = ((sunLon + 90 - fromLon + 540) % 360) - 180; // night starts here (relative lon)
  const xRel = (rel) => C + (rel / 360) * MAP_W;
  const night = [];
  for (const k of [-1, 0, 1]) night.push({ x: xRel(nightA + k * 360), w: (180 / 360) * MAP_W });
  const sunRel = ((sunLon - fromLon + 540) % 360) - 180, moonRel = ((sunLon + 180 - fromLon + 540) % 360) - 180;
  const inFace = (rel) => Math.abs(xRel(rel) - C) < FACE - 18;
  return (
    <svg className="dial" viewBox="0 0 260 260" role="img" aria-label={`World-time dial: ${fromCity} ${fromTime}; ${rows.map((r) => `${r.city} ${r.time}`).join(", ")}`}>
      <defs>
        <clipPath id="dial-face-clip"><circle cx={C} cy={C} r={FACE} /></clipPath>
        <filter id="dial-map-tone" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues=".46 .19" /><feFuncG type="table" tableValues=".62 .35" /><feFuncB type="table" tableValues=".5 .27" />
          </feComponentTransfer>
        </filter>
        <filter id="dial-soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" /></filter>
        <radialGradient id="dial-vignette" cx=".5" cy=".5" r=".5">
          <stop offset=".7" stopColor="#06150e" stopOpacity="0" /><stop offset="1" stopColor="#06150e" stopOpacity=".55" />
        </radialGradient>
        <radialGradient id="dial-brass" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#f3e0b0" /><stop offset=".55" stopColor="#c8a96a" /><stop offset="1" stopColor="#7a5c2c" />
        </radialGradient>
        <linearGradient id="dial-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9d3a0" /><stop offset=".5" stopColor="#a8854a" /><stop offset="1" stopColor="#e2c98f" />
        </linearGradient>
      </defs>

      {/* case, rim, bezel */}
      <circle cx={C} cy={C} r={BO + 4} fill="#08180f" />
      <circle cx={C} cy={C} r={BO + 2.5} fill="none" stroke="url(#dial-rim)" strokeWidth="2.6" />
      <circle cx={C} cy={C} r={BO} fill="#0c2219" />
      {Array.from({ length: 96 }, (_, q) => {
        const hour = q % 4 === 0;
        const [x1, y1] = pt2(q * 3.75, BO - 2), [x2, y2] = pt2(q * 3.75, BO - (hour ? 8 : 5));
        return <line key={q} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f4efe6" strokeOpacity={hour ? 0.85 : 0.35} strokeWidth={hour ? 1.4 : 0.7} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const h = (i + 1) * 2;
        const [x, y] = pt2(h * 15, BO - 17);
        return <text key={h} x={x} y={y} className="dial-bezel-num" textAnchor="middle" dominantBaseline="central">{h}</text>;
      })}
      <circle cx={C} cy={C} r={BI} fill="none" stroke="#c8a96a" strokeOpacity=".7" strokeWidth=".8" />

      {/* the face: atlas, night, sun and moon */}
      <g clipPath="url(#dial-face-clip)">
        <rect x={C - FACE} y={C - FACE} width={FACE * 2} height={FACE * 2} fill="#2f5a46" />
        <g className="dial-map" style={{ transform: `translateX(${shift}px)` }}>
          {[-1, 0, 1].map((k) => (
            <image key={k} href="/atlas/world-atlas.webp" x={mapX + k * MAP_W} y={mapY} width={MAP_W} height={MAP_H} preserveAspectRatio="none" filter="url(#dial-map-tone)" />
          ))}
        </g>
        <g className="dial-night" filter="url(#dial-soft)">
          {night.map((n, i) => <rect key={i} x={n.x} y={C - FACE - 10} width={n.w} height={FACE * 2 + 20} />)}
        </g>
        <circle cx={C} cy={C} r={FACE} fill="url(#dial-vignette)" />
        {inFace(sunRel) && <g className="dial-sun" transform={`translate(${xRel(sunRel)} ${C + 34})`}><circle r="5" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-8" x2="0" y2="-11" transform={`rotate(${i * 45})`} />)}</g>}
        {inFace(moonRel) && <path className="dial-moon" transform={`translate(${xRel(moonRel)} ${C + 34})`} d="M3 -7a8 8 0 1 0 4 13a6.5 6.5 0 1 1 -4 -13z" />}
      </g>

      {/* other cities on the bezel's inner edge */}
      {rows.map((r, i) => (
        <g key={i} className="dial-city" style={{ transform: `rotate(${r.angle}deg)` }}>
          <circle cx={C} cy={C - BI + 6} r="4" fill="#f4efe6" stroke="#8a6a32" strokeWidth="1.6" />
          <text x={C} y={C - BI + 19} className="dial-tag" textAnchor="middle" dominantBaseline="central" style={{ transform: `rotate(${-r.angle}deg)`, transformOrigin: `${C}px ${C - BI + 19}px` }}>{r.tag}</text>
        </g>
      ))}

      {/* brass hand: the first city's time */}
      <g className="dial-hand" style={{ transform: `rotate(${fromAngle}deg)` }}>
        <path d={`M${C - 2.2} ${C + 16}L${C - 1.1} ${C - (BI - 4)}L${C} ${C - (BI - 1)}L${C + 1.1} ${C - (BI - 4)}L${C + 2.2} ${C + 16}Z`} fill="url(#dial-brass)" stroke="#5b4320" strokeWidth=".4" />
      </g>
      <circle cx={C} cy={C} r="7.5" fill="url(#dial-brass)" stroke="#5b4320" strokeWidth=".5" />
      <circle cx={C} cy={C} r="2.2" fill="#2a1f0e" />

      {/* reading */}
      <g className="dial-reading">
        <rect x={C - 34} y={C - 58} width="68" height="30" rx="4" />
        <text x={C} y={C - 48} className="dial-from" textAnchor="middle">{fromCity.toUpperCase()}</text>
        <text x={C} y={C - 33} className="dial-from-time" textAnchor="middle" suppressHydrationWarning>{fromTime}</text>
      </g>
    </svg>
  );
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
    const tag = city.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
    if (!instant) return { city, tag, time: "--:--", day: "", status: null, angle: 180 };
    const minute = minutesIn(instant, zone);
    const weekday = fmt(instant, zone, { weekday: "short" });
    const shift = localDate(instant, zone).localeCompare(localDate(instant, fromZone));
    return {
      city, tag,
      time: fmt(instant, zone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      day: `${weekday}${shift > 0 ? ", next day" : shift < 0 ? ", previous day" : ""}`,
      status: status(Math.floor(minute / 60), weekday),
      angle: (minute / 1440) * 360,
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
  const fromAngle = instant ? (minutesIn(instant, fromZone) / 1440) * 360 : 180;

  return (
    <section className="hero-tool mer" aria-labelledby="quick-convert-title" data-testid="home-quick-converter">
      <header className="mer-head">
        <h2 id="quick-convert-title">Convert a time</h2>
        <p className={time ? "mer-state" : "mer-state is-live"} aria-live="polite"><i aria-hidden="true" />{time ? "Your chosen time" : "Live"}</p>
      </header>

      <div className="mer-sentence">
        <label htmlFor="mer-time">When it&rsquo;s</label>
        <input id="mer-time" type="time" value={time || fromTimeLabel} step="900" onChange={(e) => { touched(); setTime(e.target.value); }} />
        <label htmlFor="mer-from">in</label>
        <select id="mer-from" value={fromCity} onChange={(e) => { touched(); setFromCity(e.target.value); }}>
          {CITIES.map(([name]) => <option key={name} value={name}>{name}</option>)}
        </select>
        {time && <button type="button" className="mer-reset" onClick={() => setTime("")}>Back to now</button>}
      </div>

      <div className="dial-wrap">
        <div className="dial-col">
          <Dial fromCity={fromCity} fromAngle={fromAngle} fromTime={fromTimeLabel} rows={rows}
            fromLon={instant ? offsetMinutes(instant, fromZone) / 4 : 0} sunLon={instant ? sunLongitude(instant) : 0} />
          <p className="dial-caption">{time ? "Day and night at your chosen time" : "Day and night, right now"}</p>
        </div>
        <ul className="dial-rows" aria-live="polite">
          {rows.map((r, i) => (
            <li key={i}>
              <div className="mer-city">
                <select value={r.city} onChange={(e) => setTo(i, e.target.value)} aria-label={`City ${i + 1}`}>
                  {CITIES.map(([name]) => <option key={name} value={name}>{name}</option>)}
                </select>
                <small suppressHydrationWarning>
                  <span>{r.day}</span>
                  {r.status && <em className={`tone-${r.status.tone}`}>{r.status.label}</em>}
                </small>
              </div>
              <RollingTime value={r.time} />
              {toCities.length > 1 && (
                <button type="button" className="mer-remove" onClick={() => removeCity(i)} aria-label={`Remove ${r.city}`}><X aria-hidden="true" /></button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mer-actions">
        <button type="button" className="mer-copy" onClick={copy}>{copied ? "Copied" : "Copy times"}</button>
        {toCities.length < MAX_CITIES && (
          <button type="button" className="mer-add" onClick={addCity}><Plus aria-hidden="true" /> Add a city</button>
        )}
        <a className="mer-next" href="/meeting-planner">Plan a meeting <ArrowRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}
