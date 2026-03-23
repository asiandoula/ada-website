/**
 * Batch generate certificate PDFs for all doulas that have certificate records but no PDF.
 *
 * Usage: node scripts/batch-generate-pdfs.mjs
 *
 * Prerequisites:
 * - public/cert-template.pdf must exist
 * - .env.local must have Supabase credentials
 */

import { createClient } from '@supabase/supabase-js';
import { PDFDocument } from 'pdf-lib';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Load template once
const templatePath = path.join(process.cwd(), 'public', 'cert-template.pdf');
const templateBytes = new Uint8Array(fs.readFileSync(templatePath));

async function generatePDF(fullName, fullNameZh, certificateNumber, expirationDate) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const displayName = fullNameZh ? `${fullName} (${fullNameZh})` : fullName;
  const nameField = form.getTextField('Text1');
  nameField.setFontSize(50);
  nameField.setText(displayName);
  form.getTextField('Text2').setText(certificateNumber);

  const expFormatted = new Date(expirationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  form.getTextField('Text3').setText(expFormatted);

  form.flatten();

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

async function main() {
  console.log('Fetching certificates without PDF...');

  const { data: certs, error } = await supabase
    .from('certificates')
    .select('id, doula_id, certificate_number, expiration_date, pdf_url, doulas(full_name, full_name_zh)')
    .is('pdf_url', null)
    .order('certificate_number');

  if (error) {
    console.error('Failed to fetch certificates:', error.message);
    process.exit(1);
  }

  console.log(`Found ${certs.length} certificates without PDF.\n`);

  if (certs.length === 0) {
    console.log('Nothing to generate!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const cert of certs) {
    const doula = cert.doulas;
    const name = doula?.full_name || 'Unknown';
    const nameZh = doula?.full_name_zh || null;

    try {
      // Generate PDF
      const pdfBuffer = await generatePDF(
        name,
        nameZh,
        cert.certificate_number,
        cert.expiration_date
      );

      // Upload to Supabase Storage
      const storagePath = `certificates/${cert.doula_id}/${cert.certificate_number}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(storagePath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.log(`  [FAIL] ${cert.certificate_number} ${name} — Upload: ${uploadError.message}`);
        failed++;
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(storagePath);

      // Update certificate record with PDF URL
      const { error: updateError } = await supabase
        .from('certificates')
        .update({ pdf_url: publicUrl })
        .eq('id', cert.id);

      if (updateError) {
        console.log(`  [FAIL] ${cert.certificate_number} ${name} — DB update: ${updateError.message}`);
        failed++;
        continue;
      }

      console.log(`  [OK] ${cert.certificate_number} ${name} (${Math.round(pdfBuffer.length / 1024)}KB)`);
      success++;

    } catch (err) {
      console.log(`  [FAIL] ${cert.certificate_number} ${name} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Success: ${success}, Failed: ${failed}, Total: ${certs.length}`);

  // Verify
  const { count: withPdf } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .not('pdf_url', 'is', null);

  const { count: total } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true });

  console.log(`\nCertificates with PDF: ${withPdf}/${total}`);
}

main().catch(console.error);
