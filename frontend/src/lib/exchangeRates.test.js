import { rateFromSnapshot, getCachedRate } from './exchangeRates';

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
