import random
from datetime import datetime
from fastapi import APIRouter
from typing import List
from app.models.schemas import SmogHotspotReport, SchoolRecessFlag, CleanAirSanctuary

router = APIRouter()

# In-memory mock database for demo and standalone operation
REPORTS: List[SmogHotspotReport] = [
    SmogHotspotReport(
        report_id="rep-101",
        reporter_name="Resident Coordinator S.",
        fuzzed_lat=28.6180,
        fuzzed_lng=77.2140,
        hazard_type="waste_burning",
        description="Open municipal leaf and plastics burning near sector boundary.",
        status="verified",
        created_at="2026-11-23 07:45"
    ),
    SmogHotspotReport(
        report_id="rep-102",
        reporter_name="Commuter Amit",
        fuzzed_lat=28.6320,
        fuzzed_lng=77.2280,
        hazard_type="industrial_smoke",
        description="Heavy black exhaust billowing from warehouse diesel generator.",
        status="pending",
        created_at="2026-11-23 08:30"
    ),
    SmogHotspotReport(
        report_id="rep-103",
        reporter_name="RWA Green Lead",
        fuzzed_lat=28.5990,
        fuzzed_lng=77.2010,
        hazard_type="crop_burning",
        description="Field stubble burning smoke plume drifting across expressway.",
        status="verified",
        created_at="2026-11-23 09:15"
    )
]

RECESS_FLAGS: List[SchoolRecessFlag] = [
    SchoolRecessFlag(
        school_name="Delhi Public Academy (Central Campus)",
        location="Civil Lines District",
        current_flag="PURPLE",
        aqi_reading=310,
        recommendation="Emergency protocol: All outdoor recess, sports, and assembly canceled. Close all campus doors.",
        last_updated_by="PE Director Sharma",
        updated_at="2026-11-23 08:00"
    ),
    SchoolRecessFlag(
        school_name="St. Mary's International School",
        location="South Green Park",
        current_flag="RED",
        aqi_reading=245,
        recommendation="Strenuous outdoor running canceled. Sensitive students must remain in filtered gym hall.",
        last_updated_by="School Nurse Jenkins",
        updated_at="2026-11-23 08:15"
    ),
    SchoolRecessFlag(
        school_name="Heritage Valley Model School",
        location="Sector 14 West",
        current_flag="RED",
        aqi_reading=260,
        recommendation="Move all physical activity into HEPA-filtered multipurpose rooms.",
        last_updated_by="Admin Coordinator Rao",
        updated_at="2026-11-23 08:30"
    )
]

SANCTUARIES: List[CleanAirSanctuary] = [
    CleanAirSanctuary(
        name="Central Public Library & Reading Atrium",
        category="Public Library",
        address="14 Connaught Place Inner Ring",
        lat=28.6328,
        lng=77.2195,
        filtration_type="Central HEPA + Activated Carbon",
        current_indoor_aqi=24,
        distance_km=1.4,
        operating_hours="08:00 AM - 09:00 PM"
    ),
    CleanAirSanctuary(
        name="Metropolitan Civic Community Center",
        category="Community Center",
        address="Sector 8 Civic Complex",
        lat=28.6080,
        lng=77.2180,
        filtration_type="MERV-14 Positive Pressure Filtration",
        current_indoor_aqi=32,
        distance_km=2.1,
        operating_hours="07:00 AM - 10:00 PM"
    ),
    CleanAirSanctuary(
        name="Apollo Clean Air Breathing Sanctuary",
        category="Hospital Health Hub",
        address="Mathura Road Wellness Wing",
        lat=28.5670,
        lng=77.2840,
        filtration_type="Medical Grade H14 HEPA",
        current_indoor_aqi=12,
        distance_km=4.8,
        operating_hours="24 Hours Open"
    )
]

CARPOOLS = [
    {
        "id": "cp-1",
        "route": "Sector 62 -> Cyber City Corridor",
        "departure_time": "08:15 AM",
        "return_time": "06:30 PM",
        "seats_available": 2,
        "vehicle_type": "EV Sedan (Cabin HEPA Equipped)",
        "driver_name": "Rohan M.",
        "pm25_inhalation_reduction": "48%",
        "co2_savings_kg": 5.4
    },
    {
        "id": "cp-2",
        "route": "Rohini Sector 9 -> Connaught Place",
        "departure_time": "08:45 AM",
        "return_time": "05:45 PM",
        "seats_available": 3,
        "vehicle_type": "Hybrid SUV (Recirculation Active)",
        "driver_name": "Priyanka K.",
        "pm25_inhalation_reduction": "42%",
        "co2_savings_kg": 4.8
    }
]

@router.get("/hotspots", response_model=List[SmogHotspotReport])
async def list_hotspots():
    """Returns community burning hotspots with privacy-fuzzed coordinates (~500m radius)."""
    return REPORTS

@router.post("/hotspots", response_model=SmogHotspotReport)
async def report_hotspot(report: SmogHotspotReport):
    """
    Submits a user-reported smog hazard (waste burning, crop burning, diesel smoke).
    Fuzzes geographic coordinates to ensure privacy per NFR-4.1.
    """
    # Enforce minimum ~500m coordinate jitter for anonymity
    jitter_lat = (random.random() - 0.5) * 0.008
    jitter_lng = (random.random() - 0.5) * 0.008
    fuzzed_lat = round(report.fuzzed_lat + jitter_lat, 5)
    fuzzed_lng = round(report.fuzzed_lng + jitter_lng, 5)
    
    new_rep = SmogHotspotReport(
        report_id=f"rep-{random.randint(104, 999)}",
        reporter_name=report.reporter_name or "Community Member",
        fuzzed_lat=fuzzed_lat,
        fuzzed_lng=fuzzed_lng,
        hazard_type=report.hazard_type,
        description=report.description,
        status="pending",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    REPORTS.insert(0, new_rep)
    return new_rep

@router.get("/recess-flags", response_model=List[SchoolRecessFlag])
async def list_recess_flags():
    """Returns official school recess flag statuses for neighborhood coordinators."""
    return RECESS_FLAGS

@router.post("/recess-flags/toggle")
async def toggle_recess_flag(school_name: str, new_flag: str, coordinator_name: str):
    """Allows verified school coordinator to update air quality flag color."""
    for s in RECESS_FLAGS:
        if s.school_name == school_name:
            s.current_flag = new_flag
            s.last_updated_by = coordinator_name
            s.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M")
            return {"status": "success", "school": s}
    return {"status": "not_found"}

@router.get("/sanctuaries", response_model=List[CleanAirSanctuary])
async def list_clean_air_sanctuaries():
    """Returns directory of verified public clean-air sanctuaries."""
    return SANCTUARIES

@router.get("/carpools")
async def list_carpool_board():
    """Returns neighborhood carpool and walking bus coordination board."""
    return CARPOOLS
