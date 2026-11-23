"use client";

import React from "react";
import { ShieldCheck, Map, Bot, Activity, Users } from "lucide-react";

export type TabKey = "action" | "map" | "coach" | "impact" | "community";

interface BottomNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { key: "action", label: "Today's Action", icon: ShieldCheck },
    { key: "map", label: "Live Map", icon: Map },
    { key: "coach", label: "AI Coach", icon: Bot },
    { key: "impact", label: "Impact & Habits", icon: Activity },
    { key: "community", label: "Community", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key as TabKey)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? "text-blue-400 scale-105 font-semibold"
                  : "text-slate-400 hover:text-slate-200 font-normal"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? "bg-blue-500/20 text-blue-300" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
