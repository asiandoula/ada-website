import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

// Cache template bytes and font in memory
let cachedTemplate: Uint8Array | null = null;
let cachedCjkFont: Uint8Array | null = null;

function getTemplate(): Uint8Array {
  if (!cachedTemplate) {
    const templatePath = path.join(process.cwd(), 'public', 'cert-template.pdf');
    cachedTemplate = new Uint8Array(fs.readFileSync(templatePath));
  }
  return cachedTemplate;
}

function getCjkFont(): Uint8Array {
  if (!cachedCjkFont) {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansSC.ttf');
    cachedCjkFont = new Uint8Array(fs.readFileSync(fontPath));
  }
  return cachedCjkFont;
}

interface CertificatePDFProps {
  fullName: string;
  fullNameZh?: string;
  certificateNumber: string;
  expirationDate: string;
}

// Check if a string contains CJK characters
function hasCjk(str: string): boolean {
  // CJK Unified Ideographs + CJK compatibility + Kana + Hangul
  return /[\u2E80-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\uAC00-\uD7AF\u3040-\u30FF]/.test(str);
}

export async function generateCertificatePDF({
  fullName,
  fullNameZh,
  certificateNumber,
  expirationDate,
}: CertificatePDFProps): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(getTemplate());

  // Register fontkit for custom font support
  pdfDoc.registerFontkit(fontkit);

  const displayName = fullNameZh ? `${fullName} (${fullNameZh})` : fullName;

  const form = pdfDoc.getForm();
  const nameField = form.getTextField('Text1');
  nameField.setFontSize(50);
  nameField.setText(displayName);

  // If name contains CJK characters, embed CJK font for the name field
  if (hasCjk(displayName)) {
    const cjkFont = await pdfDoc.embedFont(getCjkFont());
    nameField.updateAppearances(cjkFont);
  }

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
