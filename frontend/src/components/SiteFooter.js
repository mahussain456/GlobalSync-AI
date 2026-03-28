import { Link } from "react-router-dom";

const TOOL_LINKS = [
  { label: "Time Zone Converter", to: "/time-zone-converter" },
  { label: "Currency Converter",  to: "/currency-converter"  },
  { label: "Meeting Planner",     to: "/meeting-planner"     },
  { label: "Open Dashboard",      to: "/dashboard"           },
];

const RESOURCE_LINKS = [
  { label: "Blog",       to: "/blog"  },
  { label: "Daily Feed", to: "/news"  },
  { label: "About Us",   to: "/about" },
  { label: "Contact",    to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy",   to: "/privacy-policy"   },
  { label: "Terms of Service", to: "/terms-of-service" },
];

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-zinc-100 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <img src="/logo-dark.png" alt="GlobalSync AI" className="h-10 w-auto rounded-lg mb-3" />
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed mb-4">
              Free AI-powered time zone converter, currency converter, and meeting planner for remote teams worldwide.
            </p>
            <p className="text-xs text-zinc-400">Sync Beyond Borders</p>
          </div>

          <FooterCol title="Tools" links={TOOL_LINKS} />
          <FooterCol title="Resources" links={RESOURCE_LINKS} />
          <FooterCol title="Legal" links={LEGAL_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} GlobalSync AI · Free for everyone, worldwide.
          </p>
          <p className="text-xs text-zinc-400">
            Exchange rates from ExchangeRate-API · Time zones from IANA · AI by Anthropic Claude
          </p>
        </div>
      </div>
    </footer>
  );
}
