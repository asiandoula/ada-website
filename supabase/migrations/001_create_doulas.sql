CREATE TABLE doulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doula_id_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  full_name_zh TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  certification_date DATE,
  expiration_date DATE,
  status TEXT NOT NULL DEFAULT 'exam_scheduled'
    CHECK (status IN (
      'certified_active', 'exam_scheduled', 'exam_failed',
      'expired', 'under_investigation', 'suspended', 'revoked', 'retired'
    )),
  languages TEXT[],
  region TEXT,
  training_provider TEXT,
  photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_doulas_status ON doulas(status);
CREATE INDEX idx_doulas_doula_id_code ON doulas(doula_id_code);
