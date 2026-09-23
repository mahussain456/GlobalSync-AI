import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ToolCTA({
  title = "Try GlobalSync AI Tools",
  description = "Convert time zones, calculate freelance currency rates, and plan global team meetings effortlessly.",
  primaryLink = "/time-zone-converter",
  primaryText = "Open Time Zone Converter",
  secondaryLink = "/meeting-planner",
  secondaryText = "Meeting Planner",
  className = "",
}) {
  return (
    <aside className={`my-8 bg-gem-gold/10 border border-line rounded-2xl p-6 relative overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 text-pine font-semibold text-xs uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" /> GlobalSync AI Utility
      </div>
      <h3 className="font-heading text-xl font-bold text-ink mb-2">
        {title}
      </h3>
      <p className="text-quiet text-sm mb-5 leading-relaxed max-w-xl">
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={primaryLink}
          className="inline-flex items-center gap-2 bg-pine text-paper font-bold text-sm rounded-xl px-5 py-2.5 hover:bg-ink transition-colors"
        >
          {primaryText} <ArrowRight className="w-4 h-4" />
        </Link>
        {secondaryLink && (
          <Link
            to={secondaryLink}
            className="inline-flex items-center gap-2 bg-surface border border-line text-ink text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-surface transition-colors"
          >
            {secondaryText}
          </Link>
        )}
      </div>
    </aside>
  );
}
