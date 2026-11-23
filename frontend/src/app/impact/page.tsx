"use client";

import React, { useState, useEffect } from "react";
import { ImpactLedger } from "@/components/ImpactLedger";
import { api } from "@/services/api";
import { CumulativeLedger } from "@/types";

export default function ImpactPage() {
  const [ledger, setLedger] = useState<CumulativeLedger | null>(null);

  useEffect(() => {
    api.getLedger().then(setLedger).catch(() => {});
  }, []);

  if (!ledger) {
    return (
      <div className="rounded-2xl bg-slate-900 p-8 text-center text-xs text-slate-400">
        Loading cumulative exposure ledger and deterministic impact engine...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ImpactLedger ledger={ledger} />
    </div>
  );
}
