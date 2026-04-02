-- Add 'superseded' to certificate status values
-- Superseded = replaced by a newer certificate (e.g. after renew)
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_status_check;
ALTER TABLE certificates ADD CONSTRAINT certificates_status_check
  CHECK (status IN ('active', 'superseded', 'revoked'));
