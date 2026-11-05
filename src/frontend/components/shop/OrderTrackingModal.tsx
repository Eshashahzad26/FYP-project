import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { apiClient } from '../../../backend/apiClient.ts';
import { Order, OrderStatus } from '../../../database/types.ts';

export const OrderTrackingView: React.FC = () => {
  const { orders, refreshOrders, showToast, setCurrentView } = useApp();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await apiClient.cancelOrder(orderId);
      await refreshOrders();
      setCancellingOrderId(null);
      showToast('Order cancelled successfully. Inventory restored.');
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending Verification</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Confirmed by Store</span>;
      case 'Out for Delivery':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
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
            <span className="text-[#903458] font-medium">Order History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>My Orders & Tracking</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Cash on Delivery
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track courier delivery timeline and review past Pakistani designer purchases.
          </p>
        </div>

        <button
          onClick={() => refreshOrders()}
          className="px-3.5 py-2 rounded-full bg-white border border-[#eed4e0] hover:bg-[#faedf2] text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#903458]" />
          <span>Refresh Status</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#eed4e0] p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-[#eed4e0] mx-auto" />
          <h3 className="font-serif font-bold text-lg text-stone-800">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You haven't placed any Cash on Delivery orders yet. Browse our catalog and try on outfits virtually!
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-6 py-2.5 rounded-full bg-[#903458] text-white text-xs font-bold hover:bg-[#782847]"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancelOrder = order.status === 'Pending' || order.status === 'Confirmed';
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-4 hover:border-[#c57d93] transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eed4e0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#903458]">
                        {order.orderNumber}
                      </span>
                      <span>·</span>
                      <span className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Payment: {order.paymentMethod} (Payable at doorstep)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-base font-bold text-stone-900">
                      PKR {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#903458] uppercase">{item.brand}</span>
                        <h4 className="font-semibold text-stone-900 truncate">{item.productName}</h4>
                        <p className="text-stone-500 text-[11px]">
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold text-stone-800">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status Timeline History (FR-2.21) */}
                <div className="p-3 rounded-xl bg-[#fcf7f9] border border-[#eed4e0] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Status Timeline:</span>
                  <div className="space-y-1">
                    {order.statusHistory.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-[11px] text-stone-600">
                        <span className="w-2 h-2 rounded-full bg-[#903458]"></span>
                        <strong className="text-stone-800">{step.status}</strong>
                        <span>·</span>
                        <span className="text-stone-400">
                          {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {step.note && <span className="text-stone-500 italic">({step.note})</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Row: Cancel Order before shipment (FR-2.22) */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-stone-500">
                    Delivery to: <strong>{order.deliveryAddress.addressLine}, {order.deliveryAddress.city}</strong>
                  </div>

                  {canCancelOrder && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
