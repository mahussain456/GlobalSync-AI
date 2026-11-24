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
 * Nov 2026: every entry now has original context (drafted per the notes on
 * each entry, facts checked against ZONE_META offsets). An empty context still
 * ships noindex via ZonePairPage, so a new pair stays out of the index until
 * it gets its own copy.
 */

const PAIR_CONTEXT = {

  // ─── Priority 1 ─────────────────────────────────────────────────────────────

  'est-to-ist': {
    corridor: 'US East Coast ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — describe the US-India outsourcing corridor,
    // the specific industries (IT services, software dev, accounting BPO),
    // and how the 10.5-hour gap shapes async-first workflows.
    context: "New York to Bengaluru, Hyderabad and Pune is the busiest outsourcing corridor in the world: IT services, product engineering, accounting BPO and customer support all run across it. India is 10.5 hours ahead of EST and 9.5 hours ahead during EDT, so a US workday barely touches the Indian one. Most teams settle on one overlap call around 8 to 9 AM Eastern (6:30 to 7:30 PM IST) and run everything else as an end-of-day handoff.",
  },

  'ist-to-est': {
    corridor: 'India ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — mirror of est-to-ist but from the Indian
    // developer/contractor perspective: morning standups, US-afternoon handoffs.
    context: "From the Indian side, the US East Coast usually means late evenings. A developer or analyst in Chennai or Noida who joins a 9 AM New York standup is on the call at 7:30 PM IST in winter, or 6:30 PM once the US moves to daylight time. The common pattern is to finish deep work by late afternoon, attend the US sync in the evening, and leave a written status so the American team wakes up to answers instead of questions.",
  },

  'pst-to-ist': {
    corridor: 'US West Coast ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13.5-hour gap (14.5 during PDT).
    // This is the hardest US-India gap: describe how Silicon Valley startups
    // with Bangalore offices handle the near-total business-hours disconnect.
    context: "Silicon Valley startups with engineering in Bengaluru face the hardest US to India gap. India is 13.5 hours ahead of PST and 12.5 hours ahead of PDT, which leaves almost no shared business hours. Teams that make it work usually run a single short call at 8 AM Pacific (9:30 PM IST in winter), write detailed tickets so work can continue overnight, and rotate who takes the inconvenient slot so the India team is not always the one staying late.",
  },

  'ist-to-pst': {
    corridor: 'India ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: "For Indian engineers and support staff working with West Coast companies, the overlap lands either very late at night or very early in the morning. 9 PM to 10 PM IST meets 7:30 to 8:30 AM PST. Many India-based teams on Bay Area accounts shift their day to start around noon so the evening call is not the end of a 14-hour shift, and they lean heavily on recorded walkthroughs and pull request comments instead of live meetings.",
  },

  'est-to-pst': {
    corridor: 'US East Coast ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 3 hours but the US coast divide causes
    // real meeting-time friction. 9am EST call is 6am in SF. Describe the
    // practical patterns (late East, early West) and how distributed US teams handle it.
    context: "The gap is only 3 hours and never changes, because both coasts switch to daylight time on the same night. The friction is still real: a 9 AM meeting in New York is 6 AM in San Francisco, and a 5 PM Pacific wrap-up is 8 PM on the East Coast. Distributed US teams usually protect a midday window from 12 PM to 3 PM Eastern, which is 9 AM to noon Pacific, for anything that needs both coasts live.",
  },

  'pst-to-est': {
    corridor: 'US West Coast ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: "West Coast workers who report into New York headquarters, banks or media companies often start early to catch the East Coast before lunch. A 7 AM Pacific start means 10 AM Eastern, and the East Coast is logging off by 2 PM Pacific. The practical rule for Pacific-based staff is to front-load meetings into the morning and keep afternoons for focused work, since the East Coast has already gone home.",
  },

  'utc-to-est': {
    corridor: 'UTC reference ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — UTC is used by developers, DevOps, traders,
    // and global API logs. Describe who specifically needs to convert UTC to EST
    // and why (server logs, financial markets, API timestamps).
    context: "UTC is the clock for server logs, cron jobs, API timestamps, aviation and trading systems, so anyone debugging an incident or reading a deploy log in the US East Coast needs this conversion constantly. Eastern Time is UTC minus 5 hours in winter (EST) and UTC minus 4 hours in summer (EDT). A log line stamped 14:00 UTC happened at 9 AM EST, or 10 AM EDT, which is the detail that trips up most on-call engineers twice a year.",
  },

  'utc-to-pst': {
    corridor: 'UTC reference ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED
    context: "Engineers on the West Coast read UTC timestamps all day in cloud consoles, error trackers and CI pipelines. Pacific Time is 8 hours behind UTC in winter and 7 hours behind in summer, so midnight UTC is 4 PM PST or 5 PM PDT the previous calendar day. That date flip is where scheduled jobs and daily reports most often go wrong, which is why many Bay Area teams set dashboards to UTC and convert only for human-facing times.",
  },

  'gmt-to-est': {
    corridor: 'UK / Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5-hour gap (4 during BST/EDT overlap windows).
    // Transatlantic finance, London-NY media production, UK agencies with US clients.
    context: "GMT is the reference clock for London-based finance, shipping and broadcasting, and it is often what UK clients quote in contracts. Eastern Time is 5 hours behind GMT in winter. Because the UK switches to BST and the US to EDT on different weekends, London and New York are 4 hours apart for a few weeks each March and in late October, the most common cause of missed transatlantic calls.",
  },

  'cst-to-est': {
    corridor: 'US Central ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — only 1 hour, but causes friction for live
    // events, TV scheduling, and financial-market opens. Describe the practical
    // impact of the 1-hour difference.
    context: "Chicago, Dallas, Houston and Austin run on Central Time, which is always 1 hour behind Eastern because both zones change clocks on the same dates. The gap sounds trivial, but it matters for market opens (the NYSE opens at 8:30 AM Central), national broadcasts and deadlines written as \"end of day Eastern\". Central-based teams usually just remember that the East Coast is one hour further into the day.",
  },

  // ─── Priority 2 ─────────────────────────────────────────────────────────────

  'est-to-cst': {
    corridor: 'US East Coast ↔ US Central',
    context: "East Coast companies with offices or customers in Texas, Illinois or Minnesota deal with a steady 1-hour difference all year. A 9 AM Eastern kickoff is 8 AM in Chicago, and a 5 PM Eastern deadline is 4 PM Central. Sales and support teams covering both zones often stagger shifts by an hour so the Central half of the country gets the same morning coverage as the East Coast.",
  },

  'cst-to-pst': {
    corridor: 'US Central ↔ US West Coast',
    context: "Central to Pacific is a fixed 2-hour gap, common for companies split between Texas or Chicago and California. When it is 10 AM in Dallas it is 8 AM in Los Angeles. Logistics, trucking and retail operations that run across the middle of the country and the West Coast use this conversion for dispatch windows, delivery cutoffs and shift handovers.",
  },

  'mst-to-est': {
    corridor: 'US Mountain ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Note the Arizona exception: Phoenix stays on
    // MST year-round, creating a moving gap vs EST through DST transitions.
    context: "Mountain Time covers Denver, Salt Lake City, Boise and Phoenix, and it is 2 hours behind Eastern for most of the year. The catch is Arizona: it stays on MST all year, so from March to November Phoenix is 3 hours behind New York while Denver stays 2 behind. Anyone scheduling across Mountain states should confirm the exact city, not just the time zone name.",
  },

  'est-to-gmt': {
    corridor: 'US East Coast ↔ UK',
    context: "US companies with London clients, investors or suppliers convert EST to GMT for calls, contract deadlines and market hours. London is 5 hours ahead of New York most of the year. The overlap is generous by intercontinental standards: 9 AM to noon Eastern catches London between 2 PM and 5 PM, which is why transatlantic meetings tend to cluster in the New York morning.",
  },

  'pst-to-gmt': {
    corridor: 'US West Coast ↔ UK',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 8-hour gap. SF tech companies with London
    // offices. PST morning = UK close of business. Describe the specific tension.
    context: "West Coast tech and entertainment companies working with London face an 8-hour gap. By the time San Francisco starts at 9 AM, it is 5 PM in London and the UK team is ending its day. Most teams use a single early slot, around 8 AM Pacific and 4 PM in London, and hand off the rest asynchronously. During the brief March and autumn mismatch windows the gap drops to 7 hours.",
  },

  'gmt-to-pst': {
    corridor: 'UK ↔ US West Coast',
    context: "For UK-based freelancers, agencies and support teams working with California clients, the Pacific day starts as the London day ends. Noon Pacific is 8 PM GMT. UK workers on West Coast accounts commonly shift to a late start, around 11 AM to 7 PM, so they can catch Pacific mornings without working past dinner every night.",
  },

  'cet-to-est': {
    corridor: 'Central Europe ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 6-hour gap. EU agencies, manufacturers,
    // and SaaS companies with US East Coast clients. The EU DST/US DST mismatch
    // window in spring (2 weeks) briefly narrows the gap.
    context: "Central European Time covers Berlin, Paris, Madrid, Amsterdam, Rome and Warsaw, and it sits 6 hours ahead of the US East Coast. European companies selling into the US usually reserve their afternoons, roughly 3 PM to 6 PM CET, for American calls, which lands at 9 AM to noon in New York. For a few weeks in March and around late October the gap shrinks to 5 hours because Europe and the US change clocks on different weekends.",
  },

  'est-to-cet': {
    corridor: 'US East Coast ↔ Central Europe',
    context: "US firms with subsidiaries, manufacturing partners or customers in Germany, France or the Netherlands work across a 6-hour gap. The realistic window is 8 AM to 11 AM Eastern, which is 2 PM to 5 PM in Central Europe. Anything scheduled after lunch in New York has already missed the European workday, so US teams tend to start their mornings with European calls.",
  },

  'cet-to-ist': {
    corridor: 'Central Europe ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 4.5-hour gap. European IT companies
    // offshoring to India, EU–India trade corridors, German/French manufacturers
    // with Indian engineering partners.
    context: "Europe to India is a common setup for German, Dutch and French companies running development centres or shared services in India. India is 4.5 hours ahead of CET and 3.5 hours ahead when Europe moves to summer time, which gives a comfortable overlap: a 9 AM meeting in Berlin is 1:30 PM in Bengaluru. This is one of the few intercontinental corridors where a full day of live collaboration is realistic.",
  },

  'ist-to-cet': {
    corridor: 'India ↔ Central Europe',
    context: "Indian teams serving European clients enjoy far easier hours than those serving the US. With Europe 4.5 hours behind in winter and 3.5 hours behind in summer, a European 9 AM start is early afternoon in India, and the overlap runs until Indian evening. Many SAP, banking and automotive support teams in India run a 12 PM to 9 PM shift to cover the full European business day.",
  },

  'gmt-to-ist': {
    corridor: 'UK ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 5.5-hour gap, one of the most important
    // UK-India business connections. UK financial services, IT, pharma.
    context: "The UK to India corridor carries IT services, finance operations, healthcare transcription and a large diaspora calling home. India is 5.5 hours ahead of GMT in winter and 4.5 hours ahead while the UK is on BST. A 9 AM London start is 2:30 PM in India in winter, so most teams get four to five hours of shared working time each day.",
  },

  'ist-to-gmt': {
    corridor: 'India ↔ UK',
    context: "For Indian professionals working with UK clients, London mornings fall in Indian early afternoon. Indian teams typically take UK calls between 1:30 PM and 6:30 PM IST in winter, and an hour earlier in the British summer. The fixed IST offset means every change in the gap comes from the UK clocks moving in late March and late October.",
  },

  'aest-to-est': {
    corridor: 'Australia East ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 15-hour gap (near-antipodal). Describe
    // which businesses actually need this (Australian export companies, AU-US
    // media co-productions, Australian investors trading US markets).
    context: "Sydney and Melbourne to New York is one of the widest business gaps, between 14 and 16 hours depending on the season, because Australia and the US run daylight saving in opposite halves of the year. In practice the Australian morning lines up with the previous US afternoon: 8 AM in Sydney is between 4 PM and 6 PM the previous day in New York. Mining, finance and SaaS companies spanning both use that one daily window for live calls.",
  },

  'est-to-aest': {
    corridor: 'US East Coast ↔ Australia East',
    context: "US companies with Australian customers or offices find that the overlap is late afternoon on the East Coast and early next morning in Sydney. A 5 PM Eastern call reaches Sydney between 7 AM and 9 AM the following day. Remember the date flip when quoting deadlines: \"Friday close of business\" in New York is already Saturday morning in Australia.",
  },

  'aest-to-pst': {
    corridor: 'Australia East ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 18–19 hour gap. Nearly a full day. Describe
    // the specific workflow adaptations required (pure async, rotating on-call).
    context: "Australia and the US West Coast are linked by tech, film, gaming and venture capital. Sydney is 17 to 19 hours ahead of Los Angeles depending on the season. The usable window is Pacific afternoon into Australian morning: 3 PM in San Francisco is 8 to 10 AM the next day in Sydney. Australian startups selling into California often run their US sales calls at the start of their own day.",
  },

  // ─── Priority 3 ─────────────────────────────────────────────────────────────

  'jst-to-est': {
    corridor: 'Japan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 14-hour gap. Japanese tech companies, gaming
    // firms, automotive suppliers with US operations. JST has no DST so the
    // gap shifts by 1 hour during US EDT vs EST periods.
    context: "Japanese manufacturers, banks and game studios coordinating with US East Coast partners deal with a 14-hour gap, or 13 hours when the US is on daylight time. Japan does not change its clocks. The workable overlap is Tokyo early morning and New York evening: 8 AM in Tokyo is 6 PM or 7 PM the previous day in New York, so most Japan and East Coast teams rely on written handoffs between their days.",
  },

  'est-to-jst': {
    corridor: 'US East Coast ↔ Japan',
    context: "For US firms working with Japanese partners, a call at 8 PM Eastern catches Tokyo at 9 or 10 AM the next morning. Because Japan follows formal meeting customs and rarely does very early or late calls, US teams usually accept the evening slot. Contracts and deadlines should name the time zone explicitly, since Tokyo is already a calendar day ahead for most of the US workday.",
  },

  'jst-to-pst': {
    corridor: 'Japan ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 17-hour gap. Silicon Valley-Japan tech
    // partnerships, US gaming studios licensing Japanese IP.
    context: "Tokyo and the US West Coast are linked by gaming, electronics, automotive and anime licensing. Tokyo is 17 hours ahead of PST and 16 hours ahead of PDT. The standard overlap is late afternoon in California and the next morning in Japan: 4 PM in Los Angeles is 9 AM in Tokyo during US winter, and 5 PM is 9 AM in summer. That single window is where most Japan and West Coast meetings happen.",
  },

  'sgt-to-est': {
    corridor: 'Singapore ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Singapore as APAC financial
    // hub; US investment banks with Singapore trading desks.
    context: "Singapore is the Asia-Pacific headquarters for many US banks, consultancies and tech firms. It is 13 hours ahead of New York in winter and 12 hours ahead in US summer, and it never changes its clocks. Regional staff in Singapore typically take New York calls at 8 or 9 PM local time, or very early in the morning, and run most coordination through written updates.",
  },

  'sgt-to-pst': {
    corridor: 'Singapore ↔ US West Coast',
    context: "Singapore to California connects the Asian regional offices of West Coast tech companies with their headquarters. The gap is 16 hours in winter and 15 hours during US daylight time. The common overlap is early morning in Singapore and late afternoon the previous day in the Bay Area: 8 AM SGT is 4 PM PST. APAC teams often start their day with a headquarters sync.",
  },

  'pht-to-est': {
    corridor: 'Philippines ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 13-hour gap. Philippines is the world's
    // largest BPO market. US companies outsource customer support and back-office
    // to Manila. Describe the overnight-shift model.
    context: "The Philippines is the largest source of virtual assistants, customer support agents and BPO teams for US East Coast companies. Manila is 13 hours ahead of EST and 12 hours ahead of EDT, so most Filipino agents on US accounts work a night shift that mirrors the American day. A 9 AM New York start is 10 PM in Manila in winter, which is why graveyard-shift scheduling is standard in the industry.",
  },

  'pht-to-pst': {
    corridor: 'Philippines ↔ US West Coast',
    context: "Filipino VAs and support teams serving West Coast clients have an even later schedule. Manila is 16 hours ahead of PST and 15 hours ahead of PDT, so a 9 AM start in Los Angeles is 1 AM the next day in the Philippines. Many agencies place West Coast accounts on a shift that begins around midnight Manila time to match a full Pacific business day.",
  },

  'pkt-to-est': {
    corridor: 'Pakistan ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 10-hour gap. Pakistan's growing tech export
    // industry, US companies hiring Pakistani developers on platforms like Upwork.
    context: "Pakistan has a fast-growing freelance and software outsourcing sector serving US clients, especially from Lahore, Karachi and Islamabad. Pakistan Standard Time is 10 hours ahead of EST and 9 hours ahead of EDT, and Pakistan does not use daylight saving. Pakistani freelancers commonly hold US calls from 6 to 9 PM PKT, which is 8 to 11 AM in New York in winter.",
  },

  'pkt-to-pst': {
    corridor: 'Pakistan ↔ US West Coast',
    context: "For Pakistani developers and designers with California clients, the gap is 13 hours in winter and 12 hours in US summer. A 9 AM Pacific meeting falls at 10 PM in Karachi in winter. Most freelancers on West Coast projects agree on one evening check-in and deliver the rest through async updates, recorded demos and clear written specs.",
  },

  'gst-to-est': {
    corridor: 'UAE ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 9-hour gap. Dubai as a global trading and
    // financial hub. US-UAE trade, oil, real estate, and tech investment.
    context: "Gulf Standard Time covers Dubai and Abu Dhabi, a hub for trading, logistics, real estate and regional headquarters. The UAE is 9 hours ahead of EST and 8 hours ahead of EDT, and does not change its clocks. Since 2022 the UAE weekend has been Saturday and Sunday, matching the US, so the only real constraint is the hour gap: early morning in New York meets late afternoon in Dubai.",
  },

  'brt-to-est': {
    corridor: 'Brazil ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Only 2-3 hour gap (Brazil is UTC-3, EST is
    // UTC-5). Great overlap. Nearshore software development from Brazil to US.
    context: "Brazil is a growing nearshore destination for US software teams because of its close time zone. Brasilia Time is 2 hours ahead of EST and 1 hour ahead of EDT, and Brazil has not used daylight saving since 2019. That means São Paulo and New York share almost the entire business day, which makes Brazilian engineers easy to slot into US sprint ceremonies and live pairing.",
  },

  'cest-to-est': {
    corridor: 'Central Europe (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — CEST is UTC+2 (summer), EST is UTC-5.
    // 7-hour gap. Note that when Europe is on CEST, the US may be on EDT
    // making the actual gap 6 hours (EDT = UTC-4).
    context: "Central European Summer Time runs from late March to late October across most of the EU. During this period Berlin, Paris and Madrid are 6 hours ahead of New York, since the US is on EDT at the same time. The exceptions are a few weeks in March and late October to early November, when the two sides have changed clocks on different weekends and the gap is 5 hours.",
  },

  'bst-to-est': {
    corridor: 'UK (Summer) ↔ US East Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — BST is GMT+1 (UTC+1). EST is UTC-5.
    // 6-hour gap. UK summer working hours overlap well with US East mornings.
    context: "British Summer Time runs from the last Sunday in March to the last Sunday in October, and the US is on daylight time for that entire period. So while the UK is on BST, London is 5 hours ahead of New York. Summer is the easiest season for transatlantic work: long UK evenings make a 1 PM Eastern call at 6 PM in London a reasonable ask.",
  },

  'nzst-to-pst': {
    corridor: 'New Zealand ↔ US West Coast',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — 20-21 hour gap. Almost a full day in reverse.
    // Pure async only. Describe how New Zealand tech companies handle this
    // (Atlassian's former NZ teams, Xero, etc.).
    context: "New Zealand and the US West Coast are close to a full day apart: 19 to 21 hours depending on the season, since New Zealand's summer daylight saving runs while the US is on standard time. New Zealand is effectively a day ahead, so Monday morning in Auckland is still Sunday in California. NZ software and tourism businesses selling to the US usually work with US customers in their own early morning.",
  },

  'utc-to-ist': {
    corridor: 'UTC reference ↔ India',
    // ⚠️ HUMAN_WRITTEN_REQUIRED — Developers working with global APIs who need
    // to know what UTC timestamps mean in IST. Also relevant for stock markets
    // and server log analysis.
    context: "Indian developers, DevOps teams and traders convert UTC to IST constantly for cloud logs, API timestamps, deployment windows and global market data. IST is UTC plus 5 hours 30 minutes all year, with no daylight saving, so the conversion never shifts. The half-hour offset is the part that catches people out: a job scheduled for 18:00 UTC runs at 11:30 PM IST, not 11 PM.",
  },

};

export function getPairContext(slug) {
  return PAIR_CONTEXT[slug] ?? null;
}

export default PAIR_CONTEXT;
