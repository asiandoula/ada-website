import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('session_code', code)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const body = await request.json();
  const { action, ...fields } = body;

  if (action === 'create') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert({
        session_code: fields.session_code,
        exam_type: fields.exam_type || 'postpartum',
        location: fields.location,
        scheduled_date: fields.scheduled_date,
        duration_minutes: fields.duration_minutes || 60,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  if (action === 'start') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .update({
        status: 'active',
        exam_part: fields.exam_part,
        started_at: new Date().toISOString(),
      })
      .eq('id', fields.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  if (action === 'end') {
    const { data, error } = await supabase
      .from('exam_sessions')
      .update({ status: 'completed' })
      .eq('id', fields.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
