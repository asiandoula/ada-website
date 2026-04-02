import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/components/certificate/pdf-template';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST() {
  try {
    const supabase = getSupabase();

    const { data: certs, error } = await supabase
      .from('certificates')
      .select('id, doula_id, certificate_number, expiration_date, certificate_type')
      .neq('status', 'revoked')
      .order('certificate_number');

    if (error || !certs) {
      return NextResponse.json({ error: error?.message || 'No certs found' }, { status: 500 });
    }

    const results: { number: string; status: string; error?: string }[] = [];

    for (const cert of certs) {
      try {
        const { data: doula } = await supabase
          .from('doulas')
          .select('full_name, full_name_zh')
          .eq('id', cert.doula_id)
          .single();

        if (!doula) {
          results.push({ number: cert.certificate_number, status: 'skipped', error: 'Doula not found' });
          continue;
        }

        const pdfBuffer = await generateCertificatePDF({
          fullName: doula.full_name,
          fullNameZh: doula.full_name_zh || undefined,
          certificateNumber: cert.certificate_number,
          expirationDate: cert.expiration_date,
        });

        const storagePath = `certificates/${cert.doula_id}/${cert.certificate_number}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          results.push({ number: cert.certificate_number, status: 'error', error: uploadError.message });
        } else {
          const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(storagePath);
          await supabase.from('certificates').update({
            pdf_url: publicUrl,
          }).eq('id', cert.id);
          results.push({ number: cert.certificate_number, status: 'ok' });
        }
      } catch (e) {
        results.push({ number: cert.certificate_number, status: 'error', error: String(e) });
      }
    }

    const ok = results.filter(r => r.status === 'ok').length;
    const errors = results.filter(r => r.status === 'error').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    return NextResponse.json({ total: certs.length, ok, errors, skipped, details: results });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
