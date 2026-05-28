import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, DollarSign, Calendar, Star, Compass } from 'lucide-react';

const AdminAnalyticsPage = () => {
  const { orders, menu } = useApp();

  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const averageOrderValue = orders.length > 0 
    ? Math.round(totalRevenue / orders.filter(o => o.status === 'Completed').length || 0) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border-theme pb-4">
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bistro Analytics Workspace
        </h2>
        <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
          Review business performance indices and revenue metrics
        </p>
      </div>

      {/* Grid Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme space-y-1">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider m-0">Net settled margins</p>
          <h3 className="text-xl sm:text-2xl font-heading font-black m-0 mt-2">₹{(totalRevenue * 0.85).toFixed(0)}</h3>
          <p className="text-[9px] text-emerald-500 font-bold mt-2">85% Gross Profit margin (Simulated)</p>
        </div>

        <div className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme space-y-1">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider m-0">Average ticket size</p>
          <h3 className="text-xl sm:text-2xl font-heading font-black m-0 mt-2">₹{averageOrderValue}</h3>
          <p className="text-[9px] text-primary font-bold mt-2">Based on settled transactions</p>
        </div>

        <div className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme space-y-1">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider m-0">Table Velocities</p>
          <h3 className="text-xl sm:text-2xl font-heading font-black m-0 mt-2">12.5 mins</h3>
          <p className="text-[9px] text-purple-500 font-bold mt-2">Average preparation and serving duration</p>
        </div>
      </section>

      {/* Analytical Visualizer Chart */}
      <div className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme flex flex-col justify-between min-h-[320px]">
        <div className="flex justify-between items-start border-b border-border-theme pb-3 mb-4">
          <div>
            <h3 className="text-xs font-black uppercase text-text-muted tracking-wider m-0">Peak Traffic & Order Volume</h3>
            <p className="text-[10px] text-text-muted font-semibold mt-1">Hourly dining queue capacity throughout operation hours</p>
          </div>
          <span className="text-[10px] font-bold text-text-sub flex items-center space-x-1 bg-bg-surface px-2 py-0.5 rounded border border-border-theme">
            <Calendar size={12} />
            <span>Operational Scale</span>
          </span>
        </div>

        {/* Dynamic Double line SVG graphic */}
        <div className="flex-1 w-full relative min-h-[180px] flex items-end">
          <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
            {/* Grid wire */}
            <line x1="0" y1="40" x2="500" y2="40" stroke="var(--color-border-theme)" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="var(--color-border-theme)" strokeWidth="1" strokeDasharray="3" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="var(--color-border-theme)" strokeWidth="1" />

            {/* Line 1: Orders count */}
            <path 
              d="M 10 130 C 100 110 150 50 250 80 T 400 30 T 490 90" 
              fill="none" 
              stroke="#ff4757" 
              strokeWidth="3" 
              strokeLinecap="round"
            />
            {/* Line 2: Revenue velocity */}
            <path 
              d="M 10 140 C 90 120 160 80 250 110 T 380 50 T 490 110" 
              fill="none" 
              stroke="#ff9f43" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeDasharray="4"
            />

            {/* Decorative anchor nodes */}
            <circle cx="250" cy="80" r="4.5" fill="#ff4757" stroke="white" strokeWidth="1.5" />
            <circle cx="400" cy="30" r="4.5" fill="#ff9f43" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex justify-between text-[9px] text-text-muted font-extrabold uppercase mt-3">
          <span>11:00 AM (Open)</span>
          <span>02:00 PM (Lunch)</span>
          <span>05:00 PM (Snacks)</span>
          <span>08:30 PM (Dinner Peak)</span>
          <span>11:30 PM (Close)</span>
        </div>
      </div>

      {/* Simulated top performance grid */}
      <section className="bg-bg-card rounded-card p-5 border border-border-theme shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase text-text-muted tracking-wider">
          Analytical Performance Index
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          {[
            { metric: 'Table Seat Turnover Rate', value: '4.8 turnovers/table daily', color: 'text-emerald-500' },
            { metric: 'Buzzer Assistance Response Delay', value: '1.4 minutes average', color: 'text-primary' },
            { metric: 'Repeat Guest Orders Index', value: '34% returning diners', color: 'text-purple-500' },
            { metric: 'Coupon Campaign conversions', value: 'WELCOMFOD (74% shares)', color: 'text-orange-500' }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-bg-surface p-3 rounded-card border border-border-theme">
              <span className="text-text-sub">{item.metric}</span>
              <span className={`font-black ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
