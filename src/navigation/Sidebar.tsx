import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Camera, 
  Sparkles, 
  User, 
  Heart, 
  Package, 
  Crown, 
  Scissors, 
  LogOut, 
  ShieldCheck,
  Palette
} from 'lucide-react';
import { useApp, AppView } from '../frontend/context/AppContext.tsx';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { currentView, setCurrentView, user, setIsAuthModalOpen, setAuthMode, showToast } = useApp();

  const links: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'live-me', label: 'Live Me', icon: <Camera className="w-4 h-4" /> },
    { id: 'for-you', label: 'For You', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'body-analysis', label: 'Personalized Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'my-looks', label: 'My Looks', icon: <Heart className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="w-4 h-4" /> },
    { id: 'dulhan-mode', label: 'Dulhan Mode', icon: <Crown className="w-4 h-4" /> },
    { id: 'stitching', label: 'Stitching Cost', icon: <Scissors className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#edd4df] min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="mb-6 px-3">
          <h2 className="text-xl font-serif font-bold text-[#903458] tracking-tight">
            Dashboard
          </h2>
          <p className="text-xs text-stone-500 font-medium">Her Attire Aesthetics</p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#903458] text-white font-semibold shadow-sm'
                    : 'text-stone-700 hover:bg-[#faebf1] hover:text-[#903458]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-[#903458]'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-[#edd4df] space-y-2">
        <button
          onClick={() => setCurrentView('admin')}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-stone-500" />
          <span>Admin Portal</span>
        </button>

        <button
          onClick={() => {
            showToast('Logged out successfully.');
            setAuthMode('login');
            setIsAuthModalOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
