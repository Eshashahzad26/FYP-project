import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Ruler, 
  Palette, 
  ShieldCheck, 
  Trash2, 
  Save, 
  Plus, 
  Check, 
  AlertTriangle,
  Lock,
  Phone,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { DeliveryAddress } from '../../../database/types.ts';

export const UserProfileView: React.FC = () => {
  const { user, updateUser, showToast, setCurrentView } = useApp();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(user.addresses || []);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(user.favoriteColors || []);
  const [preferredStyles, setPreferredStyles] = useState<string[]>(user.preferredStyles || []);

  const [newColorInput, setNewColorInput] = useState('');
  const [newStyleInput, setNewStyleInput] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newAddrTitle, setNewAddrTitle] = useState('Home');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      phone,
      profilePic,
      addresses,
      favoriteColors,
      preferredStyles
    });
    showToast('Profile and preferences updated successfully!');
  };

  const handleAddAddress = () => {
    if (!newAddressLine.trim()) return;
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      title: newAddrTitle,
      recipientName: name,
      phone,
      addressLine: newAddressLine,
      city: newCity,
      isDefault: addresses.length === 0
    };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    updateUser({ addresses: updated });
    setNewAddressLine('');
    setShowAddressForm(false);
    showToast('New delivery address added!');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    updateUser({ addresses: updated });
    showToast('Delivery address removed.');
  };

  // FR-1.16 Account Deletion
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your herAttire Aesthetics account, saved measurements, and photos? This action cannot be undone.'
    );
    if (!confirmed) return;

    showToast('Account and all related personal data permanently deleted.');
    setCurrentView('home');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eed4e0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="hover:text-[#903458] cursor-pointer" onClick={() => setCurrentView('home')}>Home</span>
            <span>/</span>
            <span className="text-[#903458] font-medium">User Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 flex items-center gap-2.5">
            <span>Profile & Account Settings</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#faebf1] text-[#903458] border border-[#e8c7d5]">
              Customer
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal sizing measurements, saved addresses, and style preferences.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2 rounded-full bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Avatar & Basic Information (FR-1.10) */}
        <div className="md:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#903458] shadow-sm">
              <img
                src={profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">{name}</h3>
              <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#903458]" /> {user.email}
              </p>
              <p className="text-xs text-stone-500 flex items-center justify-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#903458]" /> {phone}
              </p>
            </div>

            <div className="space-y-3 text-left pt-2 border-t border-[#eed4e0]">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Phone Number (COD):</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Avatar Image URL:</label>
                <input
                  type="url"
                  value={profilePic}
                  onChange={(e) => setProfilePic(e.target.value)}
                  className="w-full text-xs p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-xl text-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Quick link to Body Analysis (FR-1.12) */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#903458]" />
                <span>Saved Measurements (FR-1.12)</span>
              </h4>
              <button
                onClick={() => setCurrentView('body-analysis')}
                className="text-xs text-[#903458] font-bold hover:underline"
              >
                Re-Analyze
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#fcf8fa] rounded-lg">
                <span className="text-stone-500 block text-[10px]">Height</span>
                <span className="font-bold text-stone-900">{user.measurements?.heightCm || 165} cm</span>
              </div>
              <div className="p-2 bg-[#fcf8fa] rounded-lg">
                <span className="text-stone-500 block text-[10px]">Bust / Chest</span>
                <span className="font-bold text-stone-900">{user.measurements?.bustInches || 37}"</span>
              </div>
              <div className="p-2 bg-[#fcf8fa] rounded-lg">
                <span className="text-stone-500 block text-[10px]">Waist</span>
                <span className="font-bold text-stone-900">{user.measurements?.waistInches || 29.5}"</span>
              </div>
              <div className="p-2 bg-[#fcf8fa] rounded-lg">
                <span className="text-stone-500 block text-[10px]">Hips</span>
                <span className="font-bold text-stone-900">{user.measurements?.hipsInches || 39.5}"</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Addresses & Preferences (FR-1.11, FR-1.13, FR-1.16) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Delivery Addresses (FR-1.11) */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#903458]" />
                <span>Saved Delivery Addresses</span>
              </h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-bold text-[#903458] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address list */}
            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3.5 rounded-xl border border-[#eed4e0] bg-[#fdf8fa] flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900">{addr.title}</strong>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 mt-1">{addr.addressLine}, {addr.city}</p>
                    <p className="text-stone-400 text-[11px] mt-0.5">Contact: {addr.recipientName} ({addr.phone})</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Address Form Modal / Inline */}
            {showAddressForm && (
              <div className="p-4 rounded-xl bg-white border-2 border-[#903458] space-y-3 text-xs">
                <h4 className="font-bold text-stone-900">New Address:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Address Title (e.g. Home, Office)"
                    value={newAddrTitle}
                    onChange={(e) => setNewAddrTitle(e.target.value)}
                    className="p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-lg"
                  />
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-lg"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Street / House address"
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  className="w-full p-2 bg-[#fdf5f7] border border-[#eed4e0] rounded-lg"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="px-4 py-1.5 rounded-lg bg-[#903458] text-white font-bold"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorite Colors & Preferred Styles (FR-1.13) */}
          <div className="rounded-2xl bg-white border border-[#eed4e0] p-5 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#903458]" />
              <span>Favorite Colors & Preferred Styles (FR-1.13)</span>
            </h3>

            {/* Colors */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">Favorite Colors:</label>
              <div className="flex flex-wrap gap-1.5">
                {favoriteColors.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#faedf2] text-[#903458] border border-[#eed4e0] flex items-center gap-1.5"
                  >
                    <span>{col}</span>
                    <button
                      onClick={() => setFavoriteColors(favoriteColors.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 text-stone-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Styles */}
            <div className="space-y-1.5 pt-2 border-t border-[#eed4e0]">
              <label className="text-xs font-semibold text-stone-700 block">Preferred Pakistani Cuts:</label>
              <div className="flex flex-wrap gap-1.5">
                {preferredStyles.map((sty, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1.5"
                  >
                    <span>{sty}</span>
                    <button
                      onClick={() => setPreferredStyles(preferredStyles.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 text-stone-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Account Deletion (FR-1.16) */}
          <div className="rounded-2xl bg-red-50/50 border border-red-200 p-5 space-y-2">
            <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone (FR-1.16)</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Permanently delete your account, saved measurements, try-on history, and addresses. This cannot be reversed.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
            >
              Permanently Delete Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
