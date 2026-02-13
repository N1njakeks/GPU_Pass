
import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, ShieldCheck, ArrowRight, Tag, Cpu, Info } from 'lucide-react';
import { MOCK_GPUS } from '../constants';
import { GPUData } from '../types';

interface MarketplaceProps {
  onSelectGPU: (gpu: GPUData) => void;
  onSellGPU: () => void;
  onBack: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onSelectGPU, onSellGPU, onBack }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGPUs = MOCK_GPUS.filter(gpu => {
    const matchesSearch = gpu.model.toLowerCase().includes(search.toLowerCase()) || 
                          gpu.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterCategory === 'all' || gpu.secondLifeCategory === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Marketplace Header */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
              <Cpu className="w-5 h-5 text-emerald-500" />
              <span className="font-bold tracking-tight">EcoTrace</span>
            </button>
            <div className="h-6 w-px bg-zinc-800 hidden md:block"></div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] hidden md:block">Verified Marketplace</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onSellGPU}
              className="px-4 py-2 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              <Tag className="w-3.5 h-3.5" />
              SELL ASSET
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in pb-20">
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search series or manufacturer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
           </div>
           
           <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {['all', 'A_training_ready', 'B_inference_and_light_training', 'C_inference_only'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${filterCategory === cat ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'}`}
                >
                  {cat.replace(/_/g, ' ').replace('all', 'Show All')}
                </button>
              ))}
           </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredGPUs.map(gpu => (
             <div 
               key={gpu.id}
               className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col"
             >
                {/* Image Container */}
                <div className="aspect-video relative overflow-hidden bg-zinc-950">
                  <img 
                    src={gpu.imageUrl} 
                    alt={gpu.model}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-emerald-500/90 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Verified Passport
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg text-center">
                       <div className="text-[10px] font-bold text-emerald-400 leading-none">{gpu.healthScore}</div>
                       <div className="text-[7px] text-zinc-400 uppercase tracking-tighter">Health</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col">
                  <div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{gpu.manufacturer}</div>
                    <h3 className="text-lg font-black text-white leading-tight group-hover:text-emerald-400 transition-colors">{gpu.model}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                      <div className="text-[7px] text-zinc-500 uppercase font-bold mb-0.5">Category</div>
                      <div className="text-[9px] font-bold text-zinc-200 uppercase truncate">
                        {gpu.secondLifeCategory.split('_')[0]} GRADE
                      </div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                      <div className="text-[7px] text-zinc-500 uppercase font-bold mb-0.5">Uptime</div>
                      <div className="text-[9px] font-bold text-zinc-200 uppercase">30,780h</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-auto">
                    <div>
                       <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Buy Now</div>
                       {/* Correctly accessing priceUsd from GPUData */}
                       <div className="text-xl font-black text-white">${gpu.priceUsd.toLocaleString()}</div>
                    </div>
                    <button 
                      onClick={() => onSelectGPU(gpu)}
                      className="p-3 bg-zinc-800 text-white rounded-xl hover:bg-emerald-500 hover:text-black transition-all group/btn"
                    >
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
             </div>
           ))}
        </div>

        {filteredGPUs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <ShoppingBag className="w-12 h-12 text-zinc-800" />
             <div className="space-y-1">
                <h3 className="text-xl font-bold text-zinc-300">No assets found</h3>
                <p className="text-zinc-500 max-w-xs">Try adjusting your filters or search terms for verified hardware.</p>
             </div>
          </div>
        )}

      </main>

      {/* Footer / CTA */}
      <footer className="bg-zinc-900 border-t border-zinc-800 p-12 mt-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
               <h4 className="text-lg font-bold">Why buy verified?</h4>
               <p className="text-sm text-zinc-500 max-w-md">
                 EcoTrace ensures that every GPU listed has a transparent digital history, verifying thermal stress, HBM integrity, and ownership chain.
               </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Transparency First
               </div>
               <div className="h-4 w-px bg-zinc-800"></div>
               <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  <Info className="w-4 h-4 text-blue-400" />
                  Carbon Verified
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Marketplace;
