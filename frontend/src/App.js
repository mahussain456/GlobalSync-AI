import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
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
import NewsPage from "@/pages/NewsPage";
import CityPairPage from "@/pages/CityPairPage";
import CurrencyPairPage from "@/pages/CurrencyPairPage";
import NotFoundPage from "@/pages/NotFoundPage";
import CookieConsent from "@/components/CookieConsent";

function App() {
  return (
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
          <Route path="/news" element={<NewsPage />} />
          <Route path="/time/:pair" element={<CityPairPage />} />
          <Route path="/currency/:pair" element={<CurrencyPairPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" richColors />
        <CookieConsent />
      </BrowserRouter>
    </div>
  );
}

export default App;
