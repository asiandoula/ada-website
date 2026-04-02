-- Keep only the latest active certificate per doula per type, supersede the rest
WITH ranked AS (
  SELECT id, doula_id, certificate_type,
    ROW_NUMBER() OVER (PARTITION BY doula_id, certificate_type ORDER BY issued_date DESC, created_at DESC) as rn
  FROM certificates
  WHERE status = 'active'
)
UPDATE certificates SET status = 'superseded'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
