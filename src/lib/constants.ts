export const DOULA_STATUSES = [
  'certified_active',
  'exam_scheduled',
  'exam_failed',
  'expired',
  'under_investigation',
  'suspended',
  'revoked',
  'retired',
] as const;

export type DoulaStatus = (typeof DOULA_STATUSES)[number];

export const STATUS_LABELS: Record<DoulaStatus, string> = {
  certified_active: 'Certified (Active)',
  exam_scheduled: 'Exam Scheduled',
  exam_failed: 'Exam Failed',
  expired: 'Expired',
  under_investigation: 'Under Investigation',
  suspended: 'Suspended',
  revoked: 'Revoked',
  retired: 'Retired',
};

export const STATUS_COLORS: Record<DoulaStatus, string> = {
  certified_active: 'bg-green-100 text-green-800',
  exam_scheduled: 'bg-blue-100 text-blue-800',
  exam_failed: 'bg-red-100 text-red-800',
  expired: 'bg-yellow-100 text-yellow-800',
  under_investigation: 'bg-orange-100 text-orange-800',
  suspended: 'bg-red-100 text-red-800',
  revoked: 'bg-gray-100 text-gray-800',
  retired: 'bg-gray-100 text-gray-600',
};

export const CERTIFICATE_TYPES = ['postpartum', 'birth', 'cpr', 'ibclc_training'] as const;
export type CertificateType = (typeof CERTIFICATE_TYPES)[number];

export const CERT_TYPE_LABELS: Record<CertificateType, string> = {
  postpartum: 'ADA Postpartum Doula Certificate',
  birth: 'ADA Birth Doula Certificate',
  cpr: 'American Red Cross CPR Certificate',
  ibclc_training: 'ADA IBCLC Training Qualified',
};

export const CREDENTIAL_TYPES = ['postpartum', 'birth', 'ibclc_training'] as const;
export type CredentialType = (typeof CREDENTIAL_TYPES)[number];

export const CREDENTIAL_LABELS: Record<CredentialType, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
  ibclc_training: 'IBCLC Training Qualified',
};

export const CREDENTIAL_COLORS: Record<CredentialType, string> = {
  postpartum: 'bg-purple-100 text-purple-800',
  birth: 'bg-blue-100 text-blue-800',
  ibclc_training: 'bg-teal-100 text-teal-800',
};
