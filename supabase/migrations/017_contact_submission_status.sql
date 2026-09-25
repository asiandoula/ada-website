-- 017_contact_submission_status.sql
--
-- Adds follow-up tracking to website contact-form inquiries so staff can work
-- them from /admin/inquiries. Additive only: existing rows get status 'new',
-- the public insert policy and the /api/contact insert are unchanged.
--
-- Run once in the Supabase SQL editor for project sztqpeebrvgualvegbxd.
-- Safe to re-run (every statement is idempotent).

alter table public.contact_submissions
  add column if not exists status text not null default 'new',
  add column if not exists note text,
  add column if not exists handled_at timestamptz,
  add column if not exists handled_by text;

alter table public.contact_submissions
  drop constraint if exists contact_submissions_status_check;
alter table public.contact_submissions
  add constraint contact_submissions_status_check
  check (status in ('new', 'contacted', 'referred', 'spam'));

create index if not exists idx_contact_submissions_status_created
  on public.contact_submissions (status, created_at desc);

-- The 10 bot submissions from Mar–May 2026 (random-letter name, phone and
-- message). Listed by id so no real inquiry can be caught by accident.
update public.contact_submissions
set status = 'spam',
    handled_at = now(),
    handled_by = 'system (017 backfill)'
where status = 'new'
  and id in (
    'a91a5a3c-2efe-4eee-8481-2263c751e70a',
    'ce117218-1aeb-47e4-ba6c-94f960042856',
    '28b1be40-c5b1-4288-96b2-b978ae3123d6',
    '0f2565ee-68d5-426b-b2d7-9b455f096189',
    '45d40857-9893-4ee5-8003-eb74f2d10944',
    '883cc2fc-92ca-49df-8620-d145891771f5',
    '22233c5a-df55-4a70-bab8-6854360a0fc0',
    '8d4d8e69-72f6-45e3-945e-ebbd93f09189',
    'e2107278-42db-449f-933e-a07897cefa56',
    'd884afac-d8ff-4c66-a8be-5d5fe4bf1c05'
  );
