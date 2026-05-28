import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, ChefHat, Mic, Zap, Volume2 } from 'lucide-react';

// ─── Demo order generator ─────────────────────────────────────────────────────
const DEMO_NAMES  = ['Priya Sharma', 'Rohan Mehta', 'Neha Gupta', 'Arjun Patel', 'Kavya Reddy', 'Siddharth Rao'];
const DEMO_ITEMS  = [
  [{ name: 'Double Cheese Margherita', price: 299, quantity: 1 }, { name: 'Fresh Mint Mojito', price: 99, quantity: 2 }],
  [{ name: 'Smokehouse BBQ Burger', price: 249, quantity: 2 }, { name: 'Hot Chocolate Lava Brownie', price: 179, quantity: 1 }],
  [{ name: 'Schezwan Noodles', price: 189, quantity: 1 }, { name: 'Tandoori Paneer Tikka', price: 279, quantity: 1 }],
  [{ name: 'Fiery Sriracha Wings', price: 289, quantity: 3 }],
  [{ name: 'Spicy Peri Peri Pizza', price: 449, quantity: 1 }, { name: 'Iced Caramel Macchiato', price: 179, quantity: 2 }],
];

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderToastNotification = () => {
  const { orders, settings, placeOrder, speakOrder, triggerAudioAlert } = useApp();

  const [toast, setToast]         = useState(null);   // { order, id }
  const [visible, setVisible]     = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress]   = useState(100);    // countdown bar

  const prevOrdersRef = useRef(orders.length);
  const dismissTimer  = useRef(null);
  const progressTimer = useRef(null);
  const TOAST_MS      = 8000;

  // ── Watch for genuinely NEW orders (length increase) ──────────────────────
  useEffect(() => {
    if (orders.length > prevOrdersRef.current) {
      const latestOrder = orders[0];
      prevOrdersRef.current = orders.length;
      showToast(latestOrder);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  const showToast = (order) => {
    // Clear any existing toast first
    clearTimers();
    setToast({ order, id: order.id });
    setProgress(100);
    setVisible(true);

    // Auto-dismiss countdown
    const start = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_MS) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearTimers();
    }, 50);

    dismissTimer.current = setTimeout(() => dismissToast(), TOAST_MS);

    // Track speaking state for the mic pulse indicator
    if (settings.voiceEnabled && 'speechSynthesis' in window) {
      setIsSpeaking(true);
      const checkInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setIsSpeaking(false);
          clearInterval(checkInterval);
        }
      }, 200);
    }
  };

  const clearTimers = () => {
    clearTimeout(dismissTimer.current);
    clearInterval(progressTimer.current);
  };

  const dismissToast = () => {
    clearTimers();
    setVisible(false);
    setTimeout(() => setToast(null), 350); // wait for fade-out animation
  };

  // ── Demo: Generate a synthetic new order for client presentations ──────────
  const generateDemoOrder = () => {
    const name       = DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)];
    const items      = DEMO_ITEMS[Math.floor(Math.random() * DEMO_ITEMS.length)];
    const table      = String(Math.floor(1 + Math.random() * 8));
    const grandTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const demoOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      mobileNumber: '9900000000',
      tableNumber: table,
      items,
      specialInstructions: '',
      paymentMethod: 'Pay Now (UPI)',
      paymentStatus: 'Paid',
      status: 'Received',
      timestamp: new Date().toISOString(),
      subTotal: grandTotal,
      discount: 0,
      taxAmount: Math.round(grandTotal * 0.075),
      grandTotal: Math.round(grandTotal * 1.075)
    };

    triggerAudioAlert();
    speakOrder(demoOrder);
    showToast(demoOrder);
  };

  if (!toast) {
    // Even when no toast, render the demo button
    return (
      <DemoButton onClick={generateDemoOrder} />
    );
  }

  const { order } = toast;

  return (
    <>
      {/* Toast Popup */}
      <div
        className="order-toast-wrapper"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          zIndex: 9999,
          maxWidth: '340px',
          width: 'calc(100vw - 32px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Card */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(255,107,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}>
          {/* Orange header bar */}
          <div style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FFA559 100%)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Animated bell icon */}
              <div style={{
                width: 34, height: 34,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'toastBellRing 0.6s ease-in-out 2',
              }}>
                <Bell size={17} color="white" fill="white" />
              </div>
              <div>
                <p style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  🔔 New Order Alert
                </p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '10px', fontWeight: 700 }}>
                  Table {order.tableNumber} · {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isSpeaking && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'rgba(255,255,255,0.2)', borderRadius: '20px',
                  padding: '3px 8px',
                }}>
                  <Mic size={11} color="white" />
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                    {[1,2,3].map(i => (
                      <span key={i} style={{
                        display: 'block', width: '3px', borderRadius: '2px',
                        background: 'white',
                        height: `${4 + (i * 3)}px`,
                        animation: `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <button onClick={dismissToast} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: '50%', width: 26, height: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
              }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 900, fontSize: '14px', color: 'var(--color-text-main)' }}>
                  {order.customerName}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {order.id} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFA559)',
                borderRadius: '12px', padding: '6px 12px',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: '15px' }}>₹{Math.round(order.grandTotal)}</p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</p>
              </div>
            </div>

            {/* Item preview (max 2) */}
            <div style={{
              background: 'var(--color-bg-surface)',
              borderRadius: '12px', padding: '8px 10px',
              marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              {order.items.slice(0, 2).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ChefHat size={11} color="var(--color-primary)" />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sub)' }}>
                      {item.quantity}× {item.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}...
                </p>
              )}
            </div>

            {/* Payment badge */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{
                fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em',
                padding: '3px 9px', borderRadius: '20px',
                background: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fff7ed',
                color: order.paymentStatus === 'Paid' ? '#16a34a' : '#ea580c',
                border: `1px solid ${order.paymentStatus === 'Paid' ? '#bbf7d0' : '#fed7aa'}`,
              }}>
                {order.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Pay Later'}
              </span>
              <span style={{
                fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)',
              }}>
                {order.paymentMethod}
              </span>
            </div>
          </div>

          {/* Progress countdown bar */}
          <div style={{ height: '3px', background: 'var(--color-bg-surface)' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FF6B00, #FFA559)',
              transition: 'width 0.05s linear',
              borderRadius: '0 0 0 3px',
            }} />
          </div>
        </div>
      </div>

      {/* Demo Button */}
      <DemoButton onClick={generateDemoOrder} />

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes toastBellRing {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(-18deg); }
          40%  { transform: rotate(18deg); }
          60%  { transform: rotate(-12deg); }
          80%  { transform: rotate(12deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes waveBar {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.5); }
        }
      `}</style>
    </>
  );
};

// ── Floating Demo Button ──────────────────────────────────────────────────────
const DemoButton = ({ onClick }) => (
  <button
    id="generate-demo-order-btn"
    onClick={onClick}
    title="Generate a demo order (for client presentation)"
    style={{
      position: 'fixed',
      bottom: '80px',
      left: '16px',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'linear-gradient(135deg, #FF6B00 0%, #FFA559 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '10px 16px',
      fontSize: '11px',
      fontWeight: 900,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(255,107,0,0.35)',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,107,0,0.45)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,107,0,0.35)'; }}
  >
    <Zap size={13} fill="white" />
    Simulate Order
  </button>
);

export default OrderToastNotification;
