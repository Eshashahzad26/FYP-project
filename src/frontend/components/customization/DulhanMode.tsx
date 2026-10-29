import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  Check, 
  ArrowRight, 
  Scissors, 
  Layers,
  ChevronDown,
  Info,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product, DulhanWeddingPlan } from '../../../database/types.ts';
import { apiClient } from '../../../backend/apiClient.ts';

export const DulhanMode: React.FC = () => {
  const { products, user, setActiveProductForTryOn, setCurrentView, showToast } = useApp();

  const [role, setRole] = useState<'bride' | 'guest'>('bride');
  const [selectedEvents, setSelectedEvents] = useState<('Mehndi' | 'Barat' | 'Walima')[]>([
    'Mehndi', 'Barat', 'Walima'
  ]);
  const [budget, setBudget] = useState<number>(350000);
  const [includeStitchingCost, setIncludeStitchingCost] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Suggested event looks
  const [mehndiProduct, setMehndiProduct] = useState<Product>(
    products.find(p => p.occasion === 'Mehndi') || products[2]
  );
  const [baratProduct, setBaratProduct] = useState<Product>(
    products.find(p => p.occasion === 'Barat') || products[1]
  );
  const [walimaProduct, setWalimaProduct] = useState<Product>(
    products.find(p => p.occasion === 'Walima') || products[3]
  );

  const [replacingEvent, setReplacingEvent] = useState<'Mehndi' | 'Barat' | 'Walima' | null>(null);

  // Event details
  const eventDetails = {
    Mehndi: {
      colorTheme: 'Marigold Yellow & Emerald Green',
      tradition: 'Gotta patti accents, fresh flower jewelry, energetic festive dance vibes.',
      dupattaStyle: 'Crushed banarsi tissue dupatta pinned on left shoulder with floral tassels.',
      jewelry: 'Handcrafted floral kundan mathapatti and multi-colored glass bangles.',
      stitchingEstimate: 7500
    },
    Barat: {
      colorTheme: 'Crimson Red & Antique Gold',
      tradition: 'Timeless heirloom zardozi craftsmanship with heavy micro-velvet and pure dabka.',
      dupattaStyle: 'Regal double dupatta: Velvet heavy veil on head + sheer gold tissue on shoulder.',
      jewelry: 'Antique 22k gold Polki choker, bridal pearl nath, and traditional jhumar.',
      stitchingEstimate: 18000
    },
    Walima: {
      colorTheme: 'Sage Mint & Silver Champagne',
      tradition: 'Contemporary English pastels with French lace borders and crystal cut-dana work.',
      dupattaStyle: 'Elongated scalloped net train draped over the wrist with pearl pins.',
      jewelry: 'White gold diamond choker set with emerald drops.',
      stitchingEstimate: 12000
    }
  };

  // Calculate total costs (FR-6.11, FR-6.21)
  const baseOutfitsCost = (mehndiProduct?.price || 0) + (baratProduct?.price || 0) + (walimaProduct?.price || 0);
  const totalStitching = includeStitchingCost 
    ? eventDetails.Mehndi.stitchingEstimate + eventDetails.Barat.stitchingEstimate + eventDetails.Walima.stitchingEstimate
    : 0;
  const grandTotal = baseOutfitsCost + totalStitching;

  const handleLaunchTryOn = (p: Product) => {
    setActiveProductForTryOn(p);
    setCurrentView('live-me');
    showToast(`Loaded ${p.name} into Live Me Try-On!`);
  };

  const handleSaveWeddingPlan = () => {
    showToast('Dulhan Wedding Plan successfully saved to your profile!');
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#882449] via-[#9e3860] to-[#b34c76] text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <Crown className="w-4 h-4 text-[#ffd700]" />
            <span>Pakistani Wedding Styling Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Dulhan Mode
          </h1>
          <p className="text-xs sm:text-sm text-[#fce8ef] leading-relaxed">
            Plan your complete 3-event Pakistani wedding couture. Coordinate Mehndi, Barat, and Walima looks with traditional dupatta styles, jewelry harmony, and tailoring costs.
          </p>
        </div>
      </div>

      {/* Configuration Controls (FR-6.2, FR-6.3, FR-6.5) */}
      <div className="rounded-2xl bg-white border border-[#eed4e0] p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Role: Bride vs Guest */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            I am planning as:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRole('bride')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'bride'
                  ? 'bg-[#903458] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-[#faedf2]'
              }`}
            >
              👰 The Dulhan (Bride)
            </button>
            <button
              onClick={() => setRole('guest')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                role === 'guest'
                  ? 'bg-[#903458] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-[#faedf2]'
              }`}
            >
              ✨ Wedding Guest / Sister
            </button>
          </div>
        </div>

        {/* Total Budget Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Wedding Budget (PKR):</span>
            <span className="text-[#903458] font-bold">PKR {budget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="1000000"
            step="25000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#903458] cursor-pointer"
          />
          <span className="text-[10px] text-stone-400 block">
            Allocated across Mehndi, Barat & Walima ensembles
          </span>
        </div>

        {/* Include Stitching Switch (FR-6.21) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
            Tailoring & Stitching:
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-[#faf2f5] border border-[#eed4e0] cursor-pointer">
            <input
              type="checkbox"
              checked={includeStitchingCost}
              onChange={(e) => setIncludeStitchingCost(e.target.checked)}
              className="accent-[#903458] w-4 h-4 rounded"
            />
            <span className="text-xs text-stone-800 font-medium">
              Include estimated stitching in grand total
            </span>
          </label>
        </div>
      </div>

      {/* 3-Event Side-by-Side Comparison (FR-6.4, FR-6.6, FR-6.7, FR-6.8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Complete Wedding Lookbook: Side-by-Side
          </h2>
          <span className="text-xs text-stone-500">
            Compare color harmonies across all 3 days
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* EVENT 1: MEHNDI */}
          <div className="rounded-2xl bg-white border-2 border-[#edd4e0] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#903458] transition-all">
            <div className="bg-[#fcf5e7] border-b border-[#e8d7b8] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b87f17]">
                  Event 1 · Dholki & Mehndi
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Mustard & Emerald
                </h3>
              </div>
              <span className="text-xs font-bold text-[#b87f17] bg-white px-2 py-0.5 rounded shadow-2xs">
                Mehndi
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={mehndiProduct?.images[0]}
                  alt={mehndiProduct?.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setReplacingEvent('Mehndi')}
                  className="absolute bottom-2 right-2 bg-white/95 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:bg-[#faedf2] transition-colors"
                >
                  Replace Item
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#903458] uppercase">{mehndiProduct?.brand}</p>
                <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                  {mehndiProduct?.name}
                </h4>
                <p className="text-sm font-bold text-stone-800">
                  PKR {mehndiProduct?.price.toLocaleString()}
                </p>
              </div>

              <div className="pt-2 border-t border-[#eed4e0] space-y-2 text-xs text-stone-600">
                <div>
                  <strong className="text-stone-900">Dupatta Style:</strong> {eventDetails.Mehndi.dupattaStyle}
                </div>
                <div>
                  <strong className="text-stone-900">Jewelry:</strong> {eventDetails.Mehndi.jewelry}
                </div>
                {includeStitchingCost && (
                  <div className="text-[11px] text-[#903458] font-medium flex items-center justify-between pt-1">
                    <span>Stitching Estimate:</span>
                    <span>+ PKR {eventDetails.Mehndi.stitchingEstimate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => handleLaunchTryOn(mehndiProduct)}
                className="w-full py-2.5 rounded-xl bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] text-xs font-bold flex items-center justify-center gap-2 border border-[#e8c6d4] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Try On Mehndi Look</span>
              </button>
            </div>
          </div>

          {/* EVENT 2: BARAT */}
          <div className="rounded-2xl bg-white border-2 border-[#edd4e0] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#903458] transition-all">
            <div className="bg-[#faeaee] border-b border-[#ecc2cd] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#903458]">
                  Event 2 · The Big Wedding Day
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Regal Crimson & Zardozi
                </h3>
              </div>
              <span className="text-xs font-bold text-[#903458] bg-white px-2 py-0.5 rounded shadow-2xs">
                Barat
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={baratProduct?.images[0]}
                  alt={baratProduct?.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setReplacingEvent('Barat')}
                  className="absolute bottom-2 right-2 bg-white/95 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:bg-[#faedf2] transition-colors"
                >
                  Replace Item
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#903458] uppercase">{baratProduct?.brand}</p>
                <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                  {baratProduct?.name}
                </h4>
                <p className="text-sm font-bold text-stone-800">
                  PKR {baratProduct?.price.toLocaleString()}
                </p>
              </div>

              <div className="pt-2 border-t border-[#eed4e0] space-y-2 text-xs text-stone-600">
                <div>
                  <strong className="text-stone-900">Dupatta Style:</strong> {eventDetails.Barat.dupattaStyle}
                </div>
                <div>
                  <strong className="text-stone-900">Jewelry:</strong> {eventDetails.Barat.jewelry}
                </div>
                {includeStitchingCost && (
                  <div className="text-[11px] text-[#903458] font-medium flex items-center justify-between pt-1">
                    <span>Stitching Estimate:</span>
                    <span>+ PKR {eventDetails.Barat.stitchingEstimate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => handleLaunchTryOn(baratProduct)}
                className="w-full py-2.5 rounded-xl bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] text-xs font-bold flex items-center justify-center gap-2 border border-[#e8c6d4] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Try On Barat Look</span>
              </button>
            </div>
          </div>

          {/* EVENT 3: WALIMA */}
          <div className="rounded-2xl bg-white border-2 border-[#edd4e0] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#903458] transition-all">
            <div className="bg-[#f0f6f4] border-b border-[#cbded7] p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#2e6d5b]">
                  Event 3 · Grand Reception
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Pastel Mint & Champagne
                </h3>
              </div>
              <span className="text-xs font-bold text-[#2e6d5b] bg-white px-2 py-0.5 rounded shadow-2xs">
                Walima
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={walimaProduct?.images[0]}
                  alt={walimaProduct?.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setReplacingEvent('Walima')}
                  className="absolute bottom-2 right-2 bg-white/95 text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm hover:bg-[#faedf2] transition-colors"
                >
                  Replace Item
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#903458] uppercase">{walimaProduct?.brand}</p>
                <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                  {walimaProduct?.name}
                </h4>
                <p className="text-sm font-bold text-stone-800">
                  PKR {walimaProduct?.price.toLocaleString()}
                </p>
              </div>

              <div className="pt-2 border-t border-[#eed4e0] space-y-2 text-xs text-stone-600">
                <div>
                  <strong className="text-stone-900">Dupatta Style:</strong> {eventDetails.Walima.dupattaStyle}
                </div>
                <div>
                  <strong className="text-stone-900">Jewelry:</strong> {eventDetails.Walima.jewelry}
                </div>
                {includeStitchingCost && (
                  <div className="text-[11px] text-[#903458] font-medium flex items-center justify-between pt-1">
                    <span>Stitching Estimate:</span>
                    <span>+ PKR {eventDetails.Walima.stitchingEstimate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => handleLaunchTryOn(walimaProduct)}
                className="w-full py-2.5 rounded-xl bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] text-xs font-bold flex items-center justify-center gap-2 border border-[#e8c6d4] transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Try On Walima Look</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* REPLACE ITEM MODAL (FR-6.9) */}
      {replacingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto border border-[#eed4e0]">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Select Alternative Outfit for {replacingEvent}
              </h3>
              <button
                onClick={() => setReplacingEvent(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    if (replacingEvent === 'Mehndi') setMehndiProduct(p);
                    if (replacingEvent === 'Barat') setBaratProduct(p);
                    if (replacingEvent === 'Walima') setWalimaProduct(p);
                    setReplacingEvent(null);
                    showToast(`Updated ${replacingEvent} look to ${p.name}!`);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-[#903458] hover:bg-[#faedf2] transition-colors cursor-pointer"
                >
                  <img src={p.images[0]} alt={p.name} className="w-14 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#903458] uppercase">{p.brand}</span>
                    <h5 className="font-serif font-semibold text-xs text-stone-900 truncate">{p.name}</h5>
                    <p className="text-xs font-bold text-stone-800 mt-1">PKR {p.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOTAL ESTIMATED COST & SAVE WEDDING PLAN (FR-6.10, FR-6.11) */}
      <div className="rounded-2xl bg-white border border-[#eed4e0] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Wedding Tally (3 Looks):
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-serif font-bold text-[#903458]">
              PKR {grandTotal.toLocaleString()}
            </span>
            <span className="text-xs text-stone-500">
              (Outfits: PKR {baseOutfitsCost.toLocaleString()} {includeStitchingCost && `+ Stitching: PKR ${totalStitching.toLocaleString()}`})
            </span>
          </div>
          <p className="text-[11px] text-stone-400">
            {grandTotal <= budget ? '✓ Fits comfortably within your selected budget' : '⚠️ Exceeds current budget allocation'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('stitching')}
            className="px-4 py-2.5 rounded-full bg-white border border-[#eed4e0] hover:bg-[#faedf2] text-xs font-semibold text-stone-700 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4 text-[#903458]" />
            <span>Customize Stitching Rates</span>
          </button>

          <button
            onClick={handleSaveWeddingPlan}
            className="px-6 py-2.5 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Crown className="w-4 h-4 text-[#ffd700]" />
            <span>Save Complete Wedding Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
