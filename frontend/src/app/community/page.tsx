"use client";

import React, { useState, useEffect } from "react";
import { CommunityHub } from "@/components/CommunityHub";
import { api } from "@/services/api";
import {
  SchoolRecessFlag,
  SmogHotspotReport,
  CleanAirSanctuary,
  CarpoolItem,
} from "@/types";

export default function CommunityPage() {
  const [flags, setFlags] = useState<SchoolRecessFlag[]>([]);
  const [hotspots, setHotspots] = useState<SmogHotspotReport[]>([]);
  const [sanctuaries, setSanctuaries] = useState<CleanAirSanctuary[]>([]);
  const [carpools, setCarpools] = useState<CarpoolItem[]>([]);

  useEffect(() => {
    Promise.all([
      api.getRecessFlags(),
      api.getHotspots(),
      api.getSanctuaries(),
      api.getCarpools(),
    ])
      .then(([flg, hot, sanc, carp]) => {
        setFlags(flg);
        setHotspots(hot);
        setSanctuaries(sanc);
        setCarpools(carp);
      })
      .catch(() => {});
  }, []);

  const handleHotspotCreated = (newReport: SmogHotspotReport) => {
    setHotspots([newReport, ...hotspots]);
  };

  return (
    <div className="space-y-4">
      <CommunityHub
        flags={flags}
        hotspots={hotspots}
        sanctuaries={sanctuaries}
        carpools={carpools}
        onHotspotCreated={handleHotspotCreated}
      />
    </div>
  );
}
