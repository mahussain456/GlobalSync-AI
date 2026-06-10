import "@/App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import CookieConsent from "@/components/CookieConsent";

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

// Static imports for pre-rendering (react-snap)
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import TimeZoneConverterPage from "@/pages/TimeZoneConverterPage";
import CurrencyConverterPage from "@/pages/CurrencyConverterPage";
import MeetingPlannerPage from "@/pages/MeetingPlannerPage";
import AdminPage from "@/pages/AdminPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import EditorialPolicyPage from "@/pages/EditorialPolicyPage";
import MethodologyPage from "@/pages/MethodologyPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import CityPairPage from "@/pages/CityPairPage";
import CurrencyPairPage from "@/pages/CurrencyPairPage";
import DataSourcesPage from "@/pages/DataSourcesPage";
import FreelancerRateConverterPage from "@/pages/FreelancerRateConverterPage";
import RemoteTeamsMeetingPlannerPage from "@/pages/RemoteTeamsMeetingPlannerPage";
import USIndiaMeetingTimePage from "@/pages/USIndiaMeetingTimePage";
import NotFoundPage from "@/pages/NotFoundPage";

import PressPage from "@/pages/PressPage";
import AuthorPage from "@/pages/AuthorPage";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
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
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" richColors />
          <CookieConsent />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;

