import React, { useState } from 'react';
import { Layers, Sparkles, Check, ArrowRight, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product } from '../../../database/types.ts';

interface MatchOption {
  id: string;
  type: 'Dupatta' | 'Hijab';
  fabric: string;
  colorName: string;
  colorHex: string;
  drapeStyle: string;
  styleDescription: string;
  compatibilityScore: number;
}

export const HijabDupattaMatching: React.FC = () => {
  const { products, setActiveProductForTryOn, setCurrentView, showToast } = useApp();

  // Outfit selector (shalwar kameez, abaya, lehenga)
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [activeTab, setActiveTab] = useState<'dupatta' | 'hijab'>('dupatta');

  // Suggestions for Dupatta
  const dupattaOptions: MatchOption[] = [
    {
      id: 'dup-1',
      type: 'Dupatta',
      fabric: 'Pure Organza Scalloped',
      colorName: 'Rose Dust & Antique Gold',
      colorHex: '#C57D93',
      drapeStyle: 'Single Shoulder Pin with pleated fall',
      styleDescription: 'Subtle scalloped laser-cut embroidery border complements the neckline perfectly without overpowering.',
      compatibilityScore: 98
    },
    {
      id: 'dup-2',
      type: 'Dupatta',
      fabric: 'Crushed Banarsi Tissue',
      colorName: 'Champagne Gold Zari',
      colorHex: '#D4AF37',
      drapeStyle: 'Elbow wrap front U-drape',
      styleDescription: 'Creates royal metallic festive contrast against darker or pastel base fabrics.',
      compatibilityScore: 94
    },
    {
      id: 'dup-3',
      type: 'Dupatta',
      fabric: 'Soft Silk Chiffon',
      colorName: 'Emerald Contrast',
      colorHex: '#0D5C46',
      drapeStyle: 'Flowy back drape with wrist ring',
      styleDescription: 'Provides traditional jewel-tone color blocking favored in Lahore and Karachi formal celebrations.',
      compatibilityScore: 91
    }
  ];

  // Suggestions for Hijab
  const hijabOptions: MatchOption[] = [
    {
      id: 'hij-1',
      type: 'Hijab',
      fabric: 'Korean Chiffon Georgette',
      colorName: 'Muted Rose Taupe',
      colorHex: '#B2828D',
      drapeStyle: 'Turkish Voluminous Wrap with Magnet Pin',
      styleDescription: 'Breathable, non-slip textured chiffon that matches warm Pakistani skin undertones.',
      compatibilityScore: 97
    },
    {
      id: 'hij-2',
      type: 'Hijab',
      fabric: 'Modal Cotton Pashmina',
      colorName: 'Midnight Onyx Black',
      colorHex: '#1C1A1B',
      drapeStyle: 'Classic Loose Cascade Drape',
      styleDescription: 'Maximum coverage with natural drape; ideal for silk and nidha abayas.',
      compatibilityScore: 95
    },
    {
      id: 'hij-3',
      type: 'Hijab',
      fabric: 'Soft Satin Silk',
      colorName: 'Pewter Silver Shimmer',
      colorHex: '#A8A9AD',
      drapeStyle: 'Formal Turban Wrap with Pearl Pins',
      styleDescription: 'Elevates wedding and evening ensembles with a delicate metallic luster.',
      compatibilityScore: 89
    }
  ];

  const currentList = activeTab === 'dupatta' ? dupattaOptions : hijabOptions;
  const [selectedOption, setSelectedOption] = useState<MatchOption>(dupattaOptions[0]);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">Hijab & Dupatta Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>Hijab & Dupatta Matching Studio</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Fabric & Draping AI
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Pair your Shalwar Kameez, Abayas, and Lehengas with culturally authentic dupatta drapes and modest hijab styles.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveProductForTryOn(selectedProduct);
            setCurrentView('live-me');
          }}
          className="px-4 py-2 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Try On Matching Look</span>
        </button>
      </div>

      {/* Main Grid: Outfit preview + Matcher choices (FR-6.14) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Base Outfit Selector */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900">
                1. Select Base Outfit
              </h3>
              <span className="text-xs font-bold text-[#903458] bg-[#faedf2] px-2 py-0.5 rounded">
                {selectedProduct.category}
              </span>
            </div>

            <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-stone-100 border border-[#ecd3de]">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-xs">
                <p className="text-[10px] font-bold text-[#903458] uppercase">{selectedProduct.brand}</p>
                <h4 className="font-serif font-bold text-xs text-stone-900 truncate">{selectedProduct.name}</h4>
                <p className="text-xs font-bold text-stone-800 mt-0.5">PKR {selectedProduct.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick change outfit thumbnails */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-stone-600 block">Switch Outfit:</label>
              <div className="grid grid-cols-4 gap-2">
                {products.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      showToast(`Selected ${p.name}`);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                      selectedProduct.id === p.id ? 'border-2 border-[#903458] ring-1 ring-[#903458]' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Matching Suggestions (FR-6.12, FR-6.13, FR-6.15) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Tab Switcher: Dupatta vs Hijab */}
          <div className="flex items-center gap-2 p-1 bg-[#faedf2] rounded-xl border border-[#eed4e0]">
            <button
              onClick={() => {
                setActiveTab('dupatta');
                setSelectedOption(dupattaOptions[0]);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'dupatta' ? 'bg-[#903458] text-white shadow-xs' : 'text-stone-700 hover:text-[#903458]'
              }`}
            >
              Dupatta Drapes & Fabric (3)
            </button>
            <button
              onClick={() => {
                setActiveTab('hijab');
                setSelectedOption(hijabOptions[0]);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'hijab' ? 'bg-[#903458] text-white shadow-xs' : 'text-stone-700 hover:text-[#903458]'
              }`}
            >
              Modest Hijab Styles (3)
            </button>
          </div>

          {/* Cards of matching suggestions */}
          <div className="space-y-3">
            {currentList.map((opt) => {
              const isSelected = selectedOption.id === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#903458] bg-[#fdf5f8] shadow-xs ring-1 ring-[#903458]'
                      : 'border-[#edd7e2] bg-white hover:border-[#c57d93]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-black/10 shrink-0 shadow-2xs"
                        style={{ backgroundColor: opt.colorHex }}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-stone-900">
                            {opt.fabric}
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {opt.compatibilityScore}% Color Harmony
                          </span>
                        </div>
                        <p className="text-xs text-[#903458] font-medium mt-0.5">
                          {opt.colorName} · {opt.drapeStyle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#903458] text-white flex items-center justify-center text-xs shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                    {opt.styleDescription}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Combined Look Summary Card */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Selected Combination:</span>
              <p className="font-serif font-bold text-sm text-stone-900">
                {selectedProduct.name} + {selectedOption.colorName} ({selectedOption.fabric})
              </p>
            </div>
            <button
              onClick={() => {
                setActiveProductForTryOn(selectedProduct);
                setCurrentView('live-me');
                showToast(`Visualizing ${selectedOption.type} on your photo!`);
              }}
              className="px-4 py-2 rounded-xl bg-[#903458] text-white text-xs font-bold hover:bg-[#782847] flex items-center gap-1.5 shadow-xs"
            >
              <span>Preview Live Drape</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
