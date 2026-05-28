import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';

const AdminLoginPage = () => {
  const { loginAdmin, isDarkMode, setIsDarkMode } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }

    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setLoading(false);

      if (res.success) {
        navigate('/admin'); // Redirect to dashboard
      } else {
        setError(res.error);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-surface flex flex-col items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background visual details */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 rounded-full bg-accent/10 blur-3xl" />

      {/* Floating Theme toggler in login */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 p-2 rounded-xl bg-bg-card border border-border-theme text-text-sub transition-colors shadow-sm cursor-pointer"
      >
        {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md bg-bg-card rounded-modal p-6 sm:p-8 shadow-xl border border-border-theme z-10 animate-scale-up">
        {/* Brand Console emblem */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow shadow-primary/20 animate-float">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bistro Admin Portal
            </h1>
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
              Store Management Console
            </p>
          </div>
        </div>

        {/* Validation Error Alerts */}
        {error && (
          <div className="mb-6 p-3 rounded-btn bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 animate-slide-up">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">
              Manager Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bistro.com"
                className="w-full bg-bg-surface border border-transparent focus:border-primary text-text-main px-4 py-3 pl-10 rounded-input text-sm font-semibold outline-none transition-all focus-ring-orange"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Simulated Hint: Use admin123 as the password!")}
                className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wide cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-surface border border-transparent focus:border-primary text-text-main px-4 py-3 pl-10 rounded-input text-sm font-semibold outline-none transition-all focus-ring-orange"
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs font-semibold text-text-sub">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border-theme bg-bg-surface cursor-pointer"
              />
              <span>Remember this console</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold py-3.5 rounded-btn transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Simulated credentials banner */}
        <div className="mt-8 pt-4 border-t border-border-theme text-center">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Default Test Credentials</p>
          <div className="mt-2 bg-bg-surface p-2.5 rounded-xl border border-border-theme text-[10px] sm:text-xs font-mono font-medium text-text-sub select-all">
            <span className="font-extrabold text-text-main">Email:</span> admin@bistro.com <br/>
            <span className="font-extrabold text-text-main">Password:</span> admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
