'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { sendBookingEmail, generateScheduleInvoiceHtml } from '@/lib/emailService';

export async function createBooking(bookingData) {
  try {
    const {
      serviceId,
      serviceTitle,
      servicePrice,
      serviceDuration,
      serviceCategory,
      serviceImage,
      appointmentDate,
      timeSlot,
      practitioner = 'Any Available Master Practitioner',
      guestName,
      guestEmail,
      guestPhone,
      scentPreference = 'Wild Lavender & Bergamot',
      specialNotes = '',
      userId,
    } = bookingData;

    if (!userId) {
      return {
        success: false,
        message: 'Registration required: You must be registered and signed in to book a sanctuary appointment.',
      };
    }

    if (!serviceTitle || !appointmentDate || !timeSlot || !guestName || !guestEmail || !guestPhone) {
      return {
        success: false,
        message: 'Please fill in all required appointment details (Service, Date, Time, Name, Email, Phone).',
      };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const bookingCode = `LMR-${randomNum}`;

    const newBooking = {
      bookingCode,
      serviceId: serviceId || null,
      serviceTitle: serviceTitle.trim(),
      servicePrice: Number(servicePrice) || 0,
      serviceDuration: serviceDuration || '60 minutes',
      serviceCategory: serviceCategory || 'Spa Ritual',
      serviceImage: serviceImage || '',
      appointmentDate,
      timeSlot,
      practitioner,
      guestName: guestName.trim(),
      guestEmail: guestEmail.toLowerCase().trim(),
      guestPhone: guestPhone.trim(),
      scentPreference,
      specialNotes: specialNotes.trim(),
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      invoiceNumber: `INV-${bookingCode}`,
      emailNotification: {
        sent: true,
        dispatchedAt: new Date().toISOString(),
        recipient: guestEmail.toLowerCase().trim(),
      },
    };

    const result = await bookingCollection.insertOne(newBooking);
    const bookingWithId = {
      ...newBooking,
      _id: result.insertedId.toString(),
    };

    try {
      await sendBookingEmail(bookingWithId);
    } catch (emailErr) {
      console.warn('Email dispatch warning (non-blocking):', emailErr);
    }

    return {
      success: true,
      message: 'Your sanctuary reservation request has been submitted! Our concierge will review and confirm your booking.',
      bookingId: result.insertedId.toString(),
      bookingCode,
      booking: bookingWithId,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'Failed to complete booking. Please try again or contact concierge.',
    };
  }
}

export async function getUserBookings(email) {
  try {
    if (!email) {
      return { success: true, bookings: [] };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);
    const normalizedEmail = email.toLowerCase().trim();

    const bookings = await bookingCollection
      .find({
        $or: [
          { guestEmail: normalizedEmail },
          { userEmail: normalizedEmail },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    const parsed = JSON.parse(JSON.stringify(bookings));
    return {
      success: true,
      bookings: parsed,
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return {
      success: false,
      bookings: [],
      message: 'Could not fetch bookings.',
    };
  }
}

export async function getAllBookingsAdmin() {
  try {
    const bookingCollection = dbConnect(collections.BOOKINGS);
    const bookings = await bookingCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(bookings)),
    };
  } catch (error) {
    console.error('Error in getAllBookingsAdmin:', error);
    return {
      success: false,
      bookings: [],
      message: 'Failed to fetch all bookings.',
    };
  }
}

export async function confirmBookingByAdmin(bookingId) {
  try {
    if (!bookingId) {
      return { success: false, message: 'Invalid booking ID.' };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);
    let query = { _id: bookingId };
    if (ObjectId.isValid(bookingId)) {
      query = { $or: [{ _id: new ObjectId(bookingId) }, { _id: bookingId }] };
    }

    const result = await bookingCollection.updateOne(query, {
      $set: {
        status: 'confirmed',
        confirmedAt: new Date().toISOString(),
        confirmedBy: 'Sanctuary Concierge Admin',
      },
    });

    if (result.matchedCount === 0) {
      return { success: false, message: 'Booking appointment not found.' };
    }

    try {
      const updatedDoc = await bookingCollection.findOne(query);
      if (updatedDoc) {
        await sendBookingEmail(JSON.parse(JSON.stringify(updatedDoc)));
      }
    } catch (emailErr) {
      console.warn('Could not dispatch confirmation email:', emailErr);
    }

    return {
      success: true,
      message: 'Appointment successfully confirmed! Official schedule invoice dispatched to client.',
    };
  } catch (error) {
    console.error('Error confirming booking by admin:', error);
    return {
      success: false,
      message: 'Failed to confirm booking. Please try again.',
    };
  }
}

export async function cancelBooking(bookingId) {
  try {
    if (!bookingId) {
      return { success: false, message: 'Invalid booking ID.' };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);
    let query = { _id: bookingId };
    if (ObjectId.isValid(bookingId)) {
      query = { $or: [{ _id: new ObjectId(bookingId) }, { _id: bookingId }] };
    }

    const result = await bookingCollection.updateOne(query, {
      $set: {
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      },
    });

    if (result.matchedCount === 0) {
      return { success: false, message: 'Booking appointment not found.' };
    }

    return {
      success: true,
      message: 'Appointment has been cancelled successfully.',
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      message: 'Failed to cancel appointment. Please contact our front desk.',
    };
  }
}

export async function rescheduleBooking(bookingId, newDate, newTimeSlot) {
  try {
    if (!bookingId || !newDate || !newTimeSlot) {
      return { success: false, message: 'Missing booking ID, date, or time slot.' };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);
    let query = { _id: bookingId };
    if (ObjectId.isValid(bookingId)) {
      query = { $or: [{ _id: new ObjectId(bookingId) }, { _id: bookingId }] };
    }

    const result = await bookingCollection.updateOne(query, {
      $set: {
        appointmentDate: newDate,
        timeSlot: newTimeSlot,
        status: 'pending',
        rescheduledAt: new Date().toISOString(),
      },
    });

    if (result.matchedCount === 0) {
      return { success: false, message: 'Booking appointment not found.' };
    }

    try {
      const updatedDoc = await bookingCollection.findOne(query);
      if (updatedDoc) {
        await sendBookingEmail(JSON.parse(JSON.stringify(updatedDoc)));
      }
    } catch (emailErr) {
      console.warn('Could not dispatch rescheduled email:', emailErr);
    }

    return {
      success: true,
      message: 'Your appointment has been rescheduled and is pending admin confirmation. Updated receipt sent to your email.',
    };
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    return {
      success: false,
      message: 'Failed to reschedule appointment. Please try again.',
    };
  }
}

export async function sendScheduleInvoiceEmail({ bookingId, recipientEmail }) {
  try {
    if (!bookingId) {
      return { success: false, message: 'Missing booking ID.' };
    }

    const bookingCollection = dbConnect(collections.BOOKINGS);
    let query = { _id: bookingId };
    if (ObjectId.isValid(bookingId)) {
      query = { $or: [{ _id: new ObjectId(bookingId) }, { _id: bookingId }] };
    }

    const booking = await bookingCollection.findOne(query);
    if (!booking) {
      return { success: false, message: 'Booking record not found.' };
    }

    const bookingData = JSON.parse(JSON.stringify(booking));
    if (recipientEmail && recipientEmail.trim()) {
      bookingData.guestEmail = recipientEmail.toLowerCase().trim();
    }

    const result = await sendBookingEmail(bookingData);
    return result;
  } catch (error) {
    console.error('Error in sendScheduleInvoiceEmail action:', error);
    return {
      success: false,
      message: 'Failed to dispatch email. Please check server logs.',
    };
  }
}

export async function getBookingInvoice(bookingId) {
  try {
    if (!bookingId) return null;

    const bookingCollection = dbConnect(collections.BOOKINGS);
    let query = { _id: bookingId };
    if (ObjectId.isValid(bookingId)) {
      query = { $or: [{ _id: new ObjectId(bookingId) }, { _id: bookingId }] };
    }

    const booking = await bookingCollection.findOne(query);
    if (!booking) return null;

    const clean = JSON.parse(JSON.stringify(booking));
    const html = generateScheduleInvoiceHtml(clean);
    return {
      booking: clean,
      html,
    };
  } catch (error) {
    console.error('Error getting invoice:', error);
    return null;
  }
}
