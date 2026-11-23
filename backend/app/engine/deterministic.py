"""
Deterministic Pre-Calculation Engine for SmogShield AI.
Calculates exact personal PM2.5 inhalation deltas and household CO2e/cost savings
using empirical formulas before invoking LLMs — strictly eliminating arithmetic hallucinations.

Formula:
Inhalation PM2.5 (ug) = Breathing Rate (m3/hr) * Pollutant Conc. (ug/m3) * Duration (hr)
"""

from typing import Dict, Any, Optional

# Breathing rates (m3/hr) based on activity and age group (EPA Exposure Factors Handbook)
BREATHING_RATES = {
    "sleeping": 0.45,
    "resting_indoor": 0.55,
    "light_office": 0.60,
    "moderate_walking": 1.25,
    "outdoor_commute_two_wheeler": 1.40,
    "outdoor_vigorous_exercise": 2.80,
    "indoor_low_intensity_workout": 1.10,
    "infant_resting": 0.35,
    "child_active": 0.90,
}

# Environmental & Emission factors (EPA / DEFRA 2024 benchmarks)
EMISSION_FACTORS = {
    "car_gasoline_kg_co2_per_km": 0.192,
    "car_gasoline_kg_nox_per_km": 0.00035,
    "car_average_fuel_cost_per_km_usd": 0.22,
    "transit_cost_per_trip_usd": 1.25,
    # Berkeley Earth rule: ~22 ug/m3 24h ambient PM2.5 exposure is roughly 1 cigarette equivalent
    # Translates to ~20 ug inhaled PM2.5 per cigarette equivalent for an adult breathing ~15 m3/day
    "ug_pm25_per_cigarette_equivalent": 22.0,
}

# Filtration & penetration efficiencies
FILTRATION_EFFICIENCIES = {
    "n95_mask": 0.95,
    "surgical_mask": 0.40,
    "cloth_mask": 0.20,
    "sealed_home_unfiltered": 0.35,      # 35% reduction from ambient due to envelope filtration
    "sealed_home_with_hepa": 0.88,       # 88% reduction from ambient
    "corsi_rosenthal_box": 0.85,         # 85% reduction from ambient (MERV 13 4-filter cube)
    "wet_mopping_resuspension_cut": 0.45, # 45% reduction in indoor resuspended surface particulate
}

def calculate_inhalation_ug(
    breathing_rate_m3_hr: float,
    pollutant_conc_ug_m3: float,
    duration_hours: float,
    filtration_efficiency: float = 0.0
) -> float:
    """Calculates PM2.5 inhaled in micrograms."""
    effective_concentration = pollutant_conc_ug_m3 * (1.0 - filtration_efficiency)
    return round(breathing_rate_m3_hr * effective_concentration * duration_hours, 2)

def calculate_action_swap_impact(
    action_type: str,
    ambient_pm25: float = 235.0,
    duration_hours: float = 1.0,
    distance_km: float = 15.0,
    original_mode: str = "single_occupancy_car",
    has_hepa: bool = False
) -> Dict[str, Any]:
    """
    Computes exact avoided inhalation, cigarette equivalence, CO2e, and cost savings.
    """
    pm25_avoided_ug = 0.0
    co2e_saved_kg = 0.0
    cost_saved_usd = 0.0
    formula_note = ""

    if action_type == "carpool_swap":
        # Sharing commute cuts individual vehicle emissions in half
        co2e_saved_kg = round((distance_km * EMISSION_FACTORS["car_gasoline_kg_co2_per_km"]) * 0.5, 2)
        cost_saved_usd = round((distance_km * EMISSION_FACTORS["car_average_fuel_cost_per_km_usd"]) * 0.5, 2)
        # Exposure reduction: inside modern car cabin with active recirc vs congested roadside
        inhalation_baseline = calculate_inhalation_ug(
            BREATHING_RATES["outdoor_commute_two_wheeler"], ambient_pm25, duration_hours, 0.20
        )
        inhalation_improved = calculate_inhalation_ug(
            BREATHING_RATES["light_office"], ambient_pm25, duration_hours, 0.65
        )
        pm25_avoided_ug = max(0.0, round(inhalation_baseline - inhalation_improved, 2))
        formula_note = f"Shared vehicle transit across {distance_km}km: 50% vehicle tailpipe abatement + closed HVAC cabin filtration."

    elif action_type == "shift_outdoor_run_to_indoor":
        # Outdoor run: high breathing rate in high ambient PM2.5
        outdoor_inhalation = calculate_inhalation_ug(
            BREATHING_RATES["outdoor_vigorous_exercise"], ambient_pm25, duration_hours, 0.0
        )
        # Indoor workout: sealed room with either HEPA (88% filtration) or standard home (35% filtration)
        filt_eff = FILTRATION_EFFICIENCIES["sealed_home_with_hepa"] if has_hepa else FILTRATION_EFFICIENCIES["sealed_home_unfiltered"]
        indoor_inhalation = calculate_inhalation_ug(
            BREATHING_RATES["indoor_low_intensity_workout"], ambient_pm25, duration_hours, filt_eff
        )
        pm25_avoided_ug = round(outdoor_inhalation - indoor_inhalation, 2)
        formula_note = f"Shift from vigorous outdoors ({BREATHING_RATES['outdoor_vigorous_exercise']} m3/hr) to indoor filtered ({filt_eff*100:.0f}% removal)."

    elif action_type == "corsi_rosenthal_box":
        # Running DIY Corsi-Rosenthal box for 8 hours in room (living/nursery)
        hours = duration_hours if duration_hours > 1.0 else 8.0
        baseline = calculate_inhalation_ug(
            BREATHING_RATES["resting_indoor"], ambient_pm25, hours, FILTRATION_EFFICIENCIES["sealed_home_unfiltered"]
        )
        with_cr_box = calculate_inhalation_ug(
            BREATHING_RATES["resting_indoor"], ambient_pm25, hours, FILTRATION_EFFICIENCIES["corsi_rosenthal_box"]
        )
        pm25_avoided_ug = round(baseline - with_cr_box, 2)
        cost_saved_usd = 180.0  # Savings compared to purchasing a $250 commercial unit
        formula_note = f"Corsi-Rosenthal 4x MERV 13 box fan CADR ~250 CFM over {hours}hr operational cycle."

    elif action_type == "wet_mopping_protocol":
        # Mopping instead of sweeping prevents secondary dust resuspension
        hours = 12.0
        resuspended_pm = ambient_pm25 * 0.30
        avoided_resuspension = calculate_inhalation_ug(
            BREATHING_RATES["resting_indoor"], resuspended_pm, hours, FILTRATION_EFFICIENCIES["wet_mopping_resuspension_cut"]
        )
        pm25_avoided_ug = round(avoided_resuspension, 2)
        cost_saved_usd = 0.0
        formula_note = "Surface particulate damp trapping eliminates 45% of room-level aerosolized floor dust."

    else:
        # Generic protective action (e.g. N95 mask during 1 hr outdoor window)
        unmasked = calculate_inhalation_ug(BREATHING_RATES["moderate_walking"], ambient_pm25, duration_hours, 0.0)
        masked = calculate_inhalation_ug(BREATHING_RATES["moderate_walking"], ambient_pm25, duration_hours, 0.95)
        pm25_avoided_ug = round(unmasked - masked, 2)
        formula_note = f"N95 particulate respirator efficiency (95% collection efficiency on sub-micron aerosols)."

    # Compute cigarette equivalence
    cig_avoided = round(pm25_avoided_ug / EMISSION_FACTORS["ug_pm25_per_cigarette_equivalent"], 1)

    return {
        "action_type": action_type,
        "pm25_exposure_avoided_ug": pm25_avoided_ug,
        "equivalent_cigarettes_avoided": max(0.1, cig_avoided),
        "co2e_emissions_saved_kg": co2e_saved_kg,
        "estimated_cost_saved_usd": cost_saved_usd,
        "formula_breakdown": formula_note
    }
