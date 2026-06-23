import urllib.request
import urllib.error
import ssl
import re
import json
import time
import sys

BASE_URL = "http://localhost:3000"
if len(sys.argv) > 1:
    BASE_URL = sys.argv[1]

# SSL Context to avoid certificate validation issues in automated testing
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

ROUTES_TO_TEST = [
    {"path": "/", "name": "Landing Page", "expect_title": "GlobalSync AI", "expect_text": "Time Zone Converter"},
    {"path": "/dashboard", "name": "App Dashboard", "expect_title": "Dashboard", "expect_text": "live rates active"},
    {"path": "/time-zone-converter", "name": "Time Zone Converter", "expect_title": "Time Zone Converter", "expect_text": "World Clock"},
    {"path": "/meeting-planner", "name": "Meeting Planner", "expect_title": "Meeting Time Planner", "expect_text": "visual"},
    {"path": "/currency-converter", "name": "Currency Converter", "expect_title": "Currency Converter", "expect_text": "mid-market"},
    {"path": "/freelancer-rate-converter", "name": "Freelancer Rate Converter", "expect_title": "Freelancer Rate Calculator", "expect_text": "Hourly"},
    {"path": "/invoice", "name": "Invoice Builder", "expect_title": "Invoice", "expect_text": "Live Preview"},
    {"path": "/stripe-checkout", "name": "Stripe Simulator", "expect_title": "GlobalSync Pro", "expect_text": "card"},
    {"path": "/upgrade-success", "name": "Upgrade Success", "expect_title": "Upgrade Completed", "expect_text": "activated"},
    {"path": "/blog", "name": "Blog Home", "expect_title": "Blog", "expect_text": "Guides"},
    {"path": "/about", "name": "About Us", "expect_title": "About", "expect_text": "Team"},
    {"path": "/contact", "name": "Contact", "expect_title": "Contact", "expect_text": "touch"},
    {"path": "/privacy-policy", "name": "Privacy Policy", "expect_title": "Privacy Policy", "expect_text": "Data"},
    {"path": "/terms-of-service", "name": "Terms of Service", "expect_title": "Terms", "expect_text": "Agreement"}
]

print("=== GLOBALSYNC AI LOCAL WEBSITE AUTOMATED TEST SUITE ===")
print(f"Targeting URL: {BASE_URL}")
print("-" * 60)

results = []
all_passed = True

for route in ROUTES_TO_TEST:
    full_url = f"{BASE_URL}{route['path']}"
    print(f"Testing [{route['name']}] at {route['path']}...", end="", flush=True)
    
    start_time = time.time()
    try:
        req = urllib.request.Request(
            full_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TestCrawler/1.0'}
        )
        with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
            status = response.status
            html = response.read().decode('utf-8')
            elapsed = time.time() - start_time
            
            # Match Title tag via regex
            title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE)
            title_text = title_match.group(1) if title_match else ""
            title_ok = route["expect_title"].lower() in title_text.lower()
            
            # Verify text presence
            text_ok = route["expect_text"].lower() in html.lower()
            
            # Check Meta SEO (regex search)
            desc_match = re.search(r'<meta[^>]*name="description"[^>]*content="(.*?)"', html, re.IGNORECASE)
            if not desc_match:
                desc_match = re.search(r'<meta[^>]*content="(.*?)"[^>]*name="description"', html, re.IGNORECASE)
            desc_ok = desc_match is not None and len(desc_match.group(1)) > 0
            
            robots_match = re.search(r'<meta[^>]*name="robots"', html, re.IGNORECASE)
            robots_ok = robots_match is not None
            
            canonical_match = re.search(r'<link[^>]*rel="canonical"', html, re.IGNORECASE)
            canonical_ok = canonical_match is not None
            
            # Check for GTM script presence
            gtm_present = "googletagmanager" in html
            
            route_passed = (status == 200) and title_ok and text_ok
            
            results.append({
                "path": route["path"],
                "name": route["name"],
                "status": status,
                "elapsed_ms": int(elapsed * 1000),
                "title": title_text,
                "title_ok": title_ok,
                "text_ok": text_ok,
                "seo_meta_desc_ok": desc_ok,
                "gtm_present": gtm_present,
                "passed": route_passed
            })
            
            if route_passed:
                print(" [PASS]")
            else:
                print(" [FAIL]")
                all_passed = False
                print(f"   Reason: Status={status}, TitleMatch={title_ok} ('{title_text}'), ContentMatch={text_ok}")
                
    except urllib.error.HTTPError as e:
        elapsed = time.time() - start_time
        print(f" [FAIL] (HTTP Error {e.code})")
        results.append({
            "path": route["path"],
            "name": route["name"],
            "status": e.code,
            "elapsed_ms": int(elapsed * 1000),
            "passed": False,
            "error": str(e)
        })
        all_passed = False
    except Exception as e:
        elapsed = time.time() - start_time
        print(f" [ERROR] ({str(e)})")
        results.append({
            "path": route["path"],
            "name": route["name"],
            "status": 0,
            "elapsed_ms": int(elapsed * 1000),
            "passed": False,
            "error": str(e)
        })
        all_passed = False

print("-" * 60)
print("=== SEO AND METADATA INSPECTION ===")
for r in results:
    if "passed" in r and r["passed"]:
        print(f"• {r['name']}: SEO Description={r['seo_meta_desc_ok']}, GTM Tracker={r['gtm_present']}, Speed={r['elapsed_ms']}ms")

print("-" * 60)
if all_passed:
    print("ALL TESTS PASSED SUCCESSFULLY! The local build is stable and correctly pre-rendered.")
    sys.exit(0)
else:
    print("SOME TESTS FAILED! Review details above.")
    sys.exit(1)
