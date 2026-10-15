// Corrects for a wrong device clock. Time zone math is already exact (IANA rules
// via Intl), but every live clock starts from the visitor's own clock, which can
// be minutes off. We read the server's Date header once and keep the difference.

let offsetMs = 0;
let syncPromise = null;

// Below this, network jitter is bigger than the error, so we leave the clock alone.
const MIN_CORRECTION_MS = 2000;

export function getClockOffset() {
  return offsetMs;
}

export function trueNow() {
  return new Date(Date.now() + offsetMs);
}

export function offsetFromServerDate(serverDateHeader, requestStartMs, responseEndMs) {
  const server = Date.parse(serverDateHeader);
  if (!Number.isFinite(server)) return 0;
  // The header has whole-second precision and is stamped roughly mid-flight.
  const localMid = (requestStartMs + responseEndMs) / 2;
  const diff = server + 500 - localMid;
  return Math.abs(diff) >= MIN_CORRECTION_MS ? diff : 0;
}

export function syncClock() {
  if (syncPromise) return syncPromise;
  if (typeof window === "undefined" || typeof fetch !== "function") return Promise.resolve(0);
  const started = Date.now();
  syncPromise = fetch(`/robots.txt?clock=${started}`, { method: "HEAD", cache: "no-store" })
    .then((response) => {
      offsetMs = offsetFromServerDate(response.headers.get("date"), started, Date.now());
      return offsetMs;
    })
    .catch(() => 0);
  return syncPromise;
}
