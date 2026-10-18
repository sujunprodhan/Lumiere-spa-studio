import React from 'react';
import { Sparkles, Leaf, Award, Waves, HeartHandshake, ShieldCheck } from 'lucide-react';
import Container from '../layouts/Container';

const features = [
  {
    icon: Leaf,
    title: '100% Pure Organic Botanicals',
    description:
      'We exclusively formulate with cold-pressed herbal essences, wild-crafted botanical oils, and organic extracts free from synthetic additives.',
  },
  {
    icon: Award,
    title: 'Master Certified Practitioners',
    description:
      'Our therapists average 10+ years of clinical and holistic expertise, certified in traditional Eastern acupressure and modern myofascial release.',
  },
  {
    icon: Waves,
    title: 'Private Hydro & Steam Suites',
    description:
      'Every premier ritual includes private access to our cedarwood eucalyptus saunas, mineral hydrotherapy tubs, and Himalayan salt alcoves.',
  },
  {
    icon: HeartHandshake,
    title: 'Bespoke Sensory Diagnostics',
    description:
      'Personalized consultation prior to every session to tailor pressure intensity, essential oil notes, heated stone temperatures, and soundscapes.',
  },
];

const stats = [
  { value: '20+', label: 'Bespoke Spa Rituals' },
  { value: '99.8%', label: 'Guest Delight Rating' },
  { value: '15,000+', label: 'Sessions Completed' },
  { value: '100%', label: 'Organic Pure Extracts' },
];

const SpaFeatures = () => {
  return (
    <section className="py-24 bg-white dark:bg-black w-full border-y border-zinc-200/80 dark:border-zinc-800/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Lumiere Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
            Crafted for Deep Rest &{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
              Holistic Renewal
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every touch, scent, and tone at Lumiere is deliberately curated to guide your nervous
            system from everyday tension into effortless state of restorative tranquility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70 hover:border-[#580F41]/30 dark:hover:border-rose-500/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#580F41] to-[#7a155a] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md shadow-[#580F41]/20">
                    <Icon className="w-7 h-7 text-rose-100" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center gap-1.5 text-xs font-semibold text-[#580F41] dark:text-rose-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sanctuary Standard Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-[#580F41] via-[#751457] to-[#580F41] text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-rose-300/20">
            {stats.map((stat, i) => (
              <div key={i} className="pt-4 lg:pt-0 lg:px-4">
                <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight block text-rose-100">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-rose-200/80 font-medium mt-1 uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SpaFeatures;
