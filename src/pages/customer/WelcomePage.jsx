import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Utensils, Table2, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

const WelcomePage = () => {
  const { loginCustomer, settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [table, setTable] = useState('');
  const [isQrLocked, setIsQrLocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Parse Table parameter from URL query string (simulating table QR code scan)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tableParam = params.get('table') || params.get('t');
    if (tableParam) {
      setTable(tableParam);
      setIsQrLocked(true);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (!name.trim()) return setError('Please enter your name.');
    if (!mobile.trim() || mobile.length < 10) return setError('Please enter a valid 10-digit mobile number.');
    if (!table.trim()) return setError('Please enter your table number.');

    setLoading(true);
    
    // Simulate API registration delay
    setTimeout(() => {
      const res = loginCustomer(name.trim(), mobile.trim(), table.trim());
      setLoading(false);
      
      if (res.success) {
        navigate('/'); // Redirect to the main menu page
      } else {
        setError(res.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="w-full max-w-md bg-bg-card rounded-modal p-6 sm:p-8 shadow-xl border border-border-theme z-10 animate-scale-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-float">
            <Utensils size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {settings.restaurantName}
            </h1>
            <p className="text-xs text-text-muted font-semibold tracking-widest uppercase mt-1">
              Tabletop Digital Ordering
            </p>
          </div>
        </div>

        {/* Info Box if table is QR locked */}
        {isQrLocked && (
          <div className="mb-6 p-3 rounded-btn bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 border border-emerald-500/20">
            <ShieldCheck size={16} />
            <span>Successfully scanned QR Code for Table {table}!</span>
          </div>
        )}

        {/* Validation Alerts */}
        {error && (
          <div className="mb-6 p-3 rounded-btn bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 animate-slide-up">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">
              Your Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <User size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Himanshu Kumar"
                className="w-full bg-bg-surface border border-transparent focus:border-primary text-text-main px-4 py-3 pl-10 rounded-input text-sm font-semibold outline-none transition-all focus-ring-orange"
                disabled={loading}
              />
            </div>
          </div>

          {/* Guest Mobile */}
          <div>
            <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <Phone size={16} />
              </span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setMobile(val);
                }}
                placeholder="e.g. 9876543210"
                className="w-full bg-bg-surface border border-transparent focus:border-primary text-text-main px-4 py-3 pl-10 rounded-input text-sm font-semibold outline-none transition-all focus-ring-orange"
                disabled={loading}
              />
            </div>
          </div>

          {/* Guest Table Number */}
          <div>
            <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-2">
              Table Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted">
                <Table2 size={16} />
              </span>
              <input
                type="text"
                value={table}
                onChange={(e) => {
                  if (!isQrLocked) setTable(e.target.value.replace(/\D/g, ''));
                }}
                placeholder="e.g. 4"
                className={`w-full bg-bg-surface border border-transparent focus:border-primary text-text-main px-4 py-3 pl-10 rounded-input text-sm font-semibold outline-none transition-all focus-ring-orange ${
                  isQrLocked ? 'text-text-muted cursor-not-allowed opacity-80' : ''
                }`}
                disabled={loading || isQrLocked}
              />
            </div>
            {isQrLocked && (
              <p className="text-[10px] text-text-muted mt-1 font-semibold">
                Table number is locked based on the scanned QR.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold py-3.5 rounded-btn transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <span>Enter Dining Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomePage;
