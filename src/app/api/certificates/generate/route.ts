import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateCertificatePDF } from '@/components/certificate/pdf-template';
import { generateVerificationCode, generateCertificateNumber } from '@/lib/utils';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { doula_id, certificate_type } = body;

    const supabase = getSupabase();

    // Fetch doula
    const { data: doula, error: doulaError } = await supabase
      .from('doulas')
      .select('*')
      .eq('id', doula_id)
      .single();

    if (doulaError || !doula) {
      return NextResponse.json({ error: 'Doula not found' }, { status: 404 });
    }

    // For credential-backed types (postpartum, birth), credential must exist as source of truth
    // For other types (cpr), use body.expiration_date or default +1 year
    const credentialTypes = ['postpartum', 'birth', 'ibclc_training'];
    const issuedDate = new Date().toISOString().split('T')[0];
    let expirationDate: string;
    let credential: { id: string; certification_date: string; expiration_date: string } | null = null;

    if (credentialTypes.includes(certificate_type)) {
      const { data: cred } = await supabase
        .from('doula_credentials')
        .select('id, certification_date, expiration_date')
        .eq('doula_id', doula_id)
        .eq('credential_type', certificate_type)
        .single();

      if (!cred) {
        return NextResponse.json(
          { error: 'Credential must exist before generating a certificate. Add the credential first.' },
          { status: 400 }
        );
      }
      credential = cred;
      expirationDate = cred.expiration_date;
    } else {
      // Non-credential types (e.g. cpr): accept body param or default +1 year
      expirationDate = body.expiration_date || new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString().split('T')[0];
    }

    // Check if this doula already has a certificate of this type
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('id, certificate_number, verification_code, pdf_url')
      .eq('doula_id', doula_id)
      .eq('certificate_type', certificate_type)
      .single();

    let certificateNumber: string;
    let verificationCode: string;
    let certId: string;

    if (existingCert) {
      certificateNumber = existingCert.certificate_number;
      verificationCode = existingCert.verification_code;
      certId = existingCert.id;
    } else {
      // Create new certificate record — find max sequence to avoid duplicates
      const year = new Date().getFullYear();
      const prefix = certificate_type === 'postpartum' ? 'PD' : certificate_type === 'birth' ? 'BD' : 'CPR';
      const numberPrefix = `ADA-${prefix}-${year}-`;

      const { data: latest } = await supabase
        .from('certificates')
        .select('certificate_number')
        .like('certificate_number', `${numberPrefix}%`)
        .order('certificate_number', { ascending: false })
        .limit(1)
        .single();

      let sequence = 1;
      if (latest) {
        const lastSeq = parseInt(latest.certificate_number.replace(numberPrefix, ''), 10);
        if (!isNaN(lastSeq)) sequence = lastSeq + 1;
      }

      certificateNumber = generateCertificateNumber(certificate_type, sequence);

      const { data: duplicate } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_number', certificateNumber)
        .single();

      if (duplicate) {
        return NextResponse.json(
          { error: `Certificate number ${certificateNumber} already exists. Please try again.` },
          { status: 409 }
        );
      }

      verificationCode = generateVerificationCode();
      certId = '';
    }

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

    const {
      data: { publicUrl },
    } = supabase.storage.from('certificates').getPublicUrl(storagePath);

    let cert;
    if (existingCert) {
      const { data, error } = await supabase
        .from('certificates')
        .update({
          issued_date: issuedDate,
          expiration_date: expirationDate,
          pdf_url: publicUrl,
        })
        .eq('id', certId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: `Update failed: ${error.message}` }, { status: 500 });
      }
      cert = data;
    } else {
      const { data, error } = await supabase
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

      if (error) {
        return NextResponse.json({ error: `Save failed: ${error.message}` }, { status: 500 });
      }
      cert = data;
    }

    // Sync doula's dates from credential (denormalized copy)
    const { data: currentDoula } = await supabase
      .from('doulas')
      .select('status')
      .eq('id', doula_id)
      .single();

    const updateData: Record<string, string> = {
      certification_date: credential?.certification_date || issuedDate,
      expiration_date: expirationDate,
    };
    if (currentDoula?.status === 'registered') {
      updateData.status = 'active';
    }

    await supabase
      .from('doulas')
      .update(updateData)
      .eq('id', doula_id);

    return NextResponse.json({ certificate: cert, pdf_url: publicUrl });
  } catch (err: unknown) {
    console.error('Certificate generation error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
