/**
 * Smart Factory — automatic call booking.
 *
 * When a prospect replies positively (or the pipeline detects a booking
 * intent), this module reserves a real slot in the existing DWS booking
 * system (booking_reservations, migration 064) against the campaign's
 * booking service (Demo 30 min by default), marks the prospect
 * call_booked and logs a smart_factory_messages row for the audit trail.
 */

import logger from '../utils/logger.js';
import { restFetch } from './supabase.js';

export interface BookingResult {
  ok: boolean;
  reservationId?: string;
  reservedAt?: string;
  error?: string;
}

interface BookingService {
  id: string;
  name: string;
  duration_minutes: number;
}

interface BookingReservation {
  id: string;
  reserved_at: string;
  duration_minutes: number;
}

/** Find the booking service to reserve against (default: first demo service). */
async function findBookingService(serviceId?: string): Promise<BookingService | null> {
  try {
    const path = serviceId
      ? `booking_services?id=eq.${serviceId}&limit=1`
      : `booking_services?order=duration_minutes.asc&limit=1`;
    const rows = await restFetch<BookingService[]>(path);
    return rows[0] || null;
  } catch (err) {
    // Booking tables may not exist yet in fresh environments — degrade loudly but non-fatally.
    logger.warn('smart-factory: booking_services unavailable', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Find the next free slot for a service: walk availability windows from now,
 * skipping slots already taken (v_booked_slots) and weekends.
 */
export async function findNextFreeSlot(
  service: BookingService,
  fromDate = new Date(),
): Promise<string | null> {
  const rows = await restFetch<Array<{ slot_start: string }>>('v_booked_slots?service_id=eq.' + service.id).catch(
    () => [] as Array<{ slot_start: string }>,
  );
  const taken = new Set(rows.map((r) => r.slot_start));

  const start = new Date(fromDate.getTime() + 24 * 60 * 60 * 1000); // earliest: tomorrow
  start.setUTCHours(9, 0, 0, 0);

  for (let day = 0; day < 14; day++) {
    const candidate = new Date(start.getTime() + day * 24 * 60 * 60 * 1000);
    const dow = candidate.getUTCDay();
    if (dow === 0 || dow === 6) continue; // weekend

    for (const hour of [9, 11, 13, 15]) {
      const slot = new Date(candidate);
      slot.setUTCHours(hour);
      if (slot <= fromDate) continue;
      if (taken.has(slot.toISOString())) continue;
      return slot.toISOString();
    }
  }
  return null;
}

/**
 * Book a call for a prospect.
 * Inserts into booking_reservations (status=confirmed), marks the prospect
 * call_booked, and writes an audit message row on channel=email.
 */
export async function bookCall(opts: {
  campaignId: string;
  prospectId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  notes?: string;
  bookingServiceId?: string;
}): Promise<BookingResult> {
  const service = await findBookingService(opts.bookingServiceId);
  if (!service) {
    return { ok: false, error: 'no booking service configured' };
  }

  let slot: string;
  try {
    const found = await findNextFreeSlot(service);
    if (!found) return { ok: false, error: 'no free slot within 14 days' };
    slot = found;
  } catch (err) {
    return { ok: false, error: `slot search failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  let reservation: BookingReservation | undefined;
  try {
    const rows = await restFetch<BookingReservation[]>('booking_reservations', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        service_id: service.id,
        customer_name: opts.customerName,
        customer_email: opts.customerEmail,
        customer_phone: opts.customerPhone || '',
        customer_company: opts.customerCompany || null,
        customer_notes: opts.notes || 'Smart Factory outreach — booked automatically',
        reserved_at: slot,
        duration_minutes: service.duration_minutes,
        status: 'confirmed',
      }),
    });
    reservation = rows[0];
  } catch (err) {
    return { ok: false, error: `reservation insert failed: ${err instanceof Error ? err.message : String(err)}` };
  }
  if (!reservation) return { ok: false, error: 'reservation insert returned no row' };

  try {
    await restFetch(`smart_factory_prospects?id=eq.${opts.prospectId}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        status: 'call_booked',
        updated_at: new Date().toISOString(),
      }),
    });
    await restFetch('smart_factory_messages', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        campaign_id: opts.campaignId,
        prospect_id: opts.prospectId,
        channel: 'email',
        subject: `Call booked — ${service.name}`,
        body: `Reserved ${reservation.reserved_at} (${service.duration_minutes} min)`,
        status: 'sent',
        sent_at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    logger.warn('smart-factory: booked call but audit update failed', {
      prospectId: opts.prospectId,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  logger.info('smart-factory: call booked', {
    prospectId: opts.prospectId,
    reservationId: reservation.id,
    reservedAt: reservation.reserved_at,
  });

  return { ok: true, reservationId: reservation.id, reservedAt: reservation.reserved_at };
}
