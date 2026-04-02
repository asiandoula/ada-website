-- Sync certificate expiration_date from credential (credential is source of truth)
-- This fixes certificates that had wrong 3-year expiry dates
UPDATE certificates c
SET expiration_date = dc.expiration_date
FROM doula_credentials dc
WHERE dc.doula_id = c.doula_id
  AND dc.credential_type = c.certificate_type
  AND dc.expiration_date IS NOT NULL
  AND c.expiration_date IS NOT NULL
  AND c.expiration_date != dc.expiration_date
  AND c.status != 'revoked';
