import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Heart, 
  Camera, 
  ShoppingBag, 
  SlidersHorizontal, 
  Sparkles,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { Product, GarmentCategory, PakistaniBrand, GarmentFabric, OccasionType } from '../../../database/types.ts';

export const ProductCatalog: React.FC = () => {
  const { 
    products, 
    wishlist, 
    toggleWishlist, 
    setActiveProductForTryOn, 
    setCurrentView, 
    setSelectedProductIdForModal,
    searchQuery,
    setSearchQuery,
    addToCart
  } = useApp();

  // Filters state (FR-2.4)
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [selectedFabric, setSelectedFabric] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest'>('popularity');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categories: (GarmentCategory | 'All')[] = [
    'All',
    'Shalwar Kameez',
    'Kurti',
    'Abaya',
    'Lehenga',
    'Bridal Wear'
  ];

  const brands: (PakistaniBrand | 'All')[] = [
    'All',
    'Khaadi',
    'Sapphire',
    'Maria.B',
    'Sana Safinaz',
    'Baroque',
    'Gul Ahmed'
  ];

  const occasions: (OccasionType | 'All')[] = [
    'All',
    'Daily Wear',
    'Casual',
    'Semi-Formal',
    'Formal',
    'Eid',
    'Mehndi',
    'Barat',
    'Walima'
  ];

  const fabrics: (GarmentFabric | 'All')[] = [
    'All',
    'Lawn',
    'Chiffon',
    'Silk',
    'Velvet',
    'Organza',
    'Cotton',
    'Jacquard',
    'Net'
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) return false;
      if (selectedFabric !== 'All' && p.fabric !== selectedFabric) return false;
      if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as any)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && (!p.inStock || Object.values(p.stock).every(v => v === 0))) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.popularity - a.popularity;
    });
  }, [products, selectedCategory, selectedBrand, selectedOccasion, selectedFabric, selectedSize, maxPrice, inStockOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedOccasion('All');
    setSelectedFabric('All');
    setSelectedSize('All');
    setMaxPrice(200000);
    setSearchQuery('');
    setSortBy('popularity');
    setInStockOnly(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Catalog Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">Pakistani Designer Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Women's Fashion Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse authentic ready-to-wear & luxury pret from Pakistan's top fashion houses.
          </p>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredProducts.length} items
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-[#eed4e0] rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#903458]"
          >
            <option value="popularity">Sort by: Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* FILTERS PANEL (FR-2.4) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#903458]" />
                <span>Filters</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#903458] hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">Category:</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#903458] text-white'
                        : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-[#faedf2]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1.5 pt-3 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-700 block">Brand:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs bg-[#fcf6f8] border border-[#eed4e0] rounded-lg p-2 text-stone-800 font-medium"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Occasion Filter */}
            <div className="space-y-1.5 pt-3 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-700 block">Occasion:</label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full text-xs bg-[#fcf6f8] border border-[#eed4e0] rounded-lg p-2 text-stone-800 font-medium"
              >
                {occasions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Fabric Filter */}
            <div className="space-y-1.5 pt-3 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-700 block">Fabric:</label>
              <select
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="w-full text-xs bg-[#fcf6f8] border border-[#eed4e0] rounded-lg p-2 text-stone-800 font-medium"
              >
                {fabrics.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Size Filter */}
            <div className="space-y-1.5 pt-3 border-t border-[#eed4e0]">
              <label className="text-xs font-bold text-stone-700 block">Available Size:</label>
              <div className="grid grid-cols-6 gap-1">
                {['All', 'XS', 'S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-1 text-xs rounded font-bold transition-all ${
                      selectedSize === sz
                        ? 'bg-[#903458] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-[#faedf2]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-1.5 pt-3 border-t border-[#eed4e0]">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>Max Budget:</span>
                <span className="text-[#903458]">PKR {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="200000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#903458] cursor-pointer"
              />
            </div>

            {/* In Stock toggle */}
            <div className="pt-3 border-t border-[#eed4e0]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#903458] w-4 h-4 rounded"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* PRODUCTS LIST GRID (FR-2.1, FR-2.7, FR-2.14) */}
        <div className="lg:col-span-9 space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl bg-white border border-[#eed4e0] p-12 text-center space-y-3">
              <p className="text-base font-serif font-bold text-stone-800">
                No Pakistani outfits match your filter criteria.
              </p>
              <p className="text-xs text-stone-500">
                Try expanding your price range or resetting brand/category filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-[#903458] text-white text-xs font-semibold hover:bg-[#782847]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id);
                const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
                const isOutOfStock = !product.inStock || totalStock === 0;

                return (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-white border border-[#edd3de] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-3/4 overflow-hidden bg-stone-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Brand Label */}
                      <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#903458] uppercase tracking-wider shadow-2xs">
                        {product.brand}
                      </div>

                      {/* Wishlist Button (FR-2.9, FR-2.10) */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 transition-colors shadow-xs"
                        aria-label="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Out of Stock overlay if applicable (FR-2.7, FR-2.8) */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
                          <span className="bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Quick Try-On Overlay (FR-2.14) */}
                      {!isOutOfStock && (
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setActiveProductForTryOn(product);
                              setCurrentView('live-me');
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Try On Virtually</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>{product.category} · {product.fabric}</span>
                        <span className="text-[#903458] font-medium">{product.occasion}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedProductIdForModal(product.id)}
                        className="font-serif font-bold text-sm text-stone-900 hover:text-[#903458] cursor-pointer line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#903458]">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-stone-400 line-through">
                              PKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isOutOfStock ? 'Sold Out' : `${totalStock} in stock`}
                        </span>
                      </div>

                      {/* Sizes badges */}
                      <div className="pt-2 flex items-center gap-1">
                        <span className="text-[10px] text-stone-400 mr-1">Sizes:</span>
                        {product.sizes.map((s) => (
                          <span 
                            key={s} 
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                              (product.stock[s] || 0) > 0 ? 'bg-[#faedf2] text-[#903458]' : 'bg-stone-100 text-stone-300 line-through'
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Quick Add to Cart button */}
                      <button
                        onClick={() => setSelectedProductIdForModal(product.id)}
                        disabled={isOutOfStock}
                        className="mt-2 w-full py-2 rounded-xl bg-stone-50 hover:bg-[#faedf2] text-stone-800 hover:text-[#903458] border border-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Select Size & Buy</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
