"use client";

import React from "react";
import { SafeVentilationWindow as SafeWindowType, InversionAlert } from "@/types";
import { Clock, Sun, AlertTriangle, Wind } from "lucide-react";

interface SafeVentilationProps {
  safeWindow: SafeWindowType;
  inversionAlert: InversionAlert;
}

export const SafeVentilationWindow: React.FC<SafeVentilationProps> = ({
  safeWindow,
  inversionAlert,
}) => {
  // 24 hour blocks simulation for visual timeline
  const hours = [
    { h: "06", state: "sealed", label: "Morning Inversion Trap" },
    { h: "08", state: "sealed", label: "Peak Transit Corridor Spike" },
    { h: "10", state: "sealed", label: "Inversion Layer Dissipating" },
    { h: "12", state: "caution", label: "Atmospheric Warming" },
    { h: "13", state: "safe", label: "Safe Ventilation Window (Solar Boundary >650m)" },
    { h: "14", state: "safe", label: "Safe Ventilation Window (Solar Boundary >650m)" },
    { h: "15", state: "caution", label: "Window Closing" },
    { h: "17", state: "sealed", label: "Evening Rush Hour & Re-inversion" },
    { h: "19", state: "sealed", label: "Nocturnal Cooling Inversion" },
    { h: "21", state: "sealed", label: "Ground Smog Capped (<120m)" },
  ];

  return (
    <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 sm:p-5 shadow-lg text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Daily Safe Ventilation Window
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Optimal Aeration
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Optimal 2-hour window when solar boundary layer expansion disperses surface smog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-mono font-bold text-teal-300">
            1:00 PM – 3:00 PM
          </span>
        </div>
      </div>

      {/* Continuous Timeline Graphic */}
      <div className="my-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
          <span>06:00 AM</span>
          <span className="text-teal-400 font-bold">13:00–15:00 (Safe Aeration)</span>
          <span>10:00 PM</span>
        </div>

        <div className="grid grid-cols-10 gap-1 h-7 rounded-xl overflow-hidden bg-slate-900 p-1 border border-slate-800">
          {hours.map((item, idx) => {
            let color = "bg-red-950/60 border-red-900 text-red-400";
            if (item.state === "safe") {
              color = "bg-teal-500 border-teal-400 text-slate-950 font-bold animate-pulse";
            } else if (item.state === "caution") {
              color = "bg-amber-600/60 border-amber-500 text-amber-200";
            }
            return (
              <div
                key={idx}
                className={`h-full rounded-md border flex items-center justify-center text-[10px] transition group relative ${color}`}
                title={`${item.h}:00 - ${item.label}`}
              >
                <span>{item.h}h</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory Note & Inversion Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2">
          <Wind className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Dispersion Factor: </span>
            <span className="text-teal-300 font-medium">{safeWindow.dispersion_score}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Open opposite-side windows for brief 20-minute cross-ventilation to flush CO2 without PM2.5 spike.
            </p>
          </div>
        </div>

        {inversionAlert.detected && (
          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-200">Thermal Inversion Alert: </span>
              <span className="text-slate-300">Ceiling at ~{inversionAlert.inversion_layer_height_m}m</span>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Dense cold air layer caps particulate near ground after 8 PM. Keep window gaskets taped.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
