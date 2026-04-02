import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^1(\d{10})$/, '$1');
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { doula_id_code, email, phone } = body as {
    doula_id_code?: string;
    email?: string;
    phone?: string;
  };

  if (!doula_id_code || typeof doula_id_code !== 'string' || !doula_id_code.trim()) {
    return NextResponse.json({ error: 'Doula ID Code is required.' }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json({ error: 'Email or phone number is required.' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find doula by ID code
  const { data: doula, error: doulaError } = await supabase
    .from('doulas')
    .select('*')
    .eq('doula_id_code', doula_id_code.trim())
    .single();

  if (doulaError || !doula) {
    return NextResponse.json({ error: 'Invalid credentials. Please check your ID code and try again.' }, { status: 401 });
  }

  // Verify email or phone matches
  if (email) {
    if (doula.email?.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Invalid credentials. Please check your email and try again.' }, { status: 401 });
    }
  } else if (phone) {
    const normalizedInput = normalizePhone(phone.trim());
    const normalizedStored = doula.phone ? normalizePhone(doula.phone) : '';
    if (!normalizedStored || normalizedInput !== normalizedStored) {
      return NextResponse.json({ error: 'Invalid credentials. Please check your phone number and try again.' }, { status: 401 });
    }
  }

  // Fetch credentials
  const { data: credentials } = await supabase
    .from('doula_credentials')
    .select('credential_type, status, certification_date, expiration_date')
    .eq('doula_id', doula.id)
    .order('credential_type');

  // Fetch certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select('id, certificate_number, certificate_type, issued_date, pdf_url, status, created_at')
    .eq('doula_id', doula.id)
    .order('issued_date', { ascending: false });

  // Fetch exam results
  const { data: examResults } = await supabase
    .from('exam_results')
    .select('id, exam_session, exam_type, overall_score, score_terminology, score_newborn, score_lactation, score_emergency, score_practical, score_postpartum, score_knowledge, score_ethics, passed, exam_date, voided')
    .eq('doula_id', doula.id)
    .neq('voided', true)
    .order('exam_date', { ascending: false });

  return NextResponse.json({
    doula: {
      full_name: doula.full_name,
      full_name_zh: doula.full_name_zh,
      doula_id_code: doula.doula_id_code,
      email: doula.email,
      phone: doula.phone,
      status: doula.status,
      region: doula.region,
      languages: doula.languages,
      certification_date: doula.certification_date,
      expiration_date: doula.expiration_date,
    },
    credentials: credentials || [],
    certificates: certificates || [],
    exam_results: examResults || [],
  });
}
