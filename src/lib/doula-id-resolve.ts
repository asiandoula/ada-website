/**
 * Look up a doula by Doula ID — including an old ID that was merged into another record
 * (migration 019, doula_merges). Issued certificate PDFs, partner systems and people's own
 * notes keep the old ID, so it has to keep working on the record page, in Doula ID search,
 * at portal sign-in and on the exam pages.
 *
 * Server side only (service-role client): doula_merges has row level security with no
 * policies.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export async function doulaByIdCode<T = Record<string, unknown>>(
  client: SupabaseClient,
  code: string,
  columns: string
): Promise<{ data: T | null; error: { message: string } | null; mergedFrom: string | null }> {
  const direct = await client.from('doulas').select(columns).eq('doula_id_code', code).maybeSingle();
  if (direct.error) return { data: null, error: direct.error, mergedFrom: null };
  if (direct.data) return { data: direct.data as T, error: null, mergedFrom: null };

  const merge = await client
    .from('doula_merges')
    .select('target_doula_id')
    .eq('source_doula_id_code', code)
    .maybeSingle();
  if (merge.error || !merge.data) return { data: null, error: merge.error ?? null, mergedFrom: null };

  const target = await client
    .from('doulas')
    .select(columns)
    .eq('id', (merge.data as { target_doula_id: string }).target_doula_id)
    .maybeSingle();
  if (target.error) return { data: null, error: target.error, mergedFrom: null };
  return { data: (target.data as T | null) ?? null, error: null, mergedFrom: target.data ? code : null };
}
