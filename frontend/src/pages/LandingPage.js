import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ArrowRight, Play, Sun, Moon, CheckCircle2, DollarSign, Clock, Users, Sparkles, Map, TrendingUp } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige font-sans relative">
      <SEOHead title="GlobalSync AI | Total Alignment" description="GlobalSync AI helps remote teams coordinate across time zones, currencies, and cultures with AI-powered intelligence." />
      
      {/* LUXURY HERO BACKGROUND with World Map */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[1100px] pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"></div>
        {/* World Map Background */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-screen" style={{backgroundImage: "url('/world-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center 30%'}}></div>
      </div>

      <SiteNav />

      {/* HERO SECTION — reduced padding so content is above the fold */}
      <main className="relative z-10 pt-8 lg:pt-12 pb-20 px-5 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-5 z-20 pt-0 lg:pt-2">
            <div className="inline-block border border-gem-gold/45 bg-[#0e2a1f]/55 text-gem-gold rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] mb-7 backdrop-blur-md">
              <Sparkles className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              AI-Powered. Globally Minded.
            </div>

            <h1 className="font-serif text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.95] tracking-[-0.04em] font-semibold text-[#E9F1EC] mb-6">
              One Platform.<br />
              Every Time Zone.<br />
              <span className="text-gem-gold italic">Total Alignment.</span>
            </h1>

            <p className="text-[17px] leading-[1.65] text-[#F4EFE6]/75 max-w-[480px] mb-8">
              GlobalSync AI helps remote teams and freelancers coordinate across time zones, currencies, and cultures with AI-powered intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link to="/dashboard" className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-[15px]">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-3 text-[15px] group">
                <div className="w-6 h-6 rounded-full border border-gem-gold/30 flex items-center justify-center group-hover:bg-gem-gold/10 transition-colors">
                  <Play className="w-2.5 h-2.5 text-gem-gold fill-gem-gold ml-0.5" />
                </div>
                See GlobalSync AI in Action
              </button>
            </div>

            {/* Trusted Logos */}
            <div>
              <p className="text-[11px] font-bold text-[#A7BFAE]/60 uppercase tracking-widest mb-5">Trusted by global teams</p>
              <div className="flex flex-wrap items-center gap-8 opacity-40 grayscale mix-blend-screen">
                <span className="font-bold text-xl tracking-tighter">stripe</span>
                <span className="font-bold text-xl flex items-center gap-1"><span className="text-2xl font-black">H</span> HubSpot</span>
                <span className="font-semibold text-xl border border-white p-1 rounded">N</span>
                <span className="font-bold text-xl tracking-tight">deel.</span>
                <span className="font-bold text-xl italic font-serif">Canva</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Asymmetrical Bento Grid */}
          <div className="lg:col-span-7 w-full hidden lg:block z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              
              {/* Bento Card 1: World Clocks (Spans 2 columns) */}
              <div className="col-span-1 md:col-span-2 card-dark p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_50px_rgba(200,169,106,0.15)] border border-white/10 rounded-[28px] overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5 text-[#E9F1EC] text-sm font-semibold tracking-wide">
                    <Globe className="w-4 h-4 text-gem-gold animate-pulse" /> Real-Time World Clocks
                  </div>
                  <span className="text-xs text-gem-gold font-bold uppercase tracking-wider cursor-pointer hover:underline">Live sync</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* San Francisco */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-gem-gold/20">
                    <div className="text-[10px] text-gem-sage flex items-center gap-1 mb-2 font-bold tracking-wider"><Sun className="w-3 h-3 text-gem-gold"/> PDT</div>
                    <div className="text-xs font-bold text-white tracking-tight">San Francisco</div>
                    <div className="text-2xl font-extrabold text-white mt-1 tracking-tight">08:42 <span className="text-xs text-gem-sage font-normal">AM</span></div>
                    <div className="text-[10px] text-gem-sage mt-1">May 20 · Tue</div>
                  </div>
                  {/* New York */}
                  <div className="bg-[#1B4D3E]/60 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-[#1B4D3E]/80 hover:border-gem-gold/30">
                    <div className="text-[10px] text-gem-sage flex items-center gap-1 mb-2 font-bold tracking-wider"><Sun className="w-3 h-3 text-gem-gold"/> EDT</div>
                    <div className="text-xs font-bold text-white tracking-tight">New York</div>
                    <div className="text-2xl font-extrabold text-white mt-1 tracking-tight">11:42 <span className="text-xs text-gem-sage font-normal">AM</span></div>
                    <div className="text-[10px] text-gem-sage mt-1">May 20 · Tue</div>
                  </div>
                  {/* London */}
                  <div className="bg-[#A7BFAE] border border-[#1B4D3E]/20 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02]">
                    <div className="text-[10px] flex items-center gap-1 opacity-70 mb-2 font-bold tracking-wider"><Sun className="w-3 h-3"/> BST</div>
                    <div className="text-xs font-bold tracking-tight">London</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">04:42 <span className="text-xs font-normal">PM</span></div>
                    <div className="text-[10px] opacity-70 mt-1">May 20 · Tue</div>
                  </div>
                  {/* Singapore */}
                  <div className="bg-[#F4EFE6] border border-[#0E2A1F]/10 rounded-2xl p-4 text-[#0E2A1F] transition-all duration-300 hover:scale-[1.02]">
                    <div className="text-[10px] flex items-center gap-1 opacity-70 mb-2 font-bold tracking-wider"><Moon className="w-3 h-3 text-gem-gold"/> SGT</div>
                    <div className="text-xs font-bold tracking-tight">Singapore</div>
                    <div className="text-2xl font-extrabold mt-1 tracking-tight">11:42 <span className="text-xs font-normal">PM</span></div>
                    <div className="text-[10px] opacity-70 mt-1">May 20 · Tue</div>
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Team Overlap (Left column, tall bento) */}
              <div className="card-light p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-gem-sage/20 rounded-[28px] text-[#0E2A1F] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                      <Users className="w-4 h-4 text-gem-forest" /> Team Overlap
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gem-forest/10 px-2 py-0.5 rounded text-gem-forest">Best slot</span>
                  </div>
                  
                  <div className="text-xs font-semibold text-[#1B4D3E]/70 mb-1">Optimal Meeting Window</div>
                  <div className="text-2xl font-extrabold tracking-tight mb-1">1:00 PM – 2:30 PM</div>
                  <div className="text-xs font-semibold text-[#1B4D3E]/60 mb-5">Today · 4 members available</div>

                  {/* Timeline Bar */}
                  <div className="relative mb-6 bg-white/50 p-3.5 rounded-2xl border border-gem-forest/5 shadow-sm">
                    <div className="relative h-2 bg-[#E9F1EC] rounded-full overflow-hidden mb-1">
                      <div className="absolute left-[15%] right-[35%] h-full bg-gradient-to-r from-[#1B4D3E] to-[#A7BFAE] rounded-full"></div>
                      <div className="absolute left-[38%] top-1/2 -translate-y-1/2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#0E2A1F] border border-white"></div>
                        <div className="w-2 h-2 rounded-full bg-[#1B4D3E] border border-white"></div>
                        <div className="w-2 h-2 rounded-full bg-[#A7BFAE] border border-white"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-[#1B4D3E]/50">
                      <span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {name: 'You', city: 'San Francisco', tz: 'PDT', gradient: 'from-[#A7BFAE] to-[#1B4D3E]', active: true},
                      {name: 'Alex', city: 'New York', tz: 'EDT', gradient: 'from-[#C8A96A] to-[#8B6D3F]', active: true},
                      {name: 'Maya', city: 'London', tz: 'BST', gradient: 'from-[#E9F1EC] to-[#A7BFAE]', active: true},
                      {name: 'Kenji', city: 'Singapore', tz: 'SGT', gradient: 'from-[#1B4D3E] to-[#0E2A1F]', active: false}
                    ].map((member) => (
                      <div key={member.name} className="flex items-center justify-between transition-transform duration-300 hover:translate-x-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-[10px] font-bold text-white shadow border-2 border-white`}>{member.name[0]}</div>
                          <div>
                            <div className="text-[12px] font-bold leading-tight">{member.name}</div>
                            <div className="text-[9px] text-[#1B4D3E]/60 leading-none">{member.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${member.active ? 'bg-gem-forest' : 'bg-gem-forest/20'}`}></div>
                          <div className="text-[10px] font-bold text-[#1B4D3E]/60">{member.tz}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bento Card 3: Currency & AI (Right column stack) */}
              <div className="flex flex-col gap-6">
                
                {/* Currency Sub-card */}
                <div className="card-light p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-gem-sage/20 rounded-[28px] text-[#0E2A1F]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                      <DollarSign className="w-4 h-4 text-gem-forest" /> Currency Exchange
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gem-forest/10 px-2 py-0.5 rounded text-gem-forest">Live conversion</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    <div className="bg-[#F4EFE6]/80 border border-gem-forest/5 rounded-2xl p-3 flex justify-between items-center shadow-inner">
                      <div>
                        <div className="text-[9px] font-bold opacity-60 mb-0.5">Send Amount</div>
                        <div className="text-xs font-bold flex items-center gap-1">USD <span className="text-[8px] opacity-50">▼</span></div>
                      </div>
                      <div className="text-lg font-extrabold tracking-tight">1,250.00</div>
                    </div>
                    <div className="bg-[#F4EFE6]/80 border border-gem-forest/5 rounded-2xl p-3 flex justify-between items-center shadow-inner">
                      <div>
                        <div className="text-[9px] font-bold opacity-60 mb-0.5">Receive Amount</div>
                        <div className="text-xs font-bold flex items-center gap-1">EUR <span className="text-[8px] opacity-50">▼</span></div>
                      </div>
                      <div className="text-lg font-extrabold tracking-tight">1,158.24</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-[#1B4D3E]/60 border-t border-[#1B4D3E]/10 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span>1 USD = 0.9266 EUR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="40" height="12" viewBox="0 0 48 16" fill="none" className="opacity-50">
                        <path d="M0 12 L4 10 L8 11 L12 8 L16 9 L20 6 L24 7 L28 4 L32 5 L36 3 L40 5 L44 4 L48 2" stroke="#C8A96A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm text-[8px] border border-[#1B4D3E]/5"><div className="w-1 h-1 rounded-full bg-gem-forest animate-pulse"></div> Live</span>
                    </div>
                  </div>
                </div>

                {/* AI Ask Sub-card */}
                <div className="card-light p-6 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.1)] border border-gem-sage/20 rounded-[28px] text-[#0E2A1F] flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold tracking-wide mb-3">
                    <Sparkles className="w-4 h-4 text-gem-forest animate-pulse" /> Ask GlobalSync AI
                  </div>
                  
                  <div className="bg-[#E9F1EC] rounded-2xl p-4 pr-12 relative border border-[#1B4D3E]/10 shadow-inner flex-1 flex items-center">
                    <p className="text-[12px] font-medium text-[#1B4D3E] leading-relaxed">
                      "What's the best time to meet between NY, London, and Singapore next week?"
                    </p>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E2A1F] flex items-center justify-center hover:bg-[#1B4D3E] cursor-pointer transition-colors shadow">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FEATURE STRIP */}
      <section className="bg-[#F4EFE6] text-[#0E2A1F] py-16 px-6 relative z-20 rounded-t-[40px] mt-16 shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          
          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 bg-[#0E2A1F] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Globe className="w-7 h-7 text-[#A7BFAE]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">World Clocks</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Real-time clocks for any city in the world.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 bg-[#A7BFAE] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Users className="w-7 h-7 text-[#0E2A1F]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">Smart Scheduling</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Find the best meeting times across time zones.</p>
            </div>
          </div>

          <div className="flex items-start gap-5 lg:border-r border-[#0E2A1F]/10 lg:pr-6">
            <div className="w-14 h-14 border border-[#1B4D3E]/30 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-7 h-7 text-[#1B4D3E]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">Live Currency</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Real-time exchange rates with no hidden fees.</p>
            </div>
          </div>

          <div className="flex items-start gap-5 lg:pr-6">
            <div className="w-14 h-14 bg-[#F4EFE6] border border-[#0E2A1F]/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-7 h-7 text-[#0E2A1F]" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1.5">AI Copilot</h3>
              <p className="text-[15px] font-medium opacity-70 leading-snug">Ask anything. Get instant, accurate answers.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* REMAINDER OF THE PAGE */}
      <div className="bg-[#F4EFE6] text-[#0E2A1F] pb-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-serif text-[40px] md:text-5xl font-semibold text-center mb-20 pt-20 border-t border-[#0E2A1F]/10">Built for teams that work across borders.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <Link to="/time-zone-converter" className="group p-10 rounded-[32px] bg-[#E9F1EC] hover:bg-white transition-all border border-[#0E2A1F]/5 hover:border-[#C8A96A]/50 hover:shadow-xl">
               <Clock className="w-10 h-10 text-[#1B4D3E] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Time Zone Converter</h3>
               <p className="text-[#1B4D3E]/70 font-medium mb-8 leading-relaxed">Compare multiple cities instantly and understand the exact local time for every participant.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/meeting-planner" className="group p-10 rounded-[32px] bg-[#0E2A1F] text-white hover:border-[#C8A96A]/50 border border-transparent transition-all hover:shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
               <Map className="w-10 h-10 text-[#C8A96A] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Meeting Overlap Finder</h3>
               <p className="text-[#A7BFAE] font-medium mb-8 leading-relaxed">Find the most respectful time slots across regions without forcing someone into midnight meetings.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/currency-converter" className="group p-10 rounded-[32px] bg-[#0E2A1F] text-white hover:border-[#C8A96A]/50 border border-transparent transition-all hover:shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
               <TrendingUp className="w-10 h-10 text-[#C8A96A] mb-6" />
               <h3 className="text-2xl font-bold mb-3">Currency Converter</h3>
               <p className="text-[#A7BFAE] font-medium mb-8 leading-relaxed">Convert live exchange rates for invoices, travel, consulting, and international planning.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
            
            <Link to="/dashboard" className="group p-10 rounded-[32px] bg-white hover:bg-[#E9F1EC] transition-all border border-[#0E2A1F]/5 hover:border-[#C8A96A]/50 hover:shadow-xl">
               <Sparkles className="w-10 h-10 text-[#1B4D3E] mb-6" />
               <h3 className="text-2xl font-bold mb-3">AI Global Assistant</h3>
               <p className="text-[#1B4D3E]/70 font-medium mb-8 leading-relaxed">Type a real-world question and get a direct answer without switching tabs or doing mental math.</p>
               <div className="text-[#C8A96A] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Open tool <ArrowRight className="w-4 h-4" /></div>
            </Link>
          </div>
          
          <div className="bg-[#0E2A1F] rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 mix-blend-overlay"></div>
             <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-6 relative z-10">Bring your global work into perfect sync.</h2>
             <p className="text-[19px] text-[#A7BFAE] max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">Plan meetings, convert currencies, compare time zones, and ask AI for global answers in one elegant workspace.</p>
             <Link to="/dashboard" className="inline-block btn-primary relative z-10 text-[17px] px-8 py-4">
               Start using GlobalSync AI
             </Link>
          </div>
          
        </div>
      </div>
      
      <div className="bg-[#0A1E16]">
        <SiteFooter />
      </div>
    </div>
  );
}
