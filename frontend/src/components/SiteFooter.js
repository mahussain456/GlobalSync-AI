import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Globe } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="bg-[#0A1E16] text-gem-mist border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center mb-4 transition-transform duration-300 hover:scale-105">
            <img
              src="/logo-dark.webp"
              alt="GlobalSync AI"
              loading="lazy"
              width={174}
              height={58}
              className="w-auto logo-glowing-effect"
              style={{ height: "58px" }}
            />
          </Link>
          <p className="text-sm text-gem-sage mb-6 leading-relaxed">
            One calm control center for global schedules, meeting overlaps, and currency conversion. Built for the modern remote workforce.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gem-sage hover:text-gem-gold transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gem-sage hover:text-gem-gold transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gem-sage hover:text-gem-gold transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Tools */}
        <div>
          <h3 className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Tools</h3>
          <ul className="space-y-3">
            <li><Link to="/time-zone-converter" className="text-sm hover:text-gem-gold transition-colors">Time Zone Converter</Link></li>
            <li><Link to="/meeting-planner" className="text-sm hover:text-gem-gold transition-colors">Meeting Planner</Link></li>
            <li><Link to="/currency-converter" className="text-sm hover:text-gem-gold transition-colors">Currency Converter</Link></li>
            <li><Link to="/dashboard" className="text-sm hover:text-gem-gold transition-colors">AI Answer Console</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Resources</h3>
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
          <h3 className="text-gem-stone font-bold uppercase tracking-wider text-xs mb-4">Company</h3>
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
