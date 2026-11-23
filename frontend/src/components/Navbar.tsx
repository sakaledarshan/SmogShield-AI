"use client";

import React from "react";
import { Shield, MapPin, AlertTriangle, User, Wifi, WifiOff } from "lucide-react";

interface NavbarProps {
  locationName: string;
  hasInversionAlert: boolean;
  onOpenProfile: () => void;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  locationName,
  hasInversionAlert,
  onOpenProfile,
  isOnline = true,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-white transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SmogShield AI
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PWA
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-teal-400" />
              <span className="truncate max-w-[160px] sm:max-w-[240px]">{locationName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-teal-400/90 font-mono">500m Grid</span>
            </div>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center gap-2">
          {hasInversionAlert && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-medium">Inversion Layer Active</span>
            </div>
          )}

          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-slate-800 border border-slate-700 text-slate-300"
            title={isOnline ? "Live Network Sync" : "Cached Offline Mode"}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline text-emerald-400">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span className="text-amber-400">Offline</span>
              </>
            )}
          </div>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Household Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
