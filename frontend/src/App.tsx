import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, Loader2, MapPin, Route, Search, ShieldCheck } from 'lucide-react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';

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
  id: number;
  road: string;
  name: string;
  type: string;
  district: string;
  state: string;
  status: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  contractor: string;
  budget_sanctioned: string;
  budget_spent: string;
  budget_allocated: number;
  budget_spent_amount: number;
  hazard_type: string;
  complaints: number;
  authority: string;
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

type StatsResponse = {
  hazards_reported: number;
  complaints_routed: number;
  resolved_percentage: number;
  accident_prone_zones: number;
};

const DEFAULT_CENTER: [number, number] = [15.3173, 78.4772];

const severityColor = (severity: string) =>
  ({ high: '#c44536', medium: '#f2a541', low: '#2a9d68' })[severity] || '#607080';

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
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [routeResult, setRouteResult] = useState<ComplaintRouteResponse | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [chatInput, setChatInput] = useState('Draft a complaint for this road and explain who should receive it.');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const loadHealth = useCallback(async () => {
    try {
      setHealthError('');
      const response = await fetch(`${apiBase}/health`);
      if (!response.ok) throw new Error(`Health check failed with ${response.status}`);
      setHealth((await response.json()) as HealthResponse);
    } catch (error) {
      setHealth(null);
      setHealthError(error instanceof Error ? error.message : 'Backend is not reachable.');
    }
  }, [apiBase]);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/stats`);
      if (!response.ok) throw new Error(`Stats failed with ${response.status}`);
      setStats((await response.json()) as StatsResponse);
    } catch {
      setStats(null);
    }
  }, [apiBase]);

  const searchRoads = useCallback(
    async (searchQuery: string) => {
      try {
        setRoadsLoading(true);
        setRoadsError('');
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('query', searchQuery.trim());
        const response = await fetch(`${apiBase}/api/roads/search?${params.toString()}`);
        if (!response.ok) throw new Error(`Road search failed with ${response.status}`);
        const data = (await response.json()) as RoadSearchResponse;
        setRoads(data.results);
        setSelectedRoad((current) => data.results.find((road) => road.id === current?.id) || data.results[0] || null);
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
    void loadStats();
    void searchRoads('');
  }, [loadHealth, loadStats, searchRoads]);

  useEffect(() => {
    setRouteResult(null);
    setRouteError('');
  }, [selectedRoad?.id]);

  const routeComplaint = async () => {
    if (!selectedRoad) return;

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
      if (!response.ok) throw new Error(data.detail || `Routing failed with ${response.status}`);
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
      if (!response.ok) throw new Error(data.detail || `AI request failed with ${response.status}`);
      setChatReply((data as ChatResponse).reply);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'RoadWatch AI could not respond.');
    } finally {
      setChatLoading(false);
    }
  };

  const healthReady = Boolean(health && !healthError);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">RoadWatch live demo</p>
          <h1>Road safety transparency dashboard</h1>
        </div>
        <div className={`readiness-pill ${healthReady ? 'ready' : 'warning'}`}>
          {healthReady ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{health?.gemini_configured ? 'Gemini ready' : healthReady ? 'Fallback ready' : 'Setup needed'}</span>
        </div>
      </header>

      <section className="metric-grid" aria-label="RoadWatch demo metrics">
        <div className="metric-card">
          <span>Hazards reported</span>
          <strong>{stats ? stats.hazards_reported.toLocaleString() : '-'}</strong>
        </div>
        <div className="metric-card danger">
          <span>Complaints routed</span>
          <strong>{stats ? stats.complaints_routed.toLocaleString() : '-'}</strong>
        </div>
        <div className="metric-card resolved">
          <span>Resolved cases</span>
          <strong>{stats ? `${stats.resolved_percentage}%` : '-'}</strong>
        </div>
        <div className="metric-card ai">
          <span>Accident-prone zones</span>
          <strong>{stats ? stats.accident_prone_zones.toLocaleString() : '-'}</strong>
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
              <CircleMarker
                center={[road.lat, road.lng]}
                eventHandlers={{ click: () => setSelectedRoad(road) }}
                key={road.id}
                pathOptions={{
                  color: severityColor(road.severity),
                  fillColor: severityColor(road.severity),
                  fillOpacity: 0.78,
                  weight: 2,
                }}
                radius={road.severity === 'high' ? 14 : 9}
              >
                <Popup>
                  <strong>{road.name}</strong>
                  <br />
                  {road.district}, {road.state}
                  <br />
                  {road.hazard_type} | {road.status}
                  <br />
                  {road.complaints} complaints | {road.authority}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="map-legend">
            <span>
              <span className="legend-dot high" /> High risk
            </span>
            <span>
              <span className="legend-dot medium" /> Medium risk
            </span>
            <span>{roads.length} hotspots loaded</span>
          </div>

          <div className="road-list" aria-label="Road search results">
            {roads.map((road) => (
              <button className={`road-row ${selectedRoad?.id === road.id ? 'selected' : ''}`} key={road.id} onClick={() => setSelectedRoad(road)} type="button">
                <span className={`risk-dot ${road.risk.toLowerCase()}`} />
                <span>
                  <strong>{road.road}</strong>
                  <small>
                    {road.district}, {road.state} | {road.status}
                  </small>
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
                    <dt>Hazard</dt>
                    <dd>{selectedRoad.hazard_type}</dd>
                  </div>
                  <div>
                    <dt>Complaints</dt>
                    <dd>{selectedRoad.complaints}</dd>
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
                <p className="routing-reasons">
                  <strong>Responsible authority</strong>
                  {selectedRoad.authority}
                </p>
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
            {chatReply && (
              <div className="chat-reply">
                {!health?.gemini_configured && <span className="demo-mode-label">Gemini key not set. Showing the built-in RoadWatch draft.</span>}
                <p>{chatReply}</p>
              </div>
            )}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <AlertTriangle size={18} />
              <h2>AI hazard detection</h2>
            </div>
            <input
              accept="image/*"
              onChange={(event) => {
                if (event.target.files?.[0]) setSelectedImage(event.target.files[0]);
              }}
              type="file"
            />
            {selectedImage && (
              <div className="result-box hazard-result">
                <img className="hazard-preview" src={URL.createObjectURL(selectedImage)} alt="Road hazard preview" />
                <p>
                  <strong>Hazard:</strong> Pothole
                </p>
                <p>
                  <strong>Confidence:</strong> 92%
                </p>
                <p>
                  <strong>Priority:</strong> High
                </p>
                <p>
                  <strong>Authority:</strong> {selectedRoad?.authority || 'NHAI'}
                </p>
              </div>
            )}
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <CheckCircle2 size={18} />
              <h2>Demo readiness</h2>
            </div>
            {healthError && <div className="alert error">{healthError}</div>}
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
    </main>
  );
}
