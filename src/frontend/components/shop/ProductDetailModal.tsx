import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Camera, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INITIAL_BRANDS } from '../../../database/mockDatabase.ts';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductIdForModal, 
    setSelectedProductIdForModal, 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    setActiveProductForTryOn, 
    setCurrentView,
    user 
  } = useApp();

  const product = products.find(p => p.id === selectedProductIdForModal);

  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL'>('M');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const brandInfo = INITIAL_BRANDS.find(b => b.name === product.brand);
  const availableStockForSize = product.stock[selectedSize] || 0;
  const isSizeOutOfStock = availableStockForSize <= 0;

  const handleAddToCart = () => {
    if (isSizeOutOfStock) return;
    addToCart(product, selectedSize, product.color, quantity);
    setSelectedProductIdForModal(null);
  };

  const handleLaunchTryOn = () => {
    setActiveProductForTryOn(product);
    setSelectedProductIdForModal(null);
    setCurrentView('live-me');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#eed4e0] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductIdForModal(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 hover:bg-[#faedf2] text-stone-600 hover:text-[#903458] flex items-center justify-center transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Images Column */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-stone-100 border border-[#ecd3de]">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#903458] uppercase">
                {product.brand}
              </div>
            </div>

            {/* Thumbnails if multiple */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#903458]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Try-On CTA Button inside image column */}
            <button
              onClick={handleLaunchTryOn}
              className="w-full py-3 rounded-xl bg-[#faedf2] hover:bg-[#f6dae6] text-[#903458] border border-[#e8c6d4] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Virtual Try-On This Outfit with Live Me</span>
            </button>
          </div>

          {/* Product Details Column */}
          <div className="md:col-span-6 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#903458] tracking-wider">
                  {product.brand} · {product.category}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="text-stone-500 hover:text-red-500"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <h2 className="font-serif font-bold text-2xl text-stone-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-bold text-[#903458]">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    PKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Cash on Delivery Available
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Attributes table */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[#fdf7f9] border border-[#eed4e0]">
              <div><strong className="text-stone-700">Fabric:</strong> {product.fabric}</div>
              <div><strong className="text-stone-700">Occasion:</strong> {product.occasion}</div>
              <div><strong className="text-stone-700">Color:</strong> {product.color}</div>
              <div><strong className="text-stone-700">Pieces:</strong> {product.pieces || '3-Piece'}</div>
            </div>

            {/* Size Selector with Stock Status (FR-2.7, FR-2.8) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Select Size:</span>
                <button
                  onClick={() => setShowSizeChart(!showSizeChart)}
                  className="text-[#903458] font-semibold hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showSizeChart ? 'Hide Size Chart' : `${product.brand} Size Chart`}</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => {
                  const stockCount = product.stock[sz] || 0;
                  const isOut = stockCount <= 0;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      disabled={isOut}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                        selectedSize === sz && !isOut
                          ? 'bg-[#903458] text-white border-[#903458] shadow-xs'
                          : isOut
                          ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed line-through'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-[#faedf2]'
                      }`}
                    >
                      <span>{sz}</span>
                      <span className={`text-[9px] font-normal ${selectedSize === sz && !isOut ? 'text-white/80' : 'text-stone-400'}`}>
                        {isOut ? 'Sold out' : `${stockCount} left`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Size recommendation hint if user has analysis */}
              {user.bodyAnalysis && (
                <div className="p-2 rounded-lg bg-[#faedf2] text-[11px] text-[#903458] flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Based on your {user.measurements?.bustInches}" bust, size <strong>M</strong> in {product.brand} is recommended!</span>
                </div>
              )}
            </div>

            {/* BRAND SIZE CHART EXPANDABLE MODAL/VIEW (FR-2.6) */}
            {showSizeChart && brandInfo && (
              <div className="p-3.5 rounded-xl bg-white border border-[#eed4e0] shadow-sm space-y-2">
                <h4 className="font-serif font-bold text-xs text-stone-900">
                  {brandInfo.name} Official Sizing Guide (Inches):
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-center border-collapse">
                    <thead>
                      <tr className="bg-[#faedf2] text-[#903458] font-bold">
                        <th className="p-1 border border-[#eed4e0]">Size</th>
                        <th className="p-1 border border-[#eed4e0]">Bust</th>
                        <th className="p-1 border border-[#eed4e0]">Waist</th>
                        <th className="p-1 border border-[#eed4e0]">Hips</th>
                        <th className="p-1 border border-[#eed4e0]">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brandInfo.sizeChart.map((s) => (
                        <tr key={s.size} className={selectedSize === s.size ? 'bg-[#faedf2]/50 font-bold' : ''}>
                          <td className="p-1 border border-[#eed4e0]">{s.size}</td>
                          <td className="p-1 border border-[#eed4e0]">{s.bust}"</td>
                          <td className="p-1 border border-[#eed4e0]">{s.waist}"</td>
                          <td className="p-1 border border-[#eed4e0]">{s.hips}"</td>
                          <td className="p-1 border border-[#eed4e0]">{s.length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart (FR-2.8, FR-2.11) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#eed4e0] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-600 hover:bg-[#faedf2]"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStockForSize, quantity + 1))}
                    disabled={quantity >= availableStockForSize}
                    className="px-3 py-2 text-stone-600 hover:bg-[#faedf2] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSizeOutOfStock}
                  className="flex-1 py-3 rounded-xl bg-[#903458] hover:bg-[#782847] disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isSizeOutOfStock ? 'Size Out of Stock' : `Add to Bag · PKR ${(product.price * quantity).toLocaleString()}`}</span>
                </button>
              </div>

              {isSizeOutOfStock && (
                <p className="text-[11px] text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please choose another size or explore similar Pakistani pieces.</span>
                </p>
              )}
            </div>

            {/* Guarantees */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#903458]" /> COD All Pakistan</span>
              <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5 text-[#903458]" /> 7-Day Exchange</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#903458]" /> 100% Authentic Brand</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
