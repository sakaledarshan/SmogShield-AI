"use client";

import React, { useState } from "react";
import {
  Flame,
  Shield,
  Navigation,
  Check,
  TrendingDown,
  Info
} from "lucide-react";
import { SmogHotspotReport, CleanAirSanctuary } from "@/types";

interface LiveSmogMapProps {
  hotspots: SmogHotspotReport[];
  sanctuaries: CleanAirSanctuary[];
}

export const LiveSmogMap: React.FC<LiveSmogMapProps> = ({ hotspots, sanctuaries }) => {
  const [selectedRoute, setSelectedRoute] = useState<"cleanest" | "fastest">("cleanest");
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSanctuaries, setShowSanctuaries] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Simulated regional grid stations for smooth gradient ramp
  const stations = [
    { name: "Central Civil Corridor", aqi: 285, lat: 28.6139, lng: 77.2090, x: 48, y: 50 },
    { name: "Industrial West Zone", aqi: 340, lat: 28.6250, lng: 77.1850, x: 25, y: 35 },
    { name: "South Ridge Parklands", aqi: 145, lat: 28.5800, lng: 77.2150, x: 65, y: 75 },
    { name: "East River Basin", aqi: 260, lat: 28.6200, lng: 77.2400, x: 78, y: 40 },
    { name: "North University Campus", aqi: 210, lat: 28.6450, lng: 77.2050, x: 42, y: 20 },
  ];

  return (
    <div className="space-y-4 text-white">
      {/* Map Card */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 overflow-hidden shadow-xl">
        {/* Map Header & Controls */}
        <div className="p-4 border-b border-slate-750 flex flex-wrap items-center justify-between gap-2 bg-slate-900/60">
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-teal-400" />
              Live Smog Map & Clean Commute Routing
            </h2>
            <p className="text-xs text-slate-400">
              High-resolution vector grid with continuous colorblind-safe risk gradients
            </p>
          </div>

          {/* Layer Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                showHeatmap
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                showHotspots
                  ? "bg-red-600/20 border-red-500/40 text-red-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              Hotspots ({hotspots.length})
            </button>
            <button
              onClick={() => setShowSanctuaries(!showSanctuaries)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                showSanctuaries
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              Sanctuaries ({sanctuaries.length})
            </button>
          </div>
        </div>

        {/* Vector Canvas Map Visualizer */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden select-none">
          {/* Subtle Map Grid lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Smooth Continuous AQI Gradient Ramp Overlays */}
          {showHeatmap && (
            <>
              {/* Heavy Smog Cluster (North-West Industrial) */}
              <div
                className="absolute w-72 h-72 rounded-full blur-3xl opacity-35 bg-purple-700 pointer-events-none"
                style={{ top: "10%", left: "15%" }}
              />
              {/* Moderate Dispersion Cluster (South Ridge Park) */}
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-25 bg-emerald-500 pointer-events-none"
                style={{ top: "50%", left: "55%" }}
              />
              {/* Central Urban Congestion */}
              <div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-30 bg-red-700 pointer-events-none"
                style={{ top: "30%", left: "35%" }}
              />
            </>
          )}

          {/* Simulated Commute Routes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Fastest Path (Corridor Highway: High Exposure) */}
            <path
              d="M 120 70 L 220 150 L 320 200 L 410 270"
              fill="none"
              stroke={selectedRoute === "fastest" ? "#EF4444" : "#991B1B"}
              strokeWidth={selectedRoute === "fastest" ? "4" : "2"}
              strokeDasharray={selectedRoute === "fastest" ? "none" : "4 4"}
              opacity={selectedRoute === "fastest" ? "0.9" : "0.4"}
            />
            {/* Cleanest Path (Arterial Park Bypass: 47% Lower Inhalation) */}
            <path
              d="M 120 70 C 180 50, 260 80, 290 130 C 320 180, 390 210, 410 270"
              fill="none"
              stroke={selectedRoute === "cleanest" ? "#10B981" : "#065F46"}
              strokeWidth={selectedRoute === "cleanest" ? "4" : "2"}
              opacity={selectedRoute === "cleanest" ? "0.95" : "0.4"}
            />
          </svg>

          {/* Commute Origin & Destination Pins */}
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow"
            style={{ left: "120px", top: "70px" }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Home (Origin)
          </div>

          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow"
            style={{ left: "410px", top: "270px" }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Office (Destination)
          </div>

          {/* Hyperlocal Sensor Stations */}
          {stations.map((s, idx) => (
            <div
              key={idx}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-mono font-bold shadow-lg transition-transform group-hover:scale-125 ${
                  s.aqi > 300
                    ? "bg-purple-900 text-purple-200"
                    : s.aqi > 200
                    ? "bg-red-700 text-white"
                    : s.aqi > 100
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {s.aqi}
              </div>
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] whitespace-nowrap shadow-xl z-30">
                <span className="font-semibold text-white">{s.name}</span>
                <span className="text-slate-400"> (AQI {s.aqi})</span>
              </div>
            </div>
          ))}

          {/* Community Smog Hotspots (Fuzzed Radius per NFR-4.1) */}
          {showHotspots &&
            hotspots.map((h, idx) => (
              <div
                key={idx}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${30 + idx * 25}%`, top: `${25 + idx * 20}%` }}
              >
                {/* 500m Fuzzed Privacy Circle */}
                <div className="w-14 h-14 rounded-full border border-red-500/40 bg-red-500/10 animate-pulse pointer-events-none -translate-x-3.5 -translate-y-3.5" />
                <div className="absolute top-0 left-0 w-7 h-7 rounded-full bg-red-600/90 border border-white text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded bg-slate-900 border border-red-500/50 text-[10px] whitespace-nowrap shadow-xl z-30">
                  <span className="font-bold text-red-400 capitalize">{h.hazard_type.replace("_", " ")}</span>
                  <div className="text-slate-300 max-w-[180px] truncate">{h.description}</div>
                  <div className="text-[9px] text-slate-400">Fuzzed ~500m for privacy</div>
                </div>
              </div>
            ))}

          {/* Clean Air Sanctuaries */}
          {showSanctuaries &&
            sanctuaries.map((s, idx) => (
              <div
                key={idx}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${60 + idx * 15}%`, top: `${60 - idx * 18}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-600 border border-white text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/50 text-[10px] whitespace-nowrap shadow-xl z-30">
                  <div className="font-bold text-emerald-300">{s.name}</div>
                  <div className="text-slate-300">Indoor AQI: <strong className="text-emerald-400">{s.current_indoor_aqi}</strong> • {s.distance_km}km</div>
                  <div className="text-[9px] text-slate-400">{s.filtration_type}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Cleanest vs Fastest Route Comparison Cards */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Commute Route Exposure Comparison
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cleanest Route */}
            <div
              onClick={() => setSelectedRoute("cleanest")}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedRoute === "cleanest"
                  ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                  : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Shield className="w-4 h-4" />
                  Cleanest Route (Park & Arterial Bypass)
                </span>
                {selectedRoute === "cleanest" && (
                  <span className="p-0.5 rounded-full bg-emerald-500 text-slate-950">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 font-mono text-sm">
                <span className="font-bold text-white">16.5 km</span>
                <span className="text-slate-400">• 27 min</span>
                <span className="text-emerald-400 font-bold ml-auto">Avg AQI 145</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-300 flex items-center gap-1 bg-emerald-900/30 p-1.5 rounded-lg border border-emerald-800/40">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>Avoids 18.8 µg PM2.5 inhalation (49% cleaner than highway)</span>
              </div>
            </div>

            {/* Fastest Route */}
            <div
              onClick={() => setSelectedRoute("fastest")}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedRoute === "fastest"
                  ? "bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500/50"
                  : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <Navigation className="w-4 h-4" />
                  Fastest Route (Express Corridor Highway)
                </span>
                {selectedRoute === "fastest" && (
                  <span className="p-0.5 rounded-full bg-red-500 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 font-mono text-sm">
                <span className="font-bold text-white">15.0 km</span>
                <span className="text-slate-400">• 22 min</span>
                <span className="text-red-400 font-bold ml-auto">Avg AQI 285</span>
              </div>
              <div className="mt-2 text-[11px] text-red-300 flex items-center gap-1 bg-red-900/30 p-1.5 rounded-lg border border-red-800/40">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>High vehicular diesel soot & corridor exhaust spikes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
