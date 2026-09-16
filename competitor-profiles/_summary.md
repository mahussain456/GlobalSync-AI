# Competitor-informed website improvements

Research date: 2026-09-16. Scope: focused public product-flow review, not market share or SEO rankings.

## Main finding

GlobalSync's strongest immediate opportunity is to help visitors finish a task on the landing page. The previous meeting page required another navigation before planning. It also described an AI fairness score that the tool did not calculate.

| Reference | Observed strength | Implemented response |
| --- | --- | --- |
| [World Time Buddy](https://www.worldtimebuddy.com/features) | Selected intervals, sharing and calendar actions | Duration-aware slots, local-time copy, saved plan links, ICS and Google Calendar drafts |
| [timeanddate](https://www.timeanddate.com/worldclock/meeting.html) | Date/location inputs and DST guidance | Date-first planner, named zones and explicit reference-city date |
| [Every Time Zone](https://everytimezone.com/) | Cross-zone display and sharing | Local dates/times for every city and portable plan/calendar output |
| [Wise](https://wise.com/gb/currency-converter/) | Amount/currency controls and rate context | Input/result consistency, dated reference-rate copy and provider-fee context |

These are design inferences from the cited public pages; no conversion uplift has been measured.

## Delivered

- A working planner directly at `/meeting-planner`: two to five cities, individual same-day working hours, 15–120-minute durations, Monday–Friday filtering and 12/24-hour display.
- Only slots that fit the entire meeting in every city's working hours, with a useful no-overlap state.
- Links preserve date, cities, hours, duration, weekend setting and selected instant. Calendar drafts use UTC so calendar apps can show each recipient's local zone.
- Currency edits clear previous results immediately. Delayed requests cannot restore stale amounts or charts.
- Reference-rate wording, source/date context when copying, accessible labels and mobile result layouts.
- Unsupported fairness-score and guaranteed real-time/mid-market claims removed from the revised hub pages and metadata.

## Limits

The planner does not read calendars, book meetings, handle recurring events, overnight shifts, holidays or custom weekends. Browser timezone rules determine offsets. Calendar invitations require user review. Currency transfers and rate alerts are outside this implementation.

## Next decisions

1. Measure planner use, share and export actions before redesigning further. Existing analytics hooks cover share and export events.
2. Test whether a visual timeline improves selection enough to justify its mobile complexity.
3. Review remaining older editorial and comparison pages for unsupported claims before expanding content.
4. Add customer proof only when real testimonials or usage evidence can be verified.

## Validation

See [validation.md](validation.md) for production build and browser checks. This review does not establish accessibility conformance or guarantee SEO/conversion gains.
