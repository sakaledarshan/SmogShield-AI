"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroAQICard } from "@/components/HeroAQICard";
import { SafeVentilationWindow } from "@/components/SafeVentilationWindow";
import { RoutineChecklist } from "@/components/RoutineChecklist";
import { QuickAskBar } from "@/components/QuickAskBar";
import { api, FALLBACK_AQI } from "@/services/api";
import { AQICurrentResponse, DailyRoutineResponse } from "@/types";

export default function TodayActionPage() {
  const router = useRouter();
  const [aqiData, setAqiData] = useState<AQICurrentResponse>(FALLBACK_AQI);
  const [routine, setRoutine] = useState<DailyRoutineResponse | null>(null);

  useEffect(() => {
    api.getCurrentAQI().then(setAqiData).catch(() => {});
    api.getProfile().then((p) => {
      api.getDailyRoutine(p).then(setRoutine).catch(() => {});
    }).catch(() => {});
  }, []);

  const handleSelectQuickPrompt = (promptText: string) => {
    router.push(`/coach?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <div className="space-y-4">
      {/* 3-Second Hero AQI Card with Outdoor vs Indoor Contrast */}
      <HeroAQICard data={aqiData} indoorAQI={38} />

      {/* Safe Ventilation Window Timeline */}
      <SafeVentilationWindow
        safeWindow={aqiData.safe_ventilation_window}
        inversionAlert={aqiData.inversion_alert}
      />

      {/* Personalized Routine Checklist */}
      {routine && <RoutineChecklist routine={routine} />}

      {/* Quick-Ask GenAI Input Bar */}
      <QuickAskBar onSelectPrompt={handleSelectQuickPrompt} />
    </div>
  );
}
