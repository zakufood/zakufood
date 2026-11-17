import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      setMobileSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 shadow-xs font-sans">
      {/* ================= 1. TOP HEADER (Light Warm Cream #FFFDF8) ================= */}
      <div className="bg-[#FFFDF8] border-b border-[#F0EBE1]">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-14 md:h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Premium Horizontal Z Symbol + ZAKU Wordmark in Gangster of Three Font */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 group py-1" aria-label="ZAKU Homepage">
            <img
              src="/assets/zaku_symbol_maroon.png"
              alt="ZAKU Symbol"
              className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain block transition-transform group-hover:scale-[1.02]"
            />
            <span className="font-zaku text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-normal text-[#7A1F1F] tracking-wide select-none leading-none pt-1 transition-transform group-hover:scale-[1.02]">
              ZAKU
            </span>
          </Link>

          {/* Center: Wide search bar with subtle cream background & rounded corners */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4.5 h-4.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  className="w-full pl-11 pr-10 py-2.5 bg-[#FAF7F0] border border-[#EBE3D5] text-stone-800 placeholder-stone-400 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F]/20 focus:border-[#7A1F1F] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Floating Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50">
                <div className="p-2.5 border-b border-stone-100 bg-stone-50 flex justify-between items-center text-xs text-stone-500 font-semibold px-4">
                  <span>{isSearching ? 'Searching...' : `Results for "${searchQuery}"`}</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-[#7A1F1F]">
                            {product.name}
                          </h4>
                          <p className="text-xs text-stone-500">{product.weight}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-[#7A1F1F]">৳{product.price}</span>
                        </div>
                      </Link>
                    ))}
                    <div className="p-2.5 bg-stone-50 text-center">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-[#7A1F1F] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        View all search results <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-stone-500 text-sm">
                    No spices found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Cart icon and Cart text only (NO Sign In / Sign Up buttons) */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg touch-manipulation"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon and Cart Text Only */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-stone-800 hover:text-[#7A1F1F] px-2 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer group touch-manipulation"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#7A1F1F]" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#7A1F1F] text-white font-extrabold text-[10px] rounded-full h-4.5 min-w-4.5 px-1 flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm text-stone-800 group-hover:text-[#7A1F1F] hidden xs:inline sm:inline">
                Cart
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-800 hover:text-[#7A1F1F] rounded-lg touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 pb-3 pt-2 border-t border-[#F0EBE1] bg-[#FFFDF8]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for spices, mixes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F0] border border-[#EBE3D5] text-stone-800 placeholder-stone-400 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7A1F1F]/30 focus:border-[#7A1F1F] transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-bold"
                >×</button>
              )}
            </form>
            {/* Mobile search dropdown results */}
            {showDropdown && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => { setShowDropdown(false); setMobileSearchOpen(false); }}
                    className="flex items-center gap-3 p-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg border border-stone-100 p-1 shrink-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">{product.name}</h4>
                      <p className="text-xs text-stone-500">{product.weight}</p>
                    </div>
                    <span className="text-sm font-black text-[#7A1F1F] shrink-0">৳{product.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= 2. SECOND NAVIGATION HEADER (Full-Width Deep Maroon #7A1F1F) ================= */}
      <nav className="w-full bg-[#7A1F1F] zaku-nav-bar select-none">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 gap-5">
            
            {/* LEFT: Menu Icon + SHOP BY CATEGORY (Width matches Compact Category Sidebar below) */}
            <div className="w-auto sm:w-48 md:w-64 lg:w-68 xl:w-72 shrink-0 flex items-center gap-2 sm:gap-2.5 text-white select-none">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
              <span className="font-bold text-[11px] sm:text-xs md:text-sm tracking-wider uppercase text-white whitespace-nowrap hidden sm:inline">
                Shop By Category
              </span>
            </div>

            {/* RIGHT SECTION: Center Links + Right Track Order */}
            <div className="flex-1 min-w-0 flex items-center justify-between">
              
              {/* CENTER: Products, Offers, About ZAKU, Contact horizontally centered in available space */}
              <div className="hidden md:flex flex-1 items-center justify-center gap-5 sm:gap-6 lg:gap-8 text-sm font-semibold tracking-wide">
                <Link
                  to="/products"
                  className="zaku-nav-link text-white !text-white bg-transparent hover:opacity-85 transition-opacity"
                >
                  Products
                </Link>

                <Link
                  to="/offers"
                  className="zaku-nav-link inline-flex items-center gap-1.5 text-white !text-white bg-transparent hover:opacity-85 transition-opacity"
                >
                  <span>Offers</span>
                  <span className="bg-[#E53935] text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full shadow-xs leading-none">
                    Hot
                  </span>
                </Link>

                <Link
                  to="/about"
                  className="zaku-nav-link text-white !text-white bg-transparent hover:opacity-85 transition-opacity"
                >
                  About <span className="font-zaku tracking-wide">ZAKU</span>
                </Link>

                <Link
                  to="/contact"
                  className="zaku-nav-link text-white !text-white bg-transparent hover:opacity-85 transition-opacity"
                >
                  Contact
                </Link>
              </div>

              {/* RIGHT: Track Order aligned to the right side */}
              <div className="flex items-center ml-auto">
                <Link
                  to="/track-order"
                  className="zaku-nav-link text-xs sm:text-sm font-semibold tracking-wide text-white !text-white bg-transparent hover:opacity-85 transition-opacity"
                >
                  Track Order
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#7A1F1F] zaku-nav-bar px-3 py-2 space-y-0.5 border-t border-white/10 mobile-menu-enter">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="zaku-nav-link flex items-center px-3 py-3 text-sm font-semibold text-[#FFFFFF] !text-white bg-transparent hover:bg-white/10 rounded-lg transition-colors"
            >
              Products
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="zaku-nav-link flex items-center justify-between px-3 py-3 text-sm font-semibold text-[#FFFFFF] !text-white bg-transparent hover:bg-white/10 rounded-lg transition-colors"
            >
              <span>Offers</span>
              <span className="bg-[#E53935] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">Hot</span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="zaku-nav-link flex items-center px-3 py-3 text-sm font-semibold text-[#FFFFFF] !text-white bg-transparent hover:bg-white/10 rounded-lg transition-colors"
            >
              About <span className="font-zaku tracking-wide ml-1">ZAKU</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="zaku-nav-link flex items-center px-3 py-3 text-sm font-semibold text-[#FFFFFF] !text-white bg-transparent hover:bg-white/10 rounded-lg transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="zaku-nav-link flex items-center px-3 py-3 text-sm font-semibold text-[#FFFFFF] !text-white bg-transparent hover:bg-white/10 rounded-lg transition-colors border-t border-white/10 mt-1"
            >
              Track Order
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
