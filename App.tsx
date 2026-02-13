
import React, { useState, useEffect, useRef } from 'react';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';
import DashboardHub from './components/DashboardHub';
import QRGenerator from './components/QRGenerator';
import { MOCK_GPUS } from './constants';
import { GPUData } from './types';
import { User, LayoutGrid, Database, Settings, LogOut, ChevronDown, Activity, Search, X } from 'lucide-react';

enum View {
  HUB,
  SCANNER,
  DETAILS,
  QR_GENERATOR
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HUB);
  const [selectedGPU, setSelectedGPU] = useState<GPUData | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // The fleet shown in the hub
  const userFleet = MOCK_GPUS;

  // Deep linking support: Check for "id" param in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam) {
      const gpu = MOCK_GPUS.find(g => g.id === idParam);
      if (gpu) {
        setSelectedGPU(gpu);
        setCurrentView(View.DETAILS);
      }
    }
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleStartScan = () => setCurrentView(View.SCANNER);
  const handleViewCodes = () => setCurrentView(View.QR_GENERATOR);
  const handleGoToHub = () => {
    setCurrentView(View.HUB);
    setIsUserMenuOpen(false);
  };

  const handleScanComplete = (id: string) => {
    const gpu = MOCK_GPUS.find(g => g.id === id);
    if (gpu) {
      setSelectedGPU(gpu);
      setCurrentView(View.DETAILS);
    } else {
      alert("GPU ID not found.");
    }
  };

  const handleSelectGPU = (gpu: GPUData) => {
    setSelectedGPU(gpu);
    setCurrentView(View.DETAILS);
  };

  const handleBackToHub = () => {
    setCurrentView(View.HUB);
    setSelectedGPU(null);
  };

  return (
    <div className="antialiased text-zinc-100 bg-zinc-950 min-h-screen">
      
      {/* GLOBAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* MOBILE SEARCH OVERLAY MODE */}
        {isMobileSearchOpen ? (
           <div className="w-full flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative flex-1">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search className="h-4 w-4 text-emerald-500" />
                 </div>
                 <input
                   ref={searchInputRef}
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="block w-full pl-10 pr-3 py-2 border border-emerald-500/50 rounded-lg leading-5 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                   placeholder="Search ID, Model..."
                 />
              </div>
              <button 
                onClick={() => {
                   setIsMobileSearchOpen(false);
                   setSearchQuery('');
                }}
                className="text-sm font-bold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
           </div>
        ) : (
          /* STANDARD HEADER MODE */
          <>
            {/* Top Left: Fake Login Board / User Menu */}
            <div className="relative shrink-0">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 pr-3 rounded-full hover:bg-zinc-800 transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[9px] font-black text-white uppercase tracking-tighter leading-none">Operation Alpha</div>
                  <div className="text-[8px] text-zinc-500 font-bold uppercase leading-none mt-0.5">Fleet Admin</div>
                </div>
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-zinc-800 bg-zinc-950/50">
                    <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Infrastructure</div>
                    <button 
                      onClick={() => { alert("Initializing DCIM Sync..."); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors text-left"
                    >
                      <Database className="w-4 h-4" />
                      <span className="text-xs font-bold">Connect DCIM / CMDB</span>
                    </button>
                  </div>
                  <div className="p-2">
                    <button onClick={handleGoToHub} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-left">
                      <LayoutGrid className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs">Fleet Overview</span>
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-left">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs">Audit Logs</span>
                    </button>
                    <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-left">
                      <Settings className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs">Org Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-zinc-800">
                    <button onClick={() => window.location.reload()} className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-left">
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-bold">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Top Center: Logo (Mobile Hidden) & DESKTOP SEARCH BAR */}
            <div className="flex-1 flex items-center justify-center lg:justify-between px-4 max-w-2xl">
              <div className="hidden lg:flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px] text-zinc-500 shrink-0 mr-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  GPU Pass Registry
              </div>

              {/* SEARCH BAR - DESKTOP ONLY */}
              <div className="relative w-full max-w-md hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-1.5 border border-zinc-800 rounded-lg leading-5 bg-zinc-900 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-950 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 sm:text-xs font-medium transition-all"
                  placeholder="Search by ID, Model or Serial..."
                />
              </div>
            </div>

            {/* Top Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
               {/* MOBILE SEARCH TOGGLE BUTTON */}
               <button 
                 onClick={() => setIsMobileSearchOpen(true)}
                 className="md:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg"
               >
                 <Search className="w-4 h-4" />
               </button>

              <button 
                onClick={handleStartScan}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scan Pass</span>
                <span className="sm:hidden">Scan</span>
              </button>
              <button 
                onClick={handleViewCodes}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-zinc-700"
              >
                ID Codes
              </button>
            </div>
          </>
        )}
      </header>

      <main className="pt-20">
        {currentView === View.HUB && (
          <DashboardHub 
            fleet={userFleet}
            onSelectGPU={handleSelectGPU}
            searchQuery={searchQuery}
          />
        )}

        {currentView === View.SCANNER && (
          <Scanner 
            onScan={handleScanComplete} 
            onClose={handleBackToHub} 
          />
        )}

        {currentView === View.QR_GENERATOR && (
          <QRGenerator 
            onBack={handleBackToHub} 
          />
        )}

        {currentView === View.DETAILS && selectedGPU && (
          <Dashboard 
            gpu={selectedGPU} 
            onBack={handleBackToHub} 
          />
        )}
      </main>

      {/* Mobile Back Button for Sub-views */}
      {currentView === View.DETAILS && (
         <button 
           onClick={handleBackToHub}
           className="fixed bottom-6 right-6 z-50 sm:hidden bg-zinc-100 text-black p-4 rounded-full shadow-2xl"
         >
           <LayoutGrid className="w-6 h-6" />
         </button>
      )}
    </div>
  );
};

export default App;
