
import React from 'react';
import { Cpu, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
  onQuickScan: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter, onQuickScan }) => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-2xl w-full z-10 text-center space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mb-6 shadow-2xl shadow-emerald-500/20 ring-1 ring-white/10 animate-pulse">
            <Cpu className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-white tracking-tighter sm:text-7xl">GPU Pass</h1>
            <p className="text-zinc-500 text-lg uppercase tracking-[0.2em] font-bold">
              Infrastructure Traceability Engine
            </p>
          </div>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            Reducing global e-waste through transparent digital passports for enterprise compute hardware.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onEnter}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all group shadow-2xl"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={onQuickScan}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
          >
            Quick Audit Scan
          </button>
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
           <div className="space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <div className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">Verified History</div>
              <p className="text-[10px] text-zinc-500 leading-tight">Every owner and repair recorded on an immutable ledger.</p>
           </div>
           <div className="space-y-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">Real-time Telemetry</div>
              <p className="text-[10px] text-zinc-500 leading-tight">Deep hardware insight from silicon stress to VRM health.</p>
           </div>
           <div className="space-y-2">
              <Zap className="w-5 h-5 text-cyan-500" />
              <div className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">E-Waste Reduction</div>
              <p className="text-[10px] text-zinc-500 leading-tight">Enabling second-life markets with certified health scores.</p>
           </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
        v1.2.0 • Decentralized Hardware Registry
      </div>
    </div>
  );
};

export default Landing;
