import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, Heart, CreditCard, LifeBuoy, ArrowRight, Star,
  Clock, Compass, CheckCircle2, ChevronDown, ChevronUp, Check, ShieldAlert
} from 'lucide-react';
import FoodDetailsModal from '../../components/customer/FoodDetailsModal';

const UserProfilePage = () => {
  const { 
    customerUser, orders, menu, addSystemNotification, 
    settings 
  } = useApp();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'orders';

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');

  useEffect(() => {
    setActiveTab(activeTabParam);
  }, [activeTabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  const customerOrders = orders.filter(o => 
    o.mobileNumber === customerUser.mobile || 
    (o.customerName === customerUser.name && o.tableNumber === customerUser.table)
  );

  const favoriteItems = menu.filter(item => item.isPopular && item.inStock);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleRequestWaiter = (e) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;

    addSystemNotification('info', `🔔 Request: Table ${customerUser.table} requested help: "${supportMsg}"`);
    
    setSupportSuccess("Table service alerted! Waiter has been dispatched to Table " + customerUser.table + ".");
    setSupportMsg('');
    
    setTimeout(() => {
      setSupportSuccess('');
    }, 5000);
  };

  const handleCallWaiterDirect = () => {
    addSystemNotification('info', `🔔 Alert: Table ${customerUser.table} is requesting a waiter directly!`);
    alert(`Buzzer Alert Sent! Table service staff has been dispatched to Table ${customerUser.table} immediately.`);
  };

  const statusSteps = [
    { label: 'Received', key: 'Received' },
    { label: 'Preparing', key: 'Preparing' },
    { label: 'Cooking', key: 'Cooking' },
    { label: 'Ready', key: 'Ready' },
    { label: 'Served', key: 'Completed' }
  ];

  const getActiveStepIndex = (status) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Received') return 0;
    if (status === 'Preparing') return 1;
    if (status === 'Cooking') return 2;
    if (status === 'Ready') return 3;
    if (status === 'Completed' || status === 'Served') return 4;
    return 2;
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header card */}
      <section className="bg-bg-card text-text-main rounded-card p-5 shadow-sm border border-border-theme flex items-center justify-between text-left transition-colors duration-300">
        <div className="space-y-1.5">
          <h2 className="text-xl font-heading font-extrabold m-0 text-text-main leading-none">
            {customerUser.name}
          </h2>
          <p className="text-[9px] text-text-muted font-bold uppercase tracking-wider leading-none mt-1.5">
            Active Dining Session
          </p>
          <p className="text-[11px] font-bold text-text-sub leading-none mt-1 font-mono">
            📱 {customerUser.mobile}
          </p>
        </div>
        <div className="bg-primary-bg text-primary border border-primary/20 px-4 py-2.5 rounded-btn text-center flex flex-col justify-center">
          <p className="text-[8px] font-black uppercase tracking-widest leading-none text-text-muted">Seat</p>
          <p className="text-sm font-black leading-none mt-1.5 font-mono">Table {customerUser.table}</p>
        </div>
      </section>

      {/* Tabs navigation block */}
      <div className="flex bg-bg-card rounded-[20px] p-1 justify-around text-xs border border-border-theme shadow-sm transition-colors duration-300">
        <button
          onClick={() => handleTabChange('orders')}
          className={`flex items-center space-x-1 py-2.5 px-3 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-primary-bg text-primary shadow-sm scale-105'
              : 'text-text-sub hover:text-text-main'
          }`}
        >
          <ClipboardList size={13} />
          <span>Orders ({customerOrders.length})</span>
        </button>
        
        <button
          onClick={() => handleTabChange('favorites')}
          className={`flex items-center space-x-1 py-2.5 px-3 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-primary-bg text-primary shadow-sm scale-105'
              : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Heart size={13} />
          <span>Favorites</span>
        </button>

        <button
          onClick={() => handleTabChange('help')}
          className={`flex items-center space-x-1 py-2.5 px-3 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'help'
              ? 'bg-primary-bg text-primary shadow-sm scale-105'
              : 'text-text-sub hover:text-text-main'
          }`}
        >
          <LifeBuoy size={13} />
          <span>Support</span>
        </button>
      </div>

      {/* Viewport content */}
      <div className="space-y-4">
        
        {/* VIEW: Orders with Live Tracker Timeline */}
        {activeTab === 'orders' && (
          <div className="space-y-4 text-left">
            {customerOrders.length === 0 ? (
              <div className="bg-bg-card rounded-[20px] p-12 text-center text-text-sub border border-border-theme shadow-sm transition-colors duration-300">
                <Compass className="mx-auto mb-3 text-primary animate-float" size={28} strokeWidth={1.5} />
                <p className="text-sm font-semibold">No active orders placed yet.</p>
                <p className="text-[10px] text-text-muted mt-1 max-w-[200px] mx-auto leading-relaxed">Add items to cart and check out to trace live service status!</p>
              </div>
            ) : (
              customerOrders.map((order) => {
                const isExpanded = !!expandedOrders[order.id];
                const activeIdx = getActiveStepIndex(order.status);

                return (
                  <div 
                    key={order.id}
                    className="bg-bg-card rounded-[20px] p-4 shadow-sm border border-border-theme space-y-4 animate-scale-up transition-colors duration-300"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between text-xs border-b border-border-theme pb-2.5">
                      <div>
                        <span className="font-extrabold text-text-main font-mono">{order.id}</span>
                        <span className="text-text-muted text-[10px] font-bold block mt-0.5">
                          {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider ${
                          order.status === 'Completed' || order.status === 'Served'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-primary/10 text-primary animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                        <button 
                          onClick={() => toggleOrderExpand(order.id)}
                          className="p-1 rounded hover:bg-bg-surface text-text-muted transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Timeline Live Status Tracker */}
                    {order.status !== 'Cancelled' ? (
                      <div className="pt-1">
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-4">Live Order Progress</p>
                        
                        {/* Horizontal Timeline tracks */}
                        <div className="relative flex items-center justify-between px-2">
                          <div className="absolute left-6 right-6 h-0.5 bg-border-theme -z-0" />
                          <div 
                            className="absolute left-6 h-0.5 bg-primary -z-0 transition-all duration-500" 
                            style={{ 
                              width: `${activeIdx === 0 ? '0%' : activeIdx === 1 ? '25%' : activeIdx === 2 ? '50%' : activeIdx === 3 ? '75%' : '100%'}` 
                            }}
                          />

                          {statusSteps.map((step, idx) => {
                            const isPassed = idx <= activeIdx;
                            const isCurrent = idx === activeIdx;

                            return (
                              <div key={idx} className="flex flex-col items-center z-10">
                                {/* Dot node */}
                                <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8px] font-black text-white transition-all duration-300 ${
                                  isPassed 
                                    ? isCurrent 
                                      ? 'bg-primary scale-125 border-2 border-bg-card shadow shadow-primary/45 ring-4 ring-primary-light/25' 
                                      : 'bg-primary' 
                                    : 'bg-border-theme text-text-muted'
                                }`}>
                                  {isPassed && idx < activeIdx ? <Check size={10} strokeWidth={3.5} /> : idx + 1}
                                </div>
                                <span className={`text-[8.5px] font-black mt-2 tracking-wide uppercase ${
                                  isPassed 
                                    ? isCurrent 
                                      ? 'text-primary' 
                                      : 'text-text-sub font-bold' 
                                    : 'text-text-muted'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Service summary */}
                        <div className="mt-5 p-2.5 bg-bg-surface rounded-2xl text-[10px] text-text-sub font-semibold flex items-center justify-between border border-border-theme transition-colors duration-300">
                          <div className="flex items-center space-x-1.5">
                            <Clock size={12} className="text-primary" />
                            <span>Service Queue: <span className="font-extrabold text-text-main">~12 mins</span></span>
                          </div>
                          <span>Items Count: {order.items.reduce((s, i) => s + i.quantity, 0)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-scale-up">
                        <ShieldAlert size={15} />
                        <span>This order was cancelled by the bistro desk. Please speak to table servers.</span>
                      </div>
                    )}

                    {/* Expandable item details list */}
                    {isExpanded && (
                      <div className="border-t border-border-theme pt-3.5 text-xs space-y-2.5 animate-scale-up">
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-1">Receipt Details</p>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start py-0.5 font-medium leading-tight">
                            <div className="space-y-0.5 text-left">
                              <span className="font-extrabold text-text-main">{item.name} x{item.quantity}</span>
                              {item.customizations && item.customizations.length > 0 && (
                                <p className="text-[9px] text-text-sub font-extrabold">
                                  + {item.customizations.map(c => c.name).join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="font-bold font-mono text-text-main">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        
                        <div className="border-t border-border-theme pt-2 flex justify-between font-bold text-text-sub text-[10px] font-mono">
                          <span>Subtotal</span>
                          <span>₹{order.subTotal}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between font-bold text-primary text-[10px] font-mono">
                            <span>Promo Discount</span>
                            <span>-₹{order.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-text-muted text-[9.5px] font-mono">
                          <span>GST Tax ({settings.gstRatePercent}% + 2.5%)</span>
                          <span>₹{order.taxAmount}</span>
                        </div>
                        <div className="flex justify-between font-black text-text-main text-xs pt-2 border-t border-border-theme">
                          <span>Grand Total ({order.paymentMethod.replace('Pay Now ', '')})</span>
                          <span className="text-primary font-heading font-black font-mono">₹{order.grandTotal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VIEW: Favorites list */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-bg-card rounded-[20px] p-3 shadow-sm border border-border-theme cursor-pointer flex space-x-3 hover:shadow-md transition-shadow relative transition-colors duration-300"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 space-y-0.5 truncate">
                  <h4 className="text-sm font-heading font-extrabold text-text-main m-0 leading-tight truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-text-sub font-bold leading-normal m-0 truncate">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-black text-primary font-mono">₹{item.discountPrice || item.price}</span>
                    <span className="text-[8px] font-black bg-amber-400/10 text-amber-500 border border-amber-400/20 px-1.5 py-0.5 rounded-lg uppercase">
                      ⭐ {item.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: Support Waiter */}
        {activeTab === 'help' && (
          <div className="space-y-4 text-left">
            {/* Quick table buzzer */}
            <div className="bg-bg-card rounded-[20px] p-5 shadow-sm border border-border-theme text-center space-y-3.5 transition-colors duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-bg text-primary flex items-center justify-center mx-auto shadow-sm border border-primary-light/10">
                <LifeBuoy size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h4 className="text-sm font-heading font-extrabold m-0 text-text-main">Need Table Assistance?</h4>
                <p className="text-[10px] sm:text-xs text-text-sub font-semibold leading-relaxed mt-1.5 max-w-[240px] mx-auto">
                  Ring the bell to alert the counter directly. Staff will attend your table.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCallWaiterDirect}
                className="bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black px-6 py-3 rounded-[14px] shadow-md shadow-primary/10 transition-colors uppercase tracking-wider cursor-pointer"
              >
                🔔 Ring Table buzzer
              </button>
            </div>

            {/* Support Message form */}
            <section className="bg-bg-card rounded-[20px] p-5 shadow-sm border border-border-theme space-y-4 transition-colors duration-300">
              <div>
                <h4 className="text-sm font-heading font-extrabold m-0 text-text-main font-heading">Contact Service Desk</h4>
                <p className="text-[10px] text-text-sub font-bold mt-1">Specify requests like extra forks, clean water, or billing reviews.</p>
              </div>

              {supportSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 animate-scale-up">
                  {supportSuccess}
                </div>
              )}

              <form onSubmit={handleRequestWaiter} className="space-y-3">
                <textarea
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="e.g. Please bring two extra napkins and some ice cubes..."
                  className="w-full text-xs font-semibold p-3 bg-bg-surface border border-border-theme focus:border-primary focus:bg-bg-card rounded-[12px] outline-none min-h-[70px] resize-none transition-all focus:ring-2 focus:ring-primary/10 text-text-main"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black py-3 rounded-btn transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center space-x-1.5 uppercase tracking-wider"
                >
                  <span>Alert Service Staff</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            </section>
          </div>
        )}
      </div>

      {/* Item detail modal overlay */}
      {selectedItem && (
        <FoodDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
