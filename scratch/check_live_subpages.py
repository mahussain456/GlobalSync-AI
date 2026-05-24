import urllib.request
import re

pages = [
    "",
    "/about",
    "/press",
    "/global-meeting-planner-for-remote-teams",
    "/us-india-meeting-time",
    "/blog",
    "/contact"
]

base_url = "https://www.globalsync-ai.com"

for page in pages:
    url = base_url + page
    print(f"\n--- Fetching {url} ---")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            
        titles = re.findall(r"<title[^>]*>.*?</title>", content, re.IGNORECASE)
        descs = re.findall(r'<meta[^>]+name=["\']description["\'][^>]*>', content, re.IGNORECASE)
        
        print(f"Titles found ({len(titles)}):")
        for t in titles:
            print(f"  {t}")
            
        print(f"Descriptions found ({len(descs)}):")
        for d in descs:
            print(f"  {d}")
            
    except Exception as e:
        print(f"Error fetching {url}: {e}")
