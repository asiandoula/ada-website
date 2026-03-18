CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doula_id UUID NOT NULL REFERENCES doulas(id) ON DELETE CASCADE,
  exam_session TEXT,
  exam_date DATE,
  overall_score NUMERIC,
  score_terminology NUMERIC,
  score_newborn NUMERIC,
  score_lactation NUMERIC,
  score_emergency NUMERIC,
  score_practical NUMERIC,
  score_postpartum NUMERIC,
  score_knowledge NUMERIC,
  score_ethics NUMERIC,
  passed BOOLEAN,
  proficiency_level TEXT
    CHECK (proficiency_level IN ('Highly Proficient', 'Proficient', 'Not Proficient')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_exam_results_doula_id ON exam_results(doula_id);
