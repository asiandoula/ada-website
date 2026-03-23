# Email Notification System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add admin-triggered email notifications for exam results and certificate issuance via Resend API, with send tracking and history.

**Architecture:** Resend API sends 3 email types (exam pass, exam fail, certificate). A single `/api/email/send` POST endpoint handles all types in batch. Email status is tracked via `email_sent_at` on records + `email_logs` table for full audit trail. UI integrates inline send prompts after existing actions.

**Tech Stack:** Next.js 14, Resend SDK, Supabase (existing), Tailwind + shadcn/ui (existing)

**Spec:** `docs/superpowers/specs/2026-03-23-email-notification-system.md`

**Working directory:** `/Users/sixumeng/Cooings-Brain/Projects/ada--website-rebuild/repo`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/email.ts` | Resend client init, 3 email template functions, `sendEmails()` batch function |
| `src/app/api/email/send/route.ts` | POST endpoint: auth check, calls `sendEmails()`, logs to DB, returns results |
| `src/components/admin/email-send-dialog.tsx` | Reusable dialog: shows doula list with checkboxes, sends batch, shows results |
| `src/app/admin/(authenticated)/emails/page.tsx` | Server component: queries `email_logs`, renders paginated/filterable table |
| `src/components/admin/sidebar.tsx` | Add "Emails" nav item (modify existing) |
| `src/app/admin/(authenticated)/exams/record/page.tsx` | Add `.select()` on insert, add `email` to doulas query, wire email dialog (modify existing) |
| `src/app/admin/(authenticated)/doulas/[id]/page.tsx` | Add email status indicators + resend buttons on exam/cert tables, wire email dialog on Grant Cert (modify existing) |

---

### Task 1: Install Resend + Create Email Library

**Files:**
- Modify: `package.json`
- Create: `src/lib/email.ts`

- [ ] **Step 1: Install resend**

```bash
npm install resend
```

- [ ] **Step 2: Create `src/lib/email.ts`**

This file contains:
1. Resend client initialization
2. Three HTML email template functions
3. A `sendEmail()` function that sends one email via Resend

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'certification@asiandoula.org';
const FROM_NAME = 'Asian Doula Alliance';
const PORTAL_URL = 'https://www.asiandoula.org/portal';

function baseTemplate(content: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="border-bottom: 3px solid #7c3aed; padding: 20px 0; margin-bottom: 24px;">
        <img src="https://www.asiandoula.org/ada-logo.svg" alt="ADA" style="height: 40px;" />
      </div>
      ${content}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
        <p>Warm regards,</p>
        <p><strong>Certification &amp; Standards</strong><br/>Asian Doula Alliance</p>
      </div>
    </div>
  `;
}

export function examPassTemplate(doulaName: string): { subject: string; html: string } {
  return {
    subject: 'Congratulations on Passing the ADA Postpartum Doula Exam',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>On behalf of our certification team, <strong>congratulations on successfully passing the ADA Postpartum Doula Exam</strong>. This result reflects your knowledge, practical readiness, and commitment to excellence in postpartum care.</p>
      <p>You can view your detailed exam results by logging into your Doula Portal:</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Results</a>
      </p>
      <p>Your official ADA certification will be issued separately. If you have any questions, feel free to contact us.</p>
    `),
  };
}

export function examFailTemplate(doulaName: string): { subject: string; html: string } {
  return {
    subject: 'ADA Postpartum Doula Exam Results',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>Thank you for taking the ADA Postpartum Doula Exam. We appreciate your dedication and commitment to advancing your knowledge of postpartum care.</p>
      <p>After careful evaluation, the required passing score was not achieved at this time. However, we commend your efforts and encourage you to review your detailed results, which outline your scores across key assessment areas.</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Results</a>
      </p>
      <p>This report is intended to help you identify strengths and areas for improvement as you continue preparing for future success. If you have any questions or would like guidance on next steps, please don't hesitate to reach out.</p>
    `),
  };
}

export function certificateTemplate(doulaName: string, certNumber: string, expirationDate: string): { subject: string; html: string } {
  return {
    subject: 'Your ADA Postpartum Doula Certificate',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p><strong>Congratulations!</strong> Your official ADA Postpartum Doula Certificate has been issued.</p>
      <div style="background: #f5f3ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Certificate Number:</strong> ${certNumber}</p>
        <p style="margin: 4px 0;"><strong>Valid Until:</strong> ${expirationDate}</p>
      </div>
      <p>Please find your certificate attached to this email as a PDF. This certification is recognized by the ADA and may be used to demonstrate your professional qualifications.</p>
      <p>You can also view your credentials anytime through the Doula Portal:</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Portal</a>
      </p>
      <p>If you have any questions, feel free to contact us.</p>
    `),
  };
}

export type EmailType = 'exam_pass' | 'exam_fail' | 'certificate';

export interface SendEmailParams {
  type: EmailType;
  recipientEmail: string;
  doulaName: string;
  // For certificate emails
  certNumber?: string;
  expirationDate?: string;
  pdfBuffer?: Buffer;
  pdfFilename?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ id: string }> {
  let template: { subject: string; html: string };

  switch (params.type) {
    case 'exam_pass':
      template = examPassTemplate(params.doulaName);
      break;
    case 'exam_fail':
      template = examFailTemplate(params.doulaName);
      break;
    case 'certificate':
      template = certificateTemplate(params.doulaName, params.certNumber!, params.expirationDate!);
      break;
  }

  const emailPayload: Parameters<typeof resend.emails.send>[0] = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.recipientEmail,
    subject: template.subject,
    html: template.html,
  };

  if (params.type === 'certificate' && params.pdfBuffer) {
    emailPayload.attachments = [
      {
        filename: params.pdfFilename || 'ADA_Certificate.pdf',
        content: params.pdfBuffer,
      },
    ];
  }

  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    throw new Error(error.message);
  }

  return { id: data!.id };
}
```

- [ ] **Step 3: Add `RESEND_API_KEY` to `.env.local`**

```
RESEND_API_KEY=re_xxxxxxxx
```

The actual key comes from https://resend.com/api-keys after creating an account and verifying the domain. For local dev before domain verification, Resend provides a test key that sends to the account owner's email only.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds (email.ts is only imported server-side, no client bundle issues).

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts package.json package-lock.json
git commit -m "feat: add Resend email library with exam/certificate templates"
```

---

### Task 2: Create Email Send API Endpoint

**Files:**
- Create: `src/app/api/email/send/route.ts`

- [ ] **Step 1: Create the API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendEmail, type EmailType } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EmailRequest {
  type: EmailType;
  doula_id: string;
  related_id: string;
  recipient_email: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check — get current admin user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const sentBy = user.id;

    // 2. Parse and validate
    const body = await request.json();
    const emails: EmailRequest[] = body.emails;
    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'emails array is required' }, { status: 400 });
    }

    // 3. Process each email
    const results: { doula_id: string; status: string; resend_id?: string; error?: string }[] = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const email of emails) {
      try {
        // Fetch doula name
        const { data: doula } = await supabaseAdmin
          .from('doulas')
          .select('full_name')
          .eq('id', email.doula_id)
          .single();

        if (!doula) {
          results.push({ doula_id: email.doula_id, status: 'failed', error: 'Doula not found' });
          failedCount++;
          continue;
        }

        // Build send params based on type
        const sendParams: Parameters<typeof sendEmail>[0] = {
          type: email.type,
          recipientEmail: email.recipient_email,
          doulaName: doula.full_name,
        };

        // For certificate emails, fetch the PDF
        if (email.type === 'certificate') {
          const { data: cert } = await supabaseAdmin
            .from('certificates')
            .select('certificate_number, expiration_date, pdf_url')
            .eq('id', email.related_id)
            .single();

          if (!cert || !cert.pdf_url) {
            results.push({ doula_id: email.doula_id, status: 'failed', error: 'Certificate or PDF not found' });
            failedCount++;
            continue;
          }

          // Fetch PDF from storage
          const pdfResponse = await fetch(cert.pdf_url);
          if (!pdfResponse.ok) {
            results.push({ doula_id: email.doula_id, status: 'failed', error: 'Failed to fetch certificate PDF' });
            failedCount++;
            continue;
          }
          const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

          sendParams.certNumber = cert.certificate_number;
          sendParams.expirationDate = cert.expiration_date;
          sendParams.pdfBuffer = pdfBuffer;
          sendParams.pdfFilename = `ADA_Postpartum_Doula_Certificate_${doula.full_name.replace(/\s+/g, '')}.pdf`;
        }

        // Send the email
        const { id: resendId } = await sendEmail(sendParams);

        // Determine subject for logging
        const subjectMap: Record<EmailType, string> = {
          exam_pass: 'Congratulations on Passing the ADA Postpartum Doula Exam',
          exam_fail: 'ADA Postpartum Doula Exam Results',
          certificate: 'Your ADA Postpartum Doula Certificate',
        };

        // Log to email_logs
        await supabaseAdmin.from('email_logs').insert({
          doula_id: email.doula_id,
          email_type: email.type,
          recipient_email: email.recipient_email,
          subject: subjectMap[email.type],
          related_id: email.related_id,
          sent_by: sentBy,
          resend_id: resendId,
          status: 'sent',
        });

        // Update email_sent_at on the related record
        const now = new Date().toISOString();
        if (email.type === 'certificate') {
          await supabaseAdmin.from('certificates').update({ email_sent_at: now }).eq('id', email.related_id);
        } else {
          await supabaseAdmin.from('exam_results').update({ email_sent_at: now }).eq('id', email.related_id);
        }

        results.push({ doula_id: email.doula_id, status: 'sent', resend_id: resendId });
        sentCount++;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);

        // Log the failure
        await supabaseAdmin.from('email_logs').insert({
          doula_id: email.doula_id,
          email_type: email.type,
          recipient_email: email.recipient_email,
          subject: '',
          related_id: email.related_id,
          sent_by: sentBy,
          resend_id: null,
          status: 'failed',
          error_message: message,
        });

        results.push({ doula_id: email.doula_id, status: 'failed', error: message });
        failedCount++;
      }
    }

    return NextResponse.json({ results, summary: { sent: sentCount, failed: failedCount } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/email/send/route.ts
git commit -m "feat: add /api/email/send endpoint with batch support and auth"
```

---

### Task 3: Create Email Send Dialog Component

**Files:**
- Create: `src/components/admin/email-send-dialog.tsx`

This is the reusable dialog that appears after saving exam results or generating a certificate. It shows a list of doulas with checkboxes, lets the admin select who to notify, sends the batch, and shows results.

- [ ] **Step 1: Create the dialog component**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { EmailType } from '@/lib/email';

export interface EmailRecipient {
  doula_id: string;
  doula_name: string;
  doula_id_code: string;
  email: string | null;
  related_id: string;
  type: EmailType;
  passed?: boolean | null; // for exam results — null means no score yet
}

interface EmailSendDialogProps {
  open: boolean;
  onClose: () => void;
  recipients: EmailRecipient[];
  title: string;
  description?: string;
}

export function EmailSendDialog({ open, onClose, recipients, title, description }: EmailSendDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Reset state when recipients change (prevents stale state on reuse)
  useEffect(() => {
    setSelected(new Set(recipients.filter((r) => r.email).map((r) => r.doula_id)));
    setResult(null);
    setErrors([]);
    setSending(false);
  }, [recipients]);

  if (!open) return null;

  const hasEmail = recipients.filter((r) => r.email);
  const noEmail = recipients.filter((r) => !r.email);

  function toggleSelect(doulaId: string) {
    const next = new Set(selected);
    if (next.has(doulaId)) next.delete(doulaId);
    else next.add(doulaId);
    setSelected(next);
  }

  async function handleSend() {
    const toSend = recipients.filter((r) => selected.has(r.doula_id) && r.email);
    if (toSend.length === 0) return;

    setSending(true);
    setResult(null);
    setErrors([]);

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: toSend.map((r) => ({
            type: r.type,
            doula_id: r.doula_id,
            related_id: r.related_id,
            recipient_email: r.email,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.summary);
        const failedResults = data.results?.filter((r: { status: string; error?: string }) => r.status === 'failed') ?? [];
        setErrors(failedResults.map((r: { error?: string }) => r.error || 'Unknown error'));
      } else {
        setErrors([data.error || 'Failed to send']);
      }
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Network error']);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

          {/* Recipients with email */}
          {hasEmail.length > 0 && (
            <div className="space-y-2 mb-4">
              {hasEmail.map((r) => (
                <label
                  key={r.doula_id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-zinc-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(r.doula_id)}
                    onChange={() => toggleSelect(r.doula_id)}
                    disabled={sending || result !== null}
                    className="rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.doula_name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{r.doula_id_code}</span>
                      {r.passed !== undefined && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${r.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.passed ? 'Pass' : 'Fail'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{r.email}</span>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Recipients without email */}
          {noEmail.length > 0 && (
            <div className="space-y-1 mb-4 opacity-50">
              {noEmail.map((r) => (
                <div key={r.doula_id} className="flex items-center gap-3 p-2">
                  <input type="checkbox" disabled checked={false} className="rounded" />
                  <span className="text-sm">{r.doula_name}</span>
                  <span className="text-xs text-muted-foreground italic">No email</span>
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`p-3 rounded-md text-sm mb-4 ${result.failed > 0 ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
              {result.sent} sent{result.failed > 0 ? `, ${result.failed} failed` : ''}
              {errors.length > 0 && (
                <ul className="mt-1 text-xs list-disc list-inside">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              {result ? 'Done' : 'Skip'}
            </Button>
            {!result && (
              <Button
                className="bg-ada-purple hover:bg-ada-purple/90"
                onClick={handleSend}
                disabled={sending || selected.size === 0}
              >
                {sending ? 'Sending...' : `Send to ${selected.size} Doula${selected.size !== 1 ? 's' : ''}`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/email-send-dialog.tsx
git commit -m "feat: add reusable email send dialog component"
```

---

### Task 4: Integrate Email Dialog into Record Exam Page

**Files:**
- Modify: `src/app/admin/(authenticated)/exams/record/page.tsx`

Three changes to this file:
1. Add `email` to the doulas select query (line ~145)
2. Chain `.select('id, doula_id, passed')` on the exam_results insert (line ~236) to get back inserted IDs
3. After successful save, show the email send dialog with the just-saved results

- [ ] **Step 1: Add email to doulas query**

In `loadDoulas()`, change the select from:
```typescript
.select('id, full_name, doula_id_code')
```
to:
```typescript
.select('id, full_name, doula_id_code, email')
```

- [ ] **Step 2: Chain `.select()` on insert and capture results**

In `handleSubmit()`, change the insert from:
```typescript
const { error } = await supabase.from('exam_results').insert(records);
```
to:
```typescript
const { data: insertedResults, error } = await supabase.from('exam_results').insert(records).select('id, doula_id, passed');
```

- [ ] **Step 3: Add email dialog state and import**

At the top of the file, add the import:
```typescript
import { EmailSendDialog, type EmailRecipient } from '@/components/admin/email-send-dialog';
```

Inside the component, add state:
```typescript
const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
const [showEmailDialog, setShowEmailDialog] = useState(false);
```

- [ ] **Step 4: Build recipients list after successful save**

After the successful insert and exam_status updates (after the `for (const record of records)` loop), instead of immediately navigating away, build the email recipients and show the dialog:

Replace:
```typescript
router.push('/admin/exams');
router.refresh();
```

With:
```typescript
setLoading(false);

// Build email recipients from saved results
if (insertedResults && insertedResults.length > 0) {
  const recipients: EmailRecipient[] = insertedResults.map((result) => {
    const entry = entries.find((e) => e.doula_id === result.doula_id);
    const doula = doulas.find((d) => d.id === result.doula_id);
    return {
      doula_id: result.doula_id,
      doula_name: entry?.doula_name ?? '',
      doula_id_code: entry?.doula_id_code ?? '',
      email: (doula as Record<string, string>)?.email ?? null,
      related_id: result.id,
      type: (result.passed ? 'exam_pass' : 'exam_fail') as EmailRecipient['type'],
      passed: result.passed,
    };
  });
  setEmailRecipients(recipients);
  setShowEmailDialog(true);
} else {
  router.push('/admin/exams');
  router.refresh();
}
```

- [ ] **Step 5: Add dialog to the JSX**

At the end of the component's return JSX (before the closing `</div>`), add:

```tsx
<EmailSendDialog
  open={showEmailDialog}
  onClose={() => {
    setShowEmailDialog(false);
    router.push('/admin/exams');
    router.refresh();
  }}
  recipients={emailRecipients}
  title="Results Saved — Send Notifications?"
  description="Select doulas to notify about their exam results. They will receive an email with a link to view their scores in the Portal."
/>
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/(authenticated)/exams/record/page.tsx
git commit -m "feat: exam results page prompts email notification after save"
```

---

### Task 5: Integrate Email Dialog into Doula Detail Page (Grant Certification)

**Files:**
- Modify: `src/app/admin/(authenticated)/doulas/[id]/page.tsx`

Two integrations:
1. After Grant Certification succeeds, prompt to send certificate email
2. Show email sent status on exam results and certificates tables, with resend buttons

- [ ] **Step 1: Add imports**

Add at top of file:
```typescript
import { EmailSendDialog, type EmailRecipient } from '@/components/admin/email-send-dialog';
```

- [ ] **Step 2: Add email dialog state to `EditDoulaPage`**

```typescript
const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
const [showEmailDialog, setShowEmailDialog] = useState(false);
```

- [ ] **Step 3: Pass doula email info to `GrantCertification` component**

Add `doulaEmail` and `doulaIdCode` props to `GrantCertification`:
```typescript
function GrantCertification({
  doulaId, doulaName, doulaEmail, doulaIdCode, existingCertTypes, loading, setLoading, onDone, onEmailPrompt,
}: {
  doulaId: string;
  doulaName: string;
  doulaEmail: string | null;
  doulaIdCode: string;
  existingCertTypes: string[];
  loading: boolean;
  setLoading: (v: boolean) => void;
  onDone: () => void;
  onEmailPrompt: (recipients: EmailRecipient[]) => void;
})
```

In the successful cert generation callback (after `setResult(...)` and `onDone()`), add:

```typescript
// Prompt email if doula has email
if (doulaEmail && data.certificate) {
  onEmailPrompt([{
    doula_id: doulaId,
    doula_name: doulaName,
    doula_id_code: doulaIdCode,
    email: doulaEmail,
    related_id: data.certificate.id,
    type: 'certificate',
  }]);
}
```

Update the JSX where `GrantCertification` is rendered to pass the new props:
```tsx
<GrantCertification
  doulaId={params.id as string}
  doulaName={doula.full_name}
  doulaEmail={doula.email}
  doulaIdCode={doula.doula_id_code}
  existingCertTypes={certs.map((c: Record<string, string>) => c.certificate_type)}
  loading={loading}
  setLoading={setLoading}
  onDone={reloadData}
  onEmailPrompt={(recipients) => {
    setEmailRecipients(recipients);
    setShowEmailDialog(true);
  }}
/>
```

- [ ] **Step 4: Add email status column to Exam Results table**

In the exam results table header, add after the "Status" `<th>`:
```tsx
<th className="text-left p-2">Notified</th>
```

In the exam results table body, add after the Status `<td>`:
```tsx
<td className="p-2">
  {exam.email_sent_at ? (
    <span className="text-green-600 text-xs" title={`Sent ${new Date(exam.email_sent_at).toLocaleString()}`}>
      ✉ Sent
    </span>
  ) : exam.passed !== null ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs h-6 text-muted-foreground"
      onClick={() => {
        if (!doula.email) {
          alert('This doula has no email address.');
          return;
        }
        setEmailRecipients([{
          doula_id: params.id as string,
          doula_name: doula.full_name,
          doula_id_code: doula.doula_id_code,
          email: doula.email,
          related_id: exam.id,
          type: exam.passed ? 'exam_pass' : 'exam_fail',
          passed: exam.passed,
        }]);
        setShowEmailDialog(true);
      }}
    >
      ✉ Send
    </Button>
  ) : (
    <span className="text-xs text-muted-foreground">—</span>
  )}
</td>
```

Note: The Send button is only shown when `exam.passed` is explicitly `true` or `false`, never when `null` (no score recorded). This prevents sending the wrong email type.

- [ ] **Step 5: Add email status column to Certificates table**

In the certificates table header, add after "Actions":
```tsx
<th className="text-left p-2">Notified</th>
```

In the certificates table body, add a new `<td>` after the Actions `<td>`:
```tsx
<td className="p-2">
  {cert.email_sent_at ? (
    <span className="text-green-600 text-xs" title={`Sent ${new Date(cert.email_sent_at).toLocaleString()}`}>
      ✉ Sent
    </span>
  ) : cert.status !== 'revoked' ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs h-6 text-muted-foreground"
      onClick={() => {
        if (!doula.email) {
          alert('This doula has no email address.');
          return;
        }
        setEmailRecipients([{
          doula_id: params.id as string,
          doula_name: doula.full_name,
          doula_id_code: doula.doula_id_code,
          email: doula.email,
          related_id: cert.id,
          type: 'certificate',
        }]);
        setShowEmailDialog(true);
      }}
    >
      ✉ Send
    </Button>
  ) : null}
</td>
```

- [ ] **Step 6: Add EmailSendDialog to the page JSX**

Before the closing `</div>` of the component return:
```tsx
<EmailSendDialog
  open={showEmailDialog}
  onClose={() => {
    setShowEmailDialog(false);
    setEmailRecipients([]);
    reloadData();
  }}
  recipients={emailRecipients}
  title={emailRecipients[0]?.type === 'certificate' ? 'Send Certificate Email?' : 'Send Exam Result Notification?'}
  description={emailRecipients[0]?.type === 'certificate'
    ? 'The doula will receive their certificate PDF as an email attachment.'
    : 'The doula will receive a notification with a link to view their results in the Portal.'
  }
/>
```

- [ ] **Step 7: Verify build**

```bash
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add src/app/admin/(authenticated)/doulas/[id]/page.tsx
git commit -m "feat: email status + send/resend on doula detail page"
```

---

### Task 6: Add Email History Page + Sidebar Link

**Files:**
- Create: `src/app/admin/(authenticated)/emails/page.tsx`
- Modify: `src/components/admin/sidebar.tsx`

- [ ] **Step 1: Create Email History page**

This is a **server component** that queries `email_logs` with the service role key.

```typescript
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TYPE_LABELS: Record<string, string> = {
  exam_pass: 'Exam — Pass',
  exam_fail: 'Exam — Fail',
  certificate: 'Certificate',
};

const TYPE_COLORS: Record<string, string> = {
  exam_pass: 'bg-green-100 text-green-800',
  exam_fail: 'bg-red-100 text-red-800',
  certificate: 'bg-blue-100 text-blue-800',
};

export default async function EmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const typeFilter = params.type || '';
  const page = parseInt(params.page || '1', 10);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase
    .from('email_logs')
    .select('*, doulas(full_name, doula_id_code)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (typeFilter) {
    query = query.eq('email_type', typeFilter);
  }

  const { data: logs, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  function buildUrl(newParams: Record<string, string>) {
    const p = new URLSearchParams();
    const merged = { type: typeFilter, page: String(page), ...newParams };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return `/admin/emails?${p.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Email History</h1>
        <span className="text-sm text-muted-foreground">{count ?? 0} total</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { value: '', label: 'All' },
          { value: 'exam_pass', label: 'Exam Pass' },
          { value: 'exam_fail', label: 'Exam Fail' },
          { value: 'certificate', label: 'Certificate' },
        ].map((f) => (
          <Link
            key={f.value}
            href={buildUrl({ type: f.value, page: '1' })}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              typeFilter === f.value
                ? 'bg-ada-purple text-white border-ada-purple'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50">
            <tr>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Recipient</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Subject</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Sent By</th>
            </tr>
          </thead>
          <tbody>
            {(logs ?? []).map((log) => {
              const doula = log.doulas as { full_name: string; doula_id_code: string } | null;
              return (
                <tr key={log.id} className="border-b hover:bg-zinc-50">
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/doulas/${log.doula_id}`} className="text-ada-purple hover:underline">
                      {doula?.full_name ?? 'Unknown'}
                    </Link>
                    <span className="text-xs text-muted-foreground ml-1">{log.recipient_email}</span>
                  </td>
                  <td className="p-3">
                    <Badge className={TYPE_COLORS[log.email_type] ?? 'bg-gray-100 text-gray-600'}>
                      {TYPE_LABELS[log.email_type] ?? log.email_type}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.subject || '—'}
                  </td>
                  <td className="p-3">
                    <Badge className={log.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {log.sent_by ? log.sent_by.substring(0, 8) + '...' : '—'}
                  </td>
                </tr>
              );
            })}
            {(!logs || logs.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No emails sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50">
              Previous
            </Link>
          )}
          <span className="px-3 py-1 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })} className="px-3 py-1 text-sm border rounded hover:bg-zinc-50">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add Emails to sidebar**

In `src/components/admin/sidebar.tsx`, add to the `navItems` array after the Articles entry:

```typescript
{ href: '/admin/emails', label: 'Emails', icon: '✉️' },
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/(authenticated)/emails/page.tsx src/components/admin/sidebar.tsx
git commit -m "feat: add email history page and sidebar link"
```

---

### Task 7: Database Indexes + Final Verification

**Files:**
- None (SQL via Supabase dashboard or migration)

- [ ] **Step 1: Create recommended indexes**

Run in Supabase SQL editor:
```sql
CREATE INDEX IF NOT EXISTS idx_email_logs_doula_id ON email_logs(doula_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_related_id ON email_logs(related_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
```

- [ ] **Step 2: Add RESEND_API_KEY to Vercel environment variables**

In Vercel dashboard → Project Settings → Environment Variables, add:
- Key: `RESEND_API_KEY`
- Value: the key from Resend dashboard
- Environments: Production, Preview

- [ ] **Step 3: Full build + local test**

```bash
npm run build
npm run dev
```

Test manually:
1. Go to `/admin/exams/record`, add a doula, fill scores, save → email dialog should appear
2. Go to `/admin/doulas/{id}`, grant cert → email dialog should appear
3. Check `/admin/emails` page shows entries
4. Verify doula detail page shows email status on exam/cert rows

- [ ] **Step 4: Final commit + deploy**

```bash
git add -A
git commit -m "feat: complete email notification system — Resend integration, send dialog, history page"
git push
```

---

## Infrastructure Setup (Manual — Before Testing)

These steps must be done in external dashboards before the system will work:

1. **Resend account**: Sign up at resend.com, get API key
2. **Domain verification**: Add `asiandoula.org` in Resend → Domains, then add the DNS records Resend provides to IONOS (typically 3 records: 1 MX + 2 TXT/CNAME for DKIM/SPF)
3. **Environment variables**: Add `RESEND_API_KEY` to `.env.local` (local) and Vercel (production)

**Note on DNS**: Resend's DNS records will NOT conflict with existing MX records for Google Workspace email. The Resend MX record goes on a subdomain (e.g., `send.asiandoula.org`), not the root domain. Existing email delivery to `@asiandoula.org` is unaffected.
