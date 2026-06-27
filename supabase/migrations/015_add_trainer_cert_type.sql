-- Allow the 'trainer' certificate type (ADA Certified Trainer).
-- Widens the existing CHECK constraint from migration 006; reversible and additive.
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_certificate_type_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_certificate_type_check
  CHECK (certificate_type IN ('postpartum', 'birth', 'cpr', 'ibclc_training', 'trainer'));
