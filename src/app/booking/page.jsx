import React, { Suspense } from 'react';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import Container from '@/components/layouts/Container';
import BookingFlow from '@/components/booking/BookingFlow';
import { getService } from '@/actions/server/spa';
import Link from 'next/link';
import { Sparkles, Calendar, Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Book a Sanctuary Ritual | Lumiere Spa Studio',
  description:
    'Reserve your personalized luxury spa treatment, botanical facial, or multi-hour retreat online with instant confirmation.',
};

export default async function BookingPage() {
  const services = await getService();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <Container>
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 mb-4">
              <Link href="/" className="hover:text-[#580F41] dark:hover:text-rose-400">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#580F41] dark:text-rose-400">Reserve Ritual</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>Real-Time Sanctuary Scheduling</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
              Reserve Your{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
                Spa Sanctuary Time
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Select your preferred ceremony, personalized date, master practitioner, and signature
              botanical oils. Your appointment will be instantly confirmed in our database.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#580F41] dark:text-rose-400 mb-4" />
                <p className="text-sm">Preparing your sanctuary reservation experience...</p>
              </div>
            }
          >
            <BookingFlow services={services} />
          </Suspense>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
