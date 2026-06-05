from pydantic import BaseModel, Field


class ReadinessCheck(BaseModel):
    name: str
    status: str
    detail: str


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    gemini_configured: bool
    checks: list[ReadinessCheck]


class RoadRecord(BaseModel):
    road: str
    type: str
    district: str
    status: str
    risk: str
    lat: float
    lng: float
    contractor: str
    budget_sanctioned: str
    budget_spent: str
    last_repair: str
    next_review: str
    source_url: str
    issue_summary: str


class RoadSearchResponse(BaseModel):
    query: str
    total: int
    results: list[RoadRecord]


class ComplaintRouteRequest(BaseModel):
    road_type: str = Field(default="SH", min_length=1)
    district: str = ""
    road_name: str | None = None
    issue: str = "Road hazard requiring inspection"


class ComplaintRouteResponse(BaseModel):
    road_type: str
    district: str
    authority: str
    priority: str
    escalation_channel: str
    draft: str
    next_steps: list[str]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    road_name: str | None = None
    district: str | None = None


class ChatResponse(BaseModel):
    reply: str
    source: str
