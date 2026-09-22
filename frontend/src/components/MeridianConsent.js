import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
const key='gs_cookie_consent';
export default function MeridianConsent(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{if(navigator.userAgent==='ReactSnap')return;const timer=setTimeout(()=>{try{setVisible(!localStorage.getItem(key))}catch{setVisible(true)}},1800);return()=>clearTimeout(timer)},[]);
 const choose=value=>{try{localStorage.setItem(key,value)}catch{/* The tools also work with storage disabled. */}window.dispatchEvent(new Event('gs-consent-changed'));setVisible(false)};
 if(!visible)return null;
 return <aside className="meridian-consent" role="region" aria-label="Cookie preferences"><p>Make yourself at home.</p><div>Optional cookies help us understand usage and support ads. You can use the tools without accepting. <Link to="/privacy-policy">Privacy policy</Link></div><section><button data-testid="cookie-decline-btn" onClick={()=>choose('declined')}>Decline optional cookies</button><button data-testid="cookie-accept-btn" onClick={()=>choose('accepted')}>Accept optional cookies</button></section></aside>;
}
