/**
 * KIT:ALERT, conditional. Renders ONLY when a real exam session falls within
 * the next 14 days (from 14 days before the exam until exam day, Pacific
 * time), then disappears by itself. Dismissible. Never a permanent fixture.
 * Place it between the header and the hero.
 *
 *   const sessions = await getUpcomingExamSessions();
 *   <AlertCard sessions={sessions} />
 */
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import { EXAM, range } from '@/lib/facts';
import type { ExamSession } from '@/lib/exam-sessions';
import { formatExamDate, isWithinDays, todayInPacific } from '@/lib/site-dates';
import { AlertCardView } from './alert-card-view';

export interface AlertCardProps {
  /** Upcoming sessions (ascending), from getUpcomingExamSessions(). */
  sessions: ExamSession[];
  /** Window in days. Default 14. */
  days?: number;
  /** Where "Exam day and ID" goes. Default /exam-day. */
  href?: string;
  /** "YYYY-MM-DD" override for tests; default today in Pacific time. */
  today?: string;
}

export function AlertCard({ sessions, days = 14, href = '/exam-day', today }: AlertCardProps) {
  const t = useTranslations('site.alert');
  const locale = useLocale() as Locale;
  const now = today ?? todayInPacific();
  const session = sessions.find((s) => isWithinDays(s.date, days, now));
  if (!session) return null;

  return (
    <AlertCardView
      storageKey={`ada-exam-alert-dismissed:${session.date}`}
      label={t('label')}
      title={t('title', { date: formatExamDate(session.date, locale) })}
      body={t('body', { days: range(EXAM.resultsBusinessDays) })}
      linkLabel={t('link')}
      href={href}
      dismissLabel={t('dismiss')}
    />
  );
}
