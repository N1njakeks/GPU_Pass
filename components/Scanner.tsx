
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ScanLine } from 'lucide-react';
import jsQR from 'jsqr';
import { MOCK_GPUS } from '../constants';

interface ScannerProps {
  onScan: (id: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API not supported in this browser. Please use HTTPS.");
      return;
    }

    try {
      // Request camera with constraints optimized for mobile performance (720p ideal)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready before scanning
        try {
          await videoRef.current.play();
        } catch (e) {
          console.error("Video play failed:", e);
        }
        
        requestRef.current = requestAnimationFrame(tick);
        setIsCameraActive(true);
      }
      setError(null);
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      setError("Camera access denied. Please ensure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setIsCameraActive(false);
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Synchronize canvas size with video stream size
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        
        // Draw current video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Extract image data for QR processing
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Attempt to find QR code
        // 'attemptBoth' tries to find both standard and inverted QR codes
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });

        if (code) {
          console.log("Found QR Code:", code.data);
          let scannedId = code.data;

          // If the QR code is a URL (e.g., https://gpupass.vercel.app?id=...), extract the ID
          if (scannedId.startsWith('http')) {
            try {
              const url = new URL(scannedId);
              const idParam = url.searchParams.get('id');
              if (idParam) {
                scannedId = idParam;
              }
            } catch (e) {
              console.warn("Could not parse QR URL:", e);
            }
          }
          
          // Check if it's one of our known IDs (simple validation)
          if (MOCK_GPUS.some(g => g.id === scannedId)) {
            stopCamera();
            onScan(scannedId);
            return;
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-zinc-800/50 backdrop-blur-md absolute top-0 w-full z-10">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-emerald-500" />
            Scan Asset Tag
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative h-[500px] w-full bg-black flex items-center justify-center overflow-hidden">
          {/* Hidden Canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          <video 
            ref={videoRef} 
            muted
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {!isCameraActive && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-zinc-900/80 p-6 text-center">
               <Camera className="w-12 h-12 mb-2 opacity-50 text-white" />
               <p className="text-sm text-zinc-300">{error || "Initializing Camera..."}</p>
             </div>
          )}
          
          {/* Scanning Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-64 h-64 border-2 border-emerald-500/50 rounded-lg relative">
               <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
               <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>
               <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
            </div>
          </div>
          
          <div className="absolute bottom-4 text-xs text-white/90 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm z-10">
            Point camera at the GPU QR Code
          </div>
        </div>

      </div>
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-120px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(120px); }
        }
        .animate-scan {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
