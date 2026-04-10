-- Exam sessions for admin-controlled exam management
CREATE TABLE IF NOT EXISTS exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code TEXT UNIQUE NOT NULL,
  exam_type TEXT NOT NULL DEFAULT 'postpartum',
  status TEXT NOT NULL DEFAULT 'pending',
  exam_part TEXT NOT NULL DEFAULT 'written',
  location TEXT,
  scheduled_date DATE NOT NULL,
  started_at TIMESTAMPTZ,
  duration_minutes INT NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow authenticated users (admins) full access
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage exam sessions" ON exam_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous read access (exam pages need to poll status)
CREATE POLICY "Anyone can read exam sessions" ON exam_sessions
  FOR SELECT
  TO anon
  USING (true);
