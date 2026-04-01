-- Add unique constraint on certificate_number to prevent race condition duplicates
-- The application-level check is not atomic; this DB constraint is the real guard
ALTER TABLE certificates ADD CONSTRAINT certificates_certificate_number_unique UNIQUE (certificate_number);
