/**
 * Test certificate PDF generation using Adobe form template.
 * Usage: npx tsx scripts/test-cert-pdf.tsx
 */

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function main() {
  const templatePath = path.join(process.cwd(), 'src/components/certificate/cert-template.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Text1 = Name, Text2 = Cert ID, Text3 = Expiry
  form.getTextField('Text1').setText('Alice Gao');
  form.getTextField('Text2').setText('ADA-PD-2026-0127');
  form.getTextField('Text3').setText('March 19, 2029');

  // Flatten so fields become static text
  form.flatten();

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('/tmp/test-certificate.pdf', pdfBytes);
  console.log('PDF saved to /tmp/test-certificate.pdf');
}

main().catch(console.error);
