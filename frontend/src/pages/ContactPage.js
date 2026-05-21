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
      await axios.post(`${API}/api/contact`, form);
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
    <div className="min-h-screen bg-gem-forest text-gem-beige relative">
      <SEOHead {...seo} />

      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient overlay to soften */}
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10"></div>
        {/* World Map Background */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        ></div>
      </div>

      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-36 pb-8">
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-bold text-gem-beige mb-4">Contact Us</h1>
          <p className="text-lg text-gem-beige/60 leading-relaxed">
            Have a question, found a bug, or want to partner with us? We'd love to hear from you. We typically respond within 48 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-gem-gold" />
            </div>
            <h2 className="font-semibold text-gem-beige mb-1">General Support</h2>
            <p className="text-sm text-gem-beige/60 mb-3">Questions, feedback, bug reports, or requests for help using the site.</p>
            <a href="mailto:hello@globalsync-ai.com" className="text-gem-gold hover:text-gem-gold/80 text-sm font-medium transition-colors">
              hello@globalsync-ai.com
            </a>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-gem-gold" />
            </div>
            <h2 className="font-semibold text-gem-beige mb-1">Corrections & Editorial Feedback</h2>
            <p className="text-sm text-gem-beige/60 mb-3">Flag an error, suggest an update, or share feedback about any guide or landing page.</p>
            <a href="mailto:editorial@globalsync-ai.com" className="text-gem-gold hover:text-gem-gold/80 text-sm font-medium transition-colors">
              editorial@globalsync-ai.com
            </a>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6 md:col-span-2 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-gem-gold/20 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-gem-gold" />
            </div>
            <h2 className="font-semibold text-gem-beige mb-2">About This Site</h2>
            <p className="text-sm text-gem-beige/60 mb-3">
              GlobalSync AI is an independent project built by Ahmed Hussain for remote teams, freelancers, and international workers who need clearer time zone and currency tools.
            </p>
            <p className="text-sm text-gem-beige/60 mb-3">
              We do not publish a public office address on the site. The fastest way to reach us is by email or the form below.
            </p>
            <p className="text-xs text-gem-beige/40">
              For business, sponsorship, or product questions, start with <a href="mailto:hello@globalsync-ai.com" className="text-gem-gold hover:text-gem-gold/80">hello@globalsync-ai.com</a> and we will route your message.
            </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-7 mb-10">
          <h2 className="font-heading text-xl font-bold text-gem-beige mb-6">Send Us a Message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-gem-gold mb-4" />
              <h3 className="font-heading text-lg font-bold text-gem-beige mb-2">Message Sent!</h3>
              <p className="text-gem-beige/60 text-sm mb-5">We'll get back to you at <strong>{form.email}</strong> within 48 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "General Feedback", message: "" }); }} className="text-gem-gold hover:text-gem-gold/80 text-sm font-medium transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gem-beige/80 block mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-gem-forest text-gem-beige text-sm outline-none focus:border-gem-gold/50 focus:ring-2 focus:ring-gem-gold/20 transition-all placeholder:text-gem-beige/30"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gem-beige/80 block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@company.com"
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-gem-forest text-gem-beige text-sm outline-none focus:border-gem-gold/50 focus:ring-2 focus:ring-gem-gold/20 transition-all placeholder:text-gem-beige/30"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gem-beige/80 block mb-1">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-xl border border-white/10 bg-gem-forest text-gem-beige text-sm outline-none focus:border-gem-gold/50 focus:ring-2 focus:ring-gem-gold/20 transition-all cursor-pointer"
                  data-testid="contact-subject-select"
                >
                  <option className="bg-gem-forest">General Feedback</option>
                  <option className="bg-gem-forest">Bug Report</option>
                  <option className="bg-gem-forest">Feature Request</option>
                  <option className="bg-gem-forest">Advertising / Partnership</option>
                  <option className="bg-gem-forest">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gem-beige/80 block mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-gem-forest text-gem-beige text-sm outline-none focus:border-gem-gold/50 focus:ring-2 focus:ring-gem-gold/20 transition-all resize-none placeholder:text-gem-beige/30"
                  data-testid="contact-message-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gem-gold text-gem-forest font-bold hover:bg-gem-gold/90 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-[28px] border border-white/10 p-6 text-center">
          <img
            src="/logo-dark.png"
            alt="GlobalSync AI"
            loading="lazy"
            className="w-auto mx-auto mb-3 transition-transform duration-300 hover:scale-105 logo-glowing-effect"
            style={{ height: "68px" }}
          />
          <p className="text-sm text-gem-beige/60">Free tools for remote teams worldwide.</p>
          <p className="text-xs text-gem-beige/40 mt-2">globalsync-ai.com</p>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
