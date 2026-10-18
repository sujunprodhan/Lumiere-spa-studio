import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import Container from '../layouts/Container';
import { getPackageServices } from '@/actions/server/spa';

const packageInclusions = {
  'Couples Spa Retreat': [
    'Dual private hydro-suite soak with rose petals',
    'Simultaneous 60-min aromatic warm oil massage',
    'Pressure-point head & scalp revival',
    'Artisanal tea, organic berries & artisan truffles',
  ],
  'Bridal Spa Package': [
    'Full body botanical glow & crystal polish',
    '90-min tension-melting Swedish relaxation massage',
    'Signature 24K Luxury Gold brightening facial',
    'Deluxe manicure & spa pedicure with paraffin dip',
  ],
  'Full Body Wellness Package': [
    'Detoxifying warm herbal thermal wrap',
    'Targeted acupressure deep tissue massage',
    'Cellular hydration facial with lymphatic drain',
    'Private cedarwood steam & sound bowl session',
  ],
  'Relaxation Spa Package': [
    'Foot reflexology welcoming ritual',
    '60-min customized essential oil massage',
    'Purifying radiance facial treatment',
    'Chilled jade roller eye de-puff therapy',
  ],
};

const SpaPackages = async () => {
  const packages = await getPackageServices();

  const displayPackages =
    packages && packages.length > 0
      ? packages
      : [
          {
            _id: 'pkg-1',
            title: 'Couples Spa Retreat',
            price: 6500,
            duration: '90 minutes',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
            description: 'A romantic sanctuary escape designed for two with private rose petal suites.',
          },
          {
            _id: 'pkg-2',
            title: 'Bridal Spa Package',
            price: 7500,
            duration: '180 minutes',
            image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1',
            description: 'Comprehensive day of pampering from head to toe before your most special day.',
          },
        ];

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-[#580F41]/5 blur-3xl pointer-events-none" />

      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sanctuary Journeys</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
            Signature Spa{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
              Journeys & Packages
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Multi-hour immersive ceremonies blending thermal hydrotherapy, deep tissue massage, and
            luminescent skin therapies into one seamless sanctuary experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayPackages.map((pkg) => {
            const inclusions =
              packageInclusions[pkg.title] || [
                'Full body organic essential oil therapy',
                'Custom facial treatment matched to skin tone',
                'Private thermal suite relaxation access',
                'Herbal infusion & antioxidant elixir',
              ];

            return (
              <div
                key={pkg._id}
                className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={pkg.image || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874'}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold text-rose-200 uppercase tracking-wider border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-rose-300" />
                      {pkg.duration}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-rose-300">
                        Sanctuary Package
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-md">
                        {pkg.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-rose-200 uppercase tracking-wider block">From</span>
                      <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                        ${Number(pkg.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      {pkg.shortDescription || pkg.description}
                    </p>

                    <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-white mb-4">
                      Ceremony Inclusions:
                    </h4>
                    <ul className="space-y-3 mb-8">
                      {inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                          <div className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#580F41] dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200/60 dark:border-rose-900/40">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/booking?serviceId=${pkg._id}`}
                    className="w-full py-4 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Reserve Package Experience</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default SpaPackages;
