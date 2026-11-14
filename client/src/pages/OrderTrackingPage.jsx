import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialId) {
      trackOrder(initialId);
    }
  }, [initialId]);

  const trackOrder = async (idToTrack) => {
    const cleanId = (idToTrack || orderIdInput).trim();
    if (!cleanId) {
      setError('Please enter a valid Order ID (e.g. ZAKU-2026-1001).');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError('No order found with this ID. Please double check your order number or invoice.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Unable to fetch order status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    trackOrder(orderIdInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Track Your Spice Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your <span className="font-zaku tracking-wide text-stone-700 font-semibold">ZAKU</span> order ID (found on your order confirmation screen or SMS) to check real-time progress.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-4 sm:p-6 shadow-xs max-w-xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. ZAKU-2026-1001"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#7A1F1F]"
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#7A1F1F] hover:bg-[#631717] disabled:bg-stone-300 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Results */}
      {order && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Order Tracking Information
              </span>
              <h2 className="text-xl font-black text-stone-900 mt-1">
                {order.id}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#7A1F1F]/10 text-[#7A1F1F] px-4 py-2 rounded-xl border border-[#7A1F1F]/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A1F1F] animate-ping"></span>
              <span className="font-extrabold text-sm uppercase tracking-wide">
                Current Status: {order.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#7A1F1F]" />
              Fulfillment Journey
            </h3>
            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#7A1F1F] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-stone-900">{entry.status}</span>
                        <span className="text-xs text-stone-400">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{entry.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic">No timeline entries recorded yet.</p>
              )}
            </div>
          </div>

          {/* Customer & Delivery address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-4 rounded-2xl">
              <span className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Recipient
              </span>
              <p className="font-bold text-stone-900 text-sm">{order.customer?.name}</p>
              <p className="font-mono text-stone-600 mt-0.5">{order.customer?.phone}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl">
              <span className="font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Shipping Destination
              </span>
              <p className="font-semibold text-stone-900">{order.customer?.address}</p>
              <p className="text-stone-500 mt-0.5">{order.customer?.district}, Bangladesh</p>
            </div>
          </div>

          {/* Items */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
              Included Products ({order.items?.length})
            </h4>
            <div className="divide-y divide-stone-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain p-1 rounded bg-stone-50 border border-stone-100" />
                    <div>
                      <span className="font-bold text-stone-900 block">{item.name}</span>
                      <span className="text-stone-500">{item.weight} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-stone-900">৳{item.total || item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between font-black text-sm text-stone-900">
              <span>Grand Total (COD):</span>
              <span className="text-[#7A1F1F]">৳{order.grandTotal}</span>
            </div>
          </div>

        </div>
      )}

      {/* Hotline Support Note */}
      <div className="mt-10 text-center text-xs text-stone-500">
        <p>Need urgent help with an ongoing delivery?</p>
        <p className="font-semibold text-stone-800 mt-0.5">
          Call <span className="font-zaku tracking-wide">ZAKU</span> Customer Support at <a href="tel:+8801712345678" className="text-[#7A1F1F] underline">+880 1712-345678</a> (8 AM - 11 PM)
        </p>
      </div>

    </div>
  );
}

