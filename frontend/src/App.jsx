import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

// layouts
import MartLayout from './layouts/MartLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Pages
import MartHome from './pages/grocery/MartHome.jsx';
import ProductListing from './pages/grocery/ProductListing.jsx';
import ProductDetail from './pages/grocery/ProductDetail.jsx';
import SearchPage from './pages/grocery/SearchPage.jsx';

import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import CartPage from './pages/grocery/CartPage.jsx';
import WishlistPage from './pages/grocery/WishlistPage.jsx';
import UserProfile from './pages/grocery/UserProfile.jsx';
import CheckoutPage from './pages/grocery/CheckoutPage.jsx';
import OrderTracking from './pages/grocery/OrderTracking.jsx';

// Lazy Loaded Admin Panels
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement.jsx'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement.jsx'));
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement.jsx'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement.jsx'));
const CustomerManagement = lazy(() => import('./pages/admin/CustomerManagement.jsx'));
const CouponManagement = lazy(() => import('./pages/admin/CouponManagement.jsx'));
const OfferManagement = lazy(() => import('./pages/admin/OfferManagement.jsx'));
const BannerManagement = lazy(() => import('./pages/admin/BannerManagement.jsx'));
const Reports = lazy(() => import('./pages/admin/Reports.jsx'));
const NotificationsPage = lazy(() => import('./pages/admin/NotificationsPage.jsx'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs.jsx'));

// Premium monochrome page loader
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-6 h-6 border-t border-black rounded-full animate-spin"></div>
    <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase font-light">Loading Admin Module...</span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Dynamic Hot Toaster notifications */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '11px',
            fontFamily: 'Outfit, Inter, sans-serif',
            borderRadius: '0px',
            letterSpacing: '0.1em',
            padding: '12px 24px'
          }
        }}
      />
      
      <Routes>
        {/* Landing screen */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Clothing teaser */}
        <Route path="/collection" element={<ComingSoon />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Grocery Mart section */}
        <Route path="/mart" element={<MartLayout />}>
          <Route index element={<MartHome />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-tracking/:id" element={<OrderTracking />} />
        </Route>

        {/* Admin Console section with Lazy Suspense splits */}
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="offers" element={<OfferManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="banners" element={<BannerManagement />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="logs" element={<ActivityLogs />} />
        </Route>

        {/* Fallback to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
