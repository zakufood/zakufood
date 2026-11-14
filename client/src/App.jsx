import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingCartWidget from './components/FloatingCartWidget';

// Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OffersPage from './pages/OffersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/AdminDashboard';
import { FAQPage, DeliveryInfoPage, ReturnPolicyPage, PrivacyPolicyPage, TermsPage } from './pages/InfoPages';

function ToastNotifier() {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#7A1F1F] text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 font-sans text-xs sm:text-sm font-bold">
      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
      <span>{toastMessage}</span>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-[#7A1F1F] selection:text-white">
          <Header />
          
          <main className="flex-1 bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:id" element={<OrderSuccessPage />} />
              <Route path="/track-order" element={<OrderTrackingPage />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Informational pages */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/delivery-info" element={<DeliveryInfoPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Catch-all */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />

          {/* Floating Right-Edge Cart Widget */}
          <FloatingCartWidget />

          {/* Slide-out Cart Drawer */}
          <CartDrawer />

          {/* Toast Notifications */}
          <ToastNotifier />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
