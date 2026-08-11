import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { fireAnalyticsEvent } from "@/lib/analytics";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

import SEOHead from "@/components/SEOHead";

export default function StripeCheckoutSimulatorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const plan = searchParams.get("plan") || "monthly";
  const sessionId = searchParams.get("session_id") || "mock_session";

  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  const priceAmount = plan === "annual" ? 59 : 7;
  const pricePeriod = plan === "annual" ? "yearly" : "monthly";

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/upgrade/simulate-webhook`, {
        email: email.trim(),
        plan: plan
      });

      fireAnalyticsEvent("upgrade_completed", {
        plan: plan
      });

      toast.success("Payment completed successfully (Test Mode)!");
      setTimeout(() => {
        navigate(`/upgrade-success?session_id=${sessionId}&email=${encodeURIComponent(email)}&plan=${plan}`);
      }, 1000);
    } catch (err) {
      toast.error("Simulated checkout error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      <SEOHead
        rawTitle="GlobalSync Pro Subscription Checkout | GlobalSync AI"
        description="Upgrade to GlobalSync Pro for unlimited named team workspaces, calendar exports, custom URL slugs, and invoice calculations."
        canonical="/stripe-checkout"
      />
      
      {/* Left Column: Product Summary */}
      <div className="md:w-1/2 bg-slate-100 p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
        <div className="space-y-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to GlobalSync AI
          </button>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Unlock Advanced Features with GlobalSync Pro</h3>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">GlobalSync Pro Workspace Subscription</h1>
            <p className="text-sm text-slate-500 mt-2">Unlimited named team workspaces, calendar exports, custom URL slugs, and invoice builder capabilities with unlimited invoice generations.</p>
          </div>

          <div className="flex items-baseline gap-1 pt-4 border-t border-slate-200">
            <span className="text-4xl font-extrabold text-slate-900">${priceAmount}.00</span>
            <span className="text-sm font-semibold text-slate-500">USD / {pricePeriod}</span>
          </div>
        </div>

        <div className="pt-8 md:pt-0 text-xs text-slate-400 space-y-2">
          <p className="flex items-center gap-1.5 font-medium text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Secure test connection powered by Stripe Checkout simulation.
          </p>
          <p>Mock billing session ID: <span className="font-mono text-slate-500">{sessionId}</span></p>
        </div>
      </div>

      {/* Right Column: Checkout Form */}
      <div className="md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center max-w-lg mx-auto w-full">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Secure Credit Card Payment Information</h2>

        <form onSubmit={handlePaymentSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 outline-none cursor-not-allowed"
            />
          </div>

          {/* Card Details */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Card Details</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:border-indigo-500 transition-colors shadow-sm">
              <div className="flex items-center bg-white px-3 py-2.5 border-b border-slate-200">
                <CreditCard className="w-4 h-4 text-slate-400 mr-2.5" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-sm text-slate-800 outline-none placeholder-slate-300 font-mono"
                  placeholder="4242 4242 4242 4242"
                  required
                />
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1 rounded shrink-0">TEST</span>
              </div>
              <div className="flex bg-white text-sm divide-x divide-slate-200">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-1/2 px-3 py-2.5 outline-none placeholder-slate-300 font-mono"
                  placeholder="MM/YY"
                  required
                />
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-1/2 px-3 py-2.5 outline-none placeholder-slate-300 font-mono"
                  placeholder="CVC"
                  required
                />
              </div>
            </div>
          </div>

          {/* Name on Card */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Name on Card</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 transition-colors shadow-sm"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#635BFF] hover:bg-[#5249F5] text-white font-semibold rounded-lg text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> Pay ${priceAmount}.00 & Subscribe
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure 256-bit SSL encrypted test transaction.
        </div>
      </div>

    </div>
  );
}
