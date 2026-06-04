import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MessageSquare, Route, ShieldAlert } from 'lucide-react';

const sampleRoads = [
  { name: 'NH-44', type: 'NH', position: [13.0827, 80.2707], status: 'Needs attention' },
  { name: 'SH-17', type: 'SH', position: [12.9716, 79.1599], status: 'Moderate' },
  { name: 'MDR-4', type: 'MDR', position: [13.6288, 79.4192], status: 'High risk' },
];

export default function App() {
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  const [health, setHealth] = useState('Loading...');
  const [roadType, setRoadType] = useState('SH');
  const [district, setDistrict] = useState('Chennai');
  const [routeResult, setRouteResult] = useState<any>(null);
  const [chatInput, setChatInput] = useState('How do I report a pothole on NH-44?');
  const [chatReply, setChatReply] = useState('Ask the assistant about road issues and complaint routing.');

  useEffect(() => {
    fetch(`${apiBase}/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data.status || 'ok'))
      .catch(() => setHealth('Backend not running yet'));
  }, []);

  const routeComplaint = async () => {
    const response = await fetch(`${apiBase}/api/complaints/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ road_type: roadType, district }),
    });
    const data = await response.json();
    setRouteResult(data);
  };

  const askAssistant = async () => {
    const response = await fetch(`${apiBase}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: chatInput }),
    });
    const data = await response.json();
    setChatReply(data.reply || 'No response returned.');
  };

  const summary = useMemo(
    () => sampleRoads.reduce((acc, road) => acc + (road.type === 'NH' ? 1 : 0), 0),
    []
  );

  return (
    <main className="app-shell">
      <section className="panel stack">
        <header className="hero-card">
          <p className="eyebrow">RoadWatch MVP</p>
          <h1>AI-powered road safety and infrastructure transparency</h1>
          <p className="lede">Track hazards, route complaints, and inspect road maintenance information in one civic dashboard.</p>
        </header>

        <article className="hero-card map-card">
          <div className="section-header">
            <div>
              <p className="eyebrow">Map view</p>
              <h2>Active road hotspots</h2>
            </div>
            <span className="badge">{summary} NH routes monitored</span>
          </div>
          <MapContainer center={[13.0827, 80.2707]} zoom={7} className="map-frame">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sampleRoads.map((road) => (
              <Marker key={road.name} position={road.position as [number, number]}>
                <Popup>
                  <strong>{road.name}</strong>
                  <br />
                  Type: {road.type}
                  <br />
                  Status: {road.status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </article>
      </section>

      <aside className="panel stack">
        <article className="hero-card status-card">
          <div className="section-header">
            <ShieldAlert size={18} />
            <h2>System status</h2>
          </div>
          <p>Backend health: {health}</p>
          <p>Complaint routing engine: active</p>
          <p>AI chat assistant: ready for Gemini integration</p>
        </article>

        <article className="hero-card">
          <div className="section-header">
            <Route size={18} />
            <h2>Complaint router</h2>
          </div>
          <label>Road type</label>
          <select value={roadType} onChange={(e) => setRoadType(e.target.value)}>
            <option value="NH">National Highway</option>
            <option value="SH">State Highway</option>
            <option value="MDR">Major District Road</option>
            <option value="PMGSY">Rural Road</option>
          </select>

          <label>District</label>
          <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter district" />

          <button onClick={routeComplaint}>Route complaint</button>

          {routeResult && (
            <div className="result-box">
              <p><strong>Authority:</strong> {routeResult.authority}</p>
              <p><strong>Draft:</strong> {routeResult.draft}</p>
            </div>
          )}
        </article>

        <article className="hero-card">
          <div className="section-header">
            <MessageSquare size={18} />
            <h2>AI assistant</h2>
          </div>
          <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} rows={3} />
          <button onClick={askAssistant}>Ask RoadWatch AI</button>
          <p className="chat-reply">{chatReply}</p>
        </article>
      </aside>
    </main>
  );
}
