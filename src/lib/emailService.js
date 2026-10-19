import nodemailer from 'nodemailer';
import { collections, dbConnect } from '@/lib/dbConnect';

/**
 * Generate a luxury HTML email for appointment confirmation and schedule invoice.
 */
export function generateScheduleInvoiceHtml(booking) {
  const {
    bookingCode,
    serviceTitle,
    servicePrice,
    serviceDuration,
    serviceCategory,
    appointmentDate,
    timeSlot,
    practitioner,
    guestName,
    guestEmail,
    guestPhone,
    scentPreference,
    specialNotes,
    createdAt,
  } = booking;

  const basePrice = Number(servicePrice) || 0;
  const tax = Math.round(basePrice * 0.08);
  const total = basePrice + tax;
  const invoiceNumber = `INV-${bookingCode || '000000'}`;
  const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const issueDate = new Date(createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

    const isConfirmed = booking.status === 'confirmed';
    const statusBadgeText = isConfirmed ? 'Confirmed & Guaranteed' : 'Pending Admin Confirmation';
    const statusBadgeStyle = isConfirmed
      ? 'background: #dcfce7; color: #15803d;'
      : 'background: #fef3c7; color: #92400e;';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sanctuary Appointment Schedule & Official Invoice</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #FAF8F5;
      margin: 0;
      padding: 24px;
      color: #18181b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e4e4e7;
      box-shadow: 0 10px 25px rgba(88, 15, 65, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #580F41 0%, #7a155a 60%, #3a082b 100%);
      color: #ffffff;
      padding: 40px 32px;
      text-align: center;
    }
    .brand-title {
      font-family: Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-dot {
      color: #f43f5e;
    }
    .header-tag {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 14px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 9999px;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 600;
      color: #fecdd3;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #18181b;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .intro-text {
      font-size: 14px;
      line-height: 1.6;
      color: #52525b;
      margin-bottom: 24px;
    }
    .info-card {
      background: #FAF8F5;
      border: 1px solid #e4e4e7;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f4f4f5;
      font-size: 13px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #71717a;
      font-weight: 500;
    }
    .info-value {
      font-weight: 600;
      color: #18181b;
      text-align: right;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    .invoice-table th {
      background: #f4f4f5;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      color: #3f3f46;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .invoice-table td {
      padding: 12px;
      border-bottom: 1px solid #f4f4f5;
      color: #27272a;
    }
    .total-row {
      font-size: 15px;
      font-weight: 700;
      color: #580F41;
      border-top: 2px solid #580F41;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .instructions-box {
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-radius: 16px;
      padding: 18px;
      margin-top: 24px;
      font-size: 12px;
      line-height: 1.6;
      color: #831843;
    }
    .footer {
      background: #18181b;
      color: #a1a1aa;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer a {
      color: #f43f5e;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="brand-title">Lumiere<span class="brand-dot">.</span></h1>
      <span class="header-tag">Sanctuary Spa Studio</span>
      <h2 style="font-size: 20px; font-weight: 600; margin: 16px 0 0 0; color: #ffffff;">
        ${isConfirmed ? 'Confirmed Schedule & Official Invoice' : 'Reservation Request & Schedule Invoice'}
      </h2>
      <p style="font-size: 12px; color: #fecdd3; margin: 6px 0 0 0;">
        Reference: <strong>${bookingCode}</strong> • Invoice: <strong>${invoiceNumber}</strong>
      </p>
    </div>

    <div class="content">
      <h3 class="greeting">Dear ${guestName},</h3>
      <p class="intro-text">
        ${
          isConfirmed
            ? 'Your personalized sanctuary ritual has been officially confirmed by our concierge team. Below are your scheduled appointment details and confirmed invoice.'
            : 'Your sanctuary reservation request has been received and logged in our system. Below are your requested schedule details and itemized invoice awaiting final concierge approval.'
        }
      </p>

      <div class="info-card">
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 14px; color: #580F41;">Appointment Schedule</strong>
          <span class="status-badge" style="${statusBadgeStyle}">${statusBadgeText}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Reserved Ritual:</span>
          <span class="info-value">${serviceTitle}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Category & Duration:</span>
          <span class="info-value">${serviceCategory} • ${serviceDuration}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Appointment Date:</span>
          <span class="info-value" style="color: #580F41; font-weight: 700;">${formattedDate}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Sanctuary Time Slot:</span>
          <span class="info-value" style="color: #580F41; font-weight: 700;">${timeSlot}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Assigned Specialist:</span>
          <span class="info-value">${practitioner}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Aroma Essence:</span>
          <span class="info-value">${scentPreference || 'Wild Lavender & Bergamot'}</span>
        </div>
        ${
          specialNotes
            ? `
        <div class="info-row">
          <span class="info-label">Special Notes:</span>
          <span class="info-value">${specialNotes}</span>
        </div>`
            : ''
        }
      </div>

      <h4 style="font-size: 14px; font-weight: 700; color: #18181b; margin: 24px 0 10px 0;">
        Itemized Schedule Invoice (${invoiceNumber})
      </h4>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center;">Duration</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${serviceTitle}</strong><br>
              <span style="font-size: 11px; color: #71717a;">Organic botanicals & master therapy</span>
            </td>
            <td style="text-align: center;">${serviceDuration}</td>
            <td style="text-align: right;">$${basePrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td>
              <strong>Private Hydro-Suite Access</strong><br>
              <span style="font-size: 11px; color: #71717a;">Thermal mineral soak & cedarwood steam</span>
            </td>
            <td style="text-align: center;">15 mins</td>
            <td style="text-align: right; color: #16a34a; font-weight: 600;">Complimentary ($0)</td>
          </tr>
          <tr>
            <td>
              <strong>Welcome Herbal Elixir & Cold Compress</strong><br>
              <span style="font-size: 11px; color: #71717a;">Sanctuary arrival hospitality</span>
            </td>
            <td style="text-align: center;">—</td>
            <td style="text-align: right; color: #16a34a; font-weight: 600;">Complimentary ($0)</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; font-weight: 500; color: #71717a;">
              Sanctuary Service & State Tax (8%)
            </td>
            <td style="text-align: right; font-weight: 500;">$${tax}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2" style="text-align: right;">Total Investment:</td>
            <td style="text-align: right;">$${total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div class="instructions-box">
        <strong>Sanctuary Arrival Etiquette:</strong><br>
        • Please arrive 15 minutes prior to ${timeSlot} for your personal consultation.<br>
        • Plush Turkish cotton robes, slippers, and private lockers are provided.<br>
        • Free cancellation or rescheduling is available up to 24 hours prior to appointment.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #ffffff;">Lumiere Spa Studio</p>
      <p style="margin: 0 0 8px 0;">123 Serenity Avenue, Wellness District, NY 10001</p>
      <p style="margin: 0;">
        Concierge Inquiries: <a href="mailto:concierge@lumierespa.com">concierge@lumierespa.com</a> | +1 (555) 123-4567
      </p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Dispatch booking confirmation email and invoice.
 */
export async function sendBookingEmail(booking) {
  try {
    const { guestEmail, guestName, serviceTitle, bookingCode } = booking;
    if (!guestEmail) {
      return { success: false, message: 'No recipient email specified.' };
    }

    const htmlContent = generateScheduleInvoiceHtml(booking);

    const { transporter, isRealSmtp, emailFrom } = getMailTransporter();

    const mailOptions = {
      from: emailFrom,
      to: guestEmail,
      subject: `Confirmed Schedule & Invoice: ${serviceTitle} [Ref: ${bookingCode}]`,
      html: htmlContent,
      text: `Dear ${guestName},\n\nYour appointment for ${serviceTitle} on ${booking.appointmentDate} at ${booking.timeSlot} is confirmed.\n\nBooking Reference: ${bookingCode}\nTotal: $${(Number(booking.servicePrice) * 1.08).toFixed(0)}\n\nThank you for choosing Lumiere Spa Studio.`,
    };

    const info = await transporter.sendMail(mailOptions);

    try {
      const emailCollection = dbConnect('email_notifications');
      await emailCollection.insertOne({
        bookingId: booking._id ? String(booking._id) : null,
        bookingCode,
        recipient: guestEmail,
        subject: mailOptions.subject,
        sentAt: new Date().toISOString(),
        status: isRealSmtp ? 'sent_smtp' : 'dispatched_simulated',
        isRealSmtp,
        messageId: info.messageId || null,
      });
    } catch (dbErr) {
      console.warn('Could not record email notification in DB:', dbErr);
    }

    return {
      success: true,
      message: isRealSmtp
        ? `Invoice & schedule confirmation sent directly to ${guestEmail}!`
        : `Confirmed schedule invoice prepared and dispatched for ${guestEmail}.`,
      messageId: info.messageId,
      dispatchedTo: guestEmail,
    };
  } catch (error) {
    console.error('Error dispatching booking invoice email:', error);
    return {
      success: false,
      message: 'Failed to dispatch email. Please check contact details or front desk concierge.',
    };
  }
}

/**
 * Helper to build Nodemailer Transporter supporting Gmail and Custom SMTP.
 */
export function getMailTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailFrom = process.env.EMAIL_FROM || (smtpUser ? `"Lumiere Spa Studio" <${smtpUser}>` : '"Lumiere Spa Studio" <concierge@lumierespa.com>');

  const isConfigured =
    smtpUser &&
    smtpPass &&
    smtpUser !== 'your_email@gmail.com' &&
    smtpPass !== 'your_app_password_here';

  if (!isConfigured) {
    return {
      transporter: nodemailer.createTransport({ jsonTransport: true }),
      isRealSmtp: false,
      emailFrom,
    };
  }

  // If using Gmail, 'service: gmail' ensures optimal TLS & port handling
  if (smtpHost === 'smtp.gmail.com' || (!smtpHost && smtpUser.includes('@gmail.com'))) {
    return {
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
      isRealSmtp: true,
      emailFrom,
    };
  }

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost || 'smtp.gmail.com',
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    }),
    isRealSmtp: true,
    emailFrom,
  };
}

/**
 * General-purpose email sender (for welcome emails, notifications, etc.)
 */
export async function sendCustomEmail({ to, subject, html, text }) {
  try {
    if (!to) {
      return { success: false, message: 'Recipient email address is required.' };
    }

    const { transporter, isRealSmtp, emailFrom } = getMailTransporter();

    const mailOptions = {
      from: emailFrom,
      to,
      subject,
      html,
      text: text || '',
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: isRealSmtp ? `Email sent successfully to ${to}!` : `Simulated email dispatched to ${to}.`,
      messageId: info.messageId,
      isRealSmtp,
    };
  } catch (error) {
    console.error('Error sending custom email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email.',
    };
  }
}
