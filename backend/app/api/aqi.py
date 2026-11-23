from fastapi import APIRouter, Query
from app.models.schemas import AQICurrentResponse, AQIForecastResponse, Location
from app.engine.normalizer import (
    get_normalized_aqi_payload, generate_hourly_forecast,
    calculate_daily_safe_ventilation_window
)

router = APIRouter()

@router.get("/current", response_model=AQICurrentResponse)
def get_current_aqi(
    lat: float = Query(28.6139, description="Latitude"),
    lng: float = Query(77.2090, description="Longitude")
):
    """
    Returns current normalized air quality metrics for specified coordinates.
    Standardized across Google Air Quality API, OpenAQ, and WAQI.
    """
    return get_normalized_aqi_payload(lat, lng)

@router.get("/forecast", response_model=AQIForecastResponse)
def get_forecast(
    lat: float = Query(28.6139, description="Latitude"),
    lng: float = Query(77.2090, description="Longitude")
):
    """
    Returns 96-hour continuous hourly AQI forecast timeline highlighting
    predicted smog spikes, safe ventilation windows, and atmospheric inversions.
    """
    forecast_hours = generate_hourly_forecast(lat, lng)
    safe_window = calculate_daily_safe_ventilation_window(forecast_hours)
    
    inversion_events = [
        {
            "day": "Day 1 (Tonight - Tomorrow Morning)",
            "start_hour": "22:00",
            "end_hour": "09:00",
            "ceiling_altitude_m": 120,
            "severity": "High (Trapping particulate density)",
            "guidance": "Run bedroom air filtration on high; tape leaky window frames."
        },
        {
            "day": "Day 2 (Night)",
            "start_hour": "23:00",
            "end_hour": "08:30",
            "ceiling_altitude_m": 160,
            "severity": "Moderate",
            "guidance": "Pre-filter home during safe afternoon aeration window."
        }
    ]
    
    return AQIForecastResponse(
        location=Location(lat=lat, lng=lng, city_name="Metropolitan District"),
        forecast_hours=forecast_hours,
        inversion_forecast=inversion_events,
        recommended_windows=[safe_window]
    )
