import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@/index.css";
import App from "@/App";

const rootElement = document.getElementById("root");

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// react-snap pre-renders pages to static HTML.
// When the pre-rendered HTML is served, rootElement already has children —
// use hydrateRoot so React attaches event handlers without re-rendering.
// In normal CSR mode (no pre-rendered HTML), use createRoot as usual.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
