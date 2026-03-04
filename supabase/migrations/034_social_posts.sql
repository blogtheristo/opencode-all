-- Social Scheduler: LinkedIn post queue
-- Used by src/social-scheduler/ for the draft → approve → publish pipeline.

CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'linkedin' CHECK (platform IN ('linkedin', 'twitter')),
  category TEXT NOT NULL CHECK (category IN ('thought_leadership', 'product_update', 'compliance_news', 'case_study', 'webinar_promo', 'hiring')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'published', 'rejected')),
  content TEXT NOT NULL,
  image_url TEXT,
  scheduled_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'manual',
  approval_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for queue operations (fetch pending/approved posts)
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts (status, scheduled_at);

-- RLS: service key only (no public access)
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service key full access" ON social_posts
  FOR ALL USING (auth.role() = 'service_role');
