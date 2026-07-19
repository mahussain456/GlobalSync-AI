import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users, X, Plus, Sparkles, Copy, Trash2, ExternalLink, ArrowUp, ArrowDown, 
  Check, GripVertical, AlertCircle, Shield, ShieldAlert, RefreshCw, Mail
} from "lucide-react";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription 
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { getLocalCityTimezone, getNormalizedUtcOffset } from "./TimeConverter";
import { fireAnalyticsEvent } from "@/lib/analytics";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? `${process.env.REACT_APP_BACKEND_URL}/api` : "/api";

const POPULAR_CITIES = [
  "New York", "San Francisco", "Chicago", "Toronto", "London", "Paris", "Berlin",
  "Amsterdam", "Dubai", "Mumbai", "Bangalore", "Singapore", "Tokyo", "Seoul",
  "Hong Kong", "Shanghai", "Bangkok", "Sydney", "Auckland", "São Paulo",
  "Mexico City", "Los Angeles", "Seattle", "Moscow", "Istanbul"
];

export default function SavedTeamsPanel() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [savedTeams, setSavedTeams] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Sync email search state
  const [syncEmail, setSyncEmail] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // New team form state
  const [teamName, setTeamName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [gdprOptIn, setGdprOptIn] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [members, setMembers] = useState([]);
  
  // Member edit inputs
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberCity, setNewMemberCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isEditingLabelIndex, setIsEditingLabelIndex] = useState(-1);
  const [editLabelValue, setEditLabelValue] = useState("");
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const teams = localStorage.getItem("gs_saved_teams");
    if (teams) setSavedTeams(JSON.parse(teams));

    const paidStatus = localStorage.getItem("gs_is_paid") === "true";
    setIsPaid(paidStatus);
  }, []);

  const toggleUpgrade = async () => {
    if (isPaid) {
      setIsPaid(false);
      localStorage.setItem("gs_is_paid", "false");
      toast.info("Switched to Free Tier (1 team limit, auto-slugs, branding active).");
      return;
    }

    let email = "";
    const storedUser = localStorage.getItem("gs_user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.email) email = u.email;
      } catch {}
    }
    if (!email) {
      email = syncEmail.trim() || creatorEmail.trim() || "upgrade@globalsync-pro.com";
    }

    try {
      const res = await axios.post(`${API}/upgrade/checkout`, {
        email: email,
        plan_type: "monthly",
        origin: window.location.origin
      });
      window.location.href = res.url;
    } catch {
      toast.error("Failed to redirect to simulated upgrade portal.");
    }
  };

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/team/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Workspace link copied to clipboard!");
      fireAnalyticsEvent("team_link_shared", { team_slug: slug });
    });
  };

  const handleDeleteTeam = (slugToDelete) => {
    const updated = savedTeams.filter(t => t.slug !== slugToDelete);
    setSavedTeams(updated);
    localStorage.setItem("gs_saved_teams", JSON.stringify(updated));
    toast.success("Workspace removed from your local panel");
  };

  // Sync teams via API using email address
  const handleSyncTeams = async () => {
    if (!syncEmail.trim()) {
      toast.error("Please enter a valid email to sync.");
      return;
    }
    setIsSyncing(true);
    try {
      const res = await axios.get(`${API}/teams/user/${encodeURIComponent(syncEmail.trim())}`);
      const fetched = res.data.teams || [];
      if (fetched.length === 0) {
        toast.info("No teams found in the database for this email address.");
      } else {
        // Merge into local list
        const merged = [...savedTeams];
        fetched.forEach(ft => {
          if (!merged.find(mt => mt.slug === ft.slug)) {
            merged.push(ft);
          }
        });
        setSavedTeams(merged);
        localStorage.setItem("gs_saved_teams", JSON.stringify(merged));
        toast.success(`Successfully synced ${fetched.length} workspaces!`);
        setSyncEmail("");
      }
    } catch (err) {
      toast.error("Failed to sync team workspaces. Please check your connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Autocomplete city match filter
  const filteredCities = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      toast.error("Please enter a member name/label.");
      return;
    }
    if (!newMemberCity.trim()) {
      toast.error("Please select a city.");
      return;
    }

    const resolved = getLocalCityTimezone(newMemberCity);
    if (!resolved) {
      toast.error(`Could not locate timezone for city "${newMemberCity}".`);
      return;
    }

    const offset = getNormalizedUtcOffset(resolved.timezoneId);
    const newMember = {
      name: newMemberName.trim(),
      city: resolved.name,
      timezone_id: resolved.timezoneId,
      utc_offset: offset
    };

    setMembers(prev => [...prev, newMember]);
    setNewMemberName("");
    setNewMemberCity("");
    setCitySearch("");
    setShowCityDropdown(false);
  };

  // Member reordering helpers (Arrows)
  const moveMember = (index, direction) => {
    const updated = [...members];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    
    // Swap
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMembers(updated);
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", String(index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);
    if (isNaN(draggedIndex) || draggedIndex === targetIndex) return;

    const updated = [...members];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(targetIndex, 0, item);
    setMembers(updated);
  };

  // In-place label editing
  const startEditLabel = (index, currentName) => {
    setIsEditingLabelIndex(index);
    setEditLabelValue(currentName);
  };

  const saveEditLabel = (index) => {
    if (!editLabelValue.trim()) return;
    const updated = [...members];
    updated[index].name = editLabelValue.trim();
    setMembers(updated);
    setIsEditingLabelIndex(-1);
    setEditLabelValue("");
  };

  const handleRemoveMember = (index) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  // Submit team to API
  const handleSaveWorkspace = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast.error("Please enter a workspace name.");
      const nameInput = document.getElementById("team-name-input");
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
        nameInput.focus();
      }
      return;
    }
    if (!creatorEmail.trim()) {
      toast.error("Email address is required to generate workspace links.");
      const emailInput = document.getElementById("creator-email-input");
      if (emailInput) {
        emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
        emailInput.focus();
      }
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(creatorEmail.trim())) {
      toast.error("Please enter a valid email address.");
      const emailInput = document.getElementById("creator-email-input");
      if (emailInput) {
        emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
        emailInput.focus();
      }
      return;
    }
    if (members.length === 0) {
      toast.error("Please add at least one member to the workspace.");
      return;
    }

    // Limit check for free tier
    if (!isPaid && members.length > 6) {
      toast.error("Free tier is limited to 6 members. Please upgrade to the Premium tier or remove members.");
      return;
    }

    // Enforce 1 saved team limit on free tier
    if (!isPaid && savedTeams.length >= 1) {
      toast.warning("Free tier limit reached (1 workspace). Upgrade to Premium to save unlimited teams!", {
        action: {
          label: "Upgrade",
          onClick: () => toggleUpgrade()
        }
      });
      return;
    }

    setIsSavingTeam(true);
    try {
      const payload = {
        name: teamName.trim(),
        email: creatorEmail.trim(),
        opt_in: gdprOptIn,
        custom_slug: isPaid && customSlug.trim() ? customSlug.trim() : null,
        is_paid: isPaid,
        members: members
      };

      const res = await axios.post(`${API}/teams`, payload);
      const savedTeam = res.data.team;
      
      // Update local storage
      const newSavedTeams = [...savedTeams, savedTeam];
      setSavedTeams(newSavedTeams);
      localStorage.setItem("gs_saved_teams", JSON.stringify(newSavedTeams));
      localStorage.setItem("gs_user", JSON.stringify({ name: teamName.trim() + " Owner", email: creatorEmail.trim() }));
      
      toast.success("Workspace saved! Welcome email with link dispatched.");
      fireAnalyticsEvent("team_created", {
        team_name: teamName.trim(),
        members_count: members.length,
        is_paid: isPaid
      });
      
      // Reset Form and close
      setTeamName("");
      setCreatorEmail("");
      setGdprOptIn(false);
      setCustomSlug("");
      setMembers([]);
      setShowCreateModal(false);
      
      // Navigate to the newly generated team page
      navigate(`/team/${savedTeam.slug}`);
      setIsOpen(false);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to save team workspace.";
      toast.error(msg);
    } finally {
      setIsSavingTeam(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button 
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-gem-gold/50 text-gem-beige transition-all group"
            title="Team Workspaces"
            data-testid="saved-teams-trigger"
          >
            <Users className="w-5 h-5 text-gem-gold group-hover:scale-105 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline">Teams</span>
            {savedTeams.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-gem-gold animate-pulse shrink-0" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="bg-gem-forest border-l border-white/10 text-gem-beige w-full sm:max-w-md overflow-y-auto z-[90]">
          <SheetHeader className="pb-5 border-b border-white/5">
            <SheetTitle className="font-heading font-bold text-2xl text-gem-beige flex items-center gap-2">
              <Users className="w-6 h-6 text-gem-gold" /> Team Workspaces
            </SheetTitle>
            <SheetDescription className="text-gem-sage text-xs">
              Manage saved teams and generate shared time conversion workspaces.
            </SheetDescription>
          </SheetHeader>

          {/* Subscription Tier Controller */}
          <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPaid ? (
                  <Sparkles className="w-4 h-4 text-gem-gold animate-bounce" />
                ) : (
                  <Users className="w-4 h-4 text-gem-sage" />
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-gem-beige">
                  Status: <span className={isPaid ? "text-gem-gold font-extrabold" : "text-gem-sage"}>{isPaid ? "Paid Premium" : "Free Tier"}</span>
                </div>
              </div>
              <button 
                onClick={toggleUpgrade}
                className="text-[10px] uppercase font-bold px-2 py-1 bg-gem-gold/10 hover:bg-gem-gold/20 text-gem-gold rounded border border-gem-gold/30 transition-colors"
              >
                {isPaid ? "Downgrade" : "Upgrade to Paid"}
              </button>
            </div>
            <p className="text-[11px] text-gem-sage/80 leading-relaxed">
              {isPaid 
                ? "✓ Unlimited saved teams, custom slugs, .ics calendar exports, and branding removed from shared workspaces." 
                : "Limited to 1 team (up to 6 members). Upgrade to unlock custom slugs and calendar invitations."
              }
            </p>
          </div>

          {/* Sync via Email Section */}
          <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-gem-beige uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gem-gold" /> Sync Across Devices
            </div>
            <p className="text-[11px] text-gem-sage/80">Enter your email to load workspaces you saved on other devices.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="developer@agency.com"
                value={syncEmail}
                onChange={e => setSyncEmail(e.target.value)}
                className="flex-1 h-9 px-3 bg-gem-forest border border-white/10 rounded-lg text-xs text-gem-beige outline-none focus:border-gem-gold/45"
              />
              <button
                onClick={handleSyncTeams}
                disabled={isSyncing || !syncEmail}
                className="px-3 h-9 bg-gem-gold text-gem-forest font-bold rounded-lg text-xs hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Sync"}
              </button>
            </div>
          </div>

          {/* List of Saved Teams */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm text-gem-beige uppercase tracking-wider">Your Workspaces</h3>
              <span className="text-[10px] text-gem-sage font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {savedTeams.length} saved
              </span>
            </div>

            {savedTeams.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center text-gem-sage/50 text-xs">
                No workspaces created yet.
              </div>
            ) : (
              <div className="space-y-3">
                {savedTeams.map((team) => (
                  <div key={team.slug} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-gem-gold/25 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-gem-beige text-sm group-hover:text-gem-gold transition-colors">{team.name}</h4>
                        <p className="text-[10px] text-gem-sage/60 mt-0.5">/team/{team.slug}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {team.is_paid && (
                          <span className="text-[9px] font-bold text-gem-gold bg-gem-gold/10 border border-gem-gold/20 px-1.5 py-0.5 rounded uppercase">PRO</span>
                        )}
                        <span className="text-[10px] text-gem-sage font-semibold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                          {team.members?.length || 0} p.
                        </span>
                      </div>
                    </div>

                    {/* Member Cities Summary */}
                    <p className="text-[11px] text-gem-sage/70 line-clamp-1">
                      {team.members?.map(m => m.name).join(" • ")}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button 
                        onClick={() => handleDeleteTeam(team.slug)}
                        className="text-xs text-white/30 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-all"
                        title="Remove Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCopyLink(team.slug)}
                          className="flex items-center gap-1 text-[11px] font-bold text-gem-sage hover:text-gem-gold bg-white/5 border border-white/10 px-2 py-1 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Share
                        </button>
                        <button 
                          onClick={() => { navigate(`/team/${team.slug}`); setIsOpen(false); }}
                          className="flex items-center gap-1 text-[11px] font-bold text-gem-forest bg-gem-gold hover:opacity-90 px-2.5 py-1 rounded transition-opacity"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full mt-4 btn-gradient rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              data-testid="create-team-btn"
            >
              <Plus className="w-4 h-4" /> Create Team Workspace
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom Creation Glass Modal (Onboarding style) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center onboarding-overlay fade-in">
          <div className="onboarding-card w-full max-w-lg mx-4 p-7 fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-heading text-2xl font-bold text-gem-beige flex items-center gap-2">
                <Users className="w-5.5 h-5.5 text-gem-gold" /> Create Team Workspace
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-white/5 text-white/30 hover:text-gem-beige transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              {/* Team Name */}
              <div>
                <label className="text-gem-beige/60 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Team / Client Name</label>
                <input
                  id="team-name-input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Design Studio, Austin-Berlin Sync"
                  className="onboarding-input"
                />
              </div>

              {/* Email Address & Opt-in */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1.5 block uppercase tracking-wider">Creator Email (To Receive Link)</label>
                  <input
                    id="creator-email-input"
                    type="text"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="onboarding-input"
                  />
                </div>
                <div>
                  <label className="text-gem-beige/60 text-xs font-semibold mb-1.5 block uppercase tracking-wider flex items-center gap-1">
                    Custom Slug {!isPaid && <span className="text-[9px] font-bold text-gem-gold bg-gem-gold/10 px-1 rounded uppercase">Pro</span>}
                  </label>
                  <input
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder={isPaid ? "e.g. ahmed-clients" : "🔒 Premium feature"}
                    disabled={!isPaid}
                    className={`onboarding-input ${!isPaid ? "opacity-40 cursor-not-allowed bg-black/20" : ""}`}
                  />
                </div>
              </div>

              {/* GDPR Opt-in checkbox */}
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <input
                  type="checkbox"
                  id="gdpr-opt-in"
                  checked={gdprOptIn}
                  onChange={(e) => setGdprOptIn(e.target.checked)}
                  className="mt-1 accent-gem-gold cursor-pointer"
                />
                <label htmlFor="gdpr-opt-in" className="text-xs text-gem-sage/80 cursor-pointer leading-tight select-none">
                  Send me occasional tips for remote teams (single opt-in, GDPR compliant).
                </label>
              </div>

              {/* Workspace Members list builder */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gem-beige">Team Members ({members.length} added)</h3>
                
                {/* Member Input Builder Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                  <div className="w-full">
                    <label className="text-gem-beige/40 text-[10px] uppercase font-semibold mb-1 block">Custom Label (Name/Role)</label>
                    <input
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="e.g. Alice (Lead Developer)"
                      className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                    />
                  </div>
                  <div className="relative w-full">
                    <label className="text-gem-beige/40 text-[10px] uppercase font-semibold mb-1 block">City Location</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          value={citySearch}
                          onChange={e => { setCitySearch(e.target.value); setNewMemberCity(e.target.value); setShowCityDropdown(true); }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="e.g. Dubai"
                          className="w-full h-10 px-3 bg-gem-forest border border-white/10 rounded-xl text-xs text-gem-beige outline-none focus:border-gem-gold/45"
                        />
                        {showCityDropdown && citySearch.trim() && filteredCities.length > 0 && (
                          <div className="absolute z-[110] bottom-11 left-0 right-0 bg-[#0d1326]/95 border border-white/10 rounded-xl shadow-2xl max-h-40 overflow-y-auto">
                            {filteredCities.slice(0, 5).map(c => (
                              <button
                                key={c}
                                type="button"
                                onMouseDown={() => { setNewMemberCity(c); setCitySearch(c); setShowCityDropdown(false); }}
                                className="w-full text-left px-3 py-2.5 text-xs text-gem-beige hover:bg-white/10 hover:text-gem-gold transition-colors font-medium border-b border-white/5 last:border-0"
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="h-10 px-3 bg-gem-gold/20 hover:bg-gem-gold/30 border border-gem-gold/35 text-gem-gold font-bold text-xs rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Members Drag/Arrow List */}
                {members.length === 0 ? (
                  <p className="text-[11px] text-gem-sage/40 text-center py-4 italic">No members added yet. Add at least 1 teammate.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {members.map((m, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2 group cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-white/20 shrink-0 select-none group-hover:text-white/40" />
                          <div className="min-w-0">
                            {isEditingLabelIndex === idx ? (
                              <input
                                value={editLabelValue}
                                onChange={e => setEditLabelValue(e.target.value)}
                                onBlur={() => saveEditLabel(idx)}
                                onKeyDown={e => { if (e.key === "Enter") saveEditLabel(idx); }}
                                className="h-6 px-1.5 bg-gem-forest border border-gem-gold text-xs rounded text-gem-beige outline-none w-36 font-semibold"
                                autoFocus
                              />
                            ) : (
                              <span 
                                onClick={() => startEditLabel(idx, m.name)}
                                className="text-xs font-bold text-gem-beige cursor-pointer border-b border-dashed border-white/20 hover:border-gem-gold/70"
                                title="Click to edit name/label"
                              >
                                {m.name}
                              </span>
                            )}
                            <span className="text-[10px] text-gem-sage/65 block font-medium truncate mt-0.5">{m.city} ({m.utc_offset})</span>
                          </div>
                        </div>

                        {/* Reorder and Delete Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => moveMember(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-white/20 hover:text-gem-gold disabled:opacity-20 disabled:hover:text-white/20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMember(idx, 1)}
                              disabled={idx === members.length - 1}
                              className="p-1 text-white/20 hover:text-gem-gold disabled:opacity-20 disabled:hover:text-white/20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-1 text-white/20 hover:text-red-400 rounded-full hover:bg-white/5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gem-sage text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingTeam || members.length === 0}
                  className="btn-gradient rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingTeam ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save & Generate Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
