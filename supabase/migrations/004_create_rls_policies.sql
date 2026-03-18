-- Enable RLS on all tables
ALTER TABLE doulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Admin full access (authenticated users)
CREATE POLICY "admin_all_doulas" ON doulas
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_exam_results" ON exam_results
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_certificates" ON certificates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read for certificate verification (anon)
-- Only expose limited columns via a function
CREATE OR REPLACE FUNCTION public.verify_certificate(code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'full_name', d.full_name,
    'full_name_zh', d.full_name_zh,
    'certificate_type', c.certificate_type,
    'certificate_number', c.certificate_number,
    'issued_date', c.issued_date,
    'expiration_date', c.expiration_date,
    'status', d.status
  ) INTO result
  FROM certificates c
  JOIN doulas d ON d.id = c.doula_id
  WHERE c.verification_code = code;

  RETURN result;
END;
$$;
