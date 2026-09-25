import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendInquiryNotification } from '@/lib/inquiry-notify';

// In-memory rate limiter: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { full_name, email, message, phone, topic } = body as {
    full_name?: string;
    email?: string;
    message?: string;
    phone?: string;
    topic?: string;
  };

  // Validation
  if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  // Use anon key — RLS allows public insert
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Id generated here (not by the DB) so the notification email can link to
  // the admin page — the anon key can insert but cannot read the row back.
  const inquiry = {
    id: randomUUID(),
    full_name: full_name.trim(),
    phone: phone?.toString().trim() || null,
    email: email.trim(),
    topic: topic?.toString().trim() || null,
    message: message.trim(),
  };

  const { error } = await supabase.from('contact_submissions').insert(inquiry);

  if (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }

  // The inquiry is saved; the staff email is best-effort and never fails the request.
  const notified = await sendInquiryNotification({ ...inquiry, created_at: new Date().toISOString() });
  if (!notified.ok) {
    console.error('Contact notification email failed:', inquiry.id, notified.error);
  }

  return NextResponse.json({ success: true });
}
