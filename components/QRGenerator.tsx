
import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { MOCK_GPUS } from '../constants';

interface QRGeneratorProps {
  onBack: () => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onBack }) => {
  
  const handlePrint = () => {
    window.print();
  };

  const BASE_URL = "https://gpupass.vercel.app";

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Codes</span>
          </button>
        </div>

        <div className="space-y-4 mb-8">
            <h1 className="text-2xl font-bold tracking-tight">GPU Pass Asset Tags</h1>
            <p className="text-zinc-400">
                Attach these codes to high-value hardware. 
                Scanning with a phone camera opens the verified digital passport.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
          {MOCK_GPUS.map((gpu) => {
            // Encode the full URL so native phone cameras open the app directly
            const qrValue = `${BASE_URL}?id=${gpu.id}`;
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}`;

            return (
              <div key={gpu.id} className="bg-white text-black p-6 rounded-xl border border-zinc-700 shadow-xl flex flex-row items-center gap-6 print:break-inside-avoid print:border-2 print:border-black">
                {/* QR Code */}
                <div className="bg-white p-2 border-2 border-black rounded-lg shrink-0">
                    <img 
                      src={qrImageUrl}
                      alt={`QR Code for ${gpu.model}`}
                      className="w-32 h-32"
                    />
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                     <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider">Pass Verified</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{gpu.model}</h3>
                  <div className="text-sm text-zinc-600 font-mono space-y-0.5">
                      <p><span className="font-bold">Manufacturer:</span> {gpu.manufacturer}</p>
                      <p><span className="font-bold">Serial:</span> {gpu.serialNumber}</p>
                      <p><span className="font-bold">Mfg Year:</span> {gpu.productionYear}</p>
                      <p><span className="font-bold">Type:</span> {gpu.formFactor}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 mt-2">
                     <p className="text-[10px] text-zinc-400 uppercase font-bold">Immutable Lifecycle Ledger</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
