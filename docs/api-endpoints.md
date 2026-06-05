# RoadWatch API Endpoints

Base URL for local development: `http://localhost:8000`

## `GET /health`

Returns backend readiness and whether Gemini is configured.

Example response:

```json
{
  "status": "ready",
  "service": "RoadWatch API",
  "version": "0.2.0",
  "gemini_configured": true,
  "checks": [
    { "name": "api", "status": "ok", "detail": "FastAPI backend is responding." },
    { "name": "road_data", "status": "ok", "detail": "Demo road data adapter is available." },
    { "name": "gemini", "status": "ok", "detail": "GEMINI_API_KEY is configured." }
  ]
}
```

## `GET /api/roads/search`

Searches demo road records by road name, district, type, or status.

Query parameter:

- `query` optional string.

Example:

```bash
curl "http://localhost:8000/api/roads/search?query=NH"
```

Response includes `query`, `total`, and `results`. Each road contains type, district, status, risk, coordinates, contractor, budget, repair dates, source URL, and issue summary.

## `POST /api/complaints/route`

Routes a road issue to the appropriate authority and generates a complaint draft.

Example request:

```json
{
  "road_type": "NH",
  "district": "Chennai",
  "road_name": "NH-44",
  "issue": "Recurring pothole cluster near high-traffic interchange."
}
```

Example response:

```json
{
  "road_type": "NH",
  "district": "Chennai",
  "authority": "NHAI / MoRTH regional office",
  "priority": "High",
  "escalation_channel": "NHAI grievance portal and regional project director",
  "draft": "Request urgent inspection for NH-44 in Chennai...",
  "next_steps": [
    "Attach a geotagged photo and nearest landmark before submission.",
    "Send the complaint through NHAI grievance portal and regional project director.",
    "Ask for a complaint ID and follow up if no inspection is scheduled within 7 working days."
  ]
}
```

## `POST /api/chat`

Calls Gemini for the RoadWatch AI assistant. `GEMINI_API_KEY` is required.

Example request:

```json
{
  "message": "Draft a complaint for this road and explain who should receive it.",
  "road_name": "NH-44",
  "district": "Chennai"
}
```

If the key is missing, the endpoint returns `503` with a clear setup message.

## `GET /api/authorities/route`

Lightweight preview of authority classification.

Example:

```bash
curl "http://localhost:8000/api/authorities/route?road_type=PMGSY&district=Villupuram"
```
