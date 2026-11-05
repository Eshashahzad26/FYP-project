import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  RefreshCw,
  Layers,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../../database/types.ts';

export const LiveWebcamTryOn: React.FC = () => {
  const { products, activeProductForTryOn, setCurrentView, showToast } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    activeProductForTryOn || products[0]
  );
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setStreamActive(true);
        }
      } catch (err: any) {
        setCameraError('Webcam access was not granted or is not available. Falling back to photo try-on.');
      }
    };

    initWebcam();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eed4e0] pb-4">
        <div>
          <button
            onClick={() => setCurrentView('live-me')}
            className="text-xs text-[#903458] font-bold flex items-center gap-1 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live Me Studio</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Live Interactive Webcam Try-On (FE-8)</span>
            <span className="text-xs bg-[#faedf2] text-[#903458] font-mono px-2 py-0.5 rounded-full border border-[#eed4e0]">
              Real-Time Feed
            </span>
          </h1>
        </div>
      </div>

      {cameraError ? (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-8 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-amber-900">
            Webcam Feed Unavailable
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            {cameraError} Per FR-8.7, you can use our high-fidelity photo-based virtual try-on module.
          </p>
          <button
            onClick={() => setCurrentView('live-me')}
            className="px-6 py-2.5 rounded-full bg-[#903458] text-white text-xs font-bold hover:bg-[#782847]"
          >
            Go to Photo Try-On
          </button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-[#eed4e0] p-6 shadow-sm space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-[#903458]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            {/* Simulated Live AR Overlay Mask */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-64 h-80 opacity-70">
                <img
                  src={selectedProduct.images[0]}
                  alt="Garment Overlay"
                  className="w-full h-full object-contain filter drop-shadow-xl"
                />
              </div>
            </div>

            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>LIVE WEBCAM AR</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs flex items-center justify-between">
              <span>Trying on: <strong>{selectedProduct.brand} {selectedProduct.name}</strong></span>
              <button
                onClick={() => setCurrentView('live-me')}
                className="px-3 py-1 bg-white text-stone-900 rounded-lg text-xs font-bold hover:bg-stone-100"
              >
                Snapshot & Render IDM-VTON
              </button>
            </div>
          </div>

          {/* Garment Selector Strip */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-stone-700 block">Switch Live Outfit:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                    selectedProduct.id === p.id ? 'border-[#903458] bg-[#faedf2]' : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#903458] uppercase">{p.brand}</p>
                    <p className="font-semibold text-xs text-stone-900 truncate">{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
