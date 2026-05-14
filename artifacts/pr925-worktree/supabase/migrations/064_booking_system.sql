-- Booking System Migration
-- Purpose: Create booking calendar infrastructure for lead capture (Demo, Consultation)
-- Tables: booking_services, booking_availability, booking_reservations, finnish_holidays
-- Views: v_booked_slots (conflict detection)
-- RLS: Public read on services/holidays; insert/select on reservations

BEGIN;

-- Service types (Demo 30min, Konsultaatio 2h)
CREATE TABLE IF NOT EXISTS booking_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes int NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Availability calendar (recurring weekly + holiday overrides)
CREATE TABLE IF NOT EXISTS booking_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
  day_of_week int,                       -- 0=Sunday, 1=Monday, ..., 6=Saturday; NULL for date_override
  date_override date,                    -- For holidays/special dates
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,     -- false = closed on this day
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dow CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  CONSTRAINT valid_availability CHECK (start_time < end_time)
);

-- Booked reservations
CREATE TABLE IF NOT EXISTS booking_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES booking_services(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_company text,
  customer_notes text,
  reserved_at timestamptz NOT NULL,     -- Booked slot start time
  duration_minutes int NOT NULL,        -- Cached from service for safety
  status text DEFAULT 'confirmed',       -- confirmed, cancelled, completed
  confirmation_sent_at timestamptz,
  risto_notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('confirmed', 'cancelled', 'completed'))
);

-- Finnish holidays (fixed dates for 2026-2030)
CREATE TABLE IF NOT EXISTS finnish_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  name text NOT NULL,
  is_public_holiday boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Conflict detection view: all currently booked slots
CREATE OR REPLACE VIEW v_booked_slots AS
  SELECT
    service_id,
    reserved_at AS slot_start,
    reserved_at + (duration_minutes || ' minutes')::interval AS slot_end
  FROM booking_reservations
  WHERE status = 'confirmed';

-- RLS Policies
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE finnish_holidays ENABLE ROW LEVEL SECURITY;

-- Public read: services, availability, holidays (no auth required)
CREATE POLICY "services_public_read" ON booking_services
  FOR SELECT USING (true);

CREATE POLICY "availability_public_read" ON booking_availability
  FOR SELECT USING (true);

CREATE POLICY "holidays_public_read" ON finnish_holidays
  FOR SELECT USING (true);

-- Reservations: anon/authenticated can insert; service_role full access
CREATE POLICY "reservations_insert_anon" ON booking_reservations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "reservations_select_self" ON booking_reservations
  FOR SELECT USING (
    auth.role() = 'service_role'
    OR auth.role() = 'authenticated'
    OR customer_email = current_user
  );

CREATE POLICY "reservations_service_role_all" ON booking_reservations
  FOR ALL USING (auth.role() = 'service_role');

-- Seed data: Service definitions
INSERT INTO booking_services (name, duration_minutes, description)
VALUES
  ('Demo', 30, 'Lyhyt esittely DWS:n ratkaisuista'),
  ('Konsultaatio', 120, 'Syvempi konsultaatio ja tarpeiden määritys')
ON CONFLICT DO NOTHING;

-- Seed data: Availability (Mon-Fri, 9-17, both services)
-- Day of week: 1=Monday, 5=Friday
INSERT INTO booking_availability (service_id, day_of_week, start_time, end_time, is_available)
SELECT bs.id, dow, '09:00'::time, '17:00'::time, true
FROM booking_services bs
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS dow_vals(dow)
ON CONFLICT DO NOTHING;

-- Seed data: Finnish holidays 2026-2030
INSERT INTO finnish_holidays (date, name, is_public_holiday)
VALUES
  ('2026-01-01', 'Uusivuodenpäivä', true),
  ('2026-01-06', 'Loppiainen', true),
  ('2026-04-10', 'Pitkäperjantai', true),
  ('2026-04-12', 'Pääsiäispäivä', true),
  ('2026-04-13', 'Toinen pääsiäispäivä', true),
  ('2026-05-01', 'Vapun päivä', true),
  ('2026-05-14', 'Ascension Day', true),
  ('2026-06-19', 'Juhannuspäivä', true),
  ('2026-06-20', 'Juhannusaatto', false),
  ('2026-11-01', 'Pyhäinpäivä', false),
  ('2026-12-06', 'Itsenäisyyspäivä', true),
  ('2026-12-24', 'Jouluaatto', false),
  ('2026-12-25', 'Joulupäivä', true),
  ('2026-12-26', 'Tapaninpäivä', true),
  ('2027-01-01', 'Uusivuodenpäivä', true),
  ('2027-01-06', 'Loppiainen', true),
  ('2027-04-02', 'Pitkäperjantai', true),
  ('2027-04-04', 'Pääsiäispäivä', true),
  ('2027-04-05', 'Toinen pääsiäispäivä', true),
  ('2027-05-01', 'Vapun päivä', true),
  ('2027-05-13', 'Ascension Day', true),
  ('2027-06-19', 'Juhannuspäivä', true),
  ('2027-06-21', 'Juhannusaatto', false),
  ('2027-11-01', 'Pyhäinpäivä', false),
  ('2027-12-06', 'Itsenäisyyspäivä', true),
  ('2027-12-24', 'Jouluaatto', false),
  ('2027-12-25', 'Joulupäivä', true),
  ('2027-12-26', 'Tapaninpäivä', true),
  ('2028-01-01', 'Uusivuodenpäivä', true),
  ('2028-01-06', 'Loppiainen', true),
  ('2028-04-14', 'Pitkäperjantai', true),
  ('2028-04-16', 'Pääsiäispäivä', true),
  ('2028-04-17', 'Toinen pääsiäispäivä', true),
  ('2028-05-01', 'Vapun päivä', true),
  ('2028-05-25', 'Ascension Day', true),
  ('2028-06-19', 'Juhannuspäivä', true),
  ('2028-06-23', 'Juhannusaatto', false),
  ('2028-11-01', 'Pyhäinpäivä', false),
  ('2028-12-06', 'Itsenäisyyspäivä', true),
  ('2028-12-24', 'Jouluaatto', false),
  ('2028-12-25', 'Joulupäivä', true),
  ('2028-12-26', 'Tapaninpäivä', true),
  ('2029-01-01', 'Uusivuodenpäivä', true),
  ('2029-01-06', 'Loppiainen', true),
  ('2029-03-30', 'Pitkäperjantai', true),
  ('2029-04-01', 'Pääsiäispäivä', true),
  ('2029-04-02', 'Toinen pääsiäispäivä', true),
  ('2029-05-01', 'Vapun päivä', true),
  ('2029-05-10', 'Ascension Day', true),
  ('2029-06-19', 'Juhannuspäivä', true),
  ('2029-06-22', 'Juhannusaatto', false),
  ('2029-11-01', 'Pyhäinpäivä', false),
  ('2029-12-06', 'Itsenäisyyspäivä', true),
  ('2029-12-24', 'Jouluaatto', false),
  ('2029-12-25', 'Joulupäivä', true),
  ('2029-12-26', 'Tapaninpäivä', true),
  ('2030-01-01', 'Uusivuodenpäivä', true),
  ('2030-01-06', 'Loppiainen', true),
  ('2030-04-19', 'Pitkäperjantai', true),
  ('2030-04-21', 'Pääsiäispäivä', true),
  ('2030-04-22', 'Toinen pääsiäispäivä', true),
  ('2030-05-01', 'Vapun päivä', true),
  ('2030-05-30', 'Ascension Day', true),
  ('2030-06-19', 'Juhannuspäivä', true),
  ('2030-06-21', 'Juhannusaatto', false),
  ('2030-11-01', 'Pyhäinpäivä', false),
  ('2030-12-06', 'Itsenäisyyspäivä', true),
  ('2030-12-24', 'Jouluaatto', false),
  ('2030-12-25', 'Joulupäivä', true),
  ('2030-12-26', 'Tapaninpäivä', true)
ON CONFLICT DO NOTHING;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_booking_reservations_service_id
  ON booking_reservations(service_id);

CREATE INDEX IF NOT EXISTS idx_booking_reservations_customer_email
  ON booking_reservations(customer_email);

CREATE INDEX IF NOT EXISTS idx_booking_reservations_reserved_at
  ON booking_reservations(reserved_at);

CREATE INDEX IF NOT EXISTS idx_booking_reservations_status
  ON booking_reservations(status);

CREATE INDEX IF NOT EXISTS idx_finnish_holidays_date
  ON finnish_holidays(date);

COMMIT;
