import React from 'react';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import Container from '@/components/layouts/Container';
import ServicesClient from '@/components/pages/ServicesClient';
import { getService } from '@/actions/server/spa';
import Link from 'next/link';
import { Sparkles, Plus, Clock, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Spa Services Menu & Rituals | Lumiere Spa Studio',
  description:
    'Explore our comprehensive menu of therapeutic massages, rejuvenating botanical facials, organic body wraps, and multi-hour packages.',
};

const addOns = [
  {
    title: 'Volcanic Basalt Heated Stones',
    price: 500,
    duration: '+15 mins',
    desc: 'Targeted spot placement on shoulder and sacrum to melt chronic tension deeper.',
  },
  {
    title: '24K Pure Gold Eye Contour Mask',
    price: 450,
    duration: '+15 mins',
    desc: 'Intense collagen and peptide infusion to diminish puffiness and dark circles.',
  },
  {
    title: 'Moroccan Argan Warm Scalp Elixir',
    price: 400,
    duration: '+15 mins',
    desc: 'Aromatic warm herbal oils massaged through hair roots to stimulate scalp follicles.',
  },
  {
    title: 'Eucalyptus Sauna Thermal Upgrade',
    price: 600,
    duration: '+30 mins',
    desc: 'Exclusive private post-treatment access to our herbal eucalyptus steam chamber.',
  },
];

const faqs = [
  {
    q: 'How early should I arrive before my scheduled ritual?',
    a: 'We recommend arriving 15 to 20 minutes prior to your appointment time. This allows you ample opportunity to change into our plush Turkish cotton robe, enjoy a complimentary chilled herbal tea, and complete your personalized sensory consultation.',
  },
  {
    q: 'What is the cancellation and rescheduling policy?',
    a: 'We understand plans change. You can cancel or reschedule your reservation free of charge up to 24 hours prior to your scheduled time directly from your Member Sanctuary Dashboard or by calling concierge.',
  },
  {
    q: 'Can I choose my practitioner or request female/male therapists?',
    a: 'Yes, absolutely. During booking you may select specific practitioners such as Dr. Evelyn Vance, Elena Moreau, or Marcus Thorne, or choose any available master practitioner.',
  },
  {
    q: 'Are your treatment products safe for sensitive skin and pregnancy?',
    a: 'Yes. All our botanicals are 100% organic, sulfate-free, and paraben-free. Please indicate any allergies or pregnancy during your booking so our therapists can customize hypoallergenic, prenatal-safe formulations.',
  },
];

export default async function ServicesPage() {
  const services = await getService();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <Container>
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 mb-4">
              <Link href="/" className="hover:text-[#580F41] dark:hover:text-rose-400">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#580F41] dark:text-rose-400">Services Menu</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Sanctuary Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight mb-5">
              Curated Spa{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
                Rituals & Services
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Discover our complete menu of therapeutic bodywork, skin rejuvenation, and holistic
              packages. Every ritual is individualized with botanical alchemies tailored to your needs.
            </p>
          </div>

          <ServicesClient services={services} />

          <section className="mt-24 pt-20 border-t border-zinc-200/80 dark:border-zinc-800">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-3">
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Enhancements</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-3">
                Elevate Your Session with Add-Ons
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Incorporate these targeted upgrades into any ritual during your consultation or booking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((add, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                      <span className="font-semibold text-[#580F41] dark:text-rose-400">Upgrade</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {add.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-white mb-2">
                      {add.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {add.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      +${add.price}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Available at Check-in
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 p-8 sm:p-12 rounded-3xl bg-linear-to-br from-[#580F41]/10 via-zinc-100 to-rose-50/20 dark:from-[#580F41]/20 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#580F41] dark:text-rose-400 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sanctuary Guidelines & Etiquette</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-4">
                Preparing for Your Sanctuary Journey
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                <div className="space-y-1.5">
                  <strong className="text-zinc-900 dark:text-white block font-semibold">
                    Attire & Comfort
                  </strong>
                  <p>
                    Plush robes, slippers, and private lockers are provided. Undergarments may be kept
                    on during massages, and professional draping is maintained at all times.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <strong className="text-zinc-900 dark:text-white block font-semibold">
                    Digital Tranquility
                  </strong>
                  <p>
                    To maintain serenity for all sanctuary guests, please silence all mobile phones
                    upon entering our thermal relaxation chambers and treatment suites.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Assistance?</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Everything you need to know about your appointments and treatments.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs"
                >
                  <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
