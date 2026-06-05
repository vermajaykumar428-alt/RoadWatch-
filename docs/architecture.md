# Architecture

RoadWatch is a small API-first hackathon MVP.

```text
React + Leaflet dashboard
        |
        | REST
        v
FastAPI backend
        |
        +-- RoadDataAdapter with enriched demo records
        +-- Routing engine for authority classification
        +-- Gemini chat endpoint
```

## Frontend

- React 18 + TypeScript + Vite.
- Leaflet map with road markers from `/api/roads/search`.
- Judge-facing dashboard with readiness, metrics, selected-road detail, complaint routing, and Gemini chat.
- Uses `VITE_API_URL`, defaulting to `http://localhost:8000`.

## Backend

- FastAPI app in `backend/main.py`.
- Typed Pydantic contracts in `backend/models.py`.
- Road endpoints in `backend/routes/roads.py`.
- Demo data adapter in `backend/services/data_adapter.py`.
- Routing rules in `backend/services/routing_engine.py`.

## AI

The assistant calls Gemini 2.5 Flash through the backend. `GEMINI_API_KEY` is mandatory for `/api/chat`; missing configuration returns a `503` setup error and `/health` reports `gemini_configured: false`.

## Data

Current data is an enriched local demo dataset with source portal links. Live government ingestion, SQLite snapshots, and browser offline caching are roadmap items.
