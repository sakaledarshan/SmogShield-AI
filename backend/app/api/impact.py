from fastapi import APIRouter
from app.models.schemas import ImpactSimulationRequest, ImpactSimulationResponse
from app.engine.deterministic import calculate_action_swap_impact

router = APIRouter()

@router.post("/simulate", response_model=ImpactSimulationResponse)
def simulate_impact(req: ImpactSimulationRequest):
    """
    Calculates deterministic impact metrics for a potential user action swap.
    Formula: Inhalation PM2.5 = Breathing Rate * Pollutant Conc * Duration.
    Eliminates arithmetic hallucinations before LLM generation.
    """
    res = calculate_action_swap_impact(
        action_type=req.action_type,
        ambient_pm25=req.ambient_pm25 or 235.0,
        duration_hours=req.duration_hours or 1.0,
        distance_km=req.distance_km or 15.0,
        original_mode=req.original_mode or "single_occupancy_car"
    )
    return ImpactSimulationResponse(**res)

@router.get("/ledger")
def get_cumulative_ledger():
    """
    Returns weekly cumulative ledger metrics: personal PM2.5 exposure avoided,
    household emissions reduced (kg CO2e & NOx), cigarette equivalence, and habit streak.
    """
    return {
        "weekly_pm25_avoided_ug": 348.2,
        "weekly_cigarettes_avoided": 15.8,
        "co2e_saved_kg": 24.6,
        "nox_saved_g": 44.8,
        "financial_saved_usd": 38.50,
        "current_habit_streak_days": 8,
        "daily_breakdown": [
            {"day": "Mon", "pm25_avoided_ug": 52.4, "co2e_kg": 3.8, "actions": 3},
            {"day": "Tue", "pm25_avoided_ug": 64.1, "co2e_kg": 4.2, "actions": 4},
            {"day": "Wed", "pm25_avoided_ug": 45.0, "co2e_kg": 3.4, "actions": 2},
            {"day": "Thu", "pm25_avoided_ug": 78.2, "co2e_kg": 5.1, "actions": 4},
            {"day": "Fri", "pm25_avoided_ug": 58.0, "co2e_kg": 4.0, "actions": 3},
            {"day": "Sat", "pm25_avoided_ug": 25.5, "co2e_kg": 2.1, "actions": 2},
            {"day": "Sun", "pm25_avoided_ug": 25.0, "co2e_kg": 2.0, "actions": 2}
        ],
        "active_micro_pledges": [
            {"id": "p1", "title": "Zero-Idle Carpool to Work", "target": "5 days", "progress": "4/5", "completed": False},
            {"id": "p2", "title": "Damp Microfiber Mopping Routine", "target": "Daily", "progress": "7/7", "completed": True},
            {"id": "p3", "title": "Air Purifier Running on Low overnight", "target": "7 nights", "progress": "7/7", "completed": True}
        ]
    }
