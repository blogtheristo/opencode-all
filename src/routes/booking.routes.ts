/**
 * Booking Calendar Routes
 *
 * REST endpoints for the DWS IQ 6 booking system.
 * Supports Demo (30min) and Consultation (2h) bookings.
 *
 * Endpoints:
 *   GET  /api/v1/booking/services              — List all service types
 *   GET  /api/v1/booking/availability/:svcId  — Available slots (next 60 days)
 *   POST /api/v1/booking/reserve              — Create a new reservation
 *   GET  /api/v1/booking/reservations/:email  — Fetch customer bookings
 *   DELETE /api/v1/booking/reservations/:id   — Cancel reservation
 */

import { type Request, type Response, Router } from 'express';
import { body, param, validationResult, query } from 'express-validator';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { sendEmail } from '../utils/send-email.js';
import {
  bookingAdminNotificationTemplate,
  bookingConfirmationTemplate,
} from '../services/email-templates.js';

const router = Router();

// ============================================================================
// VALIDATION & ERROR HANDLING
// ============================================================================

function handleValidationErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return true;
  }
  return false;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a date is a Finnish holiday
 */
async function isFinnishHoliday(date: Date): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const supabase = getSupabaseClient();
  if (!supabase) {
    logger.error('Supabase unavailable in isFinnishHoliday');
    return false;
  }
  const { data, error } = await supabase
    .from('finnish_holidays')
    .select('id')
    .eq('date', dateStr)
    .eq('is_public_holiday', true)
    .limit(1);

  if (error) {
    logger.error('Error checking holiday', { dateStr, error });
    return false;
  }

  return data && data.length > 0;
}

/**
 * Get available time slots for a service on a given date
 */
async function getAvailableSlotsForDate(
  serviceId: string,
  dateStr: string, // YYYY-MM-DD
  durationMinutes: number,
): Promise<string[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    logger.error('Supabase unavailable in getAvailableSlotsForDate');
    return [];
  }
  const date = new Date(dateStr + 'T00:00:00Z');
  const dayOfWeek = date.getUTCDay(); // 0=Sunday, 6=Saturday

  // Check if holiday (skip if so)
  if (await isFinnishHoliday(date)) {
    return [];
  }

  // Get availability for this day of week
  const { data: availability, error: availError } = await supabase
    .from('booking_availability')
    .select('start_time, end_time')
    .eq('service_id', serviceId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true);

  if (availError || !availability || availability.length === 0) {
    logger.warn('No availability for day', { serviceId, dayOfWeek });
    return [];
  }

  // Check for date overrides (holidays might have custom hours or be closed)
  const { data: dateOverride } = await supabase
    .from('booking_availability')
    .select('start_time, end_time, is_available')
    .eq('service_id', serviceId)
    .eq('date_override', dateStr)
    .limit(1);

  let startTime: string;
  let endTime: string;

  if (dateOverride && dateOverride.length > 0 && !dateOverride[0].is_available) {
    return []; // Closed on this date
  }

  if (dateOverride && dateOverride.length > 0) {
    startTime = dateOverride[0].start_time;
    endTime = dateOverride[0].end_time;
  } else {
    startTime = availability[0].start_time;
    endTime = availability[0].end_time;
  }

  // Get booked slots for this service on the requested date only
  const dayStartIso = `${dateStr}T00:00:00.000Z`;
  const nextDay = new Date(`${dateStr}T00:00:00.000Z`);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  const dayEndIso = nextDay.toISOString();

  const { data: bookedSlots, error: bookedError } = await supabase
    .from('v_booked_slots')
    .select('slot_start, slot_end')
    .eq('service_id', serviceId)
    .gte('slot_start', dayStartIso)
    .lt('slot_start', dayEndIso);

  if (bookedError) {
    logger.error('Error fetching booked slots', { bookedError });
    return [];
  }

  // Generate 30-minute slots and filter out booked ones
  const slots: string[] = [];
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const toTimeString = (minutes: number) => {
    const hh = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mm = (minutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  let currentMinutes = toMinutes(startTime);
  const dayEndMinutes = toMinutes(endTime);

  while (currentMinutes + durationMinutes <= dayEndMinutes) {
    const timeStr = toTimeString(currentMinutes);
    const slotStart = new Date(`${dateStr}T${timeStr}:00.000Z`);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

    // Check if slot conflicts with any booking
    const hasConflict = bookedSlots?.some((booked) => {
      const bookedStart = new Date(booked.slot_start);
      const bookedEnd = new Date(booked.slot_end);
      return slotStart < bookedEnd && slotEnd > bookedStart;
    });

    if (!hasConflict) {
      slots.push(timeStr);
    }

    currentMinutes += 30; // Next 30-min slot
  }

  return slots;
}

// ============================================================================
// GET /services — List all booking services
// ============================================================================

router.get('/services', async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const { data, error } = await supabase
      .from('booking_services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching services', { error });
      return res.status(500).json({ error: 'Failed to fetch services' });
    }

    return res.json({ services: data });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in /services', { error: errorMsg });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// GET /availability/:serviceId — List available slots
// ============================================================================

const availabilityValidation = [
  param('serviceId').isUUID().withMessage('Valid service ID required'),
  query('startDate').optional().isISO8601().withMessage('Start date must be ISO 8601 format'),
  query('endDate').optional().isISO8601().withMessage('End date must be ISO 8601 format'),
];

router.get(
  '/availability/:serviceId',
  availabilityValidation,
  async (req: Request, res: Response) => {
    if (handleValidationErrors(req, res)) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(503).json({ error: 'Database unavailable' });
    }
    const { serviceId } = req.params;
    let { startDate, endDate } = req.query;

    try {
      // Get service details
      const { data: service, error: svcError } = await supabase
        .from('booking_services')
        .select('duration_minutes')
        .eq('id', serviceId)
        .limit(1);

      if (svcError || !service || service.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      // Default: next 60 days
      if (!startDate) {
        const today = new Date();
        startDate = today.toISOString().split('T')[0];
      }
      if (!endDate) {
        const sixtyDaysOut = new Date();
        sixtyDaysOut.setDate(sixtyDaysOut.getDate() + 60);
        endDate = sixtyDaysOut.toISOString().split('T')[0];
      }

      // Generate available slots for each day
      const availability: Record<string, string[]> = {};
      const current = new Date(startDate + 'T00:00:00Z');
      const end = new Date(endDate + 'T23:59:59Z');

      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        const slots = await getAvailableSlotsForDate(
          serviceId,
          dateStr,
          service[0].duration_minutes,
        );
        if (slots.length > 0) {
          availability[dateStr] = slots;
        }
        current.setDate(current.getDate() + 1);
      }

      // Return holidays too (for date picker disable list)
      const { data: holidays } = await supabase
        .from('finnish_holidays')
        .select('date')
        .gte('date', startDate)
        .lte('date', endDate);

      return res.json({
        serviceId,
        durationMinutes: service[0].duration_minutes,
        availability,
        holidays: holidays?.map((h) => h.date) || [],
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Unexpected error in /availability', { error: errorMsg });
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

// ============================================================================
// POST /reserve — Create a new reservation
// ============================================================================

const reserveValidation = [
  body('serviceId').isUUID().withMessage('Valid service ID required'),
  body('customerName').isString().trim().notEmpty().withMessage('Name is required'),
  body('customerEmail').isEmail().withMessage('Valid email required'),
  body('customerPhone').isString().trim().notEmpty().withMessage('Phone is required'),
  body('customerCompany').optional().isString().trim(),
  body('customerNotes').optional().isString().trim(),
  body('reservedAt').isISO8601().withMessage('Reservation time must be ISO 8601 format'),
];

const meetInviteValidation = [
  body('requesterEmail').optional().isEmail().withMessage('Requester email must be valid'),
  body('roomName').isString().trim().notEmpty().withMessage('Room name is required'),
  body('directUrl').isURL().withMessage('Direct meeting URL must be valid'),
  body('shareUrl').isURL().withMessage('Share URL must be valid'),
  body('dateStr').optional().isString().trim(),
];

router.post('/meet-invite', meetInviteValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const { requesterEmail, roomName, directUrl, shareUrl, dateStr } = req.body as {
    requesterEmail?: string;
    roomName: string;
    directUrl: string;
    shareUrl: string;
    dateStr?: string;
  };

  const subject = `Meeting request — ${roomName}`;
  const bodyLines = [
    'Meeting request from dws6.com/meet',
    '',
    requesterEmail ? `Requester email: ${requesterEmail}` : 'Requester email: Not provided',
    dateStr ? `When: ${dateStr}` : '',
    `Room: ${roomName}`,
    '',
    'Requested join link:',
    directUrl,
    '',
    'Firehorse Meeting page:',
    shareUrl,
  ].filter(Boolean);
  const text = bodyLines.join('\n');
  const html = `<pre style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; white-space: pre-wrap;">${text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')}</pre>`;

  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: process.env.BOOKING_ADMIN_EMAIL || 'risto@onelifetime.world',
    subject,
    text,
    html,
    source: 'platform',
    templateType: 'meet_invite_request',
    metadata: {
      requesterEmail: requesterEmail || null,
      roomName,
      directUrl,
      shareUrl,
      dateStr: dateStr || null,
    },
  });

  if (!result.ok) {
    logger.error('Meet invite request email failed', {
      error: result.error,
      roomName,
      requesterEmail: requesterEmail || null,
    });
    return res.status(502).json({ error: result.error || 'Failed to send invite request' });
  }

  return res.status(201).json({ success: true, message: 'Invite request sent' });
});

router.post('/reserve', reserveValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ error: 'Database unavailable' });
  }

  const {
    serviceId,
    customerName,
    customerEmail,
    customerPhone,
    customerCompany,
    customerNotes,
    reservedAt,
  } = req.body;

  try {
    // Fetch service to get duration
    const { data: service, error: svcError } = await supabase
      .from('booking_services')
      .select('duration_minutes, name')
      .eq('id', serviceId)
      .limit(1);

    if (svcError || !service || service.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const durationMinutes = service[0].duration_minutes;
    const serviceName = service[0].name;

    // Check for conflicts
    const slotStart = new Date(reservedAt);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

    const { data: conflicts } = await supabase
      .from('v_booked_slots')
      .select('slot_start, slot_end')
      .eq('service_id', serviceId);

    const hasConflict = conflicts?.some((booked) => {
      const bookedStart = new Date(booked.slot_start);
      const bookedEnd = new Date(booked.slot_end);
      return slotStart < bookedEnd && slotEnd > bookedStart;
    });

    if (hasConflict) {
      return res.status(409).json({ error: 'Slot already booked. Please choose another time.' });
    }

    // Insert reservation
    const { data: reservation, error: insertError } = await supabase
      .from('booking_reservations')
      .insert([
        {
          service_id: serviceId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_company: customerCompany || null,
          customer_notes: customerNotes || null,
          reserved_at: reservedAt,
          duration_minutes: durationMinutes,
          status: 'confirmed',
        },
      ])
      .select();

    if (insertError) {
      logger.error('Error creating reservation', { insertError });
      return res.status(500).json({ error: 'Failed to create reservation' });
    }

    // Send confirmation emails
    const reservationId = reservation?.[0]?.id;
    const dateTime = new Date(reservedAt).toLocaleString('fi-FI');
    const jitsiRoomName = `dws6-booking-${reservationId}`;
    const encodedRoomName = encodeURIComponent(jitsiRoomName);
    const jitsiMeetLinkTemplate =
      process.env.JITSI_MEET_LINK_TEMPLATE || 'https://dws6.com/meet/#room={room}';
    const jitsiMeetLink = jitsiMeetLinkTemplate.replace('{room}', encodedRoomName);

    try {
      const customerEmailResult = await sendEmail({
        from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
        to: customerEmail,
        subject: 'Varaus vahvistettu — Risto Anton Päärni',
        html: bookingConfirmationTemplate({
          customerName,
          serviceName,
          dateTime,
          durationMinutes,
          company: customerCompany || 'Ei ilmoitettu',
          notes: customerNotes || 'Ei lisätietoja',
          cancelLink: `${process.env.FRONTEND_URL || 'https://dws10.com'}/book/cancel?id=${reservationId}`,
          meetLink: jitsiMeetLink,
        }),
        source: 'platform',
        templateType: 'booking_confirmation',
        metadata: {
          reservationId,
          serviceId,
          customerEmail,
          serviceName,
          meetLink: jitsiMeetLink,
        },
      });
      if (!customerEmailResult.ok) {
        throw new Error(
          `Customer booking confirmation delivery failed: ${customerEmailResult.error || 'Unknown sendEmail failure'}`,
        );
      }

      const adminEmailResult = await sendEmail({
        from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
        to: process.env.BOOKING_ADMIN_EMAIL || 'risto@lifetime.fi',
        subject: `Uusi varaus — ${serviceName || 'Demo/Konsultaatio'}`,
        html: bookingAdminNotificationTemplate({
          customerName,
          customerEmail,
          customerPhone,
          serviceName,
          dateTime,
          durationMinutes,
          company: customerCompany || 'Ei ilmoitettu',
          notes: customerNotes || 'Ei lisätietoja',
          adminLink: `${process.env.ADMIN_URL || 'https://dws10.com/admin'}/bookings/${reservationId}`,
          meetLink: jitsiMeetLink,
        }),
        source: 'platform',
        templateType: 'booking_admin_notification',
        metadata: {
          reservationId,
          serviceId,
          customerEmail,
          serviceName,
          meetLink: jitsiMeetLink,
        },
      });
      if (!adminEmailResult.ok) {
        throw new Error(
          `Admin booking notification delivery failed: ${adminEmailResult.error || 'Unknown sendEmail failure'}`,
        );
      }

      // Update email sent timestamp
      await supabase
        .from('booking_reservations')
        .update({
          confirmation_sent_at: new Date().toISOString(),
          risto_notified_at: new Date().toISOString(),
        })
        .eq('id', reservationId);

      logger.info('Booking confirmation emails sent', {
        reservationId,
        customerEmail,
        serviceName,
      });
    } catch (emailErr) {
      const errorMessage = emailErr instanceof Error ? emailErr.message : 'Unknown error';
      logger.error('Error sending confirmation emails', {
        reservationId,
        error: errorMessage,
      });
      return res.status(502).json({
        error: 'Reservation saved, but confirmation email delivery failed.',
        reservationId,
      });
    }

    return res.status(201).json({
      success: true,
      reservationId,
      message: 'Reservation confirmed. Check your email for details.',
      booking: {
        id: reservationId,
        service: serviceName,
        dateTime,
        durationMinutes,
        customerEmail,
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in /reserve', { error: errorMsg });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// GET /reservations/:email — Fetch customer bookings
// ============================================================================

const emailParamValidation = [param('email').isEmail().withMessage('Valid email required')];

router.get('/reservations/:email', emailParamValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ error: 'Database unavailable' });
  }
  const { email } = req.params;

  try {
    const { data, error } = await supabase
      .from('booking_reservations')
      .select('*, booking_services(name)')
      .eq('customer_email', email)
      .order('reserved_at', { ascending: false });

    if (error) {
      logger.error('Error fetching reservations', { email, error });
      return res.status(500).json({ error: 'Failed to fetch reservations' });
    }

    return res.json({
      email,
      count: data?.length || 0,
      reservations: data || [],
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in /reservations/:email', { error: errorMsg });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// DELETE /reservations/:id — Cancel a reservation
// ============================================================================

const idParamValidation = [param('id').isUUID().withMessage('Valid reservation ID required')];

router.delete('/reservations/:id', idParamValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(503).json({ error: 'Database unavailable' });
  }
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('booking_reservations')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      logger.error('Error cancelling reservation', { id, error });
      return res.status(500).json({ error: 'Failed to cancel reservation' });
    }

    logger.info('Reservation cancelled', { id });
    return res.json({ success: true, message: 'Reservation cancelled' });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in DELETE /reservations/:id', { error: errorMsg });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
