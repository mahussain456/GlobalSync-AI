/**
 * pairContext.js
 *
 * ⚠️  EVERY ENTRY BELOW MUST BE HAND-WRITTEN BY A HUMAN BEFORE PRODUCTION MERGE ⚠️
 *
 * Google classifies templated page sets as doorway pages when only the variable
 * tokens change. The `context` field here is the primary defense.
 *
 * Requirements per entry:
 *   - 2-3 sentences (50–100 words)
 *   - Describes the real-world business corridor this pair serves
 *   - Names the actual industries, roles, or workflows that span this timezone gap
 *   - Must differ materially from every sibling entry — no spin, no paraphrase
 *
 * The stubs below are PLACEHOLDERS. The build works with them, but do NOT merge
 * to production until every ⚠️ stub is replaced with original copy.
 */

const PAIR_CONTEXT = {

  // ─── Priority 1 ─────────────────────────────────────────────────────────────

  'est-to-ist': {
    corridor: 'US East Coast ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — describe the US-India outsourcing corridor,
    // the specific industries (IT services, software dev, accounting BPO),
    // and how the 10.5-hour gap shapes async-first workflows.
    context: '',
  },

  'ist-to-est': {
    corridor: 'India ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — mirror of est-to-ist but from the Indian
    // developer/contractor perspective: morning standups, US-afternoon handoffs.
    context: '',
  },

  'pst-to-ist': {
    corridor: 'US West Coast ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13.5-hour gap (14.5 during PDT).
    // This is the hardest US-India gap: describe how Silicon Valley startups
    // with Bangalore offices handle the near-total business-hours disconnect.
    context: '',
  },

  'ist-to-pst': {
    corridor: 'India ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '',
  },

  'est-to-pst': {
    corridor: 'US East Coast ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 3 hours but the US coast divide causes
    // real meeting-time friction. 9am EST call is 6am in SF. Describe the
    // practical patterns (late East, early West) and how distributed US teams handle it.
    context: '',
  },

  'pst-to-est': {
    corridor: 'US West Coast ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '',
  },

  'utc-to-est': {
    corridor: 'UTC reference ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — UTC is used by developers, DevOps, traders,
    // and global API logs. Describe who specifically needs to convert UTC to EST
    // and why (server logs, financial markets, API timestamps).
    context: '',
  },

  'utc-to-pst': {
    corridor: 'UTC reference ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '',
  },

  'gmt-to-est': {
    corridor: 'UK / Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5-hour gap (4 during BST/EDT overlap windows).
    // Transatlantic finance, London-NY media production, UK agencies with US clients.
    context: '',
  },

  'cst-to-est': {
    corridor: 'US Central ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 1 hour, but causes friction for live
    // events, TV scheduling, and financial-market opens. Describe the practical
    // impact of the 1-hour difference.
    context: '',
  },

  // ─── Priority 2 ─────────────────────────────────────────────────────────────

  'est-to-cst': {
    corridor: 'US East Coast ↔ US Central',
    context: '',
  },

  'cst-to-pst': {
    corridor: 'US Central ↔ US West Coast',
    context: '',
  },

  'mst-to-est': {
    corridor: 'US Mountain ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Note the Arizona exception: Phoenix stays on
    // MST year-round, creating a moving gap vs EST through DST transitions.
    context: '',
  },

  'est-to-gmt': {
    corridor: 'US East Coast ↔ UK',
    context: '',
  },

  'pst-to-gmt': {
    corridor: 'US West Coast ↔ UK',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 8-hour gap. SF tech companies with London
    // offices. PST morning = UK close of business. Describe the specific tension.
    context: '',
  },

  'gmt-to-pst': {
    corridor: 'UK ↔ US West Coast',
    context: '',
  },

  'cet-to-est': {
    corridor: 'Central Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 6-hour gap. EU agencies, manufacturers,
    // and SaaS companies with US East Coast clients. The EU DST/US DST mismatch
    // window in spring (2 weeks) briefly narrows the gap.
    context: '',
  },

  'est-to-cet': {
    corridor: 'US East Coast ↔ Central Europe',
    context: '',
  },

  'cet-to-ist': {
    corridor: 'Central Europe ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 4.5-hour gap. European IT companies
    // offshoring to India, EU–India trade corridors, German/French manufacturers
    // with Indian engineering partners.
    context: '',
  },

  'ist-to-cet': {
    corridor: 'India ↔ Central Europe',
    context: '',
  },

  'gmt-to-ist': {
    corridor: 'UK ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5.5-hour gap, one of the most important
    // UK-India business connections. UK financial services, IT, pharma.
    context: '',
  },

  'ist-to-gmt': {
    corridor: 'India ↔ UK',
    context: '',
  },

  'aest-to-est': {
    corridor: 'Australia East ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 15-hour gap (near-antipodal). Describe
    // which businesses actually need this (Australian export companies, AU-US
    // media co-productions, Australian investors trading US markets).
    context: '',
  },

  'est-to-aest': {
    corridor: 'US East Coast ↔ Australia East',
    context: '',
  },

  'aest-to-pst': {
    corridor: 'Australia East ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 18–19 hour gap. Nearly a full day. Describe
    // the specific workflow adaptations required (pure async, rotating on-call).
    context: '',
  },

  // ─── Priority 3 ─────────────────────────────────────────────────────────────

  'jst-to-est': {
    corridor: 'Japan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 14-hour gap. Japanese tech companies, gaming
    // firms, automotive suppliers with US operations. JST has no DST so the
    // gap shifts by 1 hour during US EDT vs EST periods.
    context: '',
  },

  'est-to-jst': {
    corridor: 'US East Coast ↔ Japan',
    context: '',
  },

  'jst-to-pst': {
    corridor: 'Japan ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 17-hour gap. Silicon Valley-Japan tech
    // partnerships, US gaming studios licensing Japanese IP.
    context: '',
  },

  'sgt-to-est': {
    corridor: 'Singapore ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Singapore as APAC financial
    // hub; US investment banks with Singapore trading desks.
    context: '',
  },

  'sgt-to-pst': {
    corridor: 'Singapore ↔ US West Coast',
    context: '',
  },

  'pht-to-est': {
    corridor: 'Philippines ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Philippines is the world's
    // largest BPO market. US companies outsource customer support and back-office
    // to Manila. Describe the overnight-shift model.
    context: '',
  },

  'pht-to-pst': {
    corridor: 'Philippines ↔ US West Coast',
    context: '',
  },

  'pkt-to-est': {
    corridor: 'Pakistan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 10-hour gap. Pakistan's growing tech export
    // industry, US companies hiring Pakistani developers on platforms like Upwork.
    context: '',
  },

  'pkt-to-pst': {
    corridor: 'Pakistan ↔ US West Coast',
    context: '',
  },

  'gst-to-est': {
    corridor: 'UAE ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 9-hour gap. Dubai as a global trading and
    // financial hub. US-UAE trade, oil, real estate, and tech investment.
    context: '',
  },

  'brt-to-est': {
    corridor: 'Brazil ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Only 2-3 hour gap (Brazil is UTC-3, EST is
    // UTC-5). Great overlap. Nearshore software development from Brazil to US.
    context: '',
  },

  'cest-to-est': {
    corridor: 'Central Europe (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — CEST is UTC+2 (summer), EST is UTC-5.
    // 7-hour gap. Note that when Europe is on CEST, the US may be on EDT
    // making the actual gap 6 hours (EDT = UTC-4).
    context: '',
  },

  'bst-to-est': {
    corridor: 'UK (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — BST is GMT+1 (UTC+1). EST is UTC-5.
    // 6-hour gap. UK summer working hours overlap well with US East mornings.
    context: '',
  },

  'nzst-to-pst': {
    corridor: 'New Zealand ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 20-21 hour gap. Almost a full day in reverse.
    // Pure async only. Describe how New Zealand tech companies handle this
    // (Atlassian's former NZ teams, Xero, etc.).
    context: '',
  },

  'utc-to-ist': {
    corridor: 'UTC reference ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Developers working with global APIs who need
    // to know what UTC timestamps mean in IST. Also relevant for stock markets
    // and server log analysis.
    context: '',
  },

};

export function getPairContext(slug) {
  return PAIR_CONTEXT[slug] ?? null;
}

export default PAIR_CONTEXT;
