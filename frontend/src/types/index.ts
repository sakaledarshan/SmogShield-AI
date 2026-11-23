export interface Location {
  lat: float;
  lng: float;
  city_name?: string;
}

export type float = number;

export interface PollutantValue {
  value: number;
  unit: string;
}

export interface SafeVentilationWindow {
  start_time: string;
  end_time: string;
  duration_hours: number;
  avg_pm25: number;
  dispersion_score: string;
  advisory: string;
}

export interface InversionAlert {
  detected: boolean;
  severity: "none" | "moderate" | "severe";
  inversion_layer_height_m?: number;
  peak_hours?: string;
  protective_action?: string;
}

export interface AQICurrentResponse {
  location: Location;
  aqi: number;
  category: string;
  dominant_pollutant: string;
  pollutants: Record<string, PollutantValue>;
  safe_ventilation_window: SafeVentilationWindow;
  inversion_alert: InversionAlert;
  cached_at: string;
  source_api: string;
}

export interface HourlyForecastItem {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature_c: number;
  wind_speed_kmh: number;
  inversion_trapped: boolean;
  is_safe_window: boolean;
}

export interface AQIForecastResponse {
  location: Location;
  forecast_hours: HourlyForecastItem[];
  inversion_forecast: Array<{
    day: string;
    start_hour: string;
    end_hour: string;
    ceiling_altitude_m: number;
    severity: string;
    guidance: string;
  }>;
  recommended_windows: SafeVentilationWindow[];
}

export interface HouseholdProfile {
  user_id?: string;
  has_infants: boolean;
  has_elderly: boolean;
  has_respiratory_conditions: boolean;
  home_type: "apartment" | "detached_house" | "townhouse";
  has_hepa_filter: boolean;
  primary_commute_mode: "walk" | "two_wheeler" | "transit" | "car";
  budget_tier: "zero_cost" | "low" | "medium" | "high";
  home_location?: Location;
}

export interface TimeBlockAction {
  time: string;
  action: string;
  category: string;
  pm25_reduction_ug: number;
  why_it_matters: string;
  budget_tier: string;
  is_completed?: boolean;
}

export interface DailyRoutineResponse {
  routine_date: string;
  hero_summary: string;
  inversion_warning?: string;
  time_blocks: TimeBlockAction[];
  total_estimated_pm25_saved_ug: number;
  cigarette_equivalent_avoided: number;
}

export interface ChatCoachResponse {
  reply: string;
  grounded_frameworks: string[];
  actionable_hacks: Array<{
    title: string;
    cost?: string;
    cadr?: string;
    steps?: string;
    instructions?: string;
    benefit?: string;
  }>;
  safety_disclaimer: string;
}

export interface ImpactSimulationResponse {
  action_type: string;
  pm25_exposure_avoided_ug: number;
  equivalent_cigarettes_avoided: number;
  co2e_emissions_saved_kg: number;
  estimated_cost_saved_usd: number;
  formula_breakdown: string;
}

export interface CumulativeLedger {
  weekly_pm25_avoided_ug: number;
  weekly_cigarettes_avoided: number;
  co2e_saved_kg: number;
  nox_saved_g: number;
  financial_saved_usd: number;
  current_habit_streak_days: number;
  daily_breakdown: Array<{
    day: string;
    pm25_avoided_ug: number;
    co2e_kg: number;
    actions: number;
  }>;
  active_micro_pledges: Array<{
    id: string;
    title: string;
    target: string;
    progress: string;
    completed: boolean;
  }>;
}

export interface SmogHotspotReport {
  report_id?: string;
  reporter_name?: string;
  fuzzed_lat: number;
  fuzzed_lng: number;
  hazard_type: "waste_burning" | "crop_burning" | "industrial_smoke" | "other";
  description: string;
  status: "pending" | "verified" | "resolved";
  created_at?: string;
}

export interface SchoolRecessFlag {
  school_name: string;
  location: string;
  current_flag: "GREEN" | "YELLOW" | "ORANGE" | "RED" | "PURPLE";
  aqi_reading: number;
  recommendation: string;
  last_updated_by: string;
  updated_at: string;
}

export interface CleanAirSanctuary {
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  filtration_type: string;
  current_indoor_aqi: number;
  distance_km: number;
  operating_hours: string;
}

export interface CarpoolItem {
  id: string;
  route: string;
  departure_time: string;
  return_time: string;
  seats_available: number;
  vehicle_type: string;
  driver_name: string;
  pm25_inhalation_reduction: string;
  co2_savings_kg: number;
}
