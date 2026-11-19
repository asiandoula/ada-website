/**
 * GET /api/partner/certificates?number=ADA-PD-2026-0397  Partner certificate lookup (JSON).
 *
 * The public /api/verify/search deliberately leaves out PDF links and internal IDs
 * (2026-11 redesign). Partner agencies that keep ADA certificates on file for their
 * doulas (for example, a records system that syncs renewed certificates every hour)
 * still need the official PDF, so this server-to-server route returns it for one known
 * certificate number.
 *
 * Auth: `Authorization: Bearer <ADA_PARTNER_TOKEN>` (env, at least 32 characters).
 * Without the env var the route is closed for everyone.
 *
 * Response: { certificate: { certificate_number, certificate_type, issued_date,
 *   expiration_date, status, revoked_at, pdf_url, doula: { full_name, doula_id_code } } }
 *   401 { error: 'unauthorized' } · 400 { error: 'number_required' }
 *   404 { error: 'not_found' } · 500 { error: 'lookup_failed' }
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIN_TOKEN_LENGTH = 32;
const NUMBER_PATTERN = /^[A-Za-z0-9#-]{3,40}$/;

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

interface CertificateRow {
  certificate_number: string;
  certificate_type: string;
  issued_date: string | null;
  expiration_date: string | null;
  status: string | null;
  revoked_at: string | null;
  pdf_url: string | null;
  doulas: { full_name: string | null; doula_id_code: string | null } | null;
}

export async function GET(request: NextRequest) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers });
  }
  const number = (request.nextUrl.searchParams.get('number') ?? '').trim();
  if (!number || !NUMBER_PATTERN.test(number)) {
    return NextResponse.json({ error: 'number_required' }, { status: 400, headers });
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await db
    .from('certificates')
    .select(
      'certificate_number, certificate_type, issued_date, expiration_date, status, revoked_at, pdf_url, doulas(full_name, doula_id_code)'
    )
    .eq('certificate_number', number)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('[partner/certificates]', error.message);
    return NextResponse.json({ error: 'lookup_failed' }, { status: 500, headers });
  }
  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404, headers });
  }

  const row = data as unknown as CertificateRow;
  return NextResponse.json(
    {
      certificate: {
        certificate_number: row.certificate_number,
        certificate_type: row.certificate_type,
        issued_date: row.issued_date,
        expiration_date: row.expiration_date,
        status: row.status,
        revoked_at: row.revoked_at,
        pdf_url: row.pdf_url,
        doula: {
          full_name: row.doulas?.full_name ?? null,
          doula_id_code: row.doulas?.doula_id_code ?? null,
        },
      },
    },
    { headers }
  );
}
