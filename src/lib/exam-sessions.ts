/**
 * Upcoming ADA exam sessions, read live from `exam_sessions` (anon SELECT is
 * allowed by RLS, migration 015). SERVER ONLY: it reads with the service role
 * (never shipped to the client) and selects only public columns.
 *
 * Gate 1 of the build plan: exam dates come ONLY from this table. There is no
 * fallback data. On any error, or when the table has no upcoming rows, this
 * returns [] and the page shows the empty state (DatesTable does it for you).
 *
 * The table holds only the exam DATE, type, location and status. It has no
 * registration deadline, late-registration date or results date, so pages
 * must not print those.
 */
import { unstable_noStore as noStore } from 'next/cache';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { todayInPacific } from '@/lib/site-dates';

export type ExamType = 'postpartum' | 'birth';
export const PUBLIC_EXAM_TYPES: readonly ExamType[] = ['postpartum', 'birth'];

export interface ExamSession {
  id: string;
  examType: ExamType;
  /** Calendar date, "YYYY-MM-DD" (Postgres DATE). Format with formatExamDate(). */
  date: string;
  /** Free text from the admin, e.g. the exam-site address. May be null. */
  location: string | null;
  /** 'pending' = scheduled; 'active' = the exam is running today. Completed sessions are excluded. */
  status: 'pending' | 'active';
}

export interface UpcomingExamOptions {
  /** One exam type only. Default: postpartum and birth. */
  type?: ExamType;
  /** Max rows after de-duplication. */
  limit?: number;
}

/**
 * Sessions with scheduled_date >= today (Pacific), not completed, ordered by
 * date ascending. Rows with the same type, date and location are merged (the
 * admin may open several sessions for one sitting). Never selects
 * `session_code`, which is the candidates' exam join code.
 */
export async function getUpcomingExamSessions(options: UpcomingExamOptions = {}): Promise<ExamSession[]> {
  noStore();
  try {
    // Service-role read on the server: does not depend on the anon key (which 401s locally).
    // Only non-sensitive columns are selected; session_code is never read.
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );
    const types = options.type ? [options.type] : [...PUBLIC_EXAM_TYPES];

    const { data, error } = await supabase
      .from('exam_sessions')
      .select('id, exam_type, status, location, scheduled_date')
      .gte('scheduled_date', todayInPacific())
      .in('exam_type', types)
      .neq('status', 'completed')
      .order('scheduled_date', { ascending: true })
      .limit(200);

    if (error || !data) return [];

    const seen = new Set<string>();
    const sessions: ExamSession[] = [];
    for (const row of data as {
      id: string;
      exam_type: string;
      status: string;
      location: string | null;
      scheduled_date: string | null;
    }[]) {
      if (!row.scheduled_date) continue;
      if (row.exam_type !== 'postpartum' && row.exam_type !== 'birth') continue;
      const date = row.scheduled_date.slice(0, 10);
      const location = row.location?.trim() || null;
      const key = `${row.exam_type}|${date}|${location ?? ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      sessions.push({
        id: row.id,
        examType: row.exam_type,
        date,
        location,
        status: row.status === 'active' ? 'active' : 'pending',
      });
    }
    return typeof options.limit === 'number' ? sessions.slice(0, options.limit) : sessions;
  } catch {
    return [];
  }
}

/** The next upcoming session (optionally of one type), or null. */
export async function getNextExamSession(type?: ExamType): Promise<ExamSession | null> {
  const [next] = await getUpcomingExamSessions({ type, limit: 1 });
  return next ?? null;
}
