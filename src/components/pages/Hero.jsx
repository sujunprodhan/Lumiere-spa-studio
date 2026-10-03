import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import Container from './layouts/Container';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/spa.mp4" />
        </video>
      </div>
      <div className="absolute inset-0 w-full h-full bg-zinc-50/50 dark:bg-black/60 z-0 pointer-events-none"></div>
      <div className="relative z-10 w-full">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Premium Spa Experience
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif mb-6 leading-[1.1]">
                Rejuvenate Your <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-[#9c1f75]">
                  Mind & Body
                </span>
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl lg:max-w-xl mb-10 leading-relaxed">
                Step into an oasis of tranquility. Experience personalized spa treatments, holistic
                therapies, and a serene ambiance designed for ultimate relaxation.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#580F41] text-white font-semibold text-lg hover:bg-[#7a155a] transition-all duration-300 shadow-lg shadow-[#580F41]/30 flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold text-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-[#580F41]/10 dark:bg-[#580F41]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-[#580F41] fill-[#580F41]" />
                  </div>
                  Watch Video
                </button>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-8 w-full max-w-md lg:max-w-full">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative w-12 h-12 rounded-full overflow-hidden border-4 border-white dark:border-black"
                    >
                      <Image
                        src={`https://i.pravatar.cc/150?img=${i + 10}`}
                        alt="Customer"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start items-center gap-1 text-amber-500 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-900 dark:text-white">4.9/5</span> from
                    1,200+ reviews
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none h-100 sm:h-125 lg:h-162.5 z-10 mt-10 lg:mt-0">
              <div className="absolute top-0 right-0 w-[85%] h-[85%] rounded-4xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[#580F41]/10 mix-blend-multiply z-10 pointer-events-none"></div>
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop"
                  alt="Spa treatment"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute bottom-5 left-0 w-1/2 h-1/2 rounded-4xl overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-950 z-20">
                <Image
                  src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=2070&auto=format&fit=crop"
                  alt="Essential oils"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="absolute top-10 sm:top-20 -left-4 sm:-left-10 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl z-30 flex items-center gap-4 border border-zinc-100 dark:border-zinc-800 animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#580F41] dark:bg-[#580F41] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-gray-50 dark:text-[#580F41]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#580F41] dark:text-white">
                    Award Winning
                  </p>
                  <p className="text-xs text-zinc-500">Spa Studio 2026</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
