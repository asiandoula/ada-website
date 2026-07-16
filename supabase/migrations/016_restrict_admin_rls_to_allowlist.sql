-- 016_restrict_admin_rls_to_allowlist.sql
--
-- SECURITY FIX (2026-07-15). Before this migration, every admin RLS policy was
-- `FOR ALL TO authenticated USING (true)` (see 004/007/015), and doula_credentials
-- (006) had RLS disabled entirely. Because Supabase issues an `authenticated`
-- JWT to ANY confirmed user and public signup is on, an outsider could
-- self-register a Google/email account, confirm it, and read/write doula PII,
-- certificates, exam data, and credentials by calling PostgREST directly with
-- the public anon key — bypassing the Next.js admin allowlist entirely.
-- (Verified live: a fresh @gmail.com account read 3 doula PII rows via
--  GET /rest/v1/doulas.)
--
-- This migration moves the allowlist into the database: admin access now
-- requires the JWT email to be on an allowed Workspace domain. It mirrors the
-- app-layer allowlist in src/lib/auth/access.ts — keep the two domain lists in
-- sync. Public/anon policies and the SECURITY DEFINER verify_certificate()
-- function are left untouched, so the public site, doula portal (service_role),
-- and certificate verification keep working. The admin app itself talks to the
-- DB with the service_role key, which bypasses RLS, so it is unaffected.

-- Domain allowlist gate. Reads the verified email from the request JWT and
-- checks the segment after the LAST '@' against the allowed Workspace domains.
create or replace function public.is_allowed_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select lower(substring((auth.jwt() ->> 'email') from '@([^@]+)$'))
         in ('cooings.com', 'asiandoula.org');
$$;

-- 004 tables --------------------------------------------------------------
drop policy if exists "admin_all_doulas" on public.doulas;
create policy "admin_all_doulas" on public.doulas
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());

drop policy if exists "admin_all_exam_results" on public.exam_results;
create policy "admin_all_exam_results" on public.exam_results
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());

drop policy if exists "admin_all_certificates" on public.certificates;
create policy "admin_all_certificates" on public.certificates
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());

-- 006 table: RLS was never enabled — enable it and add an admin-only policy.
alter table public.doula_credentials enable row level security;
drop policy if exists "admin_all_doula_credentials" on public.doula_credentials;
create policy "admin_all_doula_credentials" on public.doula_credentials
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());

-- 007 tables (keep the public "read published" and "anyone can submit" policies)
drop policy if exists "Authenticated users can manage articles" on public.articles;
create policy "Admins can manage articles" on public.articles
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());

drop policy if exists "Authenticated users can read submissions" on public.contact_submissions;
create policy "Admins can read submissions" on public.contact_submissions
  for select to authenticated
  using (public.is_allowed_admin());

-- 015 table (keep the anon "Anyone can read exam sessions" polling policy)
drop policy if exists "Admins can manage exam sessions" on public.exam_sessions;
create policy "Admins can manage exam sessions" on public.exam_sessions
  for all to authenticated
  using (public.is_allowed_admin()) with check (public.is_allowed_admin());
