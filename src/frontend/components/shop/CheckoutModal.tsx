import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  CheckCircle, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { apiClient } from '../../../backend/apiClient.ts';
import { Order, DeliveryAddress } from '../../../database/types.ts';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const { cart, user, clearCart, refreshOrders, showToast, setCurrentView } = useApp();

  const [recipientName, setRecipientName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [addressLine, setAddressLine] = useState(user.addresses?.[0]?.addressLine || '');
  const [city, setCity] = useState(user.addresses?.[0]?.city || 'Lahore');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = 250;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation (FR-2.16)
    if (!recipientName.trim()) {
      setErrorMsg('Please enter the recipient full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Please enter a valid Pakistani phone number (e.g., 0300 1234567).');
      return;
    }
    if (!addressLine.trim() || addressLine.length < 8) {
      setErrorMsg('Please enter a complete street address with house/block numbers.');
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryAddress: DeliveryAddress = {
        id: `addr-${Date.now()}`,
        title: 'Delivery Address',
        recipientName,
        phone,
        addressLine,
        city,
        isDefault: true
      };

      const orderPayload = {
        deliveryAddress,
        userName: recipientName,
        userPhone: phone,
        userEmail: user.email,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          size: item.selectedSize,
          color: item.selectedColor,
          quantity: item.quantity,
          image: item.product.images[0]
        }))
      };

      const order = await apiClient.placeOrder(orderPayload);
      setConfirmedOrder(order);
      clearCart();
      await refreshOrders();
      setIsSubmitting(false);
      showToast(`Order ${order.orderNumber} placed successfully!`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to place order. Please verify stock.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#eed4e0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* ORDER CONFIRMATION VIEW (FR-2.18) */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                Order Placed Successfully
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 pt-1">
                Shukriya, {confirmedOrder.userName.split(' ')[0]}!
              </h2>
              <p className="text-xs text-stone-500">
                Your order is confirmed with Cash on Delivery payment.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fdf7f9] border border-[#eed4e0] space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Order Number:</span>
                <span className="font-mono font-bold text-[#903458]">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Payable at Doorstep:</span>
                <span className="font-bold text-stone-900">PKR {confirmedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="text-stone-800 text-right max-w-xs">{confirmedOrder.deliveryAddress.addressLine}, {confirmedOrder.deliveryAddress.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Contact Phone:</span>
                <span className="text-stone-800">{confirmedOrder.userPhone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onSuccess();
                  setCurrentView('orders');
                }}
                className="flex-1 py-3 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold transition-all"
              >
                Track Order Status
              </button>
              <button
                onClick={() => {
                  onSuccess();
                  setCurrentView('shop');
                }}
                className="py-3 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW (FR-2.15, FR-2.16, FR-2.17) */
          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#903458] tracking-wider">
                Cash on Delivery Checkout
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Delivery Details
              </h2>
              <p className="text-xs text-stone-500">
                Please provide your accurate delivery address and contact number in Pakistan.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Recipient Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sana Tariq"
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1 flex items-center justify-between">
                  <span>Phone Number (for Courier confirmation):</span>
                  <span className="text-[10px] text-stone-400">Strictly Required</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Street Address / House No:
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    placeholder="House 42, Block G, Phase 5, DHA"
                    className="w-full text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    City:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method Badge (FR-2.15) */}
            <div className="p-3.5 rounded-2xl bg-[#faf2f5] border border-[#eed4e0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#903458] text-white flex items-center justify-center text-xs font-bold">
                  COD
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">Cash on Delivery (Pakistan)</p>
                  <p className="text-[10px] text-stone-500">Pay cash upon parcel delivery via TCS/Leopards courier</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            {/* Order Summary Confirmation (FR-2.17) */}
            <div className="border-t border-[#eed4e0] pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal ({cart.length} item(s)):</span>
                <span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>COD Shipping Fee:</span>
                <span>PKR {shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-1 border-t border-stone-100">
                <span>Grand Total:</span>
                <span className="text-[#903458]">PKR {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#903458] hover:bg-[#782847] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Confirming Order...' : `Confirm & Place Order (PKR ${total.toLocaleString()})`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
