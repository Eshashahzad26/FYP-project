import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Layers, 
  Scissors, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Filter, 
  Clock, 
  RefreshCw,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { apiClient } from '../../../backend/apiClient.ts';
import { Product, Order, OrderStatus, StitchingRateConfig, AdminAuditLog } from '../../../database/types.ts';

export const AdminDashboard: React.FC = () => {
  const { setCurrentView, showToast, refreshProducts, products, orders, refreshOrders } = useApp();

  // Admin Auth simulation (FR-7.1, FR-7.2)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@herattire.pk');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'stitching' | 'brands' | 'audit'>('overview');

  // Stats & Logs
  const [statsData, setStatsData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Product Form Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    brand: 'Khaadi',
    category: 'Shalwar Kameez',
    price: 9500,
    color: 'Rose Pink',
    colorHex: '#C57D93',
    fabric: 'Organza',
    occasion: 'Eid',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: { XS: 5, S: 10, M: 10, L: 5, XL: 2 },
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'],
    description: 'Bespoke Pakistani luxury pret ensemble with resham threadwork.'
  });

  // Order filters (FR-7.13)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Stitching rates state (FR-7.15)
  const [stitchingRates, setStitchingRates] = useState<StitchingRateConfig | null>(null);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getAdminStats();
      setStatsData(data.stats);
      setAuditLogs(data.auditLogs);
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchRates = async () => {
    try {
      const r = await apiClient.getStitchingRates();
      setStitchingRates(r);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRates();
  }, []);

  // Admin login check (FR-7.1, FR-7.2)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@herattire.pk' && adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setAuthError(null);
      showToast('Welcome to the herAttire Seller & Store Management Console.');
    } else {
      setAuthError('Invalid credentials. (Hint: admin@herattire.pk / admin123)');
    }
  };

  // Product save / edit (FR-7.3, FR-7.4, FR-7.9, FR-7.11)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiClient.updateProduct(editingProduct.id, productForm);
        showToast(`Product "${productForm.name}" updated successfully!`);
      } else {
        await apiClient.createProduct(productForm);
        showToast(`Product "${productForm.name}" created and added to catalog!`);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await refreshProducts();
      await fetchStats();
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  };

  // Product delete with active order safety check (FR-7.5, FR-7.6, FR-7.7)
  const handleDeleteProduct = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete or deactivate "${name}"?`);
    if (!confirmed) return;

    try {
      const res = await apiClient.deleteProduct(id);
      if (res.deactivated) {
        showToast(res.message || 'Product has active orders; deactivated safely.');
      } else {
        showToast(`Product "${name}" deleted from store.`);
      }
      await refreshProducts();
      await fetchStats();
    } catch (err: any) {
      showToast('Error deleting product: ' + err.message);
    }
  };

  // Order status transition (FR-7.14)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus, `Status updated by Store Admin to ${newStatus}`);
      await refreshOrders();
      await fetchStats();
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      showToast('Error: ' + err.message);
    }
  };

  // Stitching rates update (FR-7.15)
  const handleUpdateStitchingRate = async (garment: string, amount: number) => {
    if (!stitchingRates) return;
    const updatedRates: StitchingRateConfig = {
      ...stitchingRates,
      garmentBaseRates: {
        ...stitchingRates.garmentBaseRates,
        [garment]: amount
      }
    };
    await apiClient.updateStitchingRates(updatedRates);
    setStitchingRates(updatedRates);
    showToast(`Base rate for "${garment}" updated to PKR ${amount.toLocaleString()}`);
  };

  // Login screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white border border-[#eed4e0] shadow-xl space-y-5">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#903458] text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Admin / Seller Portal
          </h2>
          <p className="text-xs text-stone-500">
            Authorized store managers and catalog controllers only.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Admin Email:</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">Admin Password:</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#903458]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#903458] text-white text-xs font-bold hover:bg-[#782847] transition-all cursor-pointer"
          >
            Authenticate Admin
          </button>
        </form>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Customer Store</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">Admin & Seller Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>Admin Console</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
              Super Admin
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#eed4e0] text-xs font-semibold text-stone-700 hover:bg-[#faedf2]"
          >
            Return to Customer Store
          </button>
          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="p-2 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50"
            title="Log Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#eed4e0] overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Statistics' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'stitching', label: 'Stitching Rates' },
          { id: 'audit', label: `Audit Log (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#903458] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-[#faedf2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB (FR-7.16, FR-7.17) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#eed4e0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total COD Orders</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{orders.length}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+12% this week</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eed4e0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Sales Volume</span>
              <p className="text-2xl font-serif font-bold text-[#903458] mt-1">
                PKR {orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0).toLocaleString()}
              </p>
              <span className="text-[10px] text-stone-400">Cash on Delivery collected</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eed4e0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Catalog Inventory</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{products.length} Designs</p>
              <span className="text-[10px] text-stone-500">Across 6 Pakistani brands</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eed4e0] shadow-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Try-On Engagement</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1">94% Fit Rate</p>
              <span className="text-[10px] text-purple-600 font-semibold">IDM-VTON active</span>
            </div>
          </div>

          {/* Popular Items Table (FR-7.17) */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#903458]" />
              <span>Top Trending Outfits (Based on Orders & Try-Ons)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#eed4e0] text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-2">Garment</th>
                    <th className="py-2">Brand</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Price (PKR)</th>
                    <th className="py-2">Popularity Score</th>
                    <th className="py-2">Total Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5).map((p) => {
                    const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
                    return (
                      <tr key={p.id}>
                        <td className="py-3 font-semibold text-stone-900 flex items-center gap-2">
                          <img src={p.images[0]} alt={p.name} className="w-8 h-10 object-cover rounded" />
                          <span>{p.name}</span>
                        </td>
                        <td className="py-3 text-[#903458] font-bold">{p.brand}</td>
                        <td className="py-3 text-stone-600">{p.category}</td>
                        <td className="py-3 font-bold text-stone-800">PKR {p.price.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded font-mono font-bold bg-[#faedf2] text-[#903458]">
                            {p.popularity}/100
                          </span>
                        </td>
                        <td className="py-3 text-stone-700">{totalStock} in stock</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS MANAGEMENT TAB (FR-7.3, FR-7.4, FR-7.5, FR-7.6, FR-7.7, FR-7.9, FR-7.11) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Product & Stock Inventory
            </h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  brand: 'Khaadi',
                  category: 'Shalwar Kameez',
                  price: 9500,
                  color: 'Rose Pink',
                  colorHex: '#C57D93',
                  fabric: 'Organza',
                  occasion: 'Eid',
                  sizes: ['XS', 'S', 'M', 'L', 'XL'],
                  stock: { XS: 5, S: 10, M: 10, L: 5, XL: 2 },
                  images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop&q=80'],
                  description: 'Pakistani luxury pret garment.'
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="rounded-2xl bg-white border border-[#eed4e0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#faedf2] text-[#903458] uppercase text-[10px] font-bold">
                    <th className="p-3">Outfit</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Sizes / Stock Levels</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className={!prod.isActive ? 'opacity-50 bg-stone-50' : ''}>
                      <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover rounded-md" />
                        <div>
                          <p className="font-serif font-bold text-xs">{prod.name}</p>
                          <p className="text-[10px] text-stone-400">{prod.category} · {prod.fabric}</p>
                        </div>
                      </td>
                      <td className="p-3 text-[#903458] font-bold">{prod.brand}</td>
                      <td className="p-3 font-bold text-stone-800">PKR {prod.price.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {Object.entries(prod.stock).map(([sz, qty]) => (
                            <span key={sz} className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                              {sz}: <strong>{qty}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {prod.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setProductForm(prod);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-[#903458] hover:bg-[#faedf2] rounded-lg"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete / Deactivate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDERS MANAGEMENT TAB (FR-7.12, FR-7.13, FR-7.14) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Customer Orders ({filteredOrders.length})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs bg-white border border-[#eed4e0] rounded-lg p-1.5 text-stone-800 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#eed4e0] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eed4e0] pb-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-[#903458]">{ord.orderNumber}</span>
                    <span className="mx-2 text-stone-300">·</span>
                    <span className="text-xs text-stone-700 font-bold">{ord.userName}</span>
                    <span className="text-xs text-stone-400"> ({ord.userPhone})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-900">Total: PKR {ord.total.toLocaleString()}</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                      className="text-xs font-bold bg-[#faedf2] text-[#903458] border border-[#eed4e0] rounded-lg p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <div>
                    <span>Address: <strong>{ord.deliveryAddress.addressLine}, {ord.deliveryAddress.city}</strong></span>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {ord.items.length} item(s): {ord.items.map(i => `${i.productName} (${i.size})`).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. STITCHING RATES MANAGEMENT TAB (FR-7.15) */}
      {activeTab === 'stitching' && stitchingRates && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#903458]" />
              <span>Tailoring Base Rates (Admin Configurable)</span>
            </h3>
            <p className="text-xs text-stone-500">
              These rates directly calculate customer estimates in the Stitching Cost Estimator and Dulhan Mode modules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(stitchingRates.garmentBaseRates).map(([garment, rate]) => (
                <div key={garment} className="p-3.5 rounded-xl bg-[#fdf8fa] border border-[#eed4e0] flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{garment}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">PKR</span>
                    <input
                      type="number"
                      defaultValue={rate}
                      onBlur={(e) => handleUpdateStitchingRate(garment, Number(e.target.value))}
                      className="w-24 text-xs font-bold p-1 bg-white border border-[#eed4e0] rounded text-stone-900 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIT LOG TAB (FR-7.18) */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-white border border-[#eed4e0] p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#903458]" />
            <span>Store Admin Action Audit Trail (FR-7.18)</span>
          </h3>
          <p className="text-xs text-stone-500">
            Immutable log of all store inventory adjustments, price updates, and order status transitions.
          </p>

          <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                <div>
                  <span className="font-bold text-[#903458]">{log.adminName}</span>
                  <span className="mx-2 text-stone-300">·</span>
                  <span className="font-semibold text-stone-800">{log.action}</span>
                  <p className="text-stone-500 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-stone-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL (FR-7.3, FR-7.4) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border border-[#eed4e0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingProduct ? 'Edit Pakistani Garment' : 'Add New Pakistani Garment'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Sultana Zardozi Velvet Angrakha"
                  className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Brand:</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value as any })}
                    className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
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
                  <label className="font-bold text-stone-700 block mb-1">Category:</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                  >
                    <option value="Shalwar Kameez">Shalwar Kameez</option>
                    <option value="Kurti">Kurti</option>
                    <option value="Abaya">Abaya</option>
                    <option value="Lehenga">Lehenga</option>
                    <option value="Bridal Wear">Bridal Wear</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Price (PKR):</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fabric:</label>
                  <select
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value as any })}
                    className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                  >
                    <option value="Lawn">Lawn</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Organza">Organza</option>
                    <option value="Silk">Silk</option>
                    <option value="Velvet">Velvet</option>
                    <option value="Jacquard">Jacquard</option>
                    <option value="Net">Net</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Occasion:</label>
                  <select
                    value={productForm.occasion}
                    onChange={(e) => setProductForm({ ...productForm, occasion: e.target.value as any })}
                    className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                  >
                    <option value="Daily Wear">Daily Wear</option>
                    <option value="Casual">Casual</option>
                    <option value="Semi-Formal">Semi-Formal</option>
                    <option value="Eid">Eid</option>
                    <option value="Mehndi">Mehndi</option>
                    <option value="Barat">Barat</option>
                    <option value="Walima">Walima</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Image URL:</label>
                <input
                  type="url"
                  value={productForm.images?.[0]}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#903458] text-white font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
