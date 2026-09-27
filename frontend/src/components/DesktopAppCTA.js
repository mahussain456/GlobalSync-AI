import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { fireAnalyticsEvent } from "@/lib/analytics";

/**
 * Promotes the free desktop World Clock widget on time-zone tools and guides.
 * Flat interior card (surface + line), per DESIGN.md. `placement` labels the click in analytics.
 */
export default function DesktopAppCTA({ placement = "tool", className = "" }) {
  const track = () => fireAnalyticsEvent("widget_cta_click", { placement });
  return (
    <aside
      aria-labelledby={`desktop-cta-${placement}`}
      className={`max-w-6xl mx-auto px-6 my-14 ${className}`}
    >
      <div className="bg-wash border border-line rounded-xl overflow-hidden grid md:grid-cols-[1.35fr_.65fr] items-center">
        <div className="p-7 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-pine mb-3">Free desktop app · Windows &amp; Mac</p>
          <h2 id={`desktop-cta-${placement}`} className="text-3xl md:text-4xl text-ink mb-3">
            Keep these clocks <em className="text-pine">on your desktop.</em>
          </h2>
          <p className="text-quiet max-w-xl mb-6">
            GlobalSync World Clock shows four cities with live call status, so you can see who&rsquo;s at work before you message. 1.6&nbsp;MB, no account.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/world-clock-widget#download" onClick={track}
              className="inline-flex items-center gap-2 min-h-[48px] rounded-[5px] bg-ink text-paper font-semibold px-5 hover:bg-pine transition-colors">
              <Download className="w-4 h-4" aria-hidden="true" /> Download free
            </Link>
            <Link to="/world-clock-widget" onClick={track}
              className="inline-flex items-center gap-2 font-semibold text-ink border-b border-transparent hover:border-ink transition-colors">
              See how it works <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex justify-center items-end self-stretch pt-8 pr-6 overflow-hidden" aria-hidden="true">
          <img src="/world-clock/world-clock-forest.webp" alt="" width="240" height="328" loading="lazy" decoding="async"
            className="w-[240px] h-auto translate-y-10 rotate-[3deg]" />
        </div>
      </div>
    </aside>
  );
}
