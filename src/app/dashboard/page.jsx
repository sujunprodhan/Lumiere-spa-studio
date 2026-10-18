'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import Container from '@/components/layouts/Container';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings, cancelBooking, rescheduleBooking, sendScheduleInvoiceEmail } from '@/actions/server/booking';
import InvoiceModal from '@/components/booking/InvoiceModal';
import AdminBookingManager from '@/components/dashboard/AdminBookingManager';
import Link from 'next/link';
import {
  Sparkles,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Heart,
  ChevronRight,
  MapPin,
  Leaf,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileText,
  Mail,
  Send,
  Printer,
  User,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('02:30 PM');
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailingId, setEmailingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('member');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.role === 'admin' || user?.email === 'jabiq@mailinator.com') {
      setActiveTab('admin');
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const email = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('lumiere_last_guest_email') : '');
      const res = await getUserBookings(email);
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchBookings();
    }
  }, [mounted, user]);

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you wish to cancel this sanctuary appointment?')) return;
    try {
      setIsUpdating(true);
      const res = await cancelBooking(id);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
        await fetchBookings();
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'Failed to cancel appointment.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime || !reschedulingBooking) return;
    try {
      setIsUpdating(true);
      const res = await rescheduleBooking(reschedulingBooking._id, newDate, newTime);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
        setReschedulingBooking(null);
        await fetchBookings();
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'Failed to reschedule appointment.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailInvoice = async (booking) => {
    try {
      setEmailingId(booking._id);
      const res = await sendScheduleInvoiceEmail({
        bookingId: booking._id,
        recipientEmail: booking.guestEmail,
      });
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: `Confirmed schedule invoice dispatched to ${booking.guestEmail}!`,
        });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Failed to dispatch email.' });
      }
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'Failed to dispatch invoice email.' });
    } finally {
      setEmailingId(null);
    }
  };

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <Navbar />

      <main className="flex-1 py-10 lg:py-16">
        <Container>
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Member Sanctuary Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-white tracking-tight">
                Welcome back,{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#580F41] to-rose-500">
                  {mounted && user ? user.name : 'Valued Guest'}
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Your personal sanctuary overview, confirmed schedule invoices, and live appointments.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchBookings}
                className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Refresh Bookings from Database"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingBookings ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/booking"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white font-medium text-sm shadow-md shadow-[#580F41]/20 hover:opacity-95 transition-opacity flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Ritual</span>
              </Link>
            </div>
          </div>

          {actionMessage && (
            <div
              className={`mb-8 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm border ${
                actionMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {actionMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{actionMessage.text}</span>
              </div>
              <button onClick={() => setActionMessage(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('member')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'member'
                    ? 'bg-[#580F41] text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Personal Sanctuary Bookings</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#580F41] text-white shadow-md'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>👑 Sanctuary Concierge Admin (Manage & Confirm All Bookings)</span>
              </button>
            </div>

            <Link
              href="/admin"
              className="text-xs text-[#580F41] dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 px-3 py-1.5"
            >
              <span>Full Admin Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeTab === 'admin' ? (
            <AdminBookingManager />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="p-6 rounded-3xl bg-linear-to-br from-[#580F41] to-[#751457] text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-15 group-hover:scale-110 transition-transform">
                    <Award className="w-20 h-20" />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-200">
                    Membership Tier
                  </span>
              <h3 className="text-2xl font-serif font-bold mt-2">Sanctuary Rose</h3>
              <p className="text-xs text-rose-100/80 mt-1">15% discount on all rituals</p>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-rose-200 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>VIP Priority Concierge</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                Active Appointments
              </span>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                {confirmedCount} {confirmedCount === 1 ? 'Ritual' : 'Rituals'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Invoices synced & ready</p>
              <div className="mt-6 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Email dispatch verified</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                Active Appointments
              </span>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                {confirmedCount} {confirmedCount === 1 ? 'Ritual' : 'Rituals'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Invoices synced & ready</p>
              <div className="mt-6 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Email dispatch verified</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                Wellness Points
              </span>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">850 pts</h3>
              <p className="text-xs text-zinc-500 mt-1">150 pts until next complimentary massage</p>
              <div className="mt-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-linear-to-r from-[#580F41] to-rose-500 h-2 rounded-full w-[85%]" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                Member Perk
              </span>
              <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mt-2">
                Aroma Blend Gift
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Signature essential oil bottle on arrival</p>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-[#580F41] dark:text-rose-400 font-semibold">
                <Heart className="w-4 h-4 fill-[#580F41] dark:fill-rose-400" />
                <span>Ready to claim on next visit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-white">
                      Your Scheduled Appointments
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Live reservations synced from our sanctuary database.
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    className="text-xs font-semibold text-[#580F41] dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>Book New</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {!mounted || isLoadingBookings ? (
                  <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#580F41] mb-2" />
                    <span className="text-xs">Fetching your sanctuary reservations...</span>
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const dateObj = new Date(booking.appointmentDate);
                      const monthStr = !isNaN(dateObj)
                        ? dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                        : 'APPT';
                      const dayStr = !isNaN(dateObj) ? dateObj.getDate() : '—';
                      const isCancelled = booking.status === 'cancelled';

                      return (
                        <div
                          key={booking._id}
                          className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isCancelled
                              ? 'bg-zinc-100/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60'
                              : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#580F41] to-[#7a155a] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                              <span className="text-[10px] uppercase tracking-wider text-rose-200">
                                {monthStr}
                              </span>
                              <span className="text-lg leading-none">{dayStr}</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                    isCancelled
                                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300'
                                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60'
                                  }`}
                                >
                                  {isCancelled ? 'Cancelled' : 'Confirmed & Reserved'}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400">
                                  Ref: {booking.bookingCode}
                                </span>
                              </div>

                              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                                {booking.serviceTitle}
                              </h4>

                              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400" />
                                  <span>
                                    {booking.timeSlot} ({booking.serviceDuration})
                                  </span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400" />
                                  <span>{booking.practitioner}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {!isCancelled && (
                            <div className="flex flex-wrap items-center gap-2 sm:self-center">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoiceBooking(booking)}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
                                title="View & Print Official Schedule Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400" />
                                <span>Invoice</span>
                              </button>

                              <button
                                type="button"
                                disabled={emailingId === booking._id}
                                onClick={() => handleEmailInvoice(booking)}
                                className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-xs font-semibold text-[#580F41] dark:text-rose-300 hover:bg-rose-100/80 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title="Email Schedule Invoice to Guest"
                              >
                                {emailingId === booking._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Mail className="w-3.5 h-3.5" />
                                )}
                                <span>Email</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setReschedulingBooking(booking);
                                  setNewDate(booking.appointmentDate);
                                  setNewTime(booking.timeSlot);
                                }}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                Reschedule
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-14 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                    <Calendar className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                    <h3 className="text-base font-serif font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                      No Scheduled Appointments Yet
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5">
                      You haven&apos;t reserved a spa ritual yet. Choose from our 20+ signature treatments
                      and secure your relaxation time.
                    </p>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-semibold shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Book Your First Ritual</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-white mb-2">
                  Sanctuary Concierge
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  Have special requests, essential oil preferences, or dietary requirements? Our
                  concierge is at your service.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/booking"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-[#580F41] dark:text-rose-400" />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Book a Private Suite
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/services"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Explore Treatment Catalog
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-linear-to-tr from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-800/50 border border-rose-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#580F41] dark:text-rose-300 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Personalized Recommendation</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Signature Lavender Aromatherapy
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Based on your interest in relaxation and stress relief, try our 60-minute session
                  crafted with organic French lavender.
                </p>
                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#580F41] dark:text-rose-400 hover:underline"
                >
                  <span>Discover treatment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  </main>

      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setReschedulingBooking(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-white mb-1">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Rescheduling for <strong className="text-zinc-800 dark:text-zinc-200">{reschedulingBooking.serviceTitle}</strong>
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  New Appointment Date:
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  New Time Slot:
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-zinc-900 dark:text-white"
                >
                  {['09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}

      <Footer />
    </div>
  );
}
