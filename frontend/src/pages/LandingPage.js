import {useEffect,useRef} from 'react';
import {ArrowRight} from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import SEOHead from '@/components/SEOHead';
import {getHomepageSEO} from '@/lib/seo';
import {initializeMeridian} from '@/lib/meridianExperience';
import ToolStage from '@/components/home/ToolStage';
import SocialProof from '@/components/SocialProof';
import NewsletterSignup from '@/components/NewsletterSignup';
import '@/styles/meridian.css';
const HOME_FAQS=[
{q:'What can I do with GlobalSync AI?',
 a:'Convert a time across cities at the top of this page. Use the meeting planner to compare up to five cities, find a time inside everyone’s working hours and download a calendar file. You can also convert currencies at live rates, check a freelance rate in another currency and build a PDF invoice.'},
{q:'What does the AI in GlobalSync AI actually do?',
 a:'One feature uses AI: the question box in your workspace. When you type something like “What time is 3 PM New York in London?”, Anthropic’s Claude Haiku model reads it and picks the right tool and inputs. The answer is then calculated by the same converters you can use directly; the AI does not write it. If the AI is unavailable, a simple rule-based reader takes over. Every other tool works without AI.'},
{q:'Is GlobalSync AI free?',
 a:'Yes. All tools are free to use and there is no signup or account required. You can open any tool and use it immediately.'},
{q:'How are shared hours calculated?',
 a:'The planner checks the entire meeting against 09:00–17:00 in each city, using the selected date and each city’s time zone. Working hours here apply to every day; holidays and individual availability are not checked.'},
{q:'What happens if there is no overlap?',
 a:'Some teams span too many time zones for everyone to meet during working hours. The planner tells you when no shared window exists, so you can discuss a compromise with your team.'},
{q:'Where do GlobalSync AI’s time zone rules come from?',
 a:'Time zone rules, including daylight saving transitions, come from the IANA Time Zone Database, the reference dataset used by most operating systems. Full details are published on the GlobalSync AI data sources page.'},
{q:'Are the currency rates live?',
 a:'They are live mid-market rates, refreshed every minute and cross-checked against ExchangeRate-API daily reference rates, so one bad quote can never reach you. Each result shows its source and the time it was taken. Use the figure for estimating and planning, and check your payment provider for the final transfer rate.'},
];
export default function LandingPage(){
const root=useRef(null);
useEffect(()=>initializeMeridian(root.current),[]);
return <div className="meridian-home" ref={root}><SEOHead {...getHomepageSEO({faqs:HOME_FAQS})}/><SiteNav/>
<main id="main-content">
<div className="shell">
<section className="hero hero-staged">
<div className="hero-intro"><h1>Free time zone converter, meeting planner <em>&amp; currency tools.</em></h1><p className="hero-copy">Every tool, ready to use right here. Slide through them, or open the full version. Free, no signup.</p></div>
<ToolStage/>
</section>
<SocialProof/>
<section className="faq" id="questions">
<div className="faq-side"><h2>Questions,<br/>answered.</h2>
<form className="home-ask" action="/dashboard"><label htmlFor="home-question">Or ask in plain English <small>An AI model reads your question; the tools calculate the answer.</small></label><div className="home-ask-row"><input id="home-question" name="q" placeholder="What time is 3 PM New York in London?" required maxLength={500}/><button type="submit" className="btn btn-primary">Ask <ArrowRight aria-hidden="true"/></button></div></form>
</div>
<div>{HOME_FAQS.map(f=><details key={f.q}><summary>{f.q}<svg><path d="M12 4v16M4 12h16"/></svg></summary><p>{f.a}</p></details>)}</div>
</section>
</div>
</main>
<div className="shell home-newsletter"><NewsletterSignup placement="home"/></div>
<SiteFooter/></div>;
}
