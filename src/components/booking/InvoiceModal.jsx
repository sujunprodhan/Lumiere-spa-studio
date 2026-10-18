'use client';

import React, { useState } from 'react';
import { X, Printer, Mail, Send, CheckCircle2, Sparkles, Shield, Clock, MapPin, User, FileText, Loader2 } from 'lucide-react';
import { sendScheduleInvoiceEmail } from '@/actions/server/booking';

export default function InvoiceModal({ booking, onClose }) {
  const [customEmail, setCustomEmail] = useState(booking?.guestEmail || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!booking) return null;

  const basePrice = Number(booking.servicePrice) || 0;
  const tax = Math.round(basePrice * 0.08);
  const total = basePrice + tax;
  const invoiceNumber = booking.invoiceNumber || `INV-${booking.bookingCode || '000000'}`;

  const dateObj = booking.appointmentDate ? new Date(booking.appointmentDate) : null;
  const formattedDate =
    dateObj && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : booking.appointmentDate || 'Upcoming Session';

  const handleSendEmail = async () => {
    if (!customEmail) return;
    try {
      setIsSending(true);
      setSendSuccess(false);
      const res = await sendScheduleInvoiceEmail({
        bookingId: booking._id,
        recipientEmail: customEmail,
      });
      if (res.success) {
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to send invoice email:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-4xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:rounded-none print:max-w-full"
      >
        <div className="flex items-center justify-between p-4 px-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <FileText className="w-4 h-4 text-[#580F41] dark:text-rose-400" />
            <span>Official Schedule Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-3xl font-serif font-bold text-[#580F41] dark:text-rose-100">
                Lumiere<span className="text-rose-500">.</span>
              </span>
              <p className="text-xs text-zinc-500 mt-1">Sanctuary of Mind & Body</p>
              <p className="text-xs text-zinc-500">123 Serenity Avenue, Wellness District, NY 10001</p>
              <p className="text-xs text-zinc-500">concierge@lumierespa.com • +1 (555) 123-4567</p>
            </div>

            <div className="text-left sm:text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${
                  booking.status === 'confirmed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : booking.status === 'cancelled'
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}
              >
                {booking.status === 'confirmed'
                  ? 'Confirmed & Reserved'
                  : booking.status === 'cancelled'
                  ? 'Cancelled'
                  : 'Pending Admin Confirmation'}
              </span>
              <h2 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                {invoiceNumber}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Reference Code: <strong className="text-[#580F41] dark:text-rose-400">{booking.bookingCode}</strong>
              </p>
              <p className="text-xs text-zinc-500">
                Issued:{' '}
                {booking.createdAt && !isNaN(new Date(booking.createdAt).getTime())
                  ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Today'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 block mb-1">
                Guest Information:
              </span>
              <p className="font-bold text-zinc-900 dark:text-white">{booking.guestName}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{booking.guestEmail}</p>
              <p className="text-zinc-600 dark:text-zinc-400">{booking.guestPhone}</p>
              {booking.specialNotes && (
                <p className="text-xs text-zinc-500 mt-2 italic">
                  Notes: {booking.specialNotes}
                </p>
              )}
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 block mb-1">
                Schedule & Sanctuary Allocation:
              </span>
              <p className="font-bold text-[#580F41] dark:text-rose-400">{formattedDate}</p>
              <p className="font-semibold text-zinc-900 dark:text-white">Time Slot: {booking.timeSlot}</p>
              <p className="text-zinc-600 dark:text-zinc-400">Practitioner: {booking.practitioner}</p>
              <p className="text-zinc-600 dark:text-zinc-400">Aroma: {booking.scentPreference || 'Wild Lavender'}</p>
            </div>
          </div>

          <div>
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5">Treatment Ritual</th>
                  <th className="py-2.5 text-center">Duration</th>
                  <th className="py-2.5 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr>
                  <td className="py-3">
                    <strong className="block text-zinc-900 dark:text-white font-medium">
                      {booking.serviceTitle}
                    </strong>
                    <span className="text-xs text-zinc-500">
                      Category: {booking.serviceCategory} • Organic botanicals & master therapy
                    </span>
                  </td>
                  <td className="py-3 text-center text-zinc-600 dark:text-zinc-400">
                    {booking.serviceDuration}
                  </td>
                  <td className="py-3 text-right font-medium text-zinc-900 dark:text-white">
                    ${basePrice.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-3">
                    <strong className="block text-zinc-900 dark:text-white font-medium">
                      Private Hydro-Suite & Thermal Steam Access
                    </strong>
                    <span className="text-xs text-zinc-500">
                      Pre-treatment cedarwood sauna and mineral soak
                    </span>
                  </td>
                  <td className="py-3 text-center text-zinc-600 dark:text-zinc-400">15 mins</td>
                  <td className="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Complimentary ($0)
                  </td>
                </tr>

                <tr>
                  <td className="py-3">
                    <strong className="block text-zinc-900 dark:text-white font-medium">
                      Welcome Herbal Elixir & Sensory Diagnostics
                    </strong>
                    <span className="text-xs text-zinc-500">
                      Signature aromatherapy custom consultation
                    </span>
                  </td>
                  <td className="py-3 text-center text-zinc-600 dark:text-zinc-400">—</td>
                  <td className="py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Complimentary ($0)
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-4 border-t-2 border-zinc-200 dark:border-zinc-800 flex justify-end">
              <div className="w-64 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="font-medium text-zinc-900 dark:text-white">${basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Hospitality & Tax (8%):</span>
                  <span className="font-medium text-zinc-900 dark:text-white">${tax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-base font-bold text-zinc-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-lg font-serif text-[#580F41] dark:text-rose-400">${total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-zinc-500 text-right pt-1">
                  Settlement on Arrival or Member Sanctuary Account
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
            <strong className="block font-semibold text-[#580F41] dark:text-rose-300">
              Sanctuary Preparation & Arrival:
            </strong>
            <p>
              • Please arrive 15 minutes prior to your scheduled time at 123 Serenity Avenue.
            </p>
            <p>
              • Plush Turkish cotton robes and secure lockers are prepared for your arrival.
            </p>
            <p>
              • Cancellations or rescheduling are accommodated with 24 hours advance notification.
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 print:hidden space-y-3">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Email this Schedule Invoice:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Enter email to receive invoice..."
                className="flex-1 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#580F41]"
              />
              <button
                type="button"
                disabled={isSending}
                onClick={handleSendEmail}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#580F41] to-[#7a155a] text-white text-xs font-semibold hover:opacity-95 shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send to Email</span>
              </button>
            </div>

            {sendSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed schedule invoice has been dispatched to {customEmail}!</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
