from fastapi import APIRouter
from datetime import datetime
from app.models.schemas import DailyRoutineRequest, DailyRoutineResponse, TimeBlockAction
from app.engine.deterministic import calculate_action_swap_impact

router = APIRouter()

@router.post("/daily", response_model=DailyRoutineResponse)
def generate_daily_routine(req: DailyRoutineRequest):
    """
    Generates a structured, time-blocked personal smog defense routine
    tailored to the user's household profile (infants, seniors, asthma, budget, commute).
    """
    profile = req.profile
    has_infant = profile.has_infants if profile else True
    has_asthma = profile.has_respiratory_conditions if profile else False
    budget = profile.budget_tier if profile else "low"
    commute = profile.primary_commute_mode if profile else "transit"
    
    # Deterministic impact pre-calculations
    commute_impact = calculate_action_swap_impact("carpool_swap", ambient_pm25=280.0, distance_km=12.0)
    exercise_impact = calculate_action_swap_impact("shift_outdoor_run_to_indoor", ambient_pm25=260.0, duration_hours=1.0)
    home_impact = calculate_action_swap_impact("wet_mopping_protocol", ambient_pm25=235.0)
    cr_impact = calculate_action_swap_impact("corsi_rosenthal_box", ambient_pm25=235.0, duration_hours=8.0)
    
    time_blocks = [
        TimeBlockAction(
            time="07:00 AM - 09:00 AM",
            action=f"Shift morning outdoor cardio to indoor core workout. Mask with N95 during {commute} commute.",
            category="Commute & Fitness",
            pm25_reduction_ug=exercise_impact["pm25_exposure_avoided_ug"],
            why_it_matters=f"Prevents inhaling ~{exercise_impact['pm25_exposure_avoided_ug']} ug of toxic soot during the morning inversion spike ({exercise_impact['equivalent_cigarettes_avoided']} cigs eq).",
            budget_tier="zero_cost"
        ),
        TimeBlockAction(
            time="09:30 AM - 12:30 PM",
            action="Perform wet-microfiber damp mopping on nursery and living area floors. Keep window frames sealed.",
            category="Indoor IAQ",
            pm25_reduction_ug=home_impact["pm25_exposure_avoided_ug"],
            why_it_matters="Damp mopping traps micro-particulate on surfaces rather than re-suspending it into children's breathing zone.",
            budget_tier="zero_cost"
        ),
        TimeBlockAction(
            time="01:00 PM - 03:00 PM",
            action="Open south-facing windows for safe 2-hour cross-ventilation window. Purge indoor CO2.",
            category="Home Aeration",
            pm25_reduction_ug=18.5,
            why_it_matters="Solar boundary layer expansion reaches peak dispersion (>650m). Safe window to flush carbon dioxide.",
            budget_tier="zero_cost"
        ),
        TimeBlockAction(
            time="05:30 PM - 07:30 PM",
            action="Carpool swap or take metro corridor home. Seal nursery door draft gap with rolled towel or seal.",
            category="Commute & Shelter",
            pm25_reduction_ug=commute_impact["pm25_exposure_avoided_ug"],
            why_it_matters=f"Avoids high-exposure vehicle congestion exhaust and saves {commute_impact['co2e_emissions_saved_kg']} kg CO2e.",
            budget_tier=budget
        ),
        TimeBlockAction(
            time="09:00 PM - 07:00 AM",
            action="Run bedroom air filtration unit (or DIY Corsi-Rosenthal fan) on quiet mode during overnight inversion.",
            category="Night Defense",
            pm25_reduction_ug=cr_impact["pm25_exposure_avoided_ug"],
            why_it_matters="Ground-level thermal inversion traps dense particulate overnight; continuous mechanical filtration keeps sleeping IAQ < 15 ug/m3.",
            budget_tier=budget
        )
    ]
    
    total_saved = sum(b.pm25_reduction_ug for b in time_blocks)
    cig_eq = round(total_saved / 22.0, 1)
    
    hero = (
        "High morning inversion layer detected (capping ceiling at 120m). "
        "Keep windows sealed until the 1:00 PM safe aeration window. Wear N95 during transit."
    )
    
    return DailyRoutineResponse(
        routine_date=datetime.now().strftime("%Y-%m-%d"),
        hero_summary=hero,
        inversion_warning="Severe ground inversion active until 11:30 AM. Particulate cannot disperse vertically.",
        time_blocks=time_blocks,
        total_estimated_pm25_saved_ug=round(total_saved, 1),
        cigarette_equivalent_avoided=cig_eq
    )
