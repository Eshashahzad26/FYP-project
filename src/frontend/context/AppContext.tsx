import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  UserProfile, 
  CartItem, 
  SavedOutfit, 
  Order 
} from '../../database/types.ts';
import { apiClient } from '../../backend/apiClient.ts';
import { INITIAL_USER } from '../../database/mockDatabase.ts';

export type AppView = 
  | 'home'
  | 'shop'
  | 'live-me'
  | 'live-webcam'
  | 'body-analysis'
  | 'for-you'
  | 'dulhan-mode'
  | 'hijab-matching'
  | 'stitching'
  | 'my-looks'
  | 'orders'
  | 'profile'
  | 'admin';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  products: Product[];
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  user: UserProfile;
  updateUser: (updated: Partial<UserProfile>) => void;
  savedOutfits: SavedOutfit[];
  refreshSavedOutfits: () => Promise<void>;
  deleteSavedOutfit: (id: string) => Promise<void>;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  activeProductForTryOn: Product | null;
  setActiveProductForTryOn: (p: Product | null) => void;
  selectedProductIdForModal: string | null;
  setSelectedProductIdForModal: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  activeShareId: string | null;
  setActiveShareId: (id: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-6']);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeProductForTryOn, setActiveProductForTryOn] = useState<Product | null>(null);
  const [selectedProductIdForModal, setSelectedProductIdForModal] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshSavedOutfits = async () => {
    try {
      const data = await apiClient.getSavedOutfits();
      setSavedOutfits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshOrders = async () => {
    try {
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshSavedOutfits();
    refreshOrders();
  }, []);

  const addToCart = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string, qty = 1) => {
    // Check available stock
    const available = product.stock[size] || 0;
    const existing = cart.find(item => item.productId === product.id && item.selectedSize === size);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty + qty > available) {
      showToast(`Cannot add more. Only ${available} item(s) available in size ${size}.`);
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.id === existing.id 
          ? { ...item, quantity: item.quantity + qty } 
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty
      };
      setCart([...cart, newItem]);
    }
    showToast(`Added ${product.name} (${size}) to your bag!`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter(item => item.id !== cartItemId));
  };

  const updateCartQty = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const item = cart.find(c => c.id === cartItemId);
    if (item) {
      const maxAvailable = item.product.stock[item.selectedSize] || 0;
      if (newQty > maxAvailable) {
        showToast(`Only ${maxAvailable} available in stock.`);
        return;
      }
    }
    setCart(cart.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from Wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Saved to Wishlist!');
    }
  };

  const updateUser = async (updated: Partial<UserProfile>) => {
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    try {
      await apiClient.updateUserProfile(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteSavedOutfit = async (id: string) => {
    await apiClient.deleteSavedOutfit(id);
    setSavedOutfits(savedOutfits.filter(o => o.id !== id));
    showToast('Saved outfit removed.');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        wishlist,
        toggleWishlist,
        user,
        updateUser,
        savedOutfits,
        refreshSavedOutfits,
        deleteSavedOutfit,
        orders,
        refreshOrders,
        activeProductForTryOn,
        setActiveProductForTryOn,
        selectedProductIdForModal,
        setSelectedProductIdForModal,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        activeShareId,
        setActiveShareId,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
