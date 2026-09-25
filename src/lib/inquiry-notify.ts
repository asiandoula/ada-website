import { Resend } from 'resend';
import { formatPT, looksLikeBotSubmission } from '@/lib/inquiries';

// Server-only: emails staff when someone submits the website contact form.
//
// Recipients: ADA_INQUIRY_NOTIFY_TO (comma-separated) if set in Vercel,
// otherwise the public contact inbox. Reply-To is the person who wrote in, so
// staff can answer straight from their mail client.

const DEFAULT_NOTIFY_TO = ['contact@asiandoula.org'];
const FROM = 'ADA Website <certification@asiandoula.org>';
const ADMIN_INQUIRIES_URL = 'https://www.asiandoula.org/admin/inquiries';
const SEND_TIMEOUT_MS = 5000;
const EMAIL_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

export interface InquiryForNotify {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string;
}

function notifyRecipients(): string[] {
  const fromEnv = (process.env.ADA_INQUIRY_NOTIFY_TO ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => EMAIL_RE.test(s));
  return fromEnv.length > 0 ? fromEnv : DEFAULT_NOTIFY_TO;
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function oneLine(value: string, max: number): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

export function buildInquiryNotification(inquiry: InquiryForNotify): {
  subject: string;
  html: string;
  text: string;
} {
  const likelySpam = looksLikeBotSubmission(inquiry);
  const name = oneLine(inquiry.full_name, 80);
  const topic = inquiry.topic ? oneLine(inquiry.topic, 60) : 'No topic';
  const received = formatPT(inquiry.created_at);
  const adminUrl = `${ADMIN_INQUIRIES_URL}/${inquiry.id}`;
  const phone = inquiry.phone?.trim() || '—';

  const subject = `${likelySpam ? '[Likely spam] ' : ''}New website inquiry · ${topic} · ${name}`;

  const row = (label: string, valueHtml: string) => `
    <tr>
      <td style="padding: 6px 12px 6px 0; color: #6b7280; font-size: 13px; vertical-align: top; white-space: nowrap;">${label}</td>
      <td style="padding: 6px 0; font-size: 14px; color: #1a1a1a;">${valueHtml}</td>
    </tr>`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.5;">
      ${likelySpam ? '<p style="margin: 0 0 16px; padding: 8px 12px; background: #f4f4f5; color: #52525b; font-size: 13px; border-radius: 6px;">This looks like a bot submission (random letters in every field). It is saved in the admin in case it is real.</p>' : ''}
      <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">New message from the asiandoula.org contact form</p>
      <h2 style="margin: 0 0 16px; font-size: 20px;">${esc(topic)} — ${esc(name)}</h2>
      <table style="border-collapse: collapse; margin-bottom: 16px;">
        ${row('Name', esc(name))}
        ${row('Email', `<a href="mailto:${esc(inquiry.email)}" style="color: #7c3aed;">${esc(inquiry.email)}</a>`)}
        ${row('Phone', esc(phone))}
        ${row('Topic', esc(topic))}
        ${row('Received', esc(received))}
      </table>
      <div style="background: #f8f7ff; border: 1px solid #e5e1f5; border-radius: 8px; padding: 16px; margin-bottom: 20px; white-space: pre-wrap; font-size: 14px;">${esc(inquiry.message)}</div>
      <p style="margin: 0 0 24px;">
        <a href="${adminUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Open in ADA Admin</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Reply to this email to answer ${esc(name)} directly. Then mark it Contacted in the admin so the team knows it is handled.</p>
    </div>`;

  const text = [
    likelySpam ? '[Looks like a bot submission — saved in the admin in case it is real]\n' : '',
    `New message from the asiandoula.org contact form`,
    ``,
    `Name: ${name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${phone}`,
    `Topic: ${topic}`,
    `Received: ${received}`,
    ``,
    inquiry.message,
    ``,
    `Open in ADA Admin: ${adminUrl}`,
    `Reply to this email to answer ${name} directly.`,
  ].join('\n');

  return { subject, html, text };
}

/**
 * Never throws. The inquiry is already saved when this runs, so a failed or
 * slow email must not turn a successful submission into an error for the
 * visitor — it is logged and the row is still visible in the admin.
 */
export async function sendInquiryNotification(
  inquiry: InquiryForNotify
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY is not set' };
  }

  const { subject, html, text } = buildInquiryNotification(inquiry);
  const replyTo = EMAIL_RE.test(inquiry.email.trim()) ? inquiry.email.trim() : undefined;
  const resend = new Resend(process.env.RESEND_API_KEY);

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${SEND_TIMEOUT_MS}ms`)), SEND_TIMEOUT_MS);
  });

  try {
    const { data, error } = await Promise.race([
      resend.emails.send({ from: FROM, to: notifyRecipients(), replyTo, subject, html, text }),
      timeout,
    ]);
    if (error || !data) {
      return { ok: false, error: error?.message ?? 'no response from Resend' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
