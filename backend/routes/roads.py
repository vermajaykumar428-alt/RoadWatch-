import os

from fastapi import APIRouter

from models import ChatRequest, ChatResponse, ComplaintRouteRequest, ComplaintRouteResponse, RoadSearchResponse
from services.data_adapter import RoadDataAdapter
from services.routing_engine import classify_authority

router = APIRouter(prefix="/api", tags=["roads"])
road_adapter = RoadDataAdapter()


@router.get("/roads/search", response_model=RoadSearchResponse)
def search_roads(query: str = ""):
    roads = road_adapter.load_roads()

    if query:
        query_lower = query.lower()
        roads = [
            road
            for road in roads
            if query_lower in road["road"].lower()
            or query_lower in road["name"].lower()
            or query_lower in road["district"].lower()
            or query_lower in road["state"].lower()
            or query_lower in road["type"].lower()
            or query_lower in road["status"].lower()
            or query_lower in road["hazard_type"].lower()
            or query_lower in road["authority"].lower()
        ]

    return {"query": query or "all demo roads", "total": len(roads), "results": roads}


@router.post("/complaints/route", response_model=ComplaintRouteResponse)
def route_complaint(payload: ComplaintRouteRequest):
    road_type = payload.road_type.upper()
    district = payload.district
    classification = classify_authority(road_type=road_type, district=district)
    road_label = payload.road_name or f"{road_type} road"
    district_label = district or "the specified jurisdiction"
    issue = payload.issue.strip().rstrip(".") or "Road hazard requiring inspection"

    return {
        "road_type": road_type,
        "district": district,
        "authority": classification["authority"],
        "priority": classification["priority"],
        "escalation_channel": classification["escalation_channel"],
        "draft": (
            f"Request urgent inspection for {road_label} in {district_label}. "
            f"Issue reported: {issue}. Please route this to {classification['authority']} "
            f"and share an expected repair timeline."
        ),
        "next_steps": [
            "Attach a geotagged photo and nearest landmark before submission.",
            f"Send the complaint through {classification['escalation_channel']}.",
            "Ask for a complaint ID and follow up if no inspection is scheduled within 7 working days.",
        ],
    }


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    fallback = _fallback_reply(payload.message, payload.road_name, payload.district)

    if not api_key:
        return {"reply": fallback, "source": "fallback"}

    try:
        import google.generativeai as genai

        context = [
            "You are RoadWatch AI, a concise civic-tech assistant for Indian road safety and infrastructure transparency.",
            "Help users understand road authority routing, complaint drafting, inspection evidence, and budget accountability.",
            "Do not invent official IDs, phone numbers, or live government records. Ask for missing road/location details when needed.",
        ]
        if payload.road_name:
            context.append(f"Road context: {payload.road_name}.")
        if payload.district:
            context.append(f"District context: {payload.district}.")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("\n".join(context) + f"\n\nUser asks: {payload.message}")
        reply = response.text or fallback
        return {"reply": reply, "source": "gemini"}
    except Exception:
        return {"reply": fallback, "source": "fallback"}


def _fallback_reply(message: str, road_name: str | None = None, district: str | None = None) -> str:
    road_label = road_name or "the reported road"
    district_label = district or "the relevant district"
    return (
        "RoadWatch AI fallback draft\n\n"
        f"To: NHAI / State PWD / local road authority for {district_label}\n"
        f"Subject: Urgent inspection requested for {road_label}\n\n"
        f"Citizen request: {message}\n\n"
        "Please inspect the location, log the hazard with geotagged photos, confirm the responsible contractor, "
        "and share a repair timeline. If this is an NH segment, route it to NHAI or the MoRTH regional office. "
        "For SH or city roads, route it to the State PWD division or municipal engineering office."
    )
