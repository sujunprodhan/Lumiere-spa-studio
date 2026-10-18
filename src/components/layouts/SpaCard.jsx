import React from 'react';
import { Clock, Star, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const SpaCard = ({ item }) => {
  const {
    _id,
    title,
    category,
    price,
    duration,
    image,
    shortDescription,
    description,
    rating,
    isPopular
  } = item;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden shrink-0">
        {isPopular && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-[#580F41] backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Popular
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#580F41] dark:text-rose-300 uppercase tracking-wider shadow-xs border border-zinc-200/50 dark:border-zinc-700/50">
          {category}
        </div>
        <Image
          src={image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
          alt={title || 'Spa Treatment'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-white font-medium text-xs">{rating || '4.8'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-none drop-shadow-md">
              ${Number(price).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-xl font-serif font-bold text-zinc-900 dark:text-white line-clamp-1 mb-2.5 group-hover:text-[#580F41] dark:group-hover:text-rose-300 transition-colors">
            {title}
          </h4>

          <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs mb-3 bg-zinc-100 dark:bg-zinc-800/70 w-fit px-3 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-[#580F41] dark:text-rose-400" />
            <span className="font-semibold text-[#580F41] dark:text-rose-300">{duration}</span>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-6">
            {shortDescription || description}
          </p>
        </div>

        <Link
          href={`/booking?serviceId=${_id || ''}`}
          className="group/btn relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-xl hover:opacity-95 transition-all mt-auto"
        >
          <span className="relative z-10 flex items-center gap-2">
            Book Ritual
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SpaCard;
