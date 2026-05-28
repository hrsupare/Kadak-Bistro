import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, DollarSign, Users, Award, TrendingUp, 
  ChevronRight, Calendar, Layers, CheckCircle2 
} from 'lucide-react';

const DashboardPage = () => {
  const { orders, menu, settings } = useApp();
  const navigate = useNavigate();

  // Metrics Calculations
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ['Received', 'Preparing', 'Ready'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => o.status === 'Received').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const itemFrequencies = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      itemFrequencies[i.name] = (itemFrequencies[i.name] || 0) + i.quantity;
    });
  });

  const popularItems = Object.keys(itemFrequencies)
    .map(name => {
      const menuItem = menu.find(m => m.name === name) || {};
      return {
        name,
        qty: itemFrequencies[name],
        price: menuItem.price || 199,
        image: menuItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150',
        category: menuItem.category || 'Food'
      };
    })
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 4);

  const recentOrdersList = orders.slice(0, 5);

  const metrics = [
    { label: 'Settled Sales Revenue', val: `₹${totalRevenue.toLocaleString()}`, change: '+12.4% Today', icon: DollarSign, color: 'bg-primary', textCol: 'text-primary' },
    { label: 'Active Service Queue', val: activeOrders, change: `${pendingOrders} Pending Action`, icon: ClipboardList, color: 'bg-primary-light', textCol: 'text-primary' },
    { label: 'Settled Invoices', val: completedOrders, change: '100% Fulfilled', icon: CheckCircle2, color: 'bg-primary', textCol: 'text-primary' },
    { label: 'Dining Table Feed', val: totalOrders, change: 'QR sessions active', icon: Users, color: 'bg-primary-light', textCol: 'text-primary' }
  ];  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 text-left border-b border-border-theme pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Executive Summary
          </h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
            Real-Time POS performance indicators
          </p>
        </div>

        <div className="bg-bg-card px-4 py-2 rounded-2xl border border-border-theme shadow-sm text-xs font-black text-text-sub flex items-center space-x-2">
          <Calendar size={14} className="text-primary" />
          <span>{new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Grid of cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {metrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className="bg-bg-card rounded-card p-4.5 shadow-sm border border-border-theme relative overflow-hidden group scale-100 hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9.5px] text-text-muted font-black uppercase tracking-widest m-0">{card.label}</p>
                  <h3 className="text-xl sm:text-2xl font-heading font-black m-0 mt-2.5 text-text-main font-mono">{card.val}</h3>
                </div>
                <div className={`w-10 h-10 rounded-2xl ${card.color}/10 text-primary flex items-center justify-center border border-primary-light/10`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-[9.5px] text-text-sub font-bold mt-4.5 leading-none flex items-center space-x-1.5 uppercase tracking-wider">
                <TrendingUp size={11} className="text-primary" />
                <span>{card.change}</span>
              </p>
            </div>
          );
        })}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* SVG Daily Sales Line Graph */}
        <div className="lg:col-span-2 bg-bg-card rounded-card p-5 shadow-sm border border-border-theme flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start border-b border-border-theme pb-3.5 mb-4">
            <div>
              <h3 className="text-xs font-black uppercase text-text-muted tracking-wider m-0">Daily Sales Velocity</h3>
              <p className="text-[10px] text-text-sub font-semibold mt-1">Hourly dining tickets volume index</p>
            </div>
            <span className="text-[10px] font-black text-primary bg-primary-bg px-2 py-0.5 rounded border border-primary-light/20 uppercase tracking-wider">
              Live Feed
            </span>
          </div>

          {/* SVG Line Graph styled in warm orange variables */}
          <div className="flex-1 w-full relative min-h-[160px] flex items-end">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines bound to theme border color variable */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--color-border-theme)" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="var(--color-border-theme)" strokeWidth="1" strokeDasharray="3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="var(--color-border-theme)" strokeWidth="1" strokeDasharray="3" />

              {/* Area path */}
              <path 
                d="M 10 140 Q 100 80 180 110 T 360 40 T 490 60 L 490 140 L 10 140 Z" 
                fill="url(#chartGrad)" 
              />
              
              {/* Line path */}
              <path 
                d="M 10 140 Q 100 80 180 110 T 360 40 T 490 60" 
                fill="none" 
                stroke="#FF6B00" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="180" cy="110" r="5.5" fill="#FF6B00" stroke="white" strokeWidth="2.5" />
              <circle cx="360" cy="40" r="5.5" fill="#FFA559" stroke="white" strokeWidth="2.5" />
              <circle cx="490" cy="60" r="5.5" fill="#FF6B00" stroke="white" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] text-text-muted font-extrabold uppercase mt-3.5 tracking-wider font-mono">
            <span>11:00 AM</span>
            <span>03:00 PM</span>
            <span>06:00 PM</span>
            <span>09:00 PM (Dinner Peak)</span>
            <span>11:30 PM</span>
          </div>
        </div>

        {/* Category distribution graph list */}
        <div className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
          <div className="border-b border-border-theme pb-3.5">
            <h3 className="text-xs font-black uppercase text-text-muted tracking-wider m-0">Category Sales Shares</h3>
            <p className="text-[10px] text-text-sub font-semibold mt-1">Percent of items ordered</p>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {[
              { cat: 'Pizzas', percent: 45, count: '32 sold', color: 'bg-primary' },
              { cat: 'Starters', percent: 25, count: '18 sold', color: 'bg-primary-light' },
              { cat: 'Burgers', percent: 15, count: '11 sold', color: 'bg-[#FF6B00]' },
              { cat: 'Drinks & Sweets', percent: 15, count: '11 sold', color: 'bg-primary-light' }
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5 font-bold">
                <div className="flex justify-between text-text-sub">
                  <span>{bar.cat}</span>
                  <span className="font-mono">{bar.percent}% ({bar.count})</span>
                </div>
                <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden border border-border-theme">
                  <div className={`h-full ${bar.color}`} style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid: Popular items and recent order list */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
        
        {/* Top items */}
        <div className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
          <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">
            Popular Food Dishes
          </h3>

          <div className="space-y-3.5">
            {popularItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">
                No orders generated yet.
              </div>
            ) : (
              popularItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center space-x-3.5 p-2 rounded-2xl hover:bg-bg-surface transition-colors"
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 text-xs truncate">
                    <p className="font-extrabold text-text-main leading-none truncate">{item.name}</p>
                    <p className="text-[9.5px] text-text-muted font-bold uppercase tracking-wider mt-1">{item.category}</p>
                  </div>
                  <div className="text-right text-xs flex-shrink-0">
                    <p className="font-extrabold text-text-main leading-none font-mono">{item.qty} Sold</p>
                    <p className="text-[10px] text-primary font-black mt-1 font-mono">₹{item.price * item.qty}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-text-muted tracking-wider m-0">
              Recent Table Tickets
            </h3>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-[10px] font-black text-primary hover:underline flex items-center space-x-0.5 uppercase tracking-wider cursor-pointer"
            >
              <span>View Queue</span>
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-3.5">
            {recentOrdersList.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">
                No orders placed yet.
              </div>
            ) : (
              recentOrdersList.map((order) => (
                <div 
                  key={order.id}
                  className="flex items-center justify-between text-xs p-2 rounded-2xl hover:bg-bg-surface transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/orders')}
                >
                  <div className="space-y-1 text-left truncate flex-1 pr-2">
                    <div className="flex items-center space-x-1.5 leading-none">
                      <span className="font-extrabold text-text-main font-mono">{order.id}</span>
                      <span className="px-1.5 py-0.5 bg-[#FFF4EC] text-primary font-black text-[9px] rounded-lg uppercase border border-primary-light/10">
                        T-{order.tableNumber}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-text-sub font-bold m-0 leading-none truncate mt-0.5">
                      {order.customerName} ({order.items.length} items)
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      order.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : order.status === 'Cancelled'
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-primary/10 text-primary animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-[10.5px] font-black text-text-main mt-1 font-mono">₹{order.grandTotal}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
