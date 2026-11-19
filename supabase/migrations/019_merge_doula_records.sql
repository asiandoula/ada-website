-- 019 Merge two records of the same person (2026-11-18).
--
-- Why: the registry has people under two or three records (different Doula IDs). An admin
-- who has checked that two records are the same person merges one into the other.
-- What:
--   * doula_merges — one row per merged-away record: its old Doula ID keeps resolving to the
--     record it was merged into (record page, Doula ID search, portal sign-in, exam pages).
--   * merge_doula_records(target, source, actor) — one transaction: moves certificates,
--     exam results and email logs to the target; one credential per type (an active one
--     wins over a lapsed one, then the later end date; first certification date kept);
--     one current certificate per type (older active ones become superseded, same rule as
--     migration 014); blank target fields filled from the source; source deleted.
--     Refuses when either record has a revoked / suspended credential (resolve that first).
-- Service role only (the admin API checks the signed-in admin, then calls it).
-- Idempotent. Reversible for the schema (drop function / table); a merge itself is undone by
-- hand from doula_merges.snapshot.

create table if not exists public.doula_merges (
  id uuid primary key default gen_random_uuid(),
  source_doula_id_code text not null unique,
  source_full_name text,
  target_doula_id uuid not null references public.doulas(id) on delete cascade,
  merged_by text,
  merged_at timestamptz not null default now(),
  snapshot jsonb not null default '{}'::jsonb
);
alter table public.doula_merges enable row level security;

create or replace function public.merge_doula_records(p_target uuid, p_source uuid, p_actor text)
returns jsonb
language plpgsql
as $$
declare
  t public.doulas;
  s public.doulas;
  sc public.doula_credentials;
  tc public.doula_credentials;
  snap jsonb;
  n_certs int;
  n_exams int;
  n_creds int;
begin
  if p_target is null or p_source is null or p_target = p_source then
    raise exception 'Pick two different records.';
  end if;
  select * into t from public.doulas where id = p_target for update;
  if not found then raise exception 'The record to keep was not found.'; end if;
  select * into s from public.doulas where id = p_source for update;
  if not found then raise exception 'The record to merge was not found.'; end if;

  if exists (
    select 1 from public.doula_credentials
     where doula_id in (p_target, p_source) and status in ('revoked', 'suspended')
  ) then
    raise exception 'One of the two records has a revoked or suspended credential. Resolve that before merging.';
  end if;

  snap := jsonb_build_object(
    'source', to_jsonb(s),
    'target_before', to_jsonb(t),
    'source_credentials', (select coalesce(jsonb_agg(to_jsonb(c)), '[]'::jsonb) from public.doula_credentials c where c.doula_id = p_source),
    'source_certificates', (select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'certificate_number', c.certificate_number, 'status', c.status)), '[]'::jsonb) from public.certificates c where c.doula_id = p_source),
    'source_exam_results', (select coalesce(jsonb_agg(e.id), '[]'::jsonb) from public.exam_results e where e.doula_id = p_source)
  );

  update public.certificates set doula_id = p_target, updated_at = now() where doula_id = p_source;
  get diagnostics n_certs = row_count;
  update public.exam_results set doula_id = p_target, updated_at = now() where doula_id = p_source;
  get diagnostics n_exams = row_count;
  update public.email_logs set doula_id = p_target where doula_id = p_source;

  n_creds := 0;
  for sc in select * from public.doula_credentials where doula_id = p_source loop
    select * into tc from public.doula_credentials where doula_id = p_target and credential_type = sc.credential_type;
    if not found then
      update public.doula_credentials set doula_id = p_target, updated_at = now() where id = sc.id;
    else
      update public.doula_credentials set
        status = case
          when sc.status = 'active' and tc.status <> 'active' then sc.status
          when sc.status = tc.status and coalesce(sc.expiration_date, 'infinity'::date) > coalesce(tc.expiration_date, 'infinity'::date) then sc.status
          else tc.status end,
        expiration_date = case
          when sc.status = 'active' and tc.status <> 'active' then sc.expiration_date
          when tc.status = 'active' and sc.status <> 'active' then tc.expiration_date
          when tc.expiration_date is null or sc.expiration_date is null then null
          else greatest(tc.expiration_date, sc.expiration_date) end,
        certification_date = least(coalesce(tc.certification_date, sc.certification_date), coalesce(sc.certification_date, tc.certification_date)),
        updated_at = now()
      where id = tc.id;
      delete from public.doula_credentials where id = sc.id;
    end if;
    n_creds := n_creds + 1;
  end loop;

  with ranked as (
    select id, row_number() over (partition by certificate_type order by issued_date desc nulls last, created_at desc) as rn
      from public.certificates
     where doula_id = p_target and status = 'active'
  )
  update public.certificates set status = 'superseded', updated_at = now()
   where id in (select id from ranked where rn > 1);

  -- Contact details move with the person: clear the source first (the one-person-one-record
  -- trigger would otherwise see the same phone / email on two records), then fill target blanks.
  update public.doulas set phone = null, email = null where id = p_source;
  update public.doulas set
    phone = coalesce(nullif(trim(t.phone), ''), s.phone),
    email = coalesce(nullif(trim(t.email), ''), s.email),
    full_name_zh = coalesce(nullif(trim(t.full_name_zh), ''), s.full_name_zh),
    date_of_birth = coalesce(t.date_of_birth, s.date_of_birth),
    region = coalesce(nullif(trim(t.region), ''), s.region),
    training_provider = coalesce(nullif(trim(t.training_provider), ''), s.training_provider),
    photo_url = coalesce(nullif(trim(t.photo_url), ''), s.photo_url),
    bio = coalesce(nullif(trim(t.bio), ''), s.bio),
    languages = coalesce(t.languages, s.languages),
    certification_date = least(coalesce(t.certification_date, s.certification_date), coalesce(s.certification_date, t.certification_date)),
    expiration_date = greatest(t.expiration_date, s.expiration_date)
  where id = p_target;

  insert into public.doula_merges (source_doula_id_code, source_full_name, target_doula_id, merged_by, snapshot)
  values (s.doula_id_code, s.full_name, p_target, p_actor, snap);
  -- Records merged into the source earlier now resolve to the target.
  update public.doula_merges set target_doula_id = p_target where target_doula_id = p_source;

  delete from public.doulas where id = p_source;

  return jsonb_build_object(
    'kept', t.doula_id_code,
    'merged', s.doula_id_code,
    'certificates_moved', n_certs,
    'exam_results_moved', n_exams,
    'credentials_merged', n_creds
  );
end;
$$;

revoke all on function public.merge_doula_records(uuid, uuid, text) from public, anon, authenticated;
