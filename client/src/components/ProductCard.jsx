import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
      
      {/* Product Image: Significantly larger, generous padding, uncropped & undistorted */}
      <Link
        to={`/product/${product.id}`}
        className="block p-5 sm:p-6 pb-2 bg-white flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <div className="w-full h-56 sm:h-64 md:h-68 lg:h-72 flex items-center justify-center bg-stone-50/60 rounded-xl p-4 transition-colors group-hover:bg-stone-50">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-106 drop-shadow-xs"
            loading="eager"
          />
        </div>
      </Link>

      {/* Content Area: Generous typography and spacing */}
      <div className="p-5 sm:p-6 pt-3 flex-1 flex flex-col justify-between">
        
        {/* Name and Weight */}
        <div>
          <Link
            to={`/product/${product.id}`}
            className="block text-base sm:text-lg font-bold text-stone-900 hover:text-[#7A1F1F] transition-colors line-clamp-1 cursor-pointer tracking-tight"
            title={product.name}
          >
            {product.name}
          </Link>
          
          <div className="mt-1.5 text-xs sm:text-sm font-semibold text-stone-500">
            {product.weight}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="mb-3.5 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#7A1F1F] tracking-tight">
              ৳ {product.price}
            </span>
          </div>

          {/* Add to Cart button: Wider, taller & more comfortable to click */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              addedAnimation
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white border-[#7A1F1F] text-[#7A1F1F] hover:bg-[#7A1F1F] hover:text-white shadow-2xs hover:shadow-md'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 stroke-[2]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
