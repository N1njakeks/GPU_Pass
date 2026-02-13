
import React from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Thermometer, 
  Zap, 
  FileCheck, 
  Activity,
  History,
  Wind,
  Circle,
  Database,
  TrendingUp,
  Box,
  Cpu,
  AlertOctagon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { GPUData } from '../types';

interface DashboardProps {
  gpu: GPUData;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ gpu, onBack }) => {
  const totalCarbon = gpu.carbonMetrics.reduce((sum, m) => sum + m.kgCo2, 0);
  
  // Calculate derived metrics
  const totalUptimeHours = gpu.totalTimeInServiceMonths * 730; // Approx 730 hours per month
  const netLifeRemaining = Math.max(0, gpu.estimatedLifespanHours - gpu.fullLoadHours);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'active': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'ACTIVE' };
      case 'standby': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'STANDBY' };
      default: return { color: 'text-zinc-500', bg: 'bg-zinc-800/50', border: 'border-zinc-700', label: 'DECOMMISSIONED' };
    }
  };

  const statusCfg = getStatusConfig(gpu.status);

  // Prepare Pie Chart Data
  const workloadData = [
    { name: 'Training', value: gpu.workloadSplit.trainingPercent, color: '#10b981' }, // Emerald-500
    { name: 'Inference', value: gpu.workloadSplit.inferencePercent, color: '#3b82f6' }, // Blue-500
    { name: 'Idle / Other', value: gpu.workloadSplit.idlePercent, color: '#71717a' }, // Zinc-500
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 animate-in fade-in duration-500">
      
      {/* Navbar Overlay Space */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black text-[10px] uppercase tracking-widest">Back to Fleet</span>
        </button>
        <div className="flex items-center gap-2 text-emerald-500">
           <ShieldCheck className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-widest">Pass Verified</span>
        </div>
      </div>

      <main className="space-y-6">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-4 right-6 text-[9px] font-mono text-zinc-700 uppercase tracking-tighter opacity-60">
              ID: {gpu.id}
            </div>
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] font-black rounded border border-zinc-700 uppercase tracking-widest">
                  {gpu.formFactor} ARCH
                </span>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color} text-[8px] font-black tracking-widest uppercase`}>
                  <Circle className={`w-1.5 h-1.5 fill-current ${gpu.status === 'active' ? 'animate-pulse' : ''}`} />
                  {statusCfg.label}
                </div>
              </div>
              <div className="mb-8">
                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">{gpu.manufacturer} ENGINEERING</div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{gpu.model}</h1>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-zinc-800/50 pt-8">
                <div>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-black">Serial Number</div>
                  <div className="font-mono text-[10px] text-zinc-300 truncate">{gpu.serialNumber}</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-black">MFG Year</div>
                  <div className="text-xs font-black text-zinc-300">{gpu.productionYear}</div>
                </div>
                <div>
                   <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-black">Total Service</div>
                   <div className="text-xs font-black text-zinc-300">{gpu.totalTimeInServiceMonths} Months</div>
                </div>
                <div>
                   <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1 font-black">Asset Status</div>
                   <div className="text-xs font-black text-emerald-400">CERTIFIED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Score Circle */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
             <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Health Grade</h3>
             <div className="relative mb-6 flex items-center justify-center w-32 h-32">
               <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 160 160">
                 <circle cx="80" cy="80" r="65" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-zinc-800" />
                 <circle cx="80" cy="80" r="65" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={408} strokeDashoffset={408 - (408 * gpu.healthScore) / 100} strokeLinecap="round" className={`${gpu.healthScore > 80 ? 'text-emerald-500' : 'text-yellow-500'} transition-all duration-1000`} />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-white">{gpu.healthScore}</span>
               </div>
             </div>
             <div className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-[0.15em]">
               {gpu.secondLifeCategory.replace(/_/g, ' ')}
             </div>
          </div>
        </div>

        {/* Row 2: Workload Context & System Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Workload Context (Pie Chart) - REFACTORED */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
             <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest mb-6">
               <PieChartIcon className="w-4 h-4 text-purple-400" /> Usage Context
             </h3>
             <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
                {/* Chart */}
                <div className="w-48 h-48 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workloadData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {workloadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#18181b" strokeWidth={3} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#e4e4e7' }} 
                        cursor={false}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Load</span>
                     <span className="text-xl font-black text-white">{gpu.avgGpuUtilizationPercent}%</span>
                  </div>
                </div>
                
                {/* Legend - Grid Layout for better visibility */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {workloadData.map((item) => (
                     <div key={item.name} className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: item.color }}></div>
                           <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide truncate max-w-[80px]">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-white">{item.value}%</span>
                     </div>
                   ))}
                   <div className="bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 flex flex-col justify-center items-start sm:col-span-2 sm:flex-row sm:justify-between sm:items-center">
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Typical Job</span>
                       <span className="text-xs font-black text-zinc-200 mt-1 sm:mt-0">{gpu.typicalJobDuration}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* System & Configuration */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
              <Cpu className="w-4 h-4 text-white" /> System & Config
            </h3>
            
            <div className="space-y-4">
               <div>
                  <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Firmware Version</div>
                  <div className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded w-fit">
                    {gpu.firmwareVersion}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">BIOS Status</div>
                    <div className={`text-xs font-bold ${gpu.firmwareModified ? 'text-amber-400' : 'text-zinc-300'}`}>
                       {gpu.firmwareModified ? 'Modified' : 'Stock / Locked'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 font-black uppercase mb-1 flex items-center gap-1">
                      Driver Resets <AlertOctagon className="w-3 h-3 text-zinc-600" />
                    </div>
                    <div className={`text-xs font-black ${gpu.driverResetEvents > 5 ? 'text-red-400' : 'text-zinc-300'}`}>
                       {gpu.driverResetEvents} Events
                    </div>
                  </div>
               </div>

               <div className="pt-2 border-t border-zinc-800">
                  <div className="flex justify-between items-center text-[9px] text-zinc-500">
                     <span className="uppercase font-bold">Config Profile</span>
                     <span>{gpu.undervoltedOrOverclocked ? 'Custom Tuned' : 'Factory Standard'}</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Row 3: Technical Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Section: Wear Profile */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-emerald-400" /> Operational Stress
            </h3>
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Full Load Time</div>
                <div className="text-2xl font-black text-emerald-400">{gpu.fullLoadHours.toLocaleString()}h</div>
              </div>
              <div className="space-y-3 pt-2 px-1">
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-zinc-800/50 pb-2">
                  <span className="text-zinc-500 uppercase font-bold">Total Uptime</span>
                  <span className="text-zinc-300 font-bold">{totalUptimeHours.toLocaleString()}h</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-zinc-800/50 pb-2">
                  <span className="text-zinc-500 uppercase font-bold">Est. Max Life</span>
                  <span className="text-zinc-300 font-bold">{gpu.estimatedLifespanHours.toLocaleString()}h</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                  <span className="text-zinc-500 uppercase font-bold">Net Life Remaining</span>
                  <span className="text-emerald-400 font-black">{netLifeRemaining.toLocaleString()}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Thermal Profile */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
              <Thermometer className="w-4 h-4 text-orange-400" /> Thermal Profile
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Avg Temp</div>
                <div className="text-xl font-black text-zinc-200">{gpu.avgTempCelsius}°C</div>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Peak Temp</div>
                <div className="text-xl font-black text-orange-500">{gpu.maxTempCelsius}°C</div>
              </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 flex justify-between items-center">
              <div className="text-[9px] text-zinc-500 font-black uppercase">Throttling Events</div>
              <div className="text-xl font-black text-white">{gpu.throttlingEventsCount}</div>
            </div>
          </div>

          {/* Section: Power Profile */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-yellow-400" /> Power Efficiency
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Avg Power</div>
                <div className="text-xl font-black text-white">{gpu.avgPowerDrawWatts}W</div>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Peak Power</div>
                <div className="text-xl font-black text-orange-400">{gpu.peakPowerDrawWatts}W</div>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Avg Efficiency</div>
                  <div className="text-xl font-black text-white">{gpu.avgEfficiencyTflopsPerWatt} <span className="text-[10px] text-zinc-500 uppercase">Tf/W</span></div>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500/40" />
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(gpu.avgEfficiencyTflopsPerWatt / 25) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Section: Reliability */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
              <Database className="w-4 h-4 text-blue-400" /> Reliability Logs
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <span className="text-[9px] font-black text-zinc-500 uppercase">ECC Corrected</span>
                <span className="font-mono text-[10px] text-blue-400 font-bold">{gpu.hbmEccCorrectedErrors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <span className="text-[9px] font-black text-zinc-500 uppercase">ECC Uncorrected</span>
                <span className={`font-mono text-[10px] font-black ${gpu.hbmEccUncorrectedErrors > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {gpu.hbmEccUncorrectedErrors}
                </span>
              </div>
            </div>
          </div>

          {/* Section: History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-zinc-100 font-black text-[10px] mb-6 flex items-center gap-2 uppercase tracking-widest">
              <History className="w-4 h-4 text-indigo-400" /> Ownership Trail
            </h3>
            <div className="relative pl-6 space-y-6">
              <div className="absolute left-1 top-0 bottom-0 w-px bg-zinc-800"></div>
              {gpu.ownerHistory.map((owner, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[1.35rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 flex items-center justify-center ${owner.endDate === 'current' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></div>
                  <div>
                    <div className="text-[9px] font-black text-zinc-300 uppercase leading-none">{owner.ownerType.replace('_', ' ')}</div>
                    <div className="text-[8px] text-zinc-500 font-mono mt-1">{owner.startDate} — {owner.endDate.toUpperCase()}</div>
                    <div className="text-[8px] text-indigo-400 font-black uppercase mt-0.5">{owner.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Carbon & Materials */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-zinc-100 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
               <Wind className="w-4 h-4 text-cyan-400" /> Environmental Audit
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Carbon */}
              <div>
                 <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Carbon Footprint</div>
                 <div className="text-3xl font-black text-white">{totalCarbon}</div>
                 <div className="text-[8px] text-zinc-500 font-bold uppercase mt-1">kg CO2e Total</div>
              </div>

              {/* Right: Materials */}
              <div className="space-y-2">
                 <div className="text-[9px] text-zinc-500 font-black uppercase mb-1 flex items-center gap-2">
                   <Box className="w-3 h-3" /> Material Composition
                 </div>
                 {/* Explicit List as requested */}
                 {gpu.materialComposition.length > 0 ? (
                   gpu.materialComposition.map((mat, i) => (
                    <div key={i} className="flex justify-between items-center text-[9px]">
                       <span className="text-zinc-300 font-bold uppercase">{mat.name}</span>
                       <span className="text-zinc-500 font-mono">{mat.percentage}%</span>
                    </div>
                   ))
                 ) : (
                    // Fallback visual if data is missing, to show layout
                   <>
                    <div className="flex justify-between items-center text-[9px]"><span className="text-zinc-300 font-bold uppercase">Silicon</span><span className="text-zinc-500 font-mono">--</span></div>
                    <div className="flex justify-between items-center text-[9px]"><span className="text-zinc-300 font-bold uppercase">Copper</span><span className="text-zinc-500 font-mono">--</span></div>
                   </>
                 )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
               <div className="text-[8px] text-zinc-500 leading-relaxed uppercase font-bold italic">
                 Asset verified as eligible for "Platinum Tier" secondary market carbon credits.
               </div>
            </div>
          </div>

        </div>

        {/* Section: Recommendations */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-zinc-100 font-black text-[10px] mb-6 flex items-center gap-2 uppercase tracking-widest">
            <FileCheck className="w-4 h-4 text-emerald-400" /> Strategic Second-Life Recovery
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {gpu.strategicRecommendations.map((rec, i) => (
               <div key={i} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
                 <div>
                   <span className="text-[10px] font-black text-white uppercase block mb-0.5">{rec.title}</span>
                   <p className="text-[9px] text-zinc-500 leading-tight italic max-w-xs">{rec.description}</p>
                 </div>
                 <div className="text-lg font-black text-emerald-500">{rec.suitability}%</div>
               </div>
             ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
