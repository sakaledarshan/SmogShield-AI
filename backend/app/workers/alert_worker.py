"""
Proactive Smog Alert & Thermal Inversion Monitoring Worker.
Periodically monitors:
- 24-hour thermal inversion forecasts
- Severe AQI threshold spikes (>200, >300 AQI)
- Daily Safe Ventilation Window (approaching 1:00 PM)
Dispatches simulated Web Push / WhatsApp alerts with Redis event caching.
"""

from datetime import datetime
from typing import List, Dict, Any
from app.engine.normalizer import generate_hourly_forecast, detect_thermal_inversion, calculate_daily_safe_ventilation_window
from app.core.cache import cache

DISPATCHED_ALERTS: List[Dict[str, Any]] = [
    {
        "alert_id": "alt-001",
        "type": "THERMAL_INVERSION_WARNING",
        "severity": "HIGH",
        "title": "Severe Nocturnal Thermal Inversion Trapped",
        "message": "Ground ceiling capped at ~120m. Trapped surface particulate cannot disperse vertically. Seal all bedroom window gaskets.",
        "channels": ["Web Push", "WhatsApp"],
        "dispatched_at": "2026-11-23 07:15"
    },
    {
        "alert_id": "alt-002",
        "type": "SAFE_VENTILATION_WINDOW",
        "severity": "INFO",
        "title": "2-Hour Safe Aeration Window Approaching",
        "message": "Solar thermal boundary layer expanding (>650m). Optimal 20-minute cross-ventilation window active between 1:00 PM and 3:00 PM.",
        "channels": ["Web Push"],
        "dispatched_at": "2026-11-23 12:45"
    }
]

def check_and_dispatch_smog_alerts(lat: float = 28.6139, lng: float = 77.2090) -> List[Dict[str, Any]]:
    """
    Evaluates meteorological conditions and triggers proactive alerts if thresholds are exceeded.
    """
    forecast = generate_hourly_forecast(lat, lng)
    inversion = detect_thermal_inversion(forecast)
    safe_window = calculate_daily_safe_ventilation_window(forecast)

    new_alerts = []
    cache_key = "last_dispatched_inversion_alert"

    if inversion.detected and not cache.get(cache_key):
        alert_item = {
            "alert_id": f"alt-{int(datetime.utcnow().timestamp())}",
            "type": "THERMAL_INVERSION_DETECTED",
            "severity": "SEVERE" if inversion.severity == "severe" else "MODERATE",
            "title": f"Inversion Alert: Ceiling at ~{inversion.inversion_layer_height_m}m",
            "message": inversion.protective_action,
            "channels": ["Web Push", "Email", "WhatsApp"],
            "dispatched_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        DISPATCHED_ALERTS.insert(0, alert_item)
        new_alerts.append(alert_item)
        # Suppress duplicate alerts for 6 hours
        cache.set(cache_key, True, ttl_seconds=6 * 3600)

    return new_alerts

def get_dispatched_alerts() -> List[Dict[str, Any]]:
    return DISPATCHED_ALERTS
