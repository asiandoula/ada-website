import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { renderToBuffer } from '@react-pdf/renderer';
import { CertificatePDF } from '@/components/certificate/pdf-template';
import { generateVerificationCode, generateCertificateNumber } from '@/lib/utils';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';
import React from 'react';

// Use service role for storage uploads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
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

  const verificationUrl = `https://asiandoula.org/verify/${verificationCode}`;

  // Generate PDF
  const pdfElement = React.createElement(CertificatePDF, {
    fullName: doula.full_name,
    fullNameZh: doula.full_name_zh || undefined,
    certificateType: certificate_type,
    certificateTypeLabel: CERT_TYPE_LABELS[certificate_type as CertificateType],
    certificateNumber,
    issuedDate,
    expirationDate,
    verificationCode,
    verificationUrl,
  });
  // CertificatePDF returns a <Document> — cast to satisfy renderToBuffer's type
  const pdfBuffer = await renderToBuffer(
    pdfElement as unknown as React.ReactElement
  );

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

  return NextResponse.json({ certificate: cert, pdf_url: publicUrl });
}
