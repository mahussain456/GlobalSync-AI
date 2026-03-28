// ─── Programmatic SEO Data ────────────────────────────────────────────────────
// City + currency metadata and pair-specific content for all programmatic pages.

// ─── CITIES ──────────────────────────────────────────────────────────────────
export const CITIES = {
  "new-york":      { name: "New York",      country: "USA",         timezone: "America/New_York",     abbr: "EST/EDT", utcStd: -5,  role: "the financial capital of the United States" },
  "london":        { name: "London",        country: "UK",          timezone: "Europe/London",         abbr: "GMT/BST", utcStd: 0,   role: "a global financial and tech hub" },
  "tokyo":         { name: "Tokyo",         country: "Japan",       timezone: "Asia/Tokyo",            abbr: "JST",     utcStd: 9,   role: "Asia's largest financial centre" },
  "dubai":         { name: "Dubai",         country: "UAE",         timezone: "Asia/Dubai",            abbr: "GST",     utcStd: 4,   role: "the business hub of the Middle East" },
  "mumbai":        { name: "Mumbai",        country: "India",       timezone: "Asia/Kolkata",          abbr: "IST",     utcStd: 5.5, role: "India's financial and tech capital" },
  "san-francisco": { name: "San Francisco", country: "USA",         timezone: "America/Los_Angeles",   abbr: "PST/PDT", utcStd: -8,  role: "the heart of Silicon Valley" },
  "lisbon":        { name: "Lisbon",        country: "Portugal",    timezone: "Europe/Lisbon",         abbr: "WET/WEST",utcStd: 0,   role: "Europe's fastest-growing digital nomad hub" },
  "bali":          { name: "Bali",          country: "Indonesia",   timezone: "Asia/Makassar",         abbr: "WITA",    utcStd: 8,   role: "the world's most popular digital nomad island" },
  "austin":        { name: "Austin",        country: "USA",         timezone: "America/Chicago",       abbr: "CST/CDT", utcStd: -6,  role: "a rapidly growing US tech hub" },
  "berlin":        { name: "Berlin",        country: "Germany",     timezone: "Europe/Berlin",         abbr: "CET/CEST",utcStd: 1,   role: "Europe's leading startup and tech city" },
  "singapore":     { name: "Singapore",     country: "Singapore",   timezone: "Asia/Singapore",        abbr: "SGT",     utcStd: 8,   role: "the business gateway to Southeast Asia" },
  "sydney":        { name: "Sydney",        country: "Australia",   timezone: "Australia/Sydney",      abbr: "AEST/AEDT",utcStd: 10, role: "Australia's largest business and tech city" },
};

// ─── CITY PAIRS ──────────────────────────────────────────────────────────────
export const CITY_PAIRS = {
  "new-york-to-london": {
    from: "new-york", to: "london",
    searchVolume: "high",
    context: "The New York to London time corridor is one of the busiest in global business. New York (EST) is typically 5 hours behind London (GMT), narrowing to 4 hours during US Summer (EDT). This overlap supports a strong 4-hour window each morning where East Coast and UK business hours align, making it the foundation of transatlantic remote collaboration.",
    meetingTip: "The best meeting time for New York and London teams is 9 AM–1 PM ET (2 PM–6 PM GMT) in winter, or 9 AM–12 PM ET (2 PM–5 PM BST) in summer. Schedule important calls before noon New York time.",
    faqs: [
      { q: "How many hours ahead is London compared to New York?", a: "London (GMT) is 5 hours ahead of New York (EST) in winter, and 4 hours ahead when the US observes Daylight Saving Time (EDT, March–November). London switches to BST (UTC+1) in late March, which reduces the gap further to 4 hours." },
      { q: "What is the best meeting time for New York and London?", a: "The sweet spot is 9 AM–1 PM Eastern Time, which corresponds to 2 PM–6 PM London time. This 4-hour window keeps both parties within standard business hours, avoiding early mornings or late evenings for either team." },
      { q: "Does New York or London change clocks first in spring?", a: "The US changes clocks roughly 3 weeks before the UK each spring (second Sunday in March vs. last Sunday in March). During this 3-week gap, the gap between New York and London is only 4 hours instead of 5." },
      { q: "What time is 9 AM EST in London?", a: "9 AM EST = 2 PM GMT (London) in winter. During US Daylight Saving Time (EDT), 9 AM EDT = 2 PM BST. The difference is always 5 hours in winter and 4 hours in summer." },
    ],
    related: ["london-to-tokyo", "new-york-to-dubai", "san-francisco-to-new-york"],
  },
  "london-to-tokyo": {
    from: "london", to: "tokyo",
    searchVolume: "high",
    context: "London and Tokyo are separated by 9 hours (GMT to JST), with no daylight saving in Japan. This wide gap means there is very little overlap between standard business hours — London's afternoon (4 PM–5 PM GMT) corresponds to Tokyo's early morning (1 AM–2 AM JST), making synchronous collaboration challenging. Most UK-Japan remote teams rely heavily on async communication.",
    meetingTip: "The only viable real-time window is 8 AM–9 AM Tokyo time (11 PM–12 AM London GMT) — placing it outside normal hours for the London side. Rotating who takes the off-hours call is essential for fair distributed teamwork.",
    faqs: [
      { q: "How many hours ahead is Tokyo compared to London?", a: "Tokyo (JST, UTC+9) is 9 hours ahead of London (GMT, UTC+0) in winter. During UK Summer Time (BST, UTC+1), the gap narrows to 8 hours. Japan does not observe daylight saving time." },
      { q: "Is there any business hour overlap between London and Tokyo?", a: "Effectively no. When Tokyo's 9 AM business day begins, it is midnight in London. For synchronous meetings, one party must work outside standard hours. The best compromise is early evening Tokyo time (6–8 PM JST) which is 9–11 AM GMT." },
      { q: "What is 9 AM JST in London GMT?", a: "9 AM Tokyo time (JST, UTC+9) is midnight GMT (12 AM) in London. This makes early Tokyo morning impractical for London-side meetings. A more workable window is 4–6 PM Tokyo (7–9 AM London)." },
      { q: "How do remote teams handle the London–Tokyo time gap?", a: "Successful teams use an async-first workflow: detailed written updates, recorded video briefings, and shared project boards. When synchronous calls are needed, they rotate the off-hours burden or meet at 7–9 AM London (4–6 PM Tokyo)." },
    ],
    related: ["new-york-to-london", "dubai-to-mumbai", "new-york-to-tokyo"],
  },
  "dubai-to-mumbai": {
    from: "dubai", to: "mumbai",
    searchVolume: "high",
    context: "Dubai (GST, UTC+4) and Mumbai (IST, UTC+5:30) are separated by just 1.5 hours, making this one of the most compatible business time zones in the Middle East–South Asia corridor. Neither city observes daylight saving time, so the gap is constant year-round. This predictability makes Dubai–Mumbai one of the easiest international pairs to coordinate.",
    meetingTip: "Any time during normal business hours works well. A 10 AM Dubai call = 11:30 AM Mumbai. A 2 PM Mumbai call = 12:30 PM Dubai. Both teams can meet without anyone working outside standard hours.",
    faqs: [
      { q: "What is the time difference between Dubai and Mumbai?", a: "Mumbai (IST, UTC+5:30) is 1 hour and 30 minutes ahead of Dubai (GST, UTC+4). Neither city observes daylight saving time, so this gap is fixed year-round." },
      { q: "What is 9 AM GST (Dubai) in Mumbai time?", a: "9 AM Dubai time (GST) = 10:30 AM in Mumbai (IST). The 1.5-hour gap means a morning Dubai meeting is still well within morning business hours in Mumbai." },
      { q: "Do Dubai and Mumbai change clocks seasonally?", a: "No. Both the UAE and India do not observe daylight saving time. The Dubai–Mumbai gap is a constant 1 hour 30 minutes throughout the entire year." },
      { q: "Is it easy to schedule meetings between Dubai and Mumbai?", a: "Yes — this is one of the most scheduling-friendly international pairs. The entire standard business day (9 AM–5 PM) in both cities overlaps, with a comfortable 1.5-hour offset that doesn't push either team into early mornings or late evenings." },
    ],
    related: ["new-york-to-dubai", "london-to-dubai", "new-york-to-london"],
  },
  "san-francisco-to-new-york": {
    from: "san-francisco", to: "new-york",
    searchVolume: "high",
    context: "San Francisco (PST/PDT) is 3 hours behind New York (EST/EDT) — the classic US coast-to-coast time gap. With both cities observing daylight saving time on the same schedule, this 3-hour gap is consistent throughout the year. It's one of the most navigated domestic US time zone pairs for remote teams.",
    meetingTip: "New York's 9 AM is San Francisco's 6 AM — too early for West Coast team members. The practical meeting window is 12 PM–5 PM ET (9 AM–2 PM PT), which keeps both sides within reasonable working hours.",
    faqs: [
      { q: "How many hours is San Francisco behind New York?", a: "San Francisco (PST/PDT) is always 3 hours behind New York (EST/EDT). Both cities observe Daylight Saving Time simultaneously, so the 3-hour gap remains constant throughout the year." },
      { q: "What is 9 AM Eastern Time in Pacific Time?", a: "9 AM ET = 6 AM PT. This is generally too early for San Francisco-based team members. The earliest reasonable cross-coast meeting is typically 12 PM ET (9 AM PT)." },
      { q: "What is the best working overlap between San Francisco and New York?", a: "The shared business hours window is 12 PM–5 PM ET / 9 AM–2 PM PT. Afternoon meetings on the East Coast align with the San Francisco morning, making this the most productive window for US coast-to-coast collaboration." },
      { q: "Does the time gap between San Francisco and New York change with DST?", a: "No. Both cities switch clocks on the same date (second Sunday in March and first Sunday in November), so the 3-hour gap between PST/PDT and EST/EDT is constant year-round." },
    ],
    related: ["new-york-to-london", "austin-to-berlin", "lisbon-to-new-york"],
  },
  "lisbon-to-new-york": {
    from: "lisbon", to: "new-york",
    searchVolume: "medium",
    context: "Lisbon has become Europe's top digital nomad hub, and its proximity to the US time zone makes it unusually attractive for remote workers with American clients. Lisbon (WET, UTC+0) is 5 hours ahead of New York (EST) in winter — the same as London. In summer, Lisbon switches to WEST (UTC+1), narrowing the gap to 4 hours during US EDT.",
    meetingTip: "For Lisbon-based remote workers with New York clients, the afternoon is the key window: 2 PM–5 PM Lisbon (9 AM–12 PM New York). This keeps Lisbon workers within normal afternoon hours while aligning with New York morning meetings.",
    faqs: [
      { q: "How many hours ahead is Lisbon compared to New York?", a: "Lisbon (WET, UTC+0) is 5 hours ahead of New York (EST) in winter, and 4 hours ahead during US summer (EDT). In European summer, Lisbon is WEST (UTC+1), so the gap remains 4–5 hours depending on the time of year." },
      { q: "Why do remote workers choose Lisbon for working with US clients?", a: "Lisbon offers a 4–5 hour gap with New York, which is much more manageable than other European cities (Paris, Berlin: 6–7 hours). Afternoon hours in Lisbon align with New York mornings, allowing a clean overlap without extreme schedule sacrifices." },
      { q: "What is the best meeting time for Lisbon and New York?", a: "2 PM–5 PM Lisbon time (WET) = 9 AM–12 PM New York (EST). This window is ideal for both sides — Lisbon teams stay in normal afternoon hours while New York colleagues are at their most productive in the morning." },
      { q: "Is Lisbon in the same time zone as London?", a: "Yes, most of the year. Both observe UTC+0 (WET/GMT) in winter and UTC+1 (WEST/BST) in summer, and they switch on the same dates. The Lisbon–London time gap is 0 hours." },
    ],
    related: ["new-york-to-london", "austin-to-berlin", "san-francisco-to-new-york"],
  },
  "bali-to-london": {
    from: "bali", to: "london",
    searchVolume: "medium",
    context: "Bali (WITA, UTC+8) is one of the most popular digital nomad destinations in the world — and one of the most challenging for working with European clients. The Bali–London gap is 8 hours in UK winter (GMT) and 7 hours in UK summer (BST). This places London's 9 AM start at 4–5 PM in Bali, requiring Bali-based nomads to shift their schedule toward the afternoon.",
    meetingTip: "Bali remote workers collaborating with London should block 4 PM–8 PM WITA as their 'London overlap window' — corresponding to 8 AM–12 PM GMT. Async tools like Loom and Notion are essential for communication outside this window.",
    faqs: [
      { q: "How many hours ahead is Bali compared to London?", a: "Bali (WITA, UTC+8) is 8 hours ahead of London (GMT) in winter, and 7 hours ahead during UK Summer Time (BST, UTC+1). Bali does not observe daylight saving time." },
      { q: "Can Bali-based remote workers collaborate with London in real time?", a: "Yes, but with schedule adjustments. London's morning (8 AM–12 PM GMT) corresponds to Bali's afternoon (4 PM–8 PM WITA). Many Bali-based nomads shift their productive hours later to accommodate European client calls." },
      { q: "What is 9 AM London GMT in Bali time?", a: "9 AM London (GMT) = 5 PM Bali (WITA). During UK Summer Time, 9 AM BST = 4 PM WITA. This makes late afternoon the key meeting window for Bali-London teams." },
      { q: "Is Bali a good base for working with US clients?", a: "Working with US clients from Bali is extremely challenging due to a 13–16 hour gap depending on the US time zone. Most Bali-based nomads with US clients work primarily async or take calls very early in the morning (Bali) / late at night (US)." },
    ],
    related: ["lisbon-to-new-york", "london-to-tokyo", "austin-to-berlin"],
  },
  "austin-to-berlin": {
    from: "austin", to: "berlin",
    searchVolume: "medium",
    context: "Austin (CST/CDT) and Berlin (CET/CEST) represent a growing tech-to-tech corridor, with Austin's booming startup scene increasingly collaborating with European teams. The gap is 7 hours in winter (CST vs. CET) and 6 hours in summer (CDT vs. CEST), with both regions observing daylight saving on different schedules for a brief transition period each spring and fall.",
    meetingTip: "The Austin–Berlin overlap window is typically 2 PM–5 PM CET (7 AM–10 AM CST) in winter, and 3 PM–7 PM CEST (8 AM–12 PM CDT) in summer. Morning Berlin calls align well with Austin early-morning starts.",
    faqs: [
      { q: "How many hours ahead is Berlin compared to Austin?", a: "Berlin (CET, UTC+1) is typically 7 hours ahead of Austin (CST, UTC-6) in winter. During summer, both switch to daylight saving time — but on different dates — creating a brief 6-hour gap period. For most of the year, the gap is 6–7 hours." },
      { q: "What is 9 AM CET (Berlin) in Austin time?", a: "9 AM Berlin (CET) = 2 AM Austin (CST) — far too early. The earliest workable Austin meeting is 7 AM CST, which corresponds to 2 PM CET Berlin, meaning Berlin colleagues must take afternoon calls." },
      { q: "What is the best time zone overlap for Austin and Berlin?", a: "2 PM–5 PM CET (7–10 AM CST) in winter is the best overlap. In summer, 3 PM–7 PM CEST (8 AM–12 PM CDT) works well. This limits the shared window to 3–4 hours, making async-first workflows essential." },
      { q: "Do Austin and Berlin switch to daylight saving time on the same dates?", a: "No. The US switches on the second Sunday in March, while Europe switches on the last Sunday in March — typically 2 weeks apart. There is a brief period each spring when the US has changed clocks but Europe hasn't, temporarily reducing the gap by 1 hour." },
    ],
    related: ["lisbon-to-new-york", "new-york-to-london", "san-francisco-to-new-york"],
  },
  "new-york-to-dubai": {
    from: "new-york", to: "dubai",
    searchVolume: "medium",
    context: "New York (EST/EDT) and Dubai (GST, UTC+4) sit 9 hours apart in winter and 8 hours apart when the US observes EDT. Dubai does not observe daylight saving time, so the gap varies seasonally on the New York side only. This makes the New York–Dubai corridor one of the more challenging for real-time collaboration, requiring one team to work outside standard hours.",
    meetingTip: "The workable window is 8 AM–10 AM Dubai time (11 PM–1 AM ET in winter, or 12 AM–2 AM EDT in summer) — which is impractical for New York. Alternatively, 5 PM–7 PM ET (2 AM–4 AM Dubai) is equally bad. Most NY–Dubai teams operate async-first.",
    faqs: [
      { q: "What is the time difference between New York and Dubai?", a: "Dubai (GST, UTC+4) is 9 hours ahead of New York (EST) in winter, and 8 hours ahead when New York observes Eastern Daylight Time (EDT, spring–fall). Dubai does not observe daylight saving time." },
      { q: "What time is 9 AM EST in Dubai?", a: "9 AM New York (EST) = 6 PM Dubai (GST). If New York is on EDT, then 9 AM EDT = 5 PM GST. Late afternoon in Dubai is the best time to catch New York in the morning." },
      { q: "Is there a business hour overlap between New York and Dubai?", a: "The overlap is minimal. Dubai's business day ends at 5–6 PM GST, which is 8–9 AM ET — right at the start of the New York day. The 30–60 minute window at the start of the US East Coast day is the only real-time overlap." },
      { q: "How do remote teams manage the New York–Dubai time gap?", a: "Most teams use Dubai's early morning hours for async reviews and New York's morning for async responses. Weekly synchronous calls are held in the early evening New York time (5–6 PM ET = 2–3 AM Dubai) or early morning Dubai (7–8 AM GST = 10–11 PM ET prior evening), with one side taking the off-hours commitment on a rotating basis." },
    ],
    related: ["dubai-to-mumbai", "new-york-to-london", "london-to-dubai"],
  },
  "london-to-dubai": {
    from: "london", to: "dubai",
    searchVolume: "medium",
    context: "London (GMT/BST) and Dubai (GST, UTC+4) are separated by 4 hours in UK winter and 3 hours in UK summer. This is a highly manageable gap, making London–Dubai one of the most compatible international business pairs for real-time collaboration. The corridor handles significant financial, trade, and tech industry traffic.",
    meetingTip: "9 AM–2 PM London (1 PM–6 PM Dubai) is an excellent overlap window in winter. In UK summer (BST), 9 AM–3 PM London (12 PM–6 PM Dubai) is even better. Both teams stay squarely within business hours.",
    faqs: [
      { q: "How many hours ahead is Dubai compared to London?", a: "Dubai (GST, UTC+4) is 4 hours ahead of London (GMT) in winter, and 3 hours ahead during UK Summer Time (BST, UTC+1). Dubai does not observe daylight saving time, so the gap changes only when the UK clocks change." },
      { q: "What time is 9 AM GMT (London) in Dubai?", a: "9 AM London (GMT) = 1 PM Dubai (GST). During UK Summer Time, 9 AM BST = 12 PM GST. This comfortable midday overlap makes London–Dubai one of the easiest time zone pairs for business scheduling." },
      { q: "Do Dubai and London have good business hour overlap?", a: "Yes — the London–Dubai overlap is one of the best intercontinental pairs. Both cities share roughly 6–7 hours of overlapping business time, making this corridor ideal for real-time collaboration, live meetings, and same-day decision cycles." },
      { q: "What is the best meeting window for London and Dubai teams?", a: "10 AM–2 PM London time is the optimal window (2 PM–6 PM Dubai in winter; 1 PM–5 PM Dubai in summer). This keeps London in the productive morning/early afternoon and Dubai in the standard afternoon work window." },
    ],
    related: ["dubai-to-mumbai", "new-york-to-dubai", "new-york-to-london"],
  },
  "new-york-to-tokyo": {
    from: "new-york", to: "tokyo",
    searchVolume: "high",
    context: "New York (EST/EDT) and Tokyo (JST, UTC+9) are separated by 14 hours in winter and 13 hours in summer — one of the most challenging major city pairs for real-time collaboration. Japan does not observe daylight saving time. The massive gap means that when New York begins its workday, Tokyo is already into the following day's late evening or night.",
    meetingTip: "There is virtually no business-hours overlap. The only pragmatic real-time window is 7 AM–9 AM New York time (9 PM–11 PM Tokyo), requiring Tokyo colleagues to take late evening calls. For most teams, async is the primary collaboration mode.",
    faqs: [
      { q: "How many hours ahead is Tokyo compared to New York?", a: "Tokyo (JST, UTC+9) is 14 hours ahead of New York (EST) in winter, and 13 hours ahead when New York observes EDT. Japan does not change clocks, so the gap shifts by 1 hour when the US switches to EDT (spring) and back to EST (fall)." },
      { q: "What is 9 AM EST in Tokyo?", a: "9 AM New York (EST) = 11 PM Tokyo (JST) on the same calendar day. When New York is on EDT, 9 AM EDT = 10 PM JST. This means New York's morning aligns with Tokyo's late night." },
      { q: "Is there any business hour overlap between New York and Tokyo?", a: "No meaningful overlap exists. The closest is 7–9 AM New York (9–11 PM Tokyo), but this requires Tokyo team members to work into the evening. Most NY–Tokyo collaborations rely on async workflows with one weekly synchronous call at a mutually tolerable time." },
      { q: "How do companies manage the New York–Tokyo time gap?", a: "Most successful NY–Tokyo remote teams use a 'follow-the-sun' model: Tokyo works during Japan hours and hands off to New York, which continues the work. Thorough documentation, recorded meetings, and project management tools are essential. When synchronous calls are needed, Tokyo's evening (9–11 PM JST) or New York's early morning (7–9 AM EST) are the least disruptive options." },
    ],
    related: ["london-to-tokyo", "new-york-to-dubai", "new-york-to-london"],
  },
};

// ─── CURRENCIES ──────────────────────────────────────────────────────────────
export const CURRENCIES_META = {
  "usd": { name: "US Dollar",        country: "United States",  symbol: "$",  code: "USD", description: "the world's primary reserve currency and the dominant currency for international trade" },
  "eur": { name: "Euro",             country: "Eurozone",       symbol: "€",  code: "EUR", description: "the official currency of 20 EU member states and the world's second-largest reserve currency" },
  "gbp": { name: "British Pound",    country: "United Kingdom", symbol: "£",  code: "GBP", description: "the oldest currency still in use and one of the world's most traded currencies" },
  "inr": { name: "Indian Rupee",     country: "India",          symbol: "₹",  code: "INR", description: "the currency of the world's largest freelancing workforce and a major IT outsourcing hub" },
  "pkr": { name: "Pakistani Rupee",  country: "Pakistan",       symbol: "₨", code: "PKR", description: "the currency of a growing remote work and tech outsourcing nation" },
  "ngn": { name: "Nigerian Naira",   country: "Nigeria",        symbol: "₦",  code: "NGN", description: "the currency of Africa's largest economy and a major source of global remote tech talent" },
  "brl": { name: "Brazilian Real",   country: "Brazil",         symbol: "R$", code: "BRL", description: "the currency of Latin America's largest economy and a growing remote work hub" },
  "sar": { name: "Saudi Riyal",      country: "Saudi Arabia",   symbol: "﷼", code: "SAR", description: "the currency of one of the world's largest oil economies, pegged to the US Dollar" },
  "aed": { name: "UAE Dirham",       country: "UAE",            symbol: "د.إ",code: "AED", description: "the currency of a major global business hub, pegged to the US Dollar at 3.6725" },
  "jpy": { name: "Japanese Yen",     country: "Japan",          symbol: "¥",  code: "JPY", description: "Asia's most widely traded currency and a traditional safe-haven asset" },
  "aud": { name: "Australian Dollar",country: "Australia",      symbol: "A$", code: "AUD", description: "a major commodity currency and the currency of a growing remote work and tech hub" },
  "cad": { name: "Canadian Dollar",  country: "Canada",         symbol: "C$", code: "CAD", description: "closely correlated with the US Dollar and important for North American remote workers" },
};

// ─── CURRENCY PAIRS ───────────────────────────────────────────────────────────
export const CURRENCY_PAIRS = {
  "usd-to-eur": {
    from: "usd", to: "eur",
    context: "USD to EUR is one of the most traded currency pairs in the world, representing the two largest global economies. For remote workers, freelancers, and global businesses, the USD/EUR rate directly impacts the value of cross-border invoices, salaries, and international payments. European freelancers working with US clients convert dollars to euros frequently.",
    remoteTip: "If you invoice US clients in USD, check the live USD/EUR rate before setting your price. A 2–3% rate shift over a month can significantly affect your real income in euros.",
    faqs: [
      { q: "What is the current USD to EUR exchange rate?", a: "The USD/EUR rate changes constantly based on global economic conditions, Federal Reserve and ECB policy decisions, inflation data, and market sentiment. Use the live converter above to get the current real-time rate." },
      { q: "Why does the USD to EUR rate matter for remote workers?", a: "European freelancers and remote workers who invoice US clients in USD are directly exposed to USD/EUR fluctuations. A weaker dollar means fewer euros received for the same invoice amount. Monitoring this rate helps you time invoicing and plan your finances." },
      { q: "Is the USD stronger than the EUR?", a: "Historically, the EUR has been worth more than 1 USD (e.g., 1 EUR = ~1.07–1.12 USD), though the two have approached parity at times of economic stress. The live rate above shows the current relationship." },
      { q: "How often does the USD/EUR rate change?", a: "The USD/EUR rate changes continuously during global forex market hours (24 hours a day on weekdays). For practical purposes, the rate you see in the morning may differ noticeably from the afternoon rate during periods of high volatility." },
    ],
    related: ["usd-to-gbp", "eur-to-gbp", "usd-to-inr"],
  },
  "usd-to-gbp": {
    from: "usd", to: "gbp",
    context: "USD to GBP is a major currency pair for transatlantic business. UK-based freelancers, agencies, and remote workers regularly convert dollar earnings to pounds. The British Pound typically trades between 0.75–0.82 to the dollar, though political events (Brexit, Bank of England policy) have caused significant volatility.",
    remoteTip: "UK freelancers working with US clients should compare the USD/GBP rate against the USD/EUR rate when considering which currency to invoice in. Pounds have historically provided better value than euros when the GBP is strong.",
    faqs: [
      { q: "How many British Pounds is 1 US Dollar?", a: "The USD/GBP rate fluctuates daily. The live rate above shows the current conversion. Historically, 1 USD typically buys between 0.75 and 0.82 GBP, though this varies significantly with economic conditions." },
      { q: "Should I invoice US clients in USD or GBP as a UK freelancer?", a: "Most US clients prefer to pay in USD. As a UK freelancer, you can invoice in USD and convert at the prevailing rate, or negotiate GBP invoicing (which gives you rate certainty). Monitoring USD/GBP trends helps you decide when to invoice and convert." },
      { q: "What affects the GBP to USD exchange rate?", a: "Key factors include Bank of England interest rate decisions, UK economic data (GDP, inflation), US Federal Reserve policy, and major political events. Post-Brexit trade dynamics also continue to influence the pound's strength." },
      { q: "What is the best way to convert USD to GBP for freelancers?", a: "Use a live currency converter to check the current mid-market rate, then compare what your bank or transfer service charges. Services like Wise or Revolut often offer rates much closer to the mid-market rate than traditional banks." },
    ],
    related: ["usd-to-eur", "eur-to-gbp", "gbp-to-inr"],
  },
  "eur-to-gbp": {
    from: "eur", to: "gbp",
    context: "EUR to GBP is a critical pair for businesses operating across EU and UK markets post-Brexit. With the UK no longer in the EU single market, currency conversion between pounds and euros has become a routine cost for cross-border European trade and remote workers serving both markets.",
    remoteTip: "European freelancers invoicing UK clients should monitor EUR/GBP trends. When the pound is strong relative to the euro, UK-priced contracts are worth more in euros — a meaningful consideration for contract negotiation.",
    faqs: [
      { q: "How many British Pounds is 1 Euro?", a: "The EUR/GBP rate changes daily. Historically, 1 EUR buys between 0.83 and 0.92 GBP, though Brexit and Bank of England/ECB policy divergences have caused notable swings. Check the live rate above." },
      { q: "Is the Euro stronger than the British Pound?", a: "In nominal terms, 1 GBP is typically worth more than 1 EUR — meaning the pound is 'stronger' in face value. However, this doesn't reflect purchasing power parity. The EUR/GBP rate fluctuates around 0.85–0.88 GBP per euro in normal market conditions." },
      { q: "How has Brexit affected the EUR/GBP rate?", a: "The 2016 Brexit vote caused the pound to fall sharply against the euro. The EUR/GBP rate has been more volatile since Brexit as markets adjust to new UK–EU trade dynamics, Bank of England policy, and the UK's economic performance outside the EU single market." },
      { q: "What is the best EUR/GBP rate for business transfers?", a: "The 'best' rate is the real-time mid-market rate shown above. Your bank or payment provider will charge a margin on top of this. For large transfers, use a specialist FX provider to minimize the spread." },
    ],
    related: ["usd-to-eur", "usd-to-gbp", "gbp-to-inr"],
  },
  "usd-to-inr": {
    from: "usd", to: "inr",
    context: "USD to INR is one of the most searched currency conversions in the world, driven by India's massive freelancing and IT services workforce. With millions of Indian professionals invoicing US and UK clients in dollars, the daily USD/INR rate directly impacts the income of a significant portion of India's 15+ million freelancers. The rupee typically trades between 82 and 85 per US dollar.",
    remoteTip: "Indian freelancers and remote workers should monitor the USD/INR rate closely. A 1-rupee move per dollar on a $5,000 invoice is ₹5,000 — real money. Convert when the rate is favorable rather than on a fixed schedule.",
    faqs: [
      { q: "What is today's USD to INR exchange rate?", a: "The USD/INR rate changes daily. Check the live rate above for the current real-time conversion. The rupee typically trades in the 82–86 per dollar range, subject to RBI interventions and global dollar strength." },
      { q: "Why does USD to INR matter for Indian freelancers?", a: "India has the world's largest freelancing population. Most Indian tech, design, and writing professionals invoice international clients in USD. A stronger dollar means more rupees per payment — directly boosting real income. Tracking this rate is a key financial skill for Indian remote workers." },
      { q: "How does the RBI influence the USD/INR rate?", a: "The Reserve Bank of India regularly intervenes in the forex market to prevent excessive rupee volatility. By buying or selling dollars, the RBI manages the rate within a range it considers conducive to trade stability. This makes USD/INR less volatile than many emerging market currency pairs." },
      { q: "What is the best way for Indian freelancers to receive USD payments?", a: "Popular options include Payoneer, Wise (TransferWise), and direct bank transfers. Each has different USD/INR conversion rates and fees. Compare the effective rate (including all fees) using a live converter to maximize your rupee income." },
    ],
    related: ["gbp-to-inr", "usd-to-pkr", "usd-to-eur"],
  },
  "usd-to-pkr": {
    from: "usd", to: "pkr",
    context: "USD to PKR is a high-interest rate for Pakistan's growing remote work and tech outsourcing community. Pakistan has seen significant growth in freelance earnings from international clients, making the daily dollar-to-rupee rate a key economic indicator for hundreds of thousands of remote workers. The Pakistani rupee has experienced significant depreciation over the 2020s.",
    remoteTip: "Pakistani freelancers with dollar earnings should consider converting promptly when the PKR is weakening — holding USD during depreciation periods preserves more value. Use a live rate tool to time your conversions.",
    faqs: [
      { q: "What is the current USD to PKR exchange rate?", a: "The USD/PKR rate is highly variable. Pakistan's rupee has depreciated significantly in recent years. Check the live converter above for today's rate. The rate is set by the open market and can differ from the official interbank rate." },
      { q: "Why is the USD to PKR rate important for Pakistani freelancers?", a: "Pakistan has one of the fastest-growing freelancing communities in Asia. Remote workers earning in dollars need to convert to PKR for local expenses. Rate monitoring is critical because PKR depreciation means your dollar earnings are worth more in rupees." },
      { q: "Is there a difference between the interbank and open market USD/PKR rate?", a: "Yes. Pakistan has historically had a gap between the official State Bank of Pakistan (SBP) interbank rate and the open market rate. For most practical transactions, freelancers use the open market rate, which tends to be slightly higher (more PKR per dollar)." },
      { q: "How can Pakistani remote workers receive international payments?", a: "Common methods include Payoneer, Wise, and local bank wire transfers. Pakistan's government has also facilitated freelancer income through dedicated banking channels. Always compare the effective conversion rate including all fees." },
    ],
    related: ["usd-to-inr", "usd-to-ngn", "usd-to-brl"],
  },
  "usd-to-ngn": {
    from: "usd", to: "ngn",
    context: "USD to NGN is critically important for Nigeria's rapidly growing tech and creative freelancing sector. Nigerian developers, designers, writers, and digital marketers increasingly work with US, UK, and European clients, converting dollar and pound earnings to naira. The naira has experienced significant volatility and depreciation, making rate monitoring essential.",
    remoteTip: "Nigerian remote workers should convert USD earnings promptly given naira depreciation trends. Holding USD in a Payoneer or Wise account until needed can preserve value during periods of rapid depreciation.",
    faqs: [
      { q: "What is today's USD to NGN exchange rate?", a: "The USD/NGN rate is volatile and has depreciated significantly in recent years following Nigeria's currency reform and unified exchange rate policy. Check the live rate above for the current real-time conversion." },
      { q: "What exchange rate do Nigerian freelancers use for USD payments?", a: "Nigerian freelancers typically use the parallel market or fintech rates (through platforms like Chipper Cash, Payoneer, or Flutterwave), which differ from the official CBN rate. These rates are often the most relevant for practical conversions." },
      { q: "Why has the Nigerian naira depreciated against the dollar?", a: "The NGN has depreciated due to reduced oil revenues, currency reform policies, foreign exchange scarcity, and general emerging-market dollar strength. The Central Bank of Nigeria unified its exchange rate windows in 2023, leading to significant devaluation." },
      { q: "How can Nigerian remote workers manage USD-to-NGN currency risk?", a: "Strategies include: converting large amounts when the naira strengthens, maintaining USD balances in international fintech accounts, invoicing in USD or GBP, and using dollar-denominated savings accounts where available." },
    ],
    related: ["usd-to-pkr", "usd-to-brl", "usd-to-inr"],
  },
  "usd-to-brl": {
    from: "usd", to: "brl",
    context: "USD to BRL matters for Brazil's growing digital economy. Brazilian tech workers, designers, and content creators increasingly serve US and European clients, and the Real's exchange rate directly impacts their earnings. Brazil is becoming a major source of remote talent, particularly in software development and creative services.",
    remoteTip: "Brazilian remote workers with dollar income benefit from a strong USD environment. Monitor the Selic rate (Brazil's benchmark rate) and USD strength alongside local inflation to time your currency conversions strategically.",
    faqs: [
      { q: "What is the current USD to BRL exchange rate?", a: "The USD/BRL rate fluctuates based on Brazilian economic conditions, interest rate differentials, commodity prices (Brazil is a major commodity exporter), and global dollar strength. Check the live rate above for the current conversion." },
      { q: "How does the Selic rate affect USD/BRL?", a: "Brazil's high benchmark interest rate (Selic) makes BRL-denominated investments attractive to foreign investors, which can support the real against the dollar. When Selic is cut, the real often weakens. This makes BRL one of the most interest-rate-sensitive emerging market currencies." },
      { q: "Is Brazil growing as a remote work destination?", a: "Yes. Brazil's tech sector is growing rapidly, with Brazilian developers and designers increasingly working for international companies. US companies in particular are hiring Brazilian tech talent, attracted by the time zone compatibility (1–4 hours difference from US East Coast), lower costs, and strong technical education." },
      { q: "What is the best way for Brazilian freelancers to receive USD payments?", a: "Platforms like Payoneer, Wise, and international bank transfers are common. Brazil also has specific regulations around foreign income that freelancers should navigate — consult a local accountant about declaring foreign earnings in BRL at the applicable exchange rate." },
    ],
    related: ["usd-to-eur", "usd-to-ngn", "usd-to-pkr"],
  },
  "usd-to-sar": {
    from: "usd", to: "sar",
    context: "USD to SAR conversions are uniquely straightforward: the Saudi Riyal is pegged to the US Dollar at a fixed rate of 3.75 SAR per USD, maintained by the Saudi Arabian Monetary Authority (SAMA) since 1986. This peg means there is virtually no exchange rate risk for USD–SAR transactions, making it one of the most stable major currency pairs in the world.",
    remoteTip: "The SAR/USD peg means your USD income is virtually risk-free to convert to riyals — unlike most other currencies. Remote workers based in Saudi Arabia or billing Saudi clients can plan with complete rate certainty.",
    faqs: [
      { q: "Is the Saudi Riyal pegged to the US Dollar?", a: "Yes. The Saudi Riyal (SAR) has been pegged to the US Dollar at a fixed rate of 3.75 SAR per USD since 1986. This peg is maintained by SAMA (Saudi Arabian Monetary Authority) and is one of the longest-standing and most credible currency pegs in the world." },
      { q: "What is 1 USD in Saudi Riyals?", a: "1 USD = 3.75 SAR, a fixed rate. You may see minor variations of a few pips (fractions of a halala) in some retail conversions due to service fees, but the fundamental rate is always 3.75." },
      { q: "Can the SAR peg to the USD break?", a: "The SAR peg has been in place for nearly 40 years and is backed by Saudi Arabia's substantial foreign exchange reserves and oil wealth. While some economists have debated the peg's long-term sustainability (especially during low oil price periods), SAMA has consistently defended it, and it remains highly credible." },
      { q: "How does the USD peg affect Saudi businesses and remote workers?", a: "The USD peg provides complete exchange rate stability for dollar-denominated transactions — a significant advantage for businesses and workers dealing in USD. Import prices (denominated in USD) are stable, and USD income converts at a fixed, predictable rate." },
    ],
    related: ["usd-to-aed", "usd-to-inr", "usd-to-eur"],
  },
  "gbp-to-inr": {
    from: "gbp", to: "inr",
    context: "GBP to INR is an important pair for India's large UK-diaspora community and the significant number of Indian freelancers and tech workers serving UK clients. India has a deep cultural and commercial connection with the UK, and the GBP/INR rate directly impacts remittances, freelance earnings, and business payments between the two countries.",
    remoteTip: "Indian professionals invoicing UK clients in GBP should monitor both the GBP/INR rate and compare it to USD/INR to determine which currency denomination gives better value. GBP invoicing can provide an edge when the pound is strong.",
    faqs: [
      { q: "What is today's GBP to INR exchange rate?", a: "The GBP/INR rate changes daily based on global forex conditions. Check the live converter above for the current real-time rate. Typically, 1 GBP buys 100–110 INR, though this varies significantly with the pound's global strength." },
      { q: "Is it better for Indian freelancers to invoice in GBP or USD?", a: "Compare the effective INR value: use a live converter to check what 1,000 GBP converts to in INR versus what 1,000 USD converts to. Whichever gives more rupees is better (accounting for any transfer fees). The answer changes with market conditions." },
      { q: "How much is sent in GBP to India every year?", a: "The UK is one of the top sources of remittances to India. The Indian diaspora in the UK sends billions of pounds annually to family members. GBP/INR is therefore a critically important pair for millions of families beyond just business transactions." },
      { q: "Which services offer the best GBP to INR rates for Indian workers?", a: "Wise (TransferWise), Remitly, and Xoom typically offer rates close to the mid-market rate with lower fees than traditional banks. Always compare the total amount received in INR (after all fees) rather than just the headline exchange rate." },
    ],
    related: ["usd-to-inr", "usd-to-gbp", "eur-to-gbp"],
  },
  "usd-to-aed": {
    from: "usd", to: "aed",
    context: "Like the Saudi Riyal, the UAE Dirham is pegged to the US Dollar — at a fixed rate of 3.6725 AED per USD since 1997. This peg, maintained by the UAE Central Bank, makes USD–AED one of the most stable currency pairs globally. Dubai and Abu Dhabi's status as major global business hubs make this rate relevant for thousands of multinational businesses and expatriate workers.",
    remoteTip: "Remote workers and businesses in the UAE dealing in dollars have zero exchange rate risk on USD/AED conversions — a major financial planning advantage. All USD income converts at the fixed rate of 3.6725 AED.",
    faqs: [
      { q: "Is the UAE Dirham pegged to the US Dollar?", a: "Yes. The UAE Dirham (AED) is pegged to the USD at a fixed rate of 3.6725 AED per USD, maintained by the UAE Central Bank since 1997. This is one of the world's most credible and stable currency pegs." },
      { q: "What is 1 USD in UAE Dirhams?", a: "1 USD = 3.6725 AED, a fixed rate. Minor variations exist in retail conversions due to service margins, but the fundamental rate is always 3.6725." },
      { q: "How does the AED peg affect expatriates in Dubai?", a: "For the large expatriate workforce in Dubai earning in AED or USD, the peg provides complete stability and predictability. USD income converts at a fixed rate, and dollar-denominated imports (like electronics and many consumer goods) maintain stable local prices." },
      { q: "Is the AED peg sustainable long term?", a: "The UAE's significant oil wealth, diversified economy (Dubai is a major trading, finance, and tourism hub), and substantial foreign exchange reserves make the AED peg one of the most credible in the world. Financial markets assign very low probability to a devaluation scenario." },
    ],
    related: ["usd-to-sar", "usd-to-inr", "usd-to-eur"],
  },
};

// ─── Helper: get city pair from slug ─────────────────────────────────────────
export const getCityPair = (slug) => CITY_PAIRS[slug] || null;
export const getCurrencyPair = (slug) => CURRENCY_PAIRS[slug] || null;

// ─── All pair slugs for sitemap / listing ─────────────────────────────────────
export const ALL_CITY_PAIR_SLUGS = Object.keys(CITY_PAIRS);
export const ALL_CURRENCY_PAIR_SLUGS = Object.keys(CURRENCY_PAIRS);
