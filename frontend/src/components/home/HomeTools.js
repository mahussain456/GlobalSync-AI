import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getExchangeRate } from "@/lib/exchangeRates";
import { trueNow } from "@/lib/trueTime";

// The five tools in one strip, each showing a number that is true right now:
// a live clock, a live rate, or a live count. Nothing here is typed in by hand.
const CLOCK_CITIES = [["New York", "America/New_York"], ["London", "Europe/London"], ["Dubai", "Asia/Dubai"], ["Mumbai", "Asia/Kolkata"], ["Manila", "Asia/Manila"], ["Tokyo", "Asia/Tokyo"], ["Sydney", "Australia/Sydney"], ["Berlin", "Europe/Berlin"], ["San Francisco", "America/Los_Angeles"], ["Karachi", "Asia/Karachi"], ["Lagos", "Africa/Lagos"], ["Sao Paulo", "America/Sao_Paulo"]];
const timeIn = (zone, d) => d.toLocaleTimeString("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit" });
const hourIn = (zone, d) => { const p = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", hour: "numeric", minute: "numeric" }).formatToParts(d); return +p.find((x) => x.type === "hour").value + +p.find((x) => x.type === "minute").value / 60; };
const money = (v) => v.toLocaleString("en-US", { maximumFractionDigits: v >= 1000 ? 0 : v >= 10 ? 2 : 4, minimumFractionDigits: v >= 1000 ? 0 : 2 });

const TOOLS = [
  { href: "/time-zone-converter", name: "Time Zone Converter", desc: "Compare up to five cities and slide to any hour.", live: "clock", zone: "Europe/London", label: "London now" },
  { href: "/meeting-planner", name: "Meeting Planner", desc: "Finds the working hours everyone shares.", live: "atwork", label: "cities inside 9 to 5 right now" },
  { href: "/currency-converter", name: "Currency Converter", desc: "160+ currencies at live mid-market rates.", live: "fx", from: "USD", to: "EUR", amount: 1, label: "1 USD in EUR" },
  { href: "/freelancer-rate-converter", name: "Freelance Rate Calculator", desc: "Your hourly rate in your client’s currency.", live: "fx", from: "USD", to: "INR", amount: 40, label: "$40 an hour in INR" },
  { href: "/invoice", name: "Invoice Builder", desc: "A PDF invoice with a local-currency reference line.", live: "fx", from: "USD", to: "GBP", amount: 2000, label: "$2,000 invoice in GBP" },
];

export default function HomeTools() {
  const [now, setNow] = useState(() => trueNow());
  const [rates, setRates] = useState({});
  const [asOf, setAsOf] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(trueNow()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const next = {};
      for (const t of TOOLS.filter((x) => x.live === "fx")) {
        try { next[`${t.from}:${t.to}`] = await getExchangeRate(t.from, t.to); } catch { next[`${t.from}:${t.to}`] = null; }
      }
      if (!alive) return;
      setRates(next);
      const first = Object.values(next).find(Boolean);
      setAsOf(first ? `${first.source}, ${first.date}` : "Live rates are unavailable right now");
    };
    load();
    const id = setInterval(load, 60 * 1000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const atWork = CLOCK_CITIES.filter(([, z]) => { const h = hourIn(z, now); return h >= 9 && h < 17; }).length;

  const value = (t) => {
    if (t.live === "clock") return timeIn(t.zone, now);
    if (t.live === "atwork") return `${atWork} of ${CLOCK_CITIES.length}`;
    const q = rates[`${t.from}:${t.to}`];
    if (q === undefined) return "…";
    return q ? money(q.rate * t.amount) : "unavailable";
  };

  return (
    <section className="home-tools" aria-labelledby="home-tools-title" data-testid="home-tools">
      <div className="home-sec-head">
        <h2 id="home-tools-title">Five tools.<br />Live numbers in each.</h2>
        <p>Open one and it is ready to use. No account, no trial. The numbers here are live right now.</p>
      </div>
      <ol className="home-tool-list">
        {TOOLS.map((t, i) => (
          <li key={t.href}>
            <a href={t.href}>
              <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
              <div className="home-tool-text"><h3>{t.name}</h3><p>{t.desc}</p></div>
              <div className="home-tool-live"><strong suppressHydrationWarning>{value(t)}</strong><span>{t.label}</span></div>
              <ArrowRight aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
      <p className="home-tools-note" aria-live="polite">{asOf}</p>
    </section>
  );
}
