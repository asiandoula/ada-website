import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

interface CertificatePDFProps {
  fullName: string;
  fullNameZh?: string;
  certificateNumber: string;
  expirationDate: string;
}

export async function generateCertificatePDF({
  fullName,
  fullNameZh,
  certificateNumber,
  expirationDate,
}: CertificatePDFProps): Promise<Buffer> {
  // Read template directly from public directory as raw bytes
  const templatePath = path.join(process.cwd(), 'public', 'cert-template.pdf');
  const templateBytes = new Uint8Array(fs.readFileSync(templatePath));

  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  // Text1 = Name, Text2 = Cert ID, Text3 = Expiry
  const displayName = fullNameZh ? `${fullName} (${fullNameZh})` : fullName;
  form.getTextField('Text1').setText(displayName);
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
