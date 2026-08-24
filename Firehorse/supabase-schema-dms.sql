-- ============================================================================
-- Firehorse Content DMS - Supabase Schema
-- Supports document upload, versioning, tagging, and access control
-- ============================================================================

create extension if not exists "uuid-ossp";

-- --------------------------------------------------------------------------
-- Helper enumerations
-- --------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_category') then
    create type public.document_category as enum (
      'standard_template',
      'project_contract',
      'compliance_report',
      'safety_document',
      'carbon_report',
      'custom'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'document_status') then
    create type public.document_status as enum (
      'draft',
      'in_review',
      'approved',
      'archived'
    );
  end if;
end $$;

-- --------------------------------------------------------------------------
-- document_folders: logical organization per org/project
-- --------------------------------------------------------------------------

create table if not exists public.document_folders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null,
  project_id uuid,
  parent_id uuid references public.document_folders(id) on delete cascade,
  name text not null,
  path text generated always as (
    coalesce(parent_id::text || '/', '') || name
  ) stored,
  created_by uuid not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_document_folders_org on public.document_folders(organization_id);
create index if not exists idx_document_folders_project on public.document_folders(project_id);

-- --------------------------------------------------------------------------
-- documents: top-level metadata
-- --------------------------------------------------------------------------

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null,
  project_id uuid,
  folder_id uuid references public.document_folders(id) on delete set null,
  title text not null,
  description text,
  category document_category not null default 'custom',
  standard_code text,        -- e.g. EN 15978, RT 10-11224
  language text default 'en',
  status document_status not null default 'draft',
  current_version_id uuid,
  storage_path text not null, -- supabase storage path for current version
  file_type text not null,
  file_size_bytes bigint not null,
  checksum text,
  created_by uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint fk_documents_current_version
    foreign key (current_version_id) references public.document_versions(id)
    deferrable initially deferred
);

create index if not exists idx_documents_org on public.documents(organization_id);
create index if not exists idx_documents_project on public.documents(project_id);
create index if not exists idx_documents_standard on public.documents(standard_code);

-- --------------------------------------------------------------------------
-- document_versions: immutable records of uploads
-- --------------------------------------------------------------------------

create table if not exists public.document_versions (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null,
  storage_path text not null,
  preview_path text,         -- generated PDF/image preview
  file_type text not null,
  file_size_bytes bigint not null,
  checksum text,
  change_log text,
  uploaded_by uuid not null,
  uploaded_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create unique index if not exists uq_document_versions_number
  on public.document_versions(document_id, version_number);

-- --------------------------------------------------------------------------
-- document_tags and mapping table
-- --------------------------------------------------------------------------

create table if not exists public.document_tags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null,
  name text not null,
  color text default '#3b82f6',
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, lower(name))
);

create table if not exists public.document_tag_map (
  document_id uuid not null references public.documents(id) on delete cascade,
  tag_id uuid not null references public.document_tags(id) on delete cascade,
  primary key (document_id, tag_id)
);

-- --------------------------------------------------------------------------
-- document_access_logs: auditing & compliance
-- --------------------------------------------------------------------------

create table if not exists public.document_access_logs (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null,
  access_type text not null, -- view, download, upload, delete
  user_agent text,
  remote_ip inet,
  accessed_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_access_logs_document on public.document_access_logs(document_id);
create index if not exists idx_access_logs_user on public.document_access_logs(user_id);

-- --------------------------------------------------------------------------
-- Views for dashboard summaries
-- --------------------------------------------------------------------------

create or replace view public.v_document_summary as
select
  d.organization_id,
  d.project_id,
  d.category,
  count(*) as total_documents,
  count(distinct d.standard_code) filter (where d.standard_code is not null) as standards_covered,
  sum(d.file_size_bytes) as total_storage_bytes
from public.documents d
group by 1, 2, 3;

create or replace view public.v_recent_documents as
select
  d.id,
  d.title,
  d.category,
  dv.version_number,
  dv.uploaded_at,
  dv.uploaded_by,
  d.project_id,
  d.organization_id
from public.document_versions dv
join public.documents d on d.id = dv.document_id
order by dv.uploaded_at desc
limit 200;

-- --------------------------------------------------------------------------
-- Row-Level Security (scaffolding - enable after connecting auth)
-- --------------------------------------------------------------------------

alter table public.document_folders enable row level security;
alter table public.documents enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_tags enable row level security;
alter table public.document_tag_map enable row level security;
alter table public.document_access_logs enable row level security;

-- Policies should be created per-tenant after linking auth.users
-- Example:
-- create policy "documents_org_access"
--   on public.documents for select
--   using (organization_id = auth.uid()); -- placeholder - replace with org membership lookup

