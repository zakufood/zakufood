import React from 'react';
import { HelpCircle, Truck, RefreshCcw, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FAQPage() {
  const faqs = [
    {
      q: 'How are ZAKU spices processed and packaged?',
      a: 'All ZAKU spices are hand-sorted, sun-dried, stone-graded, and hygienically packed into airtight, tamper-evident food-grade jars at our Kashipur, Narayanganj facility. We never add synthetic dyes, sawdust, or anti-caking chemicals.'
    },
    {
      q: 'What is the delivery time and cost?',
      a: 'Inside Dhaka: Regular delivery takes 24 to 48 hours for ৳60. Orders over ৳999 qualify for free delivery.\nOutside Dhaka: Delivery takes 2 to 4 days across all 64 districts of Bangladesh for ৳120 via trusted express courier.'
    },
    {
      q: 'Do I need an account to place an order?',
      a: 'No! You can order directly without any sign in, sign up, or password. Just provide your name, delivery address, and phone number on our Checkout page.'
    },
    {
      q: 'How does Cash on Delivery (COD) work?',
      a: 'You pay in cash directly to the courier delivery agent once the package is delivered to your doorstep. You can inspect the outer packaging before payment.'
    },
    {
      q: 'What should I do if a jar arrives broken or damaged?',
      a: 'We pack all glass jars with protective bubble wrapping and shock-resistant cartons. In the rare event of transit damage, notify us via hotline or WhatsApp (+880 1712-345678) within 24 hours with a photo and we will send an immediate free replacement.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-stone-500">Everything you need to know about <span className="font-zaku tracking-wide text-stone-700">ZAKU</span> products and delivery</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs space-y-2">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#7A1F1F] shrink-0" />
              {f.q}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-6 whitespace-pre-line">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeliveryInfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Delivery Information</h1>
        <p className="text-sm text-stone-500">Reliable home delivery across all 64 districts of Bangladesh</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6 text-sm text-stone-700 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-[#7A1F1F]" /> Inside Dhaka
            </h3>
            <p className="text-xs text-stone-600">Standard Delivery: 24–48 hours</p>
            <p className="text-xs font-black text-[#7A1F1F] mt-1">Delivery Charge: ৳60</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">Free Delivery on orders above ৳999</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-[#7A1F1F]" /> Outside Dhaka
            </h3>
            <p className="text-xs text-stone-600">Nationwide Courier: 2–4 business days</p>
            <p className="text-xs font-black text-[#7A1F1F] mt-1">Delivery Charge: ৳120</p>
            <p className="text-[11px] text-stone-500 mt-1">Covers all district towns and upazilas</p>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-stone-900 text-base mb-2">Safe Packaging Promise</h4>
          <p>
            Every jar of <span className="font-zaku tracking-wide text-stone-800">ZAKU</span> spice is hermetically sealed to preserve freshness. We use customized honeycomb paper padding, bubble protection, and reinforced outer shipping boxes to guarantee that your spice jars arrive safely.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Returns & Refund Policy</h1>
        <p className="text-sm text-stone-500">Your total satisfaction is our paramount commitment</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6 text-sm text-stone-700 leading-relaxed">
        <div>
          <h3 className="font-bold text-stone-900 text-base mb-2 flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-[#7A1F1F]" /> 7-Day Hassle-Free Replacement
          </h3>
          <p>
            If you receive a defective item, a broken jar, or an incorrect spice product, we will replace it free of charge within 7 days.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-stone-900 text-base mb-2">Conditions for Returns</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>The item must be reported within 24 hours of delivery for transit damages.</li>
            <li>The inner freshness seal should remain intact unless the issue relates to spice quality.</li>
            <li>Take a clear photo of the shipping label and jar condition, then send to our WhatsApp (+880 1712-345678).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-stone-500">How <span className="font-zaku tracking-wide text-stone-700">ZAKU</span> protects customer privacy and delivery data</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-sm text-stone-700 leading-relaxed">
        <p>
          At <span className="font-zaku tracking-wide text-stone-800">ZAKU</span>, we respect your privacy. Because our store does not require customer registrations or accounts, we only collect the minimum information necessary to deliver your package: your name, phone number, and physical delivery address.
        </p>
        <p>
          We do not sell, rent, or share customer contact details with third-party advertising companies. Your phone number is strictly used by our fulfillment team and courier partner to confirm delivery.
        </p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">Terms & Conditions</h1>
        <p className="text-sm text-stone-500">Store terms and order policies</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-sm text-stone-700 leading-relaxed">
        <p>
          By placing an order on <span className="font-zaku tracking-wide text-stone-800">ZAKU</span>, you agree that you are providing truthful contact and delivery information for Cash on Delivery fulfillment. All prices are listed in Bangladeshi Taka (BDT).
        </p>
        <p>
          <span className="font-zaku tracking-wide text-stone-800">ZAKU</span> reserves the right to contact the customer via phone call before dispatching high-value orders to prevent bogus orders. All trademarked logos and product imagery are proprietary to <span className="font-zaku tracking-wide text-stone-800">ZAKU</span> Food.
        </p>
      </div>
    </div>
  );
}

