import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, ClipboardList, Utensils, Layers, BarChart3, 
  Bell, Settings, LogOut, Sun, Moon, Menu, X, Volume2, VolumeX, ShieldCheck
} from 'lucide-react';

const AdminLayout = () => {
  const { 
    adminUser, logoutUser, isDarkMode, setIsDarkMode, settings, setSettings,
    orders, notifications, markNotificationAsRead, clearAllNotifications
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  const activeOrdersCount = orders.filter(o => ['Received', 'Preparing', 'Ready'].includes(o.status)).length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders', label: 'Live Orders', icon: ClipboardList, badge: activeOrdersCount, badgeColor: 'bg-primary text-white animate-pulse' },
    { path: '/admin/food', label: 'Food Menu', icon: Utensils },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount, badgeColor: 'bg-primary text-white' },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of the Admin panel?")) {
      logoutUser();
      navigate('/admin/login');
    }
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundNotifications: !prev.soundNotifications }));
  };

  return (
    <div className="min-h-screen bg-bg-surface text-text-main flex flex-col font-sans transition-all duration-350 ease-in-out">
      
      {/* Top Admin Header - Clean White Light Mode */}
      <header className="sticky top-0 z-30 bg-bg-card/85 backdrop-blur-xl border-b border-border-theme shadow-sm py-3 px-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow shadow-primary/10">
                <ShieldCheck size={18} />
              </div>
              <span className="font-heading font-extrabold text-base tracking-tight hidden sm:inline-block">
                Manager Panel
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                Live Server
              </span>
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                settings.soundNotifications 
                  ? 'bg-emerald-55/10 text-emerald-600 dark:bg-emerald-500/20' 
                  : 'bg-red-55/10 text-red-500'
              }`}
              title={settings.soundNotifications ? "Mute audio cues" : "Unmute audio cues"}
            >
              <div className="flex items-center space-x-1.5 leading-none">
                {settings.soundNotifications ? (
                  <>
                    <Volume2 size={16} className="text-emerald-500" />
                    <div className="flex items-end h-3 space-x-0.5">
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                      <span className="wave-bar"></span>
                    </div>
                  </>
                ) : (
                  <VolumeX size={16} className="text-red-500" />
                )}
              </div>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 rounded-xl hover:bg-bg-surface text-text-sub transition-colors cursor-pointer"
            >
              <Bell size={18} />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center border border-bg-card shadow-sm animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Manager Avatar info */}
            <div className="hidden md:flex items-center space-x-2 border-l border-border-theme pl-3">
              <div className="w-8 h-8 rounded-full bg-primary-bg text-primary font-black flex items-center justify-center text-xs">
                SM
              </div>
              <div className="text-left">
                <p className="text-xs font-black leading-none">{adminUser.name}</p>
                <p className="text-[9px] text-text-muted font-bold leading-none mt-1">Senior Admin</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Deck */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Sidebar for Desktop - Clean white card background */}
        <aside className="w-64 bg-bg-card border-r border-border-theme hidden lg:flex flex-col justify-between py-6 px-4 transition-colors duration-300 shadow-sm">
          <div className="space-y-6">
            <div className="px-2 text-left">
              <h2 className="text-[10px] font-black tracking-widest text-text-muted uppercase">
                Audit Deck
              </h2>
            </div>
            
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-primary-bg text-primary border border-primary-light/10 scale-[1.02]' 
                        : 'text-text-sub hover:bg-bg-surface hover:text-text-main'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`${item.badgeColor} font-black text-[9px] rounded-full px-2 py-0.5 shadow-sm`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-[14px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-black text-xs uppercase tracking-wider transition-colors mt-auto cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Sidebar Drawer for Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            
            <aside className="relative w-64 bg-bg-card flex flex-col p-6 shadow-2xl animate-slide-up h-full transition-colors duration-300">
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-bg-surface text-text-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-2 mb-8 mt-2 text-left">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white shadow shadow-primary/10">
                  <ShieldCheck size={18} />
                </div>
                <span className="font-heading font-extrabold text-base tracking-tight">{settings.restaurantName}</span>
              </div>

              <nav className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[14px] font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-primary-bg text-primary border border-primary-light/10' 
                          : 'text-text-sub hover:bg-bg-surface hover:text-text-main'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`${item.badgeColor} font-black text-[9px] rounded-full px-2 py-0.5 shadow-sm`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-[14px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-black text-xs uppercase tracking-wider transition-colors mt-6 cursor-pointer"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </aside>
          </div>
        )}

        {/* Dynamic viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 no-scrollbar bg-bg-surface transition-colors duration-300">
          <Outlet />
        </main>
      </div>

      {/* Notifications Drawer Slider */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowNotifDrawer(false)}
          />
          
          <div className="relative w-full max-w-md bg-bg-card shadow-2xl h-full flex flex-col p-5 border-l border-border-theme transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-theme pb-3.5 mb-4 flex-shrink-0">
              <div className="flex items-center space-x-2 text-primary text-left">
                <Bell size={18} className="animate-pulse" />
                <span className="font-heading font-extrabold text-base text-text-main">Alerts Dashboard</span>
              </div>
              <button 
                onClick={() => setShowNotifDrawer(false)}
                className="p-1 rounded-lg hover:bg-bg-surface text-text-muted hover:text-text-sub transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-text-muted space-y-2">
                  <Bell size={28} strokeWidth={1.5} />
                  <p className="text-xs font-bold uppercase tracking-wider">Logs are clear</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.meta && notif.meta.orderId) {
                        navigate('/admin/orders');
                        setShowNotifDrawer(false);
                      }
                    }}
                    className={`p-3.5 rounded-[20px] border text-xs cursor-pointer transition-all duration-200 hover:scale-[1.01] text-left ${
                      notif.read 
                        ? 'bg-bg-surface/50 border-border-theme text-text-sub' 
                        : 'bg-primary-bg border-primary/20 text-text-main font-semibold shadow-sm shadow-primary/5'
                    }`}
                  >
                    <div className="flex justify-between items-start space-x-2">
                      <p className="flex-1 leading-normal m-0">{notif.text}</p>
                      <span className="text-[9px] text-text-muted font-bold font-mono whitespace-nowrap">{notif.time}</span>
                    </div>
                    {!notif.read && (
                      <span className="inline-block mt-2.5 text-[10px] text-primary font-black uppercase tracking-wider hover:underline">
                        Acknowledge
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-border-theme pt-3.5 mt-4 flex items-center justify-between flex-shrink-0 text-xs">
                <button
                  onClick={() => {
                    if (window.confirm("Clear all logs?")) {
                      clearAllNotifications();
                    }
                  }}
                  className="font-black text-red-500 hover:text-red-600 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Clear Logs
                </button>
                <button
                  onClick={() => {
                    navigate('/admin/notifications');
                    setShowNotifDrawer(false);
                  }}
                  className="font-black text-primary hover:underline uppercase tracking-wider"
                >
                  View History Tray
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card/90 backdrop-blur-xl border-t border-border-theme flex lg:hidden items-center justify-around py-2 px-2 shadow-lg rounded-t-[20px] transition-colors duration-300">
        {menuItems.filter(item => ['Dashboard', 'Live Orders', 'Food Menu', 'Analytics', 'Settings'].includes(item.label)).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer relative ${
                isActive 
                  ? 'text-primary font-bold' 
                  : 'text-text-muted hover:text-text-sub'
              }`}
            >
              <Icon size={18} />
              <span className="text-[8px] font-black uppercase tracking-wider mt-1">{item.label.replace('Live ', '').replace(' Food', '')}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2.5 bg-primary text-white text-[8px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
