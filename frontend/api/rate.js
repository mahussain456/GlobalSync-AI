/**
 * Vercel Edge Function — /api/rate
 *
 * Returns the live mid-market exchange rate for a currency pair.
 * Cached at the CDN edge for 1 hour (s-maxage=3600) so react-snap
 * prerender, Googlebot, and first-paint all see the rate in raw HTML.
 *
 * Usage: GET /api/rate?base=AUD&quote=GBP
 * Returns: { rate, base, quote, updatedUtc, source }
 */

export const config = { runtime: "edge" };

// Hard-coded fallback rates relative to USD (used if all live sources fail)
const FALLBACK_RATES_USD = {
  USD: 1.0,   EUR: 0.92,  GBP: 0.79,  JPY: 156.2, CHF: 0.91,
  CNY: 7.24,  CAD: 1.36,  AUD: 1.50,  INR: 83.3,  PKR: 278.5,
  BDT: 117.2, LKR: 300.5, NPR: 133.3, SGD: 1.35,  HKD: 7.81,
  KRW: 1360,  MYR: 4.69,  THB: 36.3,  IDR: 16000, PHP: 58.0,
  VND: 25400, TWD: 32.2,  KZT: 443.0, UZS: 12600, MMK: 2100,
  AED: 3.67,  SAR: 3.75,  QAR: 3.64,  KWD: 0.31,  BHD: 0.38,
  OMR: 0.38,  JOD: 0.71,  ILS: 3.68,  ZAR: 18.2,  NGN: 1450,
  EGP: 47.2,  KES: 130.0, GHS: 14.5,  MAD: 10.0,  ETB: 57.0,
  TZS: 2600,  MXN: 16.7,  BRL: 5.15,  ARS: 885.0, CLP: 910.0,
  COP: 3850,  PEN: 3.72,  NZD: 1.63,  SEK: 10.6,  NOK: 10.7,
  DKK: 6.87,  PLN: 3.92,  CZK: 22.8,  HUF: 355.0, RON: 4.58,
  BGN: 1.80,  TRY: 32.2,  RUB: 91.0,  UAH: 39.5,  ISK: 138.0,
};

/** Format a Date as "19 Jul 2026, 09:37 UTC" */
function fmtUtc(d) {
  return d.toUTCString().replace(/:\d{2} GMT$/, " UTC").replace(/^[A-Z][a-z]{2}, /, "");
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const base  = (searchParams.get("base")  || "USD").toUpperCase().trim();
  const quote = (searchParams.get("quote") || "EUR").toUpperCase().trim();

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (base === quote) {
    return new Response(
      JSON.stringify({ rate: 1, base, quote, updatedUtc: fmtUtc(new Date()), source: "identity" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  }

  // ── Try 1: open.exchangerate-api.com (free, no key needed) ──────────────────
  try {
    const res = await fetch(`https://open.exchangerate-api.com/v6/latest/${base}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const json = await res.json();
      const rate = json?.rates?.[quote];
      if (rate != null) {
        const updatedUtc = json.time_last_update_utc
          ? fmtUtc(new Date(json.time_last_update_utc))
          : fmtUtc(new Date());
        return new Response(
          JSON.stringify({ rate: Number(rate.toFixed(6)), base, quote, updatedUtc, source: "exchangerate-api" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
        );
      }
    }
  } catch (_) { /* fall through */ }

  // ── Try 2: Frankfurter (ECB data, free) ─────────────────────────────────────
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const json = await res.json();
      const rate = json?.rates?.[quote];
      if (rate != null) {
        const updatedUtc = json.date ? `${json.date} UTC` : fmtUtc(new Date());
        return new Response(
          JSON.stringify({ rate: Number(rate.toFixed(6)), base, quote, updatedUtc, source: "frankfurter" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
        );
      }
    }
  } catch (_) { /* fall through */ }

  // ── Fallback: hardcoded approximate rates ─────────────────────────────────
  const rFrom = FALLBACK_RATES_USD[base]  ?? 1.0;
  const rTo   = FALLBACK_RATES_USD[quote] ?? 1.0;
  const rate  = Number((rTo / rFrom).toFixed(6));
  return new Response(
    JSON.stringify({ rate, base, quote, updatedUtc: fmtUtc(new Date()), source: "fallback-cache", isFallback: true }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
