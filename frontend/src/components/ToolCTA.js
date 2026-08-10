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
    <aside className={`my-8 bg-gem-gold/10 border border-gem-gold/25 rounded-2xl p-6 relative overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 text-gem-gold font-semibold text-xs uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" /> GlobalSync AI Utility
      </div>
      <h3 className="font-heading text-xl font-bold text-gem-beige mb-2">
        {title}
      </h3>
      <p className="text-gem-sage text-sm mb-5 leading-relaxed max-w-xl">
        {description}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={primaryLink}
          className="inline-flex items-center gap-2 bg-gem-gold text-gem-forest font-bold text-sm rounded-xl px-5 py-2.5 hover:bg-gem-gold/90 transition-colors"
        >
          {primaryText} <ArrowRight className="w-4 h-4" />
        </Link>
        {secondaryLink && (
          <Link
            to={secondaryLink}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/20 text-gem-beige text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-white/10 transition-colors"
          >
            {secondaryText}
          </Link>
        )}
      </div>
    </aside>
  );
}
