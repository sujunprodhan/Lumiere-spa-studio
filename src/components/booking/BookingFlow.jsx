'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createBooking, sendScheduleInvoiceEmail } from '@/actions/server/booking';
import InvoiceModal from './InvoiceModal';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Heart,
  Droplets,
  Award,
  AlertCircle,
  Loader2,
  Send,
  Printer,
} from 'lucide-react';

const timeSlots = [
  { time: '09:30 AM', period: 'Morning' },
  { time: '11:00 AM', period: 'Morning' },
  { time: '01:00 PM', period: 'Afternoon' },
  { time: '02:30 PM', period: 'Afternoon' },
  { time: '04:00 PM', period: 'Afternoon' },
  { time: '05:30 PM', period: 'Evening' },
  { time: '07:00 PM', period: 'Evening' },
];

const practitioners = [
  { name: 'Any Available Master Practitioner', title: 'Recommended for optimal scheduling' },
  { name: 'Dr. Evelyn Vance', title: 'Lead Holistic Physician & Ayurvedic Master' },
  { name: 'Elena Moreau', title: 'Master Aesthetician & Skin Sculptor' },
  { name: 'Marcus Thorne', title: 'Senior Myofascial & Deep Tissue Master' },
  { name: 'Maya Chen', title: 'Holistic Healer & Sound Bath Guide' },
];

const scents = [
  { id: 'lavender', name: 'Wild Lavender & Bergamot', desc: 'Promotes deep calming and restorative sleep' },
  { id: 'eucalyptus', name: 'Crisp Eucalyptus & Mint', desc: 'Invigorating respiratory clarity & tension relief' },
  { id: 'rose', name: 'Damascena Rose & Vanilla', desc: 'Luminescent uplifting & nervous system grounding' },
  { id: 'sandalwood', name: 'Sacred Sandalwood & Amber', desc: 'Ancient grounding aroma for centered stillness' },
];

export default function BookingFlow({ services = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const preselectedId = searchParams.get('serviceId');
  const preselectedPractitioner = searchParams.get('practitioner');

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedPractitioner, setSelectedPractitioner] = useState('Any Available Master Practitioner');
  const [selectedScent, setSelectedScent] = useState('Wild Lavender & Bergamot');
  const [pressurePreference, setPressurePreference] = useState('Medium Restorative');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setAppointmentDate(dateStr);
    setSelectedTimeSlot('01:00 PM');
  }, []);

  useEffect(() => {
    if (user) {
      if (!guestName && user.name) setGuestName(user.name);
      if (!guestEmail && user.email) setGuestEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (preselectedId && services.length > 0) {
      const match = services.find((s) => s._id === preselectedId);
      if (match) setSelectedServiceId(match._id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0]._id);
    }

    if (preselectedPractitioner) {
      const pMatch = practitioners.find((p) => p.name.includes(preselectedPractitioner));
      if (pMatch) setSelectedPractitioner(pMatch.name);
    }
  }, [preselectedId, preselectedPractitioner, services]);

  const activeService =
    services.find((s) => s._id === selectedServiceId) || services[0] || {};

  const basePrice = Number(activeService.price) || 0;
  const tax = Math.round(basePrice * 0.08);
  const total = basePrice + tax;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user || !user.id) {
      setErrorMessage('Registration required: Please sign in or register to complete your sanctuary reservation.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMessage('Please fill in your contact name, email, and phone number.');
      setCurrentStep(3);
      return;
    }

    if (!appointmentDate || !selectedTimeSlot) {
      setErrorMessage('Please select a valid appointment date and time slot.');
      setCurrentStep(2);
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingPayload = {
        serviceId: activeService._id,
        serviceTitle: activeService.title,
        servicePrice: activeService.price,
        serviceDuration: activeService.duration,
        serviceCategory: activeService.category,
        serviceImage: activeService.image,
        appointmentDate,
        timeSlot: selectedTimeSlot,
        practitioner: selectedPractitioner,
        guestName,
        guestEmail,
        guestPhone,
        scentPreference: selectedScent,
        specialNotes: `Pressure: ${pressurePreference}. ${specialNotes}`.trim(),
        userId: user?.id || null,
      };

      const result = await createBooking(bookingPayload);

      if (result.success) {
        setConfirmedBooking(result.booking);
      } else {
        setErrorMessage(result.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-4xl border border-zinc-200/80 dark:border-zinc-800 p-8 sm:p-12 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Appointment Reserved in Database</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-2">
          Your Sanctuary Visit is Confirmed!
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mb-8">
          A confirmation dispatch has been logged. We have reserved your suite and dispatched your
          official schedule invoice.
        </p>

        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs sm:text-sm text-[#580F41] dark:text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-2.5 text-left">
            <Mail className="w-5 h-5 text-[#580F41] dark:text-rose-400 shrink-0" />
            <div>
              <strong className="block font-semibold">
                Confirmed Schedule Invoice Dispatched
              </strong>
              <span className="text-zinc-600 dark:text-zinc-400 text-xs">
                Sent to: <strong>{confirmedBooking.guestEmail}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400" />
              <span>View Invoice</span>
            </button>

            <button
              type="button"
              disabled={isResendingEmail}
              onClick={async () => {
                setIsResendingEmail(true);
                setEmailSentAlert(false);
                const res = await sendScheduleInvoiceEmail({
                  bookingId: confirmedBooking._id,
                  recipientEmail: confirmedBooking.guestEmail,
                });
                setIsResendingEmail(false);
                if (res.success) {
                  setEmailSentAlert(true);
                  setTimeout(() => setEmailSentAlert(false), 4000);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#580F41] text-white text-xs font-semibold hover:bg-[#7a155a] flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isResendingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Resend Email</span>
            </button>
          </div>
        </div>

        {emailSentAlert && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Schedule invoice has been resent to your email!</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/70 text-left mb-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60 dark:border-zinc-700/60">
            <div>
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                Booking Reference
              </span>
              <span className="text-xl font-mono font-bold text-[#580F41] dark:text-rose-400">
                {confirmedBooking.bookingCode}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block">
                Status
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Confirmed & Guaranteed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-zinc-500 block mb-0.5">Selected Treatment:</span>
              <strong className="text-zinc-900 dark:text-white block font-serif text-base">
                {confirmedBooking.serviceTitle}
              </strong>
              <span className="text-xs text-zinc-500">
                {confirmedBooking.serviceDuration} • {confirmedBooking.serviceCategory}
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5">Date & Time Slot:</span>
              <strong className="text-zinc-900 dark:text-white block">
                {confirmedBooking.appointmentDate} at {confirmedBooking.timeSlot}
              </strong>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5">Assigned Specialist:</span>
              <strong className="text-zinc-900 dark:text-white">
                {confirmedBooking.practitioner}
              </strong>
            </div>

            <div>
              <span className="text-zinc-500 block mb-0.5">Guest Information:</span>
              <strong className="text-zinc-900 dark:text-white block">
                {confirmedBooking.guestName}
              </strong>
              <span className="text-xs text-zinc-500">
                {confirmedBooking.guestEmail} • {confirmedBooking.guestPhone}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-medium">Total Investment:</span>
            <span className="text-2xl font-bold text-[#580F41] dark:text-rose-400">
              ${(Number(confirmedBooking.servicePrice) * 1.08).toFixed(0)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setShowInvoiceModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#580F41] dark:text-rose-400" />
            <span>View & Print Invoice</span>
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md flex items-center justify-center gap-2"
          >
            <span>View in Sanctuary Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setConfirmedBooking(null);
              setCurrentStep(1);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Book Another Ritual
          </button>
        </div>

        {showInvoiceModal && (
          <InvoiceModal
            booking={confirmedBooking}
            onClose={() => setShowInvoiceModal(false)}
          />
        )}
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#580F41] dark:text-rose-400 mb-4" />
        <p className="text-sm">Preparing your sanctuary reservation experience...</p>
      </div>
    );
  }

  if (!user) {
    const returnUrl = `/booking${preselectedId ? `?serviceId=${preselectedId}` : ''}`;
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-4xl border border-zinc-200/80 dark:border-zinc-800 p-8 sm:p-12 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-[#580F41] to-[#7a155a] text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#580F41]/20">
          <ShieldCheck className="w-8 h-8 text-rose-200" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sanctuary Membership Required</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-3">
          Sign In or Register to Book
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          To ensure tailored botanical formulations, private suite allocation, and personalized health consultation, reservations require a registered Lumiere account.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/login?redirect=${encodeURIComponent(returnUrl)}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            href={`/register?redirect=${encodeURIComponent(returnUrl)}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register New Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
          {[
            { step: 1, label: 'Ritual' },
            { step: 2, label: 'Date & Time' },
            { step: 3, label: 'Preferences' },
            { step: 4, label: 'Review & Confirm' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  currentStep === item.step
                    ? 'bg-[#580F41] text-white shadow-lg shadow-[#580F41]/30 scale-110'
                    : currentStep > item.step
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="w-5 h-5" /> : item.step}
              </div>
              <span
                className={`text-xs font-semibold mt-2 ${
                  currentStep === item.step
                    ? 'text-[#580F41] dark:text-rose-400'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {mounted && !user && (
        <div className="mb-8 p-5 rounded-3xl bg-linear-to-r from-amber-50 via-rose-50/40 to-amber-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 border border-amber-200/90 dark:border-amber-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                Membership Registration Required to Reserve
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-zinc-400 mt-0.5">
                To guarantee private treatment suite availability and dispatch official schedule invoices, bookings require a registered account.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/login?redirect=/booking"
              className="px-4 py-2 rounded-xl border border-amber-300 dark:border-zinc-700 text-xs font-bold text-amber-900 dark:text-zinc-200 hover:bg-amber-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register?redirect=/booking"
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-bold hover:opacity-90 shadow-md shadow-[#580F41]/20 transition-all"
            >
              Register Free
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {currentStep === 1 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#580F41] dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Select Your Spa Ritual
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Choose from our database of 20 signature holistic treatments.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {services.map((svc) => {
                  const isSelected = selectedServiceId === svc._id;
                  return (
                    <div
                      key={svc._id}
                      onClick={() => setSelectedServiceId(svc._id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                        isSelected
                          ? 'border-[#580F41] dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-md ring-2 ring-[#580F41]/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={svc.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                          alt={svc.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                            <span className="font-semibold uppercase tracking-wider text-[#580F41] dark:text-rose-400">
                              {svc.category}
                            </span>
                            <span className="flex items-center gap-0.5 text-zinc-500">
                              <Clock className="w-3 h-3" />
                              {svc.duration}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                            {svc.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            ${Number(svc.price).toLocaleString()}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#580F41] bg-[#580F41] text-white'
                                : 'border-zinc-300 dark:border-zinc-700'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Date & Time</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#580F41] dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Choose Date & Sanctuary Time Slot
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Appointments include 15 minutes of relaxation in our herbal mineral lounge.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Appointment Date:
                  </label>
                  <div className="relative max-w-sm">
                    <CalendarIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="date"
                      min={minDate}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41] dark:focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Select Available Sanctuary Time:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#580F41] dark:border-rose-500 bg-[#580F41] text-white shadow-md'
                              : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <span className="block text-xs font-bold">{slot.time}</span>
                          <span
                            className={`block text-[10px] mt-0.5 ${
                              isSelected ? 'text-rose-200' : 'text-zinc-500'
                            }`}
                          >
                            {slot.period}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Master Practitioner Preference:
                  </label>
                  <select
                    value={selectedPractitioner}
                    onChange={(e) => setSelectedPractitioner(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#580F41] dark:focus:border-rose-500"
                  >
                    {practitioners.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Preferences</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#580F41] dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Custom Aromatherapy & Guest Details
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Tell us your scent preferences and contact details for appointment confirmation.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Signature Aromatherapy Essential Oil Blend:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {scents.map((s) => {
                      const isSelected = selectedScent === s.name;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setSelectedScent(s.name)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#580F41] dark:border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {s.name}
                            </span>
                            <Droplets
                              className={`w-3.5 h-3.5 ${
                                isSelected ? 'text-[#580F41] dark:text-rose-400' : 'text-zinc-400'
                              }`}
                            />
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1">{s.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                    Massage / Touch Pressure Intensity:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Light & Calming', 'Medium Restorative', 'Deep Firm Acupressure'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPressurePreference(p)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          pressurePreference === p
                            ? 'border-[#580F41] bg-[#580F41] text-white'
                            : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  {mounted && !user && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          <strong>Registration Required:</strong> Sign in or create an account to confirm this booking and receive your schedule invoice.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href="/login?redirect=/booking"
                          className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-zinc-700 text-xs font-bold text-amber-900 dark:text-zinc-200 hover:bg-amber-100 dark:hover:bg-zinc-800"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register?redirect=/booking"
                          className="px-3.5 py-1.5 rounded-lg bg-[#580F41] text-white text-xs font-bold hover:opacity-90"
                        >
                          Register Free
                        </Link>
                      </div>
                    </div>
                  )}

                  <h4 className="text-xs uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-200">
                    Guest Contact Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Camilla Montgomery"
                          className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="camilla@example.com"
                          className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                      Health Notes, Focus Areas, or Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Focus on shoulder knots, hypoallergenic products only, celebrating birthday..."
                      className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-semibold text-sm hover:opacity-95 shadow-md flex items-center gap-2"
                >
                  <span>Review Booking</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#580F41] dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                    Review & Confirm Sanctuary Booking
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Confirm your details below. Your reservation will be securely stored in our database.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200/60 dark:border-zinc-700/60">
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider block">
                      Ritual Selection
                    </span>
                    <strong className="text-base font-serif font-bold text-zinc-900 dark:text-white">
                      {activeService.title}
                    </strong>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-zinc-500 block">Duration & Category</span>
                    <span className="text-xs font-semibold text-[#580F41] dark:text-rose-400">
                      {activeService.duration} • {activeService.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-zinc-500 block">Date & Time:</span>
                    <strong className="text-zinc-900 dark:text-white">
                      {appointmentDate} at {selectedTimeSlot}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Master Practitioner:</span>
                    <strong className="text-zinc-900 dark:text-white">
                      {selectedPractitioner}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Aroma Essence:</span>
                    <strong className="text-zinc-900 dark:text-white">{selectedScent}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Guest:</span>
                    <strong className="text-zinc-900 dark:text-white">
                      {guestName} ({guestEmail}, {guestPhone})
                    </strong>
                  </div>
                </div>

                {specialNotes && (
                  <div className="pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Notes: </span>
                    {specialNotes}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-6">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  No immediate charge. Payment can be settled upon arrival or charged to your member account.
                  Cancel up to 24h prior.
                </span>
              </div>

              {mounted && !user ? (
                <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                        Registration Required to Confirm
                      </h5>
                      <p className="text-xs text-amber-800/80 dark:text-zinc-400 mt-0.5">
                        Please sign in or register your sanctuary account to confirm and reserve this booking.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Back
                    </button>
                    <Link
                      href="/login?redirect=/booking"
                      className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register?redirect=/booking"
                      className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-bold hover:opacity-90 shadow-md shadow-[#580F41]/20 transition-all"
                    >
                      Register to Confirm
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitBooking}
                    className="px-8 py-3.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-bold text-sm hover:opacity-95 shadow-lg shadow-[#580F41]/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Reservation to Database...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Confirm & Book Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-md">
            <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-white mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span>Appointment Summary</span>
              <Sparkles className="w-4 h-4 text-[#580F41] dark:text-rose-400" />
            </h4>

            <div className="flex gap-3 mb-6">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={activeService.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef'}
                  alt={activeService.title || 'Spa'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#580F41] dark:text-rose-400 block">
                  {activeService.category}
                </span>
                <h5 className="text-sm font-serif font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {activeService.title}
                </h5>
                <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {activeService.duration}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span>Date:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {appointmentDate || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Slot:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedTimeSlot || 'Not selected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Practitioner:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                  {selectedPractitioner.split(' ')[0]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mineral Hydro Lounge:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Complimentary
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800 mb-6">
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Ritual Fee</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  ${basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                <span>Sanctuary Hospitality & Tax (8%)</span>
                <span className="font-medium text-zinc-900 dark:text-white">${tax}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>Total Investment</span>
                <span className="text-xl font-serif text-[#580F41] dark:text-rose-400">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 space-y-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant confirmation & reference code</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% Organic botanical extracts</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Private dressing suite & robe provided</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
