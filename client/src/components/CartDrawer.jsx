import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
    clearCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#7A1F1F] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-base tracking-wide">
                Your Shopping Cart ({totalItemsCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-stone-900">Your cart is empty</h4>
                  <p className="text-sm text-stone-500 mt-1 max-w-xs">
                    Explore our collection of authentic spices and seasonings to fill your kitchen with rich flavors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-6 py-2.5 bg-[#7A1F1F] text-white rounded-full font-bold text-sm hover:bg-[#631717] transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3 sm:gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-50 rounded-xl border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-stone-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {item.weight} • <span className="text-[#7A1F1F] font-bold">৳{item.price}</span>
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-sm sm:text-base text-[#7A1F1F]">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call-to-Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
              {/* Delivery Note */}
              <div className="text-xs text-stone-600 flex justify-between">
                <span>Estimated Delivery Fee:</span>
                <span className="font-semibold text-stone-900">৳60 (Dhaka) / ৳120 (Outside)</span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
                <span className="text-sm font-medium text-stone-700">Subtotal:</span>
                <span className="text-xl font-black text-[#7A1F1F]">৳ {subtotal}</span>
              </div>

              {/* Buttons */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full py-3.5 px-4 bg-[#7A1F1F] hover:bg-[#631717] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="hover:text-red-600 underline"
                >
                  Clear Cart
                </button>
                <span>⚡ Cash on Delivery Available</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

