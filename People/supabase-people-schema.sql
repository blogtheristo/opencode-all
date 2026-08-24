-- ============================================
-- PEOPLE DATABASE SCHEMA FOR SUPABASE
-- Lifetime Group & DWS IQ 6 Contact Management
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PEOPLE TABLE (Main contact database)
-- ============================================

CREATE TABLE IF NOT EXISTS people (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Classification
    type TEXT NOT NULL CHECK (type IN ('internal', 'partner', 'customer', 'investor')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'prospect', 'inactive')),
    
    -- Personal Information
    first_name TEXT,
    last_name TEXT,
    full_name TEXT NOT NULL,
    title TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    linkedin_url TEXT,
    photo_url TEXT,
    
    -- Organization
    company TEXT,
    department TEXT,
    role TEXT,
    city TEXT,
    country TEXT,
    region TEXT CHECK (region IN ('Nordic', 'Central Europe', 'Global', 'Other')),
    
    -- Professional
    education TEXT,
    expertise JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    
    -- Relationship
    tags JSONB DEFAULT '[]'::jsonb,
    products JSONB DEFAULT '[]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    engagement_level TEXT CHECK (engagement_level IN ('high', 'medium', 'low')),
    last_contact_date DATE,
    next_action TEXT,
    notes TEXT,
    
    -- Business
    contract_value DECIMAL(12, 2) DEFAULT 0,
    contract_start_date DATE,
    contract_end_date DATE,
    payment_terms TEXT,
    projects JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Soft Delete
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id),
    
    -- Full Text Search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(full_name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(company, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(title, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(notes, '')), 'D')
    ) STORED
);

-- Indexes
CREATE INDEX idx_people_type ON people(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_status ON people(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_company ON people(company) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_email ON people(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_tags ON people USING GIN(tags) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_products ON people USING GIN(products) WHERE deleted_at IS NULL;
CREATE INDEX idx_people_search ON people USING GIN(search_vector);
CREATE INDEX idx_people_last_contact ON people(last_contact_date DESC) WHERE deleted_at IS NULL;

-- ============================================
-- 2. INTERACTIONS TABLE (Contact history)
-- ============================================

CREATE TABLE IF NOT EXISTS interactions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Keys
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    
    -- Interaction Details
    type TEXT NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'demo', 'contract', 'support', 'other')),
    subject TEXT NOT NULL,
    description TEXT,
    outcome TEXT,
    
    -- Scheduling
    interaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_minutes INTEGER,
    
    -- Participants
    participants JSONB DEFAULT '[]'::jsonb,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_interactions_person ON interactions(person_id);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);
CREATE INDEX idx_interactions_follow_up ON interactions(follow_up_date) WHERE follow_up_required = TRUE;

-- ============================================
-- 3. NOTES TABLE (Additional notes)
-- ============================================

CREATE TABLE IF NOT EXISTS notes (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Keys
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    
    -- Note Details
    title TEXT,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('general', 'business', 'personal', 'technical', 'confidential')),
    
    -- Privacy
    is_private BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_notes_person ON notes(person_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created ON notes(created_at DESC);

-- ============================================
-- 4. COMPANIES TABLE (Organization details)
-- ============================================

CREATE TABLE IF NOT EXISTS companies (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Company Details
    name TEXT NOT NULL UNIQUE,
    legal_name TEXT,
    website TEXT,
    industry TEXT,
    size TEXT CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
    
    -- Location
    headquarters_city TEXT,
    headquarters_country TEXT,
    region TEXT CHECK (region IN ('Nordic', 'Central Europe', 'Global', 'Other')),
    
    -- Business
    annual_revenue DECIMAL(15, 2),
    employee_count INTEGER,
    founded_year INTEGER,
    
    -- Relationship
    relationship_type TEXT CHECK (relationship_type IN ('customer', 'partner', 'investor', 'prospect', 'other')),
    relationship_status TEXT CHECK (relationship_status IN ('active', 'prospect', 'inactive')),
    
    -- Products
    products_used JSONB DEFAULT '[]'::jsonb,
    
    -- Contact
    primary_contact_id UUID REFERENCES people(id),
    
    -- Notes
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Soft Delete
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_companies_name ON companies(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_relationship ON companies(relationship_type, relationship_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_products ON companies USING GIN(products_used) WHERE deleted_at IS NULL;

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactions_updated_at BEFORE UPDATE ON interactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update last_contact_date when interaction is created
CREATE OR REPLACE FUNCTION update_last_contact_date()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE people
    SET last_contact_date = NEW.interaction_date::date
    WHERE id = NEW.person_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_person_last_contact AFTER INSERT ON interactions
    FOR EACH ROW EXECUTE FUNCTION update_last_contact_date();

-- ============================================
-- 6. VIEWS
-- ============================================

-- Active Contacts View
CREATE OR REPLACE VIEW active_contacts AS
SELECT 
    p.*,
    c.name as company_name,
    c.industry as company_industry,
    COUNT(DISTINCT i.id) as interaction_count,
    MAX(i.interaction_date) as last_interaction_date
FROM people p
LEFT JOIN companies c ON p.company = c.name
LEFT JOIN interactions i ON p.id = i.person_id
WHERE p.deleted_at IS NULL
    AND p.status = 'active'
GROUP BY p.id, c.name, c.industry;

-- Customer Contacts View
CREATE OR REPLACE VIEW customer_contacts AS
SELECT 
    p.*,
    c.name as company_name,
    c.relationship_status,
    c.products_used,
    p.contract_value,
    p.contract_start_date,
    p.contract_end_date
FROM people p
LEFT JOIN companies c ON p.company = c.name
WHERE p.deleted_at IS NULL
    AND p.type = 'customer'
ORDER BY p.contract_value DESC;

-- Investor Contacts View
CREATE OR REPLACE VIEW investor_contacts AS
SELECT 
    p.*,
    c.name as company_name,
    c.annual_revenue,
    c.employee_count
FROM people p
LEFT JOIN companies c ON p.company = c.name
WHERE p.deleted_at IS NULL
    AND p.type = 'investor'
ORDER BY p.engagement_level DESC, p.last_contact_date DESC;

-- Follow-up Required View
CREATE OR REPLACE VIEW follow_up_required AS
SELECT 
    p.full_name,
    p.company,
    p.email,
    i.subject,
    i.follow_up_date,
    i.follow_up_notes,
    i.interaction_date as last_interaction
FROM interactions i
JOIN people p ON i.person_id = p.id
WHERE i.follow_up_required = TRUE
    AND i.follow_up_date IS NOT NULL
    AND p.deleted_at IS NULL
ORDER BY i.follow_up_date ASC;

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policies for people table
CREATE POLICY "Users can view all active people"
    ON people FOR SELECT
    USING (deleted_at IS NULL);

CREATE POLICY "Users can insert people"
    ON people FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update people"
    ON people FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete people"
    ON people FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for interactions table
CREATE POLICY "Users can view all interactions"
    ON interactions FOR SELECT
    USING (true);

CREATE POLICY "Users can insert interactions"
    ON interactions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their interactions"
    ON interactions FOR UPDATE
    USING (created_by = auth.uid());

-- Policies for notes table
CREATE POLICY "Users can view non-private notes"
    ON notes FOR SELECT
    USING (is_private = FALSE OR created_by = auth.uid());

CREATE POLICY "Users can insert notes"
    ON notes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their notes"
    ON notes FOR UPDATE
    USING (created_by = auth.uid());

-- Policies for companies table
CREATE POLICY "Users can view all active companies"
    ON companies FOR SELECT
    USING (deleted_at IS NULL);

CREATE POLICY "Users can insert companies"
    ON companies FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update companies"
    ON companies FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ============================================
-- 8. SAMPLE DATA
-- ============================================

-- Insert Risto (Founder & CEO)
INSERT INTO people (
    id,
    type,
    status,
    full_name,
    title,
    email,
    company,
    role,
    country,
    region,
    education,
    expertise,
    languages,
    tags,
    products,
    interests,
    engagement_level,
    last_contact_date,
    notes
) VALUES (
    uuid_generate_v4(),
    'internal',
    'active',
    'Risto',
    'Founder & CEO',
    'risto@lifetime.group',
    'Lifetime Group',
    'Founder & CEO',
    'Finland',
    'Nordic',
    'M.Sc. (Tech), Industrial Management',
    '["Industrial Management", "AI & Machine Learning", "Software Architecture", "Construction Technology", "Carbon Reporting", "Product Strategy", "Enterprise Sales"]'::jsonb,
    '["Finnish", "English", "Swedish"]'::jsonb,
    '["internal", "founder", "ceo", "leadership", "ai-director", "firehorse", "dws-iq", "construction", "infrastructure", "carbon-reporting", "fit-for-55", "nordic", "active", "vip"]'::jsonb,
    '["firehorse", "dws-iq"]'::jsonb,
    '["Carbon reporting and sustainability", "Construction digitalization", "European market expansion", "AI-powered analytics", "Mobile-first solutions"]'::jsonb,
    'high',
    CURRENT_DATE,
    'Founder & CEO of Lifetime Group. AI Director for Firehorse Products. Deep expertise in construction tech, carbon reporting (EN 15978), and European standards. Leading DWS IQ 6 platform development with focus on SPI/CPI, safety, and Fit for 55 compliance.'
);

-- Insert Lifetime Group company
INSERT INTO companies (
    name,
    legal_name,
    website,
    industry,
    headquarters_country,
    region,
    relationship_type,
    relationship_status,
    products_used,
    notes
) VALUES (
    'Lifetime Group',
    'Lifetime Group Oy',
    'https://lifetime.group',
    'Construction Technology',
    'Finland',
    'Nordic',
    'other',
    'active',
    '["firehorse", "dws-iq"]'::jsonb,
    'Parent company. Develops DWS IQ 6 platform and Firehorse products for construction and infrastructure portfolio management.'
);

-- ============================================
-- 9. FUNCTIONS
-- ============================================

-- Search people by name or company
CREATE OR REPLACE FUNCTION search_people(search_query TEXT)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    company TEXT,
    title TEXT,
    email TEXT,
    type TEXT,
    status TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.company,
        p.title,
        p.email,
        p.type,
        p.status,
        ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as rank
    FROM people p
    WHERE p.search_vector @@ plainto_tsquery('english', search_query)
        AND p.deleted_at IS NULL
    ORDER BY rank DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Get contact summary
CREATE OR REPLACE FUNCTION get_contact_summary()
RETURNS TABLE (
    type TEXT,
    status TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.type,
        p.status,
        COUNT(*) as count
    FROM people p
    WHERE p.deleted_at IS NULL
    GROUP BY p.type, p.status
    ORDER BY p.type, p.status;
END;
$$ LANGUAGE plpgsql;

-- Get upcoming follow-ups
CREATE OR REPLACE FUNCTION get_upcoming_follow_ups(days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
    person_name TEXT,
    company TEXT,
    email TEXT,
    follow_up_date DATE,
    follow_up_notes TEXT,
    days_until INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.full_name,
        p.company,
        p.email,
        i.follow_up_date,
        i.follow_up_notes,
        (i.follow_up_date - CURRENT_DATE) as days_until
    FROM interactions i
    JOIN people p ON i.person_id = p.id
    WHERE i.follow_up_required = TRUE
        AND i.follow_up_date IS NOT NULL
        AND i.follow_up_date <= CURRENT_DATE + days_ahead
        AND p.deleted_at IS NULL
    ORDER BY i.follow_up_date ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. COMMENTS
-- ============================================

COMMENT ON TABLE people IS 'Main contact database for internal team, partners, customers, and investors';
COMMENT ON TABLE interactions IS 'History of all interactions with contacts';
COMMENT ON TABLE notes IS 'Additional notes and observations about contacts';
COMMENT ON TABLE companies IS 'Organization details for companies';

COMMENT ON COLUMN people.type IS 'Contact type: internal, partner, customer, investor';
COMMENT ON COLUMN people.status IS 'Relationship status: active, prospect, inactive';
COMMENT ON COLUMN people.engagement_level IS 'Level of engagement: high, medium, low';
COMMENT ON COLUMN people.search_vector IS 'Full-text search vector for fast searching';

-- ============================================
-- END OF SCHEMA
-- ============================================
