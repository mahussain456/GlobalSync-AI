import "@/App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import CookieConsent from "@/components/CookieConsent";
import SEOSingletonHeadGuard from "@/components/SEOSingletonHeadGuard";

// Global error boundary — prevents any render crash from leaving a blank screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("[GlobalSync] Render error caught by ErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#071a0e", color: "#e8d5b0", fontFamily: "Inter, sans-serif",
          textAlign: "center", padding: "2rem"
        }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h1>
          <p style={{ color: "#8a9e8a", marginBottom: "2rem" }}>
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 2rem", borderRadius: "0.75rem",
              background: "#c8a96a", color: "#071a0e",
              fontWeight: "700", border: "none", cursor: "pointer", fontSize: "1rem"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Static import for instant above-the-fold homepage rendering
import LandingPage from "@/pages/LandingPage";

// Lazy imports for all other pages to split JS bundles
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const TimeZoneConverterPage = React.lazy(() => import("@/pages/TimeZoneConverterPage"));
const CurrencyConverterPage = React.lazy(() => import("@/pages/CurrencyConverterPage"));
const MeetingPlannerPage = React.lazy(() => import("@/pages/MeetingPlannerPage"));
const AdminPage = React.lazy(() => import("@/pages/AdminPage"));
const AboutPage = React.lazy(() => import("@/pages/AboutPage"));
const ContactPage = React.lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicyPage = React.lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = React.lazy(() => import("@/pages/TermsOfServicePage"));
const EditorialPolicyPage = React.lazy(() => import("@/pages/EditorialPolicyPage"));
const MethodologyPage = React.lazy(() => import("@/pages/MethodologyPage"));
const BlogPage = React.lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = React.lazy(() => import("@/pages/BlogPostPage"));
const CityPairPage = React.lazy(() => import("@/pages/CityPairPage"));
const CurrencyPairPage = React.lazy(() => import("@/pages/CurrencyPairPage"));
const DataSourcesPage = React.lazy(() => import("@/pages/DataSourcesPage"));
const FreelancerRateConverterPage = React.lazy(() => import("@/pages/FreelancerRateConverterPage"));
const RemoteTeamsMeetingPlannerPage = React.lazy(() => import("@/pages/RemoteTeamsMeetingPlannerPage"));
const USIndiaMeetingTimePage = React.lazy(() => import("@/pages/USIndiaMeetingTimePage"));
const TeamWorkspacePage = React.lazy(() => import("@/pages/TeamWorkspacePage"));
const InvoicePage = React.lazy(() => import("@/pages/InvoicePage"));
const StripeCheckoutSimulatorPage = React.lazy(() => import("@/pages/StripeCheckoutSimulatorPage"));
const UpgradeSuccessPage = React.lazy(() => import("@/pages/UpgradeSuccessPage"));
const NotFoundPage = React.lazy(() => import("@/pages/NotFoundPage"));
const PressPage = React.lazy(() => import("@/pages/PressPage"));
const AuthorPage = React.lazy(() => import("@/pages/AuthorPage"));

const SuspenseFallback = () => (
  <div style={{ minHeight: "100vh", backgroundColor: "#071a0e" }} />
);

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <SEOSingletonHeadGuard />
          <React.Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/time-zone-converter" element={<TimeZoneConverterPage />} />
              <Route path="/currency-converter" element={<CurrencyConverterPage />} />
              <Route path="/meeting-planner" element={<MeetingPlannerPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/time/:pair" element={<CityPairPage />} />
              <Route path="/currency/:pair" element={<CurrencyPairPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/authors/:slug" element={<AuthorPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
              <Route path="/methodology" element={<MethodologyPage />} />
              <Route path="/data-sources" element={<DataSourcesPage />} />
              <Route path="/freelancer-rate-converter" element={<FreelancerRateConverterPage />} />
              <Route path="/freelancer-rate-calculator" element={<Navigate to="/freelancer-rate-converter" replace />} />
              <Route path="/global-meeting-planner-for-remote-teams" element={<RemoteTeamsMeetingPlannerPage />} />
              <Route path="/us-india-meeting-time" element={<USIndiaMeetingTimePage />} />
              <Route path="/team/:slug" element={<TeamWorkspacePage />} />
              <Route path="/invoice" element={<InvoicePage />} />
              <Route path="/stripe-checkout" element={<StripeCheckoutSimulatorPage />} />
              <Route path="/upgrade-success" element={<UpgradeSuccessPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </React.Suspense>
          <Toaster position="top-right" richColors />
          <CookieConsent />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;

