'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllBookingsAdmin,
  confirmBookingByAdmin,
  cancelBooking,
  sendScheduleInvoiceEmail,
} from '@/actions/server/booking';
import InvoiceModal from '@/components/booking/InvoiceModal';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Mail,
  Loader2,
  User,
  Phone,
  DollarSign,
  ChevronRight,
  Send,
  Droplets,
  Award,
} from 'lucide-react';

export default function AdminBookingManager() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  const fetchAllBookings = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBookingsAdmin();
      if (res.success) {
        setBookings(res.bookings || []);
      } else {
        setToastMessage({ type: 'error', text: res.message || 'Failed to load bookings.' });
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      setToastMessage({ type: 'error', text: 'Error connecting to database.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      setActionLoadingId(bookingId);
      const res = await confirmBookingByAdmin(bookingId);
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: 'Booking confirmed! Official schedule invoice has been sent to client.',
        });
        await fetchAllBookings();
      } else {
        setToastMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      console.error(err);
      setToastMessage({ type: 'error', text: 'Failed to confirm appointment.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel / decline this appointment?')) return;
    try {
      setActionLoadingId(bookingId);
      const res = await cancelBooking(bookingId);
      if (res.success) {
        setToastMessage({ type: 'success', text: 'Appointment has been cancelled.' });
        await fetchAllBookings();
      } else {
        setToastMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      console.error(err);
      setToastMessage({ type: 'error', text: 'Failed to cancel appointment.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendInvoiceEmail = async (booking) => {
    try {
      setActionLoadingId(`email-${booking._id}`);
      const res = await sendScheduleInvoiceEmail({
        bookingId: booking._id,
        recipientEmail: booking.guestEmail,
      });
      if (res.success) {
        setToastMessage({
          type: 'success',
          text: `Schedule invoice re-dispatched to ${booking.guestEmail}!`,
        });
      } else {
        setToastMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      console.error(err);
      setToastMessage({ type: 'error', text: 'Failed to send invoice email.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const revenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((acc, b) => acc + (Number(b.servicePrice) || 0) * 1.08, 0);

    return { total, pending, confirmed, revenue: Math.round(revenue) };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'pending' && b.status === 'pending') ||
        (filterStatus === 'confirmed' && b.status === 'confirmed') ||
        (filterStatus === 'cancelled' && b.status === 'cancelled');

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.guestName && b.guestName.toLowerCase().includes(q)) ||
        (b.guestEmail && b.guestEmail.toLowerCase().includes(q)) ||
        (b.guestPhone && b.guestPhone.toLowerCase().includes(q)) ||
        (b.bookingCode && b.bookingCode.toLowerCase().includes(q)) ||
        (b.serviceTitle && b.serviceTitle.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="w-full space-y-8">
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm border transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
            Total Reservations
          </span>
          <h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mt-2">
            {metrics.total}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Across all sanctuary services</p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-300">
              Needs Confirmation
            </span>
            {metrics.pending > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <h3 className="text-3xl font-serif font-bold text-amber-900 dark:text-amber-200 mt-2">
            {metrics.pending}
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            Awaiting concierge review
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
            Confirmed & Active
          </span>
          <h3 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white mt-2">
            {metrics.confirmed}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">Invoices dispatched</p>
        </div>

        <div className="p-6 rounded-3xl bg-linear-to-br from-[#580F41] to-[#751457] text-white shadow-xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-200">
            Confirmed Revenue
          </span>
          <h3 className="text-3xl font-serif font-bold text-white mt-2">
            ${metrics.revenue.toLocaleString()}
          </h3>
          <p className="text-xs text-rose-200/80 mt-1">Including 8% tax & service</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Bookings', count: metrics.total },
              { id: 'pending', label: 'Pending Approval', count: metrics.pending, highlight: true },
              { id: 'confirmed', label: 'Confirmed', count: metrics.confirmed },
              { id: 'cancelled', label: 'Cancelled', count: bookings.filter((b) => b.status === 'cancelled').length },
            ].map((tab) => {
              const isSelected = filterStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#580F41] text-white shadow-md shadow-[#580F41]/20'
                      : tab.highlight && tab.count > 0
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest, code, ritual..."
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#580F41]"
              />
            </div>

            <button
              onClick={fetchAllBookings}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
              title="Refresh from Database"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#580F41] mb-3" />
            <span className="text-xs">Fetching all system reservations from database...</span>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredBookings.map((b) => {
              const isPending = b.status === 'pending';
              const isConfirmed = b.status === 'confirmed';
              const isCancelled = b.status === 'cancelled';
              const isLoadingThis = actionLoadingId === b._id;

              return (
                <div
                  key={b._id}
                  className={`p-6 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                    isPending
                      ? 'bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40'
                      : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#580F41] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-200/60 dark:border-rose-900/40">
                        {b.bookingCode}
                      </span>

                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Awaiting Admin Confirmation
                        </span>
                      )}

                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Confirmed & Scheduled
                        </span>
                      )}

                      {isCancelled && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                          Cancelled
                        </span>
                      )}

                      <span className="text-xs text-zinc-400">
                        Requested: {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-serif font-bold text-zinc-900 dark:text-white">
                        {b.serviceTitle}
                      </h4>
                      <p className="text-xs text-zinc-500">
                        {b.serviceDuration} • {b.serviceCategory} • Investment: <strong>${(Number(b.servicePrice) * 1.08).toFixed(0)}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400 shrink-0" />
                        <span>
                          <strong>{b.appointmentDate}</strong> at <strong>{b.timeSlot}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <User className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400 shrink-0" />
                        <span>
                          {b.guestName} ({b.guestEmail})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Phone className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400 shrink-0" />
                        <span>{b.guestPhone}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 flex flex-wrap gap-4 pt-1">
                      <span>Practitioner: <strong>{b.practitioner}</strong></span>
                      {b.scentPreference && <span>Aroma: <strong>{b.scentPreference}</strong></span>}
                      {b.specialNotes && <span>Notes: <em>{b.specialNotes}</em></span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 lg:flex-col lg:items-end">
                    {isPending && (
                      <button
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() => handleConfirmBooking(b._id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Confirm Booking & Send Invoice</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceBooking(b)}
                        className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#580F41] dark:text-rose-400" />
                        <span>Invoice</span>
                      </button>

                      <button
                        type="button"
                        disabled={actionLoadingId === `email-${b._id}`}
                        onClick={() => handleSendInvoiceEmail(b)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-xs font-semibold text-[#580F41] dark:text-rose-300 hover:bg-rose-100/70 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Email Schedule Invoice to Client"
                      >
                        {actionLoadingId === `email-${b._id}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        <span>Email</span>
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          disabled={isLoadingThis}
                          onClick={() => handleCancelBooking(b._id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center p-6">
            <Calendar className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <h4 className="text-base font-serif font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              No Bookings Found
            </h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No sanctuary reservations match your current filter ({filterStatus}).
            </p>
          </div>
        )}
      </div>

      {selectedInvoiceBooking && (
        <InvoiceModal
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
}
