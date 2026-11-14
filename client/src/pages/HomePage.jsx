import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CollectionSection from '../components/CollectionSection';
import WhyChooseZaku from '../components/WhyChooseZaku';
import ServiceStrip from '../components/ServiceStrip';
import QuickViewModal from '../components/QuickViewModal';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 1. Hero Section with Category Sidebar and Complete Original Banner */}
      <HeroSection
        activeCategory={activeCategory}
        onSelectCategory={(catId) => setActiveCategory(catId)}
      />

      {/* 2. THE ONE AND ONLY Our Collection Section (5 Cards, Carousel, Category Filterable) */}
      <CollectionSection
        products={products}
        activeCategory={activeCategory}
        onResetCategory={() => setActiveCategory('all')}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 3. Why Choose ZAKU? Section */}
      <WhyChooseZaku />

      {/* 4. Delivery / Service Highlights Strip */}
      <ServiceStrip />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
