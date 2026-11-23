"use client";

import React, { useState } from "react";
import { DailyRoutineResponse, TimeBlockAction } from "@/types";
import { CheckCircle2, Circle, Clock, Sparkles, TrendingDown } from "lucide-react";

interface RoutineChecklistProps {
  routine: DailyRoutineResponse;
  onActionToggled?: (action: TimeBlockAction, completed: boolean) => void;
}

export const RoutineChecklist: React.FC<RoutineChecklistProps> = ({
  routine,
  onActionToggled,
}) => {
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number, item: TimeBlockAction) => {
    const nextState = !completedMap[idx];
    setCompletedMap((prev) => ({ ...prev, [idx]: nextState }));
    if (onActionToggled) {
      onActionToggled(item, nextState);
    }
  };

  const completedCount = Object.values(completedMap).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / routine.time_blocks.length) * 100);

  return (
    <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 sm:p-5 shadow-lg text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Personalized Smog Defense Routine
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Time-Blocked
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic calculations based on your household vulnerability and commute profile
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-blue-400">
            {completedCount}/{routine.time_blocks.length} Completed
          </span>
          <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-2.5 my-2">
        {routine.time_blocks.map((block, idx) => {
          const isDone = !!completedMap[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleAction(idx, block)}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isDone
                  ? "bg-slate-900/60 border-emerald-800/40 opacity-80"
                  : "bg-slate-800/80 border-slate-700 hover:border-blue-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="flex items-center gap-1 text-[11px] font-mono text-teal-400">
                      <Clock className="w-3 h-3" />
                      {block.time}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-700/80 text-slate-300">
                      {block.category}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold ${isDone ? "line-through text-slate-400" : "text-white"}`}>
                    {block.action}
                  </p>

                  {/* Why This Matters Micro-card */}
                  <div className="mt-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{block.why_it_matters}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0 ml-2">
                      -{block.pm25_reduction_ug} µg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routine Daily Summary Total */}
      <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
        <span className="text-slate-400">Total Inhalation Avoidance Today:</span>
        <div className="flex items-center gap-3 font-mono font-bold text-emerald-400">
          <span>~{routine.total_estimated_pm25_saved_ug} µg PM2.5</span>
          <span className="text-slate-500">•</span>
          <span className="text-teal-300">~{routine.cigarette_equivalent_avoided} Cigarettes Equiv.</span>
        </div>
      </div>
    </div>
  );
};
