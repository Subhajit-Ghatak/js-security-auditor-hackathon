import React, { useState } from 'react';
import { Shield, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

export default function App() {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error connecting to auditor backend. Is your server.js running?');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <header className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <Shield className="w-8 h-8 text-emerald-400"/>
        <h1 className="text-2xl font-bold">JS Guard: AI Security Auditor</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Input */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-400">Paste Express routes or Mongo schemas:</label>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="font-mono text-sm p-4 bg-slate-950 border border-slate-800 rounded-lg h-96 focus:outline-none focus:border-emerald-500 resize-none"
            placeholder="app.get('/user', (req, res) => { db.users.find({ user: req.query.id }) })"
          />
          <button
            onClick={handleAudit}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing Architecture Flaws...' : 'Run Security Audit'}
          </button>
        </div>

        {/* Right Pane: Comparison / Vulnerability View */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          {result ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {result.isVulnerable ? (
                    <span className="flex items-center gap-1 bg-red-950 text-red-400 text-xs px-2 py-1 rounded border border-red-800">
                      <AlertTriangle className="w-3.5 h-3.5"/> {result.vulnerabilityType} ({result.severity})
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-emerald-950 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5"/> Code Appears Secure
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mb-4">{result.explanation}</p>
                
                <label className="text-xs text-slate-500 block mb-1 font-semibold">REMEDIATED SECURE CODE</label>
                <pre className="bg-slate-900 p-4 rounded border border-slate-800 text-sm font-mono text-emerald-300 overflow-x-auto max-h-64 whitespace-pre-wrap">
                  {result.secureCode || '// No changes required'}
                </pre>
              </div>
              
              {result.secureCode && (
                <button
                  onClick={() => navigator.clipboard.writeText(result.secureCode)}
                  className="mt-4 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded transition-colors text-sm"
                >
                  <Copy className="w-4 h-4"/> Copy Remediated Code
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Run audit to see side-by-side remediation comparison.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}