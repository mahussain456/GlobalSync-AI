import "@/App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import CookieConsent from "@/components/CookieConsent";

// Code-splitting: Lazy load pages to improve initial JS bundle size
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const TimeZoneConverterPage = lazy(() => import("@/pages/TimeZoneConverterPage"));
const CurrencyConverterPage = lazy(() => import("@/pages/CurrencyConverterPage"));
const MeetingPlannerPage = lazy(() => import("@/pages/MeetingPlannerPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/TermsOfServicePage"));
const EditorialPolicyPage = lazy(() => import("@/pages/EditorialPolicyPage"));
const MethodologyPage = lazy(() => import("@/pages/MethodologyPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage"));
const CityPairPage = lazy(() => import("@/pages/CityPairPage"));
const CurrencyPairPage = lazy(() => import("@/pages/CurrencyPairPage"));
const DataSourcesPage = lazy(() => import("@/pages/DataSourcesPage"));
const FreelancerRateConverterPage = lazy(() => import("@/pages/FreelancerRateConverterPage"));
const RemoteTeamsMeetingPlannerPage = lazy(() => import("@/pages/RemoteTeamsMeetingPlannerPage"));
const USIndiaMeetingTimePage = lazy(() => import("@/pages/USIndiaMeetingTimePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-[#050816] flex items-center justify-center text-white/50">Loading GlobalSync AI...</div>}>
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
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/freelancer-rate-converter" element={<FreelancerRateConverterPage />} />
            <Route path="/global-meeting-planner-for-remote-teams" element={<RemoteTeamsMeetingPlannerPage />} />
            <Route path="/us-india-meeting-time" element={<USIndiaMeetingTimePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
        <CookieConsent />
      </BrowserRouter>
    </div>
  );
}

export default App;
