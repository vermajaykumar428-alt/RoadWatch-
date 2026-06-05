# RoadWatch Project Document

## 1. Executive Summary

RoadWatch is an AI-assisted road safety and infrastructure transparency platform built for the IIT Madras Road Safety Hackathon 2026. The current implementation is a live-demo MVP that helps citizens discover road hazards, inspect risk and repair context, route complaints to the right authority, and ask an AI assistant for civic guidance.

RoadWatch is a scalable platform. This demo uses sample hazard data from Delhi NCR, Chennai, and Bengaluru to demonstrate complaint routing, risk mapping, and infrastructure transparency.

The platform supports multiple cities. The current demo contains sample records from Delhi NCR and Chennai, with an additional Bengaluru sample hazard to show national scalability.

## 2. Problem Understanding

Road safety issues are often delayed because citizens do not know which agency is responsible for a specific road. A pothole, broken divider, waterlogging point, or missing road sign may fall under NHAI, PWD, Municipal Corporation, or another local authority depending on road type and jurisdiction.

The accountability problem has three parts:

- Citizens do not know where to report the hazard.
- Infrastructure data such as contractor, budget, and repair status is fragmented.
- Authorities lack a simple visual way to identify recurring risk hotspots.

RoadWatch addresses this by combining hazard reporting, risk mapping, intelligent complaint routing, and infrastructure transparency in one dashboard.

## 3. Current Code Implementation

The current codebase implements:

- React + TypeScript frontend built with Vite.
- Leaflet map with OpenStreetMap tiles.
- Colored hazard markers and a visible map legend.
- Multi-city sample hazard records from Delhi NCR, Chennai, and Bengaluru.
- Dashboard metrics for reported hazards, resolution rate, average response time, and high-risk zones.
- Risk score and risk factors for each hazard.
- Road detail panel with contractor, budget, repair dates, source link, and issue summary.
- Complaint routing UI with tracking ID, authority selection, priority, and routing explanation.
- FastAPI backend with road search, complaint routing, health, and Gemini chat endpoints.
- Gemini assistant integration through the backend.
- AI Assistant Demo Mode when Gemini or the backend is unavailable.
- Simulated image hazard detection panel for demo storytelling.
- README Hackathon Demo Instructions.

The demo does not claim that sample records are real government data. Source links are included as references for the type of public portals RoadWatch can integrate with in future versions.

## 4. Demo Dataset

The demo dataset includes sample hazards across multiple cities:

| City/Region | Sample hazards |
| --- | --- |
| Delhi NCR | Pothole near DTU Gate, broken streetlight near Rohini Sector 16, waterlogging near AIIMS flyover, damaged divider near NH-48, accident-prone turn near Kashmere Gate |
| Chennai | Pothole near OMR, waterlogging near Velachery, damaged road sign near Guindy, accident-prone junction near T Nagar |
| Bengaluru | Congestion hazard near Silk Board Junction |

This mix gives the project local relevance for IIT Madras while demonstrating that the same platform can scale beyond a single city.

## 5. Road Safety Impact

RoadWatch frames the problem around practical safety outcomes:

- One pothole can cause multiple crashes before repair.
- Citizens often do not know whether to contact PWD, NHAI, Municipal Corporation, or State Highway Authority.
- RoadWatch automatically routes complaints and visualizes risk hotspots.
- Authorities gain actionable infrastructure insights.

The frontend includes an Impact Simulation banner:

- 1,248 hazards reported.
- 896 resolved.
- Estimated 18,500 commuters benefited.

These are demo impact numbers for judging and storytelling, not live production metrics.

## 6. Risk Intelligence

Each hazard can show:

- Risk Score from 0 to 100.
- Risk factors such as heavy traffic, school zone nearby, multiple complaints, drainage failure, crash-prone divider damage, or last repair being more than 90 days old.

Example:

```text
Risk Score: 92/100
Risk factors:
- Heavy traffic
- School zone nearby
- Multiple complaints
- Last repair > 90 days
```

This turns the app from a simple reporting form into a risk-intelligence dashboard.

## 7. Complaint Routing Transparency

The complaint router selects an authority and explains why that authority was chosen.

Example routing output:

```text
Complaint submitted successfully
Authority Selected: PWD Chennai
Tracking ID: RW-2026-001
Estimated priority: High

Reason:
- Urban arterial road
- State PWD maintenance scope
- High public-safety impact
```

Backend routing currently maps road type to authority categories:

| Road type | Routed authority |
| --- | --- |
| NH | NHAI / MoRTH regional office |
| SH | State PWD Executive Engineer |
| MDR | District Roads Office |
| PMGSY | State Rural Roads Development Agency |
| Municipal/local | Local municipal or district road authority |

When the backend is unavailable, the frontend uses professional demo-mode routing so the judging flow remains stable.

## 8. AI Assistant

The backend exposes a Gemini-powered chat endpoint. The assistant is framed as a civic-tech guide for:

- Complaint drafting.
- Authority routing.
- Inspection evidence.
- Road safety and infrastructure transparency.

If `GEMINI_API_KEY` is missing or the chat API cannot respond, the frontend shows:

```text
AI Assistant Demo Mode
Gemini API key not configured. Showing fallback guidance.
```

This keeps the demo usable without pretending that Gemini is active.

## 9. System Architecture

```text
React + TypeScript frontend
  - Hero, impact framing, dashboard metrics
  - Leaflet risk map
  - Hazard detail panel
  - Complaint router UI
  - Gemini assistant UI
  - Demo-mode fallbacks

FastAPI backend
  - /health readiness endpoint
  - /api/roads/search
  - /api/complaints/route
  - /api/chat
  - RoadDataAdapter for demo data
  - Routing engine for road-type classification

External services
  - Gemini API for AI assistant when configured
  - OpenStreetMap tiles for map rendering
```

## 10. Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React 18, TypeScript, Vite |
| Map | Leaflet, React Leaflet, OpenStreetMap tiles |
| UI icons | Lucide React |
| Backend | FastAPI, Pydantic, Uvicorn |
| AI | Google Gemini API through backend |
| Deployment support | Docker Compose |
| Data | Local demo adapter with sample records and source portal links |

## 11. Current Limitations

The current MVP intentionally keeps several production features as future scope:

- It does not ingest live data.gov.in, PMGSY, or MoRTH datasets yet.
- It does not include a real official complaint tracking integration.
- It does not include IndexedDB, service worker, or offline-first browser caching yet.
- It does not train or run a real computer vision model for uploaded images yet.
- It does not verify budgets against live government APIs yet.

These limitations are clearly separated from the implemented demo to avoid overclaiming.

## 12. Future AI Features

Planned extensions include:

- Crowdsourced pothole reporting with photo upload and GPS tagging.
- Machine learning model to predict road deterioration based on historical maintenance patterns.
- Integration with RTI filing for automated government data requests.
- Contractor performance scoring dashboard with public leaderboard.
- WhatsApp bot integration for complaint filing without a smartphone app.
- Real-time road condition monitoring via IoT sensor data from vehicles.

## 13. Hackathon Demo Flow

1. Start the backend from `backend`:

```bash
uvicorn main:app --reload
```

2. Start the frontend from `frontend`:

```bash
npm run dev
```

3. Open `http://localhost:5173`.
4. Show the Impact Simulation and Road Safety Impact sections.
5. Open the map and highlight Delhi NCR, Chennai, and Bengaluru sample hazards.
6. Select a Chennai hazard such as OMR, Velachery, Guindy, or T Nagar.
7. Explain the risk score and risk factors.
8. Route the complaint and show authority selection, tracking ID, priority, and reason.
9. Ask the AI assistant a road-safety complaint question.
10. If Gemini is not configured, show AI Assistant Demo Mode and explain fallback guidance.

## 14. Conclusion

RoadWatch is not just a pothole-reporting form. It is a scalable civic platform that combines AI-assisted hazard reporting, intelligent authority routing, risk mapping, and infrastructure transparency to reduce reporting delays and improve road-safety outcomes.

The current demo is strongest when presented as a realistic MVP with sample multi-city data, clear routing logic, and a roadmap toward live government data integration, official complaint tracking, and predictive infrastructure intelligence.
