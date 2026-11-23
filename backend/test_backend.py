"""
Direct asynchronous endpoint test for SmogShield AI.
Uses httpx.AsyncClient with ASGITransport to test FastAPI cleanly.
"""

import asyncio
import httpx
from app.main import app

async def run_tests():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Root & Health
        r = await client.get("/")
        assert r.status_code == 200, f"Root failed: {r.status_code}"
        print(f"✓ Root endpoint online: {r.json()['app']} v{r.json()['version']}")

        # 2. AQI Current
        r = await client.get("/api/v1/aqi/current?lat=28.6139&lng=77.2090")
        assert r.status_code == 200
        cur = r.json()
        print(f"✓ Current AQI: {cur['aqi']} ({cur['category']}) | Dominant: {cur['dominant_pollutant']}")
        print(f"  Safe Aeration Window: {cur['safe_ventilation_window']['start_time']} -> {cur['safe_ventilation_window']['end_time']}")

        # 3. 96-hour Forecast
        r = await client.get("/api/v1/aqi/forecast?lat=28.6139&lng=77.2090")
        assert r.status_code == 200
        fc = r.json()
        print(f"✓ 96-Hour Forecast: returned {len(fc['forecast_hours'])} hours, {len(fc['inversion_forecast'])} inversion periods")

        # 4. Daily Routine Generation
        r = await client.post("/api/v1/routines/daily", json={
            "user_id": "usr-test",
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
        })
        assert r.status_code == 200
        rt = r.json()
        print(f"✓ Daily Routine: {len(rt['time_blocks'])} time blocks | Avoidance: {rt['total_estimated_pm25_saved_ug']} µg ({rt['cigarette_equivalent_avoided']} cigs eq)")

        # 5. Deterministic Impact Simulator
        r = await client.post("/api/v1/impact/simulate", json={
            "action_type": "carpool_swap",
            "distance_km": 15.0,
            "original_mode": "single_occupancy_car"
        })
        assert r.status_code == 200
        sim = r.json()
        print(f"✓ Impact Simulator: Avoided {sim['pm25_exposure_avoided_ug']} µg PM2.5 | Saved {sim['co2e_emissions_saved_kg']} kg CO2e")

        # 6. Coach Query (Standard RAG)
        r = await client.post("/api/v1/chat/coach", json={
            "user_id": "usr-test",
            "message": "How do I prep nursery for tonight's inversion?",
            "current_aqi": 285
        })
        assert r.status_code == 200
        coach_res = r.json()
        print(f"✓ Coach RAG: Grounded in {coach_res['grounded_frameworks']}")

        # 7. Coach Safety Guardrail (Intercepting dangerous DIY hack)
        r = await client.post("/api/v1/chat/coach", json={
            "user_id": "usr-test",
            "message": "Can I use an ozone generator to clean the air?",
            "current_aqi": 285
        })
        assert r.status_code == 200
        guardrail_res = r.json()
        assert "SAFETY INTERCEPTION" in guardrail_res["reply"]
        print("✓ Safety Guardrail: Successfully intercepted hazardous ozone generator query!")

        # 8. Community Hub Endpoints
        r = await client.get("/api/v1/community/hotspots")
        assert r.status_code == 200
        print(f"✓ Community Hotspots: {len(r.json())} active reports (~500m privacy fuzzed)")

        r = await client.get("/api/v1/community/recess-flags")
        assert r.status_code == 200
        print(f"✓ School Recess Flags: {len(r.json())} campus flags active")

        r = await client.get("/api/v1/community/sanctuaries")
        assert r.status_code == 200
        print(f"✓ Clean Air Sanctuaries: {len(r.json())} verified filtered safe spaces")

    print("\n==========================================")
    print(" ALL SMOGSHIELD AI BACKEND TESTS PASSED! ")
    print("==========================================")

if __name__ == "__main__":
    asyncio.run(run_tests())
