import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer-meridian bg-[#0E2A1F] text-gem-mist border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="meridian-footer-brand mb-4" aria-label="GlobalSync AI home">
            <img
              src="/meridian/logo-original-transparent.png"
              alt="GlobalSync AI"
              loading="lazy"
              width={174}
              height={58}
              className="brand-footer-image"
            />
          </Link>
          <p className="text-sm text-gem-sage mb-6 leading-relaxed">
            One calm control center for global schedules, meeting overlaps, and currency conversion. Built for the modern remote workforce.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/mahussain456/GlobalSync-AI" aria-label="GlobalSync AI on GitHub" className="text-gem-sage hover:text-gem-gold transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Tools */}
        <div>
          <p className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Tools</p>
          <ul className="space-y-3">
            <li><Link to="/time-zone-converter" className="text-sm hover:text-gem-gold transition-colors">Time Zone Converter</Link></li>
            <li><Link to="/meeting-planner" className="text-sm hover:text-gem-gold transition-colors">Meeting Planner</Link></li>
            <li><Link to="/currency-converter" className="text-sm hover:text-gem-gold transition-colors">Currency Converter</Link></li>
            <li><Link to="/convert" className="text-sm text-gem-gold font-medium hover:underline transition-colors">Zone Pair Converters Hub</Link></li>
            <li><Link to="/freelance-rate" className="text-sm text-gem-gold font-medium hover:underline transition-colors">Freelance Rate Hub</Link></li>
            <li><Link to="/meeting-overlap" className="text-sm text-gem-gold font-medium hover:underline transition-colors">Meeting Overlap Hub</Link></li>
            <li><Link to="/dashboard" className="text-sm hover:text-gem-gold transition-colors">Open workspace</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Resources</p>
          <ul className="space-y-3">
            <li><Link to="/blog" className="text-sm hover:text-gem-gold transition-colors">Blog & Guides</Link></li>
            <li><Link to="/freelancer-rate-converter" className="text-sm hover:text-gem-gold transition-colors">Freelancer Rates</Link></li>
            <li><Link to="/global-meeting-planner-for-remote-teams" className="text-sm hover:text-gem-gold transition-colors">Global Meeting Planner</Link></li>
            <li><Link to="/us-india-meeting-time" className="text-sm hover:text-gem-gold transition-colors">US–India Meeting Time</Link></li>
            <li><Link to="/data-sources" className="text-sm hover:text-gem-gold transition-colors">Data Sources</Link></li>
            <li><Link to="/methodology" className="text-sm hover:text-gem-gold transition-colors">Methodology</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Company</p>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-sm hover:text-gem-gold transition-colors">About Us</Link></li>
            <li><Link to="/authors/ahmed-hussain" className="text-sm hover:text-gem-gold transition-colors">Ahmed Hussain</Link></li>
            <li><Link to="/press" className="text-sm hover:text-gem-gold transition-colors">Press</Link></li>
            <li><Link to="/contact" className="text-sm hover:text-gem-gold transition-colors">Contact</Link></li>
            <li><Link to="/privacy-policy" className="text-sm hover:text-gem-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-sm hover:text-gem-gold transition-colors">Terms of Service</Link></li>
            <li><Link to="/editorial-policy" className="text-sm hover:text-gem-gold transition-colors">Editorial Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-xs text-gem-sage flex flex-col md:flex-row items-center justify-between">
        {/* suppressHydrationWarning: year computed at prerender vs. client-mount may differ near year-end */}
        <p suppressHydrationWarning>© {new Date().getFullYear()} GlobalSync AI. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for global operators.</p>
      </div>
    </footer>
  );
}
