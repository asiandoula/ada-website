# ADA Email Notification System

## Overview

Admin-triggered email notifications for exam results and certificate issuance. Emails are sent via Resend API from `certification@asiandoula.org`. Admins control when emails go out through inline prompts after key actions, with full send history tracking.

## Email Types

### 1. Exam Result — Pass
- **Trigger**: After recording exam results (batch)
- **Subject**: Congratulations on Passing the ADA Postpartum Doula Exam
- **Body**: Congratulations message + link to Portal (`asiandoula.org/portal`) to view detailed scores
- **Attachment**: None

### 2. Exam Result — Fail
- **Trigger**: After recording exam results (batch)
- **Subject**: ADA Postpartum Doula Exam Results
- **Body**: Encouraging message + link to Portal to view scores + guidance on next steps
- **Attachment**: None

### 3. Certificate Issued
- **Trigger**: After generating a certificate (single doula)
- **Subject**: Your ADA Postpartum Doula Certificate
- **Body**: Congratulations + certificate details (number, expiry)
- **Attachment**: Certificate PDF (fetched from Supabase Storage)

**Sender**: `certification@asiandoula.org` via Resend
**Signature**: "Certification & Standards, Asian Doula Alliance"
**Language**: English only

## UI Flows

### Flow 1: Exam Results → Email Prompt

1. Admin fills in scores on Record Exam page, clicks Save
2. Records saved to `exam_results` table (existing behavior)
3. Dialog appears: "Results saved. Send notifications?"
4. Dialog shows list of doulas just recorded:
   - Each row: name, ID code, score, pass/fail, email address
   - Has email → checkbox (default checked)
   - No email → grayed out with "No email" label
5. Admin can uncheck individuals
6. Click "Send Notifications" → API call to `/api/email/send`
7. Shows result: "5 sent, 1 failed, 2 skipped (no email)"
8. Updates `exam_results.email_sent_at` for sent records

### Flow 2: Certificate → Email Prompt

1. Admin clicks Grant Certification on doula detail page
2. Certificate generated (existing behavior)
3. If doula has email → dialog: "Certificate generated. Send email to xxx@xxx.com?"
4. If no email → just show success, no email prompt
5. Confirm → API sends email with PDF attachment
6. Updates `certificates.email_sent_at`

### Flow 3: Resend / Manual Send

- Doula detail page shows email status **per record** (each exam result, each certificate)
- Icon indicator: gray envelope = not sent, green envelope = sent (with timestamp)
- "Send" or "Resend" button next to each record
- Click → confirmation dialog → send
- A doula who fails then retakes will have separate exam result records, each with independent email status

### Flow 4: Email History Page

- New admin **server component** page at `/admin/emails` (queries `email_logs` server-side with service role key — no RLS needed)
- Table columns: Date, Recipient, Type, Subject, Status, Sent By
- Filterable by type (exam_pass, exam_fail, certificate)
- Sortable by date (newest first default)
- Links to related doula profile
- Paginated (20 per page)

## Database Schema

Already applied by user:

```sql
CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doula_id uuid REFERENCES doulas(id),
  email_type text NOT NULL,        -- 'exam_pass' | 'exam_fail' | 'certificate'
  recipient_email text NOT NULL,
  subject text NOT NULL,
  related_id uuid,                 -- exam_results.id or certificates.id
  sent_by uuid,                    -- admin user ID
  resend_id text,                  -- Resend API message ID
  status text NOT NULL,            -- 'sent' | 'failed'
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exam_results ADD COLUMN email_sent_at timestamptz;
ALTER TABLE certificates ADD COLUMN email_sent_at timestamptz;
```

### Recommended indexes

```sql
CREATE INDEX idx_email_logs_doula_id ON email_logs(doula_id);
CREATE INDEX idx_email_logs_related_id ON email_logs(related_id);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at DESC);
```

## API Design

### POST /api/email/send

Request body (always an array for uniform handling):
```json
{
  "emails": [
    {
      "type": "exam_pass" | "exam_fail" | "certificate",
      "doula_id": "uuid",
      "related_id": "uuid",
      "recipient_email": "string"
    }
  ]
}
```

Response:
```json
{
  "results": [
    { "doula_id": "uuid", "status": "sent", "resend_id": "..." },
    { "doula_id": "uuid", "status": "failed", "error": "..." }
  ],
  "summary": { "sent": 5, "failed": 1 }
}
```

Server-side logic:
1. Verify admin session via Supabase auth (reject if not authenticated)
2. Extract `sent_by` (admin user ID) from the auth session
3. Validate inputs
4. For each email in the batch:
   a. Fetch doula data (name) and related record (exam or cert)
   b. For certificate type: fetch PDF from Supabase Storage (fail gracefully if fetch errors — skip that email, report in results)
   c. Build email from template
   d. Send via Resend API
   e. Log to `email_logs` table (with `sent_by` from session)
   f. Update `email_sent_at` on related record
5. Return batch results

## New Files

| File | Purpose |
|------|---------|
| `src/lib/email.ts` | Resend client init, email templates (3), send function |
| `src/app/api/email/send/route.ts` | POST endpoint for sending emails |
| `src/app/admin/(authenticated)/emails/page.tsx` | Email History page |
| `src/components/admin/email-send-dialog.tsx` | Reusable send confirmation dialog |

## Modified Files

| File | Change |
|------|--------|
| `src/app/admin/(authenticated)/exams/record/page.tsx` | Chain `.select()` on insert to get IDs; add `email` to doulas query; add email dialog after save |
| `src/app/admin/(authenticated)/doulas/[id]/page.tsx` | Show email status, resend buttons |
| `src/app/admin/(authenticated)/layout.tsx` | Add Emails link to sidebar |
| `package.json` | Add `resend` dependency |
| `.env.local` | Add `RESEND_API_KEY` |

## Infrastructure Setup

1. Create Resend account, get API key
2. Add domain `asiandoula.org` in Resend dashboard
3. Add DNS records (MX/TXT/CNAME) to IONOS as Resend instructs
4. Verify domain in Resend
5. Add `RESEND_API_KEY` to `.env.local` and Vercel env vars

## Email Templates

Based on existing ADA email templates, adapted for the new system. Plain HTML emails with ADA branding (purple accent). Templates are defined as functions in `src/lib/email.ts` that accept doula name and relevant data, returning HTML strings.

## Design Decisions

- **No queue system**: Volume is low (~50 emails per exam session). Direct send is sufficient.
- **Inline prompts, not auto-send**: Admin explicitly chooses to send. Prevents accidental notifications.
- **Portal link instead of inline scores**: Keeps emails simple, drives traffic to Portal, avoids exposing scores in email.
- **PDF attachment for certificates**: Direct download experience, matches old workflow.
- **email_sent_at on records + email_logs table**: Dual tracking — quick status check on records + full audit trail in logs.
