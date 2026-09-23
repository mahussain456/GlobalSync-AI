import { fireAnalyticsEvent } from './analytics';
beforeEach(() => { localStorage.clear(); window.gtag = jest.fn(); window.dataLayer = []; });
test('optional events require explicit consent and use the Google tag API', () => {
  fireAnalyticsEvent('calculation_succeeded', {tool:'currency'});
  expect(window.gtag).not.toHaveBeenCalled();
  localStorage.setItem('gs_cookie_consent','accepted');
  fireAnalyticsEvent('calculation_succeeded', {tool:'currency'});
  expect(window.gtag).toHaveBeenCalledWith('event','calculation_succeeded',{tool:'currency'});
});
test('blocked browser storage never breaks the tool', () => {
  const read = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
  expect(() => fireAnalyticsEvent('calculation_succeeded')).not.toThrow();
  expect(window.gtag).not.toHaveBeenCalled();
  read.mockRestore();
});
