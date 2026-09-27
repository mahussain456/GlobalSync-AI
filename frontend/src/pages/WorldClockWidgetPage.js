import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Download, Sunrise, PhoneCall, History, Globe2, Move, Feather,
  ShieldCheck, Keyboard, Monitor, CheckCircle2, Mail,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getStaticPageSEO } from "@/lib/seo";
import { fireAnalyticsEvent, markToolUsed } from "@/lib/analytics";
// Release details live in a data file so the macOS build job (.github/workflows/world-clock-mac.yml)
// can fill in the "mac" entry automatically when it publishes a new .dmg.
import RELEASE from "@/data/worldClockRelease.json";

const FEATURES = [
  { icon: Sunrise, title: "A live sky for every city", body: "Each clock shows its city's real sky right now: dawn, daylight, golden hour or a starry night. Thirteen cities have hand-drawn landmarks, from the Golden Gate to the Charminar." },
  { icon: PhoneCall, title: "Know when to call", body: "Every city carries a plain status: Good time to call, Starts in 40m, After hours, Asleep or Weekend. Weekends follow each country's working week." },
  { icon: History, title: "Preview any time", body: "Drag the timeline to see all four clocks at a future time, then copy the times as a ready-to-paste list for your invite. It returns to live time after 90 seconds." },
  { icon: Globe2, title: "Four clocks, 160+ cities", body: "Search by city, country or airport code, plus every official time zone. Star your home city, reorder by dragging, and add a teammate's name to any clock." },
  { icon: Move, title: "Stays out of your way", body: "Grab it anywhere and put it anywhere. It snaps to screen edges, remembers its spot across monitors, and hides or reappears with Ctrl+Alt+Shift+W (⌘⌥⇧W on Mac)." },
  { icon: Feather, title: "Tiny, private, offline", body: "A 1.6 MB download that uses your system's own browser engine. No account, no tracking, and nothing leaves your computer. It works with no internet connection." },
];

const SHOTS = [
  { src: "/world-clock/world-clock-forest.webp", w: 780, h: 1066, title: "Forest theme", caption: "Four cities at a glance, each under its own live sky." },
  { src: "/world-clock/world-clock-paper.webp", w: 769, h: 1047, title: "Paper theme", caption: "A light theme styled after the GlobalSync paper atlas." },
  { src: "/world-clock/world-clock-preview.webp", w: 780, h: 1124, title: "Time preview", caption: "Drag the timeline to preview any time, then copy it." },
  { src: "/world-clock/world-clock-add.webp", w: 780, h: 1469, title: "Add a city", caption: "Search 160+ cities by name, country or airport code." },
  { src: "/world-clock/world-clock-landmarks.webp", w: 780, h: 1066, title: "Landmark skylines", caption: "Dubai, Hyderabad, Singapore and Sydney after dark." },
  { src: "/world-clock/world-clock-compact.webp", w: 780, h: 858, title: "Compact layout", caption: "A slimmer layout for smaller screens." },
  { src: "/world-clock/world-clock-settings.webp", w: 780, h: 1648, title: "Settings", caption: "Theme, 12/24h, size, work hours, opacity and launch at login." },
];

const FAQS = [
  { q: "Is the GlobalSync World Clock free?", a: "Yes. The widget is free to download and use, with no account, trial or ads." },
  { q: "Does the widget collect any data?", a: "No. Your cities and settings are stored only on your computer. The widget sends no analytics and makes no network requests. The only exception is opening globalsync-ai.com when you click its link." },
  { q: "Why does Windows or macOS show a warning the first time?", a: "The app is new and not yet code-signed, so Windows SmartScreen may say \"Windows protected your PC\". Choose More info, then Run anyway. On a Mac, right-click the app, choose Open, then Open again. You only need to do this once." },
  { q: "How many clocks can I show?", a: "Up to four at a time. To swap one, hover over a clock, press ×, then add another. Removing a clock can be undone." },
  { q: "Does it handle daylight saving time?", a: "Yes. Times come from the official IANA time zone database built into your operating system, so daylight saving changes and half-hour offsets such as India (UTC+5:30) are always correct." },
  { q: "How do I move or hide it?", a: "Drag any part of the widget except the buttons and the timeline. Press Ctrl+Alt+Shift+W (⌘⌥⇧W on Mac), or use the tray or menu-bar icon, to hide it or bring it back." },
  { q: "How do I uninstall it?", a: "Windows: Settings → Apps → Installed apps → GlobalSync World Clock → Uninstall. Mac: quit it from the menu-bar icon and drag the app from Applications to the Trash." },
];

function WindowsLogo(props) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path fill="currentColor" d="M3 5.1 10.4 4v7.1H3zm8.3-1.2L21 2.5v8.6h-9.7zM3 12.9h7.4V20L3 18.9zm8.3 0H21v8.6l-9.7-1.4z" /></svg>;
}
function AppleLogo(props) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...props}><path fill="currentColor" d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.3-.1 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3.1-2.5 1-1.4 1.3-2.8 1.4-2.9-.1 0-2.7-1-2.8-4zM13.9 5.2c.7-.8 1.1-2 1-3.2-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 2.9-1.4z" /></svg>;
}

/** Best guess at the visitor's desktop OS. Runs after hydration so the prerendered HTML stays neutral. */
function detectOS() {
  if (typeof navigator === "undefined") return "unknown";
  const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
  const ua = navigator.userAgent || "";
  if (/android|iphone|ipod/i.test(ua) || (/Mac/i.test(p) && navigator.maxTouchPoints > 1)) return "mobile";
  if (/Win/i.test(p) || /Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(p) || /Mac OS X/i.test(ua)) return "mac";
  return "unknown";
}

function trackDownload(os) {
  fireAnalyticsEvent("widget_download", { os, version: RELEASE.version });
  markToolUsed("world_clock_widget");
}

function PrimaryDownload({ os }) {
  const base = "inline-flex items-center justify-center gap-3 min-h-[56px] rounded-[5px] px-[25px] font-semibold transition-all duration-300";
  if (os === "mobile") {
    return (
      <a href="#download" className={`${base} bg-ink text-paper hover:bg-pine`}>
        <Download className="w-4 h-4" /> See download options
      </a>
    );
  }
  if (os === "mac" && !RELEASE.mac.href) {
    return (
      <div className="flex flex-col gap-2">
        <a href="#download" className={`${base} bg-ink text-paper hover:bg-pine`}>
          <AppleLogo className="w-5 h-5" /> macOS version: coming soon
        </a>
        <a href={RELEASE.windows.href} download onClick={() => trackDownload("windows")} className="text-sm text-pine underline underline-offset-4 hover:text-ink">
          Or download for Windows ({RELEASE.windows.size})
        </a>
      </div>
    );
  }
  const isMac = os === "mac";
  const href = isMac ? RELEASE.mac.href : RELEASE.windows.href;
  return (
    <a href={href} download onClick={() => trackDownload(isMac ? "mac" : "windows")}
      className={`${base} bg-ink text-paper hover:bg-pine hover:-translate-y-[3px] group`}>
      {isMac ? <AppleLogo className="w-5 h-5" /> : <WindowsLogo className="w-5 h-5" />}
      Download for {isMac ? "macOS" : "Windows"}
      <span className="text-paper/70 font-normal text-sm whitespace-nowrap">{isMac ? RELEASE.mac.size : RELEASE.windows.size}</span>
      <Download className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-[2px]" />
    </a>
  );
}

function PlatformCard({ kind, highlighted }) {
  const isMac = kind === "mac";
  const r = isMac ? RELEASE.mac : RELEASE.windows;
  const Logo = isMac ? AppleLogo : WindowsLogo;
  return (
    <div className={`bg-surface rounded-xl border p-7 flex flex-col ${highlighted ? "border-pine ring-1 ring-pine/30" : "border-line"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Logo className="w-7 h-7 text-ink" />
          <h3 className="text-xl font-semibold text-ink">{isMac ? "macOS" : "Windows"}</h3>
        </div>
        {highlighted && <span className="text-xs font-semibold text-pine bg-wash rounded-full px-3 py-1">Your system</span>}
      </div>
      <p className="text-quiet text-sm mb-1">{r.requires}</p>
      <p className="text-quiet text-sm mb-6">Version {RELEASE.version} · {r.size}</p>
      {r.href ? (
        <a href={r.href} download onClick={() => trackDownload(kind)}
          className="mt-auto inline-flex items-center justify-center gap-2 min-h-[48px] rounded-[5px] bg-ink text-paper font-semibold px-5 hover:bg-pine transition-colors">
          <Download className="w-4 h-4" /> Download {isMac ? ".dmg" : ".exe"} installer
        </a>
      ) : (
        <div className="mt-auto">
          <span className="flex items-center justify-center min-h-[48px] rounded-[5px] border border-line text-quiet font-semibold px-5 bg-wash" aria-disabled="true">
            Coming soon
          </span>
          <a href="mailto:hello@globalsync-ai.com?subject=Tell%20me%20when%20the%20Mac%20world%20clock%20is%20ready"
            className="mt-3 inline-flex items-center gap-2 text-sm text-pine underline underline-offset-4 hover:text-ink">
            <Mail className="w-4 h-4" /> Email me when it's ready
          </a>
        </div>
      )}
      {r.href && r.sha256 && (
        <details className="mt-4 text-xs text-quiet">
          <summary className="cursor-pointer hover:text-ink">Verify the download (SHA-256)</summary>
          <code className="block mt-2 break-all bg-wash rounded-md p-2 text-ink">{r.sha256}</code>
        </details>
      )}
    </div>
  );
}

export default function WorldClockWidgetPage() {
  const seo = getStaticPageSEO("world-clock-widget", { faqs: FAQS });
  const [os, setOS] = useState("unknown");
  useEffect(() => { setOS(detectOS()); }, []);

  const appSchema = {
    "@type": "SoftwareApplication",
    name: "GlobalSync World Clock",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Windows 10, Windows 11, macOS 11+",
    softwareVersion: RELEASE.version,
    datePublished: RELEASE.date,
    fileSize: RELEASE.windows.size,
    downloadUrl: `https://www.globalsync-ai.com${RELEASE.windows.href}`,
    screenshot: `https://www.globalsync-ai.com${SHOTS[0].src}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "GlobalSync AI", url: "https://www.globalsync-ai.com" },
  };

  return (
    <div className="min-h-screen bg-paper text-ink relative">
      <SEOHead {...seo} structuredData={[...(seo.structuredData || []), appSchema]} />
      <SiteNav />

      <main id="main-content">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-16 grid md:grid-cols-[1.05fr_.95fr] gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-pine mb-5">Free desktop app · Windows &amp; Mac</p>
            <h1 className="mb-6">A world clock that lives on <em className="text-pine">your desktop.</em></h1>
            <p className="text-lg text-quiet max-w-xl mb-8">
              Keep four cities in view, see at a glance who's at work and who's asleep, and preview any meeting time before you send the invite. It's a small, calm widget that stays in the corner of your screen.
            </p>
            <div className="flex flex-wrap items-start gap-4">
              <PrimaryDownload os={os} />
              <a href="#features" className="inline-flex items-center gap-2 min-h-[56px] px-2 font-semibold text-ink border-b border-transparent hover:border-ink transition-colors">
                See what it does <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-quiet">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pine" /> {RELEASE.windows.size} download</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pine" /> No account</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pine" /> Works offline</li>
            </ul>
            {os === "mobile" && (
              <p className="mt-6 text-sm text-quiet bg-wash rounded-lg px-4 py-3 max-w-xl">
                The widget runs on Windows and Mac computers. On your phone, use the free <Link to="/meeting-planner" className="text-pine underline">meeting planner</Link> instead.
              </p>
            )}
          </div>
          <div className="relative flex justify-center">
            <div aria-hidden="true" className="absolute inset-x-6 top-10 bottom-4 rounded-[28px] bg-wash" />
            <img src={SHOTS[0].src} width={390} height={533} alt="GlobalSync World Clock widget showing San Francisco, New York, London and Tokyo with live skies and call status"
              className="relative w-[340px] sm:w-[390px] h-auto" fetchPriority="high" />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-line scroll-mt-28">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl md:text-5xl mb-3">Everything a remote team checks, <em className="text-pine">in one glance.</em></h2>
            <p className="text-quiet max-w-2xl mb-12">Made for people whose teammates, clients and family are spread across time zones.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="border-t border-line pt-6">
                  <Icon className="w-6 h-6 text-pine mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
                  <p className="text-quiet text-[15px]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section id="screenshots" className="bg-wash border-y border-line scroll-mt-28">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl md:text-5xl mb-3">See it on the desktop</h2>
            <p className="text-quiet max-w-2xl mb-10">Real screenshots from the app. Two themes, a compact layout, and a sky for every hour.</p>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
              {SHOTS.map(s => (
                <figure key={s.src} className="snap-start shrink-0 w-[260px] md:w-auto">
                  <div className="bg-surface border border-line rounded-xl p-3 flex items-start justify-center h-[380px] overflow-hidden">
                    <img src={s.src} width={s.w / 2} height={s.h / 2} alt={`${s.title}: ${s.caption}`} loading="lazy" decoding="async"
                      className="max-h-full w-auto object-contain object-top" />
                  </div>
                  <figcaption className="mt-3">
                    <span className="block font-semibold text-ink text-sm">{s.title}</span>
                    <span className="block text-quiet text-sm">{s.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Download */}
        <section id="download" className="scroll-mt-28">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl md:text-5xl mb-3">Download</h2>
            <p className="text-quiet max-w-2xl mb-10">Free. Version {RELEASE.version}, released {new Date(RELEASE.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.</p>
            <div className="grid md:grid-cols-2 gap-6 mb-14">
              <PlatformCard kind="windows" highlighted={os === "windows"} />
              <PlatformCard kind="mac" highlighted={os === "mac"} />
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><WindowsLogo className="w-5 h-5" /> Install on Windows</h3>
                <ol className="space-y-3 text-quiet list-decimal pl-5">
                  <li>Open <strong className="text-ink font-semibold">GlobalSync-World-Clock-{RELEASE.version}-Windows-Setup.exe</strong> from your Downloads folder.</li>
                  <li>If SmartScreen says "Windows protected your PC", choose <strong className="text-ink font-semibold">More info → Run anyway</strong>. The app isn't code-signed yet.</li>
                  <li>Follow the installer (<strong className="text-ink font-semibold">Next → Install → Finish</strong>). It installs for your user only, so no admin rights are needed.</li>
                  <li>The widget appears at the top-right of your screen. Drag it wherever you like.</li>
                </ol>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><AppleLogo className="w-5 h-5" /> Install on macOS</h3>
                <ol className="space-y-3 text-quiet list-decimal pl-5">
                  <li>Open the <strong className="text-ink font-semibold">.dmg</strong> and drag <strong className="text-ink font-semibold">GlobalSync World Clock</strong> into Applications.</li>
                  <li>The first time, <strong className="text-ink font-semibold">right-click the app → Open → Open</strong>. macOS asks once for apps that aren't notarized yet.</li>
                  <li>The widget opens on your desktop and its icon sits in the menu bar. It doesn't take up space in the Dock.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1fr_1.4fr] gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-3">Details</h2>
              <p className="text-quiet">The technical facts in one place.</p>
            </div>
            <dl className="divide-y divide-line border-y border-line">
              {[
                ["Version", `${RELEASE.version} (${RELEASE.date})`],
                ["Download size", `Windows ${RELEASE.windows.size} · macOS ${RELEASE.mac.size}`],
                ["Platforms", `${RELEASE.windows.requires} · ${RELEASE.mac.requires}`],
                ["Price", "Free, no account required"],
                ["Privacy", "Settings stay on your device. No analytics, no network requests."],
                ["Time data", "IANA time zone database built into your operating system; daylight saving handled automatically"],
                ["Show / hide shortcut", "Ctrl + Alt + Shift + W · ⌘ ⌥ ⇧ W on Mac"],
                ["Built with", "Tauri (a native shell using your system's browser engine), so it's small and light on memory"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] sm:grid-cols-[190px_1fr] gap-4 py-3.5 text-sm">
                  <dt className="font-semibold text-ink">{k}</dt>
                  <dd className="text-quiet">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-[1fr_1.4fr] gap-12">
            <h2 className="text-3xl md:text-4xl">Questions</h2>
            <div className="divide-y divide-line border-y border-line">
              {FAQS.map(f => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-ink">
                    {f.q}
                    <span aria-hidden="true" className="text-pine text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-quiet mt-3 text-[15px]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-wash border-t border-line">
          <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2">Planning with more than four cities?</h2>
              <p className="text-quiet">The free web meeting planner finds a shared time for your whole team. It works in your browser, with no signup.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#download" className="inline-flex items-center gap-2 min-h-[52px] rounded-[5px] border border-ink px-5 font-semibold hover:bg-surface transition-colors">
                <Monitor className="w-4 h-4" /> Get the widget
              </a>
              <Link to="/meeting-planner" className="inline-flex items-center gap-2 min-h-[52px] rounded-[5px] bg-ink text-paper px-5 font-semibold hover:bg-pine transition-colors">
                Open the meeting planner <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <p className="max-w-6xl mx-auto px-6 pb-10 text-xs text-quiet flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-pine" /> Downloads are served from globalsync-ai.com. <Keyboard className="w-4 h-4 text-pine ml-2" /> Show or hide it any time with Ctrl+Alt+Shift+W.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
