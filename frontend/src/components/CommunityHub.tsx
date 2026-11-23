"use client";

import React, { useState } from "react";
import {
  SchoolRecessFlag,
  SmogHotspotReport,
  CleanAirSanctuary,
  CarpoolItem
} from "@/types";
import {
  Flag,
  Flame,
  Shield,
  Users,
  MapPin,
  Clock,
  Car,
  Send
} from "lucide-react";
import { api } from "@/services/api";

interface CommunityHubProps {
  flags: SchoolRecessFlag[];
  hotspots: SmogHotspotReport[];
  sanctuaries: CleanAirSanctuary[];
  carpools: CarpoolItem[];
  onHotspotCreated?: (report: SmogHotspotReport) => void;
}

type SubTabKey = "flags" | "hotspots" | "carpools" | "sanctuaries";
type HazardOption = "waste_burning" | "crop_burning" | "industrial_smoke";

export const CommunityHub: React.FC<CommunityHubProps> = ({
  flags,
  hotspots,
  sanctuaries,
  carpools,
  onHotspotCreated,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("flags");
  const [showReportModal, setShowReportModal] = useState(false);
  const [hazardType, setHazardType] = useState<HazardOption>("waste_burning");
  const [reportDesc, setReportDesc] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFlagColor = (flag: string) => {
    switch (flag.toUpperCase()) {
      case "GREEN":
        return { bg: "bg-emerald-600", text: "text-emerald-100", border: "border-emerald-500" };
      case "YELLOW":
        return { bg: "bg-amber-600", text: "text-amber-100", border: "border-amber-500" };
      case "ORANGE":
        return { bg: "bg-orange-600", text: "text-orange-100", border: "border-orange-500" };
      case "RED":
        return { bg: "bg-red-700", text: "text-red-100", border: "border-red-600" };
      case "PURPLE":
      default:
        return { bg: "bg-purple-900", text: "text-purple-100", border: "border-purple-600" };
    }
  };

  const handleCreateReport = async () => {
    if (!reportDesc.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const rep = await api.reportHotspot({
        hazard_type: hazardType,
        description: reportDesc,
        reporter_name: reporterName || "Local Resident",
        fuzzed_lat: 28.6139,
        fuzzed_lng: 77.2090,
      });
      if (onHotspotCreated) onHotspotCreated(rep);
      setShowReportModal(false);
      setReportDesc("");
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Neighborhood & School Action Hub
          </h2>
          <p className="text-xs text-slate-400">
            Coordinating school recess flags, zero-idle carpools, and burning hotspot reports
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-semibold shadow-md active:scale-95 transition"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Report Smog Hotspot</span>
        </button>
      </div>

      {/* Sub navigation pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { id: "flags" as const, label: `School Recess Flags (${flags.length})`, icon: Flag },
          { id: "hotspots" as const, label: `Hotspot Reports (${hotspots.length})`, icon: Flame },
          { id: "carpools" as const, label: `Carpool Board (${carpools.length})`, icon: Car },
          { id: "sanctuaries" as const, label: `Clean Sanctuaries (${sanctuaries.length})`, icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: School Recess Flags */}
      {activeSubTab === "flags" && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
            <Flag className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              School Air Quality Flag Program: Physical education leads and administrators update campus flags to signal safe recess policies based on real-time AQI thresholds.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flags.map((item, idx) => {
              const flagStyle = getFlagColor(item.current_flag);
              return (
                <div key={idx} className="rounded-2xl bg-slate-850 border border-slate-750 p-4 shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.school_name}</h4>
                      <p className="text-[11px] text-slate-400">{item.location}</p>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono tracking-wider ${flagStyle.bg} ${flagStyle.border} ${flagStyle.text}`}
                    >
                      {item.current_flag} FLAG
                    </div>
                  </div>

                  <div className="my-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                    <span className="font-semibold text-slate-400">Campus Protocol: </span>
                    <span>{item.recommendation}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Updated by: {item.last_updated_by}</span>
                    <span>{item.updated_at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 2: Hotspot Reports */}
      {activeSubTab === "hotspots" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotspots.map((h, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-850 border border-slate-750 p-4 shadow">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 capitalize">
                    <Flame className="w-4 h-4" />
                    {h.hazard_type.replace("_", " ")}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      h.status === "verified"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>

                <p className="text-xs text-slate-200 my-2">{h.description}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    Fuzzed ~500m ({h.fuzzed_lat}, {h.fuzzed_lng})
                  </span>
                  <span>{h.created_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Carpool Board */}
      {activeSubTab === "carpools" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {carpools.map((cp) => (
              <div key={cp.id} className="rounded-2xl bg-slate-850 border border-slate-750 p-4 shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{cp.route}</h4>
                    <p className="text-[11px] text-slate-400">Driver: {cp.driver_name}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                    {cp.seats_available} seats
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 my-2">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Depart: {cp.departure_time} • Return: {cp.return_time}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    Cabin: {cp.vehicle_type} ({cp.pm25_inhalation_reduction} less exposure)
                  </div>
                </div>

                <button className="w-full mt-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition">
                  Request to Join Carpool
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Clean Air Sanctuaries */}
      {activeSubTab === "sanctuaries" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sanctuaries.map((s, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-850 border border-slate-750 p-4 shadow">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.name}</h4>
                    <p className="text-[11px] text-slate-400">{s.address}</p>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-right">
                    <div className="text-xs font-mono font-bold">AQI {s.current_indoor_aqi}</div>
                    <div className="text-[9px] text-emerald-400">Filtered</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 my-2">
                  <span className="text-slate-400">Filtration: </span>
                  <span className="text-teal-300 font-medium">{s.filtration_type}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>{s.distance_km} km away</span>
                  <span>{s.operating_hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Hotspot Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-750 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                Report Smog / Burning Hotspot
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Coordinates are geographically fuzzed by ~500m to protect reporter privacy per NFR-4.1.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hazard Type</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value as HazardOption)}
                  className="w-full bg-slate-800 border border-slate-750 rounded-xl p-2.5 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="waste_burning">Municipal / Waste Burning</option>
                  <option value="crop_burning">Agricultural Crop / Stubble Burning</option>
                  <option value="industrial_smoke">Industrial Plume / Diesel Exhaust</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Landmark</label>
                <textarea
                  rows={3}
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Describe location, smoke density, or visible fire..."
                  className="w-full bg-slate-800 border border-slate-750 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reporter Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Anonymous or Community Lead"
                  className="w-full bg-slate-800 border border-slate-750 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateReport}
                  disabled={!reportDesc.trim() || isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Hotspot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
