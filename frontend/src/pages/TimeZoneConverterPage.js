import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import AdBanner from "@/components/AdBanner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import DesktopAppCTA from "@/components/DesktopAppCTA";
import TimeConverter from "@/components/TimeConverter";
import { ToolHero, ToolSection, BrowseAll, LinkList, ToolFaq, RelatedTools } from "@/components/tool/ToolPage";
import { CITIES, CITY_PAIRS, ALL_CITY_PAIR_SLUGS } from "@/data/programmaticData";
import { getTimeZoneHubSEO } from "@/lib/seo";

const QUICK = [
  { from: "New York", to: "London" },
  { from: "San Francisco", to: "Tokyo" },
  { from: "London", to: "Dubai" },
  { from: "New York", to: "Mumbai" },
  { from: "Dubai", to: "Mumbai" },
  { from: "Hong Kong", to: "New York" },
];

const POPULAR = [
  { to: "/time/new-york-to-london", label: "New York to London", desc: "EST to GMT" },
  { to: "/time/london-to-tokyo", label: "London to Tokyo", desc: "GMT to JST" },
  { to: "/time/san-francisco-to-new-york", label: "San Francisco to New York", desc: "PST to EST" },
  { to: "/time/dubai-to-mumbai", label: "Dubai to Mumbai", desc: "GST to IST" },
  { to: "/us-india-meeting-time", label: "US and India meeting times", desc: "Overlap guide" },
  { to: "/global-meeting-planner-for-remote-teams", label: "Meeting planner for remote teams", desc: "Fair scheduling" },
];

const HOW = [
  ["Pick the cities, not the abbreviations", "Search for the actual cities. “EST” is only correct in winter; a city always follows its own daylight-saving rules."],
  ["Mind the half-hour zones", "India (UTC+5:30), Nepal (UTC+5:45) and parts of Australia aren’t on whole hours. 9 AM in New York in winter is 7:30 PM in India."],
  ["Watch the transition weeks", "The US, UK and EU change clocks on different Sundays in March and October, so gaps shift by an hour for a week or two."],
  ["Write times with a city", "“3 PM New York time” can’t be misread. Copy the times from the converter straight into your invite."],
];

const FAQ = [
  { q: "How does GlobalSync AI handle daylight saving time?", a: "Every city uses the IANA time zone database built into your browser and operating system, the same source as Linux, macOS and most servers. Daylight-saving changes are applied on each region's official dates." },
  { q: "Is the time zone converter free?", a: "Yes. The converter is free with no signup. Saved teams and invoice exports have separate limits shown in each tool." },
  { q: "How many cities and time zones are supported?", a: "You can search and compare 85+ cities covering 60+ time zones, up to five at once." },
  { q: "Can I find a meeting time that works for everyone?", a: "Yes. The Meeting Planner checks each city's working hours (9 AM to 5 PM by default, adjustable) and shows the shared windows, or tells you when there aren't any." },
  { q: "How accurate is the converter near daylight-saving changes?", a: "It uses the time zone rules in your browser, which update with your browser and operating system. Keep them up to date and transitions are applied on the right day." },
];

const GUIDE_OPTIONS = ALL_CITY_PAIR_SLUGS.map((slug) => {
  const pair = CITY_PAIRS[slug];
  const from = CITIES[pair.from], to = CITIES[pair.to];
  return from && to ? { value: slug, label: `${from.name} to ${to.name}`, href: `/time/${slug}` } : null;
}).filter(Boolean);

export default function TimeZoneConverterPage() {
  const navigate = useNavigate();
  const seo = getTimeZoneHubSEO({ faqs: FAQ });

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />
      <SiteNav />

      <ToolHero
        title="Free Time Zone Converter & World Clock"
        intro="Compare live times in 85+ cities, slide to any hour, and see who is inside working hours. Daylight saving handled for every city. Free, no signup."
      >
        <TimeConverter />
      </ToolHero>

      <div className="tool-shell tool-body">
        <AdBanner slot="leaderboard" className="mb-8" />

        <ToolSection id="tz-popular" title="Popular conversions" intro="Open a pair in the converter, or go to its dedicated page with live clocks and overlap hours.">
          <div className="quick-pairs">
            {QUICK.map((c) => (
              <button key={`${c.from}-${c.to}`} type="button" className="btn btn-secondary"
                onClick={() => navigate(`/dashboard?q=time in ${c.to} when it is 9 AM in ${c.from}`)}>
                {c.from} <ArrowRight aria-hidden="true" /> {c.to}
              </button>
            ))}
          </div>
          <LinkList links={POPULAR} />
          <BrowseAll label="Find any city pair" placeholder="Type a city, e.g. Karachi" options={GUIDE_OPTIONS} testId="city-pair-search" />
        </ToolSection>

        <ToolSection id="tz-how" title="How to convert time zones without mistakes">
          <ol className="tool-steps">
            {HOW.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
        </ToolSection>

        <ToolFaq faqs={FAQ} id="tz-faq" />

        <AdBanner slot="rectangle" className="mb-8" />

        <RelatedTools links={[
          { to: "/meeting-planner", label: "Meeting planner" },
          { to: "/currency-converter", label: "Currency converter" },
          { to: "/convert", label: "Time zone abbreviations" },
          { to: "/meeting-overlap", label: "Meeting overlap guides" },
          { to: "/guides", label: "Guides" },
        ]} />
      </div>
      <DesktopAppCTA placement="time_zone_converter" />
      <SiteFooter />
    </div>
  );
}
