-- 018 One person = one doula record (2026-11-18).
--
-- Why: the registry had the same person under two or three records (different Doula IDs),
-- so renewals landed on one record while partner agencies matched the other.
-- What: a trigger on doulas that rejects a new record — or a change of phone / email on an
-- existing one — when another record already has the same phone (digits only, last 10) or
-- the same email (case-insensitive). Records that already share an email today stay
-- editable: the check only runs when phone / email is set on insert or actually changes.
-- Existing duplicates are merged record by record in the admin (after a person confirms).
-- Idempotent (create or replace / drop trigger if exists). Reversible:
--   drop trigger if exists doulas_contact_dedup on public.doulas;
--   drop function if exists public.doulas_contact_dedup();

create or replace function public.doulas_contact_dedup()
returns trigger
language plpgsql
as $$
declare
  new_phone text := nullif(right(regexp_replace(coalesce(new.phone, ''), '\D', '', 'g'), 10), '');
  old_phone text;
  new_email text := nullif(lower(trim(coalesce(new.email, ''))), '');
  old_email text;
  hit record;
begin
  if length(coalesce(new_phone, '')) < 10 then
    new_phone := null;
  end if;
  if tg_op = 'UPDATE' then
    old_phone := nullif(right(regexp_replace(coalesce(old.phone, ''), '\D', '', 'g'), 10), '');
    old_email := nullif(lower(trim(coalesce(old.email, ''))), '');
  end if;

  if new_phone is not null and new_phone is distinct from old_phone then
    select doula_id_code, full_name into hit
      from public.doulas
     where id <> new.id
       and length(regexp_replace(coalesce(phone, ''), '\D', '', 'g')) >= 10
       and right(regexp_replace(phone, '\D', '', 'g'), 10) = new_phone
     limit 1;
    if found then
      raise exception 'This phone number is already on doula record % (%). One person = one record: use that record instead, or merge the two.', hit.doula_id_code, hit.full_name
        using errcode = '23505';
    end if;
  end if;

  if new_email is not null and new_email is distinct from old_email then
    select doula_id_code, full_name into hit
      from public.doulas
     where id <> new.id
       and lower(trim(coalesce(email, ''))) = new_email
     limit 1;
    if found then
      raise exception 'This email is already on doula record % (%). One person = one record: use that record instead, or merge the two.', hit.doula_id_code, hit.full_name
        using errcode = '23505';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists doulas_contact_dedup on public.doulas;
create trigger doulas_contact_dedup
  before insert or update of phone, email on public.doulas
  for each row execute function public.doulas_contact_dedup();
