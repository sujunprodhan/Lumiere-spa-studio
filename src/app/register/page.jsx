import React from 'react';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import AuthShowcase from '@/components/auth/AuthShowcase';
import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Join Sanctuary Membership | Lumiere Spa Studio',
  description: 'Create your account to unlock exclusive member privileges and personalized rituals at Lumiere Spa Studio.',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 relative flex items-center justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-linear-to-bl from-rose-400/10 to-[#580F41]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-6xl relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-zinc-500 hover:text-[#580F41] dark:hover:text-rose-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <span className="text-xs text-zinc-400">
              Need assistance?{' '}
              <a href="mailto:concierge@lumierespa.com" className="text-[#580F41] dark:text-rose-400 underline hover:opacity-80">
                Contact Concierge
              </a>
            </span>
          </div>

          <div className="w-full bg-white dark:bg-zinc-900/90 rounded-3xl lg:rounded-4xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl shadow-[#580F41]/5 overflow-hidden flex flex-col lg:flex-row backdrop-blur-xl">
            <AuthShowcase mode="register" />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 xl:p-12">
              <React.Suspense fallback={<div className="py-20 text-center text-xs text-zinc-500">Loading registration...</div>}>
                <RegisterForm />
              </React.Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
