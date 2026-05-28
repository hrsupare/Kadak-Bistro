import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MENU, INITIAL_CATEGORIES, MOCK_COUPONS, INITIAL_SETTINGS, INITIAL_ORDERS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- STATE ---
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('ab_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('ab_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ab_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ab_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ab_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', type: 'info', text: 'Welcome to  Kadak Bistro Admin Panel!', time: new Date().toLocaleTimeString(), read: false }
    ];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ab_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCoupon, setActiveCoupon] = useState(null);
  const [cartSpecialInstructions, setCartSpecialInstructions] = useState('');

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('ab_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('ab_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ab_dark');
    return saved === 'true' || settings.isDarkTheme;
  });

  // Sound cue simulation state
  const [playTrigger, setPlayTrigger] = useState(false);

  // --- PERSISTENCE & THEME SYNC ---
  useEffect(() => {
    localStorage.setItem('ab_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('ab_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ab_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ab_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ab_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ab_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('ab_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('ab_admin');
    }
  }, [adminUser]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('ab_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('ab_customer');
    }
  }, [customerUser]);

  useEffect(() => {
    localStorage.setItem('ab_dark', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- AUDIO SOUND NOTIFICATION SIMULATION ---
  const triggerAudioAlert = () => {
    if (!settings.soundNotifications) return;
    setPlayTrigger(prev => !prev);
    // Simple oscillator beep for responsive web audio api without external files
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.65);
    } catch (e) {
      console.warn("Audio Context beep suppressed or block by browser autoplay policies.", e);
    }
  };

  // --- METHODS ---

  // Auth Operations
  const loginAdmin = (email, password) => {
    if (email === 'admin@bistro.com' && password === 'admin123') {
      const user = { email, name: 'Senior Manager' };
      setAdminUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials! (Use: admin@bistro.com / admin123)' };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const loginCustomer = (name, mobile, table) => {
    if (!name || !mobile || !table) return { success: false, error: 'All fields are strictly required!' };
    const user = { name, mobile, table };
    setCustomerUser(user);
    return { success: true };
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    setCart([]);
    setActiveCoupon(null);
    setCartSpecialInstructions('');
  };

  // Cart Operations
  const addToCart = (item, quantity = 1, selectedCusts = [], instructions = '') => {
    const customizationsTotal = selectedCusts.reduce((sum, c) => sum + c.price, 0);
    const itemPrice = item.discountPrice || item.price;
    const finalPrice = itemPrice + customizationsTotal;

    const cartItem = {
      id: item.id,
      name: item.name,
      basePrice: itemPrice,
      price: finalPrice,
      quantity,
      image: item.image,
      customizations: selectedCusts,
      instructions
    };

    setCart(prev => {
      // Check if item with exact same customizations already exists
      const existingIdx = prev.findIndex(c =>
        c.id === item.id &&
        JSON.stringify(c.customizations) === JSON.stringify(selectedCusts)
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, idx) => idx !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setCartSpecialInstructions('');
  };

  // Coupon validations
  const validateAndApplyCoupon = (code) => {
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) return { success: false, error: 'Coupon code is invalid!' };

    const subtotal = getCartSubtotal();
    if (subtotal < coupon.minSpend) {
      return { success: false, error: `Minimum spend of ₹${coupon.minSpend} required for this coupon!` };
    }

    setActiveCoupon(coupon);
    return { success: true, coupon };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Cart Calculations
  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartDiscount = () => {
    if (!activeCoupon) return 0;
    const subtotal = getCartSubtotal();
    return Math.round((subtotal * activeCoupon.discountPercent) / 100);
  };

  const getCartTax = () => {
    const subtotal = getCartSubtotal() - getCartDiscount();
    const totalTaxRate = settings.gstRatePercent + settings.serviceTaxPercent;
    return parseFloat(((subtotal * totalTaxRate) / 100).toFixed(2));
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const tax = getCartTax();
    return parseFloat((subtotal - discount + tax + settings.deliveryCharge).toFixed(2));
  };

  // Order Operations
  const placeOrder = (paymentMethod) => {
    if (!customerUser) return { success: false, error: 'No active session!' };
    if (cart.length === 0) return { success: false, error: 'Your cart is completely empty!' };

    const subTotal = getCartSubtotal();
    const discount = getCartDiscount();
    const taxAmount = getCartTax();
    const grandTotal = getCartTotal();

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerUser.name,
      mobileNumber: customerUser.mobile,
      tableNumber: customerUser.table,
      items: [...cart],
      specialInstructions: cartSpecialInstructions,
      paymentMethod,
      paymentStatus: paymentMethod.includes('Now') ? 'Paid' : 'Pending',
      status: 'Received', // Received, Preparing, Ready, Served/Completed, Cancelled
      timestamp: new Date().toISOString(),
      subTotal,
      discount,
      taxAmount,
      grandTotal
    };

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Push live notification for Admin
    const newNotif = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      type: 'order',
      text: `🔔 New Order! Table ${newOrder.tableNumber} placed a ₹${newOrder.grandTotal} order (${newOrder.items.length} items)`,
      time: new Date().toLocaleTimeString(),
      read: false,
      meta: { orderId: newOrder.id }
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Simulate real audio bell chime for Admin
    triggerAudioAlert();

    // Clear Customer cart
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let paymentStatus = order.paymentStatus;
        if (newStatus === 'Completed' && order.paymentMethod.includes('Later')) {
          paymentStatus = 'Paid'; // Automatically marked paid when served
        }
        return { ...order, status: newStatus, paymentStatus };
      }
      return order;
    }));

    // Add alert notification for specific actions
    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      const alertNotif = {
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        type: newStatus === 'Completed' ? 'success' : 'alert',
        text: newStatus === 'Completed'
          ? `✓ Order ${orderId} has been successfully completed and served.`
          : `✕ Order ${orderId} has been cancelled by the admin.`,
        time: new Date().toLocaleTimeString(),
        read: false
      };
      setNotifications(prev => [alertNotif, ...prev]);
    }
  };

  // Admin CRUD: Food Items
  const addMenuItem = (itemData) => {
    const newItem = {
      id: `food-${Math.random().toString(36).substr(2, 9)}`,
      rating: 5.0,
      reviewsCount: 0,
      inStock: true,
      customizations: [],
      ...itemData
    };
    setMenu(prev => [...prev, newItem]);

    // Check low stock alert simulation
    if (!newItem.inStock) {
      addSystemNotification('alert', `⚠️ Low stock alert: "${newItem.name}" is marked as out of stock.`);
    }

    return { success: true, item: newItem };
  };

  const editMenuItem = (itemId, updatedData) => {
    setMenu(prev => prev.map(item => item.id === itemId ? { ...item, ...updatedData } : item));

    // Check low stock alert simulation
    if (updatedData.inStock === false) {
      const item = menu.find(m => m.id === itemId);
      addSystemNotification('alert', `⚠️ Out of stock alert: "${item ? item.name : 'Food Item'}" is marked unavailable.`);
    }

    return { success: true };
  };

  const deleteMenuItem = (itemId) => {
    setMenu(prev => prev.filter(item => item.id !== itemId));
    return { success: true };
  };

  const addSystemNotification = (type, text) => {
    const newNotif = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      type,
      text,
      time: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    triggerAudioAlert();
  };

  // Admin CRUD: Categories
  const addCategory = (name) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    const newCat = { id: newId, name, icon: 'Grid' };
    setCategories(prev => [...prev, newCat]);
    return { success: true };
  };

  const editCategory = (catId, newName) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, name: newName } : c));
    return { success: true };
  };

  const deleteCategory = (catId) => {
    if (catId === 'all') return { success: false, error: 'Cannot delete default category!' };
    setCategories(prev => prev.filter(c => c.id !== catId));
    return { success: true };
  };

  const reorderCategories = (newCategoriesList) => {
    setCategories(newCategoriesList);
  };

  // Toggle single values
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      menu,
      categories,
      settings,
      setSettings,
      orders,
      notifications,
      cart,
      activeCoupon,
      cartSpecialInstructions,
      setCartSpecialInstructions,
      adminUser,
      customerUser,
      isDarkMode,
      setIsDarkMode,
      playTrigger,

      // Operations
      loginAdmin,
      logoutAdmin,
      loginCustomer,
      logoutCustomer,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      validateAndApplyCoupon,
      removeCoupon,
      placeOrder,
      updateOrderStatus,
      addMenuItem,
      editMenuItem,
      deleteMenuItem,
      addCategory,
      editCategory,
      deleteCategory,
      reorderCategories,
      markNotificationAsRead,
      clearAllNotifications,
      addSystemNotification,
      triggerAudioAlert,

      // Calculations
      getCartSubtotal,
      getCartDiscount,
      getCartTax,
      getCartTotal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
