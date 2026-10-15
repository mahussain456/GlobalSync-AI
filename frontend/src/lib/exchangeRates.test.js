import { rateFromSnapshot, getCachedRate, mergeRates } from './exchangeRates';

test('all cross rates come from the same snapshot and timestamp', () => {
  const snapshot = {rates:{USD:1,EUR:0.8,GBP:0.5},updatedUtc:'2026-09-15 00:00 UTC',source:'provider'};
  expect(rateFromSnapshot(snapshot, 'EUR', 'GBP')).toMatchObject({rate:0.625,date:snapshot.updatedUtc});
  expect(rateFromSnapshot(snapshot, 'GBP', 'EUR').rate).toBe(1.6);
});

test('unknown or invalid currency never silently becomes a rate of one', () => {
  expect(() => rateFromSnapshot({rates:{USD:1}}, 'USD', 'ZZZ')).toThrow('unavailable');
  expect(() => rateFromSnapshot({rates:{USD:1,EUR:0}}, 'USD', 'EUR')).toThrow('unavailable');
  expect(getCachedRate('USD', 'ZZZ')).toBeNull();
});

test('build snapshot is explicitly identified as cached with its original timestamp', () => {
  expect(getCachedRate('USD', 'EUR')).toMatchObject({isFallback:true});
  expect(getCachedRate('USD', 'EUR').date).toBeTruthy();
});

test('live quotes replace reference rates only when they agree within 3%', () => {
  const { rates, live } = mergeRates({ EUR: 0.891, PKR: 400, INR: 94.7 }, { USD: 1, EUR: 0.894, PKR: 276.9, INR: 95.2, GBP: 0.75 });
  expect(rates.EUR).toBe(0.891);
  expect(rates.PKR).toBe(276.9);
  expect(rates.GBP).toBe(0.75);
  expect([...live].sort()).toEqual(['EUR', 'INR', 'USD']);
});

test('a pair is labeled live only when both sides came from the live feed', () => {
  const snapshot = { rates: { USD: 1, EUR: 0.9, GBP: 0.75 }, live: new Set(['USD', 'EUR']), liveUtc: '15 Oct 2026 18:20 UTC', updatedUtc: '15 Oct 2026 00:02 UTC', source: 'ref' };
  expect(rateFromSnapshot(snapshot, 'USD', 'EUR')).toMatchObject({ isLive: true, date: '15 Oct 2026 18:20 UTC' });
  expect(rateFromSnapshot(snapshot, 'USD', 'GBP')).toMatchObject({ isLive: false, date: '15 Oct 2026 00:02 UTC', source: 'ref' });
});
