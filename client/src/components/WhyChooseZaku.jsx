import React from 'react';
import { Award, Utensils, ShieldCheck, ChefHat } from 'lucide-react';

export default function WhyChooseZaku() {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      subtitle: 'Carefully sourced spices'
    },
    {
      icon: Utensils,
      title: 'Authentic Taste',
      subtitle: 'Traditional, rich flavor'
    },
    {
      icon: ShieldCheck,
      title: 'No Added Preservatives',
      subtitle: 'Pure & natural'
    },
    {
      icon: ChefHat,
      title: 'Versatile Use',
      subtitle: 'Perfect for everyday cooking'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      {/* Clean Heading with subtle maroon underline */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          Why Choose <span className="font-zaku tracking-wide">ZAKU</span>?
        </h2>
        <div className="w-12 h-0.5 bg-[#7A1F1F] mx-auto mt-1.5"></div>
      </div>

      {/* 4 Feature Items */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-stone-100">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 ${idx > 0 ? 'pt-4 sm:pt-0 lg:pl-6' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl border border-[#7A1F1F]/20 bg-[#7A1F1F]/5 text-[#7A1F1F] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
