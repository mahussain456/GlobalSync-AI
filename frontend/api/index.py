from fastapi import FastAPI, APIRouter, HTTPException, Query, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os, logging, pytz, requests, uuid, json, re, asyncio, resend, base64, binascii, math, hashlib
from pymongo import ReturnDocument
from html import escape
import httpx
import xml.etree.ElementTree as ET
import anthropic
from difflib import SequenceMatcher
from datetime import datetime, timezone, timedelta, date
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', '')

client = None
db = None
if mongo_url and db_name:
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)


def client_ip(request: Request) -> str:
    """Real visitor IP behind Vercel's proxy (request.client is the proxy hop).

    Vercel sets x-vercel-forwarded-for / x-real-ip itself, so clients can't spoof them.
    """
    for header in ("x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"):
        value = request.headers.get(header)
        if value:
            return value.split(",")[0].strip()
    return get_remote_address(request)


# In-memory limits apply per serverless instance — a speed bump, not a wall.
# Add a Vercel Firewall rate-limit rule on /api/* for a global limit.
limiter = Limiter(key_func=client_ip)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
api_router = APIRouter(prefix="/api")

EMERGENT_LLM_KEY = os.environ.get('ANTHROPIC_API_KEY', '') or os.environ.get('EMERGENT_LLM_KEY', '')
resend.api_key = os.environ.get('RESEND_API_KEY', '')
CONTACT_RECIPIENT_EMAIL = os.environ.get('CONTACT_RECIPIENT_EMAIL', '')
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Anthropic client (lazy — only used if key available)
_anthropic_client = None
def _get_anthropic():
    global _anthropic_client
    if _anthropic_client is None and EMERGENT_LLM_KEY:
        _anthropic_client = anthropic.Anthropic(api_key=EMERGENT_LLM_KEY)
    return _anthropic_client

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

# ============= Input validation =============
EMAIL_RE = re.compile(r"^[^@\s<>\"',;]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,24}$")
CURRENCY_RE = re.compile(r"^[A-Z]{3}$")
INVOICE_NO_RE = re.compile(r"^[A-Za-z0-9_-]{1,40}$")
MAX_PDF_BYTES = 2 * 1024 * 1024


def valid_email(value: str) -> str:
    value = (value or "").strip()
    if len(value) > 254 or not EMAIL_RE.match(value):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    return value


def valid_currency(value: str) -> str:
    code = (value or "").strip().upper()
    if not CURRENCY_RE.match(code):
        raise HTTPException(status_code=422, detail="Use a 3-letter currency code, e.g. USD.")
    return code


def one_line(value: str) -> str:
    """Collapse whitespace so user text can't break email headers or layouts."""
    return re.sub(r"\s+", " ", value or "").strip()


# ============= Models =============
class AIParseRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=300)

class CityTimeRequest(BaseModel):
    cities: List[str] = Field(..., max_length=20)
    from_time: Optional[str] = Field(default=None, max_length=20)
    from_city: Optional[str] = Field(default=None, max_length=100)

class MeetingOverlapRequest(BaseModel):
    cities: List[str] = Field(..., max_length=20)
    business_start_hour: int = Field(default=9, ge=0, le=23)
    business_end_hour: int = Field(default=17, ge=1, le=23)

class HistoryCreate(BaseModel):
    query: str
    intent: str
    result: Dict[str, Any]

class TeamMemberModel(BaseModel):
    name: str = Field(..., max_length=100)
    city: str = Field(..., max_length=100)
    timezone_id: str = Field(..., max_length=64)
    utc_offset: str = Field(..., max_length=16)

class TeamCreateRequest(BaseModel):
    name: str
    members: List[TeamMemberModel]
    email: str = ""  # Legacy input accepted but never used for ownership or stored.
    opt_in: bool = False
    custom_slug: Optional[str] = None
    is_paid: bool = False

class InvoiceSendRequest(BaseModel):
    sender_email: str = Field(..., max_length=254)
    client_email: str = Field(..., max_length=254)
    client_name: str = Field(..., max_length=100)
    invoice_number: str = Field(..., max_length=40)
    # base64 of a PDF up to MAX_PDF_BYTES (4/3 expansion + slack)
    pdf_base64: str = Field(..., max_length=2_900_000)

class UpgradeCheckoutRequest(BaseModel):
    email: str
    plan_type: str
    origin: Optional[str] = None

class UpgradeWebhookSimulateRequest(BaseModel):
    email: str
    plan: str

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

ALLOWED_INTENTS = {"time_conversion", "meeting_overlap", "currency_conversion"}


def sanitize_intent(result: Any) -> Optional[dict]:
    """Keep only the shape the frontend expects — model output is untrusted (prompt injection)."""
    if not isinstance(result, dict) or result.get("intent") not in ALLOWED_INTENTS:
        return None
    ent = result.get("entities") if isinstance(result.get("entities"), dict) else {}
    short = lambda v: v.strip()[:100] if isinstance(v, str) and v.strip() else None
    cities = lambda v: [c.strip()[:100] for c in v if isinstance(c, str) and c.strip()][:10] if isinstance(v, list) else []
    if result["intent"] == "time_conversion":
        clean = {"from_city": short(ent.get("from_city")), "to_cities": cities(ent.get("to_cities")), "time": short(ent.get("time"))}
    elif result["intent"] == "meeting_overlap":
        clean = {"cities": cities(ent.get("cities"))}
    else:
        amount = ent.get("amount", 1.0)
        amount = float(amount) if isinstance(amount, (int, float)) and math.isfinite(amount) and abs(amount) <= 1e12 else 1.0
        codes = [str(ent.get(k) or "").strip().upper() for k in ("from_currency", "to_currency")]
        if not all(CURRENCY_RE.match(c) for c in codes):
            return None
        clean = {"amount": amount, "from_currency": codes[0], "to_currency": codes[1]}
    return {"intent": result["intent"], "entities": clean}


@api_router.post("/ai/parse")
@limiter.limit("20/minute;300/day")
async def parse_ai_intent(req: AIParseRequest, request: Request):
    client_ai = _get_anthropic()
    if not client_ai:
        return fallback_parse(req.query)
    try:
        msg = client_ai.messages.create(
            model="claude-haiku-4-5",
            max_tokens=256,
            system=AI_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": req.query}],
        )
        clean = msg.content[0].text.strip()
        if clean.startswith("```"):
            clean = re.sub(r"```(?:json)?\n?", "", clean).strip().rstrip("`").strip()
        return sanitize_intent(json.loads(clean)) or fallback_parse(req.query)
    except Exception as e:
        logger.error(f"AI parse error: {e}")
        return fallback_parse(req.query)

@api_router.post("/timezone/convert")
@limiter.limit("60/minute")
def get_city_times(request: Request, req: CityTimeRequest):
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
@limiter.limit("60/minute")
def get_meeting_overlap(request: Request, req: MeetingOverlapRequest):
    if req.business_end_hour <= req.business_start_hour:
        raise HTTPException(status_code=422, detail="Business hours must end after they start.")
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

FALLBACK_USD_RATES = {
    "USD": 1.0,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 156.2,
    "CHF": 0.91,
    "CNY": 7.24,
    "CAD": 1.36,
    "AUD": 1.50,
    "INR": 83.3,
    "PKR": 278.5,
    "BDT": 117.2,
    "LKR": 300.5,
    "NPR": 133.3,
    "SGD": 1.35,
    "HKD": 7.81,
    "KRW": 1360.0,
    "MYR": 4.69,
    "THB": 36.3,
    "IDR": 16000.0,
    "PHP": 58.0,
    "VND": 25400.0,
    "TWD": 32.2,
    "KZT": 443.0,
    "UZS": 12600.0,
    "MMK": 2100.0,
    "AED": 3.67,
    "SAR": 3.75,
    "QAR": 3.64,
    "KWD": 0.31,
    "BHD": 0.38,
    "OMR": 0.38,
    "JOD": 0.71,
    "ILS": 3.68,
    "ZAR": 18.2,
    "NGN": 1450.0,
    "EGP": 47.2,
    "KES": 130.0,
    "GHS": 14.5,
    "MAD": 10.0,
    "ETB": 57.0,
    "TZS": 2600.0,
    "MXN": 16.7,
    "BRL": 5.15,
    "ARS": 885.0,
    "CLP": 910.0,
    "COP": 3850.0,
    "PEN": 3.72,
    "NZD": 1.63,
    "SEK": 10.6,
    "NOK": 10.7,
    "DKK": 6.87,
    "PLN": 3.92,
    "CZK": 22.8,
    "HUF": 355.0,
    "RON": 4.58,
    "BGN": 1.80,
    "TRY": 32.2,
    "RUB": 91.0,
    "UAH": 39.5,
    "ISK": 138.0
}

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
    # codes go into upstream URLs — allow exactly three letters, nothing else
    from_c = valid_currency(from_currency)
    to_c = valid_currency(to_currency)
    if from_c == to_c:
        raise HTTPException(status_code=422, detail="From and to currencies must be different")
    if not math.isfinite(amount) or abs(amount) > 1e12:
        raise HTTPException(status_code=422, detail="Enter an amount below 1 trillion.")
    
    # Try fetching live rate
    try:
        url = f"{EXCHANGERATE_BASE}/{from_c}"
        resp = requests.get(url, timeout=3.0)
        resp.raise_for_status()
        data = resp.json()
        if data.get("result") == "success":
            rates = data.get("rates", {})
            rate = rates.get(to_c)
            if rate is not None:
                converted = round(amount * rate, 6)
                last_update = data.get("time_last_update_utc", "")[:16]
                return {
                    "from": from_c, "to": to_c,
                    "amount": amount, "rate": rate, "converted": converted,
                    "date": last_update,
                    "formatted": f"{amount:,.2f} {from_c} = {converted:,.4f} {to_c}",
                    "is_fallback": False
                }
    except Exception as e:
        logger.warning(f"Primary live currency API failed: {e}")

    # Secondary Live API: Frankfurter API (if both are supported by Frankfurter)
    if from_c in FRANKFURTER_SUPPORTED and to_c in FRANKFURTER_SUPPORTED:
        try:
            url = f"https://api.frankfurter.app/latest?from={from_c}&to={to_c}"
            resp = requests.get(url, timeout=3.0)
            resp.raise_for_status()
            data = resp.json()
            rates = data.get("rates", {})
            rate = rates.get(to_c)
            if rate is not None:
                converted = round(amount * rate, 6)
                last_update = f"{data.get('date', '')} (Frankfurter)"
                return {
                    "from": from_c, "to": to_c,
                    "amount": amount, "rate": rate, "converted": converted,
                    "date": last_update,
                    "formatted": f"{amount:,.2f} {from_c} = {converted:,.4f} {to_c}",
                    "is_fallback": False
                }
        except Exception as e:
            logger.warning(f"Secondary live currency API (Frankfurter) failed: {e}")

    # Fallback calculation
    rate_from = FALLBACK_USD_RATES.get(from_c)
    rate_to = FALLBACK_USD_RATES.get(to_c)
    
    if rate_from is None:
        rate_from = 1.0
    if rate_to is None:
        rate_to = 1.0
        
    rate = rate_to / rate_from
    converted = round(amount * rate, 6)
    last_update = "Offline Cache (Approximate)"
    
    return {
        "from": from_c, "to": to_c,
        "amount": amount, "rate": round(rate, 6), "converted": converted,
        "date": last_update,
        "formatted": f"{amount:,.2f} {from_c} = {converted:,.4f} {to_c}",
        "is_fallback": True
    }

@api_router.get("/currency/trend")
@limiter.limit("30/minute")
def get_currency_trend(request: Request, from_currency: str = Query(...), to_currency: str = Query(...)):
    from_c = valid_currency(from_currency)
    to_c = valid_currency(to_currency)
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
        resp = requests.get(url, timeout=3.0)
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
    raise HTTPException(status_code=410, detail="Query history is now stored only in your browser.")

@api_router.get("/history")
async def get_history_items():
    raise HTTPException(status_code=410, detail="Query history is now stored only in your browser.")

@api_router.delete("/history")
async def clear_history():
    raise HTTPException(status_code=410, detail="Clear query history from the History tab in your browser.")

class UserLead(BaseModel):
    name: str = Field(..., max_length=100)
    email: str = Field(..., max_length=254)

@api_router.post("/users/register")
@limiter.limit("5/minute;30/day")
async def register_user(request: Request, req: UserLead):
    email_lower = valid_email(req.email).lower()
    if db is None: return {"success": True, "message": "Welcome!", "new": True}
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
    # Fail closed until an authenticated, owner-authorized admin flow is available.
    raise HTTPException(status_code=403, detail="Authenticated administrative access is required.")

class ContactForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., max_length=254)
    subject: str = Field(default="General Feedback", max_length=150)
    message: str = Field(..., min_length=1, max_length=5000)

@api_router.post("/contact")
@limiter.limit("5/minute;20/day")
async def submit_contact(form: ContactForm, request: Request):
    reply_to = valid_email(form.email)
    # every user-supplied value is escaped: this HTML lands in the owner's inbox
    name, subject, message = escape(one_line(form.name)), escape(one_line(form.subject)), escape(form.message.strip())
    email_html = escape(reply_to, quote=True)
    html = f"""
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
      <div style="background:#1d4ed8;padding:16px 24px;border-radius:8px 8px 0 0;">
        <h2 style="color:#fff;margin:0;font-size:18px;">New Contact Form Submission — GlobalSync AI</h2>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:100px;"><strong>Name</strong></td><td style="padding:8px 0;color:#111827;font-size:14px;">{name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;"><strong>Email</strong></td><td style="padding:8px 0;font-size:14px;"><a href="mailto:{email_html}" style="color:#1d4ed8;">{email_html}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:14px;"><strong>Subject</strong></td><td style="padding:8px 0;color:#111827;font-size:14px;">{subject}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#6b7280;font-size:13px;margin:0 0 8px;">Message:</p>
        <p style="color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;background:#f9fafb;padding:12px;border-radius:6px;">{message}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#9ca3af;font-size:12px;margin:0;">Sent from globalsync-ai.com contact form</p>
      </div>
    </div>
    """
    try:
        params = {
            "from": "GlobalSync AI <onboarding@resend.dev>",
            "to": [CONTACT_RECIPIENT_EMAIL],
            "reply_to": reply_to,
            "subject": f"[GlobalSync AI] {one_line(form.subject)[:150]} — from {one_line(form.name)[:100]}",
            "html": html,
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact email sent: {result}")
        return {"success": True, "message": "Message sent! We'll get back to you within 48 hours."}
    except Exception as e:
        logger.error(f"Contact email failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message. Please try again.")

# ============= Local File Fallback Storage for Teams =============
LOCAL_TEAMS_FILE = ROOT_DIR / "local_teams.json"

def load_local_teams() -> dict:
    if not LOCAL_TEAMS_FILE.exists():
        return {}
    try:
        with open(LOCAL_TEAMS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading local teams: {e}")
        return {}

def save_local_team(team: dict):
    teams = load_local_teams()
    teams[team["slug"]] = team
    try:
        with open(LOCAL_TEAMS_FILE, "w", encoding="utf-8") as f:
            json.dump(teams, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving local team: {e}")

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

# ============= Team Endpoints =============
def public_team(team):
    """Shared pages expose display data only, never owner contact or consent."""
    result = {key: team.get(key) for key in ("slug", "name", "created_at", "is_paid")}
    result["members"] = [{key: member.get(key) for key in ("name", "city", "timezone_id", "utc_offset")} for member in team.get("members", [])]
    return result

@api_router.post("/teams")
@limiter.limit("5/minute")
async def save_or_update_team(request: Request, req: TeamCreateRequest):
    # Public links are immutable. Email addresses and browser flags are not credentials.
    if req.custom_slug or req.is_paid:
        raise HTTPException(status_code=403, detail="Custom URLs and paid workspaces are unavailable.")
    if not req.name.strip() or len(req.name.strip()) > 100 or not 1 <= len(req.members) <= 6:
        raise HTTPException(status_code=422, detail="Use a workspace name up to 100 characters and 1–6 members.")
    for member in req.members:
        if not member.name.strip() or len(member.name) > 100 or len(member.city) > 100 or member.timezone_id not in pytz.all_timezones_set:
            raise HTTPException(status_code=422, detail="Each member needs a short label and a valid time zone.")
    if db is None:
        raise HTTPException(status_code=503, detail="Workspace storage is temporarily unavailable. Please try again later.")
    slug = f"{slugify(req.name)[:60] or 'team'}-{uuid.uuid4().hex}"
    team = {
        "slug": slug, "name": req.name.strip(), "is_paid": False,
        "members": [m.dict() for m in req.members],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    # Insert only: a public caller can never replace an existing workspace.
    await db.teams.insert_one({**team, "_id": slug})
    return {"success": True, "slug": slug, "team": public_team(team)}

@api_router.get("/teams/{slug}")
@limiter.limit("60/minute")
async def get_team(slug: str, request: Request):
    if db is None:
        raise HTTPException(status_code=503, detail="Workspace storage is temporarily unavailable.")
    team = await db.teams.find_one({"slug": slug.lower().strip()}, {"_id": 0})
    if not team:
        raise HTTPException(status_code=404, detail="Team workspace not found.")
    return public_team(team)

@api_router.get("/teams/user/{email}")
async def get_user_teams(email: str):
    raise HTTPException(status_code=403, detail="Email-only workspace lookup is disabled. Open your saved workspace link.")

# ============= Local File Fallback Storage for Invoices & Webhooks =============
LOCAL_INVOICES_SEQ_FILE = ROOT_DIR / "local_invoices_seq.json"

def load_local_invoices_seq() -> dict:
    if not LOCAL_INVOICES_SEQ_FILE.exists():
        return {}
    try:
        with open(LOCAL_INVOICES_SEQ_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading local invoice sequences: {e}")
        return {}

def save_local_invoices_seq(seqs: dict):
    try:
        with open(LOCAL_INVOICES_SEQ_FILE, "w", encoding="utf-8") as f:
            json.dump(seqs, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving local invoice sequences: {e}")

def save_local_team_all(teams: dict):
    try:
        with open(LOCAL_TEAMS_FILE, "w", encoding="utf-8") as f:
            json.dump(teams, f, indent=2, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving all local teams: {e}")

# ============= Invoice & Upgrade Endpoints =============
@api_router.get("/invoices/next-number")
@limiter.limit("20/minute;200/day")
async def get_next_invoice_number(request: Request, email: str = Query(..., max_length=254)):
    email_clean = valid_email(email).lower()
    current_year = datetime.now(timezone.utc).year
    
    seq = 1
    if db is not None:
        # Store a one-way hash, never the address, and increment atomically so two
        # tabs can't get the same number.
        doc_id = f"{hashlib.sha256(email_clean.encode()).hexdigest()}-{current_year}"
        # One-time move of a counter stored under the raw address, so numbering continues.
        legacy = await db.invoices_seq.find_one_and_delete({"_id": f"{email_clean}-{current_year}"})
        if legacy:
            await db.invoices_seq.update_one({"_id": doc_id}, {"$max": {"seq": legacy.get("seq", 0)}}, upsert=True)
        doc = await db.invoices_seq.find_one_and_update(
            {"_id": doc_id},
            {"$inc": {"seq": 1}, "$setOnInsert": {"year": current_year}},
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        seq = doc["seq"]
    else:
        seqs = load_local_invoices_seq()
        key = f"{email_clean}-{current_year}"
        if key in seqs:
            seq = seqs[key] + 1
        seqs[key] = seq
        save_local_invoices_seq(seqs)
        
    invoice_number = f"INV-{current_year}-{seq:04d}"
    return {"invoice_number": invoice_number, "seq": seq}

@api_router.post("/invoices/send")
@limiter.limit("3/hour;10/day")
async def send_invoice(request: Request, req: InvoiceSendRequest):
    # This endpoint emails a file to an arbitrary address, so it is the most abusable
    # thing the API does (spam, phishing, malware). Everything is validated.
    sender = valid_email(req.sender_email)
    recipient = valid_email(req.client_email)
    invoice_no = req.invoice_number.strip()
    if not INVOICE_NO_RE.match(invoice_no):
        raise HTTPException(status_code=422, detail="Invoice numbers may use letters, digits, - and _ only.")
    try:
        pdf = base64.b64decode(req.pdf_base64, validate=True)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=422, detail="The attachment must be the generated PDF.")
    if not pdf.startswith(b"%PDF-") or len(pdf) > MAX_PDF_BYTES:
        raise HTTPException(status_code=422, detail="The attachment must be a PDF under 2 MB.")
    client_name = escape(one_line(req.client_name)) or "there"
    sender_html, invoice_html = escape(sender), escape(invoice_no)

    if resend.api_key:
        try:
            attachments = [
                {
                    "content": req.pdf_base64,
                    "filename": f"{invoice_no}.pdf",
                }
            ]

            html = f"""
            <div style="font-family:'Inter', sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f9fafb;color:#1A1A1A;border-radius:24px;border:1px solid #e5e7eb;">
              <h2 style="font-size:22px;font-weight:700;color:#0E2A1F;margin-top:0;">Invoice {invoice_html}</h2>
              <p style="font-size:15px;line-height:1.6;color:#4A4A4A;">
                Hello {client_name},
              </p>
              <p style="font-size:15px;line-height:1.6;color:#4A4A4A;">
                Please find attached invoice <strong>{invoice_html}</strong> from <strong>{sender_html}</strong>.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#4A4A4A;">
                If you have any questions, you can reply directly to this email to contact the sender.
              </p>
              <p style="font-size:12px;line-height:1.5;color:#6B7280;">
                GlobalSync delivered this on behalf of {sender_html}. We don't verify sender addresses &mdash;
                if you weren't expecting this invoice, don't open the attachment or pay it.
              </p>
              
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              
              <p style="font-size:11px;color:#9CA3AF;text-align:center;margin-bottom:0;">
                Delivered securely via GlobalSync AI Invoice Builder
              </p>
            </div>
            """
            
            params = {
                "from": "GlobalSync AI <onboarding@resend.dev>",
                "to": [recipient],
                "reply_to": sender,
                "subject": f"Invoice {invoice_no} from {sender}",
                "html": html,
                "attachments": attachments
            }

            await asyncio.to_thread(resend.Emails.send, params)
            return {"success": True, "message": f"Invoice email dispatched to {recipient}."}
        except Exception as e:
            logger.error(f"Resend error in send_invoice: {e}")
            # provider errors can include account details — never echo them to the browser
            raise HTTPException(status_code=502, detail="Email delivery failed. Download the PDF and send it from your email app.")
    else:
        logger.info("Invoice email delivery unavailable: provider is not configured")
        raise HTTPException(status_code=503, detail="Email delivery is unavailable. Download the PDF and send it using your email app.")

@api_router.post("/upgrade/checkout")
async def upgrade_checkout(req: UpgradeCheckoutRequest):
    raise HTTPException(status_code=503, detail="Pro upgrades are not currently available. No payment was collected.")

@api_router.post("/upgrade/simulate-webhook")
async def upgrade_simulate_webhook(req: UpgradeWebhookSimulateRequest):
    raise HTTPException(status_code=410, detail="Simulated billing is disabled.")

# ============= Simplified News Feed Proxy =============
RSS_FEEDS = {
    "ai_news": [
        {"url": "https://techcrunch.com/category/artificial-intelligence/feed/", "source": "TechCrunch"},
        {"url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "source": "The Verge"},
    ],
    "tips": [
        {"url": "https://zapier.com/blog/feeds/latest/", "source": "Zapier"},
        {"url": "https://www.bensbites.com/feed", "source": "Ben's Bites"},
    ]
}

def _parse_rss_date(date_str: str) -> Optional[datetime]:
    if not date_str: return None
    formats = ["%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S %Z", "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%SZ"]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            if dt.tzinfo is None: dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except: continue
    return None

async def _fetch_rss(url: str, source_name: str) -> List[Dict]:
    try:
        # Route through rss2json to prevent Vercel IPs from being blocked by publisher Cloudflare
        from urllib.parse import quote
        api_url = f"https://api.rss2json.com/v1/api.json?rss_url={quote(url)}"
        
        async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
            resp = await client.get(api_url)
            resp.raise_for_status()
            
        data = resp.json()
        if data.get("status") != "ok":
            return []
            
        articles = []
        for item in data.get("items", [])[:8]:
            title = item.get("title", "")
            link = item.get("link", "")
            desc = item.get("description", "") or item.get("content", "")
            pub = item.get("pubDate", "")
            
            if not title or not link: continue
            
            # Clean HTML
            clean_desc = re.sub(r"<[^>]+>", " ", desc).strip()
            clean_desc = re.sub(r"\s+", " ", clean_desc)
            if len(clean_desc) > 220: clean_desc = clean_desc[:220] + "…"

            parsed_dt = _parse_rss_date(pub)
            articles.append({
                "title": title, "link": link, "aiSummary": clean_desc,
                "source": source_name, "pubDateParsed": parsed_dt.isoformat() if parsed_dt else datetime.now(timezone.utc).isoformat()
            })
        return articles
    except Exception as e:
        logger.error(f"RSS fetch error {source_name}: {e}")
        return []

_news_cache = {"at": 0.0, "data": None}
NEWS_CACHE_SECONDS = 600

@api_router.get("/news/feed")
@limiter.limit("20/minute")
async def get_news_feed(request: Request):
    """Ultra-fast proxy to fetch RSS without triggering adblockers, no Anthropic used."""
    # Each uncached call fans out to 4 upstream feeds, so cache to stop amplification.
    now_ts = datetime.now(timezone.utc).timestamp()
    if _news_cache["data"] and now_ts - _news_cache["at"] < NEWS_CACHE_SECONDS:
        return _news_cache["data"]
    tasks = []
    for f in RSS_FEEDS["ai_news"]: tasks.append(_fetch_rss(f["url"], f["source"]))
    for f in RSS_FEEDS["tips"]: tasks.append(_fetch_rss(f["url"], f["source"]))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    ai_articles = []
    tips_articles = []
    
    for i, r in enumerate(results):
        if not isinstance(r, list): continue
        if i < len(RSS_FEEDS["ai_news"]): ai_articles.extend(r)
        else: tips_articles.extend(r)

    sort_fn = lambda x: x.get("pubDateParsed", "")
    ai_articles.sort(key=sort_fn, reverse=True)
    tips_articles.sort(key=sort_fn, reverse=True)

    data = {
        "ai_news": {"articles": ai_articles[:10], "last_updated": datetime.now(timezone.utc).isoformat()},
        "tips": {"articles": tips_articles[:10], "last_updated": datetime.now(timezone.utc).isoformat()}
    }
    if ai_articles or tips_articles:
        _news_cache.update(at=now_ts, data=data)
    return data

app.include_router(api_router)
# The site calls /api from its own origin, so browsers need no CORS grant at all.
# Only the listed origins (plus any in CORS_ORIGINS) may call it cross-site, and
# never with cookies. A "*" in CORS_ORIGINS is ignored on purpose.
DEFAULT_ORIGINS = ["https://www.globalsync-ai.com", "https://globalsync-ai.com"]
extra_origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip() and o.strip() != "*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=DEFAULT_ORIGINS + extra_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
