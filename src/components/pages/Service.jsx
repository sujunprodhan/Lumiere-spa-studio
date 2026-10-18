import { getService } from '@/actions/server/spa';
import React from 'react';
import ServiceList from './ServiceList';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const Service = async () => {
  const service = await getService();
  const displayServices = service && service.length > 0 ? service : [];

  return (
    <section id="services-section" className="py-24 bg-zinc-50 dark:bg-zinc-950 w-full">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Spa Menu</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            Curated{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
              Sanctuary Rituals
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Immerse yourself in our premier treatments. From therapeutic herbal hydrotherapy to
            illuminating facials, every session is designed to restore balance to your mind and body.
          </p>
        </div>

        <ServiceList services={displayServices} />

        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-semibold text-sm hover:border-[#580F41] dark:hover:border-rose-500 hover:text-[#580F41] dark:hover:text-rose-400 shadow-sm transition-all group"
          >
            <span>Explore All 20+ Spa Services & Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Service;
