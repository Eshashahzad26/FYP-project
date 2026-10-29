import React from 'react';
import { 
  Heart, 
  Trash2, 
  Share2, 
  Camera, 
  ShoppingBag, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { SavedOutfit } from '../../../database/types.ts';

export const MyLooksView: React.FC = () => {
  const { 
    savedOutfits, 
    deleteSavedOutfit, 
    setActiveProductForTryOn, 
    setCurrentView, 
    setSelectedProductIdForModal,
    setActiveShareId,
    showToast 
  } = useApp();

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">My Looks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>My Saved Outfits</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Virtual Wardrobe ({savedOutfits.length})
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your virtual try-on outcomes, compare looks, and collect opinions from family and friends.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('live-me')}
          className="px-4 py-2 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>New Virtual Try-On</span>
        </button>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#eed4e0] p-12 text-center space-y-3">
          <Heart className="w-12 h-12 text-[#eed4e0] mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">
            No saved outfits yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try on Pakistani designer garments in Live Me and save your favorite looks to review here anytime.
          </p>
          <button
            onClick={() => setCurrentView('live-me')}
            className="px-6 py-2.5 rounded-full bg-[#903458] text-white text-xs font-bold hover:bg-[#782847]"
          >
            Launch Live Me Try-On
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="rounded-2xl bg-white border border-[#eed4e0] overflow-hidden shadow-xs hover:border-[#903458] transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
                <img
                  src={outfit.tryOnResultUrl}
                  alt={outfit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 bg-white/95 px-2.5 py-1 rounded-md text-[10px] font-bold text-[#903458] uppercase">
                  {outfit.product.brand}
                </div>

                <button
                  onClick={() => deleteSavedOutfit(outfit.id)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-stone-500 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors"
                  title="Delete outfit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                    {outfit.title}
                  </h4>
                  <p className="text-xs font-bold text-[#903458]">
                    PKR {outfit.product.price.toLocaleString()}
                  </p>
                  {outfit.notes && (
                    <p className="text-[11px] text-stone-500 line-clamp-2 italic">
                      "{outfit.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[#eed4e0] flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (outfit.shareId) {
                        setActiveShareId(outfit.shareId);
                      } else {
                        showToast('Generating shareable link...');
                      }
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Family Opinions</span>
                  </button>

                  <button
                    onClick={() => setSelectedProductIdForModal(outfit.product.id)}
                    className="py-2 px-3 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                    title="Buy this outfit"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
