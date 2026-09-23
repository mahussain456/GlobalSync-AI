import { readQueryHistory, saveQueryHistory, clearQueryHistory } from './queryHistory';
beforeEach(() => localStorage.clear());
test('queries survive a read, deduplicate and keep only the latest 30', () => {
  for (let i = 0; i < 35; i++) saveQueryHistory(`Convert ${i} USD to EUR`, 'currency_conversion');
  saveQueryHistory('Convert 10 USD to EUR', 'currency_conversion');
  const items = readQueryHistory();
  expect(items).toHaveLength(30);
  expect(items[0].query).toBe('Convert 10 USD to EUR');
  expect(items.filter(i => i.query === items[0].query)).toHaveLength(1);
  expect(clearQueryHistory()).toBe(true);
  expect(readQueryHistory()).toEqual([]);
});
test('corrupt, expired and invalid stored entries are ignored', () => {
  localStorage.setItem('gs_query_history_v1', '{broken');
  expect(readQueryHistory()).toEqual([]);
  localStorage.setItem('gs_query_history_v1', JSON.stringify([{ id:'old', query:'old', intent:'time_conversion', timestamp:'2000-01-01' }, null]));
  expect(readQueryHistory()).toEqual([]);
  expect(saveQueryHistory(' ', 'time_conversion')).toBe(false);
  expect(saveQueryHistory('query', 'unknown')).toBe(false);
});
