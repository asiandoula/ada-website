import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Cache template bytes in memory — read once, never trigger file watcher again
let cachedTemplate: Uint8Array | null = null;
function getTemplate(): Uint8Array {
  if (!cachedTemplate) {
    const templatePath = path.join(process.cwd(), 'public', 'cert-template.pdf');
    cachedTemplate = new Uint8Array(fs.readFileSync(templatePath));
  }
  return cachedTemplate;
}

interface CertificatePDFProps {
  fullName: string;
  certificateNumber: string;
  expirationDate: string;
}

export async function generateCertificatePDF({
  fullName,
  certificateNumber,
  expirationDate,
}: CertificatePDFProps): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(getTemplate());
  const form = pdfDoc.getForm();

  // Text1 = Name (English only), Text2 = Cert ID, Text3 = Expiry
  const nameField = form.getTextField('Text1');
  nameField.setFontSize(50);
  nameField.setText(fullName);
  form.getTextField('Text2').setText(certificateNumber);

  const expFormatted = new Date(
    expirationDate.includes('T') ? expirationDate : `${expirationDate}T12:00:00`
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  form.getTextField('Text3').setText(expFormatted);

  form.flatten();

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
