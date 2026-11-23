"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GenAICoach } from "@/components/GenAICoach";
import { api, FALLBACK_AQI } from "@/services/api";
import { HouseholdProfile } from "@/types";

function CoachContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
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
  const [currentAQI, setCurrentAQI] = useState<number>(FALLBACK_AQI.aqi);

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
    api.getCurrentAQI().then((a) => setCurrentAQI(a.aqi)).catch(() => {});
  }, []);

  return (
    <GenAICoach
      profile={profile}
      currentAQI={currentAQI}
      initialPrompt={initialPrompt}
    />
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={<div className="text-xs text-slate-400 p-4">Loading Grounded Coach...</div>}>
      <CoachContent />
    </Suspense>
  );
}
