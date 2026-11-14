import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Flame, Sparkles, Tag, Gift, Clock } from 'lucide-react';

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products?offersOnly=true');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans space-y-8">
      
      {/* Offers Hero Header */}
      <div className="bg-gradient-to-r from-[#7A1F1F] via-[#942727] to-[#601515] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-sm">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-900 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-current" />
            Exclusive Hot Deals & Combos
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Special Flavor Offers & Discounted Packs
          </h1>
          <p className="text-sm text-white/85 leading-relaxed">
            Stock up on your favorite authentic spices and gourmet seasonings with up to 20% discount. Handcrafted fresh batches from Narayanganj.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-amber-200">
            <span className="flex items-center gap-1">
              <Gift className="w-4 h-4" /> Free Delivery inside Dhaka on ৳999+
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Limited Stock Available
            </span>
          </div>
        </div>
      </div>

      {/* Offers Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Tag className="w-5 h-5 text-red-600" />
              Special Discounted Spices
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Limited-time discounts applied directly to every jar
            </p>
          </div>
          <span className="text-xs font-bold text-[#7A1F1F] bg-[#7A1F1F]/10 px-3 py-1 rounded-full">
            {products.length} Offers Available
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-stone-500">
            <div className="w-8 h-8 border-3 border-[#7A1F1F] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold">Loading hot offers...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <p className="text-base font-bold text-stone-800">New festival offers coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

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

