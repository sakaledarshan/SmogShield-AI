import {
  AQICurrentResponse,
  AQIForecastResponse,
  DailyRoutineResponse,
  ChatCoachResponse,
  ImpactSimulationResponse,
  CumulativeLedger,
  SmogHotspotReport,
  SchoolRecessFlag,
  CleanAirSanctuary,
  CarpoolItem,
  HouseholdProfile,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallback Mock Data in case backend is offline during client rendering
export const FALLBACK_AQI: AQICurrentResponse = {
  location: { lat: 28.6139, lng: 77.2090, city_name: "Downtown Metro Corridor" },
  aqi: 285,
  category: "Very Unhealthy",
  dominant_pollutant: "PM2.5",
  pollutants: {
    pm25: { value: 235.4, unit: "ug/m3" },
    pm10: { value: 340.1, unit: "ug/m3" },
    no2: { value: 62.4, unit: "ug/m3" },
    o3: { value: 24.1, unit: "ug/m3" },
    so2: { value: 14.8, unit: "ug/m3" },
    co: { value: 1.8, unit: "mg/m3" },
  },
  safe_ventilation_window: {
    start_time: "2026-11-23 13:00",
    end_time: "2026-11-23 15:00",
    duration_hours: 2,
    avg_pm25: 112.0,
    dispersion_score: "Optimal (Solar Boundary Layer > 650m)",
    advisory: "Safe 2-Hour Aeration Window: 13:00 to 15:00. Thermal inversion is temporarily broken by solar heating.",
  },
  inversion_alert: {
    detected: true,
    severity: "severe",
    inversion_layer_height_m: 120,
    peak_hours: "11:00 PM - 09:30 AM",
    protective_action: "Ground thermal inversion active. Seal windows; run bedroom purifier.",
  },
  cached_at: new Date().toISOString(),
  source_api: "Google Air Quality API (500m Grid Normalized)",
};

export const api = {
  async getCurrentAQI(lat = 28.6139, lng = 77.2090): Promise<AQICurrentResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/aqi/current?lat=${lat}&lng=${lng}`, {
        next: { revalidate: 60 }
      });
      if (!res.ok) throw new Error("AQI fetch failed");
      return await res.json();
    } catch {
      return FALLBACK_AQI;
    }
  },

  async getForecast(lat = 28.6139, lng = 77.2090): Promise<AQIForecastResponse | null> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/aqi/forecast?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error("Forecast fetch failed");
      return await res.json();
    } catch {
      return null;
    }
  },

  async getDailyRoutine(profile: HouseholdProfile): Promise<DailyRoutineResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/routines/daily`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "usr-demo",
          current_location: { lat: 28.6139, lng: 77.2090 },
          profile,
        }),
      });
      if (!res.ok) throw new Error("Routine fetch failed");
      return await res.json();
    } catch {
      return {
        routine_date: new Date().toISOString().split("T")[0],
        hero_summary: "High morning inversion layer detected. Keep windows sealed until 1:00 PM.",
        inversion_warning: "Nocturnal boundary layer <150m. Avoid early morning outdoor exercise.",
        time_blocks: [
          {
            time: "07:00 AM - 09:00 AM",
            action: "Shift outdoor cardio to indoor workout. Mask with N95 during commute.",
            category: "Commute",
            pm25_reduction_ug: 48.5,
            why_it_matters: "Avoids morning inversion spike (2.2 cigarettes equivalent).",
            budget_tier: "zero_cost",
          },
          {
            time: "01:00 PM - 03:00 PM",
            action: "Open south-facing windows for safe cross-ventilation window.",
            category: "Home Aeration",
            pm25_reduction_ug: 18.0,
            why_it_matters: "Boundary layer expanded; exhausts CO2 without PM2.5 penalty.",
            budget_tier: "zero_cost",
          },
          {
            time: "09:00 PM - 07:00 AM",
            action: "Run bedroom filtration (or DIY Corsi-Rosenthal unit) on low speed overnight.",
            category: "Night Defense",
            pm25_reduction_ug: 72.0,
            why_it_matters: "Maintains sleeping IAQ < 15 ug/m3 during nocturnal inversion trap.",
            budget_tier: "low",
          },
        ],
        total_estimated_pm25_saved_ug: 138.5,
        cigarette_equivalent_avoided: 6.3,
      };
    }
  },

  async askCoach(message: string, profile: HouseholdProfile, aqi: number): Promise<ChatCoachResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/chat/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "usr-demo",
          message,
          household_profile: profile,
          current_aqi: aqi,
        }),
      });
      if (!res.ok) throw new Error("Coach failed");
      return await res.json();
    } catch {
      return {
        reply: `Based on verified WHO and EPA frameworks for AQI ${aqi}: prioritize sealing bedroom gasketing, avoid dry sweeping, and use verified mechanical filtration (HEPA or DIY Corsi-Rosenthal box).`,
        grounded_frameworks: ["WHO Global Air Quality Guidelines", "EPA Residential Air Cleaners"],
        actionable_hacks: [
          {
            title: "Microfiber Damp Mopping",
            cost: "$0",
            instructions: "Mop floors with damp cloth to avoid dust re-suspension.",
          },
        ],
        safety_disclaimer: "Non-Diagnostic Lifestyle Guidance based on EPA & WHO standards.",
      };
    }
  },

  async simulateImpact(actionType: string, distanceKm = 15.0): Promise<ImpactSimulationResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/impact/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_type: actionType,
          distance_km: distanceKm,
        }),
      });
      if (!res.ok) throw new Error("Simulation failed");
      return await res.json();
    } catch {
      return {
        action_type: actionType,
        pm25_exposure_avoided_ug: 62.5,
        equivalent_cigarettes_avoided: 2.8,
        co2e_emissions_saved_kg: 3.4,
        estimated_cost_saved_usd: 4.5,
        formula_breakdown: "Deterministic exposure formula calculated with 50% vehicle tailpipe abatement.",
      };
    }
  },

  async getLedger(): Promise<CumulativeLedger> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/impact/ledger`);
      if (!res.ok) throw new Error("Ledger failed");
      return await res.json();
    } catch {
      return {
        weekly_pm25_avoided_ug: 348.2,
        weekly_cigarettes_avoided: 15.8,
        co2e_saved_kg: 24.6,
        nox_saved_g: 44.8,
        financial_saved_usd: 38.5,
        current_habit_streak_days: 8,
        daily_breakdown: [
          { day: "Mon", pm25_avoided_ug: 52.4, co2e_kg: 3.8, actions: 3 },
          { day: "Tue", pm25_avoided_ug: 64.1, co2e_kg: 4.2, actions: 4 },
          { day: "Wed", pm25_avoided_ug: 45.0, co2e_kg: 3.4, actions: 2 },
          { day: "Thu", pm25_avoided_ug: 78.2, co2e_kg: 5.1, actions: 4 },
          { day: "Fri", pm25_avoided_ug: 58.0, co2e_kg: 4.0, actions: 3 },
          { day: "Sat", pm25_avoided_ug: 25.5, co2e_kg: 2.1, actions: 2 },
          { day: "Sun", pm25_avoided_ug: 25.0, co2e_kg: 2.0, actions: 2 },
        ],
        active_micro_pledges: [
          { id: "p1", title: "Zero-Idle Carpool to Work", target: "5 days", progress: "4/5", completed: false },
          { id: "p2", title: "Damp Microfiber Mopping Routine", target: "Daily", progress: "7/7", completed: true },
          { id: "p3", title: "Air Purifier Running on Low overnight", target: "7 nights", progress: "7/7", completed: true },
        ],
      };
    }
  },

  async getHotspots(): Promise<SmogHotspotReport[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/community/hotspots`);
      if (!res.ok) throw new Error("Hotspots failed");
      return await res.json();
    } catch {
      return [];
    }
  },

  async reportHotspot(report: Partial<SmogHotspotReport>): Promise<SmogHotspotReport> {
    const res = await fetch(`${API_BASE}/api/v1/community/hotspots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    return await res.json();
  },

  async getRecessFlags(): Promise<SchoolRecessFlag[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/community/recess-flags`);
      if (!res.ok) throw new Error("Flags failed");
      return await res.json();
    } catch {
      return [];
    }
  },

  async toggleRecessFlag(schoolName: string, newFlag: string, coordinatorName: string) {
    const res = await fetch(`${API_BASE}/api/v1/community/recess-flags/toggle?school_name=${encodeURIComponent(schoolName)}&new_flag=${newFlag}&coordinator_name=${encodeURIComponent(coordinatorName)}`, {
      method: "POST",
    });
    return await res.json();
  },

  async getSanctuaries(): Promise<CleanAirSanctuary[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/community/sanctuaries`);
      if (!res.ok) throw new Error("Sanctuaries failed");
      return await res.json();
    } catch {
      return [];
    }
  },

  async getCarpools(): Promise<CarpoolItem[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/community/carpools`);
      if (!res.ok) throw new Error("Carpools failed");
      return await res.json();
    } catch {
      return [];
    }
  },

  async getProfile(): Promise<HouseholdProfile> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/profile`);
      if (!res.ok) throw new Error("Profile failed");
      return await res.json();
    } catch {
      return {
        user_id: "usr-demo",
        has_infants: true,
        has_elderly: false,
        has_respiratory_conditions: true,
        home_type: "apartment",
        has_hepa_filter: false,
        primary_commute_mode: "transit",
        budget_tier: "low",
      };
    }
  },

  async updateProfile(profile: HouseholdProfile): Promise<HouseholdProfile> {
    const res = await fetch(`${API_BASE}/api/v1/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    return await res.json();
  },
};
