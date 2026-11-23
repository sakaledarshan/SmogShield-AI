from fastapi import APIRouter
from app.models.schemas import ChatCoachRequest, ChatCoachResponse
from app.services.gemini_service import gemini_coach

router = APIRouter()

@router.post("/coach", response_model=ChatCoachResponse)
def chat_with_coach(req: ChatCoachRequest):
    """
    Conversational GenAI Coach grounded in WHO, EPA, and ASHRAE frameworks.
    Enforces automatic safety guardrails against dangerous DIY hacks.
    """
    res = gemini_coach.answer_query(
        query=req.message,
        profile=req.household_profile,
        current_aqi=req.current_aqi or 285
    )
    return ChatCoachResponse(
        reply=res["reply"],
        grounded_frameworks=res["grounded_frameworks"],
        actionable_hacks=res["actionable_hacks"],
        safety_disclaimer=res["safety_disclaimer"]
    )
