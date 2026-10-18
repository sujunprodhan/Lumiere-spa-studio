import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Sparkles, Calendar, Award } from 'lucide-react';
import Container from '../layouts/Container';

const specialists = [
  {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Holistic Physician & Ayurvedic Master',
    experience: '14+ Years Experience',
    rating: 4.98,
    specialty: 'Aromatherapy & Herbal Rejuvenation',
    image: 'https://images.unsplash.com/photo-1594824813579-9943fcf81a6e?q=80&w=800&auto=format&fit=crop',
    bio: 'Dedicated to harmonizing ancient Ayurvedic principles with modern cellular revitalization.',
  },
  {
    name: 'Elena Moreau',
    role: 'Master Aesthetician & Skin Sculptor',
    experience: '11+ Years Experience',
    rating: 4.96,
    specialty: '24K Gold & Lymphatic Facials',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    bio: 'Trained in Paris and Tokyo, Elena specializes in non-invasive face lifting and instant glow rituals.',
  },
  {
    name: 'Marcus Thorne',
    role: 'Senior Myofascial & Deep Tissue Master',
    experience: '13+ Years Experience',
    rating: 4.99,
    specialty: 'Hot Stone & Tension Dissolution',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
    bio: 'Renowned for unraveling chronic physical tension using heated volcanic basalt stones.',
  },
  {
    name: 'Maya Chen',
    role: 'Holistic Healer & Sound Bath Guide',
    experience: '9+ Years Experience',
    rating: 4.95,
    specialty: 'Tibetan Bowls & Reflexology',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    bio: 'Integrates therapeutic botanical mists with vibrational frequency for cellular stillness.',
  },
];

const SpaSpecialists = () => {
  return (
    <section className="py-24 bg-white dark:bg-black w-full border-t border-zinc-200/80 dark:border-zinc-800/80">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Master Practitioners</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
            Guided by Masters of{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
              Holistic Care
            </span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Our accredited wellness masters bring decades of intuitive touch, dermatological expertise,
            and profound dedication to your physical and mental restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialists.map((specialist, idx) => (
            <div
              key={idx}
              className="group bg-zinc-50 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={specialist.image}
                    alt={specialist.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium">
                      {specialist.experience}
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      <span>{specialist.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-[#580F41] dark:group-hover:text-rose-400 transition-colors">
                    {specialist.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#580F41] dark:text-rose-400 mb-3">
                    {specialist.role}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {specialist.bio}
                  </p>
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    Focus: {specialist.specialty}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/booking?practitioner=${encodeURIComponent(specialist.name)}`}
                  className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-[#580F41] hover:text-white dark:hover:bg-rose-900/60 dark:hover:text-rose-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book With {specialist.name.split(' ')[1] || 'Practitioner'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SpaSpecialists;
