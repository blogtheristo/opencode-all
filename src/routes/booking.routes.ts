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
import emailService from '../services/email.service.js';

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

router.get('/services', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('booking_services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error fetching services', { error });
      return res.status(500).json({ error: 'Failed to fetch services' });
    }

    res.json({ services: data });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in /services', { error: errorMsg });
    res.status(500).json({ error: 'Internal server error' });
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

      res.json({
        serviceId,
        durationMinutes: service[0].duration_minutes,
        availability,
        holidays: holidays?.map((h) => h.date) || [],
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Unexpected error in /availability', { error: errorMsg });
      res.status(500).json({ error: 'Internal server error' });
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

router.post('/reserve', reserveValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();

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

    try {
      await emailService.send({
        to: customerEmail,
        template: 'booking_confirmation',
        variables: {
          customerName,
          serviceName,
          dateTime,
          durationMinutes,
          company: customerCompany || 'Ei ilmoitettu',
          notes: customerNotes || 'Ei lisätietoja',
          cancelLink: `${process.env.FRONTEND_URL || 'https://dws10.com'}/book/cancel?id=${reservationId}`,
        },
      });

      // Notify Risto
      await emailService.send({
        to: 'risto.anton@proton.me',
        template: 'booking_admin_notification',
        variables: {
          customerName,
          customerEmail,
          customerPhone,
          serviceName,
          dateTime,
          durationMinutes,
          company: customerCompany || 'Ei ilmoitettu',
          notes: customerNotes || 'Ei lisätietoja',
          adminLink: `${process.env.ADMIN_URL || 'https://dws10.com/admin'}/bookings/${reservationId}`,
        },
      });

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
      logger.error('Error sending confirmation emails', {
        reservationId,
        error: emailErr instanceof Error ? emailErr.message : 'Unknown error',
      });
      // Don't fail the request if emails don't send
    }

    res.status(201).json({
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// GET /reservations/:email — Fetch customer bookings
// ============================================================================

const emailParamValidation = [param('email').isEmail().withMessage('Valid email required')];

router.get('/reservations/:email', emailParamValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();
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

    res.json({
      email,
      count: data?.length || 0,
      reservations: data || [],
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in /reservations/:email', { error: errorMsg });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// DELETE /reservations/:id — Cancel a reservation
// ============================================================================

const idParamValidation = [param('id').isUUID().withMessage('Valid reservation ID required')];

router.delete('/reservations/:id', idParamValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const supabase = getSupabaseClient();
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
    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Unexpected error in DELETE /reservations/:id', { error: errorMsg });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
