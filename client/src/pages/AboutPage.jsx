import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans space-y-12">
      
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#7A1F1F] bg-[#7A1F1F]/10 px-3 py-1 rounded-full">
          The <span className="font-zaku tracking-wide">ZAKU</span> Story
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          Zest In Every Bite
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          From the aromatic spice corridors of Narayanganj to kitchens across Bangladesh, <span className="font-zaku tracking-wide text-stone-900 font-semibold">ZAKU</span> was born out of a deep reverence for authentic flavors, pristine culinary heritage, and pure ingredients.
        </p>
      </div>

      {/* Brand Photo & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        <div className="lg:col-span-5 flex justify-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 max-w-sm">
            <img
              src="/assets/zaku_logo_square.jpg"
              alt="ZAKU Official Logo and Heritage"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Pure Spices Without Compromise
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            In modern markets, finding genuine spices free of artificial sawdust, toxic food colorants, and heavy industrial adulterants has become a challenge. At <span className="font-zaku tracking-wide text-stone-900 font-semibold">ZAKU</span>, we made a simple yet unwavering commitment: <strong>what goes into our jars is 100% natural and true to nature.</strong>
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Every batch of our Whole Spices, Shahi Mixes, and Gourmet Seasonings is rigorously inspected, sun-dried, stone-graded, and hygienically bottled to preserve every drop of volatile essential oils.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {[
              'Zero Synthetic Colors or Dyes',
              'Zero Chemical Preservatives',
              'Sun-Dried Heirloom Rhizomes',
              'Airtight Tamper-Proof Packaging',
              'Halal Certified & Lab Tested',
              'Direct Sourcing from Dedicated Farmers'
            ].map((pt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-[#7A1F1F] shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 4 Core Values */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            Our Guiding Pillars
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Why thousands of passionate home chefs and culinary enthusiasts trust <span className="font-zaku tracking-wide text-stone-700 font-semibold">ZAKU</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7A1F1F]/10 text-[#7A1F1F] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Premium Quality</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Carefully sourced unbroken cinnamon, fragrant green cardamoms, and heirloom spices tested for maximum aroma.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7A1F1F]/10 text-[#7A1F1F] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Authentic Taste</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Traditional slow-roasting techniques inspired by old-Dhaka Mughlai and heritage Bengali royal kitchens.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7A1F1F]/10 text-[#7A1F1F] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">No Preservatives</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              100% pure, natural botanicals without MSG, fillers, or artificial anti-caking additives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#7A1F1F]/10 text-[#7A1F1F] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Versatile Everyday Use</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Equally magnificent for slow-cooked weekend Biryani as it is for quick Tuesday evening fried snacks and curries.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#7A1F1F] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">
          Bring the True Scent of Heritage to Your Table
        </h2>
        <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
          Taste the difference unbroken quality spices can make in your curries, grills, and family feasts.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#7A1F1F] font-black rounded-full hover:bg-stone-100 transition-colors shadow-md text-sm"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>

    </div>
  );
}

