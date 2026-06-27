import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Per-type template files in /public. Types not listed fall back to the default
// (Postpartum) template. Birth & Trainer use their own artwork (Canva exports)
// and intentionally have no expiry field.
const TEMPLATE_FILES: Record<string, string> = {
  birth: 'cert-template-birth.pdf',
  trainer: 'cert-template-trainer.pdf',
};
const DEFAULT_TEMPLATE = 'cert-template.pdf';

// Cache template bytes in memory per file — read once, never trigger file watcher again
const templateCache: Record<string, Uint8Array> = {};
function getTemplate(certificateType?: string): Uint8Array {
  const file = (certificateType && TEMPLATE_FILES[certificateType]) || DEFAULT_TEMPLATE;
  if (!templateCache[file]) {
    templateCache[file] = new Uint8Array(
      fs.readFileSync(path.join(process.cwd(), 'public', file))
    );
  }
  return templateCache[file];
}

interface CertificatePDFProps {
  fullName: string;
  certificateNumber: string;
  expirationDate: string;
  certificateType?: string;
}

export async function generateCertificatePDF({
  fullName,
  certificateNumber,
  expirationDate,
  certificateType,
}: CertificatePDFProps): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(getTemplate(certificateType));
  const form = pdfDoc.getForm();

  // The Birth/Trainer templates use a smaller name area than the original.
  const isCustomTemplate =
    certificateType === 'birth' || certificateType === 'trainer';

  // Text1 = Name (English only), Text2 = Cert ID, Text3 = Expiry (default template only)
  const nameField = form.getTextField('Text1');
  nameField.setFontSize(isCustomTemplate ? 40 : 50);
  nameField.setText(fullName);
  form.getTextField('Text2').setText(certificateNumber);

  // Text3 (Valid Through) exists only on the default template; the Birth/Trainer
  // artwork has no date field, so only fill it when present.
  const hasExpiryField = form.getFields().some((f) => f.getName() === 'Text3');
  if (hasExpiryField) {
    const expFormatted = new Date(
      expirationDate.includes('T') ? expirationDate : `${expirationDate}T12:00:00`
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    form.getTextField('Text3').setText(expFormatted);
  }

  form.flatten();

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
