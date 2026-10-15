import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
const key='gs_cookie_consent';
export default function MeridianConsent(){
 const [visible,setVisible]=useState(false);
 const bar=useRef(null);
 useEffect(()=>{if(navigator.userAgent==='ReactSnap')return;const timer=setTimeout(()=>{try{setVisible(!localStorage.getItem(key))}catch{setVisible(true)}},1800);return()=>clearTimeout(timer)},[]);
 // Reserve the bar's height at the bottom of the page so it never covers content.
 useLayoutEffect(()=>{
  if(!visible||!bar.current)return undefined;
  const pad=()=>{if(bar.current)document.body.style.paddingBottom=bar.current.offsetHeight+'px'};
  pad();
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(pad):null;
  ro?.observe(bar.current);
  return()=>{ro?.disconnect();document.body.style.paddingBottom=''};
 },[visible]);
 const choose=value=>{try{localStorage.setItem(key,value)}catch{/* The tools also work with storage disabled. */}window.dispatchEvent(new Event('gs-consent-changed'));setVisible(false)};
 if(!visible)return null;
 return <aside ref={bar} className="meridian-consent" role="region" aria-label="Cookie preferences"><p>Make yourself at home.</p><div>Optional cookies help us understand usage and support ads. You can use the tools without accepting. <Link to="/privacy-policy">Privacy policy</Link></div><section><button data-testid="cookie-decline-btn" onClick={()=>choose('declined')}>Decline optional cookies</button><button data-testid="cookie-accept-btn" onClick={()=>choose('accepted')}>Accept optional cookies</button></section></aside>;
}
