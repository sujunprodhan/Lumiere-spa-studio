import React from 'react';
import Image from 'next/image';
import { Star, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import Container from '../layouts/Container';

const reviews = [
  {
    name: 'Camilla Montgomery',
    title: 'Verified Sanctuary Guest',
    ritual: 'Luxury Gold Facial & Head Massage',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    quote:
      'The Luxury Gold Facial completely revitalized my dull complexion before my speaking gala. The soothing cedarwood steam and the practitioner’s gentle technique was pure heaven.',
  },
  {
    name: 'Julian & Claire Sterling',
    title: 'Couples Sanctuary Members',
    ritual: 'Couples Spa Retreat (90 mins)',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    quote:
      'Our private hydro-suite was filled with fresh rose petals and the subtle scent of wild bergamot. Easily the most restorative anniversary experience we have ever booked.',
  },
  {
    name: 'Sophia Aris',
    title: 'Sanctuary Gold Member',
    ritual: 'Hot Stone Therapy & Detox Body Wrap',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    quote:
      'As an endurance runner with persistent lower back tightness, Marcus Thorne worked miracles. The heated volcanic stones unraveled knots I have had for months.',
  },
];

const press = [
  { name: 'Vogue Wellness', label: '“Top 5 Urban Sanctuaries of 2026”' },
  { name: 'Elle Beauty & Spa', label: '“The pinnacle of botanical alchemy”' },
  { name: 'Architectural Digest', label: '“Sublime interior serenity & acoustic bliss”' },
  { name: 'Forbes Sanctuary', label: '“5-Star Gold Standard in Holistic Care”' },
];

const SpaTestimonials = () => {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 w-full">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Echoes of Serenity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
            Cherished by{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
              Devoted Guests
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Discover why wellness seekers, discerning couples, and everyday professionals choose
            Lumiere Spa Studio as their personal sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#580F41]/20 dark:text-rose-500/20" />
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed mb-6">
                  “{rev.quote}”
                </p>

                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[11px] font-semibold text-[#580F41] dark:text-rose-300 mb-6">
                  Ritual: {rev.ritual}
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-rose-200 dark:border-rose-900">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{rev.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {press.map((p, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-serif font-bold text-zinc-900 dark:text-white tracking-wide">
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SpaTestimonials;
