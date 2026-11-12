// Site-wide scroll reveal. Sections rise into place as they enter the viewport.
// Runs only once JavaScript is live (html.js-reveal), so the prerendered HTML and
// no-JS visitors see everything at once. Off under reduced motion.
const TARGETS = [
  ".tool-hero-head", ".tool-glass", ".tool-section", ".browse-all", ".related-tools",
  ".home-tools", ".home-tools li", ".home-guides", ".home-guides a", ".explore-more", ".faq", ".home-newsletter",
  ".prose-custom > h2", ".prose-custom > h3", ".prose-custom > p", ".prose-custom > figure", ".prose-custom > ol", ".prose-custom > ul", ".prose-custom > pre",
  "[data-testid='guide-article'] > header", "[data-testid='guide-article'] > section", "[data-testid='guide-article'] > aside",
  ".meridian-interior main > section", ".meridian-interior article > section",
].join(",");

let observer;

export function revealPage() {
  if (typeof window === "undefined" || navigator.userAgent === "ReactSnap") return;
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.remove("js-reveal"); return; }
  root.classList.add("js-reveal");
  observer ||= new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  let i = 0;
  document.querySelectorAll(TARGETS).forEach((el) => {
    if (el.hasAttribute("data-reveal")) return;
    el.setAttribute("data-reveal", "");
    // Anything already on screen settles in with a short stagger instead of waiting to scroll.
    if (el.getBoundingClientRect().top < window.innerHeight) { el.style.setProperty("--d", `${Math.min(i++ * 70, 420)}ms`); el.classList.add("in"); }
    else observer.observe(el);
  });
}

// Count a number up from zero the first time it scrolls into view.
export function countUp(el, to, { duration = 1300, suffix = "" } = {}) {
  const done = () => { el.textContent = to.toLocaleString("en-US") + suffix; };
  if (!Number.isFinite(to) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
  const start = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - start) / duration), e = 1 - Math.pow(1 - k, 4);
    el.textContent = Math.round(to * e).toLocaleString("en-US") + suffix;
    if (k < 1) requestAnimationFrame(step); else done();
  };
  requestAnimationFrame(step);
}
