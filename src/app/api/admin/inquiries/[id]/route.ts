import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isAllowedAdminEmail } from '@/lib/auth/access';
import { isInquiryStatus } from '@/lib/inquiries';

// Update an inquiry's follow-up status and/or internal note.
// Middleware only guards /admin pages, so this route checks the caller itself.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOTE_MAX = 4000;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid inquiry id.' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!isInquiryStatus(body.status)) {
      return NextResponse.json({ error: 'Unknown status.' }, { status: 400 });
    }
    update.status = body.status;
  }

  if (body.note !== undefined) {
    if (body.note !== null && typeof body.note !== 'string') {
      return NextResponse.json({ error: 'Note must be text.' }, { status: 400 });
    }
    const note = (body.note ?? '').trim();
    if (note.length > NOTE_MAX) {
      return NextResponse.json({ error: `Note is too long (max ${NOTE_MAX} characters).` }, { status: 400 });
    }
    update.note = note || null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  update.handled_at = new Date().toISOString();
  update.handled_by = user.email;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await admin
    .from('contact_submissions')
    .update(update)
    .eq('id', id)
    .select('id, status, note, handled_at, handled_by')
    .maybeSingle();

  if (error) {
    // 42703 / PGRST204 = the status columns do not exist yet (migration 017 not run).
    if (error.code === '42703' || error.code === 'PGRST204') {
      return NextResponse.json(
        { error: 'Status tracking is not switched on yet: the database update (migration 017) still needs to be run.' },
        { status: 409 }
      );
    }
    console.error('Inquiry update failed:', id, error);
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
  }

  return NextResponse.json({ inquiry: data });
}
