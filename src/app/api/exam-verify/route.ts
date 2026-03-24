import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// In-memory rate limiter: doula_id_code -> { count, resetAt }
// NOTE: This is per-instance and resets on cold start. Provides best-effort
// protection only. For production hardening, move to Supabase or Vercel KV.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { doula_id_code, full_name } = body as {
    doula_id_code?: string;
    full_name?: string;
  };

  if (!doula_id_code || typeof doula_id_code !== 'string' || !doula_id_code.trim()) {
    return NextResponse.json({ error: 'Exam ID is required.' }, { status: 400 });
  }

  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  }

  const trimmedCode = doula_id_code.trim();
  const trimmedName = full_name.trim();

  // Rate limit by doula_id_code
  if (!checkRateLimit(trimmedCode)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  // Look up doula by doula_id_code
  const supabase = getSupabase();
  const { data: doula, error } = await supabase
    .from('doulas')
    .select('id, doula_id_code, full_name')
    .eq('doula_id_code', trimmedCode)
    .single();

  if (error || !doula) {
    return NextResponse.json(
      { error: 'Exam record not found.' },
      { status: 404 }
    );
  }

  // Case-insensitive name match
  if (doula.full_name.toLowerCase() !== trimmedName.toLowerCase()) {
    return NextResponse.json(
      { error: 'Name does not match our records.' },
      { status: 401 }
    );
  }

  // Set cookie and return success
  const response = NextResponse.json({ success: true });
  response.cookies.set('exam_token', trimmedCode, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1800, // 30 minutes
    path: '/',
  });

  return response;
}
