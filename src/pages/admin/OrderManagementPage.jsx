import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, CheckCircle2, XCircle, Clock, 
  MapPin, Table2, Banknote, User, Phone, Check, 
  Play, Volume2, AlertCircle, Sparkles
} from 'lucide-react';

const OrderManagementPage = () => {
  const { orders, updateOrderStatus, triggerAudioAlert } = useApp();
  const [activeTab, setActiveTab] = useState('incoming'); // incoming, active, completed, cancelled, all

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'incoming':
        return orders.filter(o => o.status === 'Received');
      case 'active':
        return orders.filter(o => ['Preparing', 'Ready'].includes(o.status));
      case 'completed':
        return orders.filter(o => o.status === 'Completed');
      case 'cancelled':
        return orders.filter(o => o.status === 'Cancelled');
      default:
        return orders;
    }
  };

  const currentQueue = getFilteredOrders();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    triggerAudioAlert();
  };

  const getElapsedTime = (isoString) => {
    const elapsedMs = new Date() - new Date(isoString);
    const mins = Math.floor(elapsedMs / 60000);
    if (mins <= 0) return 'Just now';
    return `${mins}m ago`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 border-b border-border-theme pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Real-Time Orders Desk
          </h2>
          <p className="text-xs text-text-muted font-bold uppercase tracking-wider mt-1">
            Dispatch and Kitchen ticket tracker
          </p>
        </div>

        {/* Play chime test button */}
        <button
          onClick={() => {
            triggerAudioAlert();
            alert("Beep! Sound Notification Simulator executed successfully.");
          }}
          className="bg-bg-card border border-border-theme hover:border-primary px-4 py-2 rounded-2xl text-xs font-bold text-text-sub flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Volume2 size={14} className="text-primary" />
          <span>Test Sound Alert</span>
        </button>
      </div>

      {/* Tabs navigation list */}
      <div className="flex overflow-x-auto space-x-2 bg-bg-surface rounded-2xl p-1 justify-around text-xs scrollbar-none no-scrollbar snap-x border border-border-theme">
        {[
          { id: 'incoming', label: 'New Tickets', count: orders.filter(o => o.status === 'Received').length, color: 'bg-primary text-white' },
          { id: 'active', label: 'Kitchen Active', count: orders.filter(o => ['Preparing', 'Ready'].includes(o.status)).length, color: 'bg-amber-500 text-white' },
          { id: 'completed', label: 'Served/Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'bg-emerald-500 text-white' },
          { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length, color: 'bg-red-500 text-white' },
          { id: 'all', label: 'All Tickets', count: orders.length, color: 'bg-slate-500 text-white' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 py-2.5 px-3.5 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-bg-card text-text-main shadow-sm scale-105'
                : 'text-text-muted hover:text-text-sub'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`text-[9px] font-black rounded-full h-4.5 min-w-4.5 px-1.5 flex items-center justify-center ${
                activeTab === tab.id ? 'bg-primary text-white' : 'bg-bg-surface text-text-sub'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tickets rendering grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {currentQueue.length === 0 ? (
          <div className="md:col-span-2 xl:col-span-3 bg-bg-card rounded-card p-16 text-center text-text-muted border border-border-theme">
            <ClipboardList className="mx-auto mb-3 animate-float" size={36} strokeWidth={1.5} />
            <p className="text-sm font-semibold">No order tickets in this queue.</p>
            <p className="text-[10px] mt-1">New incoming QR scan orders will populate here immediately!</p>
          </div>
        ) : (
          currentQueue.map((order) => (
            <div
              key={order.id}
              className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden animate-scale-up"
            >
              {/* Colored status strip decorator */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                order.status === 'Completed' ? 'bg-emerald-500' :
                order.status === 'Cancelled' ? 'bg-red-500' :
                order.status === 'Ready' ? 'bg-purple-500 animate-pulse' :
                order.status === 'Preparing' ? 'bg-amber-500' : 'bg-primary animate-pulse'
              }`} />

              {/* Order Card Header */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-start pt-1.5">
                  <div className="space-y-0.5">
                    <span className="font-heading font-black text-sm tracking-tight text-text-main">
                      {order.id}
                    </span>
                    <div className="flex items-center space-x-1.5 text-[10px] text-text-muted font-bold">
                      <Clock size={12} />
                      <span>{getElapsedTime(order.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* Table Badge */}
                  <span className="px-2.5 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-black text-xs rounded-xl flex items-center space-x-1 border border-primary/20">
                    <Table2 size={13} />
                    <span>Table {order.tableNumber}</span>
                  </span>
                </div>

                {/* Client credentials */}
                <div className="bg-bg-surface p-2.5 rounded-2xl text-[10px] sm:text-xs text-text-sub font-semibold space-y-1.5 border border-border-theme">
                  <div className="flex items-center space-x-2">
                    <User size={13} className="text-text-muted" />
                    <span className="font-extrabold text-text-main">{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={13} className="text-text-muted" />
                    <span>{order.mobileNumber}</span>
                  </div>
                </div>
              </div>

              {/* Items lists */}
              <div className="space-y-2 border-t border-b border-border-theme py-3 text-xs">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-wider">Dishes List</p>
                
                <div className="space-y-2 font-medium">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start leading-tight">
                      <div className="space-y-0.5">
                        <p className="font-bold text-text-main">
                          {item.name} <span className="text-primary font-black ml-0.5">x{item.quantity}</span>
                        </p>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-[9px] text-text-muted">
                            + {item.customizations.map(c => c.name).join(', ')}
                          </p>
                        )}
                        {item.instructions && (
                          <p className="text-[9px] text-primary/80 italic">
                            💬 "{item.instructions}"
                          </p>
                        )}
                      </div>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Cook Special comments inside docket */}
                {order.specialInstructions && (
                  <div className="p-2.5 bg-orange-500/5 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-xl text-[10px] font-bold flex items-start space-x-1.5 border border-orange-500/15">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Chef Notes: "{order.specialInstructions}"</span>
                  </div>
                )}
              </div>

              {/* Billing and settle status */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="text-[8px] text-text-muted font-bold uppercase">Pay settled via</p>
                  <p className="font-bold text-text-sub flex items-center space-x-1 mt-0.5">
                    <Banknote size={13} className="text-emerald-500" />
                    <span>{order.paymentMethod.replace('Pay Now ', '')}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600'
                      : 'bg-red-500/10 border-red-500/25 text-red-500'
                  }`}>
                    {order.paymentStatus}
                  </span>
                  <p className="text-sm font-heading font-black text-text-main mt-1">
                    ₹{order.grandTotal}
                  </p>
                </div>
              </div>

              {/* Progress Operations controls */}
              <div className="pt-2 border-t border-border-theme mt-2">
                
                {order.status === 'Received' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
                    <button
                      onClick={() => handleStatusChange(order.id, 'Cancelled')}
                      className="py-2.5 border border-red-200 dark:border-red-950/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'Preparing')}
                      className="py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all cursor-pointer text-center shadow-sm flex items-center justify-center space-x-1"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Accept</span>
                    </button>
                  </div>
                )}

                {order.status === 'Preparing' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'Ready')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Mark as Food Ready</span>
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'Completed')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider flex items-center justify-center space-x-1"
                  >
                    <Check size={14} strokeWidth={3} />
                    <span>Serve & Settle Ticket</span>
                  </button>
                )}

                {(order.status === 'Completed' || order.status === 'Cancelled') && (
                  <div className="p-2 bg-bg-surface rounded-xl text-text-muted text-[10px] font-bold text-center border border-border-theme">
                    Ticket Closed (Order {order.status})
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
