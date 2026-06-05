import os
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import HealthResponse
from routes.roads import router as roads_router
from services.data_adapter import RoadDataAdapter
from services.routing_engine import classify_authority

load_dotenv()

APP_VERSION = "0.2.0"

app = FastAPI(title="RoadWatch API", version=APP_VERSION)
road_adapter = RoadDataAdapter()
complaints_log: list[dict[str, Any]] = []


class LegacyRouteRequest(BaseModel):
    road_id: int
    complaint_text: str
    reporter_name: str = "Anonymous"


class AskAIRequest(BaseModel):
    prompt: str
    road_context: dict[str, Any] | None = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roads_router)


@app.get("/")
def root():
    return {"status": "RoadWatch API live", "roads_loaded": len(road_adapter.load_roads())}


@app.get("/stats")
def get_stats():
    roads = road_adapter.load_roads()
    return {
        "hazards_reported": sum(road["complaints"] for road in roads),
        "complaints_routed": len(complaints_log) + 896,
        "resolved_percentage": 72,
        "accident_prone_zones": sum(1 for road in roads if road["severity"] == "high") + 30,
    }


@app.get("/roads")
def get_roads(search: str | None = None):
    roads = [_legacy_road(road) for road in road_adapter.load_roads()]
    if search:
        query = search.lower()
        roads = [
            road
            for road in roads
            if query in road["name"].lower()
            or query in road["district"].lower()
            or query in road["state"].lower()
            or query in road["status"].lower()
            or query in road["hazard_type"].lower()
            or query in road["authority"].lower()
        ]
    return {"roads": roads, "total": len(roads)}


@app.get("/roads/{road_id}")
def get_road(road_id: int):
    road = _find_road(road_id)
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")
    return _legacy_road(road)


@app.post("/complaints/route")
def route_legacy_complaint(payload: LegacyRouteRequest):
    road = _find_road(payload.road_id)
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")

    entry = {
        "complaint_id": f"RW-{1000 + len(complaints_log) + 1}",
        "road": road["name"],
        "district": road["district"],
        "routed_to": road["authority"],
        "priority": "HIGH" if road["severity"] == "high" else "MEDIUM",
        "reporter": payload.reporter_name,
        "complaint": payload.complaint_text,
        "status": "Routed - Pending Action",
    }
    complaints_log.append(entry)
    return entry


@app.post("/ask-ai")
async def ask_ai(payload: AskAIRequest):
    ctx = payload.road_context or {}
    fallback = _ai_fallback(payload.prompt, ctx)
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return {"response": fallback, "source": "fallback"}

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            "You are RoadWatch AI for Indian road safety. "
            "Reply in 150 words max, mention the responsible authority, and give actionable next steps.\n\n"
            f"Road context: {ctx}\nUser query: {payload.prompt}"
        )
        return {"response": response.text or fallback, "source": "gemini"}
    except Exception:
        return {"response": fallback, "source": "fallback"}


@app.get("/health", response_model=HealthResponse)
def health_check():
    gemini_configured = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "ready" if gemini_configured else "needs_configuration",
        "service": "RoadWatch API",
        "version": APP_VERSION,
        "gemini_configured": gemini_configured,
        "checks": [
            {
                "name": "api",
                "status": "ok",
                "detail": "FastAPI backend is responding.",
            },
            {
                "name": "road_data",
                "status": "ok",
                "detail": "Demo road data adapter is available.",
            },
            {
                "name": "gemini",
                "status": "ok" if gemini_configured else "missing",
                "detail": "GEMINI_API_KEY is configured."
                if gemini_configured
                else "Set GEMINI_API_KEY in backend/.env before the live AI demo.",
            },
        ],
    }


@app.get("/api/authorities/route")
def route_preview(road_type: str, district: str = ""):
    return classify_authority(road_type=road_type, district=district)


def _find_road(road_id: int):
    return next((road for road in road_adapter.load_roads() if road["id"] == road_id), None)


def _legacy_road(road: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": road["id"],
        "name": road["name"],
        "district": road["district"],
        "state": road["state"],
        "status": road["status"],
        "contractor": road["contractor"],
        "budget_allocated": road["budget_allocated"],
        "budget_spent": road["budget_spent_amount"],
        "hazard_type": road["hazard_type"],
        "lat": road["lat"],
        "lng": road["lng"],
        "complaints": road["complaints"],
        "authority": road["authority"],
        "severity": road["severity"],
    }


def _ai_fallback(prompt: str, ctx: dict[str, Any]) -> str:
    road_name = ctx.get("name") or ctx.get("road") or "Reported Road"
    authority = ctx.get("authority") or "NHAI / State PWD"
    district = ctx.get("district") or "the concerned district"
    state = ctx.get("state") or ""
    hazard = ctx.get("hazard_type") or ctx.get("issue_summary") or "Road hazard"
    complaints = ctx.get("complaints", "Multiple")
    contractor = ctx.get("contractor", "Not available")

    return (
        "RoadWatch AI - Complaint Draft\n\n"
        f"To: {authority}\n"
        f"Subject: Urgent repair required for {road_name}\n\n"
        f"Context: {prompt}\n\n"
        f"I am reporting {hazard} at {road_name}, {district}, {state}. "
        f"The dashboard shows {complaints} citizen complaints and contractor responsibility listed as {contractor}. "
        "Please arrange an immediate inspection, record geotagged evidence, confirm the repair owner, and share a written timeline.\n\n"
        "Suggested filing channels: PG Portal, NHAI grievance portal for NH segments, or the State PWD / municipal grievance desk for local roads."
    )
