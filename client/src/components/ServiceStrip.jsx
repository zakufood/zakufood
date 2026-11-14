import React from 'react';
import { Package, ThumbsUp, HeartHandshake, Sparkles, Headset } from 'lucide-react';

export default function ServiceStrip() {
  const services = [
    {
      icon: Package,
      title: 'Same day Product Delivery',
      desc: 'Swift shipping across Bangladesh'
    },
    {
      icon: ThumbsUp,
      title: '100% Customer Satisfaction',
      desc: 'Pure spice aroma'
    },
    {
      icon: HeartHandshake,
      title: 'Help and access is our mission',
      desc: 'Dedicated to great home cooking'
    },
    {
      icon: Sparkles,
      title: '100% fresh, quality spices',
      desc: 'Hygienically packaged jars'
    },
    {
      icon: Headset,
      title: '24/7 Support for Clients',
      desc: 'Direct hotline & WhatsApp'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white">
      <div className="bg-[#7A1F1F] text-white rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 items-center">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Icon className="w-5 h-5 text-amber-300 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/70 mt-0.5 line-clamp-1">
                    {item.desc}
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
