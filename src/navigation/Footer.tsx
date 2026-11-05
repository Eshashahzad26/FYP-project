import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart, Phone, Mail } from 'lucide-react';
import { useApp } from '../frontend/context/AppContext.tsx';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-white border-t border-[#ebd2dd] text-stone-700 text-xs mt-16">
      {/* Guarantees banner */}
      <div className="border-b border-[#f0dce5] bg-[#faf0f4]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-[#903458]/10 text-[#903458]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-stone-500">Available across all Pakistani cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-[#903458]/10 text-[#903458]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">AI Accurate Sizing</p>
              <p className="text-[11px] text-stone-500">Cross-brand size charts & fit guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-[#903458]/10 text-[#903458]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">7-Day Easy Exchange</p>
              <p className="text-[11px] text-stone-500">Hassle-free size replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2.5 rounded-full bg-[#903458]/10 text-[#903458]">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-stone-900">Crafted for Pakistani Women</p>
              <p className="text-[11px] text-stone-500">Dulhan looks, abayas & modest cuts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#903458] flex items-center justify-center text-white font-serif font-bold text-lg">
                H
              </div>
              <span className="font-serif text-lg font-bold text-[#903458]">
                herAttire Aesthetics
              </span>
            </div>
            <p className="text-stone-600 leading-relaxed max-w-sm">
              Pakistan’s premier AI-powered virtual try-on and ethnic fashion portal. Helping women try on shalwar kameez, kurtis, abayas, and bridal lehengas with confidence before purchase.
            </p>
            <div className="flex items-center gap-4 text-stone-500 pt-2">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#903458]" /> +92 (42) 3578-9000</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#903458]" /> care@herattire.pk</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">
              Explore Modules
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('live-me')} className="hover:text-[#903458]">Live Me Virtual Try-On</button></li>
              <li><button onClick={() => setCurrentView('for-you')} className="hover:text-[#903458]">For You AI Styling</button></li>
              <li><button onClick={() => setCurrentView('dulhan-mode')} className="hover:text-[#903458]">Dulhan Mode (Wedding)</button></li>
              <li><button onClick={() => setCurrentView('hijab-matching')} className="hover:text-[#903458]">Hijab & Dupatta Matcher</button></li>
              <li><button onClick={() => setCurrentView('stitching')} className="hover:text-[#903458]">Stitching Cost Estimator</button></li>
            </ul>
          </div>

          {/* Pakistani Brands */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">
              Featured Brands
            </h4>
            <ul className="space-y-2">
              <li><span className="text-stone-600">Khaadi Pret & Unstitched</span></li>
              <li><span className="text-stone-600">Sapphire Silk & Daily</span></li>
              <li><span className="text-stone-600">Maria.B Bridal & Couture</span></li>
              <li><span className="text-stone-600">Sana Safinaz Luxury</span></li>
              <li><span className="text-stone-600">Baroque Embroidered Chiffon</span></li>
              <li><span className="text-stone-600">Gul Ahmed Festive</span></li>
            </ul>
          </div>

          {/* Disclaimer & Privacy */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-3 uppercase tracking-wider text-[11px]">
              Security & Privacy
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed mb-3">
              Per NFR-13: Your uploaded photos, body measurements, and skin tone data remain private to your account and are encrypted. Photos are never shared without explicit user link creation.
            </p>
            <p className="text-[10px] text-stone-400 italic">
              Virtual try-on output is an AI approximation for visual fit simulation and may differ slightly in fabric sheen and cut.
            </p>
          </div>
        </div>

        <div className="border-t border-[#f0dbe5] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-4">
          <p>© 2026 herAttire Aesthetics. All rights reserved. Designed for Pakistani women.</p>
          <div className="flex gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Size Charts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
