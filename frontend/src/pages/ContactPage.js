import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Globe, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import axios from "axios";
import { toast } from "sonner";
import { getStaticPageSEO } from "@/lib/seo";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? process.env.REACT_APP_BACKEND_URL : "";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General Feedback", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/contact`, form);
      if (response.data?.success !== true) throw new Error('Unconfirmed delivery');
      setSent(true);
      toast.success("Message sent! We'll get back to you within 48 hours.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const seo = getStaticPageSEO("contact");
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-bold text-ink mb-4">Contact Our Editorial & Technical Team</h1>
          <p className="text-lg text-quiet leading-relaxed mb-6">
            Have a question, suggestion, or technical request? We read every query and typically respond within 48 hours.
          </p>
          <div className="bg-surface border border-line rounded-2xl p-5 text-sm text-quiet space-y-3">
            <h2 className="font-bold text-ink text-base">What You Can Contact Us About:</h2>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li><strong className="text-pine">Bug Reports:</strong> Report website glitches, calculator logic errors, rendering bugs, or responsive display anomalies across any mobile or desktop browser.</li>
              <li><strong className="text-pine">Data & Timezone Corrections:</strong> Flag incorrect time offsets, unexpected daylight saving adjustments, or currency exchange rate provider delays.</li>
              <li><strong className="text-pine">Feature Suggestions:</strong> Recommend new city pairs, additional currency additions, custom team workspace features, or workflow improvements.</li>
              <li><strong className="text-pine">Partnerships & Press Inquiries:</strong> Pitch content syndication ideas, advertising sponsorships, media interviews, or developer integration tools.</li>
            </ul>
            <p className="text-xs text-quiet pt-3 border-t border-line leading-relaxed">
              🚀 <strong>Response Commitment & SLA:</strong> Our technical team and editorial reviewers monitor incoming inquiries daily. We commit to acknowledging all bug reports and data corrections within <strong>2 business days (48 hours)</strong> and deploying hotfixes for verified calculation bugs within 24 hours.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-surface  rounded-xl border border-line p-6 hover:border-line transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-pine" />
            </div>
            <h2 className="font-semibold text-ink mb-1">General Technical & User Support</h2>
            <p className="text-sm text-quiet mb-3">Questions, feedback, bug reports, or requests for help using the site.</p>
            <a href="mailto:hello@globalsync-ai.com" className="text-pine hover:text-pine text-sm font-medium transition-colors">
              hello@globalsync-ai.com
            </a>
          </div>

          <div className="bg-surface  rounded-xl border border-line p-6 hover:border-line transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-pine" />
            </div>
            <h2 className="font-semibold text-ink mb-1">Corrections & Editorial Feedback</h2>
            <p className="text-sm text-quiet mb-3">Flag an error, suggest an update, or share feedback about any guide or landing page.</p>
            <a href="mailto:editorial@globalsync-ai.com" className="text-pine hover:text-pine text-sm font-medium transition-colors">
              editorial@globalsync-ai.com
            </a>
          </div>

          <div className="bg-surface  rounded-xl border border-line p-6 md:col-span-2 hover:border-line transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-pine" />
            </div>
            <h2 className="font-semibold text-ink mb-2">About GlobalSync AI & Support</h2>
            <p className="text-sm text-quiet mb-3">
              GlobalSync AI is an independent project built by Ahmed Hussain for remote teams, freelancers, and international workers who need clearer time zone and currency tools.
            </p>
            <p className="text-sm text-quiet mb-3">
              We do not publish a public office address on the site. The fastest way to reach us is by email or the form below.
            </p>
            <p className="text-xs text-quiet">
              For business, sponsorship, or product questions, start with <a href="mailto:hello@globalsync-ai.com" className="text-pine hover:text-pine">hello@globalsync-ai.com</a> and we will route your message.
            </p>
          </div>
        </div>

        <div className="bg-surface  rounded-xl border border-line p-7 mb-10">
          <h2 className="font-heading text-xl font-bold text-ink mb-6">Send Us a Message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-pine mb-4" />
              <h3 className="font-heading text-lg font-bold text-ink mb-2">Message Sent!</h3>
              <p className="text-quiet text-sm mb-5">We'll get back to you at <strong>{form.email}</strong> within 48 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "General Feedback", message: "" }); }} className="text-pine hover:text-pine text-sm font-medium transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-quiet block mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-sm outline-none focus:border-line focus:ring-2 focus:ring-gem-gold/20 transition-all placeholder:text-quiet"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-quiet block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-sm outline-none focus:border-line focus:ring-2 focus:ring-gem-gold/20 transition-all placeholder:text-quiet"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-quiet block mb-1">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-sm outline-none focus:border-line focus:ring-2 focus:ring-gem-gold/20 transition-all cursor-pointer"
                  data-testid="contact-subject-select"
                >
                  <option className="bg-paper">General Feedback</option>
                  <option className="bg-paper">Bug Report</option>
                  <option className="bg-paper">Feature Request</option>
                  <option className="bg-paper">Advertising / Partnership</option>
                  <option className="bg-paper">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-quiet block mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 rounded-xl border border-line bg-paper text-ink text-sm outline-none focus:border-line focus:ring-2 focus:ring-gem-gold/20 transition-all resize-none placeholder:text-quiet"
                  data-testid="contact-message-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-pine text-paper font-bold hover:bg-ink disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-surface  rounded-xl border border-line p-6 text-center">
          <Link to="/" className="inline-block">
            <img
              src="/meridian/logo-finished.png"
              alt="GlobalSync AI"
              loading="lazy"
              width={204}
              height={68}
              className="w-auto mx-auto mb-3 transition-transform duration-300 hover:scale-105 "
              style={{ height: "68px" }}
            />
          </Link>
          <p className="text-sm text-quiet">Free tools for remote teams worldwide.</p>
          <p className="text-xs text-quiet mt-2">globalsync-ai.com</p>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
