import React from 'react';
import URLScanner from './components/URLScanner';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 p-8">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            PhishGuard
          </h1>
          <p className="text-slate-400 mt-2">ML-Powered Phishing Detection System</p>
        </div>
      </header>
      
      <main>
        <URLScanner />
      </main>
    </div>
  );
}

export default App;
