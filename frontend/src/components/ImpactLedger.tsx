"use client";

import React, { useState } from "react";
import {
  Activity,
  Award,
  Zap,
  TrendingDown,
  Leaf,
  CheckCircle2,
  Calculator
} from "lucide-react";
import { CumulativeLedger, ImpactSimulationResponse } from "@/types";
import { api } from "@/services/api";

interface ImpactLedgerProps {
  ledger: CumulativeLedger;
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({ ledger }) => {
  const [simulationType, setSimulationType] = useState("carpool_swap");
  const [distanceKm, setDistanceKm] = useState(15);
  const [simResult, setSimResult] = useState<ImpactSimulationResponse | null>(null);

  const runSimulation = async (type: string, km: number) => {
    try {
      const res = await api.simulateImpact(type, km);
      setSimResult(res);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Hero Stats Ledger Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* PM2.5 Inhalation Avoided */}
        <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4">
          <div className="text-xs text-slate-400 font-medium">PM2.5 Avoided</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {ledger.weekly_pm25_avoided_ug} <span className="text-xs font-normal text-slate-400">µg</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>This week</span>
          </div>
        </div>

        {/* Cigarettes Avoided */}
        <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4">
          <div className="text-xs text-slate-400 font-medium">Cigarette Equiv.</div>
          <div className="text-2xl font-black text-teal-300 font-mono mt-1">
            {ledger.weekly_cigarettes_avoided} <span className="text-xs font-normal text-slate-400">cigs</span>
          </div>
          <div className="text-[11px] text-teal-300/80 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lungs protected</span>
          </div>
        </div>

        {/* CO2e Saved */}
        <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4">
          <div className="text-xs text-slate-400 font-medium">CO₂e Abated</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {ledger.co2e_saved_kg} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-blue-300/80 mt-1 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Vehicular cut</span>
          </div>
        </div>

        {/* Habit Streak */}
        <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4">
          <div className="text-xs text-slate-400 font-medium">Habit Streak</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {ledger.current_habit_streak_days} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Active streak</span>
          </div>
        </div>
      </div>

      {/* Weekly Daily Avoidance Bar Chart */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Weekly Inhalation Avoidance Trend (µg PM2.5)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Verified Empirical Delta</span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 px-2 bg-slate-900/60 rounded-xl border border-slate-800">
          {ledger.daily_breakdown.map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.pm25_avoided_ug / 85) * 100));
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition">
                  {item.pm25_avoided_ug}
                </span>
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] text-slate-400 font-medium">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Action Swap Simulator */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Deterministic Action Swap Simulator</h3>
              <p className="text-xs text-slate-400">
                Calculates personal exposure and emissions deltas before invoking LLMs
              </p>
            </div>
          </div>
        </div>

        {/* Action Select Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {[
            { id: "carpool_swap", label: "Carpool / Transit Swap" },
            { id: "shift_outdoor_run_to_indoor", label: "Shift Cardio Indoors" },
            { id: "corsi_rosenthal_box", label: "Run DIY Corsi Box" },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => {
                setSimulationType(act.id);
                runSimulation(act.id, distanceKm);
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${
                simulationType === act.id
                  ? "bg-teal-950/60 border-teal-500 text-teal-200"
                  : "bg-slate-800 border-slate-750 text-slate-300 hover:border-slate-600"
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* Distance Slider (for carpool) */}
        {simulationType === "carpool_swap" && (
          <div className="mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Commute Distance:</span>
              <span className="font-mono text-teal-400 font-bold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={distanceKm}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDistanceKm(val);
                runSimulation(simulationType, val);
              }}
              className="w-full accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Simulation Output Card */}
        {simResult && (
          <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/40 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400">Inhalation Avoided</span>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {simResult.pm25_exposure_avoided_ug} µg
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Cigarettes Equiv.</span>
              <div className="text-base font-bold text-teal-300 font-mono mt-0.5">
                {simResult.equivalent_cigarettes_avoided} cigs
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">CO₂e Abatement</span>
              <div className="text-base font-bold text-blue-400 font-mono mt-0.5">
                {simResult.co2e_emissions_saved_kg} kg
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Projected Savings</span>
              <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                ${simResult.estimated_cost_saved_usd}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Micro-Pledges */}
      <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 sm:p-5 shadow-lg">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-amber-400" />
          Active Habit Micro-Pledges
        </h3>

        <div className="space-y-2">
          {ledger.active_micro_pledges.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-white">{p.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Target: {p.target}</div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">{p.progress}</span>
                {p.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
