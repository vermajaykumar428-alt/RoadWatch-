# RoadWatch

RoadWatch is a hackathon MVP for road safety transparency and complaint routing. It gives judges a live dashboard where citizens can search demo road records, inspect contractor and budget context, route complaints to the right authority, and ask a Gemini-powered assistant for civic guidance.

**Hackathon:** IIT Madras Road Safety Hackathon 2025  
**Problem statement:** Road Infrastructure Transparency and Accountability  
**Status:** Live-demo MVP

## What Works Now

- Interactive React + Leaflet dashboard with road markers and selected-road details.
- FastAPI backend with typed API responses.
- Enriched demo road records with road type, district, status, risk, contractor, budget, repair dates, and source portal links.
- Complaint routing for NH, SH, MDR, PMGSY, and unknown local roads.
- Gemini-required AI assistant through the backend.
- `/health` readiness endpoint that reports whether Gemini is configured.

## Demo Flow

1. Open the dashboard.
2. Search for a road, district, type, or status such as `NH`, `Chennai`, or `High`.
3. Select a road marker or result row.
4. Review contractor, budget, last repair, next review, and issue summary.
5. Click **Route selected road** to generate authority, escalation path, complaint draft, and next steps.
6. Ask RoadWatch AI a question about the selected road or complaint process.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Leaflet, Lucide icons.
- Backend: FastAPI, Pydantic, Uvicorn, Requests.
- AI: Google Gemini 2.5 Flash REST API, configured with backend-only `GEMINI_API_KEY`.
- Data: Local demo adapter with official source portal references. Live government data ingestion is roadmap.

## Quick Start

### 1. Backend

```bash
# 1. Clone repository
git clone https://github.com/vermajaykumar428-alt/RoadWatch-.git
cd RoadWatch-

# 2. Setup environment variables (docker-compose reads .env)
cp .env.example .env

# 3. Run with Docker (recommended)
docker-compose up
```

Or see **Manual Setup** below for step-by-step instructions.

---

# 🚀 Getting Started

## Prerequisites

Install the following:

| Tool | Version | Link |
|------|---------|------|
| **Node.js** | 16+ (18 LTS recommended) | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.11+ | [python.org](https://www.python.org/downloads/) |
| **Docker** (optional) | Latest | [docker.com](https://www.docker.com/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

**API Keys Required:**

* [Google Gemini API Key](https://makersuite.google.com/app/apikey)
* Firebase credentials (optional)

---

## 1. Clone Repository

```bash
git clone https://github.com/vermajaykumar428-alt/RoadWatch-.git
cd RoadWatch-
```

---

## 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

### Frontend Setup (`.env.local`)

```env
# Core AI Configuration
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Backend API URL
VITE_API_URL=http://localhost:8000

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
```

---

## 3. Frontend Setup
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
uvicorn main:app --reload
```

Set `GEMINI_API_KEY` in `backend/.env` before using the AI assistant.

Backend URLs:

- API health: http://localhost:8000/health
- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

On Windows PowerShell with script execution restrictions, use `npm.cmd`:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API will be available at: **http://localhost:8000**
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 5. Database Initialization (optional)

> **Note:** The MVP runs without any database setup — the backend serves bundled
> sample road data, so you can skip this section. The `scripts/` helpers below are
> planned and not yet included in the repository.

Initialize SQLite database with government data:

```bash
cd backend
python scripts/init_db.py
python scripts/load_pmgsy_data.py
```

---

# 📡 API Documentation

RoadWatch backend provides a REST API with interactive documentation.

### Accessing API Docs

- **Swagger UI (Interactive):** `http://localhost:8000/docs`
- **ReDoc (ReadOnly):** `http://localhost:8000/redoc`
npm.cmd run dev
```

## Docker

```bash
docker-compose up --build
```

This starts:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

Pass `GEMINI_API_KEY` through your shell or a local `.env` file before starting Docker Compose.

## API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Backend readiness and Gemini configuration |
| GET | `/api/roads/search?query=...` | Search enriched demo road records |
| POST | `/api/complaints/route` | Route a complaint and generate next steps |
| POST | `/api/chat` | Ask the Gemini-powered assistant |
| GET | `/api/authorities/route` | Lightweight authority preview |

See [docs/api-endpoints.md](docs/api-endpoints.md) for request and response examples.

## Verification

```bash
cd frontend
npm.cmd exec tsc -- --noEmit
npm.cmd run build
```

```bash
cd backend
python -B -c "from main import app; print(app.title, app.version)"
```

## Hackathon Demo Instructions

Start the backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the demo at http://localhost:5173 with the API running at http://localhost:8000.

Demo data note: RoadWatch is a scalable platform. This demo uses sample hazard data from Delhi NCR, Chennai, and Bengaluru to demonstrate complaint routing, risk mapping, and infrastructure transparency. Do not present the sample records as real government data.

Complaint test: select one of the sample hazards, click **Route selected road**, and confirm the success message shows the routed authority, tracking ID `RW-2026-001`, and estimated priority.

AI assistant test: leave `GEMINI_API_KEY` unset to verify **AI Assistant Demo Mode**, then ask the assistant a road-safety complaint question and confirm fallback guidance appears.

Judging story: RoadWatch uses AI-assisted hazard reporting, intelligent authority routing, risk mapping, and infrastructure transparency to reduce reporting delays and improve road-safety outcomes.

## Roadmap

These are intentionally not presented as current functionality:

- Live data.gov.in and PMGSY ingestion.
- SQLite cache and offline IndexedDB sync.
- Photo upload and GPS hazard reporting.
- Complaint tracking with official IDs.
- Automated tests and coverage gates.
- Firebase reporting, service workers, multilingual UI, and WhatsApp bot.

## Project Docs

- [Project document](docs/PROJECT_DOCUMENT.md)
- [Architecture](docs/architecture.md)
- [API endpoints](docs/api-endpoints.md)
- [Deployment](docs/deployment.md)

## Secret Handling

Keep API keys in local `.env` files only. Do not commit keys. If a key has been shared in chat, rotate it after the demo.
