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

  return new Response(JSON.stringify({error: "Rate provider unavailable. Please try again later."}), {
    status: 503, headers: {...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store"}
  });
}
