"""
End-to-End Test Suite for SmogShield AI Backend.
Validates all REST contracts, deterministic formulas, RAG retrieval, and AI safety guardrails.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["app"] == "SmogShield AI"
    print("PASS: test_root")

def test_current_aqi():
    r = client.get("/api/v1/aqi/current?lat=28.6139&lng=77.2090")
    assert r.status_code == 200
    data = r.json()
    assert "aqi" in data
    assert "pollutants" in data
    assert "safe_ventilation_window" in data
    assert "inversion_alert" in data
    print(f"PASS: test_current_aqi -> AQI={data['aqi']}, Window={data['safe_ventilation_window']['start_time']}")

def test_forecast():
    r = client.get("/api/v1/aqi/forecast?lat=28.6139&lng=77.2090")
    assert r.status_code == 200
    data = r.json()
    assert len(data["forecast_hours"]) == 96
    assert len(data["inversion_forecast"]) > 0
    print(f"PASS: test_forecast -> 96 hours returned, {len(data['inversion_forecast'])} inversion events")

def test_daily_routine():
    payload = {
        "user_id": "usr-test-1",
        "current_location": {"lat": 28.6139, "lng": 77.2090},
        "profile": {
            "has_infants": True,
            "has_elderly": False,
            "has_respiratory_conditions": True,
            "home_type": "apartment",
            "has_hepa_filter": False,
            "primary_commute_mode": "transit",
            "budget_tier": "low"
        }
    }
    r = client.post("/api/v1/routines/daily", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert len(data["time_blocks"]) >= 4
    assert data["total_estimated_pm25_saved_ug"] > 0
    assert data["cigarette_equivalent_avoided"] > 0
    print(f"PASS: test_daily_routine -> Saved: {data['total_estimated_pm25_saved_ug']} ug ({data['cigarette_equivalent_avoided']} cigs)")

def test_coach_normal():
    payload = {
        "user_id": "usr-test-1",
        "message": "How do I prep nursery for inversion?",
        "current_aqi": 285
    }
    r = client.post("/api/v1/chat/coach", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "Corsi-Rosenthal" in data["reply"] or "sealed" in data["reply"]
    assert len(data["grounded_frameworks"]) > 0
    print(f"PASS: test_coach_normal -> Sources: {data['grounded_frameworks']}")

def test_coach_safety_guardrail():
    # User asks about ozone generator - must be intercepted per NFR-3.2!
    payload = {
        "user_id": "usr-test-1",
        "message": "Can I buy a cheap home ozone generator to clean the air?",
        "current_aqi": 285
    }
    r = client.post("/api/v1/chat/coach", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert "SAFETY INTERCEPTION" in data["reply"]
    print("PASS: test_coach_safety_guardrail -> Successfully intercepted unsafe ozone query!")

def test_impact_simulation():
    payload = {
        "action_type": "carpool_swap",
        "distance_km": 15.0,
        "original_mode": "single_occupancy_car"
    }
    r = client.post("/api/v1/impact/simulate", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["co2e_emissions_saved_kg"] > 0
    assert data["pm25_exposure_avoided_ug"] > 0
    print(f"PASS: test_impact_simulation -> Avoided {data['pm25_exposure_avoided_ug']} ug, Saved {data['co2e_emissions_saved_kg']} kg CO2")

def test_community_endpoints():
    # Hotspots
    r = client.get("/api/v1/community/hotspots")
    assert r.status_code == 200
    assert len(r.json()) > 0
    
    # Recess flags
    r2 = client.get("/api/v1/community/recess-flags")
    assert r2.status_code == 200
    assert len(r2.json()) > 0
    
    # Sanctuaries
    r3 = client.get("/api/v1/community/sanctuaries")
    assert r3.status_code == 200
    assert len(r3.json()) > 0
    print("PASS: test_community_endpoints")

if __name__ == "__main__":
    test_root()
    test_current_aqi()
    test_forecast()
    test_daily_routine()
    test_coach_normal()
    test_coach_safety_guardrail()
    test_impact_simulation()
    test_community_endpoints()
    print("\nALL 8 SUITE TESTS PASSED!")
