import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'certification@asiandoula.org';
const FROM_NAME = 'Asian Doula Alliance';
const PORTAL_URL = 'https://www.asiandoula.org/portal';

function baseTemplate(content: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="border-bottom: 3px solid #7c3aed; padding: 20px 0; margin-bottom: 24px;">
        <img src="https://www.asiandoula.org/ada-logo.svg" alt="ADA" style="height: 40px;" />
      </div>
      ${content}
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
        <p>Warm regards,</p>
        <p><strong>Certification &amp; Standards</strong><br/>Asian Doula Alliance</p>
      </div>
    </div>
  `;
}

export function examPassTemplate(doulaName: string): { subject: string; html: string } {
  return {
    subject: 'Congratulations on Passing the ADA Postpartum Doula Exam',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>On behalf of our certification team, <strong>congratulations on successfully passing the ADA Postpartum Doula Exam</strong>. This result reflects your knowledge, practical readiness, and commitment to excellence in postpartum care.</p>
      <p>You can view your detailed exam results by logging into your Doula Portal:</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Results</a>
      </p>
      <p>Your official ADA certification will be issued separately. If you have any questions, feel free to contact us.</p>
    `),
  };
}

export function examFailTemplate(doulaName: string): { subject: string; html: string } {
  return {
    subject: 'ADA Postpartum Doula Exam Results',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p>Thank you for taking the ADA Postpartum Doula Exam. We appreciate your dedication and commitment to advancing your knowledge of postpartum care.</p>
      <p>After careful evaluation, the required passing score was not achieved at this time. However, we commend your efforts and encourage you to review your detailed results, which outline your scores across key assessment areas.</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Results</a>
      </p>
      <p>This report is intended to help you identify strengths and areas for improvement as you continue preparing for future success. If you have any questions or would like guidance on next steps, please don't hesitate to reach out.</p>
    `),
  };
}

export function certificateTemplate(doulaName: string, certNumber: string, expirationDate: string): { subject: string; html: string } {
  return {
    subject: 'Your ADA Postpartum Doula Certificate',
    html: baseTemplate(`
      <p>Dear ${doulaName},</p>
      <p><strong>Congratulations!</strong> Your official ADA Postpartum Doula Certificate has been issued.</p>
      <div style="background: #f5f3ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Certificate Number:</strong> ${certNumber}</p>
        <p style="margin: 4px 0;"><strong>Valid Until:</strong> ${expirationDate}</p>
      </div>
      <p>Please find your certificate attached to this email as a PDF. This certification is recognized by the ADA and may be used to demonstrate your professional qualifications.</p>
      <p>You can also view your credentials anytime through the Doula Portal:</p>
      <p style="margin: 20px 0;">
        <a href="${PORTAL_URL}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Your Portal</a>
      </p>
      <p>If you have any questions, feel free to contact us.</p>
    `),
  };
}

export type EmailType = 'exam_pass' | 'exam_fail' | 'certificate';

export interface SendEmailParams {
  type: EmailType;
  recipientEmail: string;
  doulaName: string;
  certNumber?: string;
  expirationDate?: string;
  pdfBuffer?: Buffer;
  pdfFilename?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<{ id: string }> {
  let template: { subject: string; html: string };

  switch (params.type) {
    case 'exam_pass':
      template = examPassTemplate(params.doulaName);
      break;
    case 'exam_fail':
      template = examFailTemplate(params.doulaName);
      break;
    case 'certificate':
      template = certificateTemplate(params.doulaName, params.certNumber!, params.expirationDate!);
      break;
  }

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
