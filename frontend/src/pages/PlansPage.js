import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function PlansPage() {
  return <div className="min-h-screen bg-paper text-ink">
    <SEOHead rawTitle="Free tools and Pro availability | GlobalSync AI" canonical="/stripe-checkout" noIndex description="See current free tool limits and GlobalSync Pro availability." />
    <SiteNav />
    <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="font-serif text-4xl mb-6">Keep working with the free tools</h1>
      <p className="text-quiet leading-relaxed mb-8">Pro upgrades are not currently available. You can keep using the free tools below. No payment is collected here.</p>
      <table className="w-full text-left mb-10">
        <caption className="text-left font-semibold mb-4">Current free access</caption>
        <thead><tr className="border-b border-line"><th className="py-3">Tool</th><th>Included</th></tr></thead>
        <tbody>
          <tr className="border-b border-line"><th className="py-4 font-normal">Time, meetings and currency</th><td>No signup required</td></tr>
          <tr className="border-b border-line"><th className="py-4 font-normal">Saved teams</th><td>1 team, up to 6 members</td></tr>
          <tr className="border-b border-line"><th className="py-4 font-normal">Invoices</th><td>3 exports per month in this browser</td></tr>
          <tr className="border-b border-line"><th className="py-4 font-normal">Custom branding and Pro extras</th><td>Unavailable for new upgrades</td></tr>
        </tbody>
      </table>
      <Link to="/dashboard" rel="nofollow" className="btn-primary inline-flex">Open workspace</Link>
      <p className="mt-6 text-sm text-quiet">For product questions, <Link to="/contact" className="underline">contact us</Link>.</p>
    </main>
    <SiteFooter />
  </div>;
}
