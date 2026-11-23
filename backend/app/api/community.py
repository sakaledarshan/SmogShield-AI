import random
import sqlite3
from datetime import datetime
from fastapi import APIRouter, Depends
from typing import List
from app.db.session import get_db
from app.models.schemas import SmogHotspotReport, SchoolRecessFlag, CleanAirSanctuary
from app.core.security import get_current_user, AuthenticatedUser

router = APIRouter()

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
def list_hotspots(conn: sqlite3.Connection = Depends(get_db)):
    """Returns persistent community burning hotspots from database with fuzzed coordinates (~500m)."""
    c = conn.cursor()
    c.execute("SELECT report_id, reporter_name, fuzzed_lat, fuzzed_lng, hazard_type, description, status, created_at FROM community_reports ORDER BY created_at DESC")
    rows = c.fetchall()
    return [
        SmogHotspotReport(
            report_id=r["report_id"],
            reporter_name=r["reporter_name"] or "Community Citizen",
            fuzzed_lat=r["fuzzed_lat"],
            fuzzed_lng=r["fuzzed_lng"],
            hazard_type=r["hazard_type"],
            description=r["description"],
            status=r["status"],
            created_at=r["created_at"]
        )
        for r in rows
    ]

@router.post("/hotspots", response_model=SmogHotspotReport)
def report_hotspot(
    report: SmogHotspotReport,
    conn: sqlite3.Connection = Depends(get_db),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Submits a user-reported smog hazard and persists to database.
    Protected by OAuth 2.0 / JWT auth.
    Fuzzes geographic coordinates to ensure privacy per NFR-4.1.
    """
    jitter_lat = (random.random() - 0.5) * 0.008
    jitter_lng = (random.random() - 0.5) * 0.008
    f_lat = round(report.fuzzed_lat + jitter_lat, 5)
    f_lng = round(report.fuzzed_lng + jitter_lng, 5)
    rep_id = f"rep-{random.randint(104, 999)}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    c = conn.cursor()
    c.execute("""
        INSERT INTO community_reports (report_id, reporter_name, fuzzed_lat, fuzzed_lng, hazard_type, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        rep_id,
        report.reporter_name or "Community Member",
        f_lat,
        f_lng,
        report.hazard_type,
        report.description,
        "pending",
        now_str
    ))
    conn.commit()

    return SmogHotspotReport(
        report_id=rep_id,
        reporter_name=report.reporter_name or "Community Member",
        fuzzed_lat=f_lat,
        fuzzed_lng=f_lng,
        hazard_type=report.hazard_type,
        description=report.description,
        status="pending",
        created_at=now_str
    )

@router.get("/recess-flags", response_model=List[SchoolRecessFlag])
def list_recess_flags():
    """Returns official school recess flag statuses for neighborhood coordinators."""
    return RECESS_FLAGS

@router.post("/recess-flags/toggle")
def toggle_recess_flag(
    school_name: str,
    new_flag: str,
    coordinator_name: str,
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """Allows verified school coordinator to update air quality flag color."""
    for s in RECESS_FLAGS:
        if s.school_name == school_name:
            s.current_flag = new_flag
            s.last_updated_by = coordinator_name
            s.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M")
            return {"status": "success", "school": s}
    return {"status": "not_found"}

@router.get("/sanctuaries", response_model=List[CleanAirSanctuary])
def list_clean_air_sanctuaries():
    """Returns directory of verified public clean-air sanctuaries."""
    return SANCTUARIES

@router.get("/carpools")
def list_carpool_board():
    """Returns neighborhood carpool and walking bus coordination board."""
    return CARPOOLS
