import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Trash2, Plus, Minus, Percent, Clipboard, ArrowRight, X, Utensils } from 'lucide-react';
import { MOCK_COUPONS } from '../../data/mockData';

const CartPage = () => {
  const { 
    cart, removeFromCart, updateCartQuantity, 
    cartSpecialInstructions, setCartSpecialInstructions,
    activeCoupon, validateAndApplyCoupon, removeCoupon,
    getCartSubtotal, getCartDiscount, getCartTax, getCartTotal, settings
  } = useApp();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showCouponsModal, setShowCouponsModal] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) return;

    const res = validateAndApplyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(`Success! Flat ${res.coupon.discountPercent}% discount applied!`);
      setCouponCode('');
    } else {
      setCouponError(res.error);
    }
  };

  const handleQuickCouponApply = (code) => {
    setCouponCode(code);
    setShowCouponsModal(false);
    
    setCouponError('');
    setCouponSuccess('');
    const res = validateAndApplyCoupon(code);
    if (res.success) {
      setCouponSuccess(`Success! Flat ${res.coupon.discountPercent}% discount applied!`);
      setCouponCode('');
    } else {
      setCouponError(res.error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted space-y-4">
        <div className="w-20 h-20 rounded-full bg-bg-surface flex items-center justify-center">
          <Utensils size={36} className="text-primary animate-float" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-extrabold text-text-main m-0">Your Cart is Empty</h2>
          <p className="text-[11px] font-bold text-text-sub mt-1 max-w-[220px] mx-auto leading-relaxed">
            Browse our delicious fresh dishes and add them here to start dining!
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black px-6 py-3 rounded-btn shadow-md shadow-primary/10 transition-all uppercase tracking-wider cursor-pointer"
        >
          View Menu Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <h2 className="text-xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent m-0">
        Review Your Selection
      </h2>

      {/* Cart Items List */}
      <section className="space-y-3.5">
        {cart.map((item, idx) => (
          <div 
            key={idx}
            className="bg-bg-card rounded-card p-3.5 shadow-sm border border-border-theme flex items-center justify-between"
          >
            {/* Food text description */}
            <div className="flex-1 flex space-x-3.5 pr-2">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 rounded-[14px] object-cover flex-shrink-0"
              />
              <div className="space-y-1 text-left flex-1">
                <h4 className="text-sm font-heading font-extrabold text-text-main m-0 leading-tight">
                  {item.name}
                </h4>
                
                {/* Toppings names if selected */}
                {item.customizations && item.customizations.length > 0 && (
                  <p className="text-[9px] text-text-muted font-extrabold leading-normal m-0">
                    + {item.customizations.map(c => c.name).join(', ')}
                  </p>
                )}

                {/* Cooking note if added */}
                {item.instructions && (
                  <p className="text-[9px] text-primary/80 font-bold italic bg-primary-bg px-2 py-0.5 rounded-lg inline-block leading-none mt-1">
                    Note: "{item.instructions}"
                  </p>
                )}

                <p className="text-xs font-black text-text-main font-mono mt-1 leading-none">
                  ₹{item.price}
                </p>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="flex flex-col items-end justify-between h-16 pl-2 flex-shrink-0">
              <button 
                onClick={() => removeFromCart(idx)}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Remove item"
              >
                <Trash2 size={13} />
              </button>

              <div className="flex items-center bg-bg-surface rounded-xl p-0.5 border border-border-theme">
                <button 
                  onClick={() => updateCartQuantity(idx, -1)}
                  className="p-1 rounded-lg hover:bg-bg-card text-text-sub transition-colors"
                >
                  <Minus size={10} strokeWidth={3} />
                </button>
                <span className="w-5 text-center text-xs font-black font-mono">{item.quantity}</span>
                <button 
                  onClick={() => updateCartQuantity(idx, 1)}
                  className="p-1 rounded-lg hover:bg-bg-card text-text-sub transition-colors"
                >
                  <Plus size={10} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Cooking Instructions */}
      <section className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme">
        <div className="flex items-center space-x-1.5 text-text-sub mb-2.5">
          <Clipboard size={14} className="text-primary" />
          <h3 className="text-[10px] font-black uppercase tracking-wider">
            Cooking Preferences for Chef
          </h3>
        </div>
        <textarea
          value={cartSpecialInstructions}
          onChange={(e) => setCartSpecialInstructions(e.target.value)}
          placeholder="e.g. Please make it moderately spicy, add extra spoons..."
          className="w-full text-xs font-semibold p-3 bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card rounded-input outline-none min-h-[60px] resize-none transition-all focus-ring-orange text-text-main"
        />
      </section>

      {/* Discount Coupon code box */}
      <section className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-text-sub">
            <Percent size={14} className="text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-wider">
              Apply Discount Promo
            </h3>
          </div>
          <button
            onClick={() => setShowCouponsModal(true)}
            className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider cursor-pointer"
          >
            View Offers
          </button>
        </div>

        {/* Applied coupon bubble */}
        {activeCoupon ? (
          <div className="bg-primary-bg border border-primary/20 p-3 rounded-2xl flex items-center justify-between text-xs animate-scale-up text-text-main">
            <div className="text-left">
              <p className="font-black text-primary flex items-center space-x-1">
                <Percent size={12} strokeWidth={2.5} />
                <span>Coupon Applied: "{activeCoupon.code}"</span>
              </p>
              <p className="text-[9.5px] text-text-sub font-extrabold mt-0.5">{activeCoupon.description}</p>
            </div>
            <button 
              onClick={removeCoupon}
              className="p-1 rounded-full hover:bg-bg-surface text-text-muted hover:text-text-sub"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex space-x-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="ENTER PROMO CODE"
              className="flex-1 bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-4 py-2.5 rounded-input text-xs sm:text-sm font-bold tracking-widest outline-none transition-all uppercase focus-ring-orange text-text-main"
            />
            <button
              type="submit"
              className="bg-text-main hover:bg-opacity-90 text-bg-main text-xs font-black px-5 py-2.5 rounded-btn transition-colors cursor-pointer"
            >
              Apply
            </button>
          </form>
        )}

        {/* Validation banners */}
        {couponError && (
          <div className="p-2.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-xl border border-red-500/20 animate-slide-up text-left">
            {couponError}
          </div>
        )}
        {couponSuccess && (
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-xl border border-emerald-500/20 animate-slide-up text-left">
            {couponSuccess}
          </div>
        )}
      </section>

      {/* Bill Breakdown Invoice */}
      <section className="bg-bg-card rounded-card p-4.5 shadow-sm border border-border-theme space-y-3 text-xs">
        <h3 className="text-[10px] font-black uppercase text-text-muted tracking-wider mb-2.5 text-left">
          Invoice Breakdown
        </h3>
        
        <div className="flex justify-between items-center text-text-sub">
          <span className="font-semibold">Subtotal</span>
          <span className="font-extrabold font-mono text-text-main">₹{getCartSubtotal()}</span>
        </div>

        {activeCoupon && (
          <div className="flex justify-between items-center text-primary font-bold">
            <span className="font-semibold">Promo Discount ({activeCoupon.discountPercent}%)</span>
            <span className="font-extrabold font-mono">-₹{getCartDiscount()}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-text-sub text-[11px]">
          <span className="font-medium">GST & Service Tax ({settings.gstRatePercent}% + 2.5%)</span>
          <span className="font-bold font-mono">₹{getCartTax()}</span>
        </div>

        {/* Decorative Dotted line separator */}
        <div className="border-t border-dashed border-border-theme my-1" />

        <div className="pt-2.5 flex justify-between items-center text-text-main text-sm sm:text-base">
          <span className="font-heading font-black">Grand Total</span>
          <span className="font-heading font-black text-primary font-mono">₹{getCartTotal()}</span>
        </div>
      </section>

      {/* STICKY BOTTOM CHECKOUT TRIGGER FOR CART (floats above 5-tab) */}
      <div className="fixed bottom-18 left-3 right-3 sm:max-w-xl sm:mx-auto z-40 animate-slide-up">
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover active:scale-95 text-white font-bold py-3.5 px-6 rounded-btn shadow-lg shadow-primary/15 flex items-center justify-between text-xs sm:text-sm cursor-pointer"
        >
          <div className="text-left leading-none">
            <p className="text-[9px] text-white/70 font-black m-0 uppercase tracking-wider">Payable Amount</p>
            <p className="text-sm font-black m-0 mt-0.5 font-mono">₹{getCartTotal()}</p>
          </div>
          <div className="flex items-center space-x-1 font-black uppercase tracking-wider">
            <span>Choose Payment Option</span>
            <ArrowRight size={14} />
          </div>
        </button>
      </div>

      {/* Available Coupons Drawer Modal */}
      {showCouponsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm"
            onClick={() => setShowCouponsModal(false)}
          />
          <div className="relative w-full max-w-md bg-bg-card rounded-t-modal overflow-hidden shadow-2xl z-10 max-h-[70vh] flex flex-col animate-slide-up border-t border-border-theme">
            <div className="flex items-center justify-between p-4 border-b border-border-theme flex-shrink-0">
              <h3 className="font-heading font-extrabold text-sm sm:text-base m-0 text-text-main">Special Bistro Offers</h3>
              <button 
                onClick={() => setShowCouponsModal(false)}
                className="p-1 rounded-lg hover:bg-bg-surface text-text-muted hover:text-text-sub"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar pb-8">
              {MOCK_COUPONS.map((c) => {
                const subtotal = getCartSubtotal();
                const disabled = subtotal < c.minSpend;
                return (
                  <div 
                    key={c.code}
                    onClick={() => {
                      if (!disabled) handleQuickCouponApply(c.code);
                    }}
                    className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between transition-all duration-200 ${
                      disabled
                        ? 'bg-bg-surface border-border-theme text-text-muted opacity-60 cursor-not-allowed'
                        : 'bg-primary-bg border-primary/20 text-text-main hover:scale-[1.01] cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start text-left">
                      <div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border ${
                          disabled 
                            ? 'border-border-theme text-text-muted bg-bg-surface' 
                            : 'border-primary text-primary font-black bg-primary-bg'
                        }`}>
                          {c.code}
                        </span>
                        <p className="font-heading font-extrabold text-sm mt-2">{c.discountPercent}% Discount</p>
                        <p className="text-[10px] text-text-sub font-bold mt-1 leading-relaxed">{c.description}</p>
                      </div>
                      {!disabled && (
                        <span className="text-[9px] font-black text-primary uppercase whitespace-nowrap bg-primary-bg px-2.5 py-1 rounded-xl">Tap Apply</span>
                      )}
                    </div>
                    {disabled && (
                      <p className="text-[9px] text-red-500 font-extrabold mt-2 text-left">
                        Add ₹{c.minSpend - subtotal} more items to unlock!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
