import urllib.request
import re

url = "https://www.globalsync-ai.com/"
print(f"Fetching {url}...")

try:
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        
    titles = re.findall(r"<title[^>]*>.*?</title>", content, re.IGNORECASE)
    descs = re.findall(r'<meta[^>]+name=["\']description["\'][^>]*>', content, re.IGNORECASE)
    
    print(f"Found {len(titles)} title tags on live site:")
    for t in titles:
        print(f"  {t}")
        
    print(f"Found {len(descs)} meta description tags on live site:")
    for d in descs:
        print(f"  {d}")
        
except Exception as e:
    print(f"Error fetching: {e}")
