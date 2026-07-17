import React, { useEffect, useState } from 'react';
import { getHistory, getStats } from '../api/phishApi';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, ShieldCheck, Mail, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const History = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyData, statsData] = await Promise.all([
          getHistory(),
          getStats()
        ]);
        setHistory(historyData.data || []);
        setStats(statsData);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-10">Loading analytics...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 space-y-8">
      <h2 className="text-3xl font-bold flex items-center gap-3">
        <PieChartIcon className="text-purple-400" />
        Analytics Dashboard
      </h2>

      {/* Analytics Dashboard Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-400 font-mono text-sm uppercase tracking-wider mb-2">Total Scans</h3>
            <span className="text-5xl font-black text-white">{stats.total_scans}</span>
          </div>
          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-slate-400 font-mono text-sm uppercase tracking-wider mb-2">Detection Rate</h3>
            <span className="text-5xl font-black text-indigo-400">{(stats.detection_rate * 100).toFixed(1)}%</span>
          </div>
          <div className="glass-panel p-6 h-64 flex flex-col items-center">
            <h3 className="text-slate-400 font-mono text-sm uppercase tracking-wider mb-2">Risk Distribution</h3>
            <div className="w-full h-full pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.distribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold flex items-center gap-3 pt-8 border-t border-slate-800">
        <Clock className="text-blue-400" />
        Scan History
      </h2>
      
      <div className="grid gap-4">
        {!Array.isArray(history) ? (
          <div className="glass-panel p-8 text-center text-red-400">Failed to load history data.</div>
        ) : history.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-400">No scans found.</div>
        ) : (
          history.map((scan, i) => (
            <motion.div
              key={scan.scan_id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${scan.scan_type === 'email' ? 'bg-indigo-500/20 text-indigo-400' : scan.label === 'phishing' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {scan.scan_type === 'email' ? <Mail /> : scan.label === 'phishing' ? <ShieldAlert /> : <ShieldCheck />}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-lg text-slate-200 truncate max-w-xs md:max-w-md" title={scan.url}>{scan.url || 'Email Analysis'}</h4>
                  <p className="text-sm text-slate-400">{scan.scanned_at ? new Date(scan.scanned_at).toLocaleString() : 'Unknown Time'}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  scan.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                  scan.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  scan.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {scan.risk_level || 'Unknown'} Risk
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
