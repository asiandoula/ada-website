import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = 'certification@asiandoula.org';
const FROM_NAME = 'Asian Doula Alliance';
const PORTAL_URL = 'https://www.asiandoula.org/portal';

const EXAM_TYPE_LABELS: Record<string, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
};

const CERT_TYPE_LABELS: Record<string, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
  cpr: 'CPR',
  ibclc_training: 'IBCLC Training',
};

function examLabel(examType: string): string {
  return EXAM_TYPE_LABELS[examType] || examType;
}

function certLabel(certType: string): string {
  return CERT_TYPE_LABELS[certType] || certType;
}

function baseTemplate(content: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
      <div style="border-bottom: 3px solid #7c3aed; padding: 20px 0; margin-bottom: 24px;">
        <img src="https://www.asiandoula.org/ada-logo.svg" alt="ADA" style="height: 40px;" />
      </div>
      ${content}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
        <p style="margin: 0 0 4px 0;">Warm regards,</p>
        <p style="margin: 0;"><strong>Program Director, Certification &amp; Standards</strong></p>
        <p style="margin: 0;">On behalf of the ADA Certification Office</p>
        <p style="margin: 0;">Asian Doula Alliance</p>
      </div>
    </div>
  `;
}

function portalInstructions(doulaIdCode: string): string {
  return `
    <div style="background: #f8f7ff; border: 1px solid #e5e1f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">To view your detailed results, log in to the Doula Portal with your ID code:</p>
      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1a1a1a; letter-spacing: 0.5px;">${doulaIdCode}</p>
    </div>
    <p style="margin: 20px 0;">
      <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Access Doula Portal</a>
    </p>
  `;
}

export function examPassTemplate(doulaName: string, doulaIdCode: string, examType: string): { subject: string; html: string } {
  const label = examLabel(examType);
  return {
    subject: `Congratulations on Passing the ADA ${label} Exam`,
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>On behalf of our certification team, <strong>congratulations on successfully passing the ADA ${label} Exam</strong>. This result reflects your knowledge, practical readiness, and commitment to excellence in ${examType === 'postpartum' ? 'postpartum' : 'doula'} care.</p>
      <p>You can view your detailed exam results by logging into your Doula Portal:</p>
      ${portalInstructions(doulaIdCode)}
      <p>Your official ADA certification will be issued separately. If you have any questions, feel free to contact us.</p>
    `),
  };
}

export function examFailTemplate(doulaName: string, doulaIdCode: string, examType: string): { subject: string; html: string } {
  const label = examLabel(examType);
  return {
    subject: `ADA ${label} Exam Results`,
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>Thank you for taking the ADA ${label} Exam. We appreciate your dedication and commitment to advancing your knowledge of ${examType === 'postpartum' ? 'postpartum' : 'doula'} care.</p>
      <p>After careful evaluation, we regret to inform you that the required passing score was not achieved at this time. However, we commend your efforts and encourage you to review your detailed results, which outline your scores across key assessment areas.</p>
      ${portalInstructions(doulaIdCode)}
      <p>This report is intended to help you identify strengths and areas for improvement as you continue preparing for future success.</p>
      <p>If you have any questions or would like guidance on next steps or additional training resources, please don't hesitate to reach out.</p>
    `),
  };
}

export function certificateTemplate(doulaName: string, doulaIdCode: string, certType: string, certNumber: string, expirationDate: string): { subject: string; html: string } {
  const label = certLabel(certType);
  return {
    subject: `Your ADA ${label} Certificate`,
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p><strong>Congratulations!</strong> Your official ADA ${label} Certificate has been issued.</p>
      <div style="background: #f5f3ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Certificate Number:</strong> ${certNumber}</p>
        <p style="margin: 4px 0;"><strong>Valid Until:</strong> ${expirationDate}</p>
      </div>
      <p>Please find your certificate attached to this email as a PDF. This certification is recognized by the ADA and may be used to demonstrate your professional qualifications.</p>
      <p>You can also view your credentials anytime through the Doula Portal:</p>
      ${portalInstructions(doulaIdCode)}
      <p>If you have any questions, feel free to contact us.</p>
    `),
  };
}

export type EmailType = 'exam_pass' | 'exam_fail' | 'certificate';

export interface SendEmailParams {
  type: EmailType;
  recipientEmail: string;
  doulaName: string;
  doulaIdCode: string;
  examType?: string;
  certType?: string;
  certNumber?: string;
  expirationDate?: string;
  pdfBuffer?: Buffer;
  pdfFilename?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ id: string }> {
  let template: { subject: string; html: string };

  switch (params.type) {
    case 'exam_pass':
      template = examPassTemplate(params.doulaName, params.doulaIdCode, params.examType || 'postpartum');
      break;
    case 'exam_fail':
      template = examFailTemplate(params.doulaName, params.doulaIdCode, params.examType || 'postpartum');
      break;
    case 'certificate':
      template = certificateTemplate(params.doulaName, params.doulaIdCode, params.certType || 'postpartum', params.certNumber!, params.expirationDate!);
      break;
  }

  const resend = getResend();
  const emailPayload: Parameters<typeof resend.emails.send>[0] = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.recipientEmail,
    subject: template.subject,
    html: template.html,
  };

  if (params.type === 'certificate' && params.pdfBuffer) {
    emailPayload.attachments = [
      {
        filename: params.pdfFilename || 'ADA_Certificate.pdf',
        content: params.pdfBuffer,
      },
    ];
  }

  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    throw new Error(error.message);
  }

  return { id: data!.id };
}
