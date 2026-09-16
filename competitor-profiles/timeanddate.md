# timeanddate Meeting Planner

Research date: 2026-09-16. Scope: focused public product and conversion-flow review.

## Category

Direct: international meeting planning.

## Observed product behavior

The planner begins with a date and locations. Its guidance distinguishes named cities from fixed GMT offsets when daylight saving matters. [Primary source](https://www.timeanddate.com/worldclock/meeting.html).

## Implication for GlobalSync (inference)

Make date and city controls the first task on the planner page. Resolve time using the selected date and named IANA zones.

## Limits and remaining differences

GlobalSync uses the browser timezone database; it does not provide timeanddate's wider calendar and time reference resources. Traffic, keyword rankings, customer sentiment and paid-plan prices were not independently measured.

## Raw Data Sources

Public-page research is preserved in [the dated source capture](raw/2026-09-16/source-pages.json). No Firecrawl or DataForSEO data was available in this session.
