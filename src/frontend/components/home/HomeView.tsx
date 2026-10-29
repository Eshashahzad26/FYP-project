import React from 'react';
import { 
  Camera, 
  Sparkles, 
  Heart, 
  Crown, 
  ArrowRight, 
  Scissors, 
  ShieldCheck, 
  Layers, 
  ShoppingBag,
  Palette
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { INITIAL_BRANDS } from '../../../database/mockDatabase.ts';

export const HomeView: React.FC = () => {
  const { setCurrentView, user, products, setActiveProductForTryOn, setSelectedProductIdForModal, wishlist, toggleWishlist } = useApp();

  return (
    <div className="space-y-12 pb-12">
      {/* 1. HERO SECTION (Matches Wireframe Page 14: "YOUR FASHION IMAGINATIONS") */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#faedf2] via-[#f7e4eb] to-[#fcebf1] border border-[#ebd0dc] p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#e8c6d4] text-[#903458] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Pakistani Virtual Try-On</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.15] tracking-tight">
                YOUR <span className="text-[#903458]">FASHION</span><br />
                IMAGINATIONS
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-lg leading-relaxed pt-2">
                Imagine your style, design it, try it virtually with AI on your own photo, and save your favourite Pakistani designer looks before buying.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('live-me')}
                className="px-6 py-3 rounded-full bg-[#903458] hover:bg-[#7b2949] text-white font-medium text-sm flex items-center gap-2.5 shadow-md shadow-[#903458]/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Try On Virtually</span>
              </button>

              <button
                onClick={() => setCurrentView('dulhan-mode')}
                className="px-6 py-3 rounded-full bg-white hover:bg-[#faedf2] text-[#903458] border border-[#e8c6d4] font-medium text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#c59b27]" />
                <span>Dulhan Mode (Wedding)</span>
              </button>

              <button
                onClick={() => setCurrentView('shop')}
                className="px-5 py-3 rounded-full text-stone-700 hover:text-[#903458] text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro proof tags */}
            <div className="flex items-center gap-6 pt-4 text-xs text-stone-500 border-t border-[#ebd0dc]/80">
              <div>
                <span className="font-bold text-stone-800">IDM-VTON</span> Try-On
              </div>
              <span className="text-stone-300">·</span>
              <div>
                <span className="font-bold text-stone-800">±5 cm</span> Accurate Sizing
              </div>
              <span className="text-stone-300">·</span>
              <div>
                <span className="font-bold text-stone-800">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Display (Matching wireframe model preview) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#903458]/20 via-[#c57d93]/10 to-transparent blur-xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80"
                  alt="Pakistani Model wearing Maria.B Organza"
                  className="w-full h-80 sm:h-96 object-cover object-top"
                />
                
                {/* Floating try-on badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-[#ebd0dc] shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-serif font-bold text-stone-900">Maria.B Rose Dust</p>
                    <p className="text-[10px] text-stone-500">Virtual Try-On Result · Fit: 98% Match</p>
                  </div>
                  <button
                    onClick={() => {
                      const p = products[0];
                      if (p) {
                        setActiveProductForTryOn(p);
                        setCurrentView('live-me');
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#903458] text-white text-xs font-medium hover:bg-[#782847]"
                  >
                    Try This
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WIREFRAME DASHBOARD CARDS (Directly from Wireframe Page 15) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Hello, {user?.name ? user.name.split(' ')[0] : 'Sana'}
            </h2>
            <p className="text-xs text-stone-500">
              Select your customized fashion studio tool:
            </p>
          </div>
          <button 
            onClick={() => setCurrentView('body-analysis')}
            className="text-xs font-semibold text-[#903458] hover:underline flex items-center gap-1"
          >
            <span>Update Body & Style Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards matching Wireframe Page 15: Live Me, My Looks, Personalized Style, Dulhan Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Live Me */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#fcf5f8] to-[#f8e5ee] border border-[#e8c6d4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#903458] shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Live Me</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload your photo or use camera to preview Pakistani garments on yourself.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('live-me')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Try Now
            </button>
          </div>

          {/* Card 2: My Looks */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#fcf5f8] to-[#f8e5ee] border border-[#e8c6d4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#903458] shadow-xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">My Looks</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                View your saved virtual try-on outfits and opinions shared by family.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('my-looks')}
              className="mt-5 w-full py-2.5 rounded-xl bg-white border border-[#e8c6d4] hover:bg-[#f6e2ec] text-[#903458] text-xs font-semibold transition-colors cursor-pointer"
            >
              View Saved
            </button>
          </div>

          {/* Card 3: Personalized Style */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#fcf5f8] to-[#f8e5ee] border border-[#e8c6d4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#903458] shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Personalized Style</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Get size recommendation across brands & colors suited to your skin tone.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('for-you')}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Get Suggestions
            </button>
          </div>

          {/* Card 4: Dulhan Mode */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#fcf5f8] to-[#f8e5ee] border border-[#e8c6d4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#903458] shadow-xs">
                <Crown className="w-5 h-5 text-[#c59b27]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Dulhan Mode</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Curate full Pakistani wedding looks for Mehndi, Barat, and Walima.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('dulhan-mode')}
              className="mt-5 w-full py-2.5 rounded-xl bg-white border border-[#e8c6d4] hover:bg-[#f6e2ec] text-[#903458] text-xs font-semibold transition-colors cursor-pointer"
            >
              Plan Looks
            </button>
          </div>

        </div>
      </section>

      {/* 3. EXPLORE BRANDS (Matches Wireframe Page 16: "Explore brands of your own choice") */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Explore Brands
          </h2>
          <p className="text-xs text-stone-500">
            Discover collections of your own choice with brand-accurate size conversion
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
          {INITIAL_BRANDS.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setCurrentView('shop')}
              className="rounded-2xl bg-white border border-[#edd2dd] p-4 text-center hover:border-[#903458] transition-all cursor-pointer shadow-xs hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border border-[#eed7e2] mb-3 group-hover:scale-105 transition-transform">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-serif font-bold text-sm text-stone-800 group-hover:text-[#903458] transition-colors">
                {brand.name}
              </h4>
              <p className="text-[10px] text-stone-400 mt-0.5">Size XS - XL</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PAKISTANI COLLECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Trending Pakistani Outfits
            </h2>
            <p className="text-xs text-stone-500">
              Top curated Shalwar Kameez, Kurtis, and Festive Wear ready for instant try-on
            </p>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-semibold text-[#903458] hover:underline flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product) => {
            const isWishlisted = wishlist.includes(product.id);
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
                  <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#903458] uppercase tracking-wider">
                    {product.brand}
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-600 hover:text-red-500 transition-colors shadow-xs"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Quick Try-On overlay button */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setActiveProductForTryOn(product);
                        setCurrentView('live-me');
                      }}
                      className="w-full py-2 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Virtual Try-On</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>{product.category} · {product.fabric}</span>
                    <span className="text-[#903458] font-medium">{product.occasion}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedProductIdForModal(product.id)}
                    className="font-serif font-bold text-sm text-stone-900 hover:text-[#903458] cursor-pointer line-clamp-1"
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
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PAKISTANI CUSTOMIZATION HIGHLIGHT MODULE */}
      <section className="rounded-3xl bg-[#903458] text-white p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            <Crown className="w-3.5 h-3.5 text-[#f6d77e]" />
            <span>Pakistani Fashion Customization Module</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
            Designed for the Unique Needs of Pakistani Women
          </h2>

          <p className="text-xs sm:text-sm text-[#fedde8] leading-relaxed">
            Unlike foreign generic shopping apps, herAttire Aesthetics includes bespoke Pakistani tailoring estimation, complete wedding event coordination (Mehndi, Barat, Walima), and modest hijab/dupatta matching.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <button
              onClick={() => setCurrentView('dulhan-mode')}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-left border border-white/20 transition-all cursor-pointer"
            >
              <Crown className="w-5 h-5 text-[#f6d77e] mb-1.5" />
              <p className="font-semibold text-xs">Dulhan Mode</p>
              <p className="text-[10px] text-white/70">Mehndi, Barat & Walima</p>
            </button>

            <button
              onClick={() => setCurrentView('hijab-matching')}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-left border border-white/20 transition-all cursor-pointer"
            >
              <Layers className="w-5 h-5 text-white mb-1.5" />
              <p className="font-semibold text-xs">Hijab & Dupatta</p>
              <p className="text-[10px] text-white/70">Drape & fabric matcher</p>
            </button>

            <button
              onClick={() => setCurrentView('stitching')}
              className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-left border border-white/20 transition-all cursor-pointer"
            >
              <Scissors className="w-5 h-5 text-white mb-1.5" />
              <p className="font-semibold text-xs">Stitching Estimator</p>
              <p className="text-[10px] text-white/70">1-pc, 2-pc, 3-pc rates</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
