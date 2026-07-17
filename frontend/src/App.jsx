import React, { useState } from 'react';
import URLScanner from './components/URLScanner';
import EmailScanner from './components/EmailScanner';

function App() {
  const [activeTab, setActiveTab] = useState('url');

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 p-8">
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            PhishGuard
          </h1>
          <p className="text-slate-400 mt-2">ML-Powered Phishing Detection System</p>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto mb-4 flex gap-4 border-b border-slate-700 pb-2">
        <button 
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 font-semibold text-lg transition-colors ${activeTab === 'url' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          URL Scanner
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 font-semibold text-lg transition-colors ${activeTab === 'email' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Email Analyzer
        </button>
      </div>

      <main>
        {activeTab === 'url' ? <URLScanner /> : <EmailScanner />}
      </main>
    </div>
  );
}

export default App;
