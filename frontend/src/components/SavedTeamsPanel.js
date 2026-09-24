import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSharedTeam, sharedTeamPath } from "@/lib/sharedTeam";
import {
  Users, X, Plus, Copy, Trash2, ExternalLink, ArrowUp, ArrowDown,
  Check, GripVertical, RefreshCw
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getLocalCityTimezone, getNormalizedUtcOffset } from "./TimeConverter";
import { fireAnalyticsEvent } from "@/lib/analytics";



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
  const isPaid = false;
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New team form state
  const [teamName, setTeamName] = useState("");
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
    try {
      const teams = JSON.parse(localStorage.getItem("gs_saved_teams") || "[]");
      if (Array.isArray(teams)) setSavedTeams(teams.filter(t => t && typeof t.slug === "string"));
    } catch { /* Storage may be unavailable. */ }
  }, []);


  const handleCopyLink = (team) => {
    const url = `${window.location.origin}${sharedTeamPath(team)}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Workspace link copied to clipboard!");
      fireAnalyticsEvent("team_link_shared", { members_count: team.members?.length || 0 });
    });
  };

  const handleDeleteTeam = (slugToDelete) => {
    const updated = savedTeams.filter(t => t.slug !== slugToDelete);
    setSavedTeams(updated);
    localStorage.setItem("gs_saved_teams", JSON.stringify(updated));
    toast.success("Workspace removed from your local panel");
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
    if (members.length === 0) {
      toast.error("Please add at least one member to the workspace.");
      return;
    }

    // Limit check for free tier
    if (!isPaid && members.length > 6) {
      toast.error("A shared workspace supports up to 6 members. Please remove a member to continue.");
      return;
    }

    setIsSavingTeam(true);
    try {
      const payload = {
        name: teamName.trim(),
        is_paid: false,
        members: members
      };

      const savedTeam = createSharedTeam(payload);

      // Update local storage
      const newSavedTeams = [...savedTeams, savedTeam];
      setSavedTeams(newSavedTeams);
      try { localStorage.setItem("gs_saved_teams", JSON.stringify(newSavedTeams)); }
      catch { toast.info("Bookmark the workspace link; this browser could not remember it."); }

      toast.success("Workspace saved. Anyone with the link can view it.");
      fireAnalyticsEvent("team_created", {
        members_count: members.length,
        is_paid: isPaid
      });

      // Reset Form and close
      setTeamName("");
      setMembers([]);
      setShowCreateModal(false);

      // Navigate to the newly generated team page
      navigate(sharedTeamPath(savedTeam));
      setIsOpen(false);
    } catch (err) {
      const msg = err.message || "Failed to save team workspace.";
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
            className="flex items-center gap-1.5 p-2 rounded-xl bg-surface border border-line hover:border-line text-ink transition-all group"
            title="Team Workspaces"
            data-testid="saved-teams-trigger"
          >
            <Users className="w-5 h-5 text-pine group-hover:scale-105 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline">Teams</span>
            {savedTeams.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-gem-gold animate-pulse shrink-0" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="bg-paper border-l border-line text-ink w-full sm:max-w-md overflow-y-auto z-[90]">
          <SheetHeader className="pb-5 border-b border-line">
            <SheetTitle className="font-heading font-bold text-2xl text-ink flex items-center gap-2">
              <Users className="w-6 h-6 text-pine" /> Team Workspaces
            </SheetTitle>
            <SheetDescription className="text-quiet text-xs">
              Manage saved teams and generate shared time conversion workspaces.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-5 bg-surface border border-line rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold">Free shared workspaces · up to 6 members</p>
            <p className="text-xs text-quiet">Workspaces are saved in this browser. The complete share link contains the team details and works on another device without signing in.</p>
          </div>

          {/* List of Saved Teams */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-heading font-semibold text-sm text-ink uppercase tracking-wider">Your Workspaces</p>
              <span className="text-[10px] text-quiet font-bold bg-surface px-2 py-0.5 rounded border border-line">
                {savedTeams.length} saved
              </span>
            </div>

            {savedTeams.length === 0 ? (
              <div className="border border-dashed border-line rounded-2xl p-8 text-center text-quiet text-xs">
                No workspaces created yet.
              </div>
            ) : (
              <div className="space-y-3">
                {savedTeams.map((team) => (
                  <div key={team.slug} className="bg-surface border border-line rounded-2xl p-4 hover:border-line transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-heading font-bold text-ink text-sm group-hover:text-pine transition-colors block">{team.name}</span>
                        <p className="text-[10px] text-quiet mt-0.5">/team/{team.slug}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {team.is_paid && (
                          <span className="text-[9px] font-bold text-pine bg-gem-gold/10 border border-line px-1.5 py-0.5 rounded uppercase">PRO</span>
                        )}
                        <span className="text-[10px] text-quiet font-semibold bg-surface border border-line px-1.5 py-0.5 rounded">
                          {team.members?.length || 0} p.
                        </span>
                      </div>
                    </div>

                    {/* Member Cities Summary */}
                    <p className="text-[11px] text-quiet line-clamp-1">
                      {team.members?.map(m => m.name).join(" • ")}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-line">
                      <button
                        onClick={() => handleDeleteTeam(team.slug)}
                        className="text-xs text-ink hover:text-red-800 p-1 hover:bg-surface rounded transition-all"
                        title="Remove Team"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(team)}
                          className="flex items-center gap-1 text-[11px] font-bold text-quiet hover:text-pine bg-surface border border-line px-2 py-1 rounded transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Share
                        </button>
                        <button
                          onClick={() => { navigate(sharedTeamPath(team)); setIsOpen(false); }}
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
              onClick={() => { setIsOpen(false); setShowCreateModal(true); }}
              className="w-full mt-4 btn-gradient rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 "
              data-testid="create-team-btn"
            >
              <Plus className="w-4 h-4" /> Create Team Workspace
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-paper text-ink max-w-lg p-7 max-h-[90vh] overflow-y-auto z-[100]">
          <DialogTitle className="font-heading text-2xl font-bold">Create Team Workspace</DialogTitle>
          <DialogDescription className="text-quiet">Build a public time-zone page for up to six people.</DialogDescription>
            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              {/* Team Name */}
              <div>
                <label htmlFor="team-name-input" className="text-quiet text-xs font-semibold mb-1.5 block uppercase tracking-wider">Team / Client Name</label>
                <input
                  id="team-name-input"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Design Studio, Austin-Berlin Sync"
                  className="onboarding-input"
                />
              </div>

              <p className="text-xs text-quiet bg-surface p-3 rounded-xl">
                Anyone with this link can view the workspace name, member labels and cities.
                Use role labels instead of private details. Shared workspaces cannot be edited;
                create a new link when your team changes. The complete link contains these details. No email address is required.
              </p>

              {/* Workspace Members list builder */}
              <div className="space-y-3 border-t border-line pt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-ink">Team Members ({members.length} added)</div>

                {/* Member Input Builder Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
                  <div className="w-full">
                    <label className="text-quiet text-[10px] uppercase font-semibold mb-1 block">Custom Label (Name/Role)</label>
                    <input
                      aria-label="Member label"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      placeholder="e.g. Alice (Lead Developer)"
                      className="w-full h-10 px-3 bg-paper border border-line rounded-xl text-xs text-ink outline-none focus:border-line"
                    />
                  </div>
                  <div className="relative w-full">
                    <label className="text-quiet text-[10px] uppercase font-semibold mb-1 block">City Location</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          aria-label="Member city"
                          value={citySearch}
                          onChange={e => { setCitySearch(e.target.value); setNewMemberCity(e.target.value); setShowCityDropdown(true); }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="e.g. Dubai"
                          className="w-full h-10 px-3 bg-paper border border-line rounded-xl text-xs text-ink outline-none focus:border-line"
                        />
                        {showCityDropdown && citySearch.trim() && filteredCities.length > 0 && (
                          <div className="absolute z-[110] bottom-11 left-0 right-0 bg-surface border border-line rounded-xl  max-h-40 overflow-y-auto">
                            {filteredCities.slice(0, 5).map(c => (
                              <button
                                key={c}
                                type="button"
                                onMouseDown={() => { setNewMemberCity(c); setCitySearch(c); setShowCityDropdown(false); }}
                                className="w-full text-left px-3 py-2.5 text-xs text-ink hover:bg-surface hover:text-pine transition-colors font-medium border-b border-line last:border-0"
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
                        className="h-10 px-3 bg-gem-gold/20 hover:bg-gem-gold/30 border border-line text-pine font-bold text-xs rounded-xl flex items-center justify-center shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Members Drag/Arrow List */}
                {members.length === 0 ? (
                  <p className="text-[11px] text-quiet text-center py-4 italic">No members added yet. Add at least 1 teammate.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {members.map((m, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        className="flex items-center justify-between bg-surface border border-line rounded-xl px-3 py-2 group cursor-grab active:cursor-grabbing hover:bg-surface transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical className="w-3.5 h-3.5 text-ink shrink-0 select-none group-hover:text-ink" />
                          <div className="min-w-0">
                            {isEditingLabelIndex === idx ? (
                              <input
                                value={editLabelValue}
                                onChange={e => setEditLabelValue(e.target.value)}
                                onBlur={() => saveEditLabel(idx)}
                                onKeyDown={e => { if (e.key === "Enter") saveEditLabel(idx); }}
                                className="h-6 px-1.5 bg-paper border border-line text-xs rounded text-ink outline-none w-36 font-semibold"
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => startEditLabel(idx, m.name)}
                                className="text-xs font-bold text-ink cursor-pointer border-b border-dashed border-line hover:border-line"
                                title="Click to edit name/label"
                              >
                                {m.name}
                              </span>
                            )}
                            <span className="text-[10px] text-quiet block font-medium truncate mt-0.5">{m.city} ({m.utc_offset})</span>
                          </div>
                        </div>

                        {/* Reorder and Delete Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => moveMember(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-ink hover:text-pine disabled:opacity-20 disabled:hover:text-ink"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveMember(idx, 1)}
                              disabled={idx === members.length - 1}
                              className="p-1 text-ink hover:text-pine disabled:opacity-20 disabled:hover:text-ink"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="p-1 text-ink hover:text-red-800 rounded-full hover:bg-surface"
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
              <div className="flex justify-end gap-3 border-t border-line pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-line hover:bg-surface text-quiet text-sm font-semibold transition-colors"
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
        </DialogContent>
      </Dialog>
    </>
  );
}
