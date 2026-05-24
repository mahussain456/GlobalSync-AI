import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import App from "@/App";

// HelmetProvider is required for react-helmet-async (used by SEOHead).
// It must wrap the entire app so every SEOHead can register with the same context.
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

const rootElement = document.getElementById("root");

// react-snap pre-renders pages to static HTML.
// When the pre-rendered HTML is served, rootElement already has children —
// use hydrateRoot so React attaches event handlers without re-rendering.
// react-helmet-async's data-rh="true" markers ensure head tags are deduplicated
// during hydration — no more duplicate <title> / <meta> errors in Ahrefs.
if (rootElement.hasChildNodes()) {
  try {
    hydrateRoot(rootElement, app);
  } catch (e) {
    console.error("[GlobalSync] hydrateRoot failed, falling back to createRoot:", e);
    rootElement.innerHTML = "";
    createRoot(rootElement).render(app);
  }
} else {
  createRoot(rootElement).render(app);
}
