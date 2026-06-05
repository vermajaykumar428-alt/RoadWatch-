import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import HealthResponse
from routes.roads import router as roads_router
from services.routing_engine import classify_authority

load_dotenv()

APP_VERSION = "0.2.0"

app = FastAPI(title="RoadWatch API", version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roads_router)


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
