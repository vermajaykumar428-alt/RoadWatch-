import { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { AlertTriangle, Bot, CheckCircle2, Loader2, MapPin, Route, Search, ShieldCheck } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type ReadinessCheck = {
  name: string;
  status: string;
  detail: string;
};

type HealthResponse = {
  status: string;
  service: string;
  version: string;
  gemini_configured: boolean;
  checks: ReadinessCheck[];
};

type RoadRecord = {
  road: string;
  type: string;
  district: string;
  status: string;
  risk: string;
  hazardStatus?: HazardStatus;
  riskScore?: number;
  riskFactors?: string[];
  lat: number;
  lng: number;
  contractor: string;
  budget_sanctioned: string;
  budget_spent: string;
  last_repair: string;
  next_review: string;
  source_url: string;
  issue_summary: string;
};

type RoadSearchResponse = {
  query: string;
  total: number;
  results: RoadRecord[];
};

type ComplaintRouteResponse = {
  road_type: string;
  district: string;
  authority: string;
  priority: string;
  escalation_channel: string;
  draft: string;
  next_steps: string[];
};

type ChatResponse = {
  reply: string;
  source: string;
};

type HazardStatus = 'critical' | 'under-review' | 'resolved' | 'new-report';

const DEFAULT_CENTER: [number, number] = [28.63, 77.21];
const DEMO_TRACKING_ID = 'RW-2026-001';
const DEMO_ASSISTANT_REPLY =
  'Demo guidance: capture a geotagged photo, note the nearest landmark, choose the road authority, and submit the complaint with a request for an inspection timeline.';
const DEMO_MODE_MESSAGE = 'Demo mode active. Showing curated sample data and fallback guidance for the judging walkthrough.';

const HAZARD_MARKERS: Record<HazardStatus, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'critical' },
  'under-review': { label: 'Under Review', className: 'under-review' },
  resolved: { label: 'Resolved', className: 'resolved' },
  'new-report': { label: 'New Report', className: 'new-report' },
};

const DEMO_HAZARDS: RoadRecord[] = [
  {
    road: 'Pothole near DTU Gate',
    type: 'Municipal',
    district: 'Delhi',
    status: 'Critical',
    risk: 'High',
    hazardStatus: 'critical',
    riskScore: 92,
    riskFactors: ['Heavy traffic', 'School zone nearby', 'Multiple complaints', 'Last repair > 90 days'],
    lat: 28.7501,
    lng: 77.1177,
    contractor: 'North Delhi Road Maintenance Cell',
    budget_sanctioned: 'Rs 1.2 crore',
    budget_spent: 'Rs 72 lakh',
    last_repair: '2026-02-18',
    next_review: '2026-06-12',
    source_url: 'https://mcdonline.nic.in/',
    issue_summary: 'Deep pothole reported near a busy student crossing outside DTU Gate.',
  },
  {
    road: 'Broken streetlight near Rohini Sector 16',
    type: 'Municipal',
    district: 'Delhi',
    status: 'New report',
    risk: 'Medium',
    hazardStatus: 'new-report',
    riskScore: 68,
    riskFactors: ['Poor night visibility', 'Pedestrian-heavy stretch', 'New citizen report'],
    lat: 28.7365,
    lng: 77.1328,
    contractor: 'Municipal Lighting Division',
    budget_sanctioned: 'Rs 42 lakh',
    budget_spent: 'Rs 25 lakh',
    last_repair: '2026-01-08',
    next_review: '2026-06-15',
    source_url: 'https://mcdonline.nic.in/',
    issue_summary: 'Streetlight outage creates poor visibility along a pedestrian-heavy stretch.',
  },
  {
    road: 'Waterlogging near AIIMS flyover',
    type: 'PWD',
    district: 'Delhi',
    status: 'Under review',
    risk: 'High',
    hazardStatus: 'under-review',
    riskScore: 88,
    riskFactors: ['Hospital access route', 'Drainage failure', 'Monsoon recurrence', 'Heavy traffic'],
    lat: 28.5672,
    lng: 77.2101,
    contractor: 'Delhi PWD Drainage Response Team',
    budget_sanctioned: 'Rs 2.8 crore',
    budget_spent: 'Rs 1.9 crore',
    last_repair: '2025-12-03',
    next_review: '2026-06-10',
    source_url: 'https://pwd.delhi.gov.in/',
    issue_summary: 'Recurring waterlogging slows emergency access around the flyover during rain.',
  },
  {
    road: 'Damaged divider near NH-48',
    type: 'NH',
    district: 'Gurugram',
    status: 'Critical',
    risk: 'High',
    hazardStatus: 'critical',
    riskScore: 94,
    riskFactors: ['National highway corridor', 'Lane obstruction', 'Crash-prone divider damage', 'High-speed traffic'],
    lat: 28.4595,
    lng: 77.0266,
    contractor: 'NHAI Delhi-Gurugram Corridor Unit',
    budget_sanctioned: 'Rs 6.4 crore',
    budget_spent: 'Rs 4.1 crore',
    last_repair: '2025-11-22',
    next_review: '2026-06-09',
    source_url: 'https://nhai.gov.in/',
    issue_summary: 'Divider damage is narrowing lanes and increasing crash risk near NH-48.',
  },
  {
    road: 'Accident-prone turn near Kashmere Gate',
    type: 'PWD',
    district: 'Delhi',
    status: 'Resolved',
    risk: 'Medium',
    hazardStatus: 'resolved',
    riskScore: 42,
    riskFactors: ['Resolved complaint', 'Fresh signage installed', 'Monitoring needed at peak hours'],
    lat: 28.6676,
    lng: 77.2282,
    contractor: 'Delhi PWD Safety Works Unit',
    budget_sanctioned: 'Rs 90 lakh',
    budget_spent: 'Rs 84 lakh',
    last_repair: '2026-05-21',
    next_review: '2026-07-05',
    source_url: 'https://pwd.delhi.gov.in/',
    issue_summary: 'Sharp turn now has fresh signage and reflective lane markings after repeated complaints.',
  },
  {
    road: 'Pothole near OMR, Chennai',
    type: 'PWD',
    district: 'Chennai',
    status: 'Critical',
    risk: 'High',
    hazardStatus: 'critical',
    riskScore: 91,
    riskFactors: ['IT corridor traffic', 'Two-wheeler crash risk', 'Multiple complaints', 'Last repair > 90 days'],
    lat: 12.9165,
    lng: 80.2305,
    contractor: 'Chennai PWD Urban Roads Unit',
    budget_sanctioned: 'Rs 3.1 crore',
    budget_spent: 'Rs 2.2 crore',
    last_repair: '2025-10-18',
    next_review: '2026-06-14',
    source_url: 'https://www.tn.gov.in/department/7',
    issue_summary: 'Deep pothole on OMR creates sudden braking risk for commuters and two-wheelers.',
  },
  {
    road: 'Waterlogging near Velachery, Chennai',
    type: 'Municipal',
    district: 'Chennai',
    status: 'Under review',
    risk: 'High',
    hazardStatus: 'under-review',
    riskScore: 86,
    riskFactors: ['Flood-prone zone', 'Bus route nearby', 'Drainage bottleneck', 'Recurring monsoon hazard'],
    lat: 12.9759,
    lng: 80.2212,
    contractor: 'Greater Chennai Corporation Stormwater Cell',
    budget_sanctioned: 'Rs 2.4 crore',
    budget_spent: 'Rs 1.6 crore',
    last_repair: '2025-12-12',
    next_review: '2026-06-18',
    source_url: 'https://chennaicorporation.gov.in/',
    issue_summary: 'Waterlogging near Velachery slows traffic and increases skidding risk during rainfall.',
  },
  {
    road: 'Damaged road sign near Guindy, Chennai',
    type: 'Municipal',
    district: 'Chennai',
    status: 'New report',
    risk: 'Medium',
    hazardStatus: 'new-report',
    riskScore: 63,
    riskFactors: ['Intersection confusion', 'Peak-hour congestion', 'New citizen report'],
    lat: 13.0067,
    lng: 80.2206,
    contractor: 'Greater Chennai Corporation Traffic Signage Team',
    budget_sanctioned: 'Rs 48 lakh',
    budget_spent: 'Rs 31 lakh',
    last_repair: '2026-01-27',
    next_review: '2026-06-19',
    source_url: 'https://chennaicorporation.gov.in/',
    issue_summary: 'Damaged direction sign near Guindy creates last-minute lane changes at a busy junction.',
  },
  {
    road: 'Accident-prone junction near T Nagar, Chennai',
    type: 'PWD',
    district: 'Chennai',
    status: 'Under review',
    risk: 'High',
    hazardStatus: 'under-review',
    riskScore: 89,
    riskFactors: ['Dense retail footfall', 'Signal timing complaints', 'Pedestrian crossing conflict', 'Multiple complaints'],
    lat: 13.0418,
    lng: 80.2341,
    contractor: 'Chennai PWD Safety Improvements Unit',
    budget_sanctioned: 'Rs 1.8 crore',
    budget_spent: 'Rs 1.1 crore',
    last_repair: '2025-11-05',
    next_review: '2026-06-22',
    source_url: 'https://www.tn.gov.in/department/7',
    issue_summary: 'Busy T Nagar junction needs safer turning geometry and clearer pedestrian priority.',
  },
  {
    road: 'Congestion hazard near Silk Board Junction, Bengaluru',
    type: 'Municipal',
    district: 'Bengaluru',
    status: 'Critical',
    risk: 'High',
    hazardStatus: 'critical',
    riskScore: 90,
    riskFactors: ['High congestion', 'Complex junction geometry', 'Frequent sudden braking', 'Multiple complaints'],
    lat: 12.9177,
    lng: 77.6238,
    contractor: 'BBMP Major Roads Division',
    budget_sanctioned: 'Rs 4.6 crore',
    budget_spent: 'Rs 3.2 crore',
    last_repair: '2025-09-30',
    next_review: '2026-06-21',
    source_url: 'https://bbmp.gov.in/',
    issue_summary: 'Congestion and broken road edges near Silk Board create recurring near-miss risk.',
  },
];

function getHazardStatus(road: RoadRecord): HazardStatus {
  if (road.hazardStatus) {
    return road.hazardStatus;
  }

  const status = road.status.toLowerCase();
  if (status.includes('resolved')) {
    return 'resolved';
  }
  if (status.includes('new')) {
    return 'new-report';
  }
  if (status.includes('review') || status.includes('inspection') || status.includes('pending')) {
    return 'under-review';
  }
  return road.risk.toLowerCase() === 'high' ? 'critical' : 'under-review';
}

function getHazardIcon(road: RoadRecord) {
  const marker = HAZARD_MARKERS[getHazardStatus(road)];
  return L.divIcon({
    className: 'hazard-marker-icon',
    html: `<span class="hazard-marker ${marker.className}" aria-label="${marker.label} hazard"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

function filterDemoHazards(searchQuery: string) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return DEMO_HAZARDS;
  }

  return DEMO_HAZARDS.filter((road) =>
    [road.road, road.district, road.type, road.status, road.risk].some((value) => value.toLowerCase().includes(query)),
  );
}

function mergeWithDemoHazards(records: RoadRecord[], searchQuery: string) {
  const seen = new Set<string>();
  return [...filterDemoHazards(searchQuery), ...records].filter((road) => {
    const key = road.road.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getDemoAuthority(authority: string) {
  const value = authority.toLowerCase();
  if (value.includes('nhai') || value.includes('morth')) {
    return 'NHAI';
  }
  if (value.includes('pwd')) {
    return 'PWD';
  }
  return 'Municipal Corporation';
}

function getAuthorityLabel(road: RoadRecord, authority: string) {
  const authorityName = getDemoAuthority(authority);
  if (authorityName === 'NHAI') {
    return 'NHAI Regional Office';
  }
  return `${authorityName} ${road.district}`;
}

function getRoutingReasons(road: RoadRecord) {
  const type = road.type.toUpperCase();
  if (type === 'NH') {
    return ['National Highway corridor', 'High-speed traffic exposure', 'NHAI maintenance jurisdiction'];
  }
  if (type === 'PWD') {
    return ['Urban arterial road', 'State PWD maintenance scope', 'High public-safety impact'];
  }
  return ['Urban/local road', 'Municipal jurisdiction', 'Citizen-service complaint workflow'];
}

function getRiskScore(road: RoadRecord) {
  if (typeof road.riskScore === 'number') {
    return road.riskScore;
  }
  return road.risk.toLowerCase() === 'high' ? 82 : 58;
}

function getRiskFactors(road: RoadRecord) {
  return road.riskFactors || ['Citizen complaint signal', 'Repair review pending', 'Traffic exposure'];
}

function RecenterMap({ road }: { road: RoadRecord | null }) {
  const map = useMap();

  useEffect(() => {
    if (road) {
      map.flyTo([road.lat, road.lng], 9, { duration: 0.8 });
    }
  }, [map, road]);

  return null;
}

export default function App() {
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState('');
  const [query, setQuery] = useState('');
  const [roads, setRoads] = useState<RoadRecord[]>([]);
  const [selectedRoad, setSelectedRoad] = useState<RoadRecord | null>(null);
  const [roadsLoading, setRoadsLoading] = useState(true);
  const [roadsError, setRoadsError] = useState('');
  const [routeResult, setRouteResult] = useState<ComplaintRouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [chatInput, setChatInput] = useState('Draft a complaint for this road and explain who should receive it.');
  const [chatReply, setChatReply] = useState('');
  const [chatSource, setChatSource] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [hazardResult] = useState({
    hazard: 'Pothole',
    confidence: '92%',
    priority: 'High',
    authority: 'NHAI',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const loadHealth = useCallback(async () => {
    try {
      setHealthError('');
      const response = await fetch(`${apiBase}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed with ${response.status}`);
      }
      const data = (await response.json()) as HealthResponse;
      setHealth(data);
    } catch (error) {
      setHealth(null);
      setHealthError(DEMO_MODE_MESSAGE);
    }
  }, [apiBase]);

  const searchRoads = useCallback(
    async (searchQuery: string) => {
      try {
        setRoadsLoading(true);
        setRoadsError('');
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
          params.set('query', searchQuery.trim());
        }
        const response = await fetch(`${apiBase}/api/roads/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Road search failed with ${response.status}`);
        }
        const data = (await response.json()) as RoadSearchResponse;
        const nextRoads = mergeWithDemoHazards(data.results, searchQuery);
        setRoads(nextRoads);
        setSelectedRoad((current) => nextRoads.find((road) => road.road === current?.road) || nextRoads[0] || null);
      } catch (error) {
        const nextRoads = filterDemoHazards(searchQuery);
        setRoads(nextRoads);
        setSelectedRoad((current) => nextRoads.find((road) => road.road === current?.road) || nextRoads[0] || null);
        setRoadsError(DEMO_MODE_MESSAGE);
      } finally {
        setRoadsLoading(false);
      }
    },
    [apiBase],
  );

  useEffect(() => {
    void loadHealth();
    void searchRoads('');
  }, [loadHealth, searchRoads]);

  useEffect(() => {
    setRouteResult(null);
    setRouteError('');
  }, [selectedRoad?.road]);

  const routeComplaint = async () => {
    if (!selectedRoad) {
      return;
    }

    try {
      setRouteLoading(true);
      setRouteError('');
      const response = await fetch(`${apiBase}/api/complaints/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          road_type: selectedRoad.type,
          district: selectedRoad.district,
          road_name: selectedRoad.road,
          issue: selectedRoad.issue_summary,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Routing failed with ${response.status}`);
      }
      setRouteResult(data as ComplaintRouteResponse);
    } catch (error) {
      setRouteResult({
        road_type: selectedRoad.type,
        district: selectedRoad.district,
        authority:
          selectedRoad.type.toUpperCase() === 'NH'
            ? 'NHAI / MoRTH regional office'
            : selectedRoad.type.toUpperCase() === 'PWD'
              ? 'State PWD Executive Engineer'
              : 'Local municipal or district road authority',
        priority: selectedRoad.risk.toLowerCase() === 'high' ? 'High' : 'Medium',
        escalation_channel: 'Demo civic grievance workflow',
        draft: `Request inspection for ${selectedRoad.road}. Issue reported: ${selectedRoad.issue_summary}`,
        next_steps: [
          'Attach a geotagged photo and nearest landmark.',
          'Submit through the routed authority grievance channel.',
          'Track status with the RoadWatch complaint ID.',
        ],
      });
      setRouteError('Demo routing used because the live backend is not reachable.');
    } finally {
      setRouteLoading(false);
    }
  };

  const askAssistant = async () => {
    if (!chatInput.trim()) {
      setChatError('Enter a question for RoadWatch AI.');
      return;
    }

    try {
      setChatLoading(true);
      setChatError('');
      setChatReply('');
      setChatSource('');
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput.trim(),
          road_name: selectedRoad?.road,
          district: selectedRoad?.district,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 503) {
          setChatReply(DEMO_ASSISTANT_REPLY);
          setChatSource('fallback');
          return;
        }
        throw new Error(data.detail || `AI request failed with ${response.status}`);
      }
      const chatData = data as ChatResponse;
      setChatReply(chatData.reply);
      setChatSource(chatData.source);
    } catch (error) {
      setChatError('Demo assistant response used because Gemini is not configured or the live API is unavailable.');
      setChatReply(DEMO_ASSISTANT_REPLY);
      setChatSource('fallback');
    } finally {
      setChatLoading(false);
    }
  };

  const healthReady = health?.status === 'ready';
  const aiDemoMode = health?.gemini_configured === false || chatSource === 'fallback';

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">RoadWatch live demo</p>
          <h1>Report Road Hazards. Track Repairs. Improve Road Safety.</h1>
          <div className="hero-actions" aria-label="Demo shortcuts">
            <button type="button" onClick={() => scrollToSection('report-hazard')}>
              Report Hazard
            </button>
            <button type="button" onClick={() => scrollToSection('risk-map')}>
              View Risk Map
            </button>
            <button type="button" onClick={() => scrollToSection('ai-assistant')}>
              Ask AI Assistant
            </button>
          </div>
        </div>
        <div className={`readiness-pill ${healthReady ? 'ready' : 'warning'}`}>
          {healthReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{healthReady ? 'Demo ready' : 'Setup needed'}</span>
        </div>
      </header>

      <section className="impact-banner" aria-label="RoadWatch impact simulation">
        <div>
          <p className="eyebrow">RoadWatch Impact Simulation</p>
          <h2>Sample hazard signals translated into safer, faster civic action.</h2>
        </div>
        <div className="impact-metrics">
          <span><strong>1,248</strong> hazards reported</span>
          <span><strong>896</strong> resolved</span>
          <span><strong>18,500</strong> commuters benefited</span>
        </div>
      </section>

      <section className="impact-section" aria-label="Road safety impact">
        <div>
          <p className="eyebrow">Road Safety Impact</p>
          <h2>Why this matters</h2>
        </div>
        <div className="impact-grid">
          <p>One pothole can cause multiple crashes before repair.</p>
          <p>Citizens often do not know whether to contact PWD, NHAI, Municipal Corporation, or State Highway Authority.</p>
          <p>RoadWatch automatically routes complaints and visualizes risk hotspots.</p>
          <p>Authorities gain actionable infrastructure insights.</p>
        </div>
      </section>

      <section className="metric-grid" aria-label="RoadWatch demo metrics">
        <div className="metric-card">
          <span>Hazards Reported</span>
          <strong>1,248</strong>
        </div>
        <div className="metric-card resolved">
          <span>Resolution Rate</span>
          <strong>72%</strong>
        </div>
        <div className="metric-card danger">
          <span>Average Response Time</span>
          <strong>4.2 Days</strong>
        </div>
        <div className="metric-card ai">
          <span>High-Risk Zones</span>
          <strong>38</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <section className="map-panel" id="risk-map" aria-label="Road hotspot map">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Map and records</p>
              <h2>Active road hotspots</h2>
              <p className="section-note">
                Demo dataset includes Delhi NCR, Chennai, and Bengaluru sample hazards to demonstrate multi-city scalability.
              </p>
            </div>
            <form
              className="search-form"
              onSubmit={(event) => {
                event.preventDefault();
                void searchRoads(query);
              }}
            >
              <Search size={18} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search road, district, status" />
              <button type="submit">Search</button>
            </form>
          </div>

          {roadsError && (
            <div className="demo-mode-label">
              <strong>Demo dataset active</strong>
              <span>{roadsError}</span>
            </div>
          )}
          {roadsLoading && (
            <div className="loading-state">
              <Loader2 className="spin" size={22} />
              Loading live demo road data...
            </div>
          )}
          {!roadsLoading && roads.length === 0 && <div className="empty-state">No roads matched this search.</div>}

          <MapContainer center={DEFAULT_CENTER} zoom={7} className="map-frame">
            <RecenterMap road={selectedRoad} />
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {roads.map((road) => (
              <Marker
                key={road.road}
                position={[road.lat, road.lng]}
                icon={getHazardIcon(road)}
                eventHandlers={{ click: () => setSelectedRoad(road) }}
              >
                <Popup>
                  <strong>{road.road}</strong>
                  <br />
                  {road.district} | {road.status}
                  <br />
                  Risk Score: {getRiskScore(road)}/100
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-legend" aria-label="Hazard marker legend">
            {Object.entries(HAZARD_MARKERS).map(([status, marker]) => (
              <span key={status}>
                <span className={`legend-dot ${marker.className}`} />
                {marker.label}
              </span>
            ))}
          </div>

          <div className="road-list" aria-label="Road search results">
            {roads.map((road) => (
              <button
                className={`road-row ${selectedRoad?.road === road.road ? 'selected' : ''}`}
                key={road.road}
                onClick={() => setSelectedRoad(road)}
                type="button"
              >
                <span className={`risk-dot ${road.risk.toLowerCase()}`} />
                <span>
                  <strong>{road.road}</strong>
                  <small>{road.district} | {road.status}</small>
                </span>
                <span className="road-type">{road.type}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="side-panel" aria-label="RoadWatch actions">
          <section className="info-panel">
            <div className="panel-heading">
              <MapPin size={18} />
              <h2>Road detail</h2>
            </div>
            {selectedRoad ? (
              <>
                <div className="detail-title">
                  <div>
                    <h3>{selectedRoad.road}</h3>
                    <p>{selectedRoad.district} district</p>
                  </div>
                  <span className={`risk-label ${selectedRoad.risk.toLowerCase()}`}>Risk Score: {getRiskScore(selectedRoad)}/100</span>
                </div>
                <dl className="detail-grid">
                  <div>
                    <dt>Contractor</dt>
                    <dd>{selectedRoad.contractor}</dd>
                  </div>
                  <div>
                    <dt>Budget</dt>
                    <dd>
                      {selectedRoad.budget_spent} / {selectedRoad.budget_sanctioned}
                    </dd>
                  </div>
                  <div>
                    <dt>Last repair</dt>
                    <dd>{selectedRoad.last_repair}</dd>
                  </div>
                  <div>
                    <dt>Next review</dt>
                    <dd>{selectedRoad.next_review}</dd>
                  </div>
                </dl>
                <div className="risk-factor-box">
                  <strong>Risk factors</strong>
                  <ul>
                    {getRiskFactors(selectedRoad).map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>
                </div>
                <p className="issue-summary">{selectedRoad.issue_summary}</p>
                <a className="source-link" href={selectedRoad.source_url} target="_blank" rel="noreferrer">
                  Open source portal
                </a>
              </>
            ) : (
              <p className="muted">Select a road to inspect contractor, budget, and repair context.</p>
            )}
          </section>

          <section className="info-panel" id="report-hazard">
            <div className="panel-heading">
              <Route size={18} />
              <h2>Complaint router</h2>
            </div>
            <button className="primary-action" disabled={!selectedRoad || routeLoading} onClick={routeComplaint} type="button">
              {routeLoading ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
              Route selected road
            </button>
            {routeError && (
              <div className="demo-mode-label">
                <strong>Professional demo routing</strong>
                <span>{routeError}</span>
              </div>
            )}
            {routeResult && (
              <div className="result-box">
                <p><strong>Complaint submitted successfully</strong></p>
                <p>Authority Selected: {selectedRoad ? getAuthorityLabel(selectedRoad, routeResult.authority) : getDemoAuthority(routeResult.authority)}</p>
                <p>Tracking ID: {DEMO_TRACKING_ID}</p>
                <p>Estimated priority: High</p>
                {selectedRoad && (
                  <div className="routing-reasons">
                    <strong>Reason</strong>
                    <ul>
                      {getRoutingReasons(selectedRoad).map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p>{routeResult.draft}</p>
                <ol>
                  {routeResult.next_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <section className="info-panel" id="ai-assistant">
            <div className="panel-heading">
              <Bot size={18} />
              <h2>Gemini assistant</h2>
            </div>
            {aiDemoMode && (
              <div className="demo-mode-label">
                <strong>AI Assistant Demo Mode</strong>
                <span>Gemini API key not configured. Showing fallback guidance.</span>
              </div>
            )}
            <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} rows={4} />
            <button className="primary-action" disabled={chatLoading} onClick={askAssistant} type="button">
              {chatLoading ? <Loader2 className="spin" size={17} /> : <Bot size={17} />}
              Ask RoadWatch AI
            </button>
            {chatError && (
              <div className="demo-mode-label">
                <strong>AI Assistant Demo Mode</strong>
                <span>{chatError}</span>
              </div>
            )}
            {chatReply && <p className="chat-reply">{chatReply}</p>}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <AlertTriangle size={18} />
              <h2>AI hazard detection</h2>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files?.[0]) {
                  setSelectedImage(event.target.files[0]);
                }
              }}
            />

            {selectedImage && (
              <div className="result-box">
                <p>
                  <strong>Hazard:</strong> {hazardResult.hazard}
                </p>
                <p>
                  <strong>Confidence:</strong> {hazardResult.confidence}
                </p>
                <p>
                  <strong>Priority:</strong> {hazardResult.priority}
                </p>
                <p>
                  <strong>Authority:</strong> {hazardResult.authority}
                </p>
              </div>
            )}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <CheckCircle2 size={18} />
              <h2>Demo readiness</h2>
            </div>
            {healthError && (
              <div className="demo-mode-label">
                <strong>Offline-ready demo mode</strong>
                <span>{healthError}</span>
              </div>
            )}
            {health?.checks?.map((check) => (
              <div className="check-row" key={check.name}>
                <span className={`check-dot ${check.status === 'ok' ? 'ok' : 'missing'}`} />
                <span>
                  <strong>{check.name}</strong>
                  <small>{check.detail}</small>
                </span>
              </div>
            ))}
          </section>
        </aside>
      </section>

      <section className="future-section" aria-label="Future AI features">
        <div>
          <p className="eyebrow">Coming Soon</p>
          <h2>Future AI features</h2>
        </div>
        <div className="future-grid">
          <p>Crowdsourced pothole reporting with photo upload and GPS tagging.</p>
          <p>Machine learning model to predict road deterioration from maintenance history.</p>
          <p>RTI filing integration for automated government data requests.</p>
          <p>Contractor performance scoring dashboard with a public leaderboard.</p>
          <p>WhatsApp bot integration for complaint filing without a smartphone app.</p>
          <p>Real-time road condition monitoring via IoT sensor data from vehicles.</p>
        </div>
      </section>

      <footer className="hackathon-footer">
        <div>
          <p>Built for IIT Madras Road Safety Hackathon 2026</p>
          <strong>RoadWatch</strong>
          <span>AI-Powered Road Safety & Infrastructure Transparency Platform</span>
        </div>
        <p>React | FastAPI | Leaflet Maps | Gemini AI | Docker</p>
      </footer>
    </main>
  );
}
