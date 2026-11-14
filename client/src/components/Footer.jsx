import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 mt-12 text-stone-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: Original ZAKU Logo & Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/zaku_original_logo.jpg"
                alt="ZAKU Logo"
                className="h-12 w-12 rounded-lg object-contain border border-stone-200 shadow-xs"
              />
              <span className="font-zaku text-3xl tracking-wide text-[#7A1F1F]">
                ZAKU
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              <span className="font-zaku tracking-wide text-stone-800">ZAKU</span> offers premium whole spices, authentic shahi spice blends, and seasonings for everyday home cooking.
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7A1F1F] shrink-0" />
                <span>+880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7A1F1F] shrink-0" />
                <span>orders@zakufood.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/products" className="hover:text-[#7A1F1F] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#7A1F1F] transition-colors flex items-center gap-1.5">
                  Offers
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1 rounded">HOT</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=whole-spices" className="hover:text-[#7A1F1F] transition-colors">
                  Whole Spices
                </Link>
              </li>
              <li>
                <Link to="/products?category=spice-mixes" className="hover:text-[#7A1F1F] transition-colors">
                  Spice Mixes
                </Link>
              </li>
              <li>
                <Link to="/products?category=seasonings" className="hover:text-[#7A1F1F] transition-colors">
                  Seasonings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/contact" className="hover:text-[#7A1F1F] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#7A1F1F] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#7A1F1F] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/delivery-info" className="hover:text-[#7A1F1F] transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-[#7A1F1F] transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Follow Us */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/about" className="hover:text-[#7A1F1F] transition-colors">
                    About <span className="font-zaku tracking-wide">ZAKU</span>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#7A1F1F] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#7A1F1F] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
                Follow Us
              </h5>
              <div className="flex items-center gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#7A1F1F] hover:text-white hover:border-[#7A1F1F] transition-colors font-bold text-xs"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#7A1F1F] hover:text-white hover:border-[#7A1F1F] transition-colors font-bold text-xs"
                  aria-label="Instagram"
                >
                  📸
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#7A1F1F] hover:text-white hover:border-[#7A1F1F] transition-colors font-bold text-xs"
                  aria-label="YouTube"
                >
                  ▶
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-[#7A1F1F] hover:text-white hover:border-[#7A1F1F] transition-colors font-bold text-xs"
                  aria-label="X"
                >
                  𝕏
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            Copyright © 2026 <strong className="font-zaku text-[#7A1F1F] font-normal tracking-wide">ZAKU</strong>. All Rights Reserved.
          </p>

          <Link
            to="/admin"
            className="text-stone-400 hover:text-[#7A1F1F] transition-colors flex items-center gap-1 font-medium"
          >
            <Lock className="w-3 h-3" />
            <span>Store Admin</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
