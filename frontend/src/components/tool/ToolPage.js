import { useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

// Shared building blocks for the main tool pages, so every tool page carries the
// homepage's look: the relief atlas, frosted glass, Playfair headings, one radius.

// Hero: headline + intro over the atlas, with the working tool in a glass panel.
export function ToolHero({ title, intro, children, wide = false }) {
  return (
    <section className={`tool-hero${wide ? " is-wide" : ""}`}>
      <div className="tool-hero-backdrop" aria-hidden="true">
        <img src="/atlas/world-atlas.webp" alt="" width="2400" height="907" decoding="async" fetchPriority="high" />
        <i className="orb a" /><i className="orb b" />
      </div>
      <div className="tool-shell">
        <header className="tool-hero-head">
          <h1>{title}</h1>
          {intro && <p>{intro}</p>}
        </header>
        <div className="tool-glass">{children}</div>
      </div>
    </section>
  );
}

// A titled section with consistent spacing.
export function ToolSection({ title, intro, children, id }) {
  return (
    <section className="tool-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {intro && <p className="tool-section-intro">{intro}</p>}
      {children}
    </section>
  );
}

// Type-to-search over every programmatic page, replacing the long link grids.
// `options` is [{ value, label, href }].
export function BrowseAll({ label, placeholder, options, testId }) {
  const navigate = useNavigate();
  const id = useId();
  const [query, setQuery] = useState("");
  const byLabel = useMemo(() => new Map(options.map((o) => [o.label.toLowerCase(), o])), [options]);
  const match = byLabel.get(query.trim().toLowerCase())
    || (query.trim().length > 1 ? options.find((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())) : null);
  const go = (e) => { e.preventDefault(); if (match) navigate(match.href); };
  return (
    <form className="browse-all" onSubmit={go} role="search">
      <label htmlFor={`${id}-q`}>{label} <span>({options.length})</span></label>
      <div className="browse-all-row">
        <Search aria-hidden="true" />
        <input id={`${id}-q`} list={`${id}-l`} value={query} placeholder={placeholder} autoComplete="off" data-testid={testId}
          onChange={(e) => { setQuery(e.target.value); const exact = byLabel.get(e.target.value.toLowerCase()); if (exact) navigate(exact.href); }} />
        <button type="submit" className="btn btn-primary" disabled={!match}>Open <ArrowRight aria-hidden="true" /></button>
      </div>
      <datalist id={`${id}-l`}>{options.map((o) => <option key={o.value} value={o.label} />)}</datalist>
    </form>
  );
}

// Compact list of popular pages: a row of quiet links, not a wall of cards.
export function LinkList({ links }) {
  return (
    <ul className="link-list">
      {links.map((l) => (
        <li key={l.to}><Link to={l.to}><span>{l.label}</span>{l.desc && <small>{l.desc}</small>}<ArrowRight aria-hidden="true" /></Link></li>
      ))}
    </ul>
  );
}

export function ToolFaq({ faqs, id = "faq" }) {
  return (
    <ToolSection title="Questions" id={id}>
      <div className="tool-faq">
        {faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </ToolSection>
  );
}

export function RelatedTools({ links }) {
  return (
    <nav className="related-tools" aria-label="Related tools">
      <span>Related</span>
      {links.map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
    </nav>
  );
}
