import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowRight, CreditCard, Banknote, ShieldAlert, ArrowLeft, Table2, User, Phone } from 'lucide-react';

const CheckoutPage = () => {
  const { customerUser, getCartTotal, placeOrder, settings } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const grandTotal = getCartTotal();

  const handlePayLater = () => {
    if (window.confirm("Confirm placing order with 'Pay Later' (Cash at Table/Counter)?")) {
      setLoading(true);
      setTimeout(() => {
        const res = placeOrder('Pay Later (Cash)');
        setLoading(false);
        if (res.success) {
          navigate('/success', { state: { order: res.order } });
        } else {
          alert(res.error);
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center space-x-2 border-b border-border-theme pb-3">
        <button 
          onClick={() => navigate('/cart')}
          className="p-1 rounded-xl hover:bg-bg-surface text-text-sub transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Checkout Method
        </h2>
      </div>

      {/* Verification details summary */}
      <section className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme space-y-4">
        <h3 className="text-[10px] font-black uppercase text-text-muted tracking-wider m-0 text-left">
          Dine-In Credentials
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left font-bold text-text-sub">
          <div className="flex items-center space-x-2.5 bg-bg-surface p-3 rounded-2xl border border-border-theme">
            <Table2 size={16} className="text-primary" />
            <div>
              <p className="text-[8.5px] text-text-muted font-extrabold m-0 uppercase leading-none">Dining Seat</p>
              <p className="font-extrabold text-text-main m-0 mt-1 leading-none">Table {customerUser.table}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-bg-surface p-3 rounded-2xl border border-border-theme">
            <User size={16} className="text-primary" />
            <div>
              <p className="text-[8.5px] text-text-muted font-extrabold m-0 uppercase leading-none">Guest Name</p>
              <p className="font-extrabold text-text-main m-0 mt-1 leading-none truncate max-w-[100px]">{customerUser.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 bg-bg-surface p-3 rounded-2xl border border-border-theme">
            <Phone size={16} className="text-primary" />
            <div>
              <p className="text-[8.5px] text-text-muted font-extrabold m-0 uppercase leading-none">Mobile</p>
              <p className="font-extrabold text-text-main m-0 mt-1 leading-none">{customerUser.mobile}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bill summary preview */}
      <section className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme flex justify-between items-center text-xs text-left">
        <div>
          <h4 className="text-[10px] font-black uppercase text-text-muted tracking-wider m-0">Final Payable Amount</h4>
          <p className="text-[10px] text-text-sub font-extrabold mt-1">Includes all GST & service taxes</p>
        </div>
        <span className="text-xl font-heading font-black text-primary font-mono">
          ₹{grandTotal}
        </span>
      </section>

      {/* Path selection cards */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-text-muted tracking-wider text-left">
          Select Settlement Preference
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          
          {/* Card Option: Pay Now */}
          <div 
            onClick={() => {
              if (!loading) navigate('/payment');
            }}
            className="bg-bg-card rounded-card p-5 shadow-sm hover:shadow-md border border-border-theme transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group scale-100 hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-primary-bg text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm border border-primary-light/10">
                <CreditCard size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg border border-primary/20">
                Fastest Checkout
              </span>
            </div>

            <div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-text-main m-0">
                Pay Online Now
              </h4>
              <p className="text-[10px] sm:text-xs text-text-sub leading-relaxed font-bold mt-1.5">
                Pay securely using **UPI, GPay, Credit/Debit Card, or Net Banking**. Get instant digital transaction summaries.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-black text-primary pt-2.5 border-t border-border-theme">
              <span>Secure Payment Portal</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card Option: Pay Later */}
          <div 
            onClick={handlePayLater}
            className="bg-bg-card rounded-card p-5 shadow-sm hover:shadow-md border border-border-theme transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group scale-100 hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-primary-bg text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm border border-primary-light/10">
                <Banknote size={20} />
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest bg-bg-surface text-text-sub px-2.5 py-0.5 rounded-lg border border-border-theme">
                Pay At Counter
              </span>
            </div>

            <div>
              <h4 className="font-heading font-extrabold text-sm sm:text-base text-text-main m-0">
                Pay Later (Cash/Card)
              </h4>
              <p className="text-[10px] sm:text-xs text-text-sub leading-relaxed font-bold mt-1.5">
                Place order instantly! Kitchen receives your ticket right away. Settle your final invoice using **Cash or Card at counter** when leaving.
              </p>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-black text-primary pt-2.5 border-t border-border-theme">
              <span>Place Kitchen Ticket</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Security notice */}
      <div className="bg-bg-card rounded-card p-4.5 flex items-start space-x-3 text-[10px] text-text-sub font-semibold leading-relaxed text-left border border-border-theme">
        <ShieldAlert size={18} className="text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-text-main font-black uppercase tracking-wider mb-0.5">Dining Security Check</p>
          Your session details are bound to Table {customerUser.table}. If you choose to settle bills later, table servers will double-check items upon billing. GST ({settings.gstRatePercent}%) is automatically declared.
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
