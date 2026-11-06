/**
 * KIT:TABLE, cut down to what the database actually holds.
 *
 * `exam_sessions` has the exam date, type, location and status only, so this
 * table shows Exam date* · Exam · Location · Status · Register. It never
 * prints a register-by, late-registration or results-by date (none exist).
 * With no sessions it shows the live site's fallback:
 *   "Exam sessions are scheduled after each training cohort. Contact us for the next date."
 *
 * Usage (server component):
 *   const sessions = await getUpcomingExamSessions();
 *   <DatesTable sessions={sessions} title={heading} intro={feeSentence} />
 */
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { EXAM, range } from '@/lib/facts';
import type { ExamSession } from '@/lib/exam-sessions';
import { formatExamDate } from '@/lib/site-dates';
import { inlineLinkClassName, Pill } from './pill';

export interface DatesTableProps {
  sessions: ExamSession[];
  title?: ReactNode;
  /** Heading id. Default "dates-title". */
  id?: string;
  /** A sentence under the title (e.g. the fee, from facts.ts). */
  intro?: ReactNode;
  /** Where each row's Register pill goes. Default /support/contact (registration is by contacting ADA). Pass null to hide the column. */
  registerHref?: string | null;
  /** Show the Exam column. Default: only when the sessions mix postpartum and birth. */
  showType?: boolean;
  /** Show the Location column. Default: when any session has a location. */
  showLocation?: boolean;
  /** Where the empty state's contact link goes. Default /support/contact. */
  contactHref?: string;
}

const th = 'text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold';

export function DatesTable({
  sessions,
  title,
  id = 'dates-title',
  intro,
  registerHref = '/support/contact',
  showType,
  showLocation,
  contactHref = '/support/contact',
}: DatesTableProps) {
  const t = useTranslations('site.dates');
  const tType = useTranslations('site.examType');
  const locale = useLocale() as Locale;

  const typeLabel = (s: ExamSession) => (s.examType === 'birth' ? tType('birth') : tType('postpartum'));
  const withType = showType ?? new Set(sessions.map((s) => s.examType)).size > 1;
  const withLocation = showLocation ?? sessions.some((s) => s.location);

  return (
    <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-4">
      {title ? (
        <h2 id={id} className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink [text-wrap:balance]">
          {title}
        </h2>
      ) : null}
      {intro ? <p className="m-0 text-ada2-body [text-wrap:pretty]">{intro}</p> : null}

      {sessions.length === 0 ? (
        <div className="flex flex-col gap-1 py-4 border-t-2 border-ada2-ink border-b border-b-ada2-hairline">
          <p className="m-0 text-ada2-body [text-wrap:pretty]">
            {t('empty')}{' '}
            <Link href={contactHref} className={`${inlineLinkClassName} font-semibold`}>
              {t('emptyAction')}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto border border-ada2-hairline">
            <table className="w-full min-w-[560px] border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]">
              <caption className="ada2-sr">{t('caption')}</caption>
              <thead>
                <tr className="bg-ada2-table-head text-white">
                  <th scope="col" className={th}>{t('date')}</th>
                  {withType && <th scope="col" className={th}>{t('type')}</th>}
                  {withLocation && <th scope="col" className={th}>{t('location')}</th>}
                  <th scope="col" className={th}>{t('status')}</th>
                  {registerHref && (
                    <th scope="col" className="py-3 px-4">
                      <span className="ada2-sr">{t('register')}</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => {
                  const last = i === sessions.length - 1;
                  const cell = last ? '' : 'border-b border-ada2-hairline';
                  const date = formatExamDate(s.date, locale);
                  return (
                    <tr key={s.id}>
                      <th scope="row" className={`text-left py-2.5 px-4 font-bold text-ada2-ink whitespace-nowrap ${cell}`}>
                        {date}
                      </th>
                      {withType && <td className={`py-2.5 px-4 whitespace-nowrap ${cell}`}>{typeLabel(s)}</td>}
                      {withLocation && <td className={`py-2.5 px-4 min-w-[200px] ${cell}`}>{s.location ?? '—'}</td>}
                      <td className={`py-2.5 px-4 font-semibold text-ada2-tag-text whitespace-nowrap ${cell}`}>
                        {s.status === 'active' ? t('statusToday') : t('statusScheduled')}
                      </td>
                      {registerHref && (
                        <td className={`py-2 px-4 text-right ${cell}`}>
                          <Pill
                            href={registerHref}
                            size="sm"
                            variant="primary"
                            aria-label={t('registerFor', { date, type: typeLabel(s) })}
                          >
                            {t('register')}
                          </Pill>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-1 text-[14px] leading-[21px] text-ada2-muted">
            <p className="m-0 [text-wrap:pretty]">
              {t('noteFormat', { written: EXAM.writtenMinutes, practical: EXAM.practicalMinutes })}
            </p>
            <p className="m-0 [text-wrap:pretty]">{t('noteResults', { days: range(EXAM.resultsBusinessDays) })}</p>
          </div>
        </>
      )}
    </div>
  );
}
