
import React, { useState } from 'react';
import { Activity, Thermometer, ArrowRight, Server, AlertTriangle } from 'lucide-react';
import { GPUData } from '../types';

interface DashboardHubProps {
  fleet: GPUData[];
  onSelectGPU: (gpu: GPUData) => void;
  searchQuery: string;
}

const DashboardHub: React.FC<DashboardHubProps> = ({ fleet, onSelectGPU, searchQuery }) => {
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);

  // Adjusted Logic: Only flag as "At Risk" if Health is critical (< 80) or uncorrected errors exist.
  // This reduces the count in the mock data to approx 2 items.
  const isAtRisk = (gpu: GPUData) => {
    return gpu.healthScore < 80 || gpu.hbmEccUncorrectedErrors > 0;
  };

  const activeAssets = fleet.filter(g => g.status === 'active').length;
  const avgHealth = Math.round(fleet.reduce((acc, g) => acc + g.healthScore, 0) / fleet.length);
  const atRiskCount = fleet.filter(isAtRisk).length;

  // Filter Logic
  const filteredFleet = fleet.filter(gpu => {
    // 1. Search Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      gpu.model.toLowerCase().includes(query) || 
      gpu.id.toLowerCase().includes(query) ||
      gpu.serialNumber.toLowerCase().includes(query) ||
      gpu.manufacturer.toLowerCase().includes(query);

    // 2. Risk Filter
    const matchesRisk = showAtRiskOnly ? isAtRisk(gpu) : true;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 animate-in fade-in duration-500">
      
      {/* Overview Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Assets</div>
          <div className="text-3xl font-black text-white">{fleet.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Active Nodes</div>
          <div className="text-3xl font-black text-white">{activeAssets}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Avg Health</div>
          <div className="text-3xl font-black text-white">{avgHealth}%</div>
        </div>
        
        {/* At Risk Button (Replaced Lifecycle Savings) */}
        <button 
          onClick={() => setShowAtRiskOnly(!showAtRiskOnly)}
          className={`relative p-4 rounded-2xl border transition-all text-left group overflow-hidden ${
            showAtRiskOnly 
              ? 'bg-red-500/10 border-red-500 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
              : 'bg-zinc-900 border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`text-[10px] font-black uppercase tracking-widest ${showAtRiskOnly ? 'text-red-400' : 'text-zinc-500 group-hover:text-red-400'}`}>
              Critical Attention
            </div>
            <AlertTriangle className={`w-3 h-3 ${showAtRiskOnly ? 'text-red-500 animate-pulse' : 'text-zinc-600 group-hover:text-red-500'}`} />
          </div>
          <div className={`text-3xl font-black ${showAtRiskOnly ? 'text-red-500' : 'text-white'}`}>
             {atRiskCount} <span className="text-sm text-zinc-500 font-bold">Risk</span>
          </div>
        </button>
      </section>

      {/* Fleet Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />
            {showAtRiskOnly ? 'At-Risk Assets' : 'Fleet Overview'}
          </h2>
        </div>

        {filteredFleet.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
             <div className="text-zinc-500 font-bold">No assets found matching criteria.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFleet.map((gpu) => (
              <button 
                key={gpu.id}
                onClick={() => onSelectGPU(gpu)}
                className="group relative bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-emerald-500/40 hover:bg-zinc-800/50 transition-all text-left overflow-hidden shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-zinc-800">
                    <img src={gpu.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={gpu.model} />
                  </div>
                  <div className="flex flex-col items-end">
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${gpu.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                        {gpu.status}
                     </div>
                     <div className="text-[9px] font-mono text-zinc-600 mt-1 uppercase tracking-tighter">{gpu.id}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">{gpu.manufacturer} ENGINEERING</div>
                  <h3 className="text-lg font-black text-white leading-tight truncate group-hover:text-emerald-400 transition-colors">{gpu.model}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center gap-1 mb-1">
                      <Thermometer className="w-3 h-3 text-orange-400" />
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">Avg Temp</span>
                    </div>
                    <div className="text-xs font-black text-zinc-200">{gpu.avgTempCelsius}°C</div>
                  </div>
                  <div className={`bg-zinc-950 p-2 rounded-lg border ${isAtRisk(gpu) ? 'border-red-900/50 bg-red-950/10' : 'border-zinc-800/50'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className={`w-3 h-3 ${isAtRisk(gpu) ? 'text-red-500' : 'text-emerald-400'}`} />
                      <span className="text-[8px] font-bold text-zinc-500 uppercase">Health</span>
                    </div>
                    <div className={`text-xs font-black ${isAtRisk(gpu) ? 'text-red-400' : 'text-zinc-200'}`}>{gpu.healthScore}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono pt-4 border-t border-zinc-800/50">
                  <span className="text-zinc-600 uppercase tracking-widest">Serial: {gpu.serialNumber.split('-').pop()}</span>
                  <span className="text-emerald-500 font-black flex items-center gap-1">
                    VIEW PASS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardHub;
