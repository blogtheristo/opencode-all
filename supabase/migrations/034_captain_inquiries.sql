-- Captain Seat Inquiry form submissions
-- Accepts inserts from anonymous users (public form on /captain/)
-- Only authenticated users (admin) can read/update/delete

CREATE TABLE IF NOT EXISTS captain_inquiries (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  timestamptz DEFAULT now() NOT NULL,
    name        text NOT NULL,
    email       text NOT NULL,
    industry    text NOT NULL,
    seat_level  text NOT NULL CHECK (seat_level IN ('platinum', 'deputy')),
    message     text,
    status      text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed'))
);

-- RLS: insert-only for anon, full access for authenticated
ALTER TABLE captain_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
    ON captain_inquiries FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "Authenticated users can read inquiries"
    ON captain_inquiries FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update inquiries"
    ON captain_inquiries FOR UPDATE
    TO authenticated
    USING (true);
