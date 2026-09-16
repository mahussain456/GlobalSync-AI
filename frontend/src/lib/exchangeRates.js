import prebuiltRates from "../data/prebuiltRates.json";

let snapshotPromise;
let fetchedAt = 0;
const CACHE_MS = 60 * 60 * 1000;

export function rateFromSnapshot(snapshot, from, to) {
  const base = snapshot?.rates?.[from];
  const quote = snapshot?.rates?.[to];
  if (!Number.isFinite(base) || base <= 0 || !Number.isFinite(quote) || quote <= 0) {
    throw new Error(`Exchange rate unavailable for ${from}/${to}. Try again later.`);
  }
  return { rate: quote / base, date: snapshot.updatedUtc, source: snapshot.source, isFallback: !!snapshot.isFallback };
}

export function getCachedRate(from, to) {
  const cached = prebuiltRates.USD;
  if (!cached?.updatedUtc) return null;
  try {
    return rateFromSnapshot({ ...cached, source: "ExchangeRate-API (build snapshot)", isFallback: true }, from, to);
  } catch { return null; }
}

async function fetchSnapshot() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch("https://open.exchangerate-api.com/v6/latest/USD", { signal: controller.signal });
    if (!response.ok) throw new Error("Rate provider unavailable");
    const data = await response.json();
    if (data.result !== "success" || !data.time_last_update_utc || data.rates?.USD !== 1) throw new Error("Invalid rate snapshot");
    return { rates: data.rates, updatedUtc: data.time_last_update_utc, source: "ExchangeRate-API", isFallback: false };
  } finally { clearTimeout(timer); }
}

export async function getExchangeRate(from, to) {
  if (from === to) return { rate: 1, date: "Same currency", source: "Identity", isFallback: false };
  if (!snapshotPromise || Date.now() - fetchedAt > CACHE_MS) {
    fetchedAt = Date.now();
    snapshotPromise = fetchSnapshot().catch(error => {
      snapshotPromise = null;
      const cached = prebuiltRates.USD;
      if (!cached?.updatedUtc) throw error;
      return { ...cached, source: "ExchangeRate-API (build snapshot)", isFallback: true };
    });
  }
  return rateFromSnapshot(await snapshotPromise, from, to);
}
