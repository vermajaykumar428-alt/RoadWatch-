# RoadWatch Project Document

## Executive Summary

RoadWatch is a live-demo MVP for road infrastructure transparency and complaint routing. It gives citizens a single dashboard to inspect road risk, contractor and budget context, maintenance timing, and likely authority ownership before drafting a complaint. The AI assistant uses Gemini to help convert road context into clear civic next steps.

## Problem

Road quality complaints are difficult to route because citizens often do not know whether a road is managed by NHAI, a state PWD, a district road office, or a rural roads agency. Public infrastructure data also tends to be fragmented across portals, making accountability hard to understand during an active road safety issue.

## Current MVP

- Searchable road records with district, road type, risk, status, contractor, budget, repair dates, and source portal links.
- Interactive map for road hotspot discovery.
- Complaint router for NH, SH, MDR, PMGSY, and local/unknown roads.
- Complaint draft and follow-up checklist for the selected road.
- Gemini-powered AI assistant for road safety and infrastructure transparency questions.
- Readiness endpoint that makes demo configuration visible.

## Evaluation Mapping

| Criterion | Current MVP response |
| --- | --- |
| Data accuracy | Demo records include explicit source portal links and avoid claiming live official sync. |
| Budget transparency | Each demo road shows sanctioned and spent budget values. |
| Complaint routing | Backend classifies authority and escalation path by road type. |
| UI and accessibility | Dashboard is responsive, keyboard-friendly, and shows loading/error states. |
| Information integration | The adapter shape is ready for future live government datasets. |
| Offline robustness | Roadmap item, not current functionality. |
| Global applicability | Adapter and routing boundaries can be extended for other jurisdictions. |

## System Design

```text
Frontend dashboard
  - Road search
  - Leaflet map
  - Road detail panel
  - Complaint router
  - Gemini assistant

FastAPI backend
  - Typed Pydantic models
  - RoadDataAdapter
  - Routing engine
  - Gemini API call
```

## AI Approach

Gemini 2.5 Flash is called from the backend so the browser does not need a Gemini key. The assistant prompt is constrained to civic road safety, complaint routing, inspection evidence, and budget accountability. It is instructed not to invent official IDs, phone numbers, or live government records.

## Roadmap

- Live ingestion from data.gov.in, PMGSY, and MoRTH datasets.
- SQLite cache and periodic data refresh.
- Browser offline mode with IndexedDB/service worker.
- Photo and GPS hazard reporting.
- Complaint tracking with official reference IDs.
- Multilingual UI and WhatsApp-based access.
- Automated test suite and coverage gate.

## Demo Readiness

Before judging:

1. Set `GEMINI_API_KEY` in `backend/.env`.
2. Start the backend with Uvicorn.
3. Start the frontend with Vite.
4. Confirm `/health` reports `status: "ready"` and `gemini_configured: true`.
5. Run the demo flow: search road, select marker, route complaint, ask AI.
