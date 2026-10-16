import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { getExchangeRate, LIVE_CACHE_MS } from "@/lib/exchangeRates";
import { markToolUsed, fireAnalyticsEvent } from "@/lib/analytics";

// Working versions of the tools for the homepage stage, each built around one
// artifact: an engraved banknote, nested squares of earnings, a live invoice sheet.
// They share the meridian card language (.mer) and hand off to the full pages.

const CODES = ["USD", "EUR", "GBP", "INR", "PKR", "AED", "CAD", "AUD", "SGD", "JPY", "PHP", "NGN", "BRL", "MXN", "ZAR", "CHF", "CNY", "SAR"];
const money = (n, code, digits) => {
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: code, currencyDisplay: "narrowSymbol", maximumFractionDigits: digits ?? (n >= 1000 ? 0 : 2) }).format(n); }
  catch { return `${n.toFixed(2)} ${code}`; }
};
const plain = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: n >= 1000 ? 0 : 2 }).format(n);
const clean = (v) => v.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 10);

function useRate(from, to) {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    let active = true;
    if (from === to) { setQuote({ rate: 1, date: "", source: "Same currency", isLive: true }); return undefined; }
    const load = () => getExchangeRate(from, to).then((q) => { if (active) setQuote(q); }).catch(() => { if (active) setQuote(null); });
    load();
    const id = setInterval(() => { if (document.visibilityState === "visible") load(); }, LIVE_CACHE_MS);
    return () => { active = false; clearInterval(id); };
  }, [from, to]);
  return quote;
}

const Head = ({ id, title, quote }) => (
  <header className="mer-head">
    <h2 id={id}>{title}</h2>
    {quote !== undefined && <p className={`mer-state${quote?.isLive ? " is-live" : ""}`}><i aria-hidden="true" />{quote?.isLive ? "Live rate" : "Reference rate"}</p>}
  </header>
);

// Engraved security pattern: a rosette of rotated ellipses plus wave lines.
function Guilloche() {
  const petals = Array.from({ length: 36 }, (_, i) => i * 5);
  const waves = useMemo(() => Array.from({ length: 7 }, (_, k) => {
    let d = "";
    for (let x = 0; x <= 400; x += 8) d += `${x ? "L" : "M"}${x} ${150 + k * 7 + Math.sin(x / 22 + k * 0.7) * 9}`;
    return d;
  }), []);
  return (
    <svg className="note-engraving" viewBox="0 0 400 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g transform="translate(318 74)">
        {petals.map((a) => <ellipse key={a} rx="70" ry="24" transform={`rotate(${a})`} />)}
        <circle r="18" /><circle r="26" />
      </g>
      {waves.map((d, k) => <path key={k} d={d} />)}
    </svg>
  );
}

// ── Currency: the banknote ───────────────────────────────────────────────────
export function StageCurrency() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const quote = useRate(from, to);
  const value = Number(amount) || 0;
  const result = quote ? value * quote.rate : null;
  const touched = () => markToolUsed("homepage_stage_currency");

  return (
    <section className="mer stool" aria-labelledby="stage-fx-title">
      <Head id="stage-fx-title" title="Convert money" quote={quote} />
      <div className="mer-sentence">
        <label htmlFor="stage-amount" className="sr-only">Amount</label>
        <input id="stage-amount" className="stool-amount" inputMode="decimal" value={amount} onChange={(e) => { touched(); setAmount(clean(e.target.value)); }} />
        <select aria-label="From currency" value={from} onChange={(e) => { touched(); setFrom(e.target.value); }}>{CODES.map((c) => <option key={c}>{c}</option>)}</select>
        <button type="button" className="stool-swap" aria-label="Swap currencies" onClick={() => { touched(); setFrom(to); setTo(from); }}><ArrowLeftRight aria-hidden="true" /></button>
        <select aria-label="To currency" value={to} onChange={(e) => { touched(); setTo(e.target.value); }}>{CODES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="note" key={`${from}-${to}`} aria-live="polite">
        <Guilloche />
        <span className="note-code" aria-hidden="true">{to}</span>
        <div className="note-top"><span>{plain(value)} {from}</span><span>Exchange</span></div>
        <p className="note-amount" suppressHydrationWarning>{result === null ? " " : money(result, to)}</p>
        <p className="note-micro" suppressHydrationWarning>
          {quote ? `1 ${from} = ${Number(quote.rate.toPrecision(6))} ${to}` : "Fetching the live rate…"}
          {quote?.date && <><span aria-hidden="true"> · </span>{quote.source}, {quote.date}</>}
        </p>
      </div>

      <div className="mer-actions">
        <a className="mer-copy stool-cta" href="/currency-converter" onClick={() => fireAnalyticsEvent("stage_cta", { tool: "currency" })}>Open the full converter</a>
        <a className="mer-next" href={`/currency/${from.toLowerCase()}-to-${to.toLowerCase()}`}>{from} to {to} rate <ArrowRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}

// ── Freelance rate: the year, built month by month ───────────────────────────
// A staircase of running totals (120 billable hours a month) with a gold line
// climbing to the year figure.
const MONTHS = "JFMAMJJASOND".split("");
function EarningsStairs({ yearLabel }) {
  const W = 300, H = 180, top = 26, base = H - 22, gap = 6;
  const bw = (W - gap * 11) / 12;
  const bars = MONTHS.map((m, i) => {
    const h = ((i + 1) / 12) * (base - top);
    return { m, x: i * (bw + gap), y: base - h, h };
  });
  const line = bars.map((b, i) => `${i ? "L" : "M"}${(b.x + bw / 2).toFixed(1)} ${b.y.toFixed(1)}`).join("");
  const last = bars[11];
  return (
    <svg className="stairs" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Running total over twelve months, reaching ${yearLabel} in a year`}>
      <line x1="0" y1={base} x2={W} y2={base} className="stairs-axis" />
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={base - f * (base - top)} y2={base - f * (base - top)} className="stairs-grid" />)}
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={bw} height={b.h} rx="2" className={`stairs-bar${i === 11 ? " is-year" : ""}`} style={{ "--i": i }} />
          <text x={b.x + bw / 2} y={H - 6} className="stairs-month" textAnchor="middle">{b.m}</text>
        </g>
      ))}
      <path d={line} className="stairs-line" pathLength="1" />
      <circle cx={last.x + bw / 2} cy={last.y} r="4" className="stairs-dot" />
      <text x={last.x + bw / 2} y={last.y - 10} className="stairs-total" textAnchor="end">{yearLabel}</text>
    </svg>
  );
}

const HORIZONS = [
  { key: "year", label: "A year", hours: 1440, note: "1,440 billable hours" },
  { key: "month", label: "A month", hours: 120, note: "120 billable hours" },
  { key: "hour", label: "An hour", hours: 1, note: "your rate" },
];
export function StageRate() {
  const [rate, setRate] = useState("40");
  const [base, setBase] = useState("USD");
  const [to, setTo] = useState("INR");
  const quote = useRate(base, to);
  const hourly = Number(rate) || 0;
  const touched = () => markToolUsed("homepage_stage_rate");

  return (
    <section className="mer stool" aria-labelledby="stage-rate-title">
      <Head id="stage-rate-title" title="Check a freelance rate" quote={quote} />
      <div className="mer-sentence">
        <label htmlFor="stage-rate" className="sr-only">Hourly rate</label>
        <input id="stage-rate" className="stool-amount" inputMode="decimal" value={rate} onChange={(e) => { touched(); setRate(clean(e.target.value)); }} />
        <select aria-label="Rate currency" value={base} onChange={(e) => { touched(); setBase(e.target.value); }}>{["USD", "EUR", "GBP"].map((c) => <option key={c}>{c}</option>)}</select>
        <label htmlFor="stage-rate-to">an hour, in</label>
        <select id="stage-rate-to" value={to} onChange={(e) => { touched(); setTo(e.target.value); }}>{CODES.filter((c) => c !== base).map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="horizons">
        <EarningsStairs yearLabel={quote ? money(hourly * 1440 * quote.rate, to) : ""} />
        <dl className="horizon-list">
          {HORIZONS.map((h) => (
            <div key={h.key} className={`hl-${h.key}`}>
              <dt><i aria-hidden="true" />{h.label}<small>{h.note}</small></dt>
              <dd suppressHydrationWarning>{quote ? money(hourly * h.hours * quote.rate, to) : " "}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="stool-note">120 billable hours a month. Before payment fees{quote?.date ? `; rate as of ${quote.date}` : ""}.</p>

      <div className="mer-actions">
        <a className="mer-copy stool-cta" href="/freelancer-rate-converter">Open the rate calculator</a>
        <a className="mer-next" href="/freelance-rate">12 currency corridors <ArrowRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}

// ── Invoice: a live sheet ────────────────────────────────────────────────────
export function StageInvoice() {
  const [client, setClient] = useState("Northwind Studio");
  const [amount, setAmount] = useState("2500");
  const [cur, setCur] = useState("USD");
  const [ref, setRef] = useState("PKR");
  const [today, setToday] = useState("");
  const quote = useRate(cur, ref);
  const value = Number(amount) || 0;
  const touched = () => markToolUsed("homepage_stage_invoice");
  useEffect(() => { setToday(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })); }, []);

  return (
    <section className="mer stool" aria-labelledby="stage-inv-title">
      <Head id="stage-inv-title" title="Make an invoice" />
      <div className="mer-sentence">
        <label htmlFor="stage-client">Bill</label>
        <input id="stage-client" className="stool-client" value={client} maxLength={40} onChange={(e) => { touched(); setClient(e.target.value); }} />
        <label htmlFor="stage-inv-amount" className="sr-only">Amount</label>
        <input id="stage-inv-amount" className="stool-amount" inputMode="decimal" value={amount} onChange={(e) => { touched(); setAmount(clean(e.target.value)); }} />
        <select aria-label="Invoice currency" value={cur} onChange={(e) => { touched(); setCur(e.target.value); }}>{["USD", "EUR", "GBP", "CAD", "AUD"].map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      <div className="sheet" aria-label="Invoice preview">
        <span className="sheet-stamp" aria-hidden="true">Net 14</span>
        <div className="sheet-head">
          <strong>Invoice</strong>
          <span suppressHydrationWarning>No. 0001{today && ` · ${today}`}</span>
        </div>
        <div className="sheet-to"><span>Billed to</span><b>{client || "Your client"}</b></div>
        <div className="sheet-line"><span>Professional services</span><span>{cur} {plain(value)}</span></div>
        <div className="sheet-total"><span>Total due</span><strong>{cur} {value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
        <p className="sheet-ref" suppressHydrationWarning>
          Reference only: approximately{" "}
          <select aria-label="Reference currency" value={ref} onChange={(e) => { touched(); setRef(e.target.value); }}>{CODES.filter((c) => c !== cur).map((c) => <option key={c}>{c}</option>)}</select>{" "}
          {quote ? `${plain(value * quote.rate)} at ${Number(quote.rate.toPrecision(5))}/${cur}` : "…"}
        </p>
      </div>

      <div className="mer-actions">
        <a className="mer-copy stool-cta" href="/invoice">Make the PDF</a>
        <a className="mer-next" href="/invoice">3 free a month, no account <ArrowRight aria-hidden="true" /></a>
      </div>
    </section>
  );
}
