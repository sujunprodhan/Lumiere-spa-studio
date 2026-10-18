'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Star, ShieldCheck, Heart, Leaf } from 'lucide-react';
import Link from 'next/link';

const AuthShowcase = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  const imageSrc = isLogin
    ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full lg:w-1/2 p-10 xl:p-12 overflow-hidden bg-zinc-950 text-white min-h-165">
      <Image
        src={imageSrc}
        alt="Lumiere Spa Sanctuary"
        fill
        sizes="(max-width: 1200px) 50vw, 40vw"
        priority
        className="object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-[#580F41]/70 to-[#580F41]/40 backdrop-blur-[2px]" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#580F41]/40 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-3xl font-serif font-bold tracking-tight text-white group-hover:opacity-90 transition-opacity">
            Lumiere<span className="text-rose-400 animate-pulse">.</span>
          </span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Sanctuary of Serenity</span>
        </div>
      </div>
      <div className="relative z-10 my-auto py-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4">
          {isLogin ? 'Member Sanctuary' : 'Exclusive Welcome Experience'}
        </div>
        
        <h2 className="text-3xl xl:text-4xl font-serif font-normal leading-snug tracking-tight text-white mb-4">
          {isLogin ? (
            <>
              Immerse yourself into a world of <span className="italic font-light text-rose-200">pure tranquility</span> and holistic rejuvenation.
            </>
          ) : (
            <>
              Begin your bespoke journey to <span className="italic font-light text-rose-200">mindful renewal</span> and physical wellness.
            </>
          )}
        </h2>

        <p className="text-zinc-300 text-sm leading-relaxed max-w-md mb-8">
          {isLogin
            ? 'Access your saved rituals, curated appointments, and tier privileges crafted uniquely for your well-being.'
            : 'Join over 1,200+ discerning guests enjoying bespoke organic therapies, priority calendar bookings, and signature wellness gifts.'}
        </p>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center gap-3 text-sm text-zinc-200 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-rose-300" />
            </div>
            <span>100% Organic, sustainably sourced botanicals</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-200 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
            </div>
            <span>Rated 4.9/5 by over 1,200+ satisfied guests</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-200 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <span>Priority booking & seamless re-scheduling privileges</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            <Image
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Member"
              width={32}
              height={32}
            />
            <Image
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Member"
              width={32}
              height={32}
            />
            <Image
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="Member"
              width={32}
              height={32}
            />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Join 1,200+ Members</p>
            <p className="text-zinc-400">Trusted luxury wellness</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-rose-300 font-medium">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
          <span>Curated with love</span>
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;
