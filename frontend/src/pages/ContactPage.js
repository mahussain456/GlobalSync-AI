import { Link } from "react-router-dom";
import { Mail, Globe, MessageSquare } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <SEOHead
        title="Contact GlobalSync AI — Get in Touch"
        description="Contact the GlobalSync AI team for support, feedback, partnership enquiries, or advertising. We aim to respond within 48 hours."
        canonical="/contact"
        keywords="contact GlobalSync AI, support, feedback, partnership"
      />

      <nav className="max-w-3xl mx-auto px-6 pt-6 pb-2">
        <ol className="flex items-center gap-2 text-sm text-zinc-400">
          <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
          <span>/</span>
          <li><span className="text-zinc-600 font-medium">Contact</span></li>
        </ol>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-8">
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-bold text-zinc-900 mb-4">Contact Us</h1>
          <p className="text-lg text-zinc-500 leading-relaxed">
            Have a question, found a bug, or want to partner with us? We'd love to hear from you. We typically respond within 48 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-semibold text-zinc-900 mb-1">General Enquiries</h2>
            <p className="text-sm text-zinc-500 mb-3">Questions, feedback, or anything else.</p>
            <a href="mailto:hello@globalsync-ai.com" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              hello@globalsync-ai.com
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-zinc-900 mb-1">Advertising & Partnerships</h2>
            <p className="text-sm text-zinc-500 mb-3">Sponsorships, affiliate partnerships, and collaborations.</p>
            <a href="mailto:partnerships@globalsync-ai.com" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              partnerships@globalsync-ai.com
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-7 mb-10">
          <h2 className="font-heading text-xl font-bold text-zinc-900 mb-6">Send Us a Message</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thanks! We'll get back to you within 48 hours."); e.target.reset(); }} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="contact-name-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="alex@company.com"
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="contact-email-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">Subject</label>
              <select
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 cursor-pointer bg-white"
                data-testid="contact-subject-select"
              >
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Advertising / Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Tell us what's on your mind..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-zinc-900 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                data-testid="contact-message-input"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
              data-testid="contact-submit-btn"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6 text-center">
          <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 mb-1">GlobalSync AI</h3>
          <p className="text-sm text-zinc-500">Free tools for remote teams worldwide.</p>
          <p className="text-xs text-zinc-400 mt-2">globalsync-ai.com</p>
        </div>
      </article>

      <footer className="border-t border-zinc-200 py-6 px-6 mt-6">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <Link to="/" className="hover:text-zinc-600">Home</Link>
          <Link to="/about" className="hover:text-zinc-600">About</Link>
          <Link to="/privacy-policy" className="hover:text-zinc-600">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-zinc-600">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
