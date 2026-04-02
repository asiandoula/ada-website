-- Create postpartum credentials for doulas that have certification dates but no credential record
-- These are legacy doulas imported before the credential system existed
INSERT INTO doula_credentials (doula_id, credential_type, status, certification_date, expiration_date)
SELECT d.id, 'postpartum', 'active', d.certification_date, d.expiration_date
FROM doulas d
LEFT JOIN doula_credentials dc ON dc.doula_id = d.id AND dc.credential_type = 'postpartum'
WHERE dc.id IS NULL
  AND d.certification_date IS NOT NULL;
