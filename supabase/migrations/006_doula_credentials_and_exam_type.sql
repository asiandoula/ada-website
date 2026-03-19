-- New credential types
-- postpartum: Postpartum Doula (exam, 3yr expiry)
-- birth: Birth Doula (no exam yet, 3yr expiry)
-- ibclc_training: IBCLC ADA Training Qualified (no exam, permanent)

-- Per-credential status/dates table
CREATE TABLE doula_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doula_id UUID NOT NULL REFERENCES doulas(id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL
    CHECK (credential_type IN ('postpartum', 'birth', 'ibclc_training')),
  status TEXT NOT NULL DEFAULT 'exam_scheduled'
    CHECK (status IN (
      'certified_active', 'exam_scheduled', 'exam_failed',
      'expired', 'under_investigation', 'suspended', 'revoked', 'retired'
    )),
  certification_date DATE,
  expiration_date DATE, -- NULL = permanent (e.g. IBCLC training)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(doula_id, credential_type)
);

CREATE INDEX idx_doula_credentials_doula_id ON doula_credentials(doula_id);
CREATE INDEX idx_doula_credentials_type_status ON doula_credentials(credential_type, status);

-- Add exam_type to exam_results
ALTER TABLE exam_results ADD COLUMN exam_type TEXT DEFAULT 'postpartum'
  CHECK (exam_type IN ('postpartum', 'birth', 'ibclc_training'));

-- Add ibclc_training to certificates type check
-- Drop and re-create the check constraint
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_certificate_type_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_certificate_type_check
  CHECK (certificate_type IN ('postpartum', 'birth', 'cpr', 'ibclc_training'));

-- Migrate existing doula data into credentials
-- Every existing doula gets a postpartum credential
INSERT INTO doula_credentials (doula_id, credential_type, status, certification_date, expiration_date)
SELECT id, 'postpartum', status, certification_date, expiration_date
FROM doulas
WHERE status IS NOT NULL;

-- Set exam_type = 'postpartum' for all existing exam results
UPDATE exam_results SET exam_type = 'postpartum' WHERE exam_type IS NULL;
