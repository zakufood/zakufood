import React from 'react';
import { Layers, Leaf, Soup, Sparkles, ChevronRight, Check } from 'lucide-react';

export default function HeroSection({ activeCategory = 'all', onSelectCategory }) {
  const categories = [
    { id: 'all', name: 'All Products', icon: Layers },
    { id: 'whole-spices', name: 'Whole Spices', icon: Leaf },
    { id: 'spice-mixes', name: 'Spice Mixes', icon: Soup },
    { id: 'seasonings', name: 'Seasonings', icon: Sparkles }
  ];

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const section = document.getElementById('our-collection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-3 sm:pb-4 bg-white">
      
      {/* ===== MOBILE: Category Pills Row (horizontal scrollable) ===== */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pb-2.5 pt-0.5 px-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold shrink-0 transition-all border touch-manipulation ${
                isSelected
                  ? 'bg-[#7A1F1F] text-white border-[#7A1F1F] shadow-sm'
                  : 'bg-[#F7F1E5] text-stone-700 border-[#E9DFCE] hover:bg-[#EFE5D5]'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{cat.name}</span>
              {isSelected && <Check className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* ===== MAIN HERO LAYOUT ===== */}
      {/* Mobile/Tablet: stacked banners. Desktop: 3-column side-by-side */}
      <div className="flex flex-col md:flex-row lg:flex-row gap-3 sm:gap-4 lg:gap-5 items-stretch">

        {/* === 1. DESKTOP ONLY: Category Sidebar === */}
        <div className="hidden lg:flex w-60 xl:w-64 shrink-0 flex-col">
          <div className="bg-[#F7F1E5] rounded-2xl border border-[#E9DFCE] overflow-hidden flex flex-col h-full justify-between shadow-xs p-3">
            <div className="space-y-1.5 flex-1 flex flex-col justify-around">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#EBDDC8] text-[#7A1F1F] font-bold border-l-4 border-[#7A1F1F] shadow-xs'
                        : 'text-stone-800 hover:bg-[#EFE5D5] font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#7A1F1F] text-white shadow-xs'
                          : 'bg-white/80 border border-[#E2D6C3] text-stone-700 group-hover:bg-[#7A1F1F] group-hover:text-white group-hover:border-[#7A1F1F]'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold flex items-center gap-1">
                        {cat.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7A1F1F]" />}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-[#7A1F1F] translate-x-0.5' : 'text-stone-400 group-hover:text-[#7A1F1F] group-hover:translate-x-0.5'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* === 2. CENTER: Original ZAKU Hero Banner === */}
        <div className="flex-1 min-w-0 flex items-center justify-center">
          <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-[#EEE8CE] flex items-center justify-center min-h-[180px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-0">
            <img
              src="/assets/hero_banner_original.png"
              alt="ZAKU Spices Banner"
              className="w-full h-full object-contain block"
            />
          </div>
        </div>

        {/* === 3. RIGHT: Promotional Banner — below center on mobile, side on tablet+ === */}
        <div className="w-full md:w-[220px] lg:w-[270px] xl:w-[290px] shrink-0 flex items-center justify-center">
          <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200 shadow-xs bg-[#21140E] flex items-center justify-center min-h-[160px] sm:min-h-[200px] md:min-h-0">
            <img
              src="/assets/banner_chicken_fry.jpg"
              alt="ZAKU Peri Peri Masala - Chicken Fry and French Fries"
              className="w-full h-full object-contain block"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
