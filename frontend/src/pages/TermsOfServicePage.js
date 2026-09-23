import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";

const LAST_UPDATED = "March 2026";

export default function TermsOfServicePage() {
  const seo = getStaticPageSEO("terms-of-service");
  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} />


      <SiteNav />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <header className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-ink mb-3">GlobalSync AI Terms of Service Agreement</h1>
          <p className="text-sm text-quiet">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="bg-surface  rounded-xl border border-line p-4 mb-8 text-sm text-quiet">
          <strong className="text-ink">Please read these Terms carefully.</strong> By using GlobalSync AI, you agree to be bound by these Terms. If you do not agree, please do not use our services.
        </div>

        <div className="space-y-8 text-quiet leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using GlobalSync AI at <strong className="text-ink">globalsync-ai.com</strong> (the "Service"), you agree to be bound by these Terms of Service ("Terms"). These Terms govern all visitors, registered users, and automated consumers who access our website, applications, or API endpoints. If you do not agree to these Terms in full, you must discontinue use of the Service immediately.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">2. Description of Service & Core Features</h2>
            <p>GlobalSync AI is a free web productivity suite designed for remote teams, freelancers, and distributed organizations. Our tools include:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Real-time time zone conversion and world clock displays powered by the IANA database</li>
              <li>Currency conversion with timestamped reference rates across 160+ world currencies</li>
              <li>Interactive meeting time planner and working-hour overlap calculations for up to 5 cities</li>
              <li>Freelancer hourly-to-salary equivalent calculator and invoice building utilities</li>
              <li>AI-powered natural language query processing for instant scheduling calculations</li>
            </ul>
            <p className="mt-3">The Service is provided free of charge for individual and organizational use and does not require account creation or mandatory payment.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">3. Financial Disclaimer & Information Accuracy</h2>
            <p>GlobalSync AI provides time zone, currency exchange, and rate calculations strictly for informational and planning purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm mt-2">
              <li><strong className="text-ink">Currency exchange rates:</strong> All conversion rates represent mid-market reference rates sourced from institutional feeds (such as the European Central Bank). They do not reflect retail commercial rates, bank transfer fees, or card issuer markups. GlobalSync AI is not a financial institution, currency broker, or trading advisory platform.</li>
              <li><strong className="text-ink">Time zone database:</strong> Time zone offsets build on the official IANA Time Zone Database (TZDB). While updated regularly, we are not liable for scheduling conflicts resulting from sudden government alterations to daylight saving time rules.</li>
              <li><strong className="text-ink">No financial advisory:</strong> Information provided by the Service should not be construed as investment, legal, or financial advice. Always verify financial rates with your primary banking provider before executing international transactions.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">4. Acceptable Use & System Integrity Rules</h2>
            <p>To preserve equitable performance and system security for all global users, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
              <li>Use the Service for any unlawful purpose or in violation of regional or international laws</li>
              <li>Deploy automated bots, scrapers, or scripts that overload our infrastructure beyond reasonable usage limits</li>
              <li>Attempt to gain unauthorized access to server code, backend API keys, or private user workspace states</li>
              <li>Reverse engineer, decompile, or attempt to extract underlying algorithmic source code</li>
              <li>Resell, white-label, or commercially monetize our live API endpoints without explicit written consent</li>
              <li>Interfere with or bypass server-side rate limiting or caching mechanisms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">5. Intellectual Property Rights</h2>
            <p>The Service, including its branding, UI design system, custom conversion algorithms, logo assets, and editorial guides, is owned exclusively by GlobalSync AI and protected under international copyright, trademark, and trade secret laws. You may not copy, reproduce, re-publish, or create derivative works from site content without prior written approval.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">6. Third-Party API Integrations</h2>
            <p>The Service relies on third-party data providers including ExchangeRate-API, Frankfurter API, and Anthropic Claude AI. We do not guarantee continuous uptime or uninterrupted availability of third-party feeds and are not liable for service outages caused by third-party infrastructure failures.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">7. Disclaimer of Warranties</h2>
            <p>THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, COMPLETELY ACCURATE, OR ERROR-FREE.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">8. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, GLOBALSYNC AI AND ITS OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, REGARDLESS OF CAUSE.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">9. API Rate Limiting & Fair Use Policy</h2>
            <p>Our backend APIs employ automated IP-based rate limiting to prevent denial-of-service attacks and abuse. Excess automated requests will receive standard 429 HTTP rate-limit responses. Developers interested in high-volume API access should contact our support team to discuss custom integrations.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">10. Modifications to Terms</h2>
            <p>We reserve the right to revise these Terms at any time. Updated Terms will be effective immediately upon posting to this page, marked with a revised "Last updated" date. Continued use of GlobalSync AI after modifications constitutes binding acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-ink mb-3">11. Governing Law & Contact Notices</h2>
            <p>These Terms shall be governed by and construed in accordance with standard legal principles of international web services. For questions, legal notices, or terms feedback, contact us at <a href="mailto:hello@globalsync-ai.com" className="text-pine hover:underline">hello@globalsync-ai.com</a>.</p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
