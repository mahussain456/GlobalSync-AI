(() => {
const detached=document.body.classList.contains('pocket-window'),card=document.querySelector('#card');
const icon=(path)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
const play='<path d="m9 5 10 7-10 7z" fill="currentColor"/>',pause='<path d="M8 5v14M16 5v14" stroke-width="3"/>';
const pocket=document.createElement('section');pocket.className='pocket'+(detached?' standalone':'');pocket.setAttribute('aria-label','Pocket Bar stopwatch');
pocket.innerHTML=`<div class="pocket-head" tabindex="0" aria-label="Move stopwatch using drag or arrow keys">${icon('<path d="M7 7h1m8 0h1M7 12h1m8 0h1M7 17h1m8 0h1"/>')}<strong>Stopwatch</strong><button class="pocket-tool pocket-mode">${detached?'Dock':'Detach'} ${icon('<path d="M14 4h6v6M20 4l-8 8M10 5H4v15h15v-6"/>')}</button><button class="pocket-tool pocket-remove" aria-label="Remove stopwatch" title="Remove stopwatch">${icon('<path d="m6 6 12 12M18 6 6 18"/>')}</button></div><div class="pocket-main"><div><div class="pocket-time" role="timer" aria-label="Elapsed time"><span class="pocket-whole">00:00</span><span class="pocket-cs">.00</span></div><div class="pocket-status">Ready</div></div><div class="pocket-controls"><button class="pocket-reset" title="Reset" aria-label="Reset stopwatch" disabled>${icon('<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>')}</button><button class="pocket-start" title="Start" aria-label="Start stopwatch">${icon(play)}</button><button class="pocket-lap" title="Record lap" aria-label="Record lap" disabled>${icon('<path d="M6 21V4m0 0c4-4 8 4 12 0v10c-4 4-8-4-12 0"/>')}</button></div></div><div class="pocket-laps"></div><a class="pocket-cta" href="https://www.globalsync-ai.com" target="_blank" rel="noopener"><span>www.globalsync-ai.com</span>${icon('<path d="M5 12h14m-5-5 5 5-5 5"/>')}</a>`;
const manager=document.createElement('div');manager.className='mod-manager';manager.innerHTML='<span>Stopwatch Mod</span><button>Add stopwatch</button>';
if(detached)card.append(pocket);else{card.insertBefore(manager,document.querySelector('#foot'));card.insertBefore(pocket,document.querySelector('#foot'));}
const native=window.__TAURI__;
let commandQueue=Promise.resolve();
const reportError=error=>{let el=card.querySelector('.pocket-error');if(!el){el=document.createElement('p');el.className='pocket-error';el.setAttribute('role','status');card.append(el)}el.textContent='Stopwatch: '+String(error)};
const send=(action,extra={})=>{
 if(!native){parent.postMessage({pocket:true,action,...extra},location.origin);return Promise.resolve()}
 if(action==='size')return detached?native.core.invoke('fit',{width:card.getBoundingClientRect().width,height:card.getBoundingClientRect().height}).catch(reportError):Promise.resolve();
 commandQueue=commandQueue.then(()=>native.core.invoke('pocket_action',{action:action==='ready'?'get':action,value:extra.mode||extra.theme||null})).then(next=>{state=next;render()}).catch(reportError);
 return commandQueue;
};
pocket.querySelector('.pocket-start').onclick=()=>send('toggle');pocket.querySelector('.pocket-reset').onclick=()=>send('reset');pocket.querySelector('.pocket-lap').onclick=()=>send('lap');pocket.querySelector('.pocket-mode').onclick=()=>send('mode',{mode:detached?'docked':'detached'});pocket.querySelector('.pocket-remove').onclick=()=>send('remove');manager.querySelector('button').onclick=()=>send('add');
let state={base:0,since:0,running:false,laps:[],mode:'docked',enabled:!native,theme:'forest'};
const pad=n=>String(n).padStart(2,'0');const format=ms=>{const t=Math.floor(ms/10),sec=Math.floor(t/100),min=Math.floor(sec/60),h=Math.floor(min/60);return [(h?pad(h)+':'+pad(min%60):pad(min))+':'+pad(sec%60),'.'+pad(t%100)]};
function render(){if(detached||!native)card.dataset.theme=state.theme;pocket.hidden=!state.enabled||(!detached&&state.mode==='detached');manager.hidden=state.enabled&&state.mode==='docked';manager.querySelector('span').textContent=state.enabled?'Stopwatch is detached':'Stopwatch Mod';manager.querySelector('button').textContent=state.enabled?'Dock here':'Add stopwatch';pocket.classList.toggle('running',state.running);pocket.querySelector('.pocket-start').innerHTML=icon(state.running?pause:play);pocket.querySelector('.pocket-start').setAttribute('aria-label',state.running?'Pause stopwatch':state.base?'Resume stopwatch':'Start stopwatch');pocket.querySelector('.pocket-start').title=state.running?'Pause':'Start / resume';pocket.querySelector('.pocket-reset').disabled=state.running||!state.base;pocket.querySelector('.pocket-lap').disabled=!state.running;pocket.querySelector('.pocket-status').textContent=!state.running&&state.base?'Paused':'';pocket.querySelector('.pocket-status').hidden=state.running||!state.base;pocket.querySelector('.pocket-laps').innerHTML=state.laps.length?'<div><span>Lap</span><span>Split</span><span>Total</span></div>'+state.laps.map((l,i)=>`<div><span>${pad(state.laps.length-i)}</span><span>${format(l.split).join('')}</span><span>${format(l.total).join('')}</span></div>`).join(''):'';tick();}
if(!native)window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||!e.data.pocketState)return;state=e.data.pocketState;render()});
function tick(){const [whole,cs]=format(state.base+(state.running?Math.max(0,Date.now()-state.since):0));pocket.querySelector('.pocket-whole').textContent=whole;pocket.querySelector('.pocket-cs').textContent=cs;pocket.querySelector('.pocket-time').classList.toggle('long',whole.length>5)}
setInterval(()=>{if(!document.hidden&&!pocket.hidden&&state.running)tick()},40);
new ResizeObserver(()=>send('size',{detached,height:Math.ceil(card.getBoundingClientRect().height+44)})).observe(card);
const head=pocket.querySelector('.pocket-head');if(!detached){head.removeAttribute('tabindex');head.removeAttribute('aria-label')}let drag=null;
head.addEventListener('pointerdown',e=>{if(!detached||e.target.closest('button')||e.button!==0)return;if(native){native.core.invoke('drag').catch(reportError);return}drag={x:e.screenX,y:e.screenY};head.setPointerCapture(e.pointerId);send('dragStart');e.preventDefault()});
head.addEventListener('pointermove',e=>{if(drag)send('drag',{dx:e.screenX-drag.x,dy:e.screenY-drag.y})});head.onpointerup=head.onpointercancel=()=>{drag=null};
head.onkeydown=e=>{if(native||!detached||e.target!==head||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();send('nudge',{dx:e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0,dy:e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0})};
if(!detached)new MutationObserver(()=>{if(card.dataset.theme!==state.theme)send('theme',{theme:card.dataset.theme})}).observe(card,{attributes:true,attributeFilter:['data-theme']});
if(native){
 pocket.querySelector('.pocket-cta').onclick=e=>{e.preventDefault();native.core.invoke('open_site',{path:'/?ref=stopwatch'}).catch(reportError)};
 if(detached)head.setAttribute('aria-label','Drag to move stopwatch');
 pocket.hidden=true;manager.hidden=true;
 native.event.listen('pocket:state',e=>{state=e.payload;render()}).then(()=>send('ready')).then(async()=>{
   if(detached){await native.core.invoke('fit',{width:card.getBoundingClientRect().width,height:card.getBoundingClientRect().height});await native.core.invoke('ready')}
   else if(card.dataset.theme)send('theme',{theme:card.dataset.theme});
 }).catch(reportError);
}else send('ready');
})();

