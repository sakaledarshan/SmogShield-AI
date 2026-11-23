from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4

class Location(BaseModel):
    lat: float
    lng: float
    city_name: Optional[str] = "Metropolis Urban Area"

class PollutantValue(BaseModel):
    value: float
    unit: str = "ug/m3"

class SafeVentilationWindow(BaseModel):
    start_time: str
    end_time: str
    duration_hours: int = 2
    avg_pm25: float
    dispersion_score: str
    advisory: str

class InversionAlert(BaseModel):
    detected: bool
    severity: str  # "none", "moderate", "severe"
    inversion_layer_height_m: Optional[int] = None
    peak_hours: Optional[str] = None
    protective_action: Optional[str] = None

class AQICurrentResponse(BaseModel):
    location: Location
    aqi: int
    category: str
    dominant_pollutant: str
    pollutants: Dict[str, PollutantValue]
    safe_ventilation_window: SafeVentilationWindow
    inversion_alert: InversionAlert
    cached_at: str
    source_api: str = "Google Air Quality API (Normalized)"

class HourlyForecastItem(BaseModel):
    time: str
    aqi: int
    pm25: float
    pm10: float
    temperature_c: float
    wind_speed_kmh: float
    inversion_trapped: bool
    is_safe_window: bool

class AQIForecastResponse(BaseModel):
    location: Location
    forecast_hours: List[HourlyForecastItem]
    inversion_forecast: List[Dict[str, Any]]
    recommended_windows: List[SafeVentilationWindow]

class HouseholdProfile(BaseModel):
    user_id: Optional[str] = None
    has_infants: bool = False
    has_elderly: bool = False
    has_respiratory_conditions: bool = False
    home_type: str = "apartment"  # apartment, detached_house, townhouse
    has_hepa_filter: bool = False
    primary_commute_mode: str = "transit"  # walk, two_wheeler, transit, car
    budget_tier: str = "low"  # zero_cost, low, medium, high
    home_location: Optional[Location] = None

class TimeBlockAction(BaseModel):
    time: str
    action: str
    category: str  # Commute, Home, Exercise, Indoor IAQ
    pm25_reduction_ug: float
    why_it_matters: str
    budget_tier: str
    is_completed: bool = False

class DailyRoutineRequest(BaseModel):
    user_id: str
    current_location: Location
    profile: Optional[HouseholdProfile] = None

class DailyRoutineResponse(BaseModel):
    routine_date: str
    hero_summary: str
    inversion_warning: Optional[str] = None
    time_blocks: List[TimeBlockAction]
    total_estimated_pm25_saved_ug: float
    cigarette_equivalent_avoided: float

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatCoachRequest(BaseModel):
    user_id: str
    message: str
    stream: bool = False
    household_profile: Optional[HouseholdProfile] = None
    current_aqi: Optional[int] = 285

class ChatCoachResponse(BaseModel):
    reply: str
    grounded_frameworks: List[str]
    actionable_hacks: List[Dict[str, Any]]
    safety_disclaimer: str

class ImpactSimulationRequest(BaseModel):
    action_type: str  # carpool_swap, shift_outdoor_run_to_indoor, corsi_rosenthal_box, wet_mopping_protocol
    distance_km: Optional[float] = 15.0
    original_mode: Optional[str] = "single_occupancy_car"
    duration_hours: Optional[float] = 1.0
    ambient_pm25: Optional[float] = 235.0

class ImpactSimulationResponse(BaseModel):
    action_type: str
    pm25_exposure_avoided_ug: float
    equivalent_cigarettes_avoided: float
    co2e_emissions_saved_kg: float
    estimated_cost_saved_usd: float
    formula_breakdown: str

class SmogHotspotReport(BaseModel):
    report_id: Optional[str] = None
    reporter_name: Optional[str] = "Community Citizen"
    fuzzed_lat: float
    fuzzed_lng: float
    hazard_type: str  # waste_burning, crop_burning, industrial_smoke, other
    description: str
    status: str = "pending"  # pending, verified, resolved
    created_at: Optional[str] = None

class SchoolRecessFlag(BaseModel):
    school_name: str
    location: str
    current_flag: str  # GREEN, YELLOW, ORANGE, RED, PURPLE
    aqi_reading: int
    recommendation: str
    last_updated_by: str
    updated_at: str

class CleanAirSanctuary(BaseModel):
    name: str
    category: str  # Public Library, Community Center, Hospital, Civic Mall
    address: str
    lat: float
    lng: float
    filtration_type: str  # Central HEPA, MERV-14 Positive Pressure, Deep Carbon
    current_indoor_aqi: int
    distance_km: float
    operating_hours: str
