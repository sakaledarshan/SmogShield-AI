"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav, TabKey } from "@/components/BottomNav";
import { HeroAQICard } from "@/components/HeroAQICard";
import { SafeVentilationWindow } from "@/components/SafeVentilationWindow";
import { RoutineChecklist } from "@/components/RoutineChecklist";
import { QuickAskBar } from "@/components/QuickAskBar";
import { LiveSmogMap } from "@/components/LiveSmogMap";
import { GenAICoach } from "@/components/GenAICoach";
import { ImpactLedger } from "@/components/ImpactLedger";
import { CommunityHub } from "@/components/CommunityHub";
import { ProfileModal } from "@/components/ProfileModal";
import { api, FALLBACK_AQI } from "@/services/api";
import {
  AQICurrentResponse,
  DailyRoutineResponse,
  HouseholdProfile,
  CumulativeLedger,
  SmogHotspotReport,
  SchoolRecessFlag,
  CleanAirSanctuary,
  CarpoolItem,
  TimeBlockAction,
} from "@/types";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("action");
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
  const [routine, setRoutine] = useState<DailyRoutineResponse | null>(null);
  const [ledger, setLedger] = useState<CumulativeLedger | null>(null);
  const [hotspots, setHotspots] = useState<SmogHotspotReport[]>([]);
  const [flags, setFlags] = useState<SchoolRecessFlag[]>([]);
  const [sanctuaries, setSanctuaries] = useState<CleanAirSanctuary[]>([]);
  const [carpools, setCarpools] = useState<CarpoolItem[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedCoachPrompt, setSelectedCoachPrompt] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Load Initial Data
  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);

    const loadData = async () => {
      try {
        const [curAQI, curRoutine, curLedger, curHotspots, curFlags, curSanctuaries, curCarpools, curProfile] =
          await Promise.all([
            api.getCurrentAQI(),
            api.getDailyRoutine(profile),
            api.getLedger(),
            api.getHotspots(),
            api.getRecessFlags(),
            api.getSanctuaries(),
            api.getCarpools(),
            api.getProfile(),
          ]);

        setAqiData(curAQI);
        setRoutine(curRoutine);
        setLedger(curLedger);
        setHotspots(curHotspots);
        setFlags(curFlags);
        setSanctuaries(curSanctuaries);
        setCarpools(curCarpools);
        if (curProfile) setProfile(curProfile);
      } catch (e) {
        console.error("Data load error:", e);
      }
    };

    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleActionToggled = (action: TimeBlockAction, completed: boolean) => {
    if (completed) {
      showToast(`+${action.pm25_reduction_ug} µg PM2.5 avoided! Cumulative ledger updated.`);
      if (ledger) {
        setLedger({
          ...ledger,
          weekly_pm25_avoided_ug: round(ledger.weekly_pm25_avoided_ug + action.pm25_reduction_ug),
          weekly_cigarettes_avoided: round(
            (ledger.weekly_pm25_avoided_ug + action.pm25_reduction_ug) / 22.0
          ),
        });
      }
    }
  };

  const handleSelectQuickPrompt = (promptText: string) => {
    setSelectedCoachPrompt(promptText);
    setActiveTab("coach");
  };

  const handleProfileUpdated = async (updated: HouseholdProfile) => {
    setProfile(updated);
    showToast("Household profile saved! Recalibrating daily routines...");
    const newRoutine = await api.getDailyRoutine(updated);
    setRoutine(newRoutine);
  };

  const round = (num: number) => Math.round(num * 10) / 10;

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

      {/* Main Tab Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4">
        {/* Tab 1: Today's Action Hub */}
        {activeTab === "action" && (
          <div className="space-y-4">
            {/* 3-Second Hero AQI Card with Outdoor vs Indoor Contrast */}
            <HeroAQICard data={aqiData} indoorAQI={38} />

            {/* Safe Ventilation Window Timeline */}
            <SafeVentilationWindow
              safeWindow={aqiData.safe_ventilation_window}
              inversionAlert={aqiData.inversion_alert}
            />

            {/* Personalized Routine Checklist */}
            {routine && (
              <RoutineChecklist
                routine={routine}
                onActionToggled={handleActionToggled}
              />
            )}

            {/* Quick-Ask GenAI Input Bar */}
            <QuickAskBar onSelectPrompt={handleSelectQuickPrompt} />
          </div>
        )}

        {/* Tab 2: Live Smog Map */}
        {activeTab === "map" && (
          <LiveSmogMap hotspots={hotspots} sanctuaries={sanctuaries} />
        )}

        {/* Tab 3: SmogShield AI Coach */}
        {activeTab === "coach" && (
          <GenAICoach
            profile={profile}
            currentAQI={aqiData.aqi}
            initialPrompt={selectedCoachPrompt}
          />
        )}

        {/* Tab 4: Impact & Habits */}
        {activeTab === "impact" && ledger && (
          <ImpactLedger ledger={ledger} />
        )}

        {/* Tab 5: Community Hub */}
        {activeTab === "community" && (
          <CommunityHub
            flags={flags}
            hotspots={hotspots}
            sanctuaries={sanctuaries}
            carpools={carpools}
            onHotspotCreated={(newRep) => {
              setHotspots([newRep, ...hotspots]);
              showToast("Hotspot reported! Coordinates fuzzed by ~500m for privacy.");
            }}
          />
        )}
      </main>

      {/* Household Profile Modal */}
      <ProfileModal
        initialProfile={profile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
