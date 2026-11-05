import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  RotateCcw, 
  Ruler, 
  Camera, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Palette,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { apiClient } from '../../../backend/apiClient.ts';
import { Product, PakistaniBrand } from '../../../database/types.ts';

export const ForYouRecommendations: React.FC = () => {
  const { user, products, setActiveProductForTryOn, setCurrentView, showToast } = useApp();

  const [occasion, setOccasion] = useState<string>('Eid');
  const [budget, setBudget] = useState<number>(20000);
  const [selectedBrand, setSelectedBrand] = useState<PakistaniBrand>('Khaadi');
  
  const [isLoading, setIsLoading] = useState(false);
  const [stylingAdvice, setStylingAdvice] = useState<any>(null);
  const [mixMatchCombo, setMixMatchCombo] = useState<any>(null);
  const [recommendationFeedback, setRecommendationFeedback] = useState<Record<string, 'liked' | 'disliked'>>({});

  // Fetch advice & budget combos
  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // 1. Styling advice & brand size conversions
      const adviceRes = await apiClient.getGeminiStylingAdvice({
        measurements: user.measurements,
        skinTone: user.bodyAnalysis?.skinTone || 'Medium',
        skinUndertone: user.bodyAnalysis?.skinUndertone || 'Warm',
        bodyShape: user.bodyAnalysis?.bodyShape || 'Hourglass',
        occasion,
        budget,
        selectedBrand
      });
      setStylingAdvice(adviceRes.advice);

      // 2. Mix and match within budget (FR-5.8)
      const mixRes = await apiClient.getGeminiMixMatch(budget, occasion);
      setMixMatchCombo(mixRes.combination);

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.warn('Recommendation load error:', err);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [occasion, selectedBrand]);

  // Handle Like/Dislike feedback (FR-5.15)
  const handleFeedback = (productId: string, type: 'liked' | 'disliked') => {
    setRecommendationFeedback(prev => ({ ...prev, [productId]: type }));
    showToast(`Thank you! Your feedback will refine future style recommendations.`);
  };

  // Reset style profile (FR-5.16)
  const handleResetProfile = () => {
    setRecommendationFeedback({});
    showToast('Your style recommendations preference history has been reset.');
    loadRecommendations();
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">For You (Smart Recommendations)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>For You: AI Stylist & Sizing</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Gemini + Rule Engine
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Personalized size translations across Pakistani brands, skin tone color harmony, and budget-matched ensembles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetProfile}
            className="px-3 py-1.5 rounded-full bg-white border border-[#eed4e0] hover:bg-[#faedf2] text-xs font-semibold text-stone-600 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#903458]" />
            <span>Reset Style Profile</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Occasion & Budget Selector (FR-5.7) */}
      <div className="p-5 rounded-2xl bg-white border border-[#eed4e0] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">Occasion / Event:</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full text-xs p-2.5 bg-[#fcf6f8] border border-[#eed4e0] rounded-xl text-stone-900 font-medium"
          >
            <option value="Daily Wear">Daily Wear / University</option>
            <option value="Semi-Formal">Semi-Formal Dinner</option>
            <option value="Eid">Eid Festive</option>
            <option value="Mehndi">Mehndi Celebration</option>
            <option value="Wedding Guest">Wedding Guest</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">Target Pakistani Brand:</label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value as any)}
            className="w-full text-xs p-2.5 bg-[#fcf6f8] border border-[#eed4e0] rounded-xl text-stone-900 font-medium"
          >
            <option value="Khaadi">Khaadi</option>
            <option value="Sapphire">Sapphire</option>
            <option value="Maria.B">Maria.B</option>
            <option value="Sana Safinaz">Sana Safinaz</option>
            <option value="Baroque">Baroque</option>
            <option value="Gul Ahmed">Gul Ahmed</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
            <span>Budget Limit:</span>
            <span className="text-[#903458]">PKR {budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5000"
              max="150000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#903458] cursor-pointer"
            />
            <button
              onClick={loadRecommendations}
              className="p-2 rounded-xl bg-[#903458] text-white hover:bg-[#782847] shrink-0"
              title="Apply Budget"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 1. Cross-Brand Size Recommendation & Reason (FR-5.1, FR-5.2, FR-5.3) */}
      {stylingAdvice && (
        <div className="rounded-3xl bg-gradient-to-br from-white to-[#fdf7f9] border-2 border-[#903458] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eed4e0] pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#903458]">
                Cross-Brand Size Translation
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Recommended Size in {selectedBrand}: <span className="text-[#903458]">{stylingAdvice.recommendedSize}</span>
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Based on {user.measurements?.bustInches || 37}" bust · {user.measurements?.waistInches || 29.5}" waist
            </span>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed bg-[#faedf2] p-3 rounded-xl border border-[#eed4e0]">
            💡 <strong>Why this fits:</strong> {stylingAdvice.sizeReason}
          </p>

          {/* Size translation chart across all top brands (FR-5.2) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Your Matching Size in Other Pakistani Brands:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stylingAdvice.brandSizeConversions && Object.entries(stylingAdvice.brandSizeConversions).map(([brand, sz]) => (
                <div key={brand} className="p-3 rounded-xl bg-white border border-[#eed4e0] shadow-2xs text-center">
                  <span className="text-xs text-stone-500 font-semibold block">{brand}</span>
                  <span className="text-lg font-serif font-bold text-[#903458] mt-0.5 block">Size {String(sz)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Skin Tone & Body Shape Color & Cut Suggestions (FR-5.4, FR-5.5, FR-5.6, FR-5.10) */}
      {stylingAdvice && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Colors */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-stone-900">
              <Palette className="w-4 h-4 text-[#903458]" />
              <h3 className="font-serif font-bold text-base">Color Palette for {user.bodyAnalysis?.skinTone || 'Medium'} Skin</h3>
            </div>
            <p className="text-xs text-stone-600">
              Warm Pakistani skin undertones glow when complemented by rich jewel tones and warm pastels:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {(stylingAdvice.recommendedColors || []).map((col: string, idx: number) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#faedf2] text-[#903458] border border-[#eed4e0]">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Silhouette / Cut advice */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-stone-900">
              <Sparkles className="w-4 h-4 text-[#903458]" />
              <h3 className="font-serif font-bold text-base">Silhouette for {user.bodyAnalysis?.bodyShape || 'Hourglass'} Shape</h3>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {stylingAdvice.silhouetteAdvice}
            </p>
            <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-1">
              {stylingAdvice.stylingTips?.map((tip: string, tIdx: number) => (
                <p key={tIdx} className="leading-snug">• {tip}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. AI Mix & Match Within Budget (FR-5.8, FR-5.11, FR-5.12, FR-5.15) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Curated Mix-and-Match Outfit (Under PKR {budget.toLocaleString()})
            </h2>
            <p className="text-xs text-stone-500">
              AI validated only against in-stock catalog products matching your budget.
            </p>
          </div>
          {mixMatchCombo && (
            <span className="text-xs font-bold text-[#903458] bg-[#faedf2] px-3 py-1 rounded-full">
              Combo Total: PKR {mixMatchCombo.totalCost?.toLocaleString()}
            </span>
          )}
        </div>

        {mixMatchCombo?.explanation && (
          <p className="text-xs text-stone-600 bg-white p-3 rounded-xl border border-[#eed4e0] italic">
            "{mixMatchCombo.explanation}"
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {mixMatchCombo?.outfits?.map((item: Product) => {
            const feedback = recommendationFeedback[item.id];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#eed4e0] overflow-hidden shadow-xs hover:border-[#903458] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#903458] uppercase">
                    {item.brand}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{item.category}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">In Stock</span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">{item.name}</h4>
                  
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-base font-bold text-[#903458]">PKR {item.price.toLocaleString()}</span>
                    <span className="text-[10px] text-stone-400">{item.fabric}</span>
                  </div>

                  {/* Actions & Feedback (FR-5.15) */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setActiveProductForTryOn(item);
                        setCurrentView('live-me');
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Try On</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleFeedback(item.id, 'liked')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          feedback === 'liked' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                        }`}
                        title="Like this recommendation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleFeedback(item.id, 'disliked')}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          feedback === 'disliked' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                        }`}
                        title="Dislike this recommendation"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
