import React, { useState } from 'react';
import { scanUrl } from '../api/phishApi';
import { Activity, Globe, Lock, Cpu, Server, FileDigit, HelpCircle, Download, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import ThreatGauge from './ThreatGauge';
import { generatePDFReport } from '../utils/pdfGenerator';

const URLScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await scanUrl(url);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to scan URL. Please try again.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    await generatePDFReport('report-container', 'PhishGuard-Forensic-Report');
    setGeneratingPDF(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Activity className="text-blue-400" />
          URL Threat Intelligence
        </h2>
        
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-grow relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.example.com"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 min-w-[160px]"
          >
            {loading ? 'Analyzing...' : 'Analyze URL'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-400 font-semibold relative z-10">{error}</p>}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {result && (
        <motion.div 
          id="report-container"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="space-y-6"
        >
          {/* Header & Download Button */}
          <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800">
             <h3 className="text-xl font-semibold text-slate-300">Forensic Analysis Report</h3>
             <button 
                onClick={handleDownloadPDF} 
                disabled={generatingPDF}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
             >
                <Download size={16} />
                {generatingPDF ? 'Generating...' : 'Export PDF Report'}
             </button>
          </div>

          {/* Primary Assessment Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${result.label === 'phishing' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <ThreatGauge 
                score={result.threat_score} 
                isThreat={result.label === 'phishing'} 
              />
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-4xl font-black mb-2 uppercase tracking-tight">
                  {result.label === 'phishing' ? (
                    <span className="text-red-500">Critical Threat</span>
                  ) : (
                    <span className="text-emerald-500">Benign URL</span>
                  )}
                </h3>
                <p className="text-slate-400 text-lg mb-4 break-all font-mono bg-slate-900/50 p-2 rounded">{url}</p>
                <div className="inline-block bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-inner">
                  <p className="font-semibold text-indigo-300 mb-1">AI Recommendation:</p>
                  <p className="text-slate-300">{result.recommendation}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Sandbox Preview */}
            <motion.div variants={itemVariants} className="glass-panel p-6">
               <h4 className="text-xl font-semibold mb-6 flex items-center gap-2 text-pink-400 border-b border-slate-700/50 pb-3">
                 <Camera size={20} />
                 Visual Sandbox (Screenshot)
               </h4>
               <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700 min-h-[250px] flex items-center justify-center relative">
                  <img 
                     src={`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=image.url`}
                     alt="Website Sandbox Preview"
                     className="w-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                     onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                  <div className="text-slate-500 text-sm hidden">Screenshot unavailable or protected</div>
               </div>
            </motion.div>

            {/* VirusTotal Intel */}
            {result.vt_stats && !result.vt_stats.error ? (
              <motion.div variants={itemVariants} className="glass-panel p-6">
                 <h4 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-400 border-b border-slate-700/50 pb-3">
                   <Activity size={20} />
                   Global Threat Intel (VirusTotal)
                 </h4>
                 <div className="grid grid-cols-2 gap-4 text-center mt-8">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                      <div className="text-4xl font-black text-red-500">{result.vt_stats.malicious || 0}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest mt-2">Malicious</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                      <div className="text-4xl font-black text-emerald-400">{result.vt_stats.harmless || 0}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest mt-2">Harmless</div>
                    </div>
                 </div>
              </motion.div>
            ) : (
               <motion.div variants={itemVariants} className="glass-panel p-6 flex flex-col items-center justify-center text-slate-500">
                  <Activity size={32} className="mb-2 opacity-50" />
                  <p>VirusTotal Data Unavailable</p>
               </motion.div>
            )}

            {/* Network & OSINT Intelligence */}
            {result.osint && !result.osint.error && (
              <motion.div variants={itemVariants} className="glass-panel p-6 lg:col-span-2">
                 <h4 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400 border-b border-slate-700/50 pb-3">
                   <Server size={20} />
                   Network & OSINT Intelligence
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h5 className="text-sm uppercase tracking-widest text-slate-500 mb-3">DNS Records</h5>
                       <div className="space-y-3">
                          <div>
                             <span className="text-xs text-indigo-400 font-bold block mb-1">A RECORDS (IP)</span>
                             {result.osint.dns.A && result.osint.dns.A.length > 0 
                               ? result.osint.dns.A.map((ip, i) => <div key={i} className="font-mono text-sm bg-slate-900 px-3 py-1 rounded inline-block mr-2 mb-2 border border-slate-700 text-slate-300">{ip}</div>)
                               : <span className="text-sm text-slate-500">None found</span>}
                          </div>
                          <div>
                             <span className="text-xs text-indigo-400 font-bold block mb-1">MX RECORDS (MAIL)</span>
                             {result.osint.dns.MX && result.osint.dns.MX.length > 0 
                               ? result.osint.dns.MX.map((mx, i) => <div key={i} className="font-mono text-sm bg-slate-900 px-3 py-1 rounded inline-block mr-2 mb-2 border border-slate-700 text-slate-300 truncate max-w-[200px]" title={mx}>{mx}</div>)
                               : <span className="text-sm text-slate-500">None found</span>}
                          </div>
                       </div>
                    </div>
                    <div>
                       <h5 className="text-sm uppercase tracking-widest text-slate-500 mb-3">WHOIS Data</h5>
                       <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 space-y-2">
                          <div className="flex justify-between border-b border-slate-700/50 pb-1">
                             <span className="text-slate-400 text-sm">Registrar</span>
                             <span className="text-slate-200 font-semibold text-sm">{result.osint.whois.registrar || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-700/50 pb-1">
                             <span className="text-slate-400 text-sm">Country</span>
                             <span className="text-slate-200 font-semibold text-sm">{result.osint.whois.country || 'Unknown'}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-slate-400 text-sm">Creation Date</span>
                             <span className="text-slate-200 font-semibold text-sm truncate max-w-[150px]">{result.osint.whois.creation_date || 'Unknown'}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

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
