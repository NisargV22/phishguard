import React, { useEffect, useState } from 'react';
import { getHistory } from '../api/phishApi';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, ShieldCheck, Mail } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-10">Loading history...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Clock className="text-purple-400" />
        Scan History
      </h2>
      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400">No scans found.</div>
        ) : (
          history.map((scan, i) => (
            <motion.div
              key={scan.scan_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${scan.scan_type === 'email' ? 'bg-indigo-500/20 text-indigo-400' : scan.label === 'phishing' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {scan.scan_type === 'email' ? <Mail /> : scan.label === 'phishing' ? <ShieldAlert /> : <ShieldCheck />}
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-200 truncate max-w-md" title={scan.url}>{scan.url || 'Email Analysis'}</h4>
                  <p className="text-sm text-slate-400">{new Date(scan.scanned_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  scan.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                  scan.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  scan.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {scan.risk_level} Risk
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
