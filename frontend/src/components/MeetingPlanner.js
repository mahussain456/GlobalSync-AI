import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarDays, Copy, Download, Share2, X } from 'lucide-react';
import { CITY_TIMEZONES } from '@/lib/cityTimezones';
import { DURATIONS, toMinutes, timeInput, findMeetingSlots, meetingSummary, calendarFile, googleCalendarLink, serializePlan, readSharedPlan } from '@/lib/meetingPlanner';
import { fireAnalyticsEvent } from '@/lib/analytics';

const inputClass = 'w-full min-w-0 h-12 rounded-lg border border-white/30 bg-gem-forest px-3 text-base text-gem-beige';
const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/30 px-4 py-3 text-sm font-medium text-gem-beige hover:bg-white/10 disabled:opacity-40';
const city = name => ({ name, timezone: CITY_TIMEZONES[name], start: 540, end: 1020 });
const PRESETS = [['New York', 'London'], ['London', 'Berlin', 'Dubai'], ['New York', 'Mumbai'], ['Sydney', 'Auckland']];
const CITY_NAMES = Object.keys(CITY_TIMEZONES).filter(name => name.length > 2 && !['NYC', 'New York City', 'Bengaluru', 'India', 'Hawaii', 'Sao Paulo'].includes(name)).sort();
function initialState(search) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(p => [p.type, p.value]));
  const fallback = { plan: { date: `${parts.year}-${parts.month}-${parts.day}`, duration: 30, weekdays: true, cities: [city('New York'), city('London')] }, selectedStart: '' };
  try { return readSharedPlan(search, CITY_TIMEZONES) || fallback; }
  catch (error) { return { ...fallback, notice: error.message }; }
}
export default function MeetingPlanner() {
  const { search } = useLocation();
  return <PlannerForm key={search} search={search} />;
}
function PlannerForm({ search }) {
  const [initial] = useState(() => initialState(search));
  const [plan, setPlan] = useState(initial.plan);
  const [selectedStart, setSelectedStart] = useState(initial.selectedStart);
  const [hour12, setHour12] = useState(true);
  const [notice, setNotice] = useState(initial.notice || '');
  const [copyFallback, setCopyFallback] = useState('');
  const computed = useMemo(() => {
    try { return { slots: findMeetingSlots(plan), error: '' }; }
    catch (error) { return { slots: [], error: error.message }; }
  }, [plan]);
  const slot = computed.slots.find(s => s.start.toISOString() === selectedStart) || computed.slots[0];
  const reference = plan.cities[0];
  const format = (instant, timeZone, includeDate = false) => new Intl.DateTimeFormat('en-US', {
    timeZone, hour: 'numeric', minute: '2-digit', hour12, timeZoneName: 'short',
    ...(includeDate ? { weekday: 'short', month: 'short', day: 'numeric' } : {})
  }).format(instant);
  const update = patch => { setPlan(current => ({ ...current, ...patch })); setSelectedStart(''); setNotice(''); setCopyFallback(''); };
  const changeHours = (index, field, value) => update({ cities: plan.cities.map((c, i) => i === index ? { ...c, [field]: toMinutes(value) } : c) });
  const copy = async (value, message) => {
    try { await navigator.clipboard.writeText(value); setNotice(message); setCopyFallback(''); }
    catch { setCopyFallback(value); setNotice('Clipboard access is unavailable. Select and copy the text below.'); }
  };
  const share = () => {
    copy(`${window.location.origin}/meeting-planner?${serializePlan(plan, slot?.start.toISOString())}`, 'Plan link copied, including working hours and the selected time.');
    fireAnalyticsEvent('meeting_shared', { tool: 'meeting_planner' });
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([calendarFile(plan, slot)], { type: 'text/calendar;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'globalsync-meeting.ics'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Calendar file downloaded. Open it in your calendar to review and invite participants.');
    fireAnalyticsEvent('meeting_calendar_exported', { tool: 'meeting_planner', duration: plan.duration });
  };
  return <section aria-label="Interactive meeting planner" data-testid="meeting-planner" className="relative rounded-2xl border border-white/20 bg-gem-pine/30 p-4 sm:p-7">
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-7">
      <label className="space-y-2 text-sm text-gem-sage">Meeting date in {reference.name}<input aria-label="Meeting date" type="date" value={plan.date} onChange={e => update({ date: e.target.value })} className={inputClass} /></label>
      <label className="space-y-2 text-sm text-gem-sage">Meeting duration<select aria-label="Meeting duration" value={plan.duration} onChange={e => update({ duration: Number(e.target.value) })} className={inputClass}>{DURATIONS.map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
      <label className="space-y-2 text-sm text-gem-sage">Time format<select aria-label="Time format" value={hour12 ? '12' : '24'} onChange={e => setHour12(e.target.value === '12')} className={inputClass}><option value="12">12-hour (AM / PM)</option><option value="24">24-hour</option></select></label>
    </div>
    <h2 className="font-heading text-xl font-semibold mb-2">Where is everyone working?</h2>
    <p className="text-sm text-gem-sage mb-4">Set each city's local working hours. The date above follows the first city; every result shows the local date.</p>
    <div className="divide-y divide-white/15">
      {plan.cities.map((c, i) => <div key={c.name} className="grid grid-cols-2 sm:grid-cols-[1fr_8rem_8rem_3rem] gap-3 py-4 items-end">
        <div className="col-span-2 sm:col-span-1 flex items-center justify-between gap-2 min-w-0"><div className="min-w-0"><h3 className="font-semibold break-words">{c.name}</h3><p className="text-xs text-gem-sage break-all">{c.timezone}</p></div><button type="button" aria-label={`Remove ${c.name}`} disabled={plan.cities.length <= 2} onClick={() => update({ cities: plan.cities.filter((_, idx) => idx !== i) })} className="sm:hidden p-3 disabled:opacity-30"><X className="w-5 h-5" /></button></div>
        <label className="text-sm text-gem-sage space-y-1">Starts<input aria-label={`${c.name} work starts`} type="time" step="900" value={Number.isFinite(c.start) ? timeInput(c.start) : ''} onChange={e => changeHours(i, 'start', e.target.value)} className={inputClass} /></label>
        <label className="text-sm text-gem-sage space-y-1">Ends<input aria-label={`${c.name} work ends`} type="time" step="900" value={Number.isFinite(c.end) ? timeInput(c.end) : ''} onChange={e => changeHours(i, 'end', e.target.value)} className={inputClass} /></label>
        <button type="button" aria-label={`Remove ${c.name}`} disabled={plan.cities.length <= 2} onClick={() => update({ cities: plan.cities.filter((_, idx) => idx !== i) })} className="hidden sm:flex h-12 items-center justify-center disabled:opacity-30 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
      </div>)}
    </div>
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center mt-4 mb-6">
      <label className="w-full sm:flex-1 min-w-0 max-w-sm text-sm text-gem-sage space-y-1">Add a city ({plan.cities.length}/5)<select aria-label="Add a meeting city" disabled={plan.cities.length >= 5} value="" onChange={e => { if (e.target.value) update({ cities: [...plan.cities, city(e.target.value)] }); }} className={inputClass}><option value="">Choose a city…</option>{CITY_NAMES.filter(name => !plan.cities.some(c => c.name === name)).map(name => <option key={name}>{name}</option>)}</select></label>
      <label className="flex gap-2 items-center text-sm min-h-11"><input type="checkbox" checked={plan.weekdays} onChange={e => update({ weekdays: e.target.checked })} className="accent-gem-gold w-4 h-4" /> Monday–Friday in every city</label>
    </div>
    <div className="flex flex-wrap gap-2 mb-7" aria-label="Meeting presets">{PRESETS.map(names => <button type="button" key={names.join()} onClick={() => update({ cities: names.map(city) })} className="text-sm text-gem-sage underline underline-offset-4 px-2 py-2 hover:text-gem-gold">{names.join(' + ')}</button>)}</div>
    {computed.error ? <p role="alert" className="text-amber-200 py-4">{computed.error}</p> : <div className="border-t border-white/20 pt-6">
      <div role="status" className="mb-4"><h2 className="font-heading text-2xl font-semibold">{slot ? 'Choose a time that fits' : 'No shared working time'}</h2><p className="text-sm text-gem-sage mt-2">{slot ? `${computed.slots.length} start times fit the full ${plan.duration}-minute meeting. Times are offered every 15 minutes.` : 'Try a shorter meeting, another date, or working hours your team agrees to. An asynchronous update may work better.'}</p></div>
      {slot && <>
        <label className="block text-sm text-gem-sage space-y-2 max-w-md mb-5">Start time in {reference.name}<select aria-label="Meeting start time" value={slot.start.toISOString()} onChange={e => { setSelectedStart(e.target.value); setNotice(''); }} className={inputClass}>{computed.slots.map(s => <option key={s.start.toISOString()} value={s.start.toISOString()}>{format(s.start, reference.timezone)} – {format(s.end, reference.timezone)}</option>)}</select></label>
        <ul className="divide-y divide-white/15 mb-6" aria-label="Selected meeting in each city">{plan.cities.map(c => <li key={c.name} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1"><span className="font-medium">{c.name}</span><span className="text-gem-sage text-sm tabular-nums">{format(slot.start, c.timezone, true)} – {format(slot.end, c.timezone)}</span></li>)}</ul>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={download} className={`${actionClass} bg-gem-gold !text-gem-forest !border-gem-gold hover:!bg-gem-gold/90`}><Download className="w-4 h-4" /> Download calendar file</button>
          <a href={googleCalendarLink(plan, slot)} target="_blank" rel="noopener noreferrer" className={actionClass}><CalendarDays className="w-4 h-4" /> Google Calendar</a>
          <button type="button" onClick={() => copy(meetingSummary(plan, slot), 'Local meeting times copied.')} className={actionClass}><Copy className="w-4 h-4" /> Copy local times</button>
        </div><p className="text-xs text-gem-sage mt-3">Creates a one-time calendar draft. Review it before sending invitations. No calendar access is required.</p>
      </>}
      <button type="button" onClick={share} className={`${actionClass} mt-4`}><Share2 className="w-4 h-4" /> Copy plan link</button>
    </div>}
    {notice && <p role="status" className="text-sm text-gem-gold mt-4">{notice}</p>}
    {copyFallback && <label className="block mt-3 text-sm">Copy this text<textarea readOnly value={copyFallback} onFocus={e => e.target.select()} className={`${inputClass} !h-32 mt-2`} /></label>}
  </section>;
}
