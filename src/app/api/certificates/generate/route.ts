import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/components/certificate/pdf-template';
import { generateVerificationCode, generateCertificateNumber } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doula_id, certificate_type } = body;

    // Fetch doula
    const { data: doula, error: doulaError } = await supabase
      .from('doulas')
      .select('*')
      .eq('id', doula_id)
      .single();

    if (doulaError || !doula) {
      return NextResponse.json({ error: 'Doula not found' }, { status: 404 });
    }

    // Get next sequence number
    const { count } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('certificate_type', certificate_type);

    const sequence = (count ?? 0) + 1;
    const certificateNumber = generateCertificateNumber(certificate_type, sequence);
    const verificationCode = generateVerificationCode();
    const issuedDate = new Date().toISOString().split('T')[0];
    const expirationDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 3)
    )
      .toISOString()
      .split('T')[0];

    // Generate PDF
    console.log('Generating PDF for', doula.full_name, '...');
    const pdfBuffer = await generateCertificatePDF({
      fullName: doula.full_name,
      fullNameZh: doula.full_name_zh || undefined,
      certificateNumber,
      expirationDate,
    });
    console.log('PDF generated, size:', pdfBuffer.length);

    // Upload to Supabase Storage
    const storagePath = `certificates/${doula_id}/${certificateNumber}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('certificates').getPublicUrl(storagePath);

    // Save to database
    const { data: cert, error: insertError } = await supabase
      .from('certificates')
      .insert({
        doula_id,
        certificate_type,
        certificate_number: certificateNumber,
        issued_date: issuedDate,
        expiration_date: expirationDate,
        pdf_url: publicUrl,
        verification_code: verificationCode,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Save failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Auto-sync doula's dates and status
    await supabase
      .from('doulas')
      .update({
        certification_date: issuedDate,
        expiration_date: expirationDate,
        status: 'certified_active',
      })
      .eq('id', doula_id);

    return NextResponse.json({ certificate: cert, pdf_url: publicUrl });
  } catch (err: unknown) {
    console.error('Certificate generation error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
