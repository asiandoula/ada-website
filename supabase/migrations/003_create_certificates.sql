CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doula_id UUID NOT NULL REFERENCES doulas(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL
    CHECK (certificate_type IN ('postpartum', 'birth', 'cpr')),
  certificate_number TEXT UNIQUE,
  issued_date DATE,
  expiration_date DATE,
  pdf_url TEXT,
  verification_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_certificates_doula_id ON certificates(doula_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
