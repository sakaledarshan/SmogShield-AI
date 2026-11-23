"use client";

import React, { useState } from "react";
import { AQICurrentResponse } from "@/types";
import {
  Wind,
  Home,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Eye,
  CheckCircle2
} from "lucide-react";

interface HeroAQICardProps {
  data: AQICurrentResponse;
  indoorAQI?: number;
}

export const HeroAQICard: React.FC<HeroAQICardProps> = ({ data, indoorAQI = 38 }) => {
  const [showDrawer, setShowDrawer] = useState(false);

  // Accessible Risk Category Styling & Texture Pattern
  const getBadgeStyle = (aqi: number) => {
    if (aqi <= 50) {
      return {
        label: "Good",
        bg: "bg-emerald-600",
        border: "border-emerald-500",
        text: "text-emerald-100",
        pattern: "pattern-solid",
        icon: ShieldCheck,
      };
    } else if (aqi <= 100) {
      return {
        label: "Moderate",
        bg: "bg-amber-600",
        border: "border-amber-500",
        text: "text-amber-100",
        pattern: "pattern-diagonal-stripes",
        icon: Eye,
      };
    } else if (aqi <= 150) {
      return {
        label: "Unhealthy for Sensitive Groups",
        bg: "bg-orange-600",
        border: "border-orange-500",
        text: "text-orange-100",
        pattern: "pattern-dots",
        icon: AlertOctagon,
      };
    } else if (aqi <= 200) {
      return {
        label: "Unhealthy",
        bg: "bg-red-700",
        border: "border-red-600",
        text: "text-red-100",
        pattern: "pattern-crosshatch",
        icon: AlertOctagon,
      };
    } else if (aqi <= 300) {
      return {
        label: "Very Unhealthy",
        bg: "bg-purple-800",
        border: "border-purple-600",
        text: "text-purple-100",
        pattern: "pattern-vertical-lines",
        icon: AlertOctagon,
      };
    } else {
      return {
        label: "Hazardous",
        bg: "bg-purple-950",
        border: "border-red-500",
        text: "text-red-200",
        pattern: "pattern-crosshatch",
        icon: AlertOctagon,
      };
    }
  };

  const badge = getBadgeStyle(data.aqi);
  const RiskIcon = badge.icon;

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-850 to-slate-900 border border-slate-750 p-4 sm:p-5 shadow-xl text-white">
      {/* Top 3-Second Action Banner ("Action First, Numbers Second") */}
      <div className="mb-4 p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-600/20 text-blue-300 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-300">
            Immediate 3-Second Action Directive
          </div>
          <p className="text-sm font-medium text-slate-100 mt-0.5">
            Keep windows tightly sealed until <span className="text-teal-300 font-bold">1:00 PM</span>. Wear certified N95 mask for all outdoor corridor transit.
          </p>
        </div>
      </div>

      {/* Main Split: Outdoor Dial vs Indoor Sanctuary Dial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        {/* Outdoor Current AQI */}
        <div className="relative overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              Outdoor Ambient Air
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Dominant: {data.dominant_pollutant}
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {data.aqi}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-300">AQI (US-EPA)</span>
              <span className="text-[11px] text-slate-400">
                PM2.5: <strong className="text-white">{data.pollutants.pm25?.value}</strong> µg/m³
              </span>
            </div>
          </div>

          {/* Accessible Risk Badge with Pattern */}
          <div
            className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg border ${badge.bg} ${badge.border} ${badge.text} ${badge.pattern} shadow-sm`}
          >
            <RiskIcon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide truncate">
              {badge.label}
            </span>
          </div>
        </div>

        {/* Indoor Sanctuary Estimated Contrast (Benchmark Pattern) */}
        <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              Indoor Air Sanctuary
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Protected Zone
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400 font-mono">
              {indoorAQI}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-emerald-200">Good (Safe)</span>
              <span className="text-[11px] text-slate-400">
                Est. PM2.5: <strong className="text-emerald-300">9.2</strong> µg/m³
              </span>
            </div>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sealed envelope + filtration reduces inhalation by ~86%</span>
          </div>
        </div>
      </div>

      {/* Top 3 Immediate Protective Actions */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60 mb-3">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Top 3 Behavioral Directives</span>
          <span className="text-[10px] text-teal-400 font-normal">Evidence-Based</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-2">
            <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
            <div>
              <div className="text-xs font-bold text-white">Seal Windows</div>
              <div className="text-[11px] text-slate-300">Keep closed until 1 PM dispersion window</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-2">
            <div className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
            <div>
              <div className="text-xs font-bold text-white">N95 Respirator</div>
              <div className="text-[11px] text-slate-300">Mandatory for any transit outdoors</div>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-2">
            <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
            <div>
              <div className="text-xs font-bold text-white">Indoor Exercise</div>
              <div className="text-[11px] text-slate-300">Avoid 2.8 m³/hr outdoor breathing rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Pollutant Drawer Toggle (Progressive Disclosure) */}
      <button
        onClick={() => setShowDrawer(!showDrawer)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 rounded-lg transition"
      >
        <span>Granular Pollutant Breakdown (PM2.5, PM10, NO₂, O₃, SO₂, CO)</span>
        {showDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showDrawer && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-700/70 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {Object.entries(data.pollutants).map(([key, item]) => (
            <div key={key} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <span className="uppercase font-semibold text-slate-400">{key}</span>
              <span className="font-mono text-white font-bold">
                {item.value} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
