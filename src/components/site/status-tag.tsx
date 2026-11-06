/**
 * KIT:TAGS.
 * StatusTag: record status, uppercase 12/700, 2px radius, copied from VerifyRecord.
 *   Use it wherever a credential's status is shown, on records and in page result lists.
 *   The tags differ in lightness and icon, not only hue.
 * PageTag: sentence case 14/600, 4px radius. On pages it marks only unconfirmed facts.
 */
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type StatusKind =
  | 'active'
  | 'current'
  | 'authorized'
  | 'completed'
  | 'superseded'
  | 'expired'
  | 'retired'
  | 'suspended'
  | 'revoked'
  | 'withdrawn';

type Tone = 'good' | 'lapsed' | 'retired' | 'suspended' | 'revoked';

const TONE: Record<StatusKind, Tone> = {
  active: 'good',
  current: 'good',
  authorized: 'good',
  completed: 'good',
  superseded: 'lapsed',
  expired: 'lapsed',
  retired: 'retired',
  suspended: 'suspended',
  revoked: 'revoked',
  withdrawn: 'revoked',
};

const TONE_CLASS: Record<Tone, string> = {
  good: 'bg-ada2-good-bg text-ada2-good-text border-transparent',
  lapsed: 'bg-white text-ada2-lapsed-text border-ada2-lapsed',
  retired: 'bg-ada2-retired-bg text-ada2-retired-text border-transparent',
  suspended: 'bg-ada2-suspended text-white border-transparent',
  revoked: 'bg-ada2-revoked text-white border-transparent',
};

function StatusGlyph({ kind }: { kind: StatusKind }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'square' as const,
    'aria-hidden': true,
    focusable: false,
  };
  switch (TONE[kind]) {
    case 'good':
      return <svg {...common} strokeWidth={2}><path d="M3.5 8.5l3 3 6-7" /></svg>;
    case 'lapsed':
      return kind === 'expired' ? (
        <svg {...common} strokeWidth={1.6}><circle cx="8" cy="8" r="5.5" /><path d="M5.5 8h5" /></svg>
      ) : (
        <svg {...common} strokeWidth={2}><path d="M3 8h9M9 5l3 3-3 3" /></svg>
      );
    case 'retired':
      return <svg {...common} strokeWidth={2}><path d="M4 8h8" /></svg>;
    case 'suspended':
      return <svg {...common} strokeWidth={2}><path d="M5.5 4v8M10.5 4v8" /></svg>;
    case 'revoked':
      return <svg {...common} strokeWidth={2}><path d="M4 4l8 8M12 4l-8 8" /></svg>;
  }
}

export function StatusTag({
  status,
  children,
  className,
}: {
  status: StatusKind;
  /** Override the label (default: site.status.<status>). */
  children?: ReactNode;
  className?: string;
}) {
  const t = useTranslations('site.status');
  const labels: Record<StatusKind, string> = {
    active: t('active'),
    current: t('current'),
    authorized: t('authorized'),
    completed: t('completed'),
    superseded: t('superseded'),
    expired: t('expired'),
    retired: t('retired'),
    suspended: t('suspended'),
    revoked: t('revoked'),
    withdrawn: t('withdrawn'),
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 box-border min-h-[26px] px-2.5 border-[1.5px] border-solid rounded-[2px]',
        'font-bold text-[12px] leading-none tracking-[0.08em] uppercase whitespace-nowrap',
        TONE_CLASS[TONE[status]],
        className
      )}
    >
      <StatusGlyph kind={status} />
      {children ?? labels[status]}
    </span>
  );
}

/** Sentence-case page tag (KIT:TAGS right column). `onIndigo` for the hero and CTA box. */
export function PageTag({
  children,
  onIndigo = false,
  size = 'md',
  className,
}: {
  children: ReactNode;
  onIndigo?: boolean;
  /** md = 28px (14/18) · sm = 24px (13/16, inside tile facts). */
  size?: 'md' | 'sm';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center box-border border-[1.5px] border-solid rounded-[4px] font-semibold whitespace-nowrap',
        size === 'md' ? 'min-h-[28px] px-2.5 text-[14px] leading-[18px]' : 'min-h-[24px] px-2 text-[13px] leading-4',
        onIndigo ? 'min-h-[26px] border-white text-white bg-transparent' : 'bg-white border-ada2-tag-border text-ada2-tag-text',
        className
      )}
    >
      {children}
    </span>
  );
}

// ---- DB status → tag -------------------------------------------------------

/** doula_credentials.status (active | expired | suspended | revoked). */
export function credentialStatusTag(status: string | null | undefined): StatusKind | null {
  switch (status) {
    case 'active':
    case 'expired':
    case 'suspended':
    case 'revoked':
      return status;
    default:
      return null;
  }
}

/** certificates.status (active | superseded | revoked). An active certificate reads "Current". */
export function certificateStatusTag(status: string | null | undefined): StatusKind | null {
  switch (status) {
    case 'active':
      return 'current';
    case 'superseded':
    case 'revoked':
      return status;
    default:
      return null;
  }
}
