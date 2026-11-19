/**
 * One person = one doula record (2026-11-18).
 *
 * The registry had people with two or three records (different Doula IDs), so a renewal
 * landed on one record while partner agencies looked at the other. New records are
 * checked here before they are created:
 *   - same phone (last 10 digits) or same email (case-insensitive) as an existing record
 *     → blocked: use the existing record instead (the database trigger in migration 018
 *       enforces the same rule for every write path);
 *   - same name (letters only, either word order) or same native name → warning, the
 *     admin has to confirm it is a different person.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export interface DoulaLite {
  id: string;
  doula_id_code: string;
  full_name: string;
  full_name_zh: string | null;
  email: string | null;
  phone: string | null;
}

export interface DuplicateHits {
  byPhone: DoulaLite[];
  byEmail: DoulaLite[];
  byName: DoulaLite[];
}

/** Phone key: digits only, last 10 (null when shorter — not a usable number). */
export function phoneKey(v: string | null | undefined): string | null {
  const d = (v ?? '').replace(/\D/g, '').slice(-10);
  return d.length === 10 ? d : null;
}

export function emailKey(v: string | null | undefined): string | null {
  const e = (v ?? '').trim().toLowerCase();
  return e || null;
}

/** Name key: letters only, lower case ("Jing Wen" = "Jingwen" = "jing-wen"). */
export function nameKey(v: string | null | undefined): string | null {
  const n = (v ?? '').toLowerCase().replace(/[^a-z]/g, '');
  return n || null;
}

function reversedNameKey(v: string | null | undefined): string | null {
  const parts = (v ?? '').trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? nameKey([...parts].reverse().join(' ')) : null;
}

export function findDuplicatesIn(
  all: DoulaLite[],
  input: {
    phone?: string | null;
    email?: string | null;
    fullName?: string | null;
    fullNameZh?: string | null;
  },
  excludeId?: string
): DuplicateHits {
  const others = all.filter((d) => d.id !== excludeId);
  const p = phoneKey(input.phone);
  const e = emailKey(input.email);
  const names = new Set([nameKey(input.fullName), reversedNameKey(input.fullName)].filter(Boolean));
  const zh = (input.fullNameZh ?? '').trim();
  return {
    byPhone: p ? others.filter((d) => phoneKey(d.phone) === p) : [],
    byEmail: e ? others.filter((d) => emailKey(d.email) === e) : [],
    byName: others.filter(
      (d) =>
        (names.size > 0 && names.has(nameKey(d.full_name))) ||
        (!!zh && (d.full_name_zh ?? '').trim() === zh)
    ),
  };
}

export async function findDuplicateDoulas(
  supabase: SupabaseClient,
  input: Parameters<typeof findDuplicatesIn>[1],
  excludeId?: string
): Promise<DuplicateHits> {
  const { data, error } = await supabase
    .from('doulas')
    .select('id, doula_id_code, full_name, full_name_zh, email, phone');
  if (error) throw new Error(`Duplicate check failed: ${error.message}`);
  return findDuplicatesIn((data ?? []) as DoulaLite[], input, excludeId);
}

export function describeRecord(d: DoulaLite): string {
  return `${d.doula_id_code} ${d.full_name}${d.full_name_zh ? ` (${d.full_name_zh})` : ''}`;
}
