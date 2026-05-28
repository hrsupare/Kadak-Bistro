import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

const AdminNotificationsPage = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  const handleClear = () => {
    if (window.confirm("Are you sure you want to permanently clear all notification alerts history?")) {
      clearAllNotifications();
    }
  };

  const getNotifStyles = (type) => {
    switch (type) {
      case 'alert':
        return { border: 'border-red-200 dark:border-red-950/45', bg: 'bg-red-500/5 dark:bg-red-500/10', icon: <AlertTriangle className="text-red-500" size={16} /> };
      case 'success':
        return { border: 'border-emerald-250 dark:border-emerald-950/45', bg: 'bg-emerald-500/5 dark:bg-emerald-500/10', icon: <CheckCircle2 className="text-emerald-500" size={16} /> };
      case 'order':
        return { border: 'border-primary/20', bg: 'bg-primary/5 dark:bg-primary/10', icon: <Bell className="text-primary animate-bounce" size={16} /> };
      default:
        return { border: 'border-blue-200 dark:border-blue-950/45', bg: 'bg-blue-500/5 dark:bg-blue-500/10', icon: <Info className="text-blue-500" size={16} /> };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 border-b border-border-theme pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            System Alerts Tray
          </h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
            Audit store logs, stock out indicators, and waiter requests
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-btn text-xs font-bold text-red-500 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear Logs Tray</span>
          </button>
        )}
      </div>

      {/* Main notifications feed list */}
      <section className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-text-muted space-y-2">
            <Bell size={36} className="mx-auto mb-2 text-text-muted" />
            <p className="font-semibold text-sm">System Logs are completely clear</p>
            <p className="text-[10px]">Dining table scans and orders will trigger real-time audio and visual alerts here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
               const style = getNotifStyles(notif.type);
               return (
                 <div
                   key={notif.id}
                   onClick={() => markNotificationAsRead(notif.id)}
                   className={`p-4 rounded-card border text-xs flex items-center justify-between transition-all duration-200 cursor-pointer ${style.border} ${style.bg} ${
                     notif.read ? 'opacity-65 grayscale-[30%]' : 'scale-[1.005] shadow-sm font-semibold'
                   }`}
                 >
                   <div className="flex items-center space-x-3.5 flex-1 pr-4">
                     <div className="flex-shrink-0 w-8 h-8 bg-bg-surface rounded-xl flex items-center justify-center shadow-inner">
                       {style.icon}
                     </div>
                     <div>
                       <p className="text-text-main leading-relaxed text-xs m-0">{notif.text}</p>
                       <span className="text-[10px] text-text-muted font-semibold block mt-1">{notif.time}</span>
                     </div>
                   </div>

                   <div className="flex-shrink-0">
                     {notif.read ? (
                       <span className="text-[9px] text-text-muted font-bold bg-bg-surface px-2 py-0.5 rounded">
                         Acknowledged
                       </span>
                     ) : (
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           markNotificationAsRead(notif.id);
                         }}
                         className="text-[9px] text-primary hover:underline font-bold uppercase tracking-wider bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/15 cursor-pointer"
                       >
                         Acknowledge
                       </button>
                     )}
                   </div>
                 </div>
               );
             })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminNotificationsPage;
