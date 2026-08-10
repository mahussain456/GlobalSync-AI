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
    context: '⚠️ TODO: Write 2-3 sentences about the US East Coast to India business corridor. Focus on the specific industries and how teams manage the 10.5-hour gap.',
  },

  'ist-to-est': {
    corridor: 'India ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — mirror of est-to-ist but from the Indian
    // developer/contractor perspective: morning standups, US-afternoon handoffs.
    context: '⚠️ TODO: Write 2-3 sentences from the Indian side of the US East Coast corridor. Morning standups in India overlap with US evening — describe what that means practically.',
  },

  'pst-to-ist': {
    corridor: 'US West Coast ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13.5-hour gap (14.5 during PDT).
    // This is the hardest US-India gap: describe how Silicon Valley startups
    // with Bangalore offices handle the near-total business-hours disconnect.
    context: '⚠️ TODO: Write 2-3 sentences about PST to IST — the most challenging US-India gap at 13.5 hours. How do US tech companies with Bangalore offices manage this?',
  },

  'ist-to-pst': {
    corridor: 'India ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '⚠️ TODO: Write 2-3 sentences from the Indian perspective on the US West Coast gap.',
  },

  'est-to-pst': {
    corridor: 'US East Coast ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 3 hours but the US coast divide causes
    // real meeting-time friction. 9am EST call is 6am in SF. Describe the
    // practical patterns (late East, early West) and how distributed US teams handle it.
    context: '⚠️ TODO: Write 2-3 sentences about the US East-West coast gap. 3 hours sounds manageable but causes real friction — describe the typical scheduling patterns.',
  },

  'pst-to-est': {
    corridor: 'US West Coast ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '⚠️ TODO: Write 2-3 sentences from the West Coast perspective on the EST gap.',
  },

  'utc-to-est': {
    corridor: 'UTC reference ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — UTC is used by developers, DevOps, traders,
    // and global API logs. Describe who specifically needs to convert UTC to EST
    // and why (server logs, financial markets, API timestamps).
    context: '⚠️ TODO: Write 2-3 sentences about who converts UTC to EST and why — developers reading server logs, traders tracking market opens, API consumers.',
  },

  'utc-to-pst': {
    corridor: 'UTC reference ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: '⚠️ TODO: Write 2-3 sentences about UTC to PST — tech workers in SF reading UTC timestamps, understanding server events relative to their local day.',
  },

  'gmt-to-est': {
    corridor: 'UK / Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5-hour gap (4 during BST/EDT overlap windows).
    // Transatlantic finance, London-NY media production, UK agencies with US clients.
    context: '⚠️ TODO: Write 2-3 sentences about the UK to US East Coast corridor. Finance, media, and agency work — describe the 5-hour gap and the productive overlap window.',
  },

  'cst-to-est': {
    corridor: 'US Central ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 1 hour, but causes friction for live
    // events, TV scheduling, and financial-market opens. Describe the practical
    // impact of the 1-hour difference.
    context: '⚠️ TODO: Write 2-3 sentences about the CST to EST 1-hour gap. TV scheduling, financial-market times, and how it affects remote teams split between Chicago and New York.',
  },

  // ─── Priority 2 ─────────────────────────────────────────────────────────────

  'est-to-cst': {
    corridor: 'US East Coast ↔ US Central',
    context: '⚠️ TODO: Write 2-3 sentences about EST to CST from the East Coast perspective.',
  },

  'cst-to-pst': {
    corridor: 'US Central ↔ US West Coast',
    context: '⚠️ TODO: Write 2-3 sentences about the Chicago to San Francisco gap and which industries it most affects.',
  },

  'mst-to-est': {
    corridor: 'US Mountain ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Note the Arizona exception: Phoenix stays on
    // MST year-round, creating a moving gap vs EST through DST transitions.
    context: '⚠️ TODO: Write 2-3 sentences about MST to EST. Mention the Arizona/Phoenix exception — Phoenix stays on MST year-round while Denver observes DST.',
  },

  'est-to-gmt': {
    corridor: 'US East Coast ↔ UK',
    context: '⚠️ TODO: Write 2-3 sentences about EST to GMT — US East Coast firms working with London offices or UK freelancers.',
  },

  'pst-to-gmt': {
    corridor: 'US West Coast ↔ UK',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 8-hour gap. SF tech companies with London
    // offices. PST morning = UK close of business. Describe the specific tension.
    context: '⚠️ TODO: Write 2-3 sentences about PST to GMT — Silicon Valley to London. 8 hours means almost no business-day overlap.',
  },

  'gmt-to-pst': {
    corridor: 'UK ↔ US West Coast',
    context: '⚠️ TODO: Write 2-3 sentences from the UK perspective on the US West Coast gap.',
  },

  'cet-to-est': {
    corridor: 'Central Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 6-hour gap. EU agencies, manufacturers,
    // and SaaS companies with US East Coast clients. The EU DST/US DST mismatch
    // window in spring (2 weeks) briefly narrows the gap.
    context: '⚠️ TODO: Write 2-3 sentences about CET to EST — European companies working with US East Coast clients. Mention the 2-week DST mismatch window in spring.',
  },

  'est-to-cet': {
    corridor: 'US East Coast ↔ Central Europe',
    context: '⚠️ TODO: Write 2-3 sentences from the US side of the Europe gap.',
  },

  'cet-to-ist': {
    corridor: 'Central Europe ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 4.5-hour gap. European IT companies
    // offshoring to India, EU–India trade corridors, German/French manufacturers
    // with Indian engineering partners.
    context: '⚠️ TODO: Write 2-3 sentences about CET to IST — European firms with Indian engineering partners. The 4.5-hour gap is more manageable than US-India.',
  },

  'ist-to-cet': {
    corridor: 'India ↔ Central Europe',
    context: '⚠️ TODO: Write 2-3 sentences from the Indian side of the EU business corridor.',
  },

  'gmt-to-ist': {
    corridor: 'UK ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5.5-hour gap, one of the most important
    // UK-India business connections. UK financial services, IT, pharma.
    context: '⚠️ TODO: Write 2-3 sentences about GMT to IST — the UK-India corridor. Financial services, IT, and pharmaceuticals are the dominant industries.',
  },

  'ist-to-gmt': {
    corridor: 'India ↔ UK',
    context: '⚠️ TODO: Write 2-3 sentences from the Indian side of the UK corridor.',
  },

  'aest-to-est': {
    corridor: 'Australia East ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 15-hour gap (near-antipodal). Describe
    // which businesses actually need this (Australian export companies, AU-US
    // media co-productions, Australian investors trading US markets).
    context: '⚠️ TODO: Write 2-3 sentences about AEST to EST — the near-antipodal gap at 15 hours. Which specific industries bridge this gap and how?',
  },

  'est-to-aest': {
    corridor: 'US East Coast ↔ Australia East',
    context: '⚠️ TODO: Write 2-3 sentences from the US side of the Australia gap.',
  },

  'aest-to-pst': {
    corridor: 'Australia East ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 18–19 hour gap. Nearly a full day. Describe
    // the specific workflow adaptations required (pure async, rotating on-call).
    context: '⚠️ TODO: Write 2-3 sentences about AEST to PST — the largest gap in the set at 18-19 hours. Essentially no real-time overlap is possible.',
  },

  // ─── Priority 3 ─────────────────────────────────────────────────────────────

  'jst-to-est': {
    corridor: 'Japan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 14-hour gap. Japanese tech companies, gaming
    // firms, automotive suppliers with US operations. JST has no DST so the
    // gap shifts by 1 hour during US EDT vs EST periods.
    context: '⚠️ TODO: Write 2-3 sentences about JST to EST — Japanese companies with US operations. Gaming, automotive, and electronics are the key sectors.',
  },

  'est-to-jst': {
    corridor: 'US East Coast ↔ Japan',
    context: '⚠️ TODO: Write 2-3 sentences from the US side of the Japan time gap.',
  },

  'jst-to-pst': {
    corridor: 'Japan ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 17-hour gap. Silicon Valley-Japan tech
    // partnerships, US gaming studios licensing Japanese IP.
    context: '⚠️ TODO: Write 2-3 sentences about JST to PST — Silicon Valley companies working with Japanese partners.',
  },

  'sgt-to-est': {
    corridor: 'Singapore ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Singapore as APAC financial
    // hub; US investment banks with Singapore trading desks.
    context: '⚠️ TODO: Write 2-3 sentences about SGT to EST — Singapore as APAC financial hub and its relationship to US East Coast finance.',
  },

  'sgt-to-pst': {
    corridor: 'Singapore ↔ US West Coast',
    context: '⚠️ TODO: Write 2-3 sentences about SGT to PST — Southeast Asian tech markets and US West Coast investors.',
  },

  'pht-to-est': {
    corridor: 'Philippines ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Philippines is the world's
    // largest BPO market. US companies outsource customer support and back-office
    // to Manila. Describe the overnight-shift model.
    context: '⚠️ TODO: Write 2-3 sentences about PHT to EST — the Philippines BPO corridor. Manila is the world\'s largest outsourcing hub for US customer support.',
  },

  'pht-to-pst': {
    corridor: 'Philippines ↔ US West Coast',
    context: '⚠️ TODO: Write 2-3 sentences about PHT to PST — US West Coast companies with Filipino remote workers and BPO services.',
  },

  'pkt-to-est': {
    corridor: 'Pakistan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 10-hour gap. Pakistan's growing tech export
    // industry, US companies hiring Pakistani developers on platforms like Upwork.
    context: '⚠️ TODO: Write 2-3 sentences about PKT to EST — Pakistan\'s growing tech sector and its relationship with US companies hiring Pakistani developers.',
  },

  'pkt-to-pst': {
    corridor: 'Pakistan ↔ US West Coast',
    context: '⚠️ TODO: Write 2-3 sentences about PKT to PST — US West Coast companies working with Pakistani developers and designers.',
  },

  'gst-to-est': {
    corridor: 'UAE ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 9-hour gap. Dubai as a global trading and
    // financial hub. US-UAE trade, oil, real estate, and tech investment.
    context: '⚠️ TODO: Write 2-3 sentences about GST to EST — Dubai as a global hub and its financial and trade connections to the US East Coast.',
  },

  'brt-to-est': {
    corridor: 'Brazil ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Only 2-3 hour gap (Brazil is UTC-3, EST is
    // UTC-5). Great overlap. Nearshore software development from Brazil to US.
    context: '⚠️ TODO: Write 2-3 sentences about BRT to EST — Brazil\'s nearshore advantage. With only 2-3 hours difference, Brazilian developers work in near-real-time with US East Coast clients.',
  },

  'cest-to-est': {
    corridor: 'Central Europe (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — CEST is UTC+2 (summer), EST is UTC-5.
    // 7-hour gap. Note that when Europe is on CEST, the US may be on EDT
    // making the actual gap 6 hours (EDT = UTC-4).
    context: '⚠️ TODO: Write 2-3 sentences about CEST to EST — the summer European timezone and the US East Coast. Note the 7-hour standard gap that briefly narrows when US DST also applies.',
  },

  'bst-to-est': {
    corridor: 'UK (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — BST is GMT+1 (UTC+1). EST is UTC-5.
    // 6-hour gap. UK summer working hours overlap well with US East mornings.
    context: '⚠️ TODO: Write 2-3 sentences about BST to EST — British Summer Time and the US East Coast. The 6-hour gap during UK summer creates a productive morning/afternoon overlap.',
  },

  'nzst-to-pst': {
    corridor: 'New Zealand ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 20-21 hour gap. Almost a full day in reverse.
    // Pure async only. Describe how New Zealand tech companies handle this
    // (Atlassian's former NZ teams, Xero, etc.).
    context: '⚠️ TODO: Write 2-3 sentences about NZST to PST — the most extreme gap in the set. New Zealand tech companies like Xero and Atlassian (historically) have navigated this.',
  },

  'utc-to-ist': {
    corridor: 'UTC reference ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Developers working with global APIs who need
    // to know what UTC timestamps mean in IST. Also relevant for stock markets
    // and server log analysis.
    context: '⚠️ TODO: Write 2-3 sentences about UTC to IST — Indian developers reading UTC server logs, API timestamps, and financial data in their local time.',
  },

};

export function getPairContext(slug) {
  return PAIR_CONTEXT[slug] ?? null;
}

export default PAIR_CONTEXT;
