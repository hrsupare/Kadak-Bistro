import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft, CreditCard, QrCode, Smartphone, Building,
  ShieldCheck, HelpCircle, AlertCircle, CheckCircle2
} from 'lucide-react';

const PaymentPage = () => {
  const { getCartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const grandTotal = getCartTotal();

  const [activeTab, setActiveTab] = useState('upi'); // upi, card, wallet, netbanking

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Payment loader states
  const [paymentStep, setPaymentStep] = useState(0); // 0: idle, 1: connecting, 2: authenticating, 3: approved
  const [payMethodLabel, setPayMethodLabel] = useState('');

  const tabs = [
    { id: 'upi', label: 'UPI / GPay', icon: QrCode },
    { id: 'card', label: 'Cards', icon: CreditCard },
    { id: 'wallet', label: 'Wallets', icon: Smartphone },
    { id: 'netbanking', label: 'Net Banking', icon: Building }
  ];

  const handlePaySubmit = (e) => {
    e.preventDefault();

    let label = 'Online Payment';
    if (activeTab === 'upi') label = 'Pay Now (UPI)';
    else if (activeTab === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert("Please fill in all credit card fields.");
        return;
      }
      label = `Pay Now (Card ending in ${cardNumber.slice(-4)})`;
    }
    else if (activeTab === 'wallet') label = 'Pay Now (Wallet)';
    else label = 'Pay Now (Net Banking)';

    setPayMethodLabel(label);

    // Start E2E step animations
    setPaymentStep(1); // Connecting...

    setTimeout(() => {
      setPaymentStep(2); // Authenticating...

      setTimeout(() => {
        setPaymentStep(3); // Approved!

        setTimeout(() => {
          const res = placeOrder(label);
          setPaymentStep(0);

          if (res.success) {
            navigate('/success', { state: { order: res.order } });
          } else {
            alert(res.error);
          }
        }, 1200);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-border-theme pb-3">
        <button
          onClick={() => navigate('/checkout')}
          className="p-1 rounded-xl hover:bg-bg-surface text-text-sub transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-heading font-extrabold tracking-tight m-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Secure Payment
        </h2>
      </div>

      {/* Bill summary preview */}
      <section className="bg-bg-card rounded-card p-4 shadow-sm border border-border-theme flex justify-between items-center text-xs text-left">
        <div>
          <h4 className="text-[10px] font-black uppercase text-text-muted tracking-wider m-0">Final Bill Amount</h4>
          <p className="text-[9.5px] text-text-sub font-extrabold mt-1">Transaction Ref: Ref-{Math.floor(100000 + Math.random() * 900000)}</p>
        </div>
        <span className="text-lg font-heading font-black text-primary font-mono">
          ₹{grandTotal}
        </span>
      </section>

      {/* Main payment box layout */}
      <div className="bg-bg-card rounded-card shadow-sm border border-border-theme overflow-hidden flex flex-col md:flex-row min-h-[380px]">
        {/* Left Side: Tabs buttons */}
        <div className="w-full md:w-44 bg-bg-surface border-r border-border-theme flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start space-x-2.5 px-4 py-4 font-black text-[10px] border-b border-transparent md:border-b-0 md:border-l-4 transition-all uppercase tracking-wider text-center md:text-left ${isSelected
                    ? 'border-primary text-primary bg-primary-bg font-black'
                    : 'text-text-muted hover:bg-bg-surface'
                  }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline-block md:inline-block whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Inputs views */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <form onSubmit={handlePaySubmit} className="space-y-5">
            {/* View: UPI / QR Scan */}
            {activeTab === 'upi' && (
              <div className="space-y-4 text-center animate-scale-up">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-bg-card rounded-2xl flex items-center justify-center p-3 border border-border-theme relative group shadow-sm">
                    {/* Simulated visual QR Code */}
                    <div className="w-full h-full bg-bg-surface rounded flex flex-col justify-between p-1 text-[8px] font-black text-text-sub tracking-tighter">
                      <div className="flex justify-between">
                        <div className="w-7 h-7 bg-text-main rounded border border-bg-card" />
                        <div className="w-7 h-7 bg-text-main rounded border border-bg-card" />
                      </div>
                      <div className="text-[5.5px] text-center font-bold font-mono text-text-muted">BISTRO-UPI-QR</div>
                      <div className="flex justify-between">
                        <div className="w-7 h-7 bg-text-main rounded border border-bg-card" />
                        <div className="w-5 h-5 bg-primary rounded border border-bg-card" />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-wider mt-3">
                    Scan with GPay, PhonePe, Paytm, or BHIM
                  </p>
                </div>
                <div className="bg-bg-surface p-3 rounded-2xl border border-border-theme text-[10px] sm:text-xs text-text-sub font-semibold space-y-1.5 text-center">
                  <p className="font-black text-text-main uppercase leading-none">UPI VPA: <span className="text-primary select-all font-mono">bistro@ybl</span></p>
                  <p className="m-0 text-[10px] text-text-muted leading-normal">Or input your personal UPI address to request payment.</p>
                  <input
                    type="text"
                    placeholder="e.g. himanshu@okaxis"
                    className="w-full bg-bg-card border border-border-theme focus:border-primary text-center font-mono py-2 rounded-xl text-xs outline-none mt-2 font-bold tracking-widest uppercase shadow-sm text-text-main focus-ring-orange"
                  />
                </div>
              </div>
            )}

            {/* View: Credit Cards */}
            {activeTab === 'card' && (
              <div className="space-y-4 animate-scale-up text-left">
                {/* Visual Premium Debit Card Mock - styled in warm Orange food gradient */}
                <div className="w-full h-36 bg-gradient-to-tr from-primary to-primary-light rounded-[24px] p-4.5 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-primary-light/10">
                  <div className="absolute top-[-30%] right-[-10%] w-36 h-36 rounded-full bg-white/10 blur-2xl animate-pulse" />
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black italic tracking-widest text-white/70 uppercase"> Kadak Premium Card</span>
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold font-mono tracking-widest mb-1.5">
                      {cardNumber ? cardNumber.replace(/(.{4})/g, '$1 ') : '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[7.5px] text-white/60 uppercase leading-none font-bold">Holder Name</p>
                        <p className="text-[9.5px] font-black tracking-wide leading-none mt-1 uppercase truncate max-w-[120px]">{cardName || 'GUEST CUSTOMER'}</p>
                      </div>
                      <div>
                        <p className="text-[7.5px] text-white/60 uppercase leading-none font-bold">Expires</p>
                        <p className="text-[9.5px] font-black tracking-wide leading-none mt-1 font-mono">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 16) setCardNumber(val);
                    }}
                    placeholder="CARD NUMBER"
                    className="w-full bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest outline-none transition-all shadow-sm text-text-main focus-ring-orange"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 4) {
                          if (val.length > 2) {
                            val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          }
                          setCardExpiry(val);
                        }
                      }}
                      placeholder="EXP (MM/YY)"
                      className="bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest outline-none transition-all text-center shadow-sm text-text-main focus-ring-orange"
                    />
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 3) setCardCvv(val);
                      }}
                      placeholder="CVV"
                      className="bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest outline-none transition-all text-center shadow-sm text-text-main focus-ring-orange"
                    />
                  </div>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="CARDHOLDER NAME"
                    className="w-full bg-bg-surface border border-transparent focus:border-primary focus:bg-bg-card px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none transition-all uppercase shadow-sm text-text-main focus-ring-orange"
                  />
                </div>
              </div>
            )}

            {/* View: Wallets */}
            {activeTab === 'wallet' && (
              <div className="space-y-3.5 animate-scale-up">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">
                  Select Digital Wallet
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay'].map((w) => (
                    <button
                      type="button"
                      key={w}
                      className="p-3 border border-border-theme rounded-2xl hover:border-primary hover:bg-primary-bg text-xs font-extrabold text-text-sub text-center transition-all cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* View: Net Banking */}
            {activeTab === 'netbanking' && (
              <div className="space-y-3.5 animate-scale-up">
                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider text-center">
                  Select Banking Institution
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      className="p-3 border border-border-theme rounded-2xl hover:border-primary hover:bg-primary-bg text-xs font-extrabold text-text-sub text-center transition-all cursor-pointer"
                    >
                      🏦 {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions secure SSL parameters */}
            <div className="pt-4 border-t border-border-theme mt-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-1.5 text-[9.5px] text-text-muted font-bold">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover active:scale-95 text-white text-xs font-black px-6 py-3 rounded-btn shadow-md shadow-primary/10 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Pay Securely ₹{grandTotal}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECURE PAYMENT LOADING SCREEN BLOCKER */}
      {paymentStep > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white px-6">
          <div className="max-w-xs text-center space-y-5 animate-scale-up">

            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {paymentStep < 3 ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </>
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow shadow-emerald-500/30 animate-scale-up">
                  <CheckCircle2 size={36} strokeWidth={2.5} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-heading font-extrabold m-0">
                {paymentStep === 1 && 'Secure Gateway'}
                {paymentStep === 2 && 'Bank Verification'}
                {paymentStep === 3 && 'Payment Approved!'}
              </h3>

              <p className="text-[10px] sm:text-xs text-white/70 font-semibold leading-relaxed">
                {paymentStep === 1 && 'Initiating secure handshake with merchant bank...'}
                {paymentStep === 2 && 'Confirming token structures and table reservation...'}
                {paymentStep === 3 && 'Kitchen ticket generated. Redirecting to receipt page...'}
              </p>
            </div>

            {paymentStep < 3 && (
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-primary transition-all duration-1000 ${paymentStep === 1 ? 'w-[40%]' : 'w-[85%]'
                  }`} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
