// Live numbers inside written content. Guides can contain tokens that are filled
// with today's exchange rates and DST-correct meeting times, so the copy never
// goes stale:
//   {fx:USD:PKR}                  rate, e.g. 277.02
//   {fxamt:2500:USD:PKR}          converted amount, rounded to 100 (or {fxamt:4185:USD:PKR:1000})
//   {fxday}                       date of the rate, e.g. 15 Oct 2026
//   {fxdate}                      date and time of the rate, e.g. 15 Oct 2026 18:20 UTC
//   {t:America/New_York@07:30>Europe/London}   12:30 PM (adds "next day" if the date changes)
//   {abbr:Europe/London}          BST or GMT, whichever applies on the planning day
//   {day}                         the planning day, e.g. Thu, Oct 22
// The planning day is the next Thursday, so example meetings are always "this week".

import { useEffect, useMemo, useState } from "react";
import prebuiltRates from "../data/prebuiltRates.json";
import { getCachedRate, getExchangeRate, LIVE_CACHE_MS } from "./exchangeRates";
import { resolveWallTime } from "./timeCalculations";
import { trueNow, syncClock } from "./trueTime";

const TOKEN = /\{(fx|fxamt|fxday|fxdate|t|abbr|day)(?::([^}]*))?\}/g;
const IS_REACT_SNAP = typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";

export function nextThursday(from) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const ahead = (4 - d.getUTCDay() + 7) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + ahead);
  return d.toISOString().slice(0, 10);
}

// Before mount we use the build snapshot's date, so the prerendered HTML and the
// first client render match exactly. Live values replace them right after.
const BUILD_DAY = nextThursday(new Date(Date.parse(prebuiltRates.USD?.updatedUtc) || Date.UTC(2026, 9, 15)));

const localDate = (instant, timeZone) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);

export function timeIn(day, spec) {
  const m = spec.match(/^([\w/+-]+)@(\d{1,2}:\d{2})>([\w/+-]+)$/);
  if (!m) return "";
  const [, fromZone, wall, toZone] = m;
  const instant = resolveWallTime(day, wall, fromZone);
  const time = instant.toLocaleTimeString("en-US", { timeZone: toZone, hour: "numeric", minute: "2-digit" });
  const shift = localDate(instant, toZone).localeCompare(day);
  return shift > 0 ? `${time} (next day)` : shift < 0 ? `${time} (previous day)` : time;
}

export function zoneAbbr(day, zone) {
  const instant = new Date(`${day}T12:00:00Z`);
  for (const locale of ["en-US", "en-GB", "en-IN", "en-AU", "en-SG"]) {
    const name = new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: "short" })
      .formatToParts(instant).find((p) => p.type === "timeZoneName")?.value;
    if (name && !/^(GMT|UTC)[+-]/.test(name)) return name;
  }
  return new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" })
    .formatToParts(instant).find((p) => p.type === "timeZoneName")?.value || zone;
}

const dayLabel = (day) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric" });

export function fillText(text, ctx) {
  if (typeof text !== "string" || !text.includes("{")) return text;
  return text.replace(TOKEN, (whole, kind, arg = "") => {
    const parts = arg.split(":");
    switch (kind) {
      case "fx": {
        const q = ctx.rates[`${parts[0]}:${parts[1]}`];
        return q ? q.rate.toFixed(2) : whole;
      }
      case "fxamt": {
        const q = ctx.rates[`${parts[1]}:${parts[2]}`];
        if (!q) return whole;
        const step = Number(parts[3]) || 100;
        return (Math.round((Number(parts[0]) * q.rate) / step) * step).toLocaleString("en-US");
      }
      case "fxday": return (ctx.rateDate || "").split(" ").slice(0, 3).join(" ");
      case "fxdate": return ctx.rateDate || "";
      case "t": return timeIn(ctx.day, arg);
      case "abbr": return zoneAbbr(ctx.day, arg);
      case "day": return dayLabel(ctx.day);
      default: return whole;
    }
  });
}

// Deep-fills every string in a guide (body, tables, FAQs).
export function fillDeep(value, ctx) {
  if (typeof value === "string") return fillText(value, ctx);
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, ctx));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillDeep(v, ctx)]));
  }
  return value;
}

export function hasLiveTokens(value) {
  return JSON.stringify(value).match(TOKEN) !== null;
}

function pairsIn(value) {
  const pairs = new Set();
  for (const m of JSON.stringify(value).matchAll(/\{fx:(\w{3}):(\w{3})\}|\{fxamt:[\d.]+:(\w{3}):(\w{3})/g)) {
    pairs.add(m[1] ? `${m[1]}:${m[2]}` : `${m[3]}:${m[4]}`);
  }
  return [...pairs];
}

function initialContext(pairs) {
  const rates = {};
  let rateDate = "";
  let source = "";
  for (const pair of pairs) {
    const [from, to] = pair.split(":");
    const q = getCachedRate(from, to);
    if (q) { rates[pair] = q; rateDate = q.date; source = q.source; }
  }
  return { day: BUILD_DAY, rates, rateDate, source, live: false };
}

export function useLiveFacts(content) {
  const pairs = useMemo(() => pairsIn(content), [content]);
  const [ctx, setCtx] = useState(() => initialContext(pairs));

  useEffect(() => {
    setCtx(initialContext(pairs));
    if (IS_REACT_SNAP) return undefined;
    let active = true;
    const refresh = async () => {
      await syncClock();
      const day = nextThursday(trueNow());
      const results = await Promise.allSettled(pairs.map((p) => getExchangeRate(...p.split(":"))));
      if (!active) return;
      setCtx((prev) => {
        const rates = { ...prev.rates };
        let { rateDate, source } = prev;
        results.forEach((r, i) => {
          if (r.status === "fulfilled") { rates[pairs[i]] = r.value; rateDate = r.value.date; source = r.value.source; }
        });
        return { day, rates, rateDate, source, live: true };
      });
    };
    refresh();
    const timer = setInterval(() => { if (document.visibilityState === "visible") refresh(); }, LIVE_CACHE_MS);
    return () => { active = false; clearInterval(timer); };
  }, [pairs]);

  return ctx;
}
