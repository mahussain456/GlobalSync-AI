import React from "react";
import { createRoot } from "react-dom/client";
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

// The build snapshot remains useful without JavaScript. Replace it on startup;
// never hydrate a hand-built or time-dependent DOM as if it were a React tree.
// Remove only snapshot-owned head tags before Helmet takes ownership.
document.head.querySelectorAll('[data-rh="true"], [data-react-helmet="true"]').forEach(node => node.remove());
rootElement.replaceChildren();
createRoot(rootElement).render(app);
