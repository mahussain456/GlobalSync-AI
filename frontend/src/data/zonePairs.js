/**
 * zonePairs.js
 * All 40 timezone abbreviation pairs from the SEO spec.
 * Each entry includes DST rules for the current year so ZonePairPage can
 * render the DST section without any additional data fetching.
 *
 * IANA zone metadata is stored per-zone, not per-pair, to avoid repetition.
 */

// ─── Per-IANA-zone DST metadata ───────────────────────────────────────────────
export const ZONE_META = {
  'America/New_York': {
    fullName: 'Eastern Time',
    stdAbbr: 'EST',
    dstAbbr: 'EDT',
    observesDST: true,
    stdOffsetHours: -5,
    dstOffsetHours: -4,
    dstStart: 'Second Sunday in March',
    dstEnd: 'First Sunday in November',
    dstStartDate: '2026-03-08',
    dstEndDate: '2026-11-01',
    dstNote: 'The US observes Daylight Saving Time. Clocks spring forward 1 hour on the second Sunday in March and fall back on the first Sunday in November. During EDT (UTC−4), the gap to IST narrows by 1 hour.',
  },
  'America/Los_Angeles': {
    fullName: 'Pacific Time',
    stdAbbr: 'PST',
    dstAbbr: 'PDT',
    observesDST: true,
    stdOffsetHours: -8,
    dstOffsetHours: -7,
    dstStart: 'Second Sunday in March',
    dstEnd: 'First Sunday in November',
    dstStartDate: '2026-03-08',
    dstEndDate: '2026-11-01',
    dstNote: 'Pacific Time follows US DST rules, moving from PST (UTC−8) to PDT (UTC−7) in March and back in November.',
  },
  'America/Chicago': {
    fullName: 'Central Time',
    stdAbbr: 'CST',
    dstAbbr: 'CDT',
    observesDST: true,
    stdOffsetHours: -6,
    dstOffsetHours: -5,
    dstStart: 'Second Sunday in March',
    dstEnd: 'First Sunday in November',
    dstStartDate: '2026-03-08',
    dstEndDate: '2026-11-01',
    dstNote: 'Central Time follows US DST rules, moving from CST (UTC−6) to CDT (UTC−5) in March.',
  },
  'America/Denver': {
    fullName: 'Mountain Time',
    stdAbbr: 'MST',
    dstAbbr: 'MDT',
    observesDST: true,
    stdOffsetHours: -7,
    dstOffsetHours: -6,
    dstStart: 'Second Sunday in March',
    dstEnd: 'First Sunday in November',
    dstStartDate: '2026-03-08',
    dstEndDate: '2026-11-01',
    dstNote: 'Mountain Time follows US DST rules, moving from MST (UTC−7) to MDT (UTC−6) in March. Note: Arizona (except Navajo Nation) stays on MST year-round.',
  },
  'Europe/London': {
    fullName: 'Greenwich Mean Time / British Summer Time',
    stdAbbr: 'GMT',
    dstAbbr: 'BST',
    observesDST: true,
    stdOffsetHours: 0,
    dstOffsetHours: 1,
    dstStart: 'Last Sunday in March',
    dstEnd: 'Last Sunday in October',
    dstStartDate: '2026-03-29',
    dstEndDate: '2026-10-25',
    dstNote: 'The UK observes BST (British Summer Time, UTC+1) from the last Sunday in March to the last Sunday in October. Outside those dates the zone is GMT (UTC+0).',
  },
  'Europe/Berlin': {
    fullName: 'Central European Time / Central European Summer Time',
    stdAbbr: 'CET',
    dstAbbr: 'CEST',
    observesDST: true,
    stdOffsetHours: 1,
    dstOffsetHours: 2,
    dstStart: 'Last Sunday in March',
    dstEnd: 'Last Sunday in October',
    dstStartDate: '2026-03-29',
    dstEndDate: '2026-10-25',
    dstNote: 'Central European Time (CET, UTC+1) moves to CEST (UTC+2) on the last Sunday in March and reverts on the last Sunday in October. This affects 44 countries across Europe.',
  },
  'Asia/Kolkata': {
    fullName: 'India Standard Time',
    stdAbbr: 'IST',
    dstAbbr: 'IST',
    observesDST: false,
    stdOffsetHours: 5.5,
    dstOffsetHours: 5.5,
    dstNote: 'India does not observe Daylight Saving Time. IST (UTC+5:30) is fixed year-round. India\'s unusual 30-minute offset was standardized in 1906 and applies to the entire country despite spanning nearly 30 degrees of longitude.',
  },
  'Asia/Karachi': {
    fullName: 'Pakistan Standard Time',
    stdAbbr: 'PKT',
    dstAbbr: 'PKT',
    observesDST: false,
    stdOffsetHours: 5,
    dstOffsetHours: 5,
    dstNote: 'Pakistan abolished DST in 2009. PKT (UTC+5) is fixed year-round.',
  },
  'Asia/Tokyo': {
    fullName: 'Japan Standard Time',
    stdAbbr: 'JST',
    dstAbbr: 'JST',
    observesDST: false,
    stdOffsetHours: 9,
    dstOffsetHours: 9,
    dstNote: 'Japan abolished DST in 1951. JST (UTC+9) has been fixed for over 70 years, making it one of the most stable time zones in the world.',
  },
  'Asia/Singapore': {
    fullName: 'Singapore Standard Time',
    stdAbbr: 'SGT',
    dstAbbr: 'SGT',
    observesDST: false,
    stdOffsetHours: 8,
    dstOffsetHours: 8,
    dstNote: 'Singapore does not observe DST. SGT (UTC+8) is fixed year-round. Singapore shares its offset with much of Southeast Asia including Malaysia, Philippines, and western Indonesia.',
  },
  'Asia/Manila': {
    fullName: 'Philippine Standard Time',
    stdAbbr: 'PHT',
    dstAbbr: 'PHT',
    observesDST: false,
    stdOffsetHours: 8,
    dstOffsetHours: 8,
    dstNote: 'The Philippines abolished DST in 1990. PHT (UTC+8) is fixed year-round, and the Philippines shares this offset with Singapore, Malaysia, and Hong Kong.',
  },
  'Asia/Dubai': {
    fullName: 'Gulf Standard Time',
    stdAbbr: 'GST',
    dstAbbr: 'GST',
    observesDST: false,
    stdOffsetHours: 4,
    dstOffsetHours: 4,
    dstNote: 'The UAE does not observe DST. Gulf Standard Time (UTC+4) is fixed year-round, making it a stable reference for scheduling between Europe and Asia.',
  },
  'America/Sao_Paulo': {
    fullName: 'Brasília Time',
    stdAbbr: 'BRT',
    dstAbbr: 'BRT',
    observesDST: false,
    stdOffsetHours: -3,
    dstOffsetHours: -3,
    dstNote: 'Brazil abolished Daylight Saving Time in 2019 under federal decree. BRT (UTC−3) now applies year-round to Brasília, Rio de Janeiro, and São Paulo.',
  },
  'Australia/Sydney': {
    fullName: 'Australian Eastern Time',
    stdAbbr: 'AEST',
    dstAbbr: 'AEDT',
    observesDST: true,
    stdOffsetHours: 10,
    dstOffsetHours: 11,
    dstStart: 'First Sunday in October',
    dstEnd: 'First Sunday in April',
    dstStartDate: '2026-10-04',
    dstEndDate: '2026-04-05',
    dstNote: 'Australia\'s DST runs opposite to the northern hemisphere. AEST (UTC+10) moves to AEDT (UTC+11) on the first Sunday in October and reverts in April. Queensland, unlike NSW and Victoria, does not observe DST and stays on AEST year-round.',
  },
  'Pacific/Auckland': {
    fullName: 'New Zealand Standard Time',
    stdAbbr: 'NZST',
    dstAbbr: 'NZDT',
    observesDST: true,
    stdOffsetHours: 12,
    dstOffsetHours: 13,
    dstStart: 'Last Sunday in September',
    dstEnd: 'First Sunday in April',
    dstStartDate: '2026-09-27',
    dstEndDate: '2026-04-05',
    dstNote: 'New Zealand observes DST from the last Sunday in September to the first Sunday in April. NZST (UTC+12) moves to NZDT (UTC+13) — the furthest ahead any populated zone gets from UTC.',
  },
  'UTC': {
    fullName: 'Coordinated Universal Time',
    stdAbbr: 'UTC',
    dstAbbr: 'UTC',
    observesDST: false,
    stdOffsetHours: 0,
    dstOffsetHours: 0,
    dstNote: 'UTC is the universal time standard and the basis for all other offsets. It never observes DST, making it the most stable reference for logging, APIs, and international scheduling.',
  },
};

// ─── The 40 pairs ────────────────────────────────────────────────────────────
export const ZONE_PAIRS = [
  // Priority 1 — highest search volume
  { slug: 'est-to-ist',  from: 'EST',  to: 'IST',  fromIANA: 'America/New_York',   toIANA: 'Asia/Kolkata',          priority: 1 },
  { slug: 'ist-to-est',  from: 'IST',  to: 'EST',  fromIANA: 'Asia/Kolkata',        toIANA: 'America/New_York',      priority: 1 },
  { slug: 'pst-to-ist',  from: 'PST',  to: 'IST',  fromIANA: 'America/Los_Angeles', toIANA: 'Asia/Kolkata',          priority: 1 },
  { slug: 'ist-to-pst',  from: 'IST',  to: 'PST',  fromIANA: 'Asia/Kolkata',        toIANA: 'America/Los_Angeles',   priority: 1 },
  { slug: 'est-to-pst',  from: 'EST',  to: 'PST',  fromIANA: 'America/New_York',   toIANA: 'America/Los_Angeles',   priority: 1 },
  { slug: 'pst-to-est',  from: 'PST',  to: 'EST',  fromIANA: 'America/Los_Angeles', toIANA: 'America/New_York',      priority: 1 },
  { slug: 'utc-to-est',  from: 'UTC',  to: 'EST',  fromIANA: 'UTC',                 toIANA: 'America/New_York',      priority: 1 },
  { slug: 'utc-to-pst',  from: 'UTC',  to: 'PST',  fromIANA: 'UTC',                 toIANA: 'America/Los_Angeles',   priority: 1 },
  { slug: 'gmt-to-est',  from: 'GMT',  to: 'EST',  fromIANA: 'Europe/London',       toIANA: 'America/New_York',      priority: 1 },
  { slug: 'cst-to-est',  from: 'CST',  to: 'EST',  fromIANA: 'America/Chicago',     toIANA: 'America/New_York',      priority: 1 },

  // Priority 2
  { slug: 'est-to-cst',  from: 'EST',  to: 'CST',  fromIANA: 'America/New_York',   toIANA: 'America/Chicago',       priority: 2 },
  { slug: 'cst-to-pst',  from: 'CST',  to: 'PST',  fromIANA: 'America/Chicago',     toIANA: 'America/Los_Angeles',   priority: 2 },
  { slug: 'mst-to-est',  from: 'MST',  to: 'EST',  fromIANA: 'America/Denver',      toIANA: 'America/New_York',      priority: 2 },
  { slug: 'est-to-gmt',  from: 'EST',  to: 'GMT',  fromIANA: 'America/New_York',   toIANA: 'Europe/London',         priority: 2 },
  { slug: 'pst-to-gmt',  from: 'PST',  to: 'GMT',  fromIANA: 'America/Los_Angeles', toIANA: 'Europe/London',         priority: 2 },
  { slug: 'gmt-to-pst',  from: 'GMT',  to: 'PST',  fromIANA: 'Europe/London',       toIANA: 'America/Los_Angeles',   priority: 2 },
  { slug: 'cet-to-est',  from: 'CET',  to: 'EST',  fromIANA: 'Europe/Berlin',       toIANA: 'America/New_York',      priority: 2 },
  { slug: 'est-to-cet',  from: 'EST',  to: 'CET',  fromIANA: 'America/New_York',   toIANA: 'Europe/Berlin',         priority: 2 },
  { slug: 'cet-to-ist',  from: 'CET',  to: 'IST',  fromIANA: 'Europe/Berlin',       toIANA: 'Asia/Kolkata',          priority: 2 },
  { slug: 'ist-to-cet',  from: 'IST',  to: 'CET',  fromIANA: 'Asia/Kolkata',        toIANA: 'Europe/Berlin',         priority: 2 },
  { slug: 'gmt-to-ist',  from: 'GMT',  to: 'IST',  fromIANA: 'Europe/London',       toIANA: 'Asia/Kolkata',          priority: 2 },
  { slug: 'ist-to-gmt',  from: 'IST',  to: 'GMT',  fromIANA: 'Asia/Kolkata',        toIANA: 'Europe/London',         priority: 2 },
  { slug: 'aest-to-est', from: 'AEST', to: 'EST',  fromIANA: 'Australia/Sydney',    toIANA: 'America/New_York',      priority: 2 },
  { slug: 'est-to-aest', from: 'EST',  to: 'AEST', fromIANA: 'America/New_York',   toIANA: 'Australia/Sydney',      priority: 2 },
  { slug: 'aest-to-pst', from: 'AEST', to: 'PST',  fromIANA: 'Australia/Sydney',    toIANA: 'America/Los_Angeles',   priority: 2 },

  // Priority 3
  { slug: 'jst-to-est',  from: 'JST',  to: 'EST',  fromIANA: 'Asia/Tokyo',          toIANA: 'America/New_York',      priority: 3 },
  { slug: 'est-to-jst',  from: 'EST',  to: 'JST',  fromIANA: 'America/New_York',   toIANA: 'Asia/Tokyo',            priority: 3 },
  { slug: 'jst-to-pst',  from: 'JST',  to: 'PST',  fromIANA: 'Asia/Tokyo',          toIANA: 'America/Los_Angeles',   priority: 3 },
  { slug: 'sgt-to-est',  from: 'SGT',  to: 'EST',  fromIANA: 'Asia/Singapore',      toIANA: 'America/New_York',      priority: 3 },
  { slug: 'sgt-to-pst',  from: 'SGT',  to: 'PST',  fromIANA: 'Asia/Singapore',      toIANA: 'America/Los_Angeles',   priority: 3 },
  { slug: 'pht-to-est',  from: 'PHT',  to: 'EST',  fromIANA: 'Asia/Manila',         toIANA: 'America/New_York',      priority: 3 },
  { slug: 'pht-to-pst',  from: 'PHT',  to: 'PST',  fromIANA: 'Asia/Manila',         toIANA: 'America/Los_Angeles',   priority: 3 },
  { slug: 'pkt-to-est',  from: 'PKT',  to: 'EST',  fromIANA: 'Asia/Karachi',        toIANA: 'America/New_York',      priority: 3 },
  { slug: 'pkt-to-pst',  from: 'PKT',  to: 'PST',  fromIANA: 'Asia/Karachi',        toIANA: 'America/Los_Angeles',   priority: 3 },
  { slug: 'gst-to-est',  from: 'GST',  to: 'EST',  fromIANA: 'Asia/Dubai',          toIANA: 'America/New_York',      priority: 3 },
  { slug: 'brt-to-est',  from: 'BRT',  to: 'EST',  fromIANA: 'America/Sao_Paulo',   toIANA: 'America/New_York',      priority: 3 },
  { slug: 'cest-to-est', from: 'CEST', to: 'EST',  fromIANA: 'Europe/Berlin',       toIANA: 'America/New_York',      priority: 3,
    fromAbbrNote: 'CEST (Central European Summer Time) is CET+1 (UTC+2), observed during EU DST (late March to late October).' },
  { slug: 'bst-to-est',  from: 'BST',  to: 'EST',  fromIANA: 'Europe/London',       toIANA: 'America/New_York',      priority: 3,
    fromAbbrNote: 'BST (British Summer Time) is GMT+1 (UTC+1), observed during UK DST (late March to late October).' },
  { slug: 'nzst-to-pst', from: 'NZST', to: 'PST',  fromIANA: 'Pacific/Auckland',    toIANA: 'America/Los_Angeles',   priority: 3 },
  { slug: 'utc-to-ist',  from: 'UTC',  to: 'IST',  fromIANA: 'UTC',                 toIANA: 'Asia/Kolkata',          priority: 3 },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────
export function getZonePair(slug) {
  return ZONE_PAIRS.find(p => p.slug === slug) ?? null;
}

export function getAllZonePairs() {
  return ZONE_PAIRS;
}

export function getPriorityPairs(priority) {
  return ZONE_PAIRS.filter(p => p.priority === priority);
}

export function getRelatedPairs(currentSlug, limit = 6) {
  const current = getZonePair(currentSlug);
  if (!current) return [];
  return ZONE_PAIRS
    .filter(p =>
      p.slug !== currentSlug &&
      (p.from === current.from || p.to === current.to ||
       p.from === current.to  || p.to === current.from)
    )
    .slice(0, limit);
}
