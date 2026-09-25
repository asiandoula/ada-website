import type { SupabaseClient } from '@supabase/supabase-js';

// Website contact-form inquiries (table: contact_submissions).
// Shared by the admin pages, the admin PATCH route and the public /api/contact
// notifier. Keep this file free of server-only imports — the status editor
// (a client component) imports the labels from here.

export const INQUIRY_STATUSES = ['new', 'contacted', 'referred', 'spam'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  referred: 'Referred',
  spam: 'Spam',
};

export const INQUIRY_STATUS_HINTS: Record<InquiryStatus, string> = {
  new: 'Nobody has followed up yet',
  contacted: 'Someone replied or called',
  referred: 'Passed on to a doula or partner (say who in the note)',
  spam: 'Bot or junk',
};

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-green-100 text-green-800',
  referred: 'bg-blue-100 text-blue-800',
  spam: 'bg-gray-100 text-gray-600',
};

// Mirrors the <select> options in src/components/public/contact-form.tsx.
export const INQUIRY_TOPICS = [
  'Hiring a Doula',
  'Becoming a Doula',
  'Training Programs',
  'Other',
] as const;

const TOPIC_COLORS: Record<string, string> = {
  'Hiring a Doula': 'bg-rose-100 text-rose-800',
  'Becoming a Doula': 'bg-violet-100 text-violet-800',
  'Training Programs': 'bg-sky-100 text-sky-800',
  Other: 'bg-zinc-100 text-zinc-700',
};

export function topicColor(topic: string | null | undefined): string {
  return (topic && TOPIC_COLORS[topic]) || 'bg-zinc-100 text-zinc-500';
}

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return typeof value === 'string' && (INQUIRY_STATUSES as readonly string[]).includes(value);
}

export interface InquiryRow {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string;
  // Present only after migration 017 has been run.
  status?: string | null;
  note?: string | null;
  handled_at?: string | null;
  handled_by?: string | null;
}

export function statusOf(row: Pick<InquiryRow, 'status'>): InquiryStatus {
  return isInquiryStatus(row.status) ? row.status : 'new';
}

/**
 * Status tracking needs migration 017. Until it has been run, the admin pages
 * fall back to a read-only list instead of erroring. Only an "undefined
 * column" error counts as "not migrated"; anything else is left for the real
 * query to surface.
 */
export async function hasInquiryStatusColumn(supabase: SupabaseClient): Promise<boolean> {
  const { error } = await supabase.from('contact_submissions').select('status').limit(1);
  return !(error && error.code === '42703');
}

/**
 * The spam bots that hit the form fill every field with random letters
 * (e.g. name "lwlcJHLPfSxlKfsQL", phone "BhDRHIymIHTpjCusr"). Matched all 10
 * bot rows and none of the 53 real ones as of 2026-09-24. Used only to label
 * the notification email — a flagged inquiry is still saved and still sent.
 */
export function looksLikeBotSubmission(input: {
  full_name: string;
  phone: string | null;
  message: string;
}): boolean {
  const phone = (input.phone ?? '').trim();
  return (
    phone.length >= 8 &&
    !/\d/.test(phone) &&
    !/\s/.test(input.full_name.trim()) &&
    !/\s/.test(input.message.trim())
  );
}

/** "Sep 23, 2026, 12:35 AM PT" — always Pacific time, whatever the server zone. */
export function formatPT(iso: string): string {
  return (
    new Date(iso).toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }) + ' PT'
  );
}

export function timeAgo(iso: string, now: number = Date.now()): string {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}
