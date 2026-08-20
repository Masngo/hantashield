'use client';

import React, { useState } from 'react';

export default function HantashieldDashboard() {
  const [pathogenName, setPathogenName] = useState('Hantavirus (Sin Nombre)');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunDiagnosis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathogen_name: pathogenName, severity_level: 'High' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAssessment(data.clinical_assessment);
      } else {
        setError('Failed to fetch clinical evaluation protocol.');
      }
    } catch (err) {
      setError('Connection error: Make sure the FastAPI backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-cyan-400">HANTASHIELD // Biosecurity & Diagnostic Node</h1>
          <p className="text-xs text-slate-400">Autonomous Clinical Decision Support & Outbreak Surveillance System</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs rounded-full">System Online</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300">Pathogen Selector</h2>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Pathogen / Agent</label>
            <select
              value={pathogenName}
              onChange={(e) => setPathogenName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Hantavirus (Sin Nombre)">Hantavirus (Sin Nombre)</option>
              <option value="Cholera (Vibrio cholerae)">Cholera (Vibrio cholerae)</option>
              <option value="Rift Valley Fever (RVF)">Rift Valley Fever (RVF)</option>
              <option value="Ebola Virus">Ebola Virus</option>
              <option value="Marburg Virus">Marburg Virus</option>
              <option value="Avian Influenza (H5N1)">Avian Influenza (H5N1)</option>
              <option value="COVID-19 (SARS-CoV-2)">COVID-19 (SARS-CoV-2)</option>
              <option value="Lassa Fever">Lassa Fever</option>
              <option value="Other Emerging Pathogen">Other Emerging Pathogen</option>
            </select>
          </div>

          <button
            onClick={handleRunDiagnosis}
            disabled={loading}
            className="w-full mt-2 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Synthesizing Protocol...' : 'Run Clinical Diagnostics'}
          </button>

          {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
        </div>

        {/* Results Matrix Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">1. Differential Diagnosis</h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {assessment?.differential_diagnosis ? (
                assessment.differential_diagnosis.map((item: string, idx: number) => <li key={idx}>{item}</li>)
              ) : (
                <li className="text-slate-500 italic">Select a pathogen and run diagnostics.</li>
              )}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">2. Confirmatory Lab Tests</h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {assessment?.confirmatory_tests ? (
                assessment.confirmatory_tests.map((item: string, idx: number) => <li key={idx}>{item}</li>)
              ) : (
                <li className="text-slate-500 italic">Awaiting telemetry input.</li>
              )}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">3. Therapeutics & Care</h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {assessment?.therapeutics ? (
                assessment.therapeutics.map((item: string, idx: number) => <li key={idx}>{item}</li>)
              ) : (
                <li className="text-slate-500 italic">Awaiting telemetry input.</li>
              )}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">4. Containment & PPE</h3>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {assessment?.containment_ppe ? (
                assessment.containment_ppe.map((item: string, idx: number) => <li key={idx}>{item}</li>)
              ) : (
                <li className="text-slate-500 italic">Awaiting telemetry input.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
