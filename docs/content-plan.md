# Guides content plan: 12 weekly guides

One guide a week, each answering one specific, high-intent search that a GlobalSync tool already solves.
Guides 1 to 3 are written and live in `frontend/src/data/guidesData.js`.

**House rules for every guide** (same as the existing six):
- Unique title tag and meta description, one H1, H2/H3 only, FAQPage JSON-LD (automatic from `faqs`).
- Every rate, amount and meeting time uses a live token (`{fx:USD:PKR}`, `{t:America/New_York@08:00>Asia/Kolkata}`), never a hard-coded number. See `frontend/src/lib/liveFacts.js`.
- Link to the tool in the first 150 words and again where the reader acts.
- No em or en dashes, no filler, no first-person claims that aren't true (no invented clients or experiences).
- Payment, tax and legal facts need a source. If it can't be verified, say "check with your provider/accountant" instead of stating a number.

| # | Week | Target keyword | Search intent | Tool it links to | Status |
|---|------|----------------|---------------|------------------|--------|
| 1 | 1 | best time to schedule a meeting between EST and IST | Find a call slot for a US East Coast + India team | Meeting Planner, /meeting-overlap/us-india, /convert/est-to-ist | **Written** |
| 2 | 2 | how to invoice a US client from Pakistan | Get paid in full by a US client, without PayPal | Invoice Builder, /freelance-rate/usd-to-pkr, /currency/usd-to-pkr | **Written** |
| 3 | 3 | USD to INR freelance rate conversion | Know what a USD hourly rate is worth in rupees after fees | Freelance Rate Calculator, /freelance-rate/usd-to-inr | **Written** |
| 4 | 4 | best meeting time UK and India | UK + India team call that survives BST/GMT changes | Meeting Planner, /meeting-overlap/uk-india | **Written** |
| 5 | 5 | US Philippines overlap hours for virtual assistants | Book a VA's shift so it overlaps the US workday | Meeting Planner, /meeting-overlap/us-philippines | Planned |
| 6 | 6 | how to get paid by a UK client from India | Invoice in GBP, receive in INR, keep GST zero-rated | Invoice Builder, /freelance-rate/gbp-to-inr | Planned |
| 7 | 7 | EST to PST meeting time | Schedule across US coasts without the 3-hour mistake | Time Zone Converter, /convert/est-to-pst | Planned |
| 8 | 8 | how much to charge US clients from Nigeria | Set a USD rate that covers NGN volatility and fees | Freelance Rate Calculator, /freelance-rate/usd-to-ngn | Planned |
| 9 | 9 | daylight saving time changes 2027 for remote teams | Know the weeks when your team's overlap shifts | Time Zone Converter, Meeting Planner | Planned |
| 10 | 10 | how to send a meeting invite across time zones | Send one invite that shows correctly for everyone | Meeting Planner (.ics download) | Planned |
| 11 | 11 | best meeting time US and Australia | Find the one realistic overlap across the Pacific | Meeting Planner, /meeting-overlap/us-australia | Planned |
| 12 | 12 | how to invoice in euros as a freelancer outside the EU | Bill EU clients in EUR without VAT mistakes | Invoice Builder, /freelance-rate/usd-to-eur | Planned |

## Outlines (3 lines each)

**1. Best time to schedule a meeting between EST and IST** (written)
- There is no 9-to-5 overlap; show the two realistic windows (US early morning, India evening) as a live table.
- Explain why the gap is 9.5 hours for part of the year and 10.5 for the rest, and when it flips.
- Rotation rule for recurring calls, plus a ready-to-paste invite; link the planner and the US-India overlap page.

**2. How to invoice a US client from Pakistan** (written)
- Start with what actually works from Pakistan (Payoneer, a direct bank wire, a client paying through Wise to your PKR account) and that PayPal doesn't.
- Fee table per route, the reference-line format with a live PKR amount, and the banking-channel point for the IT export tax rate.
- Five-field invoice checklist and a link to the Invoice Builder.

**3. USD to INR freelance rate conversion** (written)
- Live conversion table for common hourly rates, and what each comes to monthly.
- What comes off before it reaches you (platform/transfer margins) and how GST zero-rating under an LUT works for exports.
- Pricing rule of thumb and links to the corridor page and calculator.

**4. Best meeting time UK and India**
- Live slots for London 9:00 to 12:00 against IST; India has no DST, so the gap is 4.5 or 5.5 hours.
- The late-March and late-October weeks when the overlap shifts by an hour.
- Recurring-call template; link /meeting-overlap/uk-india.

**5. US Philippines overlap for virtual assistants**
- Manila is UTC+8 all year; show US Eastern and Pacific workdays in Manila time.
- Night-shift norms and fair shift design; what "overlap" really needs to cover.
- Link Meeting Planner and /meeting-overlap/us-philippines.

**6. How to get paid by a UK client from India**
- GBP invoice with an INR reference line; Wise/Payoneer/bank routes and what each deducts.
- LUT and GST zero-rating, FIRC/bank advice as proof (link official GST portal, advise a CA).
- Live GBP to INR examples; link /freelance-rate/gbp-to-inr and the Invoice Builder.

**7. EST to PST meeting time**
- Live table of East Coast 9 to 5 in Pacific time; the 3-hour rule and why it's always 3.
- Common mistakes (EST vs EDT labels, Arizona).
- Link /convert/est-to-pst and the Time Zone Converter.

**8. How much to charge US clients from Nigeria**
- Live USD to NGN examples and how volatility changes what a fixed USD rate is worth.
- Receiving routes and their costs (verify each against provider pages before publishing).
- Pricing buffer formula; link /freelance-rate/usd-to-ngn.

**9. Daylight saving time changes 2027 for remote teams**
- Dates for the US, EU/UK, Australia and New Zealand (from the IANA database), and countries without DST.
- The "mismatch weeks" when gaps change by an hour; worked examples with live tokens.
- Checklist for recurring meetings; link the planner.

**10. How to send a meeting invite across time zones**
- Why a plain "3 PM" fails and what an .ics file fixes.
- Step by step: planner, copy local times, download .ics, import in Google/Outlook/Apple.
- Template text for the invite body.

**11. Best meeting time US and Australia**
- Sydney is 14 to 16 hours ahead of New York depending on both sides' DST; live slots.
- The one usable window (US late afternoon / Sydney early morning) and who carries the cost.
- Link /meeting-overlap/us-australia.

**12. How to invoice in euros as a freelancer outside the EU**
- When to bill in EUR vs USD; what each route costs into USD/INR/PKR.
- VAT reverse-charge basics for B2B clients (link the EU's official VAT page; no tax advice).
- Invoice fields and a live EUR reference line; link /freelance-rate/usd-to-eur.
