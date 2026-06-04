import os

import requests
from fastapi import APIRouter

from services.routing_engine import classify_authority

router = APIRouter(prefix="/api", tags=["roads"])


@router.get("/roads/search")
def search_roads(query: str = ""):
    sample_roads = [
        {"road": "NH-44", "type": "NH", "district": "Chennai", "status": "Moderate"},
        {"road": "SH-17", "type": "SH", "district": "Kanchipuram", "status": "Needs Review"},
        {"road": "MDR-4", "type": "MDR", "district": "Thiruvallur", "status": "High Risk"},
    ]

    if query:
        query_lower = query.lower()
        sample_roads = [road for road in sample_roads if query_lower in road["road"].lower() or query_lower in road["district"].lower()]

    return {"query": query or "nearby road", "results": sample_roads}


@router.post("/complaints/route")
def route_complaint(payload: dict):
    road_type = payload.get("road_type", "SH")
    district = payload.get("district", "")
    classification = classify_authority(road_type=road_type, district=district)

    return {
        "road_type": road_type,
        "district": district,
        "authority": classification["authority"],
        "priority": classification["priority"],
        "draft": f"Request urgent inspection for {road_type} road in {district or 'the specified jurisdiction'} and route it to {classification['authority']}.",
    }


@router.post("/chat")
def chat(payload: dict):
    message = payload.get("message", "")
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {
            "reply": "Gemini API key is not configured. Add GEMINI_API_KEY to your backend environment to enable AI responses.",
            "source": "fallback",
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"You are RoadWatch AI. Help with road safety complaints and infrastructure transparency. User asks: {message}"}],
            }
        ]
    }

    try:
        response = requests.post(url, json=body, timeout=60)
        response.raise_for_status()
        data = response.json()
        reply = data["candidates"][0]["content"]["parts"][0].get("text", "I could not generate a response.")
        return {"reply": reply, "source": "gemini"}
    except Exception as exc:
        return {"reply": f"AI request failed: {exc}", "source": "error"}
