import { useCallback, useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { AlertTriangle, Bot, CheckCircle2, CircleDot, Loader2, MapPin, Route, Search, ShieldCheck } from 'lucide-react';
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

const DEFAULT_CENTER: [number, number] = [12.9, 79.7];

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
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

const [hazardResult, setHazardResult] = useState({
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
      setHealthError(error instanceof Error ? error.message : 'Backend is not reachable.');
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
        setRoads(data.results);
        setSelectedRoad((current) => data.results.find((road) => road.road === current?.road) || data.results[0] || null);
      } catch (error) {
        setRoads([]);
        setSelectedRoad(null);
        setRoadsError(error instanceof Error ? error.message : 'Could not load road data.');
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

  const metrics = useMemo(() => {
    const highRisk = roads.filter((road) => road.risk.toLowerCase() === 'high').length;
    const sanctionedTotal = roads.length;
    const districts = new Set(roads.map((road) => road.district)).size;
    return { highRisk, sanctionedTotal, districts };
  }, [roads]);

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
      setRouteResult(null);
      setRouteError(error instanceof Error ? error.message : 'Could not route complaint.');
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
        throw new Error(data.detail || `AI request failed with ${response.status}`);
      }
      setChatReply((data as ChatResponse).reply);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'RoadWatch AI could not respond.');
    } finally {
      setChatLoading(false);
    }
  };

  const healthReady = health?.status === 'ready';

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">RoadWatch live demo</p>
          <h1>Road safety transparency dashboard</h1>
        </div>
        <div className={`readiness-pill ${healthReady ? 'ready' : 'warning'}`}>
          {healthReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{healthReady ? 'Demo ready' : 'Setup needed'}</span>
        </div>
      </header>

      <section className="metric-grid" aria-label="RoadWatch demo metrics">
        <div className="metric-card">
          <span>Roads loaded</span>
          <strong>{roadsLoading ? '-' : metrics.sanctionedTotal}</strong>
        </div>
        <div className="metric-card danger">
          <span>High-risk routes</span>
          <strong>{roadsLoading ? '-' : metrics.highRisk}</strong>
        </div>
        <div className="metric-card">
          <span>Districts covered</span>
          <strong>{roadsLoading ? '-' : metrics.districts}</strong>
        </div>
        <div className="metric-card ai">
          <span>Gemini status</span>
          <strong>{health?.gemini_configured ? 'Ready' : 'Required'}</strong>
        </div>
      </section>

      <section className="workspace-grid">
        <section className="map-panel" aria-label="Road hotspot map">
          <div className="toolbar">
            <div>
              <p className="eyebrow">Map and records</p>
              <h2>Active road hotspots</h2>
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

          {roadsError && <div className="alert error">{roadsError}</div>}
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
              <Marker key={road.road} position={[road.lat, road.lng]} eventHandlers={{ click: () => setSelectedRoad(road) }}>
                <Popup>
                  <strong>{road.road}</strong>
                  <br />
                  {road.district} | {road.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

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
                  <span className={`risk-label ${selectedRoad.risk.toLowerCase()}`}>{selectedRoad.risk} risk</span>
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
                <p className="issue-summary">{selectedRoad.issue_summary}</p>
                <a className="source-link" href={selectedRoad.source_url} target="_blank" rel="noreferrer">
                  Open source portal
                </a>
              </>
            ) : (
              <p className="muted">Select a road to inspect contractor, budget, and repair context.</p>
            )}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <Route size={18} />
              <h2>Complaint router</h2>
            </div>
            <button className="primary-action" disabled={!selectedRoad || routeLoading} onClick={routeComplaint} type="button">
              {routeLoading ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
              Route selected road
            </button>
            {routeError && <div className="alert error">{routeError}</div>}
            {routeResult && (
              <div className="result-box">
                <p>
                  <strong>{routeResult.authority}</strong>
                  <span>{routeResult.priority} priority</span>
                </p>
                <p>{routeResult.draft}</p>
                <ol>
                  {routeResult.next_steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <Bot size={18} />
              <h2>Gemini assistant</h2>
            </div>
                    <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} rows={4} />
            <button className="primary-action" disabled={chatLoading} onClick={askAssistant} type="button">
              {chatLoading ? <Loader2 className="spin" size={17} /> : <Bot size={17} />}
              Ask RoadWatch AI
            </button>
            {chatError && <div className="alert error">{chatError}</div>}
            {chatReply && <p className="chat-reply">{chatReply}</p>}
          </section>

          {/* PASTE HERE*/}

          <section className="info-panel">
            <div className="panel-heading">
              <AlertTriangle size={18} />
              <h2>AI hazard detection</h2>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (e.target.files?.[0]) {

   setSelectedImage(e.target.files[0])
  ;
                }
               }}
              />  

              {selectedImage && (
                <div className="result-box">
                  <p><strong>Hazard:</strong> 
  {hazardResult.hazard}</p>
                  <p><strong>Confidence:</strong> {hazardResult.confidence}</p>
                  <p><strong>Priority:</strong> {hazardResult.priority}</p>
                  <p><strong>Authority:</strong> {hazardResult.authority}</p>

                </div>
              )}
          </section>

<section className="info-panel"> 
  </section>         
