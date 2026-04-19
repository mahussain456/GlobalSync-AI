from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os, logging, pytz, requests, uuid, json, re, asyncio, resend
import httpx
import xml.etree.ElementTree as ET
from difflib import SequenceMatcher
from datetime import datetime, timezone, timedelta, date
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
api_router = APIRouter(prefix="/api")

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
resend.api_key = os.environ.get('RESEND_API_KEY', '')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', '')
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# ============= City Timezone Mapping =============
CITY_TIMEZONES = {
    "New York": "America/New_York", "NYC": "America/New_York", "New York City": "America/New_York",
    "Los Angeles": "America/Los_Angeles", "LA": "America/Los_Angeles",
    "San Francisco": "America/Los_Angeles", "SF": "America/Los_Angeles",
    "Chicago": "America/Chicago", "Houston": "America/Chicago", "Dallas": "America/Chicago",
    "Denver": "America/Denver", "Phoenix": "America/Phoenix", "Seattle": "America/Los_Angeles",
    "Boston": "America/New_York", "Miami": "America/New_York", "Atlanta": "America/New_York",
    "Toronto": "America/Toronto", "Vancouver": "America/Vancouver", "Montreal": "America/Toronto",
    "Mexico City": "America/Mexico_City",
    "São Paulo": "America/Sao_Paulo", "Sao Paulo": "America/Sao_Paulo",
    "Buenos Aires": "America/Argentina/Buenos_Aires",
    "Bogota": "America/Bogota", "Lima": "America/Lima", "Santiago": "America/Santiago",
    "London": "Europe/London", "Paris": "Europe/Paris", "Berlin": "Europe/Berlin",
    "Amsterdam": "Europe/Amsterdam", "Madrid": "Europe/Madrid", "Rome": "Europe/Rome",
    "Milan": "Europe/Rome", "Zurich": "Europe/Zurich", "Geneva": "Europe/Zurich",
    "Stockholm": "Europe/Stockholm", "Oslo": "Europe/Oslo", "Copenhagen": "Europe/Copenhagen",
    "Helsinki": "Europe/Helsinki", "Warsaw": "Europe/Warsaw", "Prague": "Europe/Prague",
    "Vienna": "Europe/Vienna", "Brussels": "Europe/Brussels", "Lisbon": "Europe/Lisbon",
    "Athens": "Europe/Athens", "Moscow": "Europe/Moscow", "Istanbul": "Europe/Istanbul",
    "Dubai": "Asia/Dubai", "Abu Dhabi": "Asia/Dubai", "Riyadh": "Asia/Riyadh",
    "Doha": "Asia/Qatar", "Kuwait City": "Asia/Kuwait",
    "Cairo": "Africa/Cairo", "Nairobi": "Africa/Nairobi", "Lagos": "Africa/Lagos",
    "Johannesburg": "Africa/Johannesburg", "Cape Town": "Africa/Johannesburg", "Casablanca": "Africa/Casablanca",
    "Mumbai": "Asia/Kolkata", "Delhi": "Asia/Kolkata", "New Delhi": "Asia/Kolkata",
    "Bangalore": "Asia/Kolkata", "Bengaluru": "Asia/Kolkata", "Kolkata": "Asia/Kolkata",
    "Chennai": "Asia/Kolkata", "Hyderabad": "Asia/Kolkata", "India": "Asia/Kolkata",
    "Karachi": "Asia/Karachi", "Islamabad": "Asia/Karachi", "Lahore": "Asia/Karachi",
    "Dhaka": "Asia/Dhaka", "Colombo": "Asia/Colombo", "Kathmandu": "Asia/Kathmandu",
    "Singapore": "Asia/Singapore", "Kuala Lumpur": "Asia/Kuala_Lumpur", "KL": "Asia/Kuala_Lumpur",
    "Jakarta": "Asia/Jakarta", "Bangkok": "Asia/Bangkok",
    "Ho Chi Minh City": "Asia/Ho_Chi_Minh", "Hanoi": "Asia/Bangkok", "Manila": "Asia/Manila",
    "Hong Kong": "Asia/Hong_Kong", "HK": "Asia/Hong_Kong", "Taipei": "Asia/Taipei",
    "Seoul": "Asia/Seoul", "Tokyo": "Asia/Tokyo", "Osaka": "Asia/Tokyo",
    "Beijing": "Asia/Shanghai", "Shanghai": "Asia/Shanghai", "Guangzhou": "Asia/Shanghai",
    "Shenzhen": "Asia/Shanghai", "Chengdu": "Asia/Shanghai",
    "Almaty": "Asia/Almaty", "Tashkent": "Asia/Tashkent",
    "Sydney": "Australia/Sydney", "Melbourne": "Australia/Melbourne",
    "Brisbane": "Australia/Brisbane", "Perth": "Australia/Perth",
    "Auckland": "Pacific/Auckland", "Honolulu": "Pacific/Honolulu", "Hawaii": "Pacific/Honolulu",
}

POPULAR_CITIES = [
    "New York", "San Francisco", "Chicago", "Toronto", "London", "Paris", "Berlin",
    "Amsterdam", "Dubai", "Mumbai", "Bangalore", "Singapore", "Tokyo", "Seoul",
    "Hong Kong", "Shanghai", "Bangkok", "Sydney", "Auckland", "São Paulo",
    "Mexico City", "Los Angeles", "Seattle", "Moscow", "Istanbul",
]

def get_timezone(city_name: str) -> Optional[str]:
    city_clean = city_name.strip()
    if city_clean in CITY_TIMEZONES:
        return CITY_TIMEZONES[city_clean]
    title_case = city_clean.title()
    if title_case in CITY_TIMEZONES:
        return CITY_TIMEZONES[title_case]
    city_lower = city_clean.lower()
    for k, v in CITY_TIMEZONES.items():
        if k.lower() == city_lower:
            return v
    for k, v in CITY_TIMEZONES.items():
        if city_lower in k.lower() or k.lower() in city_lower:
            return v
    return None

def parse_time_str(time_str: str) -> tuple:
    s = time_str.strip().upper()
    m = re.match(r'^(\d{1,2})\s*(AM|PM)$', s)
    if m:
        h = int(m.group(1))
        if m.group(2) == 'PM' and h != 12: h += 12
        elif m.group(2) == 'AM' and h == 12: h = 0
        return h, 0
    m = re.match(r'^(\d{1,2}):(\d{2})\s*(AM|PM)?$', s)
    if m:
        h, mi = int(m.group(1)), int(m.group(2))
        if m.group(3) == 'PM' and h != 12: h += 12
        elif m.group(3) == 'AM' and h == 12: h = 0
        return h, mi
    return None, None

# ============= Models =============
class AIParseRequest(BaseModel):
    query: str

class CityTimeRequest(BaseModel):
    cities: List[str]
    from_time: Optional[str] = None
    from_city: Optional[str] = None

class MeetingOverlapRequest(BaseModel):
    cities: List[str]
    business_start_hour: int = 9
    business_end_hour: int = 17

class HistoryCreate(BaseModel):
    query: str
    intent: str
    result: Dict[str, Any]

# ============= AI Parsing =============
AI_SYSTEM_PROMPT = """You are an intent classification assistant for a time zone and currency app.
Parse the user's query and return ONLY valid JSON with no markdown, no code blocks, no explanation.

Possible intents: "time_conversion", "meeting_overlap", "currency_conversion"

For time_conversion:
{"intent": "time_conversion", "entities": {"from_city": "New York", "to_cities": ["Mumbai"], "time": "3 PM"}}
Notes: from_city is null if no source city. time is null for current time.

For meeting_overlap:
{"intent": "meeting_overlap", "entities": {"cities": ["San Francisco", "London", "Dubai"]}}

For currency_conversion:
{"intent": "currency_conversion", "entities": {"amount": 750.0, "from_currency": "USD", "to_currency": "GBP"}}
Notes: amount defaults to 1 if not mentioned. Use standard 3-letter ISO codes.
Map: dollar/USD, pound/GBP, euro/EUR, rupee/INR, yen/JPY, yuan/CNY, won/KRW

IMPORTANT - Supported currency codes (worldwide, 160+ currencies via ExchangeRate-API):
Common: USD, EUR, GBP, JPY, CHF, CNY, CAD, AUD, NZD
Asia: INR, PKR, BDT, LKR, NPR, SGD, HKD, KRW, MYR, THB, IDR, PHP, VND, TWD, MMK, KZT
Middle East: AED, SAR, QAR, KWD, BHD, OMR, JOD, ILS
Africa: ZAR, NGN, EGP, KES, GHS, MAD, ETB, TZS
Americas: MXN, BRL, ARS, CLP, COP, PEN
Europe: SEK, NOK, DKK, PLN, CZK, HUF, RON, BGN, TRY, RUB, UAH, ISK
Use the exact 3-letter ISO code. For Pakistani Rupee use PKR, UAE Dirham use AED, Saudi Riyal use SAR.

Examples:
"What time is 3 PM in New York in India?" -> {"intent": "time_conversion", "entities": {"from_city": "New York", "to_cities": ["Mumbai"], "time": "3 PM"}}
"Best meeting time for SF, London, Dubai" -> {"intent": "meeting_overlap", "entities": {"cities": ["San Francisco", "London", "Dubai"]}}
"Convert 750 USD to GBP" -> {"intent": "currency_conversion", "entities": {"amount": 750.0, "from_currency": "USD", "to_currency": "GBP"}}
"Time in Tokyo" -> {"intent": "time_conversion", "entities": {"from_city": null, "to_cities": ["Tokyo"], "time": null}}
"Dollar to euro" -> {"intent": "currency_conversion", "entities": {"amount": 1.0, "from_currency": "USD", "to_currency": "EUR"}}
"""

def fallback_parse(query: str) -> dict:
    q_upper = query.upper()
    q_lower = query.lower()
    currency_match = re.search(r'(\d+\.?\d*)\s*([A-Z]{3})\s+(?:TO|IN)\s+([A-Z]{3})', q_upper)
    if currency_match:
        return {"intent": "currency_conversion", "entities": {
            "amount": float(currency_match.group(1)),
            "from_currency": currency_match.group(2),
            "to_currency": currency_match.group(3)
        }}
    currency_codes = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY", "SGD"]
    codes_found = [c for c in currency_codes if c in q_upper]
    if codes_found and any(k in q_lower for k in ['convert', 'rate', 'exchange', ' to ']):
        return {"intent": "currency_conversion", "entities": {
            "amount": 1.0,
            "from_currency": codes_found[0],
            "to_currency": codes_found[1] if len(codes_found) > 1 else "EUR"
        }}
    if any(k in q_lower for k in ['meeting', 'overlap', 'best time', 'schedule', 'call']):
        return {"intent": "meeting_overlap", "entities": {"cities": []}}
    return {"intent": "time_conversion", "entities": {"from_city": None, "to_cities": [], "time": None}}

# ============= Routes =============
@api_router.get("/")
async def root():
    return {"message": "GlobalSync AI API", "version": "1.0"}

@api_router.get("/timezone/cities")
def list_popular_cities():
    return {"cities": POPULAR_CITIES}

@api_router.post("/ai/parse")
@limiter.limit("20/minute")
async def parse_ai_intent(req: AIParseRequest, request: Request):
    if not EMERGENT_LLM_KEY:
        return fallback_parse(req.query)
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=AI_SYSTEM_PROMPT
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        response = await chat.send_message(UserMessage(text=req.query))
        clean = response.strip()
        if clean.startswith("```"):
            clean = re.sub(r"```(?:json)?\n?", "", clean).strip().rstrip("`").strip()
        result = json.loads(clean)
        return result
    except Exception as e:
        logger.error(f"AI parse error: {e}")
        return fallback_parse(req.query)

@api_router.post("/timezone/convert")
def get_city_times(req: CityTimeRequest):
    cities_data = []
    now_utc = datetime.now(pytz.utc)
    today = now_utc.date()
    for city_name in req.cities:
        tz_name = get_timezone(city_name)
        if not tz_name:
            cities_data.append({"name": city_name, "error": f"City '{city_name}' not found", "known": False})
            continue
        tz = pytz.timezone(tz_name)
        if req.from_time and req.from_city:
            from_tz_name = get_timezone(req.from_city)
            if not from_tz_name:
                continue
            h, m = parse_time_str(req.from_time)
            if h is None:
                continue
            from_tz = pytz.timezone(from_tz_name)
            local_dt = from_tz.localize(datetime(today.year, today.month, today.day, h, m))
            target_dt = local_dt.astimezone(tz)
        else:
            target_dt = now_utc.astimezone(tz)
        offset_secs = target_dt.utcoffset().total_seconds()
        offset_h = int(offset_secs // 3600)
        offset_m = int((abs(offset_secs) % 3600) // 60)
        utc_offset = f"UTC{offset_h:+d}" if offset_m == 0 else f"UTC{offset_h:+d}:{offset_m:02d}"
        is_biz = 9 <= target_dt.hour < 17
        cities_data.append({
            "name": city_name,
            "timezone_id": tz_name,
            "utc_offset": utc_offset,
            "current_time": target_dt.strftime("%H:%M"),
            "current_time_12h": target_dt.strftime("%I:%M %p").lstrip('0') or "12:00 AM",
            "date": target_dt.strftime("%a, %b %d"),
            "timezone_abbr": target_dt.strftime("%Z"),
            "is_business_hours": is_biz,
            "hour": target_dt.hour,
            "minute": target_dt.minute,
            "known": True
        })
    result = {"cities": cities_data}
    if req.from_time and req.from_city:
        result["conversion_note"] = f"Showing {req.from_time} {req.from_city} time in each city"
    return result

@api_router.post("/timezone/overlap")
def get_meeting_overlap(req: MeetingOverlapRequest):
    now_utc = datetime.now(pytz.utc)
    today = now_utc.date()
    city_ranges = []
    city_details = []
    for city_name in req.cities:
        tz_name = get_timezone(city_name)
        if not tz_name:
            city_details.append({"name": city_name, "error": "City not found", "known": False})
            continue
        tz = pytz.timezone(tz_name)
        local_start = tz.localize(datetime(today.year, today.month, today.day, req.business_start_hour, 0))
        local_end = tz.localize(datetime(today.year, today.month, today.day, req.business_end_hour, 0))
        utc_start = local_start.astimezone(pytz.utc)
        utc_end = local_end.astimezone(pytz.utc)
        start_dec = utc_start.hour + utc_start.minute / 60
        end_dec = utc_end.hour + utc_end.minute / 60
        if end_dec <= start_dec:
            end_dec += 24
        city_ranges.append((city_name, utc_start, utc_end, tz, start_dec, end_dec))
        city_details.append({
            "name": city_name,
            "timezone_id": tz_name,
            "timezone_abbr": local_start.strftime("%Z"),
            "business_hours_local": f"{local_start.strftime('%I:%M %p')} - {local_end.strftime('%I:%M %p')}",
            "business_start_utc_dec": start_dec,
            "business_end_utc_dec": end_dec,
            "known": True
        })
    if len(city_ranges) < 2:
        return {"has_overlap": False, "message": "Add at least 2 valid cities to find overlap", "city_details": city_details}
    overlap_start_utc = max(r[1] for r in city_ranges)
    overlap_end_utc = min(r[2] for r in city_ranges)
    has_overlap = overlap_start_utc < overlap_end_utc
    if not has_overlap:
        return {"has_overlap": False, "message": "No overlapping business hours between these cities", "city_details": city_details}
    overlap_mins = int((overlap_end_utc - overlap_start_utc).total_seconds() / 60)
    best_utc = overlap_start_utc + timedelta(minutes=max(30, overlap_mins // 4))
    overlap_start_dec = overlap_start_utc.hour + overlap_start_utc.minute / 60
    overlap_end_dec = overlap_end_utc.hour + overlap_end_utc.minute / 60
    for detail in city_details:
        if not detail.get("known"):
            continue
        tz = pytz.timezone(detail["timezone_id"])
        detail["overlap_start_local"] = overlap_start_utc.astimezone(tz).strftime("%I:%M %p %Z")
        detail["overlap_end_local"] = overlap_end_utc.astimezone(tz).strftime("%I:%M %p %Z")
        detail["best_time_local"] = best_utc.astimezone(tz).strftime("%I:%M %p %Z")
    return {
        "has_overlap": True,
        "overlap_start_utc": overlap_start_utc.strftime("%H:%M UTC"),
        "overlap_end_utc": overlap_end_utc.strftime("%H:%M UTC"),
        "overlap_start_dec": overlap_start_dec,
        "overlap_end_dec": overlap_end_dec,
        "overlap_duration_hours": round(overlap_mins / 60, 1),
        "best_meeting_time_utc": best_utc.strftime("%H:%M UTC"),
        "city_details": city_details,
        "message": f"{overlap_mins // 60}h {overlap_mins % 60}m overlap window found"
    }

# Frankfurter API supported currencies (ECB-based) — used only for 7-day trend
FRANKFURTER_SUPPORTED = {
    "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK",
    "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "ISK",
    "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PLN",
    "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR"
}

# ExchangeRate-API base URL — free, no key, 160+ currencies worldwide
EXCHANGERATE_BASE = "https://open.exchangerate-api.com/v6/latest"

@api_router.get("/currency/supported")
def get_supported_currencies():
    return {"currencies": sorted(list(FRANKFURTER_SUPPORTED))}

@api_router.get("/currency/convert")
@limiter.limit("60/minute")
def convert_currency(
    request: Request,
    amount: float = Query(default=1.0),
    from_currency: str = Query(...),
    to_currency: str = Query(...)
):
    from_c = from_currency.strip().upper()
    to_c = to_currency.strip().upper()
    if from_c == to_c:
        raise HTTPException(status_code=422, detail="From and to currencies must be different")
    try:
        url = f"{EXCHANGERATE_BASE}/{from_c}"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 404:
            raise HTTPException(status_code=422, detail=f"Currency '{from_c}' not recognised")
        resp.raise_for_status()
        data = resp.json()
        if data.get("result") != "success":
            raise HTTPException(status_code=422, detail="Currency data unavailable from provider")
        rates = data.get("rates", {})  # ExchangeRate-API free tier uses 'rates' key
        rate = rates.get(to_c)
        if rate is None:
            raise HTTPException(status_code=422, detail=f"Currency '{to_c}' not recognised")
        converted = round(amount * rate, 6)
        last_update = data.get("time_last_update_utc", "")[:16]
        return {
            "from": from_c, "to": to_c,
            "amount": amount, "rate": rate, "converted": converted,
            "date": last_update,
            "formatted": f"{amount:,.2f} {from_c} = {converted:,.4f} {to_c}"
        }
    except HTTPException:
        raise
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Currency API timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Currency API is temporarily unreachable.")
    except Exception as e:
        logger.error(f"Currency convert error: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error fetching exchange rate")

@api_router.get("/currency/trend")
@limiter.limit("30/minute")
def get_currency_trend(request: Request, from_currency: str = Query(...), to_currency: str = Query(...)):
    from_c = from_currency.strip().upper()
    to_c = to_currency.strip().upper()
    # Trend data only available for ECB-supported pairs via Frankfurter
    if from_c not in FRANKFURTER_SUPPORTED or to_c not in FRANKFURTER_SUPPORTED:
        return {
            "from": from_c, "to": to_c,
            "trend": [], "available": False,
            "message": f"7-day trend not available for {from_c}/{to_c} (ECB data covers 31 major currencies)"
        }
    try:
        end_date = date.today()
        start_date = end_date - timedelta(days=14)
        url = f"https://api.frankfurter.app/{start_date}..{end_date}?from={from_c}&to={to_c}"
        resp = requests.get(url, timeout=10)
        if resp.status_code in (400, 404):
            return {"from": from_c, "to": to_c, "trend": [], "available": False, "message": "Trend data not available for this pair"}
        resp.raise_for_status()
        data = resp.json()
        trend = [{"date": d, "rate": rates.get(to_c, 0)}
                 for d, rates in sorted(data.get("rates", {}).items())]
        trend = trend[-7:]
        if not trend:
            return {"from": from_c, "to": to_c, "trend": [], "available": False, "message": "No recent trend data available"}
        change = ((trend[-1]["rate"] - trend[0]["rate"]) / trend[0]["rate"]) * 100 if len(trend) > 1 else 0
        return {
            "from": from_currency.upper(), "to": to_currency.upper(),
            "trend": trend,
            "min_rate": min(t["rate"] for t in trend),
            "max_rate": max(t["rate"] for t in trend),
            "change_percent": round(change, 2),
            "current_rate": trend[-1]["rate"] if trend else 0,
            "available": True
        }
    except HTTPException:
        raise
    except requests.exceptions.Timeout:
        return {"from": from_c, "to": to_c, "trend": [], "available": False, "message": "Trend API timed out"}
    except requests.exceptions.ConnectionError:
        return {"from": from_c, "to": to_c, "trend": [], "available": False, "message": "Trend API unreachable"}
    except Exception as e:
        logger.error(f"Currency trend error: {e}")
        return {"from": from_c, "to": to_c, "trend": [], "available": False, "message": "Trend data unavailable"}

@api_router.post("/history")
async def save_history_item(req: HistoryCreate):
    item = {
        "id": str(uuid.uuid4()),
        "query": req.query, "intent": req.intent, "result": req.result,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.history.insert_one({**item, "_id": item["id"]})
    return item

@api_router.get("/history")
async def get_history_items():
    items = await db.history.find({}, {"_id": 0}).sort("timestamp", -1).to_list(30)
    return {"items": items}

@api_router.delete("/history")
async def clear_history():
    await db.history.delete_many({})
    return {"message": "History cleared"}

class UserLead(BaseModel):
    name: str
    email: str

@api_router.post("/users/register")
async def register_user(req: UserLead):
    email_lower = req.email.strip().lower()
    existing = await db.users.find_one({"email": email_lower})
    if not existing:
        user = {
            "id": str(uuid.uuid4()),
            "name": req.name.strip(),
            "email": email_lower,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one({**user, "_id": user["id"]})
        return {"success": True, "message": "Welcome to GlobalSync AI!", "new": True}
    return {"success": True, "message": "Welcome back!", "new": False}

@api_router.get("/users")
async def get_all_users():
    users = await db.users.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    return {"total": len(users), "users": users}

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str = "General Feedback"
    message: str

@api_router.post("/contact")
@limiter.limit("5/minute")
async def submit_contact(form: ContactForm, request: Request):
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
      <div style="background:#1d4ed8;padding:16px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:18px;">New Contact Form Submission — GlobalSync AI</h2>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px;"><strong>Name</strong></td><td style="padding:8px 0;color:#111827;font-size:14px;">{form.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;"><strong>Email</strong></td><td style="padding:8px 0;font-size:14px;"><a href="mailto:{form.email}" style="color:#1d4ed8;">{form.email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;"><strong>Subject</strong></td><td style="padding:8px 0;color:#111827;font-size:14px;">{form.subject}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Message:</p>
        <p style="color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px;">{form.message}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">Sent from globalsync-ai.com contact form</p>
      </div>
    </div>
    """
    try:
        params = {
            "from": "GlobalSync AI <onboarding@resend.dev>",
            "to": [CONTACT_RECIPIENT_EMAIL],
            "reply_to": form.email,
            "subject": f"[GlobalSync AI] {form.subject} — from {form.name}",
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact email sent: {result}")
        return {"success": True, "message": "Message sent! We'll get back to you within 48 hours."}
    except Exception as e:
        logger.error(f"Contact email failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message. Please try again.")

# ============= News Feed System =============

RSS_FEEDS = {
    "ai-news": [
        {"url": "https://techcrunch.com/category/artificial-intelligence/feed/", "source": "TechCrunch"},
        {"url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "source": "The Verge"},
    ],
    "tips": [
        {"url": "https://bensbites.beehiiv.com/feed", "source": "Ben's Bites"},
        {"url": "https://zapier.com/blog/feeds/latest/", "source": "Zapier"},
    ],
}

# In-memory cache (per feed type)
news_cache: Dict[str, Any] = {
    "ai-news": {"articles": [], "last_updated": None, "updating": False},
    "tips":    {"articles": [], "last_updated": None, "updating": False},
}

def _title_similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

def _parse_rss_date(date_str: str) -> Optional[datetime]:
    if not date_str:
        return None
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%a, %d %b %Y %H:%M:%S GMT",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f%z",
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            continue
    return None

async def _fetch_rss(url: str, source_name: str) -> List[Dict]:
    """Fetch and parse a single RSS/Atom feed. Returns articles from last 48h."""
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "GlobalSyncAI/1.0 (+https://globalsync-ai.com)"})
            resp.raise_for_status()
            content = resp.text

        root = ET.fromstring(content)
        ATOM = "http://www.w3.org/2005/Atom"
        # Detect Atom vs RSS
        items = root.findall(f".//{{{ATOM}}}entry") or root.findall(".//item")
        cutoff = datetime.now(timezone.utc) - timedelta(hours=48)
        articles = []

        for item in items:
            def g(tags):
                for t in tags:
                    el = item.find(t)
                    if el is not None and el.text:
                        return el.text.strip()
                return ""

            title = g([f"{{{ATOM}}}title", "title"])
            link  = g([f"{{{ATOM}}}id", "link", "guid"])
            # Atom <link href="...">
            if not link:
                le = item.find(f"{{{ATOM}}}link")
                if le is not None:
                    link = le.get("href", "")
            desc  = g([f"{{{ATOM}}}summary", f"{{{ATOM}}}content", "description", "summary"])
            pub   = g([f"{{{ATOM}}}published", f"{{{ATOM}}}updated", "pubDate", "published"])

            if not title or not link:
                continue

            parsed_dt = _parse_rss_date(pub)
            if parsed_dt and parsed_dt < cutoff:
                continue  # skip older than 48h

            clean_desc = re.sub(r"<[^>]+>", " ", desc).strip()[:600]
            clean_desc = re.sub(r"\s+", " ", clean_desc)

            articles.append({
                "title": title,
                "link": link,
                "description": clean_desc,
                "source": source_name,
                "pubDate": pub,
                "pubDateParsed": parsed_dt.isoformat() if parsed_dt else datetime.now(timezone.utc).isoformat(),
            })

        return articles[:12]
    except Exception as e:
        logger.error(f"RSS fetch error [{source_name}] {url}: {e}")
        return []

async def _summarize(title: str, description: str) -> str:
    """Call Claude Haiku to produce a 2-sentence remote-worker-focused summary."""
    if not EMERGENT_LLM_KEY:
        return (description[:220] + "…") if len(description) > 220 else description

    desc_text = description.strip() if description and len(description.strip()) > 30 else ""
    context_block = f"Description: {desc_text[:400]}" if desc_text else "No description available — summarize from the title only."

    system = (
        "You are an editor for GlobalSync AI — a tool used by remote workers, "
        "freelancers, and global teams. Produce only the final output; no meta-commentary, "
        "no preamble, no markdown formatting."
    )
    user = (
        "Write a 2-sentence summary of this article. "
        "Focus on what it means for remote workers, freelancers, or people working across time zones. "
        "Be specific and practical. Return ONLY the 2 sentences — no intro, no markdown, no headers.\n"
        f"Title: {title}\n"
        f"{context_block}"
    )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system,
        ).with_model("anthropic", "claude-haiku-4-5-20251001")
        response = await chat.send_message(UserMessage(text=user))
        # Strip any markdown formatting that slips through
        clean = re.sub(r'\*\*([^*]+)\*\*', r'\1', response)
        clean = re.sub(r'\*([^*]+)\*', r'\1', clean)
        clean = re.sub(r'^#+\s*', '', clean, flags=re.MULTILINE)
        clean = re.sub(r'\s+', ' ', clean).strip()
        return clean
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        return (description[:220] + "…") if len(description) > 220 else description

async def _refresh_feed_type(feed_type: str) -> List[Dict]:
    """Fetch all feeds for a type, deduplicate, sort, summarize. Returns up to 6 articles."""
    feeds = RSS_FEEDS.get(feed_type, [])

    # Fetch all feeds concurrently
    tasks = [_fetch_rss(f["url"], f["source"]) for f in feeds]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    all_articles: List[Dict] = []
    for r in results:
        if isinstance(r, list):
            all_articles.extend(r)

    # Sort newest first
    def _sort_key(a):
        try:
            return datetime.fromisoformat(a["pubDateParsed"])
        except Exception:
            return datetime.min.replace(tzinfo=timezone.utc)
    all_articles.sort(key=_sort_key, reverse=True)

    # Dedup: max 3 per source, skip titles ≥80% similar to already-kept ones
    kept_titles: List[str] = []
    source_counts: Dict[str, int] = {}
    deduped: List[Dict] = []

    for art in all_articles:
        if any(_title_similarity(art["title"], t) >= 0.8 for t in kept_titles):
            continue
        src = art["source"]
        if source_counts.get(src, 0) >= 3:
            continue
        kept_titles.append(art["title"])
        source_counts[src] = source_counts.get(src, 0) + 1
        deduped.append(art)
        if len(deduped) >= 6:
            break

    # Summarize concurrently with a semaphore (max 3 parallel Claude calls)
    sem = asyncio.Semaphore(3)
    async def _summarize_guarded(art: Dict) -> Dict:
        async with sem:
            summary = await _summarize(art["title"], art.get("description", ""))
            return {**art, "aiSummary": summary, "feedType": feed_type}

    summarized_raw = await asyncio.gather(
        *[_summarize_guarded(a) for a in deduped],
        return_exceptions=True,
    )
    final: List[Dict] = []
    for i, item in enumerate(summarized_raw):
        if isinstance(item, Exception):
            final.append({**deduped[i], "aiSummary": deduped[i].get("description", "")[:220], "feedType": feed_type})
        else:
            final.append(item)
    return final

async def _refresh_all_news():
    """Refresh both feed types. Called on startup and every 2 hours."""
    logger.info("News feed refresh started…")
    for feed_type in ["ai-news", "tips"]:
        if news_cache[feed_type]["updating"]:
            continue
        news_cache[feed_type]["updating"] = True
        try:
            articles = await _refresh_feed_type(feed_type)
            if articles:
                news_cache[feed_type]["articles"] = articles
            news_cache[feed_type]["last_updated"] = datetime.now(timezone.utc).isoformat()
        except Exception as e:
            logger.error(f"News refresh error [{feed_type}]: {e}")
        finally:
            news_cache[feed_type]["updating"] = False
    logger.info("News feed refresh complete.")

async def _news_background_loop():
    """Run refresh on startup, then every 2 hours."""
    await _refresh_all_news()
    while True:
        await asyncio.sleep(2 * 60 * 60)
        await _refresh_all_news()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(_news_background_loop())

@api_router.get("/news/feed")
async def get_news_feed():
    """Return in-memory cached AI news and tips articles."""
    return {
        "ai_news": {
            "articles": news_cache["ai-news"]["articles"],
            "last_updated": news_cache["ai-news"]["last_updated"],
            "updating": news_cache["ai-news"]["updating"],
        },
        "tips": {
            "articles": news_cache["tips"]["articles"],
            "last_updated": news_cache["tips"]["last_updated"],
            "updating": news_cache["tips"]["updating"],
        },
        "server_time": datetime.now(timezone.utc).isoformat(),
    }

import sys as _sys

@api_router.get("/build-info")
async def api_build_info():
    """
    Deployment diagnostic endpoint.
    Returns build metadata, react-snap status, and per-route pre-rendered titles.
    Cache-Control: no-store so Cloudflare never serves a stale response.
    """
    BUILD_DIR = Path("/app/frontend/build")
    SKIP_DIRS = {"static", "media", "fonts", "icons"}

    def extract_title(html_path: Path):
        if not html_path.exists():
            return None
        try:
            content = html_path.read_text(encoding="utf-8", errors="ignore")
            m = re.search(r"<title>([^<]*)</title>", content, re.IGNORECASE)
            return m.group(1) if m else None
        except Exception:
            return None

    def count_pages(directory: Path, is_root: bool = True) -> int:
        count = 1 if is_root and (directory / "index.html").exists() else 0
        try:
            for entry in directory.iterdir():
                if entry.is_dir() and entry.name not in SKIP_DIRS:
                    if (entry / "index.html").exists():
                        count += 1
                    count += count_pages(entry, is_root=False)
        except Exception:
            pass
        return count

    ROUTES = [
        "/",
        "/time-zone-converter",
        "/currency-converter",
        "/meeting-planner",
        "/time/new-york-to-london",
        "/currency/usd-to-inr",
        "/blog/best-free-time-zone-converter-remote-teams-2026",
        "/blog/remote-work-time-zones-productivity-guide",
        "/blog/best-currency-to-invoice-freelancers-usd-eur-gbp",
    ]

    build_info_data = None
    try:
        build_info_data = json.loads((BUILD_DIR / "BUILD_INFO.json").read_text())
    except Exception:
        pass

    per_route_titles = {}
    for route in ROUTES:
        html_path = (
            BUILD_DIR / "index.html"
            if route == "/"
            else BUILD_DIR / route.lstrip("/") / "index.html"
        )
        per_route_titles[route] = extract_title(html_path)

    payload = {
        "now": datetime.now(timezone.utc).isoformat(),
        "build_timestamp": build_info_data.get("build_timestamp") if build_info_data else None,
        "git_commit_sha": build_info_data.get("git_commit_sha") if build_info_data else None,
        "react_snap_ran": build_info_data.get("react_snap_ran") if build_info_data else None,
        "react_snap_exit_code": build_info_data.get("react_snap_exit_code") if build_info_data else None,
        "react_snap_page_count": count_pages(BUILD_DIR),
        "per_route_titles": per_route_titles,
        "server_process_argv": " ".join(_sys.argv),
        "server_script_path": str(Path(__file__).resolve()),
        "node_version": "N/A — Python FastAPI",
        "python_version": _sys.version,
    }

    from fastapi.responses import JSONResponse as _JSONResponse
    return _JSONResponse(
        content=payload,
        headers={"Cache-Control": "no-store, max-age=0"},
    )

app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
