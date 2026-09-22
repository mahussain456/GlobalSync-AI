export function initializeMeridian(root) {
  const controller=new AbortController();
  const listen=(target,...args)=>target.addEventListener(args[0],args[1],{...(args[2]||{}),signal:controller.signal});
  const $ = s => root.querySelector(s), $$ = s => [...root.querySelectorAll(s)];
  const groups = {
    atlantic: [['New York','America/New_York'],['London','Europe/London'],['Berlin','Europe/Berlin']],
    asia: [['London','Europe/London'],['Dubai','Asia/Dubai'],['Singapore','Asia/Singapore']],
    pacific: [['Los Angeles','America/Los_Angeles'],['Tokyo','Asia/Tokyo'],['Sydney','Australia/Sydney']]
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let group='atlantic', tick=52, duration=30, paused=reduced.matches;
  const dateInput=$('[name=meeting-date]');
  dateInput.value=new Date().toISOString().slice(0,10);
  let selectedDate=dateInput.value;
  const formatters = new Map();
  const local=(d,tz)=>{
    if(!formatters.has(tz))formatters.set(tz,new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}));
    return formatters.get(tz).format(d);
  };
  const moment=(step=tick)=>new Date(new Date(selectedDate+'T00:00:00Z').getTime()+step*15*60000);
  const dateLabel=(tz='UTC',instant=moment())=>new Intl.DateTimeFormat('en-GB',{timeZone:tz,day:'numeric',month:'short'}).format(instant);
  const minutes=(d,tz)=>{const [h,m]=local(d,tz).split(':').map(Number);return h*60+m};
  const works=(tz,step=tick)=>{
    // Check every minute so the entire meeting fits, including date / DST changes.
    for(let offset=0;offset<duration;offset++){
      const m=minutes(new Date(moment(step).getTime()+offset*60000),tz);
      if(m<540||m>=1020)return false;
    }
    return true;
  };
  function update(){
    const rows=groups[group].map(([name,tz])=>({name,tz,time:local(moment(),tz),day:dateLabel(tz),working:works(tz),position:minutes(moment(),tz)/14.4}));
    $$('.range').forEach(el=>{el.value=tick;el.setAttribute('aria-valuetext',local(moment(),'UTC')+' UTC')});
    $$('[data-utc]').forEach(el=>el.textContent=local(moment(),'UTC')+' UTC');
    $$('[data-date-label]').forEach(el=>el.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',day:'numeric',month:'short',year:'numeric'}).format(moment()));
    $('[data-clock-row]').innerHTML=rows.map(r=>`<div>${r.name}<span>${r.time}</span><small>${r.day} · ${r.working?'Within working hours':'Outside working hours'}</small><div class="city-track" aria-hidden="true"><i></i><b style="--day:${r.position}%"></b></div></div>`).join('');
    $('[data-schedule]').innerHTML=rows.map(r=>`<div class="schedule-row"><div><strong>${r.name}</strong><small>${r.day} · 09:00–17:00</small></div><span class="local">${r.time}</span><span class="status ${r.working?'on':''}">${r.working?'Works':'After hours'}</span></div>`).join('');
    $('[data-fit]').textContent=rows.every(r=>r.working)?`All three cities fit a ${duration}-minute meeting.`:'Outside someone’s working hours. Adjust the time or find a shared window.';
    $$('[data-group]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.group===group)));
    $('[name=team]').value=group;
    $('.notice').textContent='';
  }
  $$('.range').forEach(el=>listen(el,'input',()=>{tick=Number(el.value);update()}));
  $$('[data-group]').forEach(el=>listen(el,'click',()=>{group=el.dataset.group;update()}));
  listen($('[name=team]'),'change',e=>{group=e.target.value;update()});
  listen($('[name=duration]'),'change',e=>{duration=Number(e.target.value);update()});
  listen(dateInput,'change',()=>{if(!dateInput.checkValidity()){dateInput.reportValidity();return}selectedDate=dateInput.value;update()});
  listen($('.find-time'),'click',()=>{
    if(!dateInput.checkValidity()){dateInput.reportValidity();return}
    const candidates=Array.from({length:96},(_,i)=>i).sort((a,b)=>Math.abs(a-tick)-Math.abs(b-tick));
    const found=candidates.find(step=>groups[group].every(([,tz])=>works(tz,step)));
    if(found===undefined){$('.notice').textContent='No shared 09:00–17:00 window for this team and meeting length. Try a shorter meeting or discuss an out-of-hours time.';return}
    tick=found;update();$('.notice').textContent='Shared time found. Everyone stays within working hours.';
  });
  const summary=()=>`GlobalSync AI · ${selectedDate} · ${duration} minutes\n`+groups[group].map(([name,tz])=>{const end=new Date(moment().getTime()+duration*60000);return `${name}: ${dateLabel(tz)} ${local(moment(),tz)}–${dateLabel(tz,end)} ${local(end,tz)}`}).join('\n');
  listen($('.copy'),'click',async()=>{if(!dateInput.checkValidity()){dateInput.reportValidity();return}try{await navigator.clipboard.writeText(summary());$('.notice').textContent='Local times copied. Ready to share.'}catch{$('.notice').textContent='Copy these local times:\n'+summary()}});
  listen($('.calendar'),'click',()=>{
    if(!dateInput.checkValidity()){dateInput.reportValidity();return}
    const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const escape=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
    const fold=line=>{let out='',length=0;for(const ch of line){const size=new TextEncoder().encode(ch).length;if(length+size>73){out+='\r\n ';length=1}out+=ch;length+=size}return out};
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//GlobalSync AI//Meridian Planner//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+crypto.randomUUID()+'@globalsync-ai.com','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(moment()),'DTEND:'+stamp(new Date(moment().getTime()+duration*60000)),'SUMMARY:GlobalSync team meeting','DESCRIPTION:'+escape(summary()),'END:VEVENT','END:VCALENDAR'];
    const url=URL.createObjectURL(new Blob([lines.map(fold).join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='globalsync-meeting-'+selectedDate+'.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('.notice').textContent='Calendar file downloaded. Open it in your calendar to review and invite your team.';
  });
  function motionState(){root.classList.toggle('pause',paused);$('.motion-toggle').textContent=paused?'Motion paused':'Pause motion';$('.motion-toggle').setAttribute('aria-pressed',String(paused))}
  listen($('.motion-toggle'),'click',()=>{paused=!paused;motionState()});
  const mediaChange=e=>{paused=e.matches;motionState()};reduced.addEventListener('change',mediaChange);motionState();
  const frame=$('.picture-frame');
  listen(frame,'pointermove',e=>{if(paused||reduced.matches||e.pointerType==='touch')return;const b=frame.getBoundingClientRect();frame.style.setProperty('--tilt-x',((e.clientX-b.left)/b.width-.5)*4+'deg');frame.style.setProperty('--tilt-y',-((e.clientY-b.top)/b.height-.5)*4+'deg')});
  listen(frame,'pointerleave',()=>{frame.style.setProperty('--tilt-x','0deg');frame.style.setProperty('--tilt-y','0deg')});
  const visibility=()=>root.classList.toggle('hero-inactive',document.hidden);
  listen(document,'visibilitychange',visibility);
  const observer=new IntersectionObserver(entries=>root.classList.toggle('hero-inactive',!entries[0].isIntersecting||document.hidden),{threshold:0});
  observer.observe(frame);
  update();
return () => { controller.abort(); observer.disconnect(); reduced.removeEventListener("change", mediaChange); };
}
