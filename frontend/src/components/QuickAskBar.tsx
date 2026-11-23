"use client";

import React from "react";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";

interface QuickAskBarProps {
  onSelectPrompt: (promptText: string) => void;
}

export const QuickAskBar: React.FC<QuickAskBarProps> = ({ onSelectPrompt }) => {
  const promptChips = [
    "How do I prep infant nursery for tonight's inversion?",
    "Build a DIY Corsi-Rosenthal filter for under $60",
    "Find cleanest commute bike route to avoid highway exhaust",
    "Can I use an ozone generator to clean the air?",
  ];

  return (
    <div className="rounded-2xl bg-slate-850 border border-slate-750 p-4 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
          Quick-Ask Grounded AI Coach
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(chip)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 text-slate-200 text-xs font-medium active:scale-95 transition text-left"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>{chip}</span>
            <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
          </button>
        ))}
      </div>
    </div>
  );
};
