import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  UserProfile, 
  CartItem, 
  SavedOutfit, 
  Order 
} from '../../database/types.ts';
import { apiClient } from '../../backend/apiClient.ts';
import { INITIAL_USER, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SAVED_OUTFITS } from '../../database/mockDatabase.ts';

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
  registerUser: (payload: { name: string; email: string; phone: string; password: string }) => Promise<UserProfile>;
  loginUser: (email: string, password: string) => Promise<UserProfile>;
  logoutUser: () => void;
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

const USERS_STORAGE_KEY = 'herAttire_users_v1';
const CURRENT_USER_STORAGE_KEY = 'herAttire_current_user_v1';
const CART_STORAGE_KEY = 'herAttire_cart_v1';
const WISHLIST_STORAGE_KEY = 'herAttire_wishlist_v1';

const readLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const hashPassword = async (password: string): Promise<string> => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return password;
  }

  const data = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const defaultGuestUser: UserProfile = {
  ...INITIAL_USER,
  id: 'guest-user',
  name: 'Guest',
  email: '',
  phone: '',
  addresses: [],
  favoriteColors: [],
  preferredStyles: [],
  role: 'customer'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => readLocalStorage<CartItem[]>(CART_STORAGE_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readLocalStorage<string[]>(WISHLIST_STORAGE_KEY, ['prod-1', 'prod-6']));
  const [user, setUser] = useState<UserProfile>(() => readLocalStorage<UserProfile>(CURRENT_USER_STORAGE_KEY, INITIAL_USER));
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(INITIAL_SAVED_OUTFITS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeProductForTryOn, setActiveProductForTryOn] = useState<Product | null>(null);
  const [selectedProductIdForModal, setSelectedProductIdForModal] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data.length ? data : INITIAL_PRODUCTS);
    } catch (err) {
      console.error(err);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  const refreshSavedOutfits = async () => {
    try {
      const data = await apiClient.getSavedOutfits();
      setSavedOutfits(data.length ? data : INITIAL_SAVED_OUTFITS);
    } catch (err) {
      console.error(err);
      setSavedOutfits(INITIAL_SAVED_OUTFITS);
    }
  };

  const refreshOrders = async () => {
    try {
      const data = await apiClient.getOrders();
      setOrders(data.length ? data : INITIAL_ORDERS);
    } catch (err) {
      console.error(err);
      setOrders(INITIAL_ORDERS);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshSavedOutfits();
    refreshOrders();
  }, []);

  const addToCart = (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL', color: string, qty = 1) => {
    const available = product.stock[size] || 0;
    const existing = cart.find(item => item.productId === product.id && item.selectedSize === size && item.selectedColor === color);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + qty > available) {
      showToast(`Only ${available} item(s) available in size ${size}.`);
      return;
    }

    if (existing) {
      setCart(cart.map(item =>
        item.id === existing.id ? { ...item, quantity: item.quantity + qty } : item
      ));
    } else {
      setCart([
        ...cart,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        }
      ]);
    }

    showToast(`${product.name} (${size}) added to bag.`);
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
      showToast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to wishlist');
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const registerUser = async (payload: { name: string; email: string; phone: string; password: string }) => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const password = payload.password.trim();

    if (!payload.name.trim()) throw new Error('Please enter your full name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail)) throw new Error('Please enter a valid email address.');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain both letters and numbers.');
    }

    const usersStore = readLocalStorage<Record<string, UserProfile>>(USERS_STORAGE_KEY, {});
    if (usersStore[normalizedEmail]) {
      throw new Error('This email is already registered.');
    }

    const newUser: UserProfile = {
      ...INITIAL_USER,
      id: `usr-${Date.now()}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      phone: payload.phone || '+92 300 0000000',
      passwordHash: await hashPassword(password),
      addresses: INITIAL_USER.addresses,
      favoriteColors: [...INITIAL_USER.favoriteColors],
      preferredStyles: [...INITIAL_USER.preferredStyles],
      styleProfileNotes: [...(INITIAL_USER.styleProfileNotes || [])],
      role: 'customer'
    };

    usersStore[normalizedEmail] = newUser;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersStore));
    }

    setUser(newUser);
    return newUser;
  };

  const loginUser = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const usersStore = readLocalStorage<Record<string, UserProfile>>(USERS_STORAGE_KEY, {});
    const storedUser = usersStore[normalizedEmail];

    if (!storedUser) {
      throw new Error('No account found for this email.');
    }

    const passwordHash = await hashPassword(password);
    if (storedUser.passwordHash !== passwordHash) {
      throw new Error('Incorrect email or password.');
    }

    const cleanUser: UserProfile = {
      ...storedUser,
      id: storedUser.id || `usr-${Date.now()}`,
      email: normalizedEmail,
      name: storedUser.name || 'Sana Tariq'
    };

    setUser(cleanUser);
    return cleanUser;
  };

  const logoutUser = () => {
    setUser(defaultGuestUser);
    setCart([]);
    setWishlist(['prod-1', 'prod-6']);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  };

  const deleteSavedOutfit = async (id: string) => {
    setSavedOutfits(prev => prev.filter(outfit => outfit.id !== id));
    await apiClient.deleteSavedOutfit(id);
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
        registerUser,
        loginUser,
        logoutUser,
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
