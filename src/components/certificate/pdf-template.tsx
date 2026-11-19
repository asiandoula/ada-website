import {
  PDFDocument,
  StandardFonts,
  rgb,
  pushGraphicsState,
  popGraphicsState,
  setCharacterSpacing,
} from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Per-type template files in /public. Types not listed fall back to the default
// (Postpartum) template, which is an AcroForm PDF filled via form fields.
//
// Birth & Trainer use their own artwork (Canva exports → flat vector PDFs with
// NO form fields). We draw the name / cert id directly onto the page so there is
// no opaque field background covering the watermark. Birth also gets the
// "VALID THROUGH" + expiry block bottom-right, matching Postpartum (the Birth
// artwork has no such label, so we draw both). Trainer has no expiry line.
const TEMPLATE_FILES: Record<string, string> = {
  birth: 'cert-template-birth.pdf',
  trainer: 'cert-template-trainer.pdf',
};
const DEFAULT_TEMPLATE = 'cert-template.pdf';

// Draw positions for the flat Birth/Trainer templates (page 792 x 591.36 pt,
// origin bottom-left). Text is centered on centerX.
const DRAW_LAYOUT = {
  name: { centerX: 396, baselineY: 300, size: 40 },
  certId: { centerX: 320, baselineY: 103, size: 13 },
};

// Birth expiry block, copied from the Postpartum certificate: a light-gray bold
// caps "VALID THROUGH" label with the date in black 14pt under it, left-aligned
// under the logo. Measured on the Postpartum render, then moved down 10.4pt
// because the whole bottom block of the Birth artwork (logo, Certification ID)
// sits 10.4pt lower. Postpartum's label is Arial Black; we use Helvetica-Bold
// with letter spacing so it fills the same width (no font file to ship).
const EXPIRY_LAYOUT = {
  x: 568.5,
  label: { text: 'VALID THROUGH', baselineY: 100, size: 8.7, charSpacing: 1.04, gray: 182 / 255 },
  date: { baselineY: 81, size: 14 },
};

// Same wording as the Postpartum field: "November 19, 2027". Noon local time so
// a DATE string never rolls back a day.
function formatExpiry(expirationDate: string): string {
  return new Date(
    expirationDate.includes('T') ? expirationDate : `${expirationDate}T12:00:00`
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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

  const isCustomTemplate =
    certificateType === 'birth' || certificateType === 'trainer';

  if (isCustomTemplate) {
    // Draw text directly — transparent, lets the floral watermark show through.
    const page = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const nameWidth = font.widthOfTextAtSize(fullName, DRAW_LAYOUT.name.size);
    page.drawText(fullName, {
      x: DRAW_LAYOUT.name.centerX - nameWidth / 2,
      y: DRAW_LAYOUT.name.baselineY,
      size: DRAW_LAYOUT.name.size,
      font,
      color: rgb(0.11, 0.11, 0.16),
    });

    const idWidth = font.widthOfTextAtSize(certificateNumber, DRAW_LAYOUT.certId.size);
    page.drawText(certificateNumber, {
      x: DRAW_LAYOUT.certId.centerX - idWidth / 2,
      y: DRAW_LAYOUT.certId.baselineY,
      size: DRAW_LAYOUT.certId.size,
      font,
      color: rgb(0.16, 0.16, 0.3),
    });

    // Birth credentials expire like Postpartum. No date (permanent) → no block.
    if (certificateType === 'birth' && expirationDate) {
      const { x, label, date } = EXPIRY_LAYOUT;
      const labelFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      page.pushOperators(pushGraphicsState(), setCharacterSpacing(label.charSpacing));
      page.drawText(label.text, {
        x,
        y: label.baselineY,
        size: label.size,
        font: labelFont,
        color: rgb(label.gray, label.gray, label.gray),
      });
      page.pushOperators(popGraphicsState());

      page.drawText(formatExpiry(expirationDate), {
        x,
        y: date.baselineY,
        size: date.size,
        font,
        color: rgb(0, 0, 0),
      });
    }
  } else {
    // Default (Postpartum / CPR / IBCLC) template — AcroForm fields.
    const form = pdfDoc.getForm();

    // Text1 = Name (English only), Text2 = Cert ID, Text3 = Expiry
    const nameField = form.getTextField('Text1');
    nameField.setFontSize(50);
    nameField.setText(fullName);
    form.getTextField('Text2').setText(certificateNumber);

    form.getTextField('Text3').setText(formatExpiry(expirationDate));

    form.flatten();
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
