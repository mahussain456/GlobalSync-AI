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

test('tool_used fires once per tool, and only after consent', () => {
  const { markToolUsed } = require('./analytics');
  window.gtag = jest.fn();
  localStorage.setItem('gs_cookie_consent', 'accepted');
  markToolUsed('meeting_planner');
  markToolUsed('meeting_planner');
  markToolUsed('currency');
  expect(window.gtag.mock.calls.filter(c => c[1] === 'tool_used')).toEqual([
    ['event', 'tool_used', { tool: 'meeting_planner' }],
    ['event', 'tool_used', { tool: 'currency' }],
  ]);
});
