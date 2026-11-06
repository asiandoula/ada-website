/**
 * Standing (article 2) and public actions (article 4), shared by the sheet and
 * the phone view. Wording follows VerifyRecordLapsed: expired is a neutral,
 * administrative lapse; suspended and revoked are "Not in good standing".
 * No suspension dates exist in the database, so none are printed; a
 * revocation date is printed only when certificates.revoked_at has one.
 */
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { todayInPacific } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import type { PublicRecord, Standing } from '../../_lib/registry';
import { credentialLabel, formatDay, joinList, type Translate } from '../../_lib/text';

export function standingCopy(record: PublicRecord, t: Translate, locale: Locale): { title: string; body: string } {
  const label = (type: Parameters<typeof credentialLabel>[1]) => credentialLabel(t, type);
  switch (record.standing) {
    case 'good':
      return { title: t('standing.good'), body: t('standing.goodBody') };
    case 'retired':
      return { title: t('standing.retired'), body: t('standing.retiredBody') };
    case 'suspended': {
      const list = record.credentials.filter((c) => c.status === 'suspended');
      return {
        title: t('standing.notGood'),
        body: t('standing.suspendedBody', { count: list.length, credentials: joinList(list.map((c) => label(c.type)), locale) }),
      };
    }
    case 'revoked': {
      const list = record.credentials.filter((c) => c.status === 'revoked');
      if (list.length === 1 && list[0].revokedOn) {
        return {
          title: t('standing.notGood'),
          body: t('standing.revokedBodyOn', { credentials: label(list[0].type), date: formatDay(list[0].revokedOn, locale) }),
        };
      }
      return {
        title: t('standing.notGood'),
        body: t('standing.revokedBody', { count: list.length, credentials: joinList(list.map((c) => label(c.type)), locale) }),
      };
    }
    case 'lapsed': {
      const today = todayInPacific();
      const list = record.credentials.filter((c) => c.status === 'expired');
      if (list.length === 1) {
        const c = list[0];
        return {
          title: t('standing.lapsed'),
          body:
            c.periodEnds && c.periodEnds < today
              ? t('standing.lapsedOne', { credential: label(c.type), date: formatDay(c.periodEnds, locale) })
              : t('standing.lapsedOneNoDate', { credential: label(c.type) }),
        };
      }
      return { title: t('standing.lapsed'), body: t('standing.lapsedMany') };
    }
  }
}

const GLYPH_BG: Record<Standing, string> = {
  good: 'bg-ada2-good text-white',
  retired: 'bg-ada2-retired-bg text-ada2-retired-text',
  lapsed: 'bg-white text-ada2-lapsed-text border-2 border-solid border-ada2-lapsed',
  suspended: 'bg-ada2-suspended text-white',
  revoked: 'bg-ada2-revoked text-white',
};

export function StandingPath({ standing }: { standing: Standing }) {
  switch (standing) {
    case 'good':
      return <path d="M3.5 8.5l3 3 6-7" />;
    case 'suspended':
      return <path d="M5.5 4v8M10.5 4v8" />;
    case 'revoked':
      return <path d="M4 4l8 8M12 4l-8 8" />;
    default:
      return <path d="M4 8h8" />;
  }
}

export function StandingGlyph({ standing, size = 44 }: { standing: Standing; size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn('flex-none box-border rounded-full flex items-center justify-center', GLYPH_BG[standing])}
    >
      <svg width={size / 2} height={size / 2} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" focusable="false">
        <StandingPath standing={standing} />
      </svg>
    </span>
  );
}

/** Values for the Suspension / Revocation rows; undefined prints "None". */
export function publicActionRows(record: PublicRecord, t: Translate, locale: Locale): { suspension?: ReactNode; revocation?: ReactNode } {
  const suspended = record.credentials.filter((c) => c.status === 'suspended');
  const revoked = record.credentials.filter((c) => c.status === 'revoked');
  const sub = 'block font-site text-[15px] leading-[22px] text-ada2-record-soft';

  const suspension = suspended.length ? (
    <span className="flex flex-col gap-1">
      {suspended.map((c) => (
        <span key={c.type} className="flex flex-col">
          <span className="font-semibold">{t('actions.inEffect')}</span>
          <span className={sub}>{t('actions.credential', { credential: credentialLabel(t, c.type) })}</span>
        </span>
      ))}
    </span>
  ) : undefined;

  const revocation = revoked.length ? (
    <span className="flex flex-col gap-1">
      {revoked.map((c) => (
        <span key={c.type} className="flex flex-col">
          <span className="font-semibold">
            {c.revokedOn ? t('actions.effective', { date: formatDay(c.revokedOn, locale) }) : t('actions.onFile')}
          </span>
          <span className={sub}>{t('actions.credential', { credential: credentialLabel(t, c.type) })}</span>
        </span>
      ))}
    </span>
  ) : undefined;

  return { suspension, revocation };
}

/** Plain text for the phone view's "Suspension: …" list. */
export function publicActionText(record: PublicRecord, t: Translate, locale: Locale): { suspension: string; revocation: string } {
  const none = t('credentials.none');
  const suspended = record.credentials.filter((c) => c.status === 'suspended');
  const revoked = record.credentials.filter((c) => c.status === 'revoked');
  return {
    suspension: suspended.length
      ? suspended.map((c) => t('actions.withCredential', { action: t('actions.inEffect'), credential: credentialLabel(t, c.type) })).join(t('actions.separator'))
      : none,
    revocation: revoked.length
      ? revoked
          .map((c) =>
            t('actions.withCredential', {
              action: c.revokedOn ? t('actions.effective', { date: formatDay(c.revokedOn, locale) }) : t('actions.onFile'),
              credential: credentialLabel(t, c.type),
            })
          )
          .join(t('actions.separator'))
      : none,
  };
}
