/**
 * timezoneUtils.js
 * Pure Intl.DateTimeFormat utilities — no extra dependencies.
 * Works identically in Node.js (react-snap, run-snap-with-info.js) and the browser.
 */

// ─── Core: UTC offset for a given IANA zone ───────────────────────────────────
// Uses the sv-SE locale trick: it returns ISO-format "YYYY-MM-DD HH:MM:SS"
// which parses unambiguously into a UTC-equivalent timestamp.
export function getUTCOffsetMinutes(ianaZone, date = new Date()) {
  try {
    if (ianaZone === 'UTC') return 0;

    const str = new Intl.DateTimeFormat('sv-SE', {
      timeZone: ianaZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);

    // str = "2026-01-15 05:30:00"
    const localMs = new Date(str.replace(' ', 'T') + 'Z').getTime();
    return Math.round((localMs - date.getTime()) / 60000);
  } catch (_) {
    return 0;
  }
}

// ─── Offset between two zones (positive = "to" is ahead of "from") ──────────
export function getOffsetDiff(fromIANA, toIANA, date = new Date()) {
  return getUTCOffsetMinutes(toIANA, date) - getUTCOffsetMinutes(fromIANA, date);
}

// ─── Human-readable offset description ───────────────────────────────────────
// Returns the AEO "above-fold answer" sentence.
// e.g. "IST is currently 10 hours and 30 minutes ahead of EST."
export function formatOffsetDescription(fromAbbr, toAbbr, diffMinutes) {
  if (diffMinutes === 0) {
    return `${toAbbr} and ${fromAbbr} are currently in the same time zone.`;
  }
  const abs = Math.abs(diffMinutes);
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const direction = diffMinutes > 0 ? 'ahead of' : 'behind';

  let timeStr;
  if (hours > 0 && mins > 0) {
    timeStr = `${hours} hour${hours !== 1 ? 's' : ''} and ${mins} minutes`;
  } else if (hours > 0) {
    timeStr = `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    timeStr = `${mins} minute${mins !== 1 ? 's' : ''}`;
  }

  return `${toAbbr} is currently ${timeStr} ${direction} ${fromAbbr}.`;
}

// ─── 24-hour conversion table ─────────────────────────────────────────────────
// Returns 24 rows, each showing a whole hour in fromIANA and the corresponding
// time in toIANA. Uses a fixed winter reference date to produce stable output
// that react-snap captures as static HTML.
export function generate24hTable(fromIANA, toIANA) {
  // January 12, 2026 — Monday, deep winter, no DST in northern hemisphere
  // We find what UTC instant corresponds to each hour 00–23 in fromIANA.
  const FROM_OFFSET = getUTCOffsetMinutes(fromIANA, new Date('2026-01-12T12:00:00Z'));
  const rows = [];

  for (let h = 0; h < 24; h++) {
    // UTC ms when fromIANA shows h:00 on Jan 12
    const utcMs = Date.UTC(2026, 0, 12, h) - FROM_OFFSET * 60000;
    const utcDate = new Date(utcMs);

    const toTime = new Intl.DateTimeFormat('en-US', {
      timeZone: toIANA,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(utcDate);

    // Handle "24:00" → "00:00" edge case some engines emit
    const toNorm = toTime.replace(/^24:/, '00:');

    rows.push({
      fromTime: `${String(h).padStart(2, '0')}:00`,
      toTime: toNorm,
    });
  }

  return rows;
}

// ─── Business hours overlap (09:00–17:00 in both zones) ──────────────────────
// Returns { hasOverlap, windows, recommendation }
// windows = array of { fromStart, fromEnd, toStart, toEnd } in local times
export function computeBusinessOverlap(fromIANA, toIANA) {
  // Use a fixed date. Compute what UTC range is "business hours" in EACH zone.
  const REF = new Date('2026-01-12T00:00:00Z');
  const FROM_OFF = getUTCOffsetMinutes(fromIANA, REF); // minutes
  const TO_OFF   = getUTCOffsetMinutes(toIANA,   REF); // minutes

  // Business hours in UTC minutes from midnight
  // fromIANA 09:00 = UTC (9*60 - FROM_OFF) minutes
  const fromStartUTC = 9 * 60 - FROM_OFF;
  const fromEndUTC   = 17 * 60 - FROM_OFF;
  const toStartUTC   = 9 * 60 - TO_OFF;
  const toEndUTC     = 17 * 60 - TO_OFF;

  // Overlap window in UTC
  const overlapStart = Math.max(fromStartUTC, toStartUTC);
  const overlapEnd   = Math.min(fromEndUTC, toEndUTC);

  if (overlapEnd <= overlapStart) {
    // No overlap — suggest least-bad windows
    const diff = getOffsetDiff(fromIANA, toIANA, REF);
    const absDiff = Math.abs(diff);
    let recommendation;
    if (absDiff >= 12) {
      recommendation = `With a ${absDiff}-hour difference, real-time overlap during standard business hours is not possible. The most common approach is for one team to hold a standing early-morning call (07:00–09:00 local) while the other stays late (17:00–19:00 local). Rotate the sacrifice quarterly to distribute meeting burden fairly.`;
    } else {
      recommendation = `Standard 09:00–17:00 business hours do not overlap between ${fromIANA.split('/')[1]?.replace('_', ' ')} and ${toIANA.split('/')[1]?.replace('_', ' ')}. Consider a standing 08:00 call for the earlier zone, which lands in the evening for the later zone.`;
    }
    return { hasOverlap: false, overlapMinutes: 0, recommendation };
  }

  const overlapMinutes = overlapEnd - overlapStart;
  const overlapHours = Math.floor(overlapMinutes / 60);
  const overlapMins  = overlapMinutes % 60;

  // Convert overlap window back to local times in each zone
  const fmtLocal = (utcMinutes, ianaZone) => {
    const date = new Date(Date.UTC(2026, 0, 12) + utcMinutes * 60000);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: ianaZone,
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(date);
  };

  const fromWindowStart = fmtLocal(overlapStart, fromIANA);
  const fromWindowEnd   = fmtLocal(overlapEnd,   fromIANA);
  const toWindowStart   = fmtLocal(overlapStart, toIANA);
  const toWindowEnd     = fmtLocal(overlapEnd,   toIANA);

  const durationStr = overlapHours > 0
    ? `${overlapHours} hour${overlapHours !== 1 ? 's' : ''}${overlapMins > 0 ? ` ${overlapMins} min` : ''}`
    : `${overlapMins} minutes`;

  return {
    hasOverlap: true,
    overlapMinutes,
    fromWindowStart,
    fromWindowEnd,
    toWindowStart,
    toWindowEnd,
    durationStr,
    recommendation: `The best meeting window is ${fromWindowStart}–${fromWindowEnd} (${fromIANA.split('/')[1]?.replace('_', ' ')}) / ${toWindowStart}–${toWindowEnd} (${toIANA.split('/')[1]?.replace('_', ' ')}), giving ${durationStr} of shared business hours.`,
  };
}

// ─── Format a UTC offset number as a display string ──────────────────────────
// e.g. 330 → "UTC+5:30",  -300 → "UTC−5:00"
export function formatUTCOffset(offsetMinutes) {
  const sign = offsetMinutes >= 0 ? '+' : '−';
  const abs  = Math.abs(offsetMinutes);
  const h    = Math.floor(abs / 60);
  const m    = abs % 60;
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
