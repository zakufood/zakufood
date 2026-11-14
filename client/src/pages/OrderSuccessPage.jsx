import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Clock, Phone, MapPin, Printer, ArrowRight, Copy, Check, Sparkles, Leaf } from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    // If order was not in location state, fetch it from backend
    if (!order) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-10 h-10 border-4 border-[#7A1F1F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600 font-bold">Verifying order from database...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Order Information Unavailable</h2>
        <p className="text-stone-500 text-sm">We could not locate the details for Order ID: {id}.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A1F1F] text-white rounded-xl font-bold text-sm"
        >
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      
      {/* Success Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm text-center mb-8 relative overflow-hidden">
        {/* Subtle decorative background warmth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-[#F7F1E5]/60 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Existing Green Success Checkmark */}
        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 shadow-xs">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        </div>

        {/* Success Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7F1717] bg-[#7F1717]/10 px-3.5 py-1.5 rounded-full mb-3 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7F1717]"></span>
          <span>Order Successfully Placed & Confirmed</span>
        </div>

        {/* Prominent Thank-You Heading in ZAKU Maroon (#7F1717) */}
        <h1 className="relative z-10 text-xl sm:text-3xl md:text-4xl font-extrabold text-[#7F1717] tracking-tight leading-snug">
          Thank You for Choosing{' '}
          <span className="font-zaku text-[1.12em] inline-block align-baseline translate-y-[1px] tracking-[0.01em]">
            ZAKU
          </span>
          !
        </h1>

        {/* Tasteful Decorative Spice-Themed Visual Accent */}
        <div className="relative z-10 flex items-center justify-center gap-3 my-3 select-none" aria-hidden="true">
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#7F1717]/35" />
          <div className="flex items-center gap-1.5 text-[#7F1717]/70">
            <Sparkles className="w-3.5 h-3.5" />
            <Leaf className="w-4 h-4" />
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#7F1717]/35" />
        </div>

        {/* Supporting Tagline */}
        <p className="relative z-10 text-base sm:text-lg font-semibold text-stone-800 tracking-wide">
          Your Trust Makes Every Bite Special.
        </p>

        {/* Short Brand Message */}
        <p className="relative z-10 text-xs sm:text-sm md:text-base text-stone-600 mt-2 max-w-xl mx-auto leading-relaxed">
          We're delighted to be a part of your kitchen. Your order is confirmed, and we're getting your spices ready with care.
        </p>

        {/* Order ID Badge */}
        <div className="relative z-10 mt-6 inline-flex items-center gap-2 bg-[#F7F1E5] border border-[#E9DFCE] px-4 py-2 rounded-xl text-stone-800 shadow-2xs">
          <span className="text-xs font-semibold text-stone-600">Order ID:</span>
          <span className="font-mono font-black text-base text-[#7F1717]">{order.id}</span>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="p-1 text-stone-500 hover:text-[#7F1717] transition-colors ml-1 cursor-pointer"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Timeline Progress */}
        <div className="border-b border-stone-100 pb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7A1F1F]" />
            Order Status: <span className="text-[#7A1F1F] font-black">{order.status}</span>
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['Pending', 'Confirmed', 'Processing', 'Delivered'].map((step, idx) => {
              const currentStatus = order.status;
              const isPassed =
                currentStatus === 'Delivered' ||
                (currentStatus === 'Shipped' && idx <= 2) ||
                (currentStatus === 'Processing' && idx <= 2) ||
                (currentStatus === 'Confirmed' && idx <= 1) ||
                (currentStatus === 'Pending' && idx === 0);

              return (
                <div key={step} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-colors ${
                      isPassed ? 'bg-[#7A1F1F]' : 'bg-stone-200'
                    }`}
                  />
                  <span className={`font-semibold ${isPassed ? 'text-[#7A1F1F]' : 'text-stone-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items Ordered Breakdown */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#7A1F1F]" />
            Ordered Spices
          </h3>
          <div className="divide-y divide-stone-100">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-50 rounded-lg border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
                    <p className="text-xs text-stone-500">
                      {item.weight} • ৳{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-stone-900">৳{item.total || item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 space-y-2 text-sm border border-stone-100">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-bold text-stone-900">৳{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery Fee ({order.customer?.district}):</span>
            <span className="font-bold text-stone-900">৳{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-base">
            <span className="font-black text-stone-900">Total Payable (Cash on Delivery):</span>
            <span className="text-2xl font-black text-[#7A1F1F]">৳{order.grandTotal}</span>
          </div>
        </div>

        {/* Delivery Address & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7A1F1F]" /> Delivery Address
            </h4>
            <p className="text-sm font-semibold text-stone-900">{order.customer?.address}</p>
            <p className="text-xs text-stone-500 mt-1">{order.customer?.district}, Bangladesh</p>
            {order.customer?.note && (
              <p className="text-xs text-stone-600 italic mt-2 border-t border-stone-100 pt-1">
                Note: "{order.customer.note}"
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#7A1F1F]" /> Contact Information
            </h4>
            <p className="text-sm font-semibold text-stone-900">{order.customer?.name}</p>
            <p className="text-xs font-mono font-bold text-stone-700 mt-1">{order.customer?.phone}</p>
            <p className="text-xs text-emerald-700 font-medium mt-2">
              Payment: {order.paymentMethod || 'Cash on Delivery'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice / Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to={`/track-order?id=${order.id}`}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              Track Order Status
            </Link>

            <Link
              to="/products"
              className="px-6 py-2.5 rounded-xl bg-[#7A1F1F] hover:bg-[#631717] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

