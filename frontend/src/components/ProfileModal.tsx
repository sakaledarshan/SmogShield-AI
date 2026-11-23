"use client";

import React, { useState } from "react";
import { HouseholdProfile } from "@/types";
import { User, Baby, HeartPulse, Wind, Check } from "lucide-react";
import { api } from "@/services/api";

interface ProfileModalProps {
  initialProfile: HouseholdProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updated: HouseholdProfile) => void;
}

type HomeTypeOption = "apartment" | "detached_house" | "townhouse";
type CommuteOption = "walk" | "two_wheeler" | "transit" | "car";
type BudgetOption = "zero_cost" | "low" | "medium" | "high";

export const ProfileModal: React.FC<ProfileModalProps> = ({
  initialProfile,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<HouseholdProfile>(initialProfile);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      onProfileUpdated(updated);
      onClose();
    } catch {
      onProfileUpdated(profile);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-750 p-5 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Household & Lifestyle Profile</h3>
              <p className="text-xs text-slate-400">Calibrates time-blocked routines and DIY recommendations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Household Vulnerability */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Household Vulnerabilities</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProfile({ ...profile, has_infants: !profile.has_infants })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                  profile.has_infants
                    ? "bg-blue-600/30 border-blue-500 text-blue-200"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                <Baby className="w-4 h-4 shrink-0" />
                <span>Infants / Toddlers</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setProfile({
                    ...profile,
                    has_respiratory_conditions: !profile.has_respiratory_conditions,
                  })
                }
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                  profile.has_respiratory_conditions
                    ? "bg-purple-600/30 border-purple-500 text-purple-200"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                <HeartPulse className="w-4 h-4 shrink-0" />
                <span>Asthma / Respiratory</span>
              </button>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, has_elderly: !profile.has_elderly })}
                className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                  profile.has_elderly
                    ? "bg-amber-600/30 border-amber-500 text-amber-200"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>Elderly (65+)</span>
              </button>
            </div>
          </div>

          {/* Home Architecture */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Home Architecture & Purifiers</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={profile.home_type}
                onChange={(e) => setProfile({ ...profile, home_type: e.target.value as HomeTypeOption })}
                className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="apartment">Multi-Story Apartment</option>
                <option value="detached_house">Standalone House</option>
                <option value="townhouse">Townhouse / Row Home</option>
              </select>

              <button
                type="button"
                onClick={() => setProfile({ ...profile, has_hepa_filter: !profile.has_hepa_filter })}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition ${
                  profile.has_hepa_filter
                    ? "bg-teal-600/30 border-teal-500 text-teal-200"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>Has Commercial HEPA</span>
              </button>
            </div>
          </div>

          {/* Commute Mode */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Primary Commute Mode</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "transit" as const, label: "Metro / Transit" },
                { id: "two_wheeler" as const, label: "Two-Wheeler" },
                { id: "car" as const, label: "Car" },
                { id: "walk" as const, label: "Walk / Cycle" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, primary_commute_mode: m.id as CommuteOption })}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    profile.primary_commute_mode === m.id
                      ? "bg-blue-600/40 border-blue-500 text-white font-bold"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Budget Constraint Tier</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "zero_cost" as const, label: "Zero-Cost DIY", desc: "Towel seals & mopping" },
                { id: "low" as const, label: "Low-Cost ($50)", desc: "Corsi-Rosenthal box" },
                { id: "medium" as const, label: "Mid-Tier", desc: "Entry HEPA" },
                { id: "high" as const, label: "Premium", desc: "Central Smart HVAC" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, budget_tier: b.id as BudgetOption })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    profile.budget_tier === b.id
                      ? "bg-teal-600/40 border-teal-500 text-white font-bold"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <div>{b.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{b.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-slate-800 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
