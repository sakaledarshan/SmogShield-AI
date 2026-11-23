from fastapi import APIRouter
from app.workers.alert_worker import get_dispatched_alerts, check_and_dispatch_smog_alerts

router = APIRouter()

@router.get("/history")
def list_alert_history():
    """Returns history of proactive alerts dispatched via Web Push & WhatsApp."""
    return get_dispatched_alerts()

@router.post("/check")
def trigger_alert_evaluation(lat: float = 28.6139, lng: float = 77.2090):
    """Triggers background alert evaluation against current inversion conditions."""
    dispatched = check_and_dispatch_smog_alerts(lat, lng)
    return {
        "status": "evaluated",
        "new_alerts_count": len(dispatched),
        "dispatched": dispatched
    }
