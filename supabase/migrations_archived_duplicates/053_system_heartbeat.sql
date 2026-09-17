-- System heartbeat table — prevents Supabase from pausing due to inactivity.
-- Single row, upserted daily by morning briefing cron job.

CREATE TABLE IF NOT EXISTS system_heartbeat (
    id          text PRIMARY KEY DEFAULT 'dws6',
    last_beat   timestamptz NOT NULL DEFAULT now(),
    source      text NOT NULL DEFAULT 'morning-briefing',
    version     text
);

ALTER TABLE system_heartbeat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only"
    ON system_heartbeat
    USING (auth.role() = 'service_role');
