import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { CITY_TIMEZONES } from "@/lib/cityTimezones";
import { parseEmbedParams, SITE } from "@/lib/embed";
import { trueNow, syncClock } from "@/lib/trueTime";

// The page other sites put in an <iframe>. No nav, no footer, no cookie banner,
// no analytics: just the clocks and one attribution link back to the site.

const STYLES = {
  light: { bg: "#F4EFE6", card: "#FFFFFF", ink: "#0E2A1F", muted: "#4A6051", line: "#0E2A1F22", accent: "#1B4D3E", on: "#1B4D3E" },
  dark: { bg: "#0E2A1F", card: "#153C2E", ink: "#F4EFE6", muted: "#A7BFAE", line: "#A7BFAE33", accent: "#C8A96A", on: "#C8A96A" },
};

const status = (hour, weekday) =>
  weekday === "Sat" || weekday === "Sun" ? "Weekend" : hour >= 9 && hour < 17 ? "Working hours" : hour >= 7 && hour < 22 ? "Evening" : "Night";

export default function EmbedWorldClock() {
  const { search } = useLocation();
  const { cities, theme, hour12 } = useMemo(() => parseEmbedParams(search), [search]);
  const [now, setNow] = useState(null);
  const c = STYLES[theme];

  useEffect(() => {
    setNow(trueNow());
    syncClock().then(() => setNow(trueNow()));
    const id = setInterval(() => setNow(trueNow()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.background = c.bg;
    return () => { document.body.style.background = ""; };
  }, [c.bg]);

  return (
    <div style={{ background: c.bg, color: c.ink, fontFamily: "'DM Sans', Inter, system-ui, sans-serif", padding: 12, minHeight: "100vh", boxSizing: "border-box" }}>
      <SEOHead rawTitle="World Clock Widget | GlobalSync AI" description="Embeddable world clock by GlobalSync AI." canonical="/embed" noIndex />
      <h1 style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: c.muted, margin: "2px 4px 10px" }}>World clock</h1>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {cities.map((city) => {
          const zone = CITY_TIMEZONES[city];
          const fmt = (opts) => (now ? new Intl.DateTimeFormat("en-GB", { timeZone: zone, ...opts }).format(now) : "");
          const hour = Number(fmt({ hour: "2-digit", hourCycle: "h23" }));
          const weekday = fmt({ weekday: "short" });
          const time = now ? new Intl.DateTimeFormat(hour12 ? "en-US" : "en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12 }).format(now) : "--:--";
          const s = now ? status(hour, weekday) : "";
          return (
            <li key={city} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minHeight: 52, boxSizing: "border-box" }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{city}</span>
                <span style={{ display: "block", fontSize: 11, color: s === "Working hours" ? c.on : c.muted }} suppressHydrationWarning>{weekday}{s && ` · ${s}`}</span>
              </span>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }} suppressHydrationWarning>{time}</span>
            </li>
          );
        })}
      </ul>
      <p style={{ margin: "8px 4px 0", fontSize: 11, color: c.muted, textAlign: "right" }}>
        Powered by{" "}
        <a href={`${SITE}/time-zone-converter`} target="_blank" rel="noopener" style={{ color: c.accent, fontWeight: 600 }}>GlobalSync AI</a>
      </p>
    </div>
  );
}
