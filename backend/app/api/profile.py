from fastapi import APIRouter
from app.models.schemas import HouseholdProfile, Location

router = APIRouter()

# Default user profile stored in memory
CURRENT_PROFILE = HouseholdProfile(
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

@router.get("", response_model=HouseholdProfile)
async def get_user_profile():
    """Returns the current user household and lifestyle profile."""
    return CURRENT_PROFILE

@router.put("", response_model=HouseholdProfile)
async def update_user_profile(profile: HouseholdProfile):
    """Updates household parameters and dynamically recalibrates daily recommendations."""
    global CURRENT_PROFILE
    CURRENT_PROFILE = profile
    return CURRENT_PROFILE
