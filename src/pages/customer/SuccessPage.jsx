import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, Compass, Utensils, HelpCircle, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const order = location.state?.order;

  // Fallback if accessed directly without state
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted space-y-4">
        <Utensils size={36} />
        <div>
          <h2 className="text-lg font-heading font-extrabold text-text-main">No active transaction found</h2>
          <p className="text-xs font-semibold mt-1">Please browse our delicious food menu to place an order!</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-black px-5 py-2.5 rounded-btn cursor-pointer"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    
    // Simulate compilation of PDF invoice
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      
      // Simulating a real browser PDF trigger
      try {
        const text = `
========================================
       RECEIPT - ${settings.restaurantName.toUpperCase()}
========================================
Order ID: ${order.id}
Table Number: Table ${order.tableNumber}
Customer: ${order.customerName}
Mobile: ${order.mobileNumber}
Date: ${new Date(order.timestamp).toLocaleString()}
----------------------------------------
ITEMS ORDERED:
${order.items.map(i => `- ${i.name} x${i.quantity} (₹${i.price})`).join('\n')}
----------------------------------------
Subtotal: ₹${order.subTotal}
Discount Applied: -₹${order.discount || 0}
GST & Service Tax: ₹${order.taxAmount}
----------------------------------------
GRAND TOTAL: ₹${order.grandTotal}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
========================================
       Thank you for dining with us!
========================================
        `;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Receipt-${order.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.warn("Blob print download failed.", e);
      }

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto text-center py-6 relative">
      {/* Visual background simulated confetti particles */}
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-primary/40 animate-float" />
      <div className="absolute top-20 right-10 w-3.5 h-3.5 rounded-full bg-accent/40 animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-10 left-16 w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-float" style={{ animationDelay: '1s' }} />

      {/* Checklist Header Ring */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-scale-up">
          <CheckCircle2 size={38} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-text-main m-0">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-text-muted font-semibold tracking-wider uppercase mt-1">
            Sent to {settings.restaurantName} Kitchen
          </p>
        </div>
      </div>

      {/* Receipt details docket */}
      <section className="bg-bg-card rounded-card p-5 shadow-sm border border-border-theme text-left space-y-4">
        <div className="flex justify-between items-center border-b border-border-theme pb-3">
          <span className="text-xs font-black uppercase text-text-muted tracking-wider">Transaction Summary</span>
          <span className="text-xs font-mono font-bold text-text-sub">{order.id}</span>
        </div>

        <div className="space-y-2 text-xs font-medium text-text-sub">
          <div className="flex justify-between">
            <span>Dine-In Table</span>
            <span className="font-extrabold text-text-main">Table {order.tableNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer Name</span>
            <span className="font-bold text-text-main">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Mobile</span>
            <span className="font-bold text-text-main">{order.mobileNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-bold text-text-main">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between border-t border-border-theme pt-2 text-sm">
            <span className="font-heading font-black">Amount Billed</span>
            <span className="font-heading font-black text-primary">₹{order.grandTotal}</span>
          </div>
        </div>
      </section>

      {/* Info Warning Alert */}
      <div className="p-3 bg-primary/5 text-primary border border-primary/20 rounded-btn text-[10px] sm:text-xs font-semibold leading-relaxed text-left flex items-start space-x-2">
        <FileText size={18} className="text-primary flex-shrink-0 mt-0.5" />
        <span>
          A digital kitchen ticket has been dispatched. Order state updates will reflect instantly on your tracking portal. Place other items anytime!
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-3">
        <button
          onClick={() => navigate('/profile?tab=orders')}
          className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white font-bold py-3.5 rounded-btn shadow-md shadow-primary/20 flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer"
        >
          <Compass size={16} />
          <span>Track Live Order Progress</span>
        </button>

        <button
          onClick={handleDownloadReceipt}
          disabled={downloading}
          className="w-full bg-bg-surface hover:bg-bg-elevated border border-border-theme text-text-sub font-bold py-3.5 rounded-btn flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer transition-colors"
        >
          {downloading ? (
            <div className="w-4 h-4 rounded-full border-2 border-text-muted border-t-text-main animate-spin" />
          ) : (
            <>
              <Download size={15} />
              <span>{downloadSuccess ? 'Receipt Saved!' : 'Download Invoice (PDF)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Direct link back to menu */}
      <button
        onClick={() => navigate('/')}
        className="text-xs font-extrabold text-text-muted hover:text-text-main uppercase tracking-wider underline cursor-pointer"
      >
        Back to Menu
      </button>
    </div>
  );
};

export default SuccessPage;
