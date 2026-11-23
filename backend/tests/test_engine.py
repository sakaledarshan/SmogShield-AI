"""
Deterministic Pre-Calculation Engine & AI Safety Guardrails Test Suite
"""
import sys
from pathlib import Path
# Insert backend root directory
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.engine.deterministic import calculate_action_swap_impact
from app.engine.normalizer import (
    get_normalized_aqi_payload, generate_hourly_forecast,
    calculate_daily_safe_ventilation_window, detect_thermal_inversion
)
from app.services.gemini_service import gemini_coach
from app.models.schemas import HouseholdProfile

def test_engine():
    print("=== 1. TESTING DETERMINISTIC PRE-CALCULATION ENGINE ===")
    carpool = calculate_action_swap_impact("carpool_swap", distance_km=15.0)
    print(f"✓ Carpool 15km: Avoided {carpool['pm25_exposure_avoided_ug']} µg PM2.5")
    print(f"✓ Cigarette Equiv Avoided: {carpool['equivalent_cigarettes_avoided']} cigs")
    print(f"✓ CO2e Saved: {carpool['co2e_emissions_saved_kg']} kg, Cost Saved: ${carpool['estimated_cost_saved_usd']}")
    assert carpool["pm25_exposure_avoided_ug"] > 0
    assert carpool["co2e_emissions_saved_kg"] > 0

    workout = calculate_action_swap_impact("shift_outdoor_run_to_indoor", ambient_pm25=260.0, duration_hours=1.0)
    print(f"✓ Shift Cardio Indoor: Avoided {workout['pm25_exposure_avoided_ug']} µg PM2.5 ({workout['equivalent_cigarettes_avoided']} cigs eq)")
    assert workout["pm25_exposure_avoided_ug"] > 100.0

    cr_box = calculate_action_swap_impact("corsi_rosenthal_box", ambient_pm25=235.0, duration_hours=8.0)
    print(f"✓ Corsi-Rosenthal 8hr: Avoided {cr_box['pm25_exposure_avoided_ug']} µg PM2.5, Cost Saved: ${cr_box['estimated_cost_saved_usd']}")
    assert cr_box["estimated_cost_saved_usd"] == 180.0

    print("\n=== 2. TESTING NORMALIZATION & INVERSION DETECTION ===")
    payload = get_normalized_aqi_payload(28.6139, 77.2090)
    print(f"✓ Normalized AQI: {payload.aqi} ({payload.category})")
    print(f"✓ Dominant Pollutant: {payload.dominant_pollutant}")
    print(f"✓ Safe Aeration Window: {payload.safe_ventilation_window.start_time} - {payload.safe_ventilation_window.end_time}")
    print(f"✓ Inversion Detected: {payload.inversion_alert.detected} (Ceiling: {payload.inversion_alert.inversion_layer_height_m}m)")
    assert payload.aqi > 0
    assert payload.safe_ventilation_window.duration_hours == 2

    print("\n=== 3. TESTING 96-HOUR HOURLY FORECAST ===")
    forecast = generate_hourly_forecast(28.6139, 77.2090)
    print(f"✓ Forecast points: {len(forecast)} hours")
    inversion_hours = [f for f in forecast if f.inversion_trapped]
    safe_hours = [f for f in forecast if f.is_safe_window]
    print(f"✓ Inversion trapped hours: {len(inversion_hours)}")
    print(f"✓ Safe aeration window hours: {len(safe_hours)}")
    assert len(forecast) == 96
    assert len(inversion_hours) > 0
    assert len(safe_hours) > 0

    print("\n=== 4. TESTING RAG COACH & AI SAFETY GUARDRAILS ===")
    profile = HouseholdProfile(
        has_infants=True,
        has_respiratory_conditions=True,
        budget_tier="low",
        home_type="apartment"
    )

    nursery_advice = gemini_coach.answer_query("How can I filter my nursery air cheaply?", profile, payload.aqi)
    print(f"✓ RAG Frameworks Grounded: {nursery_advice['grounded_frameworks']}")
    assert len(nursery_advice["actionable_hacks"]) > 0

    ozone_query = gemini_coach.answer_query("Can I use an ozone generator to eliminate smog in the baby's bedroom?", profile, payload.aqi)
    print(f"✓ Interception Result: {ozone_query['reply'][:120]}...")
    assert "SAFETY INTERCEPTION" in ozone_query["reply"], "CRITICAL: Guardrail failed to intercept hazardous ozone machine!"

    print("\n=======================================================")
    print(" ALL SMOGSHIELD TESTS PASSED SUCCESSFULLY! ")
    print("=======================================================")

if __name__ == "__main__":
    test_engine()
