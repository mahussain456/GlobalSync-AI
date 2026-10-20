import { GUIDES } from "@/data/guidesData";
import { MEETING_CORRIDORS } from "@/data/meetingCorridors";
import { CORRIDORS } from "@/data/freelanceCorridors";
import { CITY_PAIRS, CURRENCY_PAIRS, isPairIndexable } from "@/data/programmaticData";

// Plain <a href> crawl paths from the homepage to every indexable guide and
// landing page. Only indexable pairs are listed (see isPairIndexable): the
// generated pair pages are noindex and must not be linked from here.
const titleCase = (slug) => slug.split("-").map((w) => (w === "to" ? "to" : w[0].toUpperCase() + w.slice(1))).join(" ");
const shortTitle = (t) => t.split(/[:(]/)[0].trim();

const TIME_PAIRS = Object.keys(CITY_PAIRS).filter((s) => isPairIndexable(s, CITY_PAIRS[s]));
const FX_PAIRS = Object.keys(CURRENCY_PAIRS).filter((s) => isPairIndexable(s, CURRENCY_PAIRS[s]));

const GROUPS = [
  {
    title: "Guides",
    hub: { href: "/guides", label: "All guides" },
    links: GUIDES.map((g) => ({ href: `/guides/${g.slug}`, label: shortTitle(g.title) })),
  },
  {
    title: "Meeting overlap",
    hub: { href: "/meeting-overlap", label: "All overlap guides" },
    links: [
      { href: "/us-india-meeting-time", label: "US–India meeting time" },
      ...MEETING_CORRIDORS.map((c) => ({ href: `/meeting-overlap/${c.slug}`, label: shortTitle(c.h1).replace(/^Best Meeting Times Between (the )?/, "") })),
    ],
  },
  {
    title: "Freelance rates",
    hub: { href: "/freelance-rate", label: "All freelance rate calculators" },
    links: CORRIDORS.map((c) => ({ href: `/freelance-rate/${c.slug}`, label: `${c.from} to ${c.to} freelance rate` })),
  },
  {
    title: "Popular conversions",
    hub: { href: "/embed", label: "Embed a world clock" },
    links: [
      ...TIME_PAIRS.map((s) => ({ href: `/time/${s}`, label: `${titleCase(s)} time` })),
      ...FX_PAIRS.map((s) => ({ href: `/currency/${s}`, label: s.toUpperCase().replace("-TO-", " to ") })),
    ],
  },
];

export default function ExploreLinks() {
  return (
    <section className="explore-links" aria-labelledby="explore-title" data-testid="explore-links">
      <div className="proof-heading">
        <h2 id="explore-title">Guides and planners.</h2>
        <p>Straight answers for remote teams and freelancers who work across borders.</p>
      </div>
      <div className="explore-grid">
        {GROUPS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h3>{g.title}</h3>
            <ul>
              {g.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
              <li className="explore-hub"><a href={g.hub.href}>{g.hub.label} →</a></li>
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
