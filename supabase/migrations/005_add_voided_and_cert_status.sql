-- Add voided flag to exam_results (soft delete for audit compliance)
ALTER TABLE exam_results ADD COLUMN voided BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE exam_results ADD COLUMN voided_at TIMESTAMPTZ;
ALTER TABLE exam_results ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Add status to certificates (active/revoked, no hard delete)
ALTER TABLE certificates ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'revoked'));
ALTER TABLE certificates ADD COLUMN revoked_at TIMESTAMPTZ;
ALTER TABLE certificates ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
