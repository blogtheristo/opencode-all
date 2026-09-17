-- Inbound web leads — newsletter signups, free-audit requests, contact-form submissions.
-- Captured directly from the public sites (dws10.com, onelifetime.world, lifetime.fi)
-- via the Supabase anon key, mirroring the captain_inquiries pattern (034).
-- One table, distinguished by `source`, so all top-of-funnel web leads land in one place
-- for the existing CRM / outreach flows to pick up.
--
-- Anonymous users may INSERT only; authenticated (admin) users have full read/update.

CREATE TABLE IF NOT EXISTS web_leads (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  timestamptz DEFAULT now() NOT NULL,
    source      text NOT NULL CHECK (source IN ('newsletter', 'free_audit', 'contact')),
    email       text NOT NULL,
    name        text,
    company     text,
    industry    text,
    message     text,
    site        text,                       -- capturing domain, e.g. dws10.com
    page_path   text,                       -- page the lead submitted from
    locale      text,                       -- document language at capture time
    consent     boolean DEFAULT false NOT NULL,  -- GDPR: explicit opt-in recorded
    status      text DEFAULT 'new' NOT NULL
                CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'unsubscribed', 'spam')),
    metadata    jsonb DEFAULT '{}'::jsonb NOT NULL
);

-- De-dupe newsletter signups by email; speed up admin triage by recency.
CREATE UNIQUE INDEX IF NOT EXISTS web_leads_newsletter_email_uniq
    ON web_leads (lower(email)) WHERE source = 'newsletter';
CREATE INDEX IF NOT EXISTS web_leads_created_at_idx ON web_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS web_leads_status_idx ON web_leads (status);

-- RLS: insert-only for anon (public forms), full access for authenticated (admin).
-- Idempotent replay-safe (DROP IF EXISTS) so it can be re-pasted into Supabase Studio.
ALTER TABLE web_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a web lead" ON web_leads;
CREATE POLICY "Anyone can submit a web lead"
    ON web_leads FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read web leads" ON web_leads;
CREATE POLICY "Authenticated users can read web leads"
    ON web_leads FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can update web leads" ON web_leads;
CREATE POLICY "Authenticated users can update web leads"
    ON web_leads FOR UPDATE
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete web leads" ON web_leads;
CREATE POLICY "Authenticated users can delete web leads"
    ON web_leads FOR DELETE
    TO authenticated
    USING (true);
