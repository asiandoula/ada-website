/**
 * POST /api/partner/doulas/lookup  Partner lookup: which ADA record is this person? (JSON)
 *
 * One person = one record, and phone / email are how a partner agency tells who is who
 * (names repeat). Body: { phone?: string, email?: string } — sent in the body, never in the
 * URL. Phone is tried first (digits only, last 10); only when no record has that phone is
 * the email tried (case-insensitive). Old Doula IDs that were merged away do not appear:
 * only live records are returned.
 *
 * Auth: `Authorization: Bearer <ADA_PARTNER_TOKEN>` (same token as /api/partner/certificates).
 *
 * Response: { matched_by: 'phone' | 'email' | null, doulas: [{ doula_id_code, full_name }] }
 *   401 { error: 'unauthorized' } · 400 { error: 'phone_or_email_required' } · 500 { error: 'lookup_failed' }
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailKey, phoneKey } from '@/lib/doula-dedup';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIN_TOKEN_LENGTH = 32;

function sha256(v: string): Buffer {
  return createHash('sha256').update(v).digest();
}

function authorized(request: NextRequest): boolean {
  const token = process.env.ADA_PARTNER_TOKEN;
  if (!token || token.length < MIN_TOKEN_LENGTH) return false;
  const header = request.headers.get('authorization') ?? '';
  if (!header.startsWith('Bearer ')) return false;
  return timingSafeEqual(sha256(header.slice('Bearer '.length)), sha256(token));
}

interface Row {
  doula_id_code: string;
  full_name: string;
  phone: string | null;
  email: string | null;
}

export async function POST(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers });
  }
  let body: { phone?: unknown; email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'phone_or_email_required' }, { status: 400, headers });
  }
  const phone = phoneKey(typeof body.phone === 'string' ? body.phone : null);
  const email = emailKey(typeof body.email === 'string' ? body.email : null);
  if (!phone && !email) {
    return NextResponse.json({ error: 'phone_or_email_required' }, { status: 400, headers });
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const out = (by: 'phone' | 'email' | null, rows: Row[]) =>
    NextResponse.json(
      { matched_by: by, doulas: rows.map((r) => ({ doula_id_code: r.doula_id_code, full_name: r.full_name })) },
      { headers }
    );

  if (phone) {
    // Stored phones are written many ways: narrow by the last 4 digits, then compare exactly.
    const { data, error } = await db
      .from('doulas')
      .select('doula_id_code, full_name, phone, email')
      .like('phone', `%${phone.slice(-4)}%`)
      .limit(50);
    if (error) return NextResponse.json({ error: 'lookup_failed' }, { status: 500, headers });
    const hits = ((data ?? []) as Row[]).filter((r) => phoneKey(r.phone) === phone);
    if (hits.length > 0) return out('phone', hits);
  }
  if (email) {
    const { data, error } = await db
      .from('doulas')
      .select('doula_id_code, full_name, phone, email')
      .ilike('email', email.replace(/[%_\\]/g, (c) => `\\${c}`))
      .limit(50);
    if (error) return NextResponse.json({ error: 'lookup_failed' }, { status: 500, headers });
    const hits = ((data ?? []) as Row[]).filter((r) => emailKey(r.email) === email);
    if (hits.length > 0) return out('email', hits);
  }
  return out(null, []);
}
