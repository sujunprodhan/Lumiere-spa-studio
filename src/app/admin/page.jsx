import React from 'react';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import Container from '@/components/layouts/Container';
import AdminBookingManager from '@/components/dashboard/AdminBookingManager';
import Link from 'next/link';
import { ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Sanctuary Concierge Admin | Lumiere Spa Studio',
  description: 'Manage, review, and confirm all sanctuary bookings across all clients.',
};

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 py-10 lg:py-16">
        <Container>
          <div className="mb-10 pb-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 mb-3">
                <Link href="/dashboard" className="hover:text-[#580F41] flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <span>/</span>
                <span className="text-[#580F41] dark:text-rose-400">Admin Sanctuary Portal</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sanctuary Concierge Administration</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                All Reservations &{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
                  Confirmation Portal
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Review all client booking requests, approve & confirm appointments, and dispatch official schedule invoices.
              </p>
            </div>
          </div>

          <AdminBookingManager />
        </Container>
      </main>

      <Footer />
    </div>
  );
}
