import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-xl border border-stone-200 max-w-2xl w-full overflow-hidden z-10 animate-scaleUp">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="p-6 bg-white flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-auto object-contain"
            />
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A1F1F] bg-[#7A1F1F]/10 px-2.5 py-0.5 rounded-md">
                {product.categoryName || 'ZAKU'}
              </span>

              <h3 className="text-xl font-bold text-stone-900 mt-2">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-black text-[#7A1F1F]">
                  ৳ {product.price}
                </span>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
                  Weight: {product.weight}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#7A1F1F] hover:bg-[#631717] text-white shadow-xs'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border border-stone-300 text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
