const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_CURRENCIES = [
  "USD", "EUR", "GBP", "INR", "PKR", "NGN", "BRL", "SAR", "AED", "JPY", "AUD", "CAD"
];

const TARGET_FILE = path.join(__dirname, "../src/data/prebuiltRates.json");

function fmtUtc(d) {
  return d.toUTCString().replace(/:\d{2} GMT$/, " UTC").replace(/^[A-Z][a-z]{2}, /, "");
}

function fetchRatesForBase(base) {
  return new Promise((resolve, reject) => {
    const url = `https://open.exchangerate-api.com/v6/latest/${base}`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch rates for ${base}: status ${res.statusCode}`));
        return;
      }
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function run() {
  console.log("[build-rates] Fetching build-time exchange rates...");
  const results = {};
  
  // Ensure directory exists
  const dir = path.dirname(TARGET_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load existing rates as fallback if any fetch fails
  let existingRates = {};
  if (fs.existsSync(TARGET_FILE)) {
    try {
      existingRates = JSON.parse(fs.readFileSync(TARGET_FILE, "utf8"));
    } catch (_) {}
  }

  for (const base of BASE_CURRENCIES) {
    try {
      const data = await fetchRatesForBase(base);
      if (data && data.rates) {
        const updatedUtc = data.time_last_update_utc
          ? fmtUtc(new Date(data.time_last_update_utc))
          : fmtUtc(new Date());
        
        results[base] = {
          rates: data.rates,
          updatedUtc,
          source: "exchangerate-api"
        };
        console.log(`[build-rates] Successfully fetched rates for ${base}`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn(`[build-rates] Failed to fetch rates for ${base}, using existing/fallback:`, err.message);
      if (existingRates[base]) {
        results[base] = existingRates[base];
      } else {
        // Safe hardcoded fallback if nothing else exists
        results[base] = {
          rates: { USD: 1.0, EUR: 0.92, GBP: 0.79, INR: 83.3, PKR: 278.5, NGN: 1450.0 },
          updatedUtc: fmtUtc(new Date()),
          source: "hardcoded-build-fallback"
        };
      }
    }
  }

  fs.writeFileSync(TARGET_FILE, JSON.stringify(results, null, 2), "utf8");
  console.log(`[build-rates] Prebuilt rates written to ${TARGET_FILE}`);
}

run().catch((err) => {
  console.error("[build-rates] Critical error:", err);
  process.exit(1);
});
