# RoadWatch — Detailed Project Document

**AI-Powered Road Infrastructure Monitoring & Accountability Platform**

**IIT Madras Road Safety Hackathon 2025**  
Problem Statement 1.2

---

## Team

| Name | Role |
|------|------|
| **Preeti** | Full Stack Developer – Frontend & Backend |
| **Jay** | AI/ML Role – Chatbot & NLP |
| **Sandhya** | AI/ML Role – Data Pipeline & Routing |

---

## 1. Executive Summary

RoadWatch is an AI-powered, citizen-facing platform that consolidates fragmented government data on road construction, maintenance contracts, budgets, and repair histories into a single transparent, searchable, and location-aware interface. By combining a conversational AI chatbot with real-time geospatial data and publicly available government datasets (data.gov.in, PMGSY portal), RoadWatch empowers citizens to monitor road quality, report issues to the correct authority, and hold contractors and government agencies accountable for public infrastructure spending.

The platform operates with offline-first capability, ensuring usability even in low-connectivity rural environments where road quality issues are often most severe.

---

## 2. Problem Statement

### 2.1 Background

India's road infrastructure spans over **6.3 million kilometres**, making it the second-largest road network in the world. Yet public accountability for road quality remains critically low. Citizens face significant challenges in:

* Identifying which contractor built or last maintained a specific road
* Knowing how much public money was sanctioned and actually spent on a road project
* Finding out when a road was last repaired and whether it is overdue for maintenance
* Routing complaints to the correct Executive Engineer or government authority (NH, SH, MDR, etc.)
* Tracking repeated failures by specific contractors across regions

This information exists in government portals such as **data.gov.in** and the **PMGSY (Pradhan Mantri Gram Sadak Yojana) portal**, but is fragmented, technically inaccessible to average citizens, and not presented in a location-aware or actionable format.

### 2.2 Core Problem

The lack of a unified, location-based, citizen-friendly interface for road infrastructure data creates a **transparency deficit** that makes it nearly impossible to:
- Identify accountability
- Track delayed repairs
- Escalate complaints effectively

---

## 3. Proposed Solution

### 3.1 Solution Overview

RoadWatch addresses this problem through three integrated components:

#### 🗺️ **Location-Based Road Dashboard**
An interactive map that displays road metadata (road type: NH/SH/MDR, contractor, last relaying date, sanctioned vs. spent budget) pulled from data.gov.in and PMGSY.

#### 🤖 **AI Chatbot Interface**
A natural language chatbot (powered by Gemini API) that answers citizen queries about any road: contractor name, last repair date, budget allocated, and responsible authority.

#### 📨 **Complaint Routing Engine**
Automatically routes citizen complaints to the correct Executive Engineer or authority based on road type and jurisdiction, eliminating bureaucratic confusion.

### 3.2 Key Features

| Feature | Description | Evaluation Criterion |
|---------|-------------|----------------------|
| **Road Info Lookup** | Search any road by name or GPS location to get contractor, type, and repair history | Data Accuracy |
| **AI Chatbot** | Natural language Q&A on road quality, budgets, and complaints | UI & Accessibility |
| **Budget Transparency** | Shows sanctioned amount, amount spent, and source URL from PMGSY/data.gov.in | Budget Transparency |
| **Complaint Router** | Identifies correct Executive Engineer for NH/SH/MDR roads and generates complaint draft | Complaint Routing |
| **Offline Mode** | Caches local road data using IndexedDB; works without internet connection | Offline Robustness |
| **Global Applicability** | Architecture supports plugging in road datasets from other countries | Information Integration |

---

## 4. System Architecture

### 4.1 High-Level Architecture

RoadWatch follows a layered, API-first architecture with a decoupled frontend and backend:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js + Leaflet.js | Interactive map, chatbot UI, complaint form |
| **Backend API** | FastAPI (Python) | REST endpoints for road data, routing logic, complaint submission |
| **AI Layer** | Google Gemini API | Natural language understanding, chatbot responses |
| **Data Layer** | data.gov.in API + PMGSY Portal | Road metadata, budget figures, contractor records |
| **Offline Cache** | SQLite + IndexedDB | Local data snapshot for low-connectivity environments |
| **Deployment** | Docker + Cloud Run | Scalable, containerised deployment |

### 4.2 Architecture Diagram

```
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

### 4.3 Data Flow

1. User queries road info via chatbot or map search
2. Backend checks local SQLite cache first (offline-first pattern)
3. If cache miss, fetches from data.gov.in / PMGSY API in real time
4. AI layer processes natural language query and formats structured response
5. Frontend renders result on map with budget breakdown and complaint routing option
6. Complaint is routed to correct authority email/portal based on road classification

---

## 5. Data Sources & Accuracy

### 5.1 Primary Data Sources

| Source | Data Provided | URL |
|--------|---------------|-----|
| **data.gov.in** | Road project metadata, contractor records, state-wise road data | https://data.gov.in |
| **PMGSY Portal** | Rural road construction data, sanctioned/released budget, completion status | https://pmgsy.nic.in |
| **OpenStreetMap** | Base map layer, road geometry for geo-referencing | https://openstreetmap.org |
| **MoRTH Reports** | National highway data, accident statistics, road classification | https://morth.nic.in |

All budget figures displayed to users include a direct citation link to their source document, ensuring full transparency and verifiability.

### 5.2 Data Accuracy Strategy

* ✅ Primary data pulled directly from official government APIs (no third-party aggregators)
* ✅ Local SQLite snapshot updated every 24 hours to ensure freshness
* ✅ Data discrepancies flagged to users with "Last verified" timestamp
* ✅ Fallback to cached data with clear offline indicator when APIs are unavailable

---

## 6. AI & Machine Learning Approach

### 6.1 Chatbot Architecture

The RoadWatch chatbot is powered by the **Google Gemini API** with a structured system prompt that grounds all responses in the platform's road data. The chatbot does not rely on general knowledge for road-specific queries – it always queries the backend API first and uses Gemini only for natural language generation.

| Intent | Example Query | System Response |
|--------|---------------|-----------------|
| **Road Info** | "Who built the road near Tambaram?" | Fetches contractor name, road type, last repair from DB |
| **Budget Query** | "How much was spent on NH45 repairs?" | Returns sanctioned vs. spent with PMGSY source link |
| **Complaint Filing** | "I want to report a pothole on SH49" | Identifies Executive Engineer, generates complaint draft |
| **Repair History** | "When was this road last fixed?" | Returns maintenance log from PMGSY records |
| **Contractor Lookup** | "Has contractor XYZ had repeated failures?" | Aggregates contractor record across multiple roads |

### 6.2 Complaint Routing Logic

The routing engine classifies complaints based on road type and maps them to the correct authority:

```
National Highways (NH)
    ↓ 
National Highways Authority of India (NHAI) / 
Ministry of Road Transport & Highways

State Highways (SH)
    ↓
State PWD Executive Engineer (jurisdiction-based lookup)

Major District Roads (MDR)
    ↓
District Collector / District PWD office

Rural Roads (PMGSY)
    ↓
State Rural Roads Development Agency (SRRDA)
```

The routing engine uses GPS coordinates + road classification to perform this mapping automatically, eliminating the need for citizens to know which department to contact.

---

## 7. User Interface & Accessibility

### 7.1 Design Principles

* **Mobile-first design** – optimised for low-end Android devices common in rural India
* **Multilingual support** – Hindi and English interface (extensible to regional languages)
* **Low-bandwidth mode** – text-first interface with map tiles loaded on demand
* **Screen reader compatible** – ARIA labels and semantic HTML throughout
* **Offline indicator** – clear visual cue when operating in cached/offline mode
* **WCAG 2.1 Level AA compliance** – target accessibility standard

### 7.2 Key Screens

* **Home Map View** – interactive map showing road markers color-coded by maintenance status
* **Road Detail Panel** – contractor, budget, last repair date, source links, complaint button
* **Chatbot Interface** – conversational Q&A with suggested prompts for first-time users
* **Complaint Dashboard** – track filed complaints and routing status

---

## 8. Global Applicability

RoadWatch is architected as a **data-source-agnostic platform**. The backend uses an abstraction layer ("Road Data Adapter") that can be configured to pull from any country's road infrastructure API.

### Adding a New Country Requires Only:

1. Implementing a new **Data Adapter** for the country's road API
2. Mapping local road classifications to the universal NH/SH/MDR equivalent
3. Updating the complaint routing table with local authority contacts

This makes RoadWatch deployable in any country with publicly available road infrastructure data.

---

## 9. Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | React.js 18+ |
| **Map Rendering** | Leaflet.js + OpenStreetMap tiles |
| **Backend Framework** | FastAPI (Python 3.11+) |
| **AI / NLP** | Google Gemini API (gemini-1.5-flash) |
| **Database** | SQLite (local cache) + PostgreSQL (production) |
| **Offline Storage** | IndexedDB (browser) + Service Workers |
| **Containerisation** | Docker |
| **Version Control** | Git / GitHub |
| **Data Sources** | data.gov.in REST API, PMGSY Portal, OpenStreetMap |

---

## 10. Evaluation Criteria Mapping

| Hackathon Criterion | How RoadWatch Addresses It |
|-------------------|---------------------------|
| **Data Accuracy** | All data sourced directly from official govt. APIs with citation links and "last verified" timestamps |
| **Budget Transparency** | Displays sanctioned vs. actual spending with direct PMGSY/data.gov.in source URLs |
| **Complaint Routing** | Automatic routing to correct authority based on road type and jurisdiction; eliminates confusion |
| **Offline Robustness** | IndexedDB caching + SQLite snapshots ensure functionality even without internet |
| **Information Integration** | Consolidates fragmented data into single platform; integrates multiple govt. data sources |
| **UI & Accessibility** | Mobile-first, multi-language, WCAG 2.1 AA compliant, screen reader support |
| **Global Applicability** | Data-source-agnostic architecture with adapter pattern for any country's road API |

---

## 11. Future Roadmap

### 🔴 High-Priority Features (Phase 1-2)

* **Crowdsourced Pothole Reporting** with photo upload and GPS tagging
* **GPS + Image Reporting** with map markers and metadata extraction
* **WhatsApp Bot Integration** for accessibility without app installation
* **Real-time Pothole Detection** (Computer Vision model)
* **Multi-language Support** for regional languages

### 🟠 Medium-Priority Features (Phase 2-3)

* **Predictive Maintenance Analytics** using ML for road deterioration
* **Mobile App (React Native)** for iOS/Android
* **Authority-side Dashboards** for government officials
* **Contractor Performance Scoring** with public leaderboard
* **Risk Heatmaps & Clustering** for visualization

### 🟡 Additional Features (Phase 3-4)

* **RTI (Right to Information) Integration** for automated data requests
* **Real-time IoT Sensor Data** from vehicles
* **Computer Vision Validation** of citizen submissions
* **Large-scale Civic Integration** to other infrastructure issues

### 🟢 Future Enhancements (Phase 4+)

* **Blockchain Complaint Tracking** for immutable history
* **Satellite Imagery Analysis** for autonomous detection
* **Budget Allocation AI** for smart recommendations
* **Social Impact Dashboard** showing lives saved, accidents prevented

---

## 12. Deployment & Scalability

### Development Environment

```bash
git clone https://github.com/vermajaykumar428-alt/RoadWatch-.git
cd RoadWatch
docker-compose up
```

### Production Deployment

* **Frontend:** Vercel or Netlify (auto-scaling CDN)
* **Backend:** Render, Railway, or Google Cloud Run (auto-scaling containers)
* **Database:** PostgreSQL on managed cloud platform
* **Cache:** Redis for session management
* **Storage:** Cloud Storage for user uploads (future feature)

---

## 13. Conclusion

RoadWatch directly addresses the transparency deficit in Indian road infrastructure by making publicly available government data accessible, searchable, and actionable for every citizen. By combining:

* **AI-driven natural language interaction**
* **Location-aware data visualization**
* **Automated complaint routing**

The platform lowers the barrier for civic participation and strengthens accountability across the road construction and maintenance ecosystem.

The platform is:
* ✅ Technically robust
* ✅ Offline-capable
* ✅ Globally extensible
* ✅ Designed for diverse Indian connectivity and literacy conditions

**RoadWatch is not just a hackathon project – it is a deployable civic tool.**

---

## Contact & Support

* **GitHub:** [vermajaykumar428-alt/RoadWatch-](https://github.com/vermajaykumar428-alt/RoadWatch-)
* **Hackathon:** IIT Madras Road Safety Hackathon 2025 — Problem Statement 1.2
* **Team:** Preeti (Full Stack), Jay (AI/ML), Sandhya (AI/ML & Data)

---

<p align="center">
  <strong>Built with a civic-tech vision to create safer, smarter, and more transparent roads.</strong>
  <br>
  <em>RoadWatch — Where Citizens & Infrastructure Meet</em>
</p>
