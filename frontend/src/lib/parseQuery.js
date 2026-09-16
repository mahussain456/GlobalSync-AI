const KNOWN_CITIES = [
  "New York", "NYC", "New York City",
  "Los Angeles", "LA", "San Francisco", "SF",
  "Chicago", "Houston", "Dallas", "Denver", "Phoenix", "Seattle",
  "Boston", "Miami", "Atlanta", "Toronto", "Vancouver", "Montreal",
  "Mexico City", "São Paulo", "Sao Paulo", "Buenos Aires",
  "Bogota", "Lima", "Santiago", "London", "Paris", "Berlin",
  "Amsterdam", "Madrid", "Rome", "Milan", "Zurich", "Geneva",
  "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Warsaw", "Prague",
  "Vienna", "Brussels", "Lisbon", "Athens", "Moscow", "Istanbul",
  "Dubai", "Abu Dhabi", "Riyadh", "Doha", "Kuwait City",
  "Cairo", "Nairobi", "Lagos", "Johannesburg", "Cape Town", "Casablanca",
  "Mumbai", "Delhi", "New Delhi", "Bangalore", "Bengaluru", "Kolkata",
  "Chennai", "Hyderabad", "India", "Karachi", "Islamabad", "Lahore",
  "Dhaka", "Colombo", "Kathmandu", "Singapore", "Kuala Lumpur", "KL",
  "Jakarta", "Bangkok", "Ho Chi Minh City", "Hanoi", "Manila",
  "Hong Kong", "HK", "Taipei", "Seoul", "Tokyo", "Osaka",
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu",
  "Almaty", "Tashkent", "Sydney", "Melbourne", "Brisbane", "Perth",
  "Auckland", "Honolulu", "Hawaii"
];

export function localParseQuery(query) {
  const qLower = query.toLowerCase().trim();
  const qUpper = query.toUpperCase().trim();

  let intent = "time_conversion";

  const currencyKeywords = ["exchange", "rate", "currency", "forex", "fx", "dollar", "euro", "pound", "yen", "rupee", "usd", "eur", "gbp", "jpy", "inr", "cad", "aud", "chf", "cny", "sgd"];
  const meetingKeywords = ["meeting", "overlap", "best time", "schedule", "call", "business hours", "sync", "slot"];

  const hasCurrencyWord = currencyKeywords.some(kw => {
    if (kw.length <= 3) {
      return new RegExp(`\\b${kw}\\b`, 'i').test(query);
    }
    return qLower.includes(kw);
  });
  const hasNumber = /\d+/.test(query);
  const hasMeetingWord = meetingKeywords.some(kw => qLower.includes(kw));

  if (hasCurrencyWord && (hasNumber || qLower.includes("to") || qLower.includes("convert"))) {
    intent = "currency_conversion";
  } else if (hasMeetingWord) {
    intent = "meeting_overlap";
  }

  if (intent === "currency_conversion") {
    const amtMatch = query.match(/(\d+(?:\.\d+)?)/);
    const amount = amtMatch ? parseFloat(amtMatch[1]) : 1.0;

    const currencyCodes = ["USD", "EUR", "GBP", "JPY", "INR", "CAD", "AUD", "CHF", "CNY", "SGD"];
    const currencyMap = {
      "$": "USD", "€": "EUR", "£": "GBP", "¥": "JPY", "₹": "INR",
      "usd": "USD", "eur": "EUR", "gbp": "GBP", "jpy": "JPY", "inr": "INR",
      "cad": "CAD", "aud": "AUD", "chf": "CHF", "cny": "CNY", "sgd": "SGD",
      "dollar": "USD", "dollars": "USD", "euro": "EUR", "euros": "EUR",
      "pound": "GBP", "pounds": "GBP", "yen": "JPY", "rupee": "INR", "rupees": "INR"
    };

    const foundCurrencies = [];
    const words = qLower.split(/[^a-z0-9$€£¥₹]/);
    for (const word of words) {
      if (currencyMap[word]) {
        foundCurrencies.push(currencyMap[word]);
      }
    }
    for (const sym of ["$", "€", "£", "¥", "₹"]) {
      if (query.includes(sym)) {
        foundCurrencies.push(currencyMap[sym]);
      }
    }
    const upperWords = qUpper.split(/[^A-Z]/);
    for (const uw of upperWords) {
      if (currencyCodes.includes(uw)) {
        foundCurrencies.push(uw);
      }
    }

    const uniqueCurrencies = Array.from(new Set(foundCurrencies));
    const from_currency = uniqueCurrencies[0] || "USD";
    const to_currency = uniqueCurrencies[1] || (from_currency === "USD" ? "EUR" : "USD");

    return {
      intent,
      entities: { amount, from_currency, to_currency }
    };
  }

  let tempQuery = query;
  const foundCities = [];
  const sortedKnownCities = [...KNOWN_CITIES].sort((a, b) => b.length - a.length);

  for (const city of sortedKnownCities) {
    let matched = false;
    if (city.length <= 3) {
      const rx = new RegExp(`\\b${city}\\b`, 'i');
      if (rx.test(tempQuery)) {
        matched = true;
        tempQuery = tempQuery.replace(rx, " ");
      }
    } else {
      const idx = tempQuery.toLowerCase().indexOf(city.toLowerCase());
      if (idx !== -1) {
        matched = true;
        tempQuery = tempQuery.substring(0, idx) + " " + tempQuery.substring(idx + city.length);
      }
    }
    if (matched) {
      foundCities.push(city);
    }
  }

  foundCities.sort((a,b) => qLower.indexOf(a.toLowerCase()) - qLower.indexOf(b.toLowerCase()));
  const isoDate = query.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  const writtenDate = query.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?[,]?\s+(\d{4})\b/i);
  const date = isoDate?.[1] || (writtenDate ? new Date(writtenDate[0] + " 12:00 UTC").toISOString().slice(0,10) : null);
  if (intent === "meeting_overlap") {
    const cities = foundCities.length > 0 ? foundCities : ["New York", "London", "Tokyo"];
    return {
      intent,
      entities: { cities, date }
    };
  }

  const timeRegex = /\b((?:1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:am|pm)?|(?:[01]?[0-9]|2[0-3]):[0-5][0-9]|noon|midnight|(?:1[0-2]|[1-9])\s*(?:am|pm))\b/i;
  const timeMatch = query.match(timeRegex);
  const time = timeMatch ? timeMatch[1].trim() : null;

  const from_city = foundCities[0] || null;
  const to_cities = foundCities.length > 1 ? foundCities.slice(1) : (from_city ? [] : ["London"]);

  return {
    intent,
    entities: {
      from_city,
      to_cities,
      date,
      from_time: time,
      time
    }
  };
}

