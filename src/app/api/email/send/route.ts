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
        const { data: doula } = await supabaseAdmin
          .from('doulas')
          .select('full_name, doula_id_code')
          .eq('id', email.doula_id)
          .single();

        if (!doula) {
          results.push({ doula_id: email.doula_id, status: 'failed', error: 'Doula not found' });
          failedCount++;
          continue;
        }

        const sendParams: Parameters<typeof sendEmail>[0] = {
          type: email.type,
          recipientEmail: email.recipient_email,
          doulaName: doula.full_name,
          doulaIdCode: doula.doula_id_code,
        };

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

        const { id: resendId } = await sendEmail(sendParams);

        const subjectMap: Record<EmailType, string> = {
          exam_pass: 'Congratulations on Passing the ADA Postpartum Doula Exam',
          exam_fail: 'ADA Postpartum Doula Exam Results',
          certificate: 'Your ADA Postpartum Doula Certificate',
        };

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
