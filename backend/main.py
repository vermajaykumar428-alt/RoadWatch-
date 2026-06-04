import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.roads import router as roads_router
from services.routing_engine import classify_authority

load_dotenv()

app = FastAPI(title="RoadWatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roads_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "RoadWatch API"}


@app.get("/api/authorities/route")
def route_preview(road_type: str, district: str = ""):
    return classify_authority(road_type=road_type, district=district)
