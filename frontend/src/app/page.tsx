'use client';

import { useEffect, useState } from 'react';
import { ShieldAlert, Activity, Globe, MapPin, Search, Download, Sparkles, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';

interface Item {
  id: number;
  pathogen_name: string;
  severity: string;
  transmission_vector: string;
  status: string;
  location_coords: string | null;
  risk_score: number | null;
  notes: string | null;
}

interface Alert {
  source: string;
  title: string;
  link: string;
  published: string;
  summary: string;
}

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const [pathogenName, setPathogenName] = useState('Hantavirus (Sin Nombre)');
  const [severity, setSeverity] = useState('Moderate');
  const [transmissionVector, setTransmissionVector] = useState('Zoonotic / Rodent Borne');
  const [status, setStatus] = useState('Under Investigation');
  const [locationCoords, setLocationCoords] = useState('-17.8252, 31.0335');
  const [riskScore, setRiskScore] = useState<number>(6.5);
  const [notes, setNotes] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchItems(savedToken);
    }

    fetch('http://127.0.0.1:8000/api/global-alerts')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setAlerts(data.data);
        setLoadingAlerts(false);
      })
      .catch(() => setLoadingAlerts(false));
  }, []);

  const fetchItems = (authToken: string, query = '', sev = 'All') => {
    let url = 'http://127.0.0.1:8000/api/items/?';
    if (query) url += `search=${encodeURIComponent(query)}&`;
    if (sev && sev !== 'All') url += `severity=${encodeURIComponent(sev)}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching items:', err));
  };

  useEffect(() => {
    if (token) {
      fetchItems(token, searchQuery, severityFilter);
    }
  }, [searchQuery, severityFilter, token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/api/register' : '/api/token';
    let body: any = isRegistering ? JSON.stringify({ username, password }) : new URLSearchParams({ username, password });

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': isRegistering ? 'application/json' : 'application/x-www-form-urlencoded' },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');

      if (isRegistering) {
        setIsRegistering(false);
        alert('Registration successful! Please log in.');
      } else {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        fetchItems(data.access_token);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setItems([]);
  };

  const simulateAiAgent = () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setTimeout(() => {
      let threatLevel = riskScore > 7.5 ? 'CRITICAL CONTAINMENT PROTOCOL REQUIRED' : 'STANDARD EPIDEMIOLOGICAL MONITORING';
      setAiAnalysis(`AI Agent Assessment: Pathogen [${pathogenName}] categorized under vector [${transmissionVector}]. Risk score evaluated at ${riskScore}/10. Recommendation: Establish a 5km quarantine perimeter and deploy real-time PCR field screening. Status: ${threatLevel}.`);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pathogen_name: pathogenName,
          severity,
          transmission_vector: transmissionVector,
          status,
          location_coords: locationCoords,
          risk_score: riskScore,
          notes: notes + (aiAnalysis ? ` \n[AI Notes: ${aiAnalysis}]` : ''),
        }),
      });

      if (res.ok) {
        setNotes('');
        setAiAnalysis(null);
        fetchItems(token, searchQuery, severityFilter);
      }
    } catch (err) {
      console.error('Error creating telemetry record:', err);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchItems(token, searchQuery, severityFilter);
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const exportToCSV = () => {
    const headers = 'ID,Pathogen,Severity,Vector,Status,Coordinates,RiskScore,Notes\n';
    const rows = items.map(i => `"${i.id}","${i.pathogen_name}","${i.severity}","${i.transmission_vector}","${i.status}","${i.location_coords}","${i.risk_score}","${(i.notes || '').replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hantashield_telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (!token) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-slate-900 p-4 font-sans">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 text-slate-100">
          <div className="flex justify-center mb-3 text-cyan-400">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-1 text-center">Hantashield Portal</h1>
          <p className="text-xs text-center text-slate-400 mb-6">Secure Biosecurity & Pathogen Command Center</p>
          {error && <p className="mb-4 text-sm text-red-400 bg-red-950/50 border border-red-800 p-2.5 rounded">{error}</p>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Operator Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Security Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-md transition shadow-lg shadow-cyan-900/50"
            >
              {isRegistering ? 'Initialize Operator Account' : 'Authenticate Session'}
            </button>
          </form>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-4 text-xs text-cyan-400 hover:underline text-center"
          >
            {isRegistering ? 'Existing operator? Authenticate here' : 'Need clearance? Register new account'}
          </button>
        </div>
      </main>
    );
  }

  const criticalCount = items.filter(i => i.severity === 'Critical / Emergency').length;
  const activeCount = items.filter(i => i.status === 'Confirmed Active' || i.status === 'Under Investigation').length;

  return (
    <main className="p-6 max-w-7xl mx-auto font-sans bg-slate-950 text-slate-100 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-cyan-400" size={32} />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Hantashield Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Autonomous Epidemiological Surveillance & Threat Mitigation Matrix</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition"
          >
            <Download size={15} /> Export CSV Report
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Terminate Session
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Surveillance Logs</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-100">{items.length}</h3>
          </div>
          <Activity className="text-cyan-400" size={28} />
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Investigations</p>
            <h3 className="text-3xl font-bold mt-1 text-cyan-400">{activeCount}</h3>
          </div>
          <Sparkles className="text-cyan-400" size={28} />
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Critical Emergencies</p>
            <h3 className="text-3xl font-bold mt-1 text-red-400">{criticalCount}</h3>
          </div>
          <AlertTriangle className="text-red-400" size={28} />
        </div>
      </div>

      {/* Official External Live Update Websites Hub */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 mb-8">
        <h2 className="text-base font-bold flex items-center gap-2 mb-3">
          <ExternalLink size={18} className="text-cyan-400" /> Official Global Health Surveillance Portals (Live Links)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="https://www.who.int/emergencies/disease-outbreak-news"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">WHO Outbreak News</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Official World Health Organization updates</p>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://www.cdc.gov/globalhealth/default.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">CDC Global Health</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Centers for Disease Control telemetry</p>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://promedmail.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">ProMED-mail</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Emerging disease outbreak reporting</p>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </a>

          <a
            href="https://www.ecdc.europa.eu/en/outbreaks-today"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition flex items-center justify-between group"
          >
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">ECDC Outbreaks Today</p>
              <p className="text-[10px] text-slate-400 mt-0.5">European Centre disease surveillance</p>
            </div>
            <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
          </a>
        </div>
      </div>

      {/* Grid: Global Ticker Feed & AI Logging Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left: WHO Live Threat Feed */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Globe size={18} className="text-cyan-400" /> Live Threat Ticker
            </h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          {loadingAlerts ? (
            <p className="text-xs text-slate-400">Syncing international feeds...</p>
          ) : alerts.length === 0 ? (
            <p className="text-xs text-slate-400">No active bulletins.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {alerts.slice(0, 5).map((alert, idx) => (
                <div key={idx} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{alert.source}</span>
                  <h4 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-2">{alert.title}</h4>
                  <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-500 hover:underline mt-1 inline-flex items-center gap-1">
                    Read Report <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive AI Pathogen Logger */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400" /> Log Advanced Telemetry Event
            </h2>
            <button
              type="button"
              onClick={simulateAiAgent}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              <Sparkles size={14} /> {isAnalyzing ? 'Running AI Agent...' : 'Simulate AI Risk Analysis'}
            </button>
          </div>

          {aiAnalysis && (
            <div className="mb-4 p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-xs text-cyan-200">
              <p className="font-bold mb-1">🤖 Autonomous Agent Output:</p>
              {aiAnalysis}
            </div>
          )}

          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pathogen / Strain</label>
                <select
                  value={pathogenName}
                  onChange={(e) => setPathogenName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Hantavirus (Sin Nombre)">Hantavirus (Sin Nombre)</option>
                  <option value="Hantavirus (Puumala)">Hantavirus (Puumala)</option>
                  <option value="COVID-19 (SARS-CoV-2)">COVID-19 (SARS-CoV-2)</option>
                  <option value="Avian Influenza (H5N1)">Avian Influenza (H5N1)</option>
                  <option value="Ebola Virus">Ebola Virus</option>
                  <option value="Marburg Virus">Marburg Virus</option>
                  <option value="Lassa Fever">Lassa Fever</option>
                  <option value="Other Emerging Pathogen">Other Emerging Pathogen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Threat Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical / Emergency">Critical / Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Transmission Vector</label>
                <select
                  value={transmissionVector}
                  onChange={(e) => setTransmissionVector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Zoonotic / Rodent Borne">Zoonotic / Rodent Borne</option>
                  <option value="Airborne / Respiratory">Airborne / Respiratory</option>
                  <option value="Direct Contact">Direct Contact</option>
                  <option value="Waterborne">Waterborne</option>
                  <option value="Vector-Borne (Mosquito/Tick)">Vector-Borne (Mosquito/Tick)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Operational Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Confirmed Active">Confirmed Active</option>
                  <option value="Contained">Contained</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GIS Coordinates</label>
                <input
                  type="text"
                  value={locationCoords}
                  onChange={(e) => setLocationCoords(e.target.value)}
                  placeholder="e.g. -17.8252, 31.0335"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Calculated Risk Score: {riskScore}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={riskScore}
                  onChange={(e) => setRiskScore(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 mt-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Field Telemetry Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter clinical symptoms, soil/rodent trapping telemetry, or sample testing details..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500 h-20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition shadow-md shadow-cyan-950"
            >
              Commit Telemetry to Database
            </button>
          </form>
        </div>
      </div>

      {/* Surveillance Records Header with Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Activity size={18} className="text-cyan-400" /> Recorded Surveillance Database
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search pathogens or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500 w-56"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
            <option value="Critical / Emergency">Critical / Emergency</option>
          </select>
        </div>
      </div>

      {/* Surveillance Cards List */}
      {items.length === 0 ? (
        <p className="text-slate-400 bg-slate-900 p-8 rounded-xl border border-slate-800 text-center text-sm">
          No matching surveillance events found in the database.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-5 border border-slate-800 rounded-xl bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-100 text-base">{item.pathogen_name}</h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    item.severity === 'Critical / Emergency' ? 'bg-red-950 text-red-300 border-red-800' :
                    item.severity === 'High' ? 'bg-orange-950 text-orange-300 border-orange-800' :
                    item.severity === 'Moderate' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                    {item.status}
                  </span>
                  {item.risk_score && (
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Risk: {item.risk_score}/10
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span><strong className="text-slate-300">Vector:</strong> {item.transmission_vector}</span>
                  {item.location_coords && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-cyan-400" /> {item.location_coords}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs mt-1 whitespace-pre-line">{item.notes || 'No telemetry notes provided.'}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs px-3 py-1.5 rounded-lg transition shrink-0"
              >
                <Trash2 size={13} /> Delete Record
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
