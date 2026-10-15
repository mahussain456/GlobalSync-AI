#!/usr/bin/env node
// Checks every link in the built site.
//   Internal: must resolve to a built page, a public file, or a redirect in vercel.json.
//   External: requested over HTTP (HEAD, then GET), 2xx/3xx passes.
// Usage: node scripts/check-links.js [--internal-only]
const fs = require("fs");
const path = require("path");

const BUILD = path.join(__dirname, "..", "build");
const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "vercel.json"), "utf8"));
const redirects = vercel.redirects.map((r) => new RegExp("^" + r.source.replace(/:\w+\*/g, ".*").replace(/:\w+/g, "[^/]+") + "$"));
const rewrites = (vercel.rewrites || []).map((r) => new RegExp("^" + r.source.replace(/:\w+\*/g, ".*").replace(/:\w+/g, "[^/]+") + "$"));

const pages = [];
const walk = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) pages.push(p); } };
walk(BUILD);

const internal = new Map(), external = new Map();
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const from = "/" + path.relative(BUILD, file).split(path.sep).join("/").replace(/index\.html$/, "");
  for (const m of html.matchAll(/\b(?:href|src)="([^"#][^"]*)"/g)) {
    const url = m[1].replace(/&amp;/g, "&");
    if (/^(mailto|tel|javascript|data|blob):/.test(url)) continue;
    const bucket = /^https?:\/\//.test(url) ? external : url.startsWith("/") ? internal : null;
    if (!bucket) continue;
    if (!bucket.has(url)) bucket.set(url, from);
  }
}

const resolves = (url) => {
  const p = decodeURI(url.split(/[?#]/)[0]).replace(/\/$/, "") || "/";
  if (p === "/") return true;
  const f = path.join(BUILD, p);
  if (fs.existsSync(path.join(f, "index.html")) || (fs.existsSync(f) && fs.statSync(f).isFile()) || fs.existsSync(f + ".html")) return true;
  if (p.startsWith("/api/") || p.startsWith("/team/")) return true; // serverless / SPA rewrite
  return redirects.some((r) => r.test(p)) || rewrites.some((r) => r.test(p));
};

const brokenInternal = [...internal].filter(([u]) => !resolves(u));
console.log(`Pages scanned: ${pages.length}. Internal links: ${internal.size}, broken: ${brokenInternal.length}`);
brokenInternal.forEach(([u, from]) => console.log(`  BROKEN ${u}  (first seen on ${from})`));

if (process.argv.includes("--internal-only")) process.exit(brokenInternal.length ? 1 : 0);

(async () => {
  const bad = [];
  const list = [...external.keys()].filter((u) => !/fonts\.(googleapis|gstatic)\.com\/?$/.test(u));
  for (const url of list) {
    let status = 0;
    for (const method of ["HEAD", "GET"]) {
      try {
        const res = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(12000), headers: { "user-agent": "Mozilla/5.0 GlobalSync link check" } });
        status = res.status;
        if (status < 400) break;
      } catch (e) { status = e.name === "TimeoutError" ? "timeout" : "error"; }
    }
    if (!(status >= 200 && status < 400)) bad.push([url, status, external.get(url)]);
  }
  console.log(`External links: ${list.length}, failing: ${bad.length}`);
  bad.forEach(([u, s, from]) => console.log(`  ${s} ${u}  (on ${from})`));
  process.exit(brokenInternal.length ? 1 : 0);
})();
