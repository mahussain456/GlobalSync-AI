import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, Clock, ArrowRight, CheckCircle2, AlertCircle, Copy, Share2, Calendar, ShieldCheck, Heart 
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { toast } from "sonner";
import { 
  getLocalTime, getShiftedTime, getCardTheme, parseOffset, clientSideMeetingOverlap 
} from "@/components/TimeConverter";
import { generateIcsFile } from "@/lib/ics";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

// Custom Read-Only City Card tailored to display member names + roles
function TeamMemberCard({ member, timeData }) {
  const theme = getCardTheme(timeData.hour);
  const ThemeIcon = theme.icon;

  return (
    <div className={`relative overflow-hidden rounded-[28px] border p-5 transition-all duration-500 ${theme.bg} ${theme.border} group`}>
      <div className={`absolute inset-0 ${theme.glow} pointer-events-none transition-opacity duration-500`} />

      <div className="relative z-10 flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-gem-beige text-lg tracking-tight group-hover:text-gem-gold transition-colors">
            {member.name}
          </h3>
          <p className="text-xs text-gem-sage mt-0.5 font-semibold flex items-center gap-1">
             {member.city} <span className="opacity-60">({member.utc_offset})</span>
          </p>
        </div>
        <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-0.5 font-bold flex items-center gap-1 bg-white/5 border border-white/10 ${theme.text}`}>
          <ThemeIcon className="w-3 h-3" /> {theme.label}
        </span>
      </div>

      <div className="relative z-10 mt-6">
        <div className="font-heading text-4xl font-bold text-gem-beige tracking-tight tabular-nums flex items-baseline gap-1">
          {timeData.time12.split(" ")[0]}
          <span className="text-sm font-semibold text-gem-mist uppercase">{timeData.time12.split(" ")[1]}</span>
        </div>
        <div className="text-xs text-gem-sage/80 mt-1.5 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-gem-gold/60" /> {timeData.date}
        </div>
      </div>
    </div>
  );
}

// Visual timeline representation of team members business hour overlaps
function TeamOverlapBar({ cityDetails, overlapStartDec, overlapEndDec }) {
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];
  return (
    <div className="space-y-4">
      <div className="relative flex pl-28 pr-2 mb-2 h-4">
        {hours.map((h) => (
          <div key={h} className="absolute text-[10px] font-bold text-gem-mist/50" style={{ left: `calc(${(h / 24) * 100}% + 7rem)` }}>
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
      </div>
      
      {cityDetails.filter(c => c.known !== false).map((city) => {
        const start = city.business_start_utc_dec || 0;
        const end = city.business_end_utc_dec || 17;
        const endNorm = end > 24 ? 24 : end;
        
        const startPct = (start / 24) * 100;
        const widthPct = ((endNorm - start) / 24) * 100;
        
        const ovStartPct = overlapStartDec != null ? (overlapStartDec / 24) * 100 : null;
        const ovWidthPct = overlapStartDec != null && overlapEndDec != null
          ? ((overlapEndDec - overlapStartDec) / 24) * 100 : 0;
          
        return (
          <div key={city.name} className="flex items-center gap-3 group">
            <span className="w-28 text-xs text-right text-gem-sage font-semibold truncate shrink-0 tracking-tight">{city.name}</span>
            <div className="flex-1 bg-white/5 h-2.5 rounded-full relative overflow-hidden border border-white/5">
              {/* Local Business Hours (Base Track) */}
              <div
                className="absolute h-full bg-gem-gold/15 rounded-full transition-all duration-300"
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
              />
              {/* Overlapping Zone (Highlight Track) */}
              {ovStartPct != null && ovWidthPct > 0 && (
                <div
                  className="absolute h-full bg-gem-gold rounded-full z-10 shadow-[0_0_10px_rgba(200,169,106,0.6)] transition-all duration-300"
                  style={{ left: `${ovStartPct}%`, width: `${ovWidthPct}%` }}
                />
              )}
            </div>
            <span className="text-[10px] text-gem-mist/60 shrink-0 w-32 hidden md:block font-medium">
              {city.overlap_start_local ? `${city.overlap_start_local}` : city.business_hours_local}
            </span>
          </div>
        );
      })}
      
      <div className="flex gap-4 pl-28 mt-4 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gem-sage">
          <div className="w-3 h-1.5 bg-gem-gold/20 rounded" /> Business Hours (9am-5pm)
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gem-gold">
          <div className="w-3 h-1.5 bg-gem-gold rounded shadow-[0_0_5px_rgba(200,169,106,0.5)]" /> Working Overlap Window
        </div>
      </div>
    </div>
  );
}

export default function TeamWorkspacePage() {
  const { slug } = useParams();
  
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedHour, setSelectedHour] = useState(12);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());
  const [overlapResult, setOverlapResult] = useState(null);
  const [baseCityName, setBaseCityName] = useState("");

  // Load team specifications
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/teams/${slug}`);
        setTeam(res.data);
        if (res.data.members?.length > 0) {
          setBaseCityName(res.data.members[0].name);
        }
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load team workspace. Check the URL slug.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [slug]);

  // Clock tick timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync clock hour to base member's location unless custom time slider active
  useEffect(() => {
    if (!isCustomTime && team?.members?.length > 0) {
      const baseMember = team.members.find(m => m.name === baseCityName) || team.members[0];
      if (baseMember?.timezone_id) {
        try {
          const hourStr = new Intl.DateTimeFormat("en-US", {
            timeZone: baseMember.timezone_id,
            hour: "numeric",
            hour12: false
          }).format(liveTime);
          setSelectedHour(parseInt(hourStr) % 24);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [liveTime, isCustomTime, baseCityName, team]);

  // Calculate overlaps when team is loaded
  useEffect(() => {
    if (team?.members?.length >= 2) {
      // Map team members to format accepted by overlap calculator
      const cityParams = team.members.map(m => ({
        name: m.name,
        timezone_id: m.timezone_id,
        utc_offset: m.utc_offset
      }));
      const res = clientSideMeetingOverlap(cityParams);
      setOverlapResult(res);
    }
  }, [team]);

  // Share link copy helper
  const handleShareWorkspace = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Workspace link copied to clipboard!");
    });
  };

  // Calendar Export Dispatcher
  const handleCalendarExport = () => {
    if (!overlapResult || !overlapResult.has_overlap) {
      toast.error("Cannot export calendar invite. No working hour overlap available.");
      return;
    }

    try {
      // Determine the meeting date and hour in UTC
      const baseDate = new Date();
      // If we are looking at custom slider, shift to that hour, else current hour
      const baseMember = team.members.find(m => m.name === baseCityName) || team.members[0];
      const baseOffset = parseOffset(baseMember.utc_offset);
      
      const targetUtcDate = new Date(baseDate);
      targetUtcDate.setUTCHours(selectedHour - baseOffset, 0, 0, 0);

      // Export a 1-hour session
      generateIcsFile(team.name, targetUtcDate, 1);
      toast.success("Calendar invite (.ics) generated successfully!");
    } catch (e) {
      toast.error("Failed to generate calendar file.");
    }
  };

  // Copy meeting summary
  const handleCopySchedule = () => {
    if (!overlapResult?.has_overlap) return;
    
    // Build local times summary for everyone
    const summary = team.members.map(m => {
      const timeData = isCustomTime 
        ? getShiftedTime(m.timezone_id, m.utc_offset, team.members[0].utc_offset, selectedHour, liveTime)
        : getLocalTime(m.timezone_id, liveTime);
      return `• ${m.name} (${m.city}): ${timeData.time12}`;
    }).join("\n");

    const text = `Team Meeting Schedule — ${team.name}:\n${summary}\nGenerated via GlobalSync AI.`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Schedule summary copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gem-forest text-gem-beige flex items-center justify-center">
        <div className="text-center space-y-4">
          <Clock className="w-10 h-10 text-gem-gold animate-spin mx-auto" />
          <p className="text-sm text-gem-sage font-medium animate-pulse">Syncing team workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gem-forest text-gem-beige flex flex-col justify-between">
        <SiteNav />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-gem-beige">Workspace Not Found</h1>
          <p className="text-sm text-gem-sage leading-relaxed">{error || "This shared workspace does not exist or has expired."}</p>
          <Link to="/dashboard" className="inline-block btn-gradient rounded-xl px-6 py-3 font-semibold text-sm">
            Go to Main Dashboard
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const ticks = [0, 3, 6, 9, 12, 15, 18, 21];
  const getTickLabel = (h) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  return (
    <div className="min-h-screen bg-gem-forest text-gem-beige relative flex flex-col justify-between">
      <SEOHead
        rawTitle={`${team.name} | Shared Team Workspace — GlobalSync AI`}
        description={`Real-time timezone workspace for ${team.name}. Coordinate calls, inspect business hour overlaps, and schedule cross-border meetings.`}
        canonical={`/team/${slug}`}
        noIndex={true}
      />

      {/* Luxury Background Orbs */}
      <div className="hero-luxury-bg absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gem-forest/20 via-transparent to-gem-forest z-10" />
        <div 
          className="absolute inset-0 opacity-[0.10] mix-blend-screen" 
          style={{
            backgroundImage: "url('/world-map-bg.webp')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center 30%',
            maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)'
          }}
        />
      </div>

      <SiteNav />

      <main className="flex-1 max-w-6xl mx-auto px-6 pt-36 pb-12 w-full z-10 space-y-6">
        {/* Workspace Title Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gem-gold/10 text-gem-gold rounded-full px-3 py-1 text-xs font-semibold border border-gem-gold/25 mb-3">
              <Users className="w-3.5 h-3.5" /> Distributed Workspace
            </div>
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-gem-beige leading-tight">
              {team.name}
            </h1>
            <p className="text-xs text-gem-sage mt-2">
              Workspace created by: <span className="text-gem-beige font-semibold">{team.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWorkspace}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gem-sage hover:text-gem-beige text-xs font-bold transition-all"
            >
              <Share2 className="w-4 h-4" /> Share Link
            </button>
            
            {team.is_paid ? (
              <button
                onClick={handleCalendarExport}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gem-gold text-gem-forest text-xs font-extrabold hover:opacity-90 shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" /> Export Invite (.ics)
              </button>
            ) : (
              <button
                disabled
                title="Premium feature. Upgrade creator account to unlock."
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 text-xs font-bold cursor-not-allowed"
              >
                <Calendar className="w-4 h-4 opacity-40" /> Export Invite (🔒 Paid Only)
              </button>
            )}
          </div>
        </header>

        {/* City Clock Cards Grid */}
        <section className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-heading font-semibold text-lg text-gem-beige flex items-center gap-2">
              <Clock className="w-5 h-5 text-gem-gold" /> Member Time Zones
            </h2>
            <span className="text-xs font-bold text-gem-sage bg-white/5 px-2.5 py-1 rounded border border-white/15">
              Reference Base: {baseCityName}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.members.map((m) => {
              const timeData = isCustomTime 
                ? getShiftedTime(m.timezone_id, m.utc_offset, team.members[0].utc_offset, selectedHour, liveTime)
                : getLocalTime(m.timezone_id, liveTime);

              return (
                <TeamMemberCard
                  key={m.name}
                  member={m}
                  timeData={timeData}
                />
              );
            })}
          </div>
        </section>

        {/* Drag to Shift Time Slider */}
        <section className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-semibold text-gem-beige flex items-center gap-2 text-lg animate-pulse">
                <Clock className="w-5 h-5 text-gem-gold" /> Shift Workspace Clock
              </h3>
              <p className="text-xs text-gem-sage mt-0.5">
                Drag the anchor to shift coordinates and inspect business overlaps across global offices.
              </p>
            </div>
            {isCustomTime && (
              <button
                onClick={() => setIsCustomTime(false)}
                className="px-3.5 py-1.5 rounded-full bg-gem-gold text-gem-forest text-xs font-extrabold hover:opacity-90 transition-all flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Reset to Live
              </button>
            )}
          </div>

          <div className="py-2">
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => {
                setSelectedHour(parseInt(e.target.value));
                setIsCustomTime(true);
              }}
              className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gem-gold focus:outline-none focus:ring-2 focus:ring-gem-gold/40 transition-all slider-custom shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
            />
            
            {/* Slider Tickmarks */}
            <div className="relative flex justify-between mt-4 px-1">
              {ticks.map((t) => {
                const isActive = selectedHour === t;
                return (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedHour(t);
                      setIsCustomTime(true);
                    }}
                    className={`text-[10px] font-bold transition-all flex flex-col items-center gap-1.5 ${
                      isActive ? "text-gem-gold scale-110" : "text-gem-mist/50 hover:text-gem-beige"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? "bg-gem-gold shadow-[0_0_8px_#C8A96A]" : "bg-white/20"}`} />
                    {getTickLabel(t)}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Meeting Overlap visual card */}
        {team.members.length >= 2 && overlapResult && (
          <section className="bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-semibold text-gem-beige flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-gem-gold" /> Shared Overlap Matrix
                </h3>
                <p className="text-xs text-gem-sage mt-0.5">
                  Universal working hour intersections (9:00 AM - 5:00 PM local) across all locations.
                </p>
              </div>

              {overlapResult.has_overlap ? (
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5 font-bold shadow-[0_0_15px_rgba(34,197,94,0.08)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {overlapResult.overlap_duration_hours}h Overlap Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  No Common Overlap
                </span>
              )}
            </div>

            {overlapResult.has_overlap ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
                  <div className="text-[10px] text-gem-sage/70 mb-1.5 font-bold uppercase tracking-wider">Universal Clock Window (UTC)</div>
                  <div className="font-heading font-bold text-gem-beige text-lg">
                    {overlapResult.overlap_start_utc} – {overlapResult.overlap_end_utc}
                  </div>
                </div>
                <div className="bg-gem-gold/10 rounded-2xl p-4 border border-gem-gold/20 col-span-1 sm:col-span-2">
                  <div className="text-[10px] text-gem-gold mb-2 font-bold tracking-wider uppercase">Optimal Meeting Windows</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {overlapResult.city_details?.filter(c => c.best_time_local).map(city => (
                      <div key={city.name} className="text-sm text-gem-beige font-semibold">
                        <span className="text-gem-gold font-bold">{city.name}:</span> {city.best_time_local}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-sm text-orange-300 font-medium">
                No overlapping business hours (9:00 AM - 5:00 PM local) could be identified. Consider scheduling off-hours or rotating the call shift.
              </div>
            )}

            {/* Overlap Timeline component */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <TeamOverlapBar
                cityDetails={overlapResult.city_details || []}
                overlapStartDec={overlapResult.overlap_start_dec}
                overlapEndDec={overlapResult.overlap_end_dec}
              />
            </div>

            {/* Action dispatches */}
            <div className="flex justify-end gap-3 pt-2">
              {overlapResult.has_overlap && (
                <button
                  onClick={handleCopySchedule}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gem-sage hover:text-gem-beige hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
                  title="Copy details to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Schedule Summary
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Free Tier Branding Bar (Removed for Paid) */}
      {!team.is_paid && (
        <section className="bg-gem-gold/10 border-y border-gem-gold/20 py-4 px-6 z-10 text-center">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-gem-sage font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-gem-gold shrink-0" />
              Powered by <strong className="text-gem-gold">GlobalSync AI</strong> — timezone converter for distributed teams.
            </span>
            <Link to="/dashboard" className="text-xs font-bold text-gem-gold hover:underline flex items-center gap-1">
              Create Your Team Workspace Free <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

// Simple local refresh handler for state resetting
function RefreshCw({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
