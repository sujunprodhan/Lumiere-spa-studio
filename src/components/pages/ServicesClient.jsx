'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock,
  Star,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Eye,
  X,
  CheckCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryBenefits = {
  Facial: ['Deep pore cleansing', 'Collagen boosting', 'Antioxidant infusion'],
  Massage: ['Muscle tension relief', 'Lymphatic circulation', 'Stress reduction'],
  'Body Treatment': ['Cellular exfoliation', 'Toxin elimination', 'Skin barrier hydration'],
  'Spa Package': ['Full body rejuvenation', 'Multi-hour serenity', 'Complimentary tea service'],
  Wellness: ['Energy balancing', 'Scalp micro-circulation', 'Mindfulness clarity'],
  'Nail Care': ['Cuticle nourishment', 'Paraffin hydration', 'Precision styling'],
};

export default function ServicesClient({ services = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const categoriesWithCounts = useMemo(() => {
    const counts = { All: services.length };
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  const categoryList = ['All', 'Massage', 'Facial', 'Body Treatment', 'Spa Package', 'Wellness', 'Nail Care'];

  const filteredServices = useMemo(() => {
    return services
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'duration') {
          const numA = parseInt(a.duration) || 0;
          const numB = parseInt(b.duration) || 0;
          return numB - numA;
        }
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 mb-12 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments by name, benefits, or keywords..."
              className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#580F41] dark:focus:border-rose-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 shrink-0">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#580F41] dark:focus:border-rose-500 transition-colors"
            >
              <option value="featured">Featured & Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Longest Duration</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-5 pb-1 no-scrollbar">
          {categoryList.map((cat) => {
            const count = categoriesWithCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#580F41] text-white shadow-md shadow-[#580F41]/20'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-bold text-zinc-900 dark:text-white">{filteredServices.length}</span>{' '}
          curated treatments
          {selectedCategory !== 'All' && <span> in <strong className="text-[#580F41] dark:text-rose-400">{selectedCategory}</strong></span>}
        </p>

        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#580F41] dark:text-rose-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((item) => {
            const benefits = categoryBenefits[item.category] || [
              'Custom botanical formulation',
              'Deep stress relief',
              'Skin nourishment',
            ];

            return (
              <div
                key={item._id}
                className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  {item.isPopular && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-rose-500 to-[#580F41] backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Popular
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-rose-200 uppercase tracking-wider border border-white/10">
                    {item.category}
                  </div>

                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.rating || '4.8'}</span>
                      </div>
                      <span className="text-2xl font-serif font-bold text-white drop-shadow-md">
                        ${Number(item.price).toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-300" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white line-clamp-1 mb-2 group-hover:text-[#580F41] dark:group-hover:text-rose-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {item.shortDescription || item.description}
                    </p>

                    <div className="space-y-1.5 mb-6">
                      {benefits.slice(0, 2).map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                      title="Quick View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    <Link
                      href={`/booking?serviceId=${item._id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-semibold hover:opacity-95 shadow-md flex items-center justify-center gap-1.5 group/btn"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Treatment</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <p className="text-lg font-serif font-bold text-zinc-900 dark:text-white mb-2">
            No spa treatments found
          </p>
          <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
            We couldn't find any treatments matching &ldquo;{searchQuery}&rdquo;. Try another term or reset filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#580F41] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative h-64 w-full shrink-0">
                <Image
                  src={activeModalItem.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                  alt={activeModalItem.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider block mb-1">
                    {activeModalItem.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    {activeModalItem.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-[#580F41] dark:text-rose-400">
                      ${Number(activeModalItem.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                      Duration: {activeModalItem.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{activeModalItem.rating || 4.8} / 5.0</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
                    Treatment Description
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {activeModalItem.description || activeModalItem.shortDescription}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
                    Ceremony Inclusions & Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Organic wild botanical aromatherapy',
                      'Pre-treatment warm foot bath & herbal tea',
                      'Private relaxation suite access',
                      'Custom pressure & focus area consultation',
                    ].map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setActiveModalItem(null)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Close
                  </button>
                  <Link
                    href={`/booking?serviceId=${activeModalItem._id}`}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-semibold hover:opacity-95 shadow-md flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Proceed to Book This Treatment</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
