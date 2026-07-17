import React, { useState } from 'react';
import { scanUrl } from '../api/phishApi';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await scanUrl(url);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <div className="glass-panel p-8">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Activity className="text-blue-400" />
          Scan URL
        </h2>
        <form onSubmit={handleScan} className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Analyze'}
          </button>
        </form>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-panel p-8"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className={`p-4 rounded-full ${result.label === 'phishing' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {result.label === 'phishing' ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
            </div>
            <div>
              <h3 className="text-2xl font-bold capitalize">{result.label}</h3>
              <p className="text-slate-400 text-lg">Threat Score: {(result.threat_score * 100).toFixed(0)}%</p>
            </div>
          </div>
          
          <h4 className="text-xl font-semibold mb-4">Why this URL was flagged:</h4>
          <div className="space-y-4">
            {result.explanation?.top_factors?.map((factor, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-48 text-slate-300 truncate">{factor.feature}</div>
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(factor.contribution) * 200, 100)}%` }}
                    className={`h-full ${factor.direction === 'phishing' ? 'bg-red-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <div className="w-16 text-right font-mono text-sm">
                  {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default URLScanner;
