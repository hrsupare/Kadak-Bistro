import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import PaymentPage from './pages/customer/PaymentPage';
import SuccessPage from './pages/customer/SuccessPage';
import UserProfilePage from './pages/customer/UserProfilePage';
import WelcomePage from './pages/customer/WelcomePage';
import SplashPage from './pages/customer/SplashPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import FoodManagementPage from './pages/admin/FoodManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Guard for Welcome Page
const CustomerRouteGuard = ({ children }) => {
  const { customerUser } = useApp();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2-second splash screen E2E
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashPage />;
  }

  if (!customerUser) {
    return <WelcomePage />;
  }

  return children;
};

// Guard for Admin Pages
const AdminRouteGuard = ({ children }) => {
  const { adminUser } = useApp();
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* CUSTOMER PORTAL */}
          <Route 
            path="/" 
            element={
              <CustomerRouteGuard>
                <CustomerLayout />
              </CustomerRouteGuard>
            }
          >
            <Route index element={<MenuPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>

          {/* ADMIN PORTAL */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrderManagementPage />} />
            <Route path="food" element={<FoodManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
