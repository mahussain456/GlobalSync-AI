import { ArrowRight } from "lucide-react";
import { GUIDES } from "@/data/guidesData";

// Three latest guides as cards. The full list lives under "Browse every page".
export default function HomeGuides() {
  return (
    <section className="home-guides" aria-labelledby="home-guides-title" data-testid="home-guides">
      <div className="home-sec-head">
        <h2 id="home-guides-title">Guides for work<br />across borders.</h2>
        <p>Plain answers with live times and rates built in. <a href="/guides">All guides <ArrowRight aria-hidden="true" /></a></p>
      </div>
      <div className="home-guide-grid">
        {GUIDES.slice(0, 3).map((g) => (
          <a key={g.slug} href={`/guides/${g.slug}`}>
            <small>{g.category} · {g.readTime}</small>
            <h3>{g.title.split(/[:(]/)[0].trim()}</h3>
            <p>{g.excerpt}</p>
            <em>Read the guide <ArrowRight aria-hidden="true" /></em>
          </a>
        ))}
      </div>
    </section>
  );
}
