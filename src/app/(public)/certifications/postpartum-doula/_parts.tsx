/**
 * Pieces shared by the Postpartum Doula program page and its candidate
 * handbook (/exam): the module descriptions and the fee rows. Sync server
 * components (useTranslations), so they render inside the async pages.
 */
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { ModuleKey } from '@/lib/facts';
import { CERTIFICATE, EXAM, RENEWAL, usd } from '@/lib/facts';
import { B, InlineArrow, td, thRow } from '../_components/blocks';

const langSpan = (lang: string) => {
  const LangSpan = (chunks: ReactNode) => <span lang={lang}>{chunks}</span>;
  return LangSpan;
};

/** A module's description; the Cultural Traditions names carry their own lang. */
export function ModuleDescription({ moduleKey }: { moduleKey: ModuleKey }) {
  const t = useTranslations('postpartum.modules');
  return (
    <>
      {t.rich(`${moduleKey}.description`, {
        zh: langSpan('zh-Hans'),
        ko: langSpan('ko'),
        ja: langSpan('ja'),
      })}
    </>
  );
}

/** Exam, retake, renewal and tuition rows. Every amount comes from facts.ts. */
export function FeeRows() {
  const t = useTranslations('postpartum.fees');
  const rows = [
    { label: t('exam.label'), amount: B(usd(EXAM.feeUsd)), note: t('exam.note') },
    {
      label: t('retake.label'),
      amount: B(usd(EXAM.retakeFeeUsd)),
      note: t('retake.note', { pass: EXAM.passScore, max: EXAM.maxScore, days: EXAM.retakeWaitDays }),
    },
    {
      label: t('renewal.label'),
      amount: B(usd(RENEWAL.feeUsd)),
      note: t('renewal.note', { years: CERTIFICATE.validityYears }),
    },
    {
      label: t('tuition.label'),
      amount: t('tuition.amount'),
      note: t.rich('tuition.note', {
        link: (chunks) => <InlineArrow href="/programs/scholarship">{chunks}</InlineArrow>,
      }),
    },
  ];
  return (
    <>
      {rows.map((r, i) => (
        <tr key={i}>
          <th scope="row" className={`${thRow} whitespace-nowrap`}>
            {r.label}
          </th>
          <td className={td}>{r.amount}</td>
          <td className={td}>{r.note}</td>
        </tr>
      ))}
    </>
  );
}
