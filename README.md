# 🚧 RoadWatch — AI-Powered Road Safety & Infrastructure Transparency Platform

<p align="center">
AI-assisted road safety, infrastructure transparency, and smart complaint routing for safer and more accountable roads.
</p>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Hackathon MVP](https://img.shields.io/badge/Status-Hackathon%20MVP-blue.svg)](https://github.com)
[![IIT Madras 2025](https://img.shields.io/badge/IIT%20Madras-Road%20Safety%20Hackathon%202025-orange.svg)](https://github.com)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-green.svg)](https://www.python.org/downloads/)
[![Node.js 16+](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org/)

</div>

---

## 📖 Hackathon Submission

**Event:** IIT Madras Road Safety Hackathon 2025  
**Problem Statement:** 1.2 - Road Infrastructure Transparency & Accountability  
**Full Documentation:** [📄 PROJECT_DOCUMENT.md](docs/PROJECT_DOCUMENT.md)

---

## 🌍 Overview

RoadWatch is an AI-powered, citizen-facing platform designed to improve road safety, infrastructure transparency, and complaint routing through an interactive mapping and analytics experience.

The platform enables citizens to report hazards such as:

* Potholes
* Damaged road signs
* Waterlogging
* Poor street lighting
* Accident-prone locations

RoadWatch consolidates fragmented infrastructure information—including maintenance records, contractor details, repair histories, and public spending datasets—into a single accessible platform.

By integrating:

* Interactive GIS mapping
* AI-assisted workflows
* Government data streams such as **data.gov.in** and **PMGSY portals**

RoadWatch helps citizens monitor road quality, understand infrastructure transparency, and route complaints more effectively.

Built as a **Hackathon MVP and scalable prototype**, RoadWatch demonstrates how civic-tech systems can bridge the communication gap between citizens and road-maintenance authorities.

---

# ❗ Problem Statement

**India's Challenge:** Over 6.3 million kilometers of road infrastructure, yet citizens face critical barriers to accountability:

* Fragmented government information across multiple portals
* No unified, location-based access to road project data
* Difficulty identifying correct authorities for complaints
* Lack of transparent contractor performance tracking
* Low visibility into maintenance budgets and spending

Road infrastructure complaints frequently suffer from:

* Delayed reporting
* Fragmented government information
* Lack of repair transparency
* Confusing complaint escalation systems
* Poor public visibility into maintenance spending
* Difficulty identifying responsible authorities

**RoadWatch Solution:** A transparent, AI-powered platform that consolidates government road data into a single searchable interface with automated complaint routing.

For detailed problem analysis, see [📄 PROJECT_DOCUMENT.md](docs/PROJECT_DOCUMENT.md#problem-statement)

---

# ✨ Key Features

## 📍 Interactive Road Information Lookup

Explore roads through an interactive map interface powered by React and Leaflet.

Users can:

* Search roads using location or coordinates
* View road classifications
* Explore contractor and maintenance details
* Visualize road-condition information

---

## 🤖 AI Chat Assistant

RoadWatch integrates a conversational AI assistant powered by **Google Gemini** through **FastAPI**.

The assistant helps users:

* Understand road-related information
* Ask infrastructure questions
* Navigate complaint workflows
* Receive contextual responses in natural language

---

## 💰 Infrastructure & Budget Transparency

RoadWatch incorporates infrastructure datasets and transparency workflows using public data sources including:

* data.gov.in
* PMGSY-related datasets
* Maintenance information
* Contractor and repair records

The platform helps users explore:

* Repair history
* Infrastructure accountability
* Maintenance-related insights
* Public transparency workflows

---

## 📨 Smart Complaint Drafting & Routing

RoadWatch assists users in drafting complaints and identifying appropriate authorities using road type and jurisdiction.

Routing logic includes:

* **National Highways (NH)** → NHAI / MoRTH
* **State Highways (SH)** → State PWD
* **Major District Roads (MDR)** → District Authorities
* **Rural Roads (PMGSY)** → Rural Roads Agencies

This reduces escalation confusion and improves complaint direction.

---

## 🔌 Offline-Enabled Architecture

RoadWatch includes an offline-oriented MVP architecture designed for low-connectivity environments.

Current architecture supports:

* IndexedDB-based frontend caching
* SQLite-assisted local storage workflows
* Resilient data access patterns
* Rural and intermittent-network usability

This improves reliability and accessibility for users in low-connectivity regions.

---

## 🗺️ Road Visualization & Analytics

RoadWatch includes dashboard and map-based visualizations to help users understand road conditions and infrastructure information more intuitively.

Current capabilities include:

* GIS visualization
* Dashboard analytics
* Interactive map exploration

Planned enhancements include:

* Risk heatmaps
* Hazard clustering
* Predictive maintenance insights
* AI-assisted validation

---

# 🏗️ System Architecture

RoadWatch follows a layered and API-first architecture.

```text
┌─────────────────────────────────────────────┐
│ FRONTEND (React + Leaflet + Vite)           │
│ Interactive Map + Dashboard + Chat UI       │
└──────────────────┬──────────────────────────┘
                   │ REST API Requests
┌──────────────────▼──────────────────────────┐
│ BACKEND (FastAPI / Python)                  │
│ Routing Logic + AI Integration + APIs       │
└──────────┬──────────────┬───────────────────┘
           │              │
     ┌─────▼─────┐   ┌────▼────────┐
     │ AI Layer  │   │ Data Layer  │
     │ Gemini    │   │ APIs/Cache  │
     └───────────┘   └─────────────┘
```

For detailed architecture documentation, see [📄 PROJECT_DOCUMENT.md](docs/PROJECT_DOCUMENT.md#system-architecture)

---

# 🛠️ Tech Stack

## Frontend

* React.js 18+
* Vite
* Leaflet.js
* TypeScript
* Motion UI Components

## Backend

* FastAPI (Python 3.11+)
* REST APIs
* Uvicorn ASGI Server

## AI Layer

* Google Gemini API
* Intent Classification
* Prompt Engineering

## Data Layer & Integrations

* Firebase (optional reporting module)
* SQLite + Local Cache
* Government datasets (data.gov.in, PMGSY)
* GIS data pipelines
* IndexedDB (frontend caching)

---

# 📂 Project Structure

```text
RoadWatch/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   ├── assets/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── routes/
│   ├── models/
│   └── services/
│
├── docs/
│   ├── PROJECT_DOCUMENT.md  (Hackathon Submission)
│   ├── architecture.md
│   ├── api-endpoints.md
│   └── deployment.md
│
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

---

# ⚡ Quick Start

Get RoadWatch running in 3 steps:

```bash
# 1. Clone repository
git clone https://github.com/vermajaykumar428-alt/RoadWatch-.git
cd RoadWatch

# 2. Setup environment variables
cp .env.example .env.local

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
cd RoadWatch
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

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 4. Backend Setup

Open another terminal:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend API will be available at: **http://localhost:8000**
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 5. Database Initialization

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

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roads/search` | `GET` | Search roads by location/coordinates |
| `/api/complaints/route` | `POST` | Route complaint to appropriate authority |
| `/api/chat` | `POST` | Chat with AI assistant |
| `/api/analytics/dashboard` | `GET` | Get dashboard analytics |
| `/api/data/maintenance-records` | `GET` | Fetch maintenance records |

For detailed API documentation, see [api-endpoints.md](docs/api-endpoints.md).

---

# 🐳 Docker Deployment

Deploy both frontend and backend with Docker Compose:

```bash
docker-compose up --build
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **SQLite Database:** Auto-initialized

---

# 🌐 Cloud Deployment

RoadWatch supports cloud deployment for production.

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
vercel deploy --prod
```

**Environment Variables on Vercel:**
- `VITE_GEMINI_API_KEY`
- `VITE_API_URL` (your backend URL)

### Backend Deployment (Render)

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Use `render.yaml` for configuration:

```yaml
services:
  - type: web
    name: roadwatch-backend
    runtime: python
    buildCommand: "pip install -r backend/requirements.txt"
    startCommand: "uvicorn backend.main:app --host 0.0.0.0 --port 8000"
    envVars:
      - key: GEMINI_API_KEY
        sync: false
```

**Live Deployment Links:**

```
Frontend:  https://roadwatch.vercel.app
Backend:   https://roadwatch-api.onrender.com
```

---

# 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test           # Run unit tests
npm run test:coverage  # With coverage report
```

### Backend Tests

```bash
cd backend
pytest                 # Run all tests
pytest --cov         # With coverage report
pytest tests/test_routing.py  # Test specific module
```

---

# 🐛 Troubleshooting & FAQ

### ❌ Common Issues & Solutions

#### **"Gemini API key not found"**
- ✅ Verify `.env.local` exists in frontend directory
- ✅ Ensure `VITE_GEMINI_API_KEY` is set correctly
- ✅ Restart dev server: `npm run dev`

#### **"Cannot connect to backend" (CORS error)**
- ✅ Verify backend is running: `http://localhost:8000/docs`
- ✅ Check `VITE_API_URL` in `.env.local` matches backend URL
- ✅ Ensure backend CORS is enabled in `main.py`

#### **"Module not found: 'FastAPI'"**
- ✅ Install dependencies: `pip install -r requirements.txt`
- ✅ Verify Python 3.11+: `python --version`
- ✅ Use virtual environment: `python -m venv venv && source venv/bin/activate`

#### **"Database locked" error**
- ✅ Close any running processes accessing SQLite
- ✅ Delete database and reinitialize: `rm backend/db.sqlite && python scripts/init_db.py`

#### **Port already in use**
```bash
# Frontend (change to 5174)
npm run dev -- --port 5174

# Backend (change to 8001)
uvicorn main:app --reload --port 8001
```

---

### ❓ Frequently Asked Questions

**Q: Can I use RoadWatch offline?**
- A: Yes! Data is cached in IndexedDB. You can report hazards offline; they sync when connectivity returns.

**Q: Is RoadWatch mobile-friendly?**
- A: Yes! Built with responsive design. Works on tablets and mobile browsers. Mobile app coming soon.

**Q: Which datasets does RoadWatch support?**
- A: Currently integrates data.gov.in and PMGSY datasets. More government portals can be added.

**Q: Can I modify complaint routing logic?**
- A: Yes! Routing rules are configurable in `backend/services/routing_engine.py`.

**Q: How do I add new government data sources?**
- A: See [docs/data-integration.md](docs/data-integration.md) for data pipeline setup.

---

# 🖼️ Screenshots & Demo

### Dashboard View
```
[Interactive map with road hazard markers, analytics sidebar]
```

### Complaint Routing
```
[AI-assisted complaint form, authority suggestions]
```

### Chat Assistant
```
[Conversational AI interface for road queries]
```

**Live Demo:** https://roadwatch.vercel.app (add when deployed)

---

# 🎯 Future Scope

RoadWatch is designed as a scalable civic-tech platform with ambitious planned enhancements organized across multiple categories:

## 🔴 High-Priority Features (Phase 1-2)

| Feature | Category | Priority | ETA | Description |
|---------|----------|----------|-----|-------------|
| **Crowdsourced Pothole Reporting** | Reporting | 🔴 Critical | Q2 2026 | Citizens report potholes with photo upload and GPS tagging; AI validates submissions |
| **GPS + Image Reporting** | Reporting | 🔴 Critical | Q2 2026 | Location-tagged photo uploads with map markers and metadata extraction |
| **WhatsApp Bot Integration** | Accessibility | 🔴 Critical | Q3 2026 | File complaints via WhatsApp without app installation for accessibility |
| **Real-time Pothole Detection** | Computer Vision | 🟠 High | Q3 2026 | CV model to detect potholes from road images automatically |
| **Multi-language Support** | Accessibility | 🟠 High | Q2 2026 | Support for regional languages to reach broader audience |

## 🟠 Medium-Priority Features (Phase 2-3)

| Feature | Category | Priority | ETA | Description |
|---------|----------|----------|-----|-------------|
| **Predictive Maintenance Analytics** | ML/Analytics | 🟠 High | Q4 2026 | ML model predicts road deterioration based on historical patterns |
| **Mobile App (React Native)** | Platform | 🟠 High | Q4 2026 | Native iOS/Android app for better performance and offline support |
| **Authority-side Dashboards** | Government | 🟠 High | Q3 2026 | Portal for road authorities to manage complaints and track repairs |
| **Contractor Performance Scoring** | Accountability | 🟠 High | Q3 2026 | Gamified leaderboard tracking contractor performance metrics |
| **Risk Heatmaps & Clustering** | Visualization | 🟠 High | Q3 2026 | Visual hotspots for accident-prone and hazard-dense areas |

## 🟡 Medium-Priority Features (Phase 3-4)

| Feature | Category | Priority | ETA | Description |
|---------|----------|----------|-----|-------------|
| **RTI (Right to Information) Integration** | Governance | 🟡 Medium | Q4 2026 | Automated government data requests using RTI framework |
| **Real-time IoT Sensor Data** | Monitoring | 🟡 Medium | 2027 | Integrate IoT sensors from vehicles for real-time road condition monitoring |
| **Computer Vision Validation** | AI/Validation | 🟡 Medium | Q4 2026 | AI-powered validation of citizen-reported hazards |
| **Large-scale Civic Integration** | Integration | 🟡 Medium | 2027 | Expand to other civic issues (potholes → traffic, pollution, etc.) |

## 🟢 Future Enhancements (Phase 4+)

| Feature | Category | Priority | ETA | Description |
|---------|----------|----------|-----|-------------|
| **Blockchain Complaint Tracking** | Trust | 🟢 Future | 2027 | Immutable complaint history for transparency |
| **Satellite Imagery Analysis** | Monitoring | 🟢 Future | 2027 | Automated pothole detection from satellite/aerial imagery |
| **Budget Allocation AI** | Policy | 🟢 Future | 2027 | Smart recommendations for maintenance budget allocation |
| **Social Impact Dashboard** | Impact | 🟢 Future | 2027 | Metrics showing lives saved, accidents prevented, time saved |

---

### Key Strategic Features Explanation

#### 📸 **Crowdsourced Pothole Reporting**
Citizens can photograph and report potholes with automatic GPS tagging. The system uses computer vision to validate submissions and aggregate duplicate reports.

#### 🤖 **Predictive Maintenance Analytics**
ML models analyze historical maintenance records, weather patterns, and traffic data to predict which roads are likely to deteriorate soon.

#### 💬 **WhatsApp Bot Integration**
For users without smartphones/app access, a WhatsApp bot allows filing complaints via simple text messages—critical for rural accessibility.

#### 🏆 **Contractor Performance Scoring**
Transparent leaderboard tracking contractor performance metrics (response time, quality, cost efficiency) to incentivize accountability.

#### 🛰️ **Real-time IoT Monitoring**
Aggregate data from vehicles with onboard sensors to get real-time road condition telemetry without additional infrastructure.

#### 📋 **RTI Integration**
Automate Right to Information requests to government for specific datasets, creating a feedback loop of data transparency.

---

# ⚠️ Project Status

| Aspect | Status |
|--------|--------|
| **Development Stage** | 🏗️ Hackathon MVP / Active Development |
| **Stability** | ⚠️ Pre-release (breaking changes possible) |
| **Production Ready** | ❌ Not yet (planned for Q4 2026) |
| **Documentation** | 📖 In Progress |

Some advanced features are under active development. Use in production at your own risk.

---

# 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Web (Desktop)** | ✅ Supported | Responsive design |
| **Web (Mobile Browser)** | ✅ Supported | Full touch support |
| **iOS App** | 📋 Planned | Q4 2026 |
| **Android App** | 📋 Planned | Q4 2026 |
| **WhatsApp Bot** | 📋 Planned | Q3 2026 |

---

# ♿ Accessibility

RoadWatch is designed with accessibility in mind:

* ✅ WCAG 2.1 Level AA compliance (target)
* ✅ Keyboard navigation support
* ✅ Screen reader compatible
* ✅ High contrast mode support
* ✅ Mobile & touch-friendly interface
* 📋 Multi-language support (planned Q2 2026)
* 📋 WhatsApp alternative interface (planned Q3 2026)

---

# 👥 Team & Contributions

RoadWatch was developed through collaborative contributions across frontend, backend, AI, and system design for the **IIT Madras Road Safety Hackathon 2025**.

| Member      | Role                 | Key Contributions                                                                                                                            |
| ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Preeti**  | Full Stack Lead      | FastAPI backend development, React frontend, data integration, system architecture, UI components, map integration, and responsive design    |
| **Jay**     | AI/ML Role           | Gemini chatbot integration, intent classification, prompt engineering, and conversational AI workflows                                       |
| **Sandhya** | Backend & AI/ML Role | Database schema design, API endpoints, offline caching logic, complaint routing engine, data pipeline development, and PMGSY data processing |

## 🤝 Collaboration Approach

RoadWatch follows a collaborative development model where frontend engineering, backend systems, AI integration, and civic-data workflows are developed together to create a scalable and citizen-centric platform.

---

# 🤝 Contributing

Contributions, ideas, and civic-tech collaborations are welcome!

### Getting Started with Contributions

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Commit changes:** `git commit -m "Add: your feature description"`
4. **Push to branch:** `git push origin feature/your-feature-name`
5. **Open a Pull Request:** Include description and link related issues

### Contribution Guidelines

* Follow [PEP 8](https://pep8.org/) for Python code
* Use TypeScript for frontend code
* Add tests for new features
* Update documentation
* Include clear commit messages

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

# 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

MIT License allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

**Conditions:**
- 📋 Include license and copyright notice

---

# 📞 Support & Contact

* **Issues & Bug Reports:** [GitHub Issues](https://github.com/vermajaykumar428-alt/RoadWatch-/issues)
* **Discussions:** [GitHub Discussions](https://github.com/vermajaykumar428-alt/RoadWatch-/discussions)
* **Hackathon:** IIT Madras Road Safety Hackathon 2025
* **Email:** (add team email)
* **Twitter/X:** (add team social)

---

# 🙏 Acknowledgments

* Government data sources: data.gov.in, PMGSY, MoRTH
* Mapping: Leaflet.js, OpenStreetMap
* AI: Google Gemini API
* Built with: React, FastAPI, Python
* **Hackathon:** IIT Madras Road Safety Hackathon 2025

---

<p align="center">
  <strong>Built with a civic-tech vision to create safer, smarter, and more transparent roads.</strong>
  <br>
  <em>RoadWatch — Where Citizens & Infrastructure Meet</em>
</p>

<p align="center">
  ⭐ If you find RoadWatch useful, please consider giving it a star on <a href="https://github.com/vermajaykumar428-alt/RoadWatch-">GitHub</a>!
</p>
