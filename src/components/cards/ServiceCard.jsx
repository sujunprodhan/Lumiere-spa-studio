import React from 'react';
import { MapPin, BedDouble, Bath, Square, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const ServiceCard = ({ service }) => {
  const {
    title,
    category,
    location,
    price,
    type,
    beds,
    baths,
    area,
    image,
    description,
    amenities,
    featured
  } = service;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative h-64 w-full overflow-hidden">
        {featured && (
          <div className="absolute top-4 left-4 z-10 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-medium text-white uppercase tracking-wider">
            Featured
          </div>
        )}
        <div className="absolute top-4 right-4 z-10 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {type}
        </div>
        
        <Image 
          src={image} 
          alt={title || "Service image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-zinc-300 font-medium">{category}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight mt-1">
              ${price.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-bold text-zinc-900 dark:text-white line-clamp-1 mb-2">
          {title}
        </h4>
        
        <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-zinc-400" />
          <span className="truncate">{location}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800 mb-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <BedDouble className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{beds}</span>
            <span className="text-xs text-zinc-500">Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 border-x border-zinc-100 dark:border-zinc-800">
            <Bath className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{baths}</span>
            <span className="text-xs text-zinc-500">Baths</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Square className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{area}</span>
            <span className="text-xs text-zinc-500">Sq Ft</span>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6">
          {description}
        </p>

        <button className="group/btn relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 dark:bg-white px-4 py-3 text-sm font-semibold text-white dark:text-black transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100">
          <span className="relative z-10 flex items-center gap-2">
            View Details
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
