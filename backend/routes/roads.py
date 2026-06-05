import os

import requests
from fastapi import APIRouter, HTTPException

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
            or query_lower in road["district"].lower()
            or query_lower in road["type"].lower()
            or query_lower in road["status"].lower()
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

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini is required for the RoadWatch AI demo. Set GEMINI_API_KEY in backend/.env and restart the API.",
        )

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    context = [
        "You are RoadWatch AI, a concise civic-tech assistant for Indian road safety and infrastructure transparency.",
        "Help users understand road authority routing, complaint drafting, inspection evidence, and budget accountability.",
        "Do not invent official IDs, phone numbers, or live government records. Ask for missing road/location details when needed.",
    ]
    if payload.road_name:
        context.append(f"Road context: {payload.road_name}.")
    if payload.district:
        context.append(f"District context: {payload.district}.")

    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": "\n".join(context) + f"\n\nUser asks: {payload.message}"}],
            }
        ]
    }

    try:
        response = requests.post(url, headers={"x-goog-api-key": api_key}, json=body, timeout=60)
        response.raise_for_status()
        data = response.json()
        reply = data["candidates"][0]["content"]["parts"][0].get("text", "I could not generate a response.")
        return {"reply": reply, "source": "gemini"}
    except requests.HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else "unknown"
        raise HTTPException(status_code=502, detail=f"Gemini request failed with provider status {status_code}.") from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Gemini request failed before a valid response was returned.") from exc
