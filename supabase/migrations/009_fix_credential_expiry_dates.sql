-- Fix credential expiration dates: was incorrectly set to +3 years, should be +1 year
-- Supersedes the "3yr expiry" comments in 006_doula_credentials_and_exam_type.sql
-- Credentials now expire after 1 year, matching certificate validity
-- This updates all non-IBCLC credentials to expire 1 year from certification_date
UPDATE doula_credentials
SET expiration_date = certification_date::date + interval '1 year',
    updated_at = now()
WHERE expiration_date IS NOT NULL
  AND credential_type != 'ibclc_training'
  AND expiration_date = certification_date::date + interval '3 years';
