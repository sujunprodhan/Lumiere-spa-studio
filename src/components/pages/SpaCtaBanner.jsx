import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import Container from '../layouts/Container';

const SpaCtaBanner = () => {
  return (
    <section className="py-20 bg-white dark:bg-black w-full">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#580F41] via-[#751457] to-[#3a082b] text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-rose-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sanctuary Invitation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Begin Your Journey to <br className="hidden sm:block" />
              Unparalleled Serenity.
            </h2>

            <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed mb-8 max-w-2xl">
              Escape the noise of modern life. Reserve your personalized spa ritual today and receive
              a complimentary signature botanical essential oil gift with your first visit.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link
                href="/booking"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#580F41] font-bold text-base hover:bg-rose-50 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Your Ritual Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View Full Menu & Pricing</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/15 text-xs sm:text-sm text-rose-100/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Free 24h Rescheduling & Cancellation</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Complimentary Herbal Infusions</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-300 shrink-0" />
                <span>Private Hydro-Suite Access Included</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SpaCtaBanner;
