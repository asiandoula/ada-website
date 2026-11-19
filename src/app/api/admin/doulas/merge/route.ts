/**
 * POST /api/admin/doulas/merge — merge a duplicate record into the record being kept.
 *
 * Body: { target_id: uuid, source_code: "#26-1234", confirm?: boolean }
 *   confirm false / missing → preview only: both records side by side (nothing changes).
 *   confirm true            → merge_doula_records (migration 019), one transaction.
 * Allowlisted admins only. The source is looked up by its own Doula ID (not through earlier
 * merges), so an already-merged ID cannot be merged again.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isAllowedAdminEmail } from '@/lib/auth/access';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

async function summary(client: ReturnType<typeof db>, id: string) {
  const [d, certs, creds, exams] = await Promise.all([
    client
      .from('doulas')
      .select('id, doula_id_code, full_name, full_name_zh, email, phone, date_of_birth, status, created_at')
      .eq('id', id)
      .maybeSingle(),
    client.from('certificates').select('certificate_type, certificate_number, status, issued_date, expiration_date').eq('doula_id', id),
    client.from('doula_credentials').select('credential_type, status, expiration_date').eq('doula_id', id),
    client.from('exam_results').select('id', { count: 'exact', head: true }).eq('doula_id', id),
  ]);
  if (d.error || certs.error || creds.error || exams.error) throw new Error('read failed');
  if (!d.data) return null;
  return { ...d.data, certificates: certs.data ?? [], credentials: creds.data ?? [], exam_results: exams.count ?? 0 };
}

export async function POST(request: NextRequest) {
  const auth = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();
  if (authError || !user || !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { target_id?: unknown; source_code?: unknown; confirm?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const targetId = typeof body.target_id === 'string' ? body.target_id : '';
  const rawCode = typeof body.source_code === 'string' ? body.source_code.trim() : '';
  const sourceCode = rawCode ? `#${rawCode.replace(/^#+/, '')}` : '';
  if (!UUID.test(targetId) || sourceCode.length < 3) {
    return NextResponse.json({ error: 'Enter the Doula ID of the record to merge.' }, { status: 400 });
  }

  const client = db();
  try {
    const src = await client.from('doulas').select('id').eq('doula_id_code', sourceCode).maybeSingle();
    if (src.error) throw new Error('read failed');
    if (!src.data) {
      return NextResponse.json({ error: `No record with Doula ID ${sourceCode}.` }, { status: 404 });
    }
    if (src.data.id === targetId) {
      return NextResponse.json({ error: 'That is this record. Enter the Doula ID of the other record.' }, { status: 400 });
    }

    if (body.confirm !== true) {
      const [keep, merge] = await Promise.all([summary(client, targetId), summary(client, src.data.id)]);
      if (!keep || !merge) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
      return NextResponse.json({ preview: { keep, merge } });
    }

    const { data, error } = await client.rpc('merge_doula_records', {
      p_target: targetId,
      p_source: src.data.id,
      p_actor: user.email ?? 'admin',
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ merged: data });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Nothing was changed.' }, { status: 500 });
  }
}
