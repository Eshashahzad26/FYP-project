import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Info, 
  Check, 
  Crown, 
  Sparkles, 
  ArrowRight,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { StitchingRateConfig, StitchingEstimate } from '../../../database/types.ts';
import { apiClient } from '../../../backend/apiClient.ts';
import { INITIAL_STITCHING_RATES } from '../../../database/mockDatabase.ts';

export const StitchingCostEstimator: React.FC = () => {
  const { setCurrentView, showToast } = useApp();

  const [rates, setRates] = useState<StitchingRateConfig>(INITIAL_STITCHING_RATES);
  const [garmentType, setGarmentType] = useState<string>('3-Piece (Shirt + Shalwar + Dupatta)');
  const [fabric, setFabric] = useState<string>('Chiffon');
  const [embellishmentLevel, setEmbellishmentLevel] = useState<'plain' | 'light' | 'heavy'>('light');
  const [lining, setLining] = useState<'none' | 'lawn' | 'silk'>('lawn');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['piping', 'tasselsAndLace']);

  useEffect(() => {
    apiClient.getStitchingRates()
      .then(r => { if (r) setRates(r); })
      .catch(console.error);
  }, []);

  // Compute breakdown (FR-6.18, FR-6.19)
  const baseRate = rates.garmentBaseRates[garmentType] || 2500;
  const fabricExtra = rates.fabricSurcharges[fabric] || 0;
  const embellishmentCost = rates.embellishmentRates[embellishmentLevel] || 0;
  const liningCost = rates.liningRates[lining] || 0;

  const addonsCost = selectedAddons.reduce((sum, key) => {
    return sum + (rates.customAddons[key as keyof typeof rates.customAddons] || 0);
  }, 0);

  const totalEstimate = baseRate + fabricExtra + embellishmentCost + liningCost + addonsCost;

  const toggleAddon = (key: string) => {
    if (selectedAddons.includes(key)) {
      setSelectedAddons(selectedAddons.filter(k => k !== key));
    } else {
      setSelectedAddons([...selectedAddons, key]);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">Stitching Cost Estimator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>Stitching Cost Estimator</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Pakistani Tailoring Calculator
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Calculate accurate tailoring costs across unstitched lawn, festive chiffon, or bespoke wedding couture.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('dulhan-mode')}
          className="px-4 py-2 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Crown className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>Apply to Dulhan Mode</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Input Parameters Form (FR-6.17) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Garment Type */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              1. Garment Type & Silhouette:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(rates.garmentBaseRates).map((g) => (
                <button
                  key={g}
                  onClick={() => setGarmentType(g)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                    garmentType === g
                      ? 'bg-[#903458] text-white border-[#903458] shadow-xs'
                      : 'bg-[#fdf7f9] text-stone-700 border-[#eed4e0] hover:bg-[#faedf2]'
                  }`}
                >
                  <p className="truncate">{g}</p>
                  <p className={`text-[10px] mt-0.5 ${garmentType === g ? 'text-white/80' : 'text-stone-400'}`}>
                    Base: PKR {rates.garmentBaseRates[g].toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Type */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              2. Fabric Handling & Stitching Tier:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.keys(rates.fabricSurcharges).map((f) => (
                <button
                  key={f}
                  onClick={() => setFabric(f)}
                  className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                    fabric === f
                      ? 'bg-[#903458] text-white border-[#903458]'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-[#faedf2]'
                  }`}
                >
                  <p className="font-semibold truncate">{f}</p>
                  <p className={`text-[10px] ${fabric === f ? 'text-white/80' : 'text-stone-400'}`}>
                    {rates.fabricSurcharges[f] > 0 ? `+PKR ${rates.fabricSurcharges[f]}` : 'Standard'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Embellishment Level & Inner Lining */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-4">
            {/* Embellishment Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                3. Embellishment & Workmanship Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'plain', label: 'Plain / Basic Stitch', cost: rates.embellishmentRates.plain },
                  { id: 'light', label: 'Light (Piping & Lace)', cost: rates.embellishmentRates.light },
                  { id: 'heavy', label: 'Heavy (Handwork & Tassels)', cost: rates.embellishmentRates.heavy }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEmbellishmentLevel(item.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      embellishmentLevel === item.id
                        ? 'bg-[#903458] text-white border-[#903458]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-[#faedf2]'
                    }`}
                  >
                    <p className="font-semibold truncate">{item.label}</p>
                    <p className={`text-[10px] ${embellishmentLevel === item.id ? 'text-white/80' : 'text-stone-400'}`}>
                      +PKR {item.cost.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Lining */}
            <div className="space-y-2 pt-2 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                4. Inner Lining Fabric:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'No Lining', cost: rates.liningRates.none },
                  { id: 'lawn', label: 'Lawn / Malmal Lining', cost: rates.liningRates.lawn },
                  { id: 'silk', label: 'Katan Silk Lining', cost: rates.liningRates.silk }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLining(item.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all ${
                      lining === item.id
                        ? 'bg-[#903458] text-white border-[#903458]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-[#faedf2]'
                    }`}
                  >
                    <p className="font-semibold truncate">{item.label}</p>
                    <p className={`text-[10px] ${lining === item.id ? 'text-white/80' : 'text-stone-400'}`}>
                      +PKR {item.cost.toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Addons */}
            <div className="space-y-2 pt-2 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                5. Designer Tailoring Addons:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'piping', label: 'Dori Neckline Piping', cost: rates.customAddons.piping },
                  { id: 'tasselsAndLace', label: 'Tassels & Scallop Lace', cost: rates.customAddons.tasselsAndLace },
                  { id: 'customNeckline', label: 'Custom Ban / Boat Neck', cost: rates.customAddons.customNeckline },
                  { id: 'designerSleeves', label: 'Bell / Tulip Sleeves', cost: rates.customAddons.designerSleeves }
                ].map((addon) => {
                  const active = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                        active ? 'bg-[#faedf2] border-[#903458] text-[#903458] font-semibold' : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <span className="text-xs">{addon.label}</span>
                      <span className="text-[10px] font-bold">+PKR {addon.cost}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right: Detailed Breakdown & Total Estimate (FR-6.19, FR-6.20) */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white border-2 border-[#903458] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#eed4e0] pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#903458]" />
                <span>Tailoring Breakdown</span>
              </h3>
              <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                PKR Estimator
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Base Garment ({garmentType}):</span>
                <span className="font-semibold text-stone-900">PKR {baseRate.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Fabric Surcharge ({fabric}):</span>
                <span className="font-semibold text-stone-900">+ PKR {fabricExtra.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Embellishment ({embellishmentLevel}):</span>
                <span className="font-semibold text-stone-900">+ PKR {embellishmentCost.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Inner Lining ({lining}):</span>
                <span className="font-semibold text-stone-900">+ PKR {liningCost.toLocaleString()}</span>
              </div>

              {addonsCost > 0 && (
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-600">Custom Addons ({selectedAddons.length}):</span>
                  <span className="font-semibold text-stone-900">+ PKR {addonsCost.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-[#eed4e0] flex items-baseline justify-between">
              <span className="text-sm font-bold text-stone-900">Estimated Total:</span>
              <span className="text-2xl font-serif font-bold text-[#903458]">
                PKR {totalEstimate.toLocaleString()}
              </span>
            </div>

            {/* FR-6.20 Disclaimer */}
            <div className="p-3 rounded-xl bg-[#faedf2] border border-[#e8c6d4] text-[11px] text-[#903458] flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Stitching rates reflect certified partner tailor rates in Lahore, Karachi, and Islamabad. Final tailor charges may vary depending on custom fit modifications.
              </p>
            </div>

            <button
              onClick={() => {
                showToast(`Stitching estimate of PKR ${totalEstimate.toLocaleString()} added to your active wedding plan!`);
                setCurrentView('dulhan-mode');
              }}
              className="w-full py-3 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Crown className="w-4 h-4 text-[#ffd700]" />
              <span>Add to Dulhan Wedding Plan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
