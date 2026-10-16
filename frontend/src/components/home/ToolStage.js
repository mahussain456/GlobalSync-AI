import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import HomeQuickConverter from "@/components/HomeQuickConverter";
import { StageCurrency, StageInvoice, StageRate } from "@/components/home/StageTools";
import { fireAnalyticsEvent } from "@/lib/analytics";

// The homepage stage: every tool on one sliding row of glass cards over the atlas.
// It revolves continuously. It pauses only while someone is using a tool (pointer
// over the cards, or focus in a field) and resumes when they leave. Tabs, arrows,
// swipes and arrow keys jump straight to a slide. Still under reduced motion.

const TOOLS = [
  { key: "time", tab: "Time zones", word: "Time", Card: HomeQuickConverter, href: "/time-zone-converter", cta: "Open the time zone converter",
    line: "Type a time in one city and see it everywhere else, on a dial that shows who is in daylight and who is at work.",
    facts: [["85+", "cities"], ["IANA", "daylight-saving rules"], ["Synced", "to our server clock"], ["0", "signups"]] },
  { key: "fx", tab: "Currency", word: "Money", Card: StageCurrency, href: "/currency-converter", cta: "Open the currency converter",
    line: "Live mid-market rates, refreshed every minute and checked against a daily reference before they reach you.",
    facts: [["160+", "currencies"], ["1 min", "rate refresh"], ["3%", "sanity check on every quote"], ["Timed", "every result"]] },
  { key: "rate", tab: "Freelance rate", word: "Rates", Card: StageRate, href: "/freelancer-rate-converter", cta: "Open the rate calculator",
    line: "Turn an hourly rate into your client's currency, per month and per year, at today's rate.",
    facts: [["12", "rate corridors"], ["Hour", "to month to year"], ["Live", "conversion"], ["Guides", "on fees and pricing"]] },
  { key: "inv", tab: "Invoice", word: "Invoice", Card: StageInvoice, href: "/invoice", cta: "Open the invoice builder",
    line: "A clean PDF invoice in your currency, with a reference line in your client's currency so nobody has to ask.",
    facts: [["PDF", "download"], ["Multi", "currency lines"], ["Live", "reference rate"], ["3 free", "a month, no account"]] },
];
const AUTOPLAY_MS = 7000;

export default function ToolStage() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false); // starts after mount, and only without reduced motion
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // re-arms the timer while the page is paused
  const drag = useRef(null);
  const n = TOOLS.length;

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setAuto(true);
  }, []);

  const go = useCallback((i, how = "auto") => {
    const next = (i + n) % n;
    setActive(next);
    if (how !== "auto") fireAnalyticsEvent("stage_tool_viewed", { tool: TOOLS[next].key, how });
  }, [n]);

  // Advance on a timer, restarting after every move. Pauses while a tool is in use,
  // and when the page's own "Pause motion" button is on.
  useEffect(() => {
    if (!auto || paused) return undefined;
    const id = setTimeout(() => {
      if (document.querySelector(".meridian-home.pause")) setTick((t) => t + 1);
      else go(active + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [auto, paused, active, go, tick]);

  const onPointerDown = (e) => {
    // Never steal gestures from the tool's own fields and buttons.
    if (e.target.closest("input, select, button, a, textarea, label")) return;
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1), "swipe");
  };
  const onKeyDown = (e) => {
    if (e.target.closest("input, select, textarea")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1, "key"); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1, "key"); }
  };

  const tool = TOOLS[active];

  return (
    <section className="stage" aria-roledescription="carousel" aria-label="GlobalSync tools" onKeyDown={onKeyDown}
      onFocusCapture={(e) => { if (e.target.closest("input, select, textarea")) setPaused(true); }}
      onBlurCapture={(e) => { if (e.target.closest("input, select, textarea")) setPaused(false); }}>

      <div className="stage-tabs" role="tablist" aria-label="Choose a tool">
        {TOOLS.map((t, i) => (
          <button key={t.key} role="tab" id={`stage-tab-${t.key}`} aria-selected={i === active} aria-controls={`stage-card-${t.key}`}
            tabIndex={i === active ? 0 : -1} className={i === active ? "is-active" : ""} onClick={() => go(i, "tab")}>
            {t.tab}
          </button>
        ))}
      </div>

      <div className="stage-floor" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { drag.current = null; }}>
        <div className="stage-backdrop" aria-hidden="true"><img src="/atlas/world-atlas.webp" alt="" width="2400" height="907" decoding="async" /><i className="orb a" /><i className="orb b" /><i className="orb c" /></div>
        <span className="stage-word" aria-hidden="true" key={tool.word}>{tool.word}</span>
        {TOOLS.map((t, i) => {
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const isActive = offset === 0;
          const { Card } = t;
          return (
            <div key={t.key} id={`stage-card-${t.key}`} role="tabpanel" aria-labelledby={`stage-tab-${t.key}`} aria-roledescription="slide"
              className={`stage-card${isActive ? " is-active" : ""}`} data-far={Math.abs(offset) > 1 ? "" : undefined}
              style={{ "--o": offset, "--a": Math.abs(offset) }}
              inert={!isActive} aria-hidden={isActive ? undefined : "true"}>
              <Card />
              {!isActive && Math.abs(offset) === 1 && (
                <button type="button" className="stage-peek" tabIndex={-1} aria-hidden="true" onClick={() => go(i, "peek")} />
              )}
            </div>
          );
        })}
        <button type="button" className="stage-arrow is-prev" onClick={() => go(active - 1, "arrow")} aria-label={`Previous tool: ${TOOLS[(active - 1 + n) % n].tab}`}><ArrowLeft aria-hidden="true" /></button>
        <button type="button" className="stage-arrow is-next" onClick={() => go(active + 1, "arrow")} aria-label={`Next tool: ${TOOLS[(active + 1) % n].tab}`}><ArrowRight aria-hidden="true" /></button>
      </div>

      <div className="stage-caption" aria-live="polite">
        <p key={tool.key}>{tool.line}</p>
      </div>
      <dl className="stage-facts" key={`f-${tool.key}`}>
        {tool.facts.map(([v, l]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="stage-foot">
        <a className="primary" href={tool.href}>{tool.cta} <ArrowRight aria-hidden="true" /></a>
        <div className="stage-controls">
          <button type="button" className="motion-toggle" aria-pressed="false">Pause motion</button>
          <div className="stage-progress" aria-hidden="true">
            {TOOLS.map((t, i) => (
              <span key={t.key} className={i < active ? "done" : i === active ? (auto && !paused ? "run" : "now") : ""} style={{ "--ms": `${AUTOPLAY_MS}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
