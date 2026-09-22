import {useEffect,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowRight,Menu,X} from 'lucide-react';
import SavedTeamsPanel from './SavedTeamsPanel';
import '@/styles/meridian-brand.css';
const links=[['Time zones','/time-zone-converter'],['Meeting planner','/meeting-planner'],['Currency','/currency-converter'],['Freelance rates','/freelancer-rate-converter'],['Invoices','/invoice'],['Guides','/blog']];
export default function MeridianNav(){
 const [open,setOpen]=useState(false),[scrolled,setScrolled]=useState(false);
 const {pathname}=useLocation(),button=useRef(null),header=useRef(null);
 useEffect(()=>{setOpen(false)},[pathname]);
 useEffect(()=>{const skip=header.current.querySelector('.brand-skip');const jump=()=>{const main=document.querySelector('main');if(main){main.id='main-content';main.tabIndex=-1;main.focus()}};skip.addEventListener('click',jump);return()=>skip.removeEventListener('click',jump)},[]);
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>24);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll)},[]);
 useEffect(()=>{if(!open)return;const key=e=>{if(e.key==='Escape'&&!document.querySelector('[role="dialog"]')){setOpen(false);button.current?.focus()}};const outside=e=>{if(!document.querySelector('[role="dialog"]')&&!header.current?.contains(e.target))setOpen(false)};document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside)}},[open]);
 return <header ref={header} className={`meridian-site-nav ${scrolled?'is-scrolled':''}`}><a className="brand-skip" href="#main-content">Skip to content</a><nav aria-label="Main navigation" className="brand-nav-inner"><Link to="/" className="brand-wordmark" aria-label="GlobalSync AI home"><img src="/meridian/logo-finished.png" alt="globalsync-ai" width="2172" height="724"/></Link><div className="brand-desktop-links">{links.map(([label,to])=><Link key={to} to={to} aria-current={pathname===to?'page':undefined}>{label}</Link>)}</div><Link className="brand-workspace" to="/dashboard">Open workspace <ArrowRight size={16}/></Link><button ref={button} className="brand-menu" aria-label="Toggle menu" aria-expanded={open} aria-controls="brand-mobile-nav" onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button></nav>{open&&<nav id="brand-mobile-nav" aria-label="Mobile navigation" className="brand-mobile-links">{links.map(([label,to])=><Link key={to} to={to} aria-current={pathname===to?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<Link to="/dashboard" onClick={()=>setOpen(false)}>Open workspace</Link><div className="brand-saved-teams"><SavedTeamsPanel/></div></nav>}</header>;
}
