import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function CollectionSection({
  products = [],
  activeCategory = 'all',
  onResetCategory,
  onQuickView
}) {
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter products by active category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) =>
        p.category === activeCategory ||
        p.secondaryCategory === activeCategory
      );

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDotClick = (index) => {
    setCurrentPage(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 360, behavior: 'smooth' });
    }
  };

  return (
    <section id="our-collection" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-white">
      
      {/* Header Row: Simple classic heading with subtle maroon underline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-stone-200 pb-4">
        
        {/* Simple Section Heading with subtle maroon underline */}
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Our Collection
          </h2>
          <div className="w-16 h-1 bg-[#7A1F1F] mt-2 rounded-full"></div>
        </div>

        {/* Category active indicator + View All Products on Right */}
        <div className="flex items-center gap-4">
          {activeCategory !== 'all' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#7A1F1F] bg-[#7A1F1F]/10 px-2.5 py-1 rounded-md capitalize">
                {activeCategory.replace('-', ' ')}
              </span>
              <button
                type="button"
                onClick={onResetCategory}
                className="text-stone-500 hover:text-stone-900 underline font-medium cursor-pointer"
              >
                Show All
              </button>
            </div>
          )}

          <Link
            to="/products"
            className="text-sm sm:text-base font-bold text-[#7A1F1F] hover:text-[#631717] transition-colors flex items-center gap-1.5 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Product Cards Row */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <p className="text-sm font-bold text-stone-700">No products found in this category.</p>
          <button
            type="button"
            onClick={onResetCategory}
            className="mt-3 px-4 py-2 bg-[#7A1F1F] text-white text-xs font-bold rounded-lg cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="relative px-1">
          {/* Carousel Arrow Controls (Desktop) */}
          {filteredProducts.length > 3 && (
            <>
              <button
                type="button"
                onClick={() => scroll('left')}
                className="hidden lg:flex absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-800 hover:text-[#7A1F1F] hover:bg-stone-50 cursor-pointer transition-all hover:scale-105"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="hidden lg:flex absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-800 hover:text-[#7A1F1F] hover:bg-stone-50 cursor-pointer transition-all hover:scale-105"
                aria-label="Next products"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Cards: Significantly larger, wider layout with generous spacing */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[85vw] sm:w-[320px] md:w-[340px] lg:w-[335px] xl:w-[350px] shrink-0 h-full"
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </div>
            ))}
          </div>

          {/* Carousel Navigation Dots */}
          {filteredProducts.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {filteredProducts.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentPage === idx ? 'bg-[#7A1F1F] w-7' : 'bg-stone-300 hover:bg-stone-400 w-2.5'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
}
