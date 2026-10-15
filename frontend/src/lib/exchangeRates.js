import prebuiltRates from "../data/prebuiltRates.json";

// Two sources, merged:
//  1. Live market rates (Coinbase public API, updates every minute, no key).
//  2. ExchangeRate-API daily reference rates (broader coverage, independent check).
// A live quote is used only when it agrees with the reference within MAX_DRIFT,
// so one bad tick can never reach a user. If both fail, the dated build snapshot
// is shown and labeled as cached.

export const LIVE_SOURCE = "Live market rate";
export const REFERENCE_SOURCE = "ExchangeRate-API daily reference";
const LIVE_URL = "https://api.coinbase.com/v2/exchange-rates?currency=USD";
const REFERENCE_URL = "https://open.exchangerate-api.com/v6/latest/USD";
export const LIVE_CACHE_MS = 60 * 1000;
const REFERENCE_CACHE_MS = 60 * 60 * 1000;
const MAX_DRIFT = 0.03;
// Fiat whitelist: the live feed also lists crypto, which we never want to show.
const FIAT = new Set(Object.keys(prebuiltRates.USD?.rates || {}));

export function fmtUtc(date) {
  const d = new Date(date);
  const day = d.toLocaleDateString("en-GB", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return `${day} ${time} UTC`;
}

export function rateFromSnapshot(snapshot, from, to) {
  const base = snapshot?.rates?.[from];
  const quote = snapshot?.rates?.[to];
  if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(quote) || quote <= 0) {
    throw new Error(`Exchange rate unavailable for ${from}/${to}. Try again later.`);
  }
  const live = snapshot.live;
  const bothLive = !!live && live.has(from) && live.has(to);
  return {
    rate: quote / base,
    date: bothLive ? snapshot.liveUtc : snapshot.updatedUtc,
    source: bothLive ? LIVE_SOURCE : snapshot.source,
    isFallback: !bothLive && !!snapshot.isFallback,
    isLive: bothLive,
  };
}

// Pure merge, exported for tests. `live` and `reference` are {CODE: unitsPerUSD}.
export function mergeRates(live, reference) {
  const rates = { ...reference };
  const used = new Set(["USD"]);
  for (const [code, value] of Object.entries(live || {})) {
    const ref = reference[code];
    if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(ref)) continue;
    if (Math.abs(value / ref - 1) <= MAX_DRIFT) {
      rates[code] = value;
      used.add(code);
    }
  }
  rates.USD = 1;
  return { rates, live: used };
}

export function getCachedRate(from, to) {
  const cached = prebuiltRates.USD;
  if (!cached?.updatedUtc) return null;
  try {
    return rateFromSnapshot({ ...cached, source: "ExchangeRate-API (build snapshot)", isFallback: true }, from, to);
  } catch { return null; }
}

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error("Rate provider unavailable");
    return await response.json();
  } finally { clearTimeout(timer); }
}

async function fetchLive() {
  const data = await getJson(LIVE_URL);
  const raw = data?.data?.rates;
  if (!raw || data.data.currency !== "USD") throw new Error("Invalid live rates");
  const rates = {};
  for (const [code, value] of Object.entries(raw)) {
    if (FIAT.has(code)) rates[code] = Number(value);
  }
  return { rates, fetchedAt: Date.now() };
}

async function fetchReference() {
  const data = await getJson(REFERENCE_URL);
  if (data.result !== "success" || !data.time_last_update_utc || data.rates?.USD !== 1) throw new Error("Invalid rate snapshot");
  return { rates: data.rates, updatedUtc: fmtUtc(data.time_last_update_utc), source: REFERENCE_SOURCE, isFallback: false };
}

let reference = { promise: null, at: 0 };
let liveSnap = { promise: null, at: 0 };

function cachedFetch(slot, maxAge, fn) {
  if (!slot.promise || Date.now() - slot.at > maxAge) {
    slot.at = Date.now();
    slot.promise = fn().catch((error) => { slot.promise = null; throw error; });
  }
  return slot.promise;
}

async function getSnapshot() {
  const [refResult, liveResult] = await Promise.allSettled([
    cachedFetch(reference, REFERENCE_CACHE_MS, fetchReference),
    cachedFetch(liveSnap, LIVE_CACHE_MS, fetchLive),
  ]);
  const cached = prebuiltRates.USD;
  const ref = refResult.status === "fulfilled"
    ? refResult.value
    : cached?.updatedUtc ? { ...cached, source: "ExchangeRate-API (build snapshot)", isFallback: true } : null;
  if (!ref) throw refResult.reason;
  if (liveResult.status !== "fulfilled") return ref;
  // If the reference is only the build snapshot, a currency that has moved more than
  // MAX_DRIFT since the build keeps the snapshot value and stays labeled as cached.
  const { rates, live } = mergeRates(liveResult.value.rates, ref.rates);
  return { ...ref, rates, live, liveUtc: fmtUtc(liveResult.value.fetchedAt) };
}

export async function getExchangeRate(from, to) {
  if (from === to) return { rate: 1, date: "Same currency", source: "Identity", isFallback: false, isLive: true };
  return rateFromSnapshot(await getSnapshot(), from, to);
}
