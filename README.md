# 🚧 RoadWatch — AI-Powered Road Safety & Infrastructure Transparency Platform

<p align="center">
AI-assisted road safety, infrastructure transparency, and smart complaint routing for safer and more accountable roads.
</p>

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

Road infrastructure complaints frequently suffer from:

* Delayed reporting
* Fragmented government information
* Lack of repair transparency
* Confusing complaint escalation systems
* Poor public visibility into maintenance spending
* Difficulty identifying responsible authorities

Citizens often struggle to determine where complaints should be directed, while road-related datasets remain distributed across multiple departments and portals.

RoadWatch aims to simplify and modernize this process.

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

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Leaflet.js
* TypeScript
* Motion UI Components

## Backend

* FastAPI
* Python
* REST APIs

## AI Layer

* Google Gemini API

## Data Layer & Integrations

* Firebase (optional reporting module)
* SQLite + Local Cache
* Government datasets
* GIS data pipelines

---

# 📂 Project Structure

```text
RoadWatch/
│
├── frontend/
│   ├── src/
│   ├── assets/
│   └── components/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── docker-compose.yml
├── README.md
└── docs/
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js (v16+)
* Python 3.11+
* Google Gemini API Key
* Firebase credentials (optional)

---

## 1. Clone Repository

```bash
git clone https://github.com/your-username/RoadWatch.git
cd RoadWatch
```

---

## 2. Frontend Setup

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
# Core AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here

# Backend URL
VITE_API_URL=http://localhost:8000

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
```

Run:

```bash
npm run dev
```

---

## 3. Backend Setup

Open another terminal:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

Frontend:

```text
http://localhost:5173
```

---

# 🌐 Deployment

RoadWatch supports cloud deployment for public access and demos.

Recommended stack:

## Frontend

* Vercel

## Backend

* Render

Deployment-ready files:

* `vercel.json`
* `render.yaml`

Live deployment links can be added here:

```text
Frontend:
https://your-project.vercel.app

Backend:
https://your-api.onrender.com
```

---

# 📸 Screenshots

Add screenshots here.

Suggested:

* Dashboard
* Interactive Map
* AI Chatbot
* Complaint Routing Workflow

Example:

```markdown
![Dashboard](docs/dashboard.png)
```

---

# 🎯 Future Scope

RoadWatch is designed as a scalable civic-tech platform.

Planned enhancements include:

* Real-time pothole detection
* Computer vision validation
* Risk heatmaps
* GPS + image reporting
* Predictive maintenance analytics
* Authority-side dashboards
* Large-scale civic reporting integration

---

# ⚠️ Project Status

RoadWatch is currently a **Hackathon MVP / Prototype** demonstrating AI-assisted road transparency and complaint-routing workflows.

Some advanced features are under active development.

---

# 👥 Team & Contributions

RoadWatch was developed through collaborative contributions across frontend, backend, AI, and system design.

| Member      | Role                 | Key Contributions                                                                                                                            |
| ----------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Preeti**  | Full Stack Lead      | FastAPI backend development, React frontend, data integration, system architecture, UI components, map integration, and responsive design    |
| **Jay**     | AI/ML Role           | Gemini chatbot integration, intent classification, prompt engineering, and conversational AI workflows                                       |
| **Sandhya** | Backend & AI/ML Role | Database schema design, API endpoints, offline caching logic, complaint routing engine, data pipeline development, and PMGSY data processing |

## 🤝 Collaboration Approach

RoadWatch follows a collaborative development model where frontend engineering, backend systems, AI integration, and civic-data workflows are developed together to create a scalable and citizen-centric road transparency platform.

---

# 🤝 Contributing

Contributions, ideas, and civic-tech collaborations are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

# 📄 License

MIT License

---

<p align="center">
Built with a civic-tech vision to create safer, smarter, and more transparent roads.
</p>
