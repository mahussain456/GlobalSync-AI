const KEY = 'gs_query_history_v1';
const MAX_AGE = 90 * 24 * 60 * 60 * 1000;
const INTENTS = ['time_conversion', 'meeting_overlap', 'currency_conversion'];

export function readQueryHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(items)) return [];
    const current = items.filter(item => item && typeof item.id === 'string' &&
      typeof item.query === 'string' && item.query.length <= 500 &&
      INTENTS.includes(item.intent) && Number.isFinite(Date.parse(item.timestamp)) &&
      Date.now() - Date.parse(item.timestamp) < MAX_AGE).slice(0, 30);
    if (current.length !== items.length) localStorage.setItem(KEY, JSON.stringify(current));
    return current;
  } catch { return []; }
}

export function saveQueryHistory(query, intent) {
  if (!query?.trim() || !INTENTS.includes(intent)) return false;
  const text = query.trim().slice(0, 500);
  const items = readQueryHistory().filter(item => item.query !== text);
  const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, query: text, intent, timestamp: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify([item, ...items].slice(0, 30))); return true; }
  catch { return false; }
}

export function clearQueryHistory() {
  try { localStorage.removeItem(KEY); return true; } catch { return false; }
}
