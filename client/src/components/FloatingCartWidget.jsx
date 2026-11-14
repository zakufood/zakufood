import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCartWidget() {
  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();

  const formattedPrice = `৳${Number(subtotal || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  return (
    <aside
      aria-label="Floating shopping cart"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-200 hover:-translate-x-1 cursor-pointer select-none group"
      onClick={() => setIsCartOpen(true)}
    >
      <div className="flex flex-col shadow-xl overflow-hidden rounded-l-xl border-l border-t border-b border-[#7A1F1F]/30 w-17 sm:w-20">
        
        {/* Upper Maroon Block: Shopping Bag Icon + Dynamic Item Count */}
        <div className="bg-[#7A1F1F] text-white py-2.5 px-2 flex flex-col items-center justify-center transition-colors group-hover:bg-[#661818]">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white stroke-[2.2]" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-white mt-1 whitespace-nowrap">
            {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {/* Lower Cream/White Block: Total Cart Price */}
        <div className="bg-[#FAF7F0] border-t border-[#7A1F1F]/20 py-1.5 px-1.5 flex items-center justify-center transition-colors group-hover:bg-white">
          <span className="text-[11px] sm:text-xs font-black text-[#7A1F1F] tracking-tight whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

      </div>
    </aside>
  );
}

