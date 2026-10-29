import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Camera, 
  Scissors, 
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../frontend/context/AppContext.tsx';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cart, 
    wishlist, 
    setIsCartOpen, 
    user, 
    setIsAuthModalOpen, 
    setAuthMode,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'live-me', label: 'Live Me (Try-On)' },
    { id: 'for-you', label: 'For You (AI Styling)' },
    { id: 'dulhan-mode', label: 'Dulhan Mode' },
    { id: 'stitching', label: 'Stitching Estimator' },
    { id: 'my-looks', label: 'My Looks' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#edd2dd]">
      {/* Top micro announcement bar */}
      <div className="bg-[#903458] text-white py-1.5 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-2 font-medium">
        <span>✨ Cash on Delivery (COD) All Over Pakistan · IDM-VTON AI Virtual Try-On · Free Size Exchange</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#903458] hover:bg-[#faebf1] rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Name (Wireframe style: HER ATTIRE AESTHETICS) */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-full bg-[#903458] flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#903458] uppercase">
                Her Attire
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#ab5377] font-medium -mt-1 uppercase">
                Aesthetics
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    active 
                      ? 'bg-[#903458] text-white shadow-sm' 
                      : 'text-stone-700 hover:text-[#903458] hover:bg-[#fbf0f4]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Search bar & Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-44 lg:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search kurti, bridal..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'shop') setCurrentView('shop');
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#fdf5f7] border border-[#ecd5df] rounded-full focus:outline-none focus:ring-1 focus:ring-[#903458] text-stone-800 placeholder-stone-400"
              />
            </div>

            {/* Quick Try-On Button */}
            <button
              onClick={() => setCurrentView('live-me')}
              title="Virtual Try-On"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#903458] bg-[#faebf1] hover:bg-[#f5dae4] rounded-full transition-colors border border-[#e8c6d4]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Try On</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('shop')}
              className="relative p-2 text-stone-700 hover:text-[#903458] hover:bg-[#fbf0f4] rounded-full transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#903458] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-[#903458] hover:bg-[#fbf0f4] rounded-full transition-colors"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#903458] text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <button
              onClick={() => {
                if (user) {
                  setCurrentView('profile');
                } else {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-[#ebd0dd] hover:bg-[#fcf3f6] transition-colors"
              title="User Account"
            >
              <img 
                src={user?.profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt="Profile" 
                className="w-7 h-7 rounded-full object-cover border border-[#903458]/30"
              />
              <span className="text-xs font-medium text-stone-800 hidden sm:inline">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Admin Switcher */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`p-2 rounded-full text-xs font-medium border transition-colors ${
                currentView === 'admin' 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#eed5df] bg-[#FAF2F4] px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                currentView === item.id 
                  ? 'bg-[#903458] text-white' 
                  : 'text-stone-800 hover:bg-[#f5e1ea]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#eed5df] flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Admin Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView('orders');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-[#903458]"
            >
              Order History & Tracking
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
