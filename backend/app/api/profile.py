from fastapi import APIRouter, Depends
import sqlite3
from app.db.session import get_db
from app.models.schemas import HouseholdProfile, Location
from app.core.security import get_current_user, AuthenticatedUser

router = APIRouter()

@router.get("", response_model=HouseholdProfile)
def get_user_profile(conn: sqlite3.Connection = Depends(get_db)):
    """
    Returns persistent household profile loaded from database.
    """
    c = conn.cursor()
    c.execute("""
        SELECT user_id, home_lat, home_lng, has_infants, has_elderly,
               has_respiratory_conditions, home_type, has_hepa_filter,
               primary_commute_mode, budget_tier
        FROM household_profiles LIMIT 1
    """)
    row = c.fetchone()
    if row:
        return HouseholdProfile(
            user_id=row["user_id"],
            has_infants=bool(row["has_infants"]),
            has_elderly=bool(row["has_elderly"]),
            has_respiratory_conditions=bool(row["has_respiratory_conditions"]),
            home_type=row["home_type"],
            has_hepa_filter=bool(row["has_hepa_filter"]),
            primary_commute_mode=row["primary_commute_mode"],
            budget_tier=row["budget_tier"],
            home_location=Location(lat=row["home_lat"], lng=row["home_lng"], city_name="New Delhi NCR")
        )

    # Fallback
    return HouseholdProfile(
        user_id="usr-default-demo",
        has_infants=True,
        has_elderly=False,
        has_respiratory_conditions=True,
        home_type="apartment",
        has_hepa_filter=False,
        primary_commute_mode="transit",
        budget_tier="low",
        home_location=Location(lat=28.6139, lng=77.2090, city_name="New Delhi NCR")
    )

@router.put("", response_model=HouseholdProfile)
def update_user_profile(
    profile: HouseholdProfile,
    conn: sqlite3.Connection = Depends(get_db),
    current_user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Persists household profile into database. Protected by OAuth 2.0 / JWT auth.
    """
    c = conn.cursor()
    lat = profile.home_location.lat if profile.home_location else 28.6139
    lng = profile.home_location.lng if profile.home_location else 77.2090

    c.execute("""
        UPDATE household_profiles SET
            has_infants = ?,
            has_elderly = ?,
            has_respiratory_conditions = ?,
            home_type = ?,
            has_hepa_filter = ?,
            primary_commute_mode = ?,
            budget_tier = ?,
            home_lat = ?,
            home_lng = ?
        WHERE profile_id = 'prof-demo'
    """, (
        1 if profile.has_infants else 0,
        1 if profile.has_elderly else 0,
        1 if profile.has_respiratory_conditions else 0,
        profile.home_type,
        1 if profile.has_hepa_filter else 0,
        profile.primary_commute_mode,
        profile.budget_tier,
        lat,
        lng
    ))
    conn.commit()
    return profile
