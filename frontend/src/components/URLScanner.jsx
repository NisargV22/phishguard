import React, { useState } from 'react';
import { scanUrl } from '../api/phishApi';
import { Activity, Globe, Lock, Cpu, Server, FileDigit, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreatGauge from './ThreatGauge';
import RadarSpinner from './RadarSpinner';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="glass-panel p-8 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 relative z-10">
          <Activity className="text-blue-400" />
          URL Threat Intelligence
        </h2>
        
        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 disabled:shadow-none cursor-pointer flex items-center justify-center min-w-[160px]"
          >
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <RadarSpinner />
          <p className="mt-8 text-indigo-400 animate-pulse font-mono">Running ML heuristics & network checks...</p>
        </div>
      )}

      {result && !loading && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-8"
        >
          {/* Top Overview Panel */}
          <motion.div variants={itemVariants} className="glass-panel p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
               <h3 className="text-3xl font-bold mb-2">
                 Status: <span className={result.label === 'phishing' ? 'text-red-500' : 'text-emerald-400 capitalize'}>
                   {result.label.toUpperCase()}
                 </span>
               </h3>
               <p className="text-slate-400 text-lg mb-4">{result.recommendation}</p>
               <div className="flex gap-4">
                  <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </span>
                  <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
                    Mitre Tactic: {result.mitre_technique}
                  </span>
               </div>
            </div>
            <div className="flex-shrink-0">
               <ThreatGauge score={result.threat_score} />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Extract Breakdown */}
            <motion.div variants={itemVariants} className="glass-panel p-6">
               <h4 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-300 border-b border-slate-700/50 pb-3">
                 <Server size={20} />
                 Network & Domain Intelligence
               </h4>
               <ul className="space-y-4 font-mono text-sm">
                  <li className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2"><Globe size={16}/> Domain Age</span>
                    <span className={result.features?.domain_age_days > 365 ? 'text-emerald-400' : result.features?.domain_age_days > 0 ? 'text-yellow-400' : 'text-slate-500'}>
                      {result.features?.domain_age_days > 0 ? `${result.features.domain_age_days} days` : 'Unknown'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2"><FileDigit size={16}/> Mail Exchange (MX)</span>
                    <span className={result.features?.has_mx === 1 ? 'text-emerald-400' : 'text-yellow-400'}>
                      {result.features?.has_mx === 1 ? 'Present' : 'Missing'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2"><Lock size={16}/> HTTPS Secure</span>
                    <span className={result.features?.has_https === 1 ? 'text-emerald-400' : 'text-red-400'}>
                      {result.features?.has_https === 1 ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2"><Activity size={16}/> Redirects</span>
                    <span className="text-slate-200">{result.features?.num_redirects}</span>
                  </li>
               </ul>
            </motion.div>
            
            {/* Explainable AI */}
            <motion.div variants={itemVariants} className="glass-panel p-6">
               <h4 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-300 border-b border-slate-700/50 pb-3">
                 <Cpu size={20} />
                 Explainable AI (XAI) Weights
               </h4>
               <div className="space-y-5">
                 {result.explanation?.top_factors?.map((factor, idx) => (
                   <div key={idx} className="relative group">
                     <div className="flex justify-between text-xs mb-1">
                       <span className="text-slate-300 flex items-center gap-1 cursor-help">
                         {factor.feature.replace(/_/g, ' ')}
                         <HelpCircle size={12} className="text-slate-500" />
                       </span>
                       <span className="font-mono text-slate-400">
                         {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(2)}
                       </span>
                     </div>
                     <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min(Math.abs(factor.contribution) * 150, 100)}%` }}
                         className={`h-full ${factor.direction === 'phishing' ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                       />
                     </div>
                     {/* Tooltip */}
                     <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-8 left-0 bg-slate-800 text-xs text-white px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                        {factor.direction === 'phishing' ? 'Pushes score toward phishing' : 'Pushes score toward benign'}
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default URLScanner;
