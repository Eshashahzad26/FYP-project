import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Check, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    user, 
    updateUser, 
    showToast 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  // Password validation (FR-1.3)
  const isPasswordValid = (pwd: string) => {
    return pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email/username and password.');
      return;
    }

    // Success simulation
    updateUser({ email, name: email.split('@')[0] || 'Sana Tariq' });
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${email.split('@')[0]}!`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!isPasswordValid(password)) {
      setErrorMsg('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    updateUser({
      name,
      email,
      phone: phone || '+92 300 0000000',
      role: 'customer'
    });

    setIsAuthModalOpen(false);
    showToast('Account successfully created! Welcome to herAttire Aesthetics.');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setResetSuccess(true);
    showToast(`Password reset link sent to ${email}`);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#eed4e0] shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. LOGIN MODE (Directly matches Wireframe Page 14: "Welcome Back to AttireAesthetics") */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#903458]">
                herAttire Aesthetics
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900 italic">
                Welcome Back
              </h2>
              <p className="text-xs text-[#903458] font-serif font-bold">
                to AttireAesthetics
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Enter username / email:
                </label>
                <input
                  type="text"
                  required
                  placeholder="sana.tariq@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Enter password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-1.5 text-stone-600">
                <input type="checkbox" defaultChecked className="accent-[#903458]" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('forgot');
                }}
                className="text-[#903458] font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Log in
            </button>

            <div className="text-center text-xs text-stone-500 pt-2 border-t border-[#eed4e0]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('register');
                }}
                className="text-[#903458] font-bold hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER MODE (Directly matches Wireframe Page 15: "Create Account to Create your looks") */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-serif font-bold text-[#903458] italic leading-tight">
                Create Account
              </h2>
              <p className="text-xs font-serif font-bold text-stone-700 italic">
                To Create your looks
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sana Tariq"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Enter username/email:
                </label>
                <input
                  type="email"
                  required
                  placeholder="sana@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  placeholder="+92 301 4589211"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Enter password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 chars (letters + numbers)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Confirm password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Sign Up
            </button>

            <div className="text-center text-xs text-stone-500 pt-2 border-t border-[#eed4e0]">
              Already have account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setAuthMode('login');
                }}
                className="text-[#903458] font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE (Directly matches Wireframe Page 16: "Forgot your password?") */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#903458]">
                herAttire Aesthetics
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Forgot your password?
              </h2>
              <p className="text-xs text-stone-500">
                Enter your email address and send you reset link
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold">Password reset link has been dispatched to {email}.</p>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-[#903458] underline"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#fdf5f7] border-2 border-[#903458]/40 rounded-xl text-stone-900 focus:outline-none focus:border-[#903458]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#903458] hover:bg-[#782847] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>SEND RESET LINK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-xs text-stone-500 hover:text-[#903458]"
                  >
                    ← Back to Login
                  </button>
                </div>
              </>
            )}
          </form>
        )}

      </div>
    </div>
  );
};
