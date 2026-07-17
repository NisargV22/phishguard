import React, { useState } from 'react';
import URLScanner from './components/URLScanner';
import EmailScanner from './components/EmailScanner';
import History from './components/History';
import { Shield, Globe, Mail, Clock } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('url');

  const navItems = [
    { id: 'url', label: 'URL Scanner', icon: Globe },
    { id: 'email', label: 'Email Analyzer', icon: Mail },
    { id: 'history', label: 'Scan History', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-slate-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-slate-800/50 p-6 flex flex-col z-20 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              PhishGuard
            </h1>
            <p className="text-xs text-indigo-400 font-mono mt-1 font-semibold tracking-wider">ENTERPRISE EDITION</p>
          </div>
        </div>

        <ul className="space-y-2 relative z-10 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto relative z-10 text-xs text-slate-600 font-mono text-center pt-8 border-t border-slate-800/50">
          Powered by Deep Learning<br/>
          v2.0.0-rc1
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto h-screen">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        </div>
        
        <div className="relative z-10 p-6 md:p-10 w-full h-full">
          {activeTab === 'url' && <URLScanner />}
          {activeTab === 'email' && <EmailScanner />}
          {activeTab === 'history' && <History />}
        </div>
      </main>
    </div>
  );
}

export default App;
