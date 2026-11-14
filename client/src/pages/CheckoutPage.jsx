import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Truck, ShieldCheck, CheckCircle2, ArrowLeft, Phone, MapPin, User, FileText, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: 'Dhaka',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery charge rule: Dhaka ৳60, Outside Dhaka ৳120
  const deliveryFee = formData.district === 'Dhaka' ? 60 : 120;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add spices to your cart before checking out.');
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017xxxxxxxx).');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage('Please enter your detailed delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        district: formData.district,
        note: formData.note.trim(),
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          total: item.price * item.quantity
        })),
        subtotal,
        deliveryFee,
        grandTotal,
        paymentMethod: 'Cash on Delivery (COD)'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Order was successfully created in the backend database!
      const createdOrder = data.data;
      clearCart();
      navigate(`/order-success/${createdOrder.id}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error('Order submission failed:', err);
      setErrorMessage(err.message || 'An error occurred while saving your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">Your Cart is Empty</h2>
        <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
          You haven't selected any spices yet. Browse our collection to add delicious spices to your order.
        </p>
        <div className="mt-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A1F1F] text-white rounded-xl font-bold text-sm hover:bg-[#631717] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Spices Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Checkout & Express Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Complete your delivery details below. No account or password required. Fast Cash on Delivery across Bangladesh.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDE: Customer Delivery Form ================= */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7A1F1F]" />
                Customer & Delivery Information
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                We will dispatch your freshly packaged spice order to this address.
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-500" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rafiqul Islam"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] focus:bg-white"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">
                    +880
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="01712345678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] focus:bg-white"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Our delivery courier will call this number before arrival.
                </p>
              </div>

              {/* District / City */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-500" />
                  Delivery Zone / District <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.district === 'Dhaka'
                        ? 'border-[#7A1F1F] bg-[#7A1F1F]/5 text-[#7A1F1F] font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="district"
                        value="Dhaka"
                        checked={formData.district === 'Dhaka'}
                        onChange={handleChange}
                        className="text-[#7A1F1F] focus:ring-[#7A1F1F]"
                      />
                      <span className="text-sm">Inside Dhaka</span>
                    </div>
                    <span className="text-xs font-bold">৳60</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.district === 'Outside Dhaka'
                        ? 'border-[#7A1F1F] bg-[#7A1F1F]/5 text-[#7A1F1F] font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="district"
                        value="Outside Dhaka"
                        checked={formData.district === 'Outside Dhaka'}
                        onChange={handleChange}
                        className="text-[#7A1F1F] focus:ring-[#7A1F1F]"
                      />
                      <span className="text-sm">Outside Dhaka</span>
                    </div>
                    <span className="text-xs font-bold">৳120</span>
                  </label>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  Full Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="House number, road number, area, landmark (e.g. House 12, Road 4, Sector 7, Uttara, Dhaka)"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] focus:bg-white"
                />
              </div>

              {/* Optional Order Note */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  Order Note (Optional)
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="e.g. Please deliver between 2 PM - 5 PM or ring doorbell"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F] focus:bg-white"
                />
              </div>

            </div>

            {/* Payment Method Notice */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Payment Method
              </h3>
              <div className="bg-stone-50 border border-[#7A1F1F]/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-4 border-[#7A1F1F] bg-white"></div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Cash on Delivery (COD)</h4>
                    <p className="text-xs text-stone-500">Pay cash in BDT when your package arrives at your doorstep</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Safe & Secure
                </span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: Order Summary & Place Order ================= */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#7A1F1F]" />
                Order Summary ({cart.length} Spices)
              </h2>
            </div>

            {/* Item list */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-stone-50 rounded-xl border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-xs text-stone-500">
                        {item.weight} • ৳{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-stone-900 shrink-0">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge ({formData.district}):</span>
                <span className="font-bold text-stone-900">৳ {deliveryFee}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-base">
                <span className="font-black text-stone-900">Grand Total:</span>
                <span className="text-2xl font-black text-[#7A1F1F]">৳ {grandTotal}</span>
              </div>
              <p className="text-[11px] text-stone-400 text-right">VAT included where applicable</p>
            </div>

            {/* Submit Place Order Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#7A1F1F] hover:bg-[#631717] disabled:bg-stone-400 text-white rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Order to Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Place Order (৳{grandTotal} COD)</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-2 pt-2 text-xs text-stone-500 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Original <span className="font-zaku tracking-wide">ZAKU</span> quality certified spices</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Packed freshly from Narayanganj spice facility</span>
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
}

