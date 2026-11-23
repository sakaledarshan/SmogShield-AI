"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { ProfileModal } from "@/components/ProfileModal";
import { api, FALLBACK_AQI } from "@/services/api";
import { AQICurrentResponse, HouseholdProfile } from "@/types";
import { Sparkles } from "lucide-react";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aqiData, setAqiData] = useState<AQICurrentResponse>(FALLBACK_AQI);
  const [profile, setProfile] = useState<HouseholdProfile>({
    user_id: "usr-demo",
    has_infants: true,
    has_elderly: false,
    has_respiratory_conditions: true,
    home_type: "apartment",
    has_hepa_filter: false,
    primary_commute_mode: "transit",
    budget_tier: "low",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    api.getCurrentAQI().then(setAqiData).catch(() => {});
    api.getProfile().then(setProfile).catch(() => {});

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleProfileUpdated = async (updated: HouseholdProfile) => {
    setProfile(updated);
    showToast("Household profile saved! System updated.");
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-950 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        locationName={aqiData.location.city_name || "Downtown Metro Corridor"}
        hasInversionAlert={aqiData.inversion_alert.detected}
        onOpenProfile={() => setIsProfileOpen(true)}
        isOnline={isOnline}
      />

      {/* Route Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4">{children}</main>

      {/* Profile Modal */}
      <ProfileModal
        initialProfile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Persistent Bottom Nav */}
      <BottomNav />
    </div>
  );
};
