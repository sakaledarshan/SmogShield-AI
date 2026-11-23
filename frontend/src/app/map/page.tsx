"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import { SmogHotspotReport, CleanAirSanctuary } from "@/types";
import { Navigation } from "lucide-react";

// Lazy-load heavy Map component with ssr: false to prevent initial bundle bloat
const LiveSmogMap = dynamic(
  () => import("@/components/LiveSmogMap").then((mod) => mod.LiveSmogMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-2">
        <Navigation className="w-8 h-8 text-teal-400 animate-spin" />
        <span className="text-xs">Loading Live Smog Vector Map & Commute Layers...</span>
      </div>
    ),
  }
);

export default function MapPage() {
  const [hotspots, setHotspots] = useState<SmogHotspotReport[]>([]);
  const [sanctuaries, setSanctuaries] = useState<CleanAirSanctuary[]>([]);

  useEffect(() => {
    Promise.all([api.getHotspots(), api.getSanctuaries()])
      .then(([h, s]) => {
        setHotspots(h);
        setSanctuaries(s);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <LiveSmogMap hotspots={hotspots} sanctuaries={sanctuaries} />
    </div>
  );
}
