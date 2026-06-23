import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { 
  Calculator, Download, Send, Sparkles, FileText, Globe, DollarSign, Upload, Trash2, ShieldCheck, AlertCircle 
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { toast } from "sonner";
import { fireAnalyticsEvent } from "@/lib/analytics";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "INR", "PKR", "PHP", "NGN", "CAD", "AUD", "AED", "ZAR"];

export default function InvoicePage() {
  // Creator Info
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderCountry, setSenderCountry] = useState("US");
  
  // Client Info
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  
  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(40);
  const [rate, setRate] = useState(50);
  
  // Currencies
  const [billingCurrency, setBillingCurrency] = useState("USD");
  const [payoutCurrency, setPayoutCurrency] = useState("USD");
  const [liveRate, setLiveRate] = useState(1);
  const [rateTimestamp, setRateTimestamp] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Upgrade state
  const [isPaid, setIsPaid] = useState(false);
  const [customLogo, setCustomLogo] = useState(""); // base64 string
  
  // Invoice logs
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Set default due date to Net 30
  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    setDueDate(today.toISOString().split("T")[0]);
  }, []);

  // Load rate calculations and session states
  useEffect(() => {
    // Check paid state
    const paid = localStorage.getItem("gs_is_paid") === "true";
    setIsPaid(paid);

    // Pre-fill from rate converter cache if available
    const cachedRate = localStorage.getItem("gs_rate_amount");
    const cachedCurrency = localStorage.getItem("gs_rate_currency");
    if (cachedRate) setRate(Number(cachedRate));
    if (cachedCurrency) {
      setBillingCurrency(cachedCurrency);
      setPayoutCurrency(cachedCurrency);
    }

    // Load custom logo if paid
    if (paid) {
      const savedLogo = localStorage.getItem("gs_invoice_logo");
      if (savedLogo) setCustomLogo(savedLogo);
    }

    // Load monthly invoice count
    const monthKey = `gs_inv_count_${new Date().getMonth()}_${new Date().getFullYear()}`;
    const storedCount = localStorage.getItem(monthKey) || "0";
    setInvoiceCount(parseInt(storedCount, 10));

    // Prefill user details from onboarding
    const storedUser = localStorage.getItem("gs_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.name && u.name !== "Guest") setSenderName(u.name.replace(" Owner", ""));
        if (u.email) setSenderEmail(u.email);
      } catch {}
    }
  }, []);

  // Increments monthly invoice count
  const incrementInvoiceCount = () => {
    const monthKey = `gs_inv_count_${new Date().getMonth()}_${new Date().getFullYear()}`;
    const nextCount = invoiceCount + 1;
    setInvoiceCount(nextCount);
    localStorage.setItem(monthKey, String(nextCount));
  };

  // Fetch next invoice number sequence from backend
  useEffect(() => {
    if (!senderEmail.trim()) return;

    const fetchNextInvoiceNumber = async () => {
      try {
        const res = await axios.get(`${API}/invoices/next-number`, {
          params: { email: senderEmail.trim() }
        });
        setInvoiceNumber(res.data.invoice_number);
      } catch {
        // Fallback local invoice number
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        setInvoiceNumber(`INV-${year}-${rand}`);
      }
    };
    fetchNextInvoiceNumber();
  }, [senderEmail]);

  // Fetch live exchange rate
  useEffect(() => {
    if (billingCurrency === payoutCurrency) {
      setLiveRate(1);
      setRateTimestamp("");
      return;
    }
    setIsLoadingRate(true);
    const fetchRate = async () => {
      try {
        const res = await axios.get(`${API}/currency/convert`, {
          params: { amount: 1, from_currency: billingCurrency, to_currency: payoutCurrency }
        });
        setLiveRate(res.data.rate || 1);
        setRateTimestamp(res.data.date || "live");
      } catch (err) {
        setLiveRate(1);
      } finally {
        setIsLoadingRate(false);
      }
    };
    fetchRate();
  }, [billingCurrency, payoutCurrency]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 80000) {
      toast.error("Logo must be smaller than 80KB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomLogo(reader.result);
      localStorage.setItem("gs_invoice_logo", reader.result);
      toast.success("Logo uploaded and saved to settings.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCustomLogo("");
    localStorage.removeItem("gs_invoice_logo");
    toast.success("Logo removed.");
  };

  // Math Calculations
  const grossEarnings = hours * rate;
  
  // US SE Tax Math: (net earnings * 0.9235) * 0.153
  const seTaxDeduction = senderCountry === "US" ? (grossEarnings * 0.9235) * 0.153 : 0;
  const estimatedNet = grossEarnings - seTaxDeduction;

  const convertedGross = grossEarnings * liveRate;
  const convertedNet = estimatedNet * liveRate;

  // Analytics triggers
  const fireInvoiceAnalytics = (action) => {
    fireAnalyticsEvent("invoice_generated", {
      currency_pair: `${billingCurrency}/${payoutCurrency}`,
      has_fx_conversion: billingCurrency !== payoutCurrency,
      tier: isPaid ? "paid" : "free",
      action: action
    });
  };

  const fireUpgradeModalTrigger = (trigger) => {
    fireAnalyticsEvent("upgrade_modal_shown", {
      trigger: trigger
    });
  };

  // Trigger simulated billing checkout redirect
  const handleSimulatedUpgrade = async () => {
    try {
      const res = await axios.post(`${API}/upgrade/checkout`, {
        email: senderEmail.trim() || "checkout@globalsync-pro.com",
        plan_type: "monthly",
        origin: window.location.origin
      });
      window.location.href = res.url;
    } catch {
      toast.error("Failed to redirect to simulated upgrade portal.");
    }
  };

  // PDF Generation Mechanics
  const buildPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // 210mm x 297mm A4 Dimensions
    // Draw background borders and clean accents
    doc.setFillColor(14, 42, 31); // gem-forest green accent bar at top
    doc.rect(0, 0, 210, 8, "F");

    // Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(14, 42, 31);
    doc.text("INVOICE", 20, 28);

    // Custom Logo (Paid only)
    if (isPaid && customLogo) {
      try {
        doc.addImage(customLogo, "JPEG", 155, 15, 35, 18);
      } catch (err) {
        console.warn("Logo image drawing failed in PDF builder:", err);
      }
    }

    // Invoice Meta info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 36);
    doc.text(`Issue Date: ${issueDate}`, 20, 42);
    doc.text(`Due Date: ${dueDate}`, 20, 48);

    // Business details row
    doc.setDrawColor(229, 231, 235);
    doc.line(20, 54, 190, 54);

    // From / To sections
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(14, 42, 31);
    doc.text("FROM:", 20, 64);
    doc.text("BILL TO:", 110, 64);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    // Sender
    doc.text(senderName || "Your Name", 20, 70);
    doc.text(senderEmail || "your@email.com", 20, 75);
    doc.text(`Country: ${senderCountry}`, 20, 80);

    // Client
    doc.text(clientName || "Client Name", 110, 70);
    doc.text(clientEmail || "client@email.com", 110, 75);

    // Items table header
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 92, 170, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 42, 31);
    doc.text("Item Description", 23, 97);
    doc.text("Hours", 110, 97);
    doc.text("Rate", 140, 97);
    doc.text("Total", 170, 97);

    // Items table rows
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(description || "Freelance Consultation Sync Services", 23, 110);
    doc.text(String(hours), 110, 110);
    doc.text(`${rate.toFixed(2)} ${billingCurrency}`, 140, 110);
    doc.text(`${grossEarnings.toFixed(2)} ${billingCurrency}`, 170, 110);

    doc.line(20, 116, 190, 116);

    // Financial calculations box
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 42, 31);
    doc.text("Summary & Totals", 20, 130);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    
    let currentY = 138;
    doc.text(`Subtotal:`, 20, currentY);
    doc.text(`${grossEarnings.toFixed(2)} ${billingCurrency}`, 90, currentY);
    currentY += 6;

    if (senderCountry === "US") {
      doc.text(`Self-Employment Tax Deduction (15.3%):`, 20, currentY);
      doc.text(`-${seTaxDeduction.toFixed(2)} ${billingCurrency}`, 90, currentY);
      currentY += 6;

      doc.setFont("helvetica", "bold");
      doc.text(`Estimated Net Earnings:`, 20, currentY);
      doc.text(`${estimatedNet.toFixed(2)} ${billingCurrency}`, 90, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 8;
    } else {
      doc.setFontSize(8.5);
      doc.text("Advisory: Non-US local income tax liabilities are not pre-calculated.", 20, currentY);
      doc.setFontSize(10);
      currentY += 8;
    }

    // Currency conversion details if applicable
    if (billingCurrency !== payoutCurrency) {
      doc.setDrawColor(200, 169, 106); // gold accent outline
      doc.setFillColor(244, 239, 230); // light gold/beige background
      doc.rect(20, currentY, 170, 18, "FD");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(14, 42, 31);
      doc.text(`Currency Conversion Terms (Live Mid-Market Rate)`, 24, currentY + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Exchange rate: 1 ${billingCurrency} = ${liveRate.toFixed(4)} ${payoutCurrency} (Timestamp: ${rateTimestamp || "live"})`, 24, currentY + 11);
      doc.text(`Client pays equivalent total: ${convertedGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${payoutCurrency}`, 24, currentY + 15);
      
      doc.setFontSize(10);
      doc.setDrawColor(229, 231, 235); // restore border color
    }

    // Watermark branding (Removed for Paid)
    if (!isPaid) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(200, 169, 106); // gold watermark
      doc.text("Powered by GlobalSync AI — Invoice generated free at globalsync-ai.com", 20, 275);
    }

    return doc;
  };

  // Export A4 PDF locally
  const handleExportPDF = () => {
    if (!isPaid && invoiceCount >= 3) {
      fireUpgradeModalTrigger("invoice_limit");
      toast.warning("Monthly limit reached (3 invoices). Upgrade to GlobalSync Pro for unlimited generations!", {
        action: {
          label: "Upgrade",
          onClick: () => handleSimulatedUpgrade()
        }
      });
      return;
    }

    setIsGenerating(true);
    try {
      const doc = buildPDF();
      doc.save(`${invoiceNumber}.pdf`);
      incrementInvoiceCount();
      fireInvoiceAnalytics("export");
      toast.success("PDF invoice generated successfully!");
    } catch {
      toast.error("Failed to generate PDF invoice.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Send PDF via Resend API
  const handleSendInvoiceEmail = async (e) => {
    e.preventDefault();
    if (!clientEmail.trim() || !clientName.trim()) {
      toast.error("Please provide client name and email address.");
      return;
    }
    if (!senderEmail.trim()) {
      toast.error("Please provide your sender email address.");
      return;
    }

    if (!isPaid && invoiceCount >= 3) {
      fireUpgradeModalTrigger("invoice_limit");
      toast.warning("Monthly limit reached (3 invoices). Upgrade to GlobalSync Pro to send invoices directly!", {
        action: {
          label: "Upgrade",
          onClick: () => handleSimulatedUpgrade()
        }
      });
      return;
    }

    setIsSending(true);
    try {
      const doc = buildPDF();
      // Generate base64 string
      const pdfBase64 = doc.output("datauristring").split(",")[1];

      await axios.post(`${API}/invoices/send`, {
        sender_email: senderEmail.trim(),
        client_email: clientEmail.trim(),
        client_name: clientName.trim(),
        invoice_number: invoiceNumber,
        pdf_base64: pdfBase64
      });

      incrementInvoiceCount();
      fireInvoiceAnalytics("email");
      toast.success(`Invoice ${invoiceNumber} successfully dispatched to ${clientEmail}!`);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to dispatch invoice email.";
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative flex flex-col justify-between">
      <SEOHead
        rawTitle="Interactive Invoice Builder | GlobalSync AI"
        description="Create, preview, and download multi-currency invoices with built-in self-employment tax calculations. Free clean PDF export."
        canonical="/invoice"
      />

      {/* Luxury Background Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10" />
        <div 
          className="absolute inset-0 opacity-[0.10] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        />
      </div>

      <SiteNav />

      <main className="flex-1 max-w-6xl mx-auto px-6 pt-36 pb-12 w-full z-10 space-y-6">
        
        {/* Title */}
        <header className="mb-4 text-center sm:text-left">
          <p className="text-gem-gold text-sm font-semibold mb-2">Live Preview Active</p>
          <div className="inline-flex items-center gap-1.5 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-medium mb-3 border border-gem-gold/25">
            <FileText className="w-3.5 h-3.5" /> Multi-Currency PDF builder
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gem-beige leading-tight mb-2">
            Invoice Intelligence Builder
          </h1>
          <p className="text-sm text-gem-sage max-w-2xl leading-relaxed">
            Create professional multi-currency invoices, automatically calculate US self-employment tax deductions, and export print-ready PDFs.
          </p>
        </header>

        {/* Builder Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-5">
            <h2 className="font-heading font-bold text-gem-beige text-lg flex items-center gap-2 border-b border-white/5 pb-4">
              <Calculator className="w-5 h-5 text-gem-gold" /> Invoice Details
            </h2>

            <div className="space-y-4">
              {/* Sender Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Your Name/Business</label>
                  <input
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="e.g. John Doe Consulting"
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Your Email</label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
              </div>

              {/* Country select for tax calculations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Your Country (Tax Rate)</label>
                  <select
                    value={senderCountry}
                    onChange={e => setSenderCountry(e.target.value)}
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45 cursor-pointer font-bold"
                  >
                    <option value="US">United States (SE Tax 15.3%)</option>
                    <option value="UK">United Kingdom (Advisory Only)</option>
                    <option value="CA">Canada (Advisory Only)</option>
                    <option value="DE">Germany (Advisory Only)</option>
                    <option value="IN">India (Advisory Only)</option>
                    <option value="PK">Pakistan (Advisory Only)</option>
                    <option value="AE">United Arab Emirates (No Income Tax)</option>
                  </select>
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase flex items-center justify-between">
                    <span>Branding Logo</span>
                    {!isPaid && <span className="text-[9px] font-bold text-gem-gold bg-gem-gold/10 px-1 rounded uppercase">Pro</span>}
                  </label>
                  {isPaid ? (
                    customLogo ? (
                      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 h-10">
                        <span className="text-[10px] text-gem-sage truncate font-bold">Logo Uploaded</span>
                        <button type="button" onClick={handleRemoveLogo} className="text-red-400 hover:text-red-300 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-1.5 h-10 border border-dashed border-white/10 rounded-xl bg-white/5 text-gem-sage hover:border-gem-gold/30 hover:bg-white/10 transition-all cursor-pointer text-xs font-bold">
                        <Upload className="w-4 h-4 text-gem-gold" /> Upload Image
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={handleSimulatedUpgrade}
                      className="w-full h-10 border border-dashed border-white/5 rounded-xl bg-black/20 text-white/35 flex items-center justify-center gap-1.5 text-xs font-semibold opacity-60"
                    >
                      Upload custom logo (🔒 Pro Only)
                    </button>
                  )}
                </div>
              </div>

              {/* Client Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-4">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Client Name</label>
                  <input
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Client Company Ltd."
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="finance@client.com"
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
              </div>

              {/* Project line items details */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Work Description</label>
                  <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Freelance Consulting Sync Services"
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Hours Worked</label>
                    <input
                      type="number"
                      value={hours}
                      onChange={e => setHours(Math.max(1, Number(e.target.value)))}
                      className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                    />
                  </div>
                  <div>
                    <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Rate per Hour</label>
                    <input
                      type="number"
                      value={rate}
                      onChange={e => setRate(Math.max(1, Number(e.target.value)))}
                      className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                    />
                  </div>
                </div>
              </div>

              {/* Currency conversions */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Billing Currency</label>
                  <select
                    value={billingCurrency}
                    onChange={e => setBillingCurrency(e.target.value)}
                    className="w-full h-10 px-2 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none cursor-pointer"
                  >
                    {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Client Currency (FX)</label>
                  <select
                    value={payoutCurrency}
                    onChange={e => setPayoutCurrency(e.target.value)}
                    className="w-full h-10 px-2 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none cursor-pointer font-semibold"
                  >
                    {POPULAR_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-4">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={e => setIssueDate(e.target.value)}
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1 block uppercase">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                  />
                </div>
              </div>
            </div>

            {/* Action dispatch buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isGenerating}
                className="flex-1 h-11 bg-white/5 border border-white/10 text-gem-sage hover:text-gem-beige hover:border-gem-gold/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              
              <button
                type="button"
                onClick={handleSendInvoiceEmail}
                disabled={isSending || !clientEmail}
                className="flex-1 h-11 btn-gradient text-gem-forest font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Invoice</>}
              </button>
            </div>
          </div>

          {/* Right Column: Live Document Preview Panel */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="font-heading font-bold text-gem-beige text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-gem-gold" /> Live Preview
              </h2>
              {!isPaid && (
                <span className="text-[10px] text-gem-sage font-bold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded">
                  {invoiceCount}/3 Free Invoices
                </span>
              )}
            </div>

            {/* Simulated Light-Background A4 Sheet Paper */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-800 text-xs shadow-inner min-h-[520px] flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-none">INVOICE</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">{invoiceNumber || "INV-2026-0001"}</p>
                    <div className="text-[9px] text-slate-400 mt-2 space-y-0.5">
                      <div>Issued: {issueDate}</div>
                      <div>Due: {dueDate}</div>
                    </div>
                  </div>

                  {/* Logo or Branded block */}
                  <div className="shrink-0">
                    {isPaid && customLogo ? (
                      <img src={customLogo} alt="Business logo" className="max-h-11 w-auto rounded object-contain border border-slate-100" />
                    ) : (
                      <div className="h-10 w-24 border border-dashed border-slate-200 rounded flex items-center justify-center text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                        {senderName ? senderName.substring(0, 3) : "GS"} Logo
                      </div>
                    )}
                  </div>
                </div>

                {/* Sender & Receiver Address Details */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-[10px]">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1 text-[9px] uppercase tracking-wider">From:</span>
                    <div className="font-bold text-slate-800">{senderName || "Your Business Name"}</div>
                    <div className="text-slate-500">{senderEmail || "your@email.com"}</div>
                    <div className="text-slate-400">{senderCountry}</div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1 text-[9px] uppercase tracking-wider">Bill To:</span>
                    <div className="font-bold text-slate-800">{clientName || "Client Business"}</div>
                    <div className="text-slate-500">{clientEmail || "client@email.com"}</div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-[10px] shadow-sm">
                  <div className="bg-slate-100 font-bold text-slate-800 flex border-b border-slate-200 py-1.5 px-3">
                    <span className="flex-1">Description</span>
                    <span className="w-12 text-center">Hours</span>
                    <span className="w-20 text-right">Rate</span>
                    <span className="w-20 text-right">Total</span>
                  </div>
                  <div className="flex py-2 px-3 text-slate-700 bg-white font-medium">
                    <span className="flex-1 truncate">{description || "Freelance Consultation Sync Services"}</span>
                    <span className="w-12 text-center">{hours}</span>
                    <span className="w-20 text-right">{rate.toFixed(2)} {billingCurrency}</span>
                    <span className="w-20 text-right">{grossEarnings.toFixed(2)} {billingCurrency}</span>
                  </div>
                </div>

                {/* Subtotal & Taxes breakdown */}
                <div className="border-t border-slate-200 pt-4 flex justify-end">
                  <div className="w-64 space-y-1.5 text-right font-medium text-[10px]">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span>{grossEarnings.toFixed(2)} {billingCurrency}</span>
                    </div>

                    {senderCountry === "US" ? (
                      <>
                        <div className="flex justify-between text-slate-500">
                          <span>SE Tax (15.3% of 92.35%):</span>
                          <span className="text-rose-600">-{seTaxDeduction.toFixed(2)} {billingCurrency}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                          <span>Estimated Net Earnings:</span>
                          <span>{estimatedNet.toFixed(2)} {billingCurrency}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-[9px] text-slate-400 italic text-left pt-1 border-t border-slate-100">
                        * Non-US tax rate advisory terms apply.
                      </div>
                    )}
                  </div>
                </div>

                {/* Currency Conversion Display */}
                {billingCurrency !== payoutCurrency && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] space-y-1 text-slate-700 shadow-sm">
                    <div className="font-bold text-slate-800">Exchange Rate Conversion (Live)</div>
                    <div className="text-[9px] text-slate-500">
                      Converted at: 1 {billingCurrency} = {liveRate.toFixed(4)} {payoutCurrency}
                    </div>
                    <div className="font-bold text-indigo-700 mt-1">
                      Target Payout: {convertedGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {payoutCurrency}
                    </div>
                  </div>
                )}

              </div>

              {/* Watermark branding (Removed for Paid) */}
              {!isPaid && (
                <div className="pt-6 border-t border-slate-200 text-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Powered by GlobalSync AI
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      <SiteFooter />
    </div>
  );
}

// Simple loader icon
function Loader2({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
