import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Utensils, ShoppingCart, Compass, User, Moon, Sun, Table2, LogOut, Grid } from 'lucide-react';

const CustomerLayout = () => {
  const { customerUser, logoutCustomer, cart, isDarkMode, setIsDarkMode, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!customerUser) {
    return <Outlet />;
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'menu', path: '/', label: 'Home', icon: Utensils },
    { id: 'categories', path: '/?showCats=true', label: 'Categories', icon: Grid },
    { id: 'cart', path: '/cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'orders', path: '/profile?tab=orders', label: 'Orders', icon: Compass },
    { id: 'profile', path: '/profile', label: 'Profile', icon: User }
  ];

  const getIsActive = (item) => {
    if (item.id === 'categories') {
      return location.pathname === '/' && location.search.includes('showCats=true');
    }
    if (item.id === 'menu') {
      return location.pathname === '/' && !location.search.includes('showCats=true');
    }
    if (item.id === 'orders') {
      return location.pathname === '/profile' && location.search.includes('tab=orders');
    }
    if (item.id === 'profile') {
      return location.pathname === '/profile' && !location.search.includes('tab=orders');
    }
    return location.pathname === item.path;
  };

  return (
    <div className="min-h-screen bg-bg-surface text-text-main flex flex-col font-sans transition-all duration-350 ease-in-out">
      
      {/* Sticky Top Header Banner */}
      <header className="sticky top-0 z-40 bg-bg-card/85 backdrop-blur-xl border-b border-border-theme shadow-sm transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-[14px] bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow-sm animate-float">
              <Utensils size={18} />
            </div>
            <div className="text-left">
              <h1 className="text-base font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-none">
                {settings.restaurantName}
              </h1>
              <p className="text-[9px] text-text-sub font-bold tracking-widest uppercase mt-0.5 leading-none">
                {settings.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Table Badge */}
            <div className="flex items-center space-x-1 bg-primary-bg text-primary dark:bg-primary/20 dark:text-primary-light px-2.5 py-1 rounded-full text-[10px] font-black border border-primary-light/20">
              <Table2 size={11} />
              <span>T-{customerUser.table}</span>
            </div>

            {/* Theme switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-xl hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
            </button>

            {/* Leave table */}
            <button
              onClick={() => {
                if (window.confirm("Do you want to leave your table and end the dining session?")) {
                  logoutCustomer();
                  navigate('/');
                }
              }}
              className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors cursor-pointer"
              title="Leave Table"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main view outlet */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4 pb-28">
        <Outlet />
      </main>

      {/* Floating 5-tab Bottom Navigation bar */}
      <nav className="fixed bottom-3 left-3 right-3 sm:max-w-xl sm:mx-auto z-40 bg-bg-card/90 backdrop-blur-xl border border-border-theme rounded-3xl shadow-sm transition-colors duration-300">
        <div className="px-4 py-2.5 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = getIsActive(item);
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-primary scale-110 font-bold'
                    : 'text-text-muted hover:text-text-sub'
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-[-6px] w-6 h-1 bg-primary rounded-full animate-scale-up" />
                )}

                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-bg-card shadow-sm animate-scale-up">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-bold mt-1 tracking-wider uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CustomerLayout;
