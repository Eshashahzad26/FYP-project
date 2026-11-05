import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus 
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckoutModal } from './CheckoutModal.tsx';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateCartQty, removeFromCart, setCurrentView } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = cart.length > 0 ? 250 : 0;
  const total = subtotal + shippingFee;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-[#eed4e0]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#eed4e0] flex items-center justify-between bg-[#fdf7f9]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#903458]" />
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list (FR-2.12, FR-2.13) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#eed4e0] mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-800">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Explore our curated Pakistani designer collection and try on outfits before adding them to bag.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#903458] text-white text-xs font-semibold hover:bg-[#782847]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-[#eed4e0] bg-white shadow-2xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-bold text-[#903458] uppercase">
                            {item.product.brand}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        <span>Size: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#eed4e0] rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-[#faedf2]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-[#faedf2]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#903458]">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#eed4e0] bg-[#fdf7f9] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-stone-900">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Cash on Delivery Courier (TCS):</span>
                  <span className="font-semibold text-stone-900">PKR {shippingFee}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-[#eed4e0]">
                  <span>Total Amount (COD):</span>
                  <span className="text-[#903458] text-base">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Proceed to Cash on Delivery Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-1">
                <Truck className="w-3.5 h-3.5 text-[#903458]" />
                <span>Pay cash when your parcel arrives at your doorstep</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen(false);
          }}
        />
      )}
    </>
  );
};
