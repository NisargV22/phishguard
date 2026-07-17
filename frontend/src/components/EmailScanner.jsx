import React, { useState } from 'react';
import { scanEmail } from '../api/phishApi';
import { Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const EmailScanner = () => {
  const [rawEmail, setRawEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await scanEmail(rawEmail);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to scan email.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Mail className="text-indigo-400" />
          Analyze Email Headers
        </h2>
        <form onSubmit={handleScan} className="flex flex-col gap-4">
          <textarea
            value={rawEmail}
            onChange={(e) => setRawEmail(e.target.value)}
            placeholder="Paste raw email source here (including headers)..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors h-64 resize-y"
            required
          />
          <button
            type="submit"
            disabled={loading || !rawEmail.trim()}
            className="self-end bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Analyzing...' : 'Analyze Source'}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-panel p-8"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className={`p-4 rounded-full ${result.overall_risk === 'low' ? 'bg-emerald-500/20 text-emerald-400' : result.overall_risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
              {result.overall_risk === 'low' ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
            </div>
            <div>
              <h3 className="text-2xl font-bold capitalize">Risk: {result.overall_risk}</h3>
              <p className="text-slate-400 text-lg">From: {result.from_address}</p>
              <p className="text-slate-400 text-md">Subject: {result.subject}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-indigo-300">Authentication Checks</h4>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">SPF</span>
                  <span className={`font-mono ${result.spf_result === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>{result.spf_result.toUpperCase()}</span>
                </li>
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">DKIM</span>
                  <span className={`font-mono ${result.dkim_result === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>{result.dkim_result.toUpperCase()}</span>
                </li>
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">DMARC</span>
                  <span className={`font-mono ${result.dmarc_result === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>{result.dmarc_result.toUpperCase()}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4 text-indigo-300">Content Analysis</h4>
              <ul className="space-y-3">
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Urgency Score</span>
                  <span className="font-mono text-slate-200">{result.urgency_score}</span>
                </li>
                <li className="flex flex-col border-b border-slate-700 pb-2">
                  <span className="text-slate-400 mb-1">Suspicious Indicators</span>
                  {result.suspicious_indicators.length > 0 ? (
                     <ul className="list-disc list-inside text-sm text-red-400 pl-2">
                       {result.suspicious_indicators.map((ind, i) => <li key={i}>{ind}</li>)}
                     </ul>
                  ) : (
                     <span className="text-emerald-400 text-sm">None found</span>
                  )}
                </li>
              </ul>
            </div>
          </div>
          
          {result.urls_found && result.urls_found.length > 0 && (
             <div className="mt-8">
                <h4 className="text-xl font-semibold mb-4 text-indigo-300">Extracted URLs</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-blue-300 space-y-2">
                   {result.urls_found.map((u, i) => <div key={i}>{u}</div>)}
                </div>
             </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EmailScanner;
