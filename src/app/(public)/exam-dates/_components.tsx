/**
 * Page parts for the candidate pages (/exam-dates, /exam-day) and helpers the
 * home page shares. Markup is copied from KitC (KIT:RULED-ROWS, KIT:TABLE,
 * KIT:LINK-LIST), cut down to sit INSIDE an inner page's main column: the kit
 * components in src/components/site wrap themselves in .ada2-wrap and a
 * full-bleed section, which would double the gutter here.
 */
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import { inlineLinkClassName } from '@/components/site/pill';
import type { Locale } from '@/i18n/config';
import { CONTACT, PROGRAM_LANGUAGES, type ProgramLanguage } from '@/lib/facts';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Rich-text tags (inline links are ink and underlined, KitC)
// ---------------------------------------------------------------------------

/** `<link>…</link>` → an inline link to `href`. */
export function linkTag(href: string) {
  return function InlineLinkTag(chunks: ReactNode) {
    return (
      <Link href={href} className={inlineLinkClassName}>
        {chunks}
      </Link>
    );
  };
}

/** `<mail>{email}</mail>` and `<tel>{phone}</tel>` → ADA's real email and phone links. */
export const contactTags = {
  mail: (chunks: ReactNode) => (
    <a href={`mailto:${CONTACT.email}`} className={cn(inlineLinkClassName, 'whitespace-nowrap')}>
      {chunks}
    </a>
  ),
  tel: (chunks: ReactNode) => (
    <a href={`tel:${CONTACT.phone.tel}`} className={cn(inlineLinkClassName, 'whitespace-nowrap')}>
      {chunks}
    </a>
  ),
};

/** The values those tags wrap. */
export const contactValues = { email: CONTACT.email, phone: CONTACT.phone.display };

// ---------------------------------------------------------------------------
// Copy helpers
// ---------------------------------------------------------------------------

const LIST_LOCALE: Record<Locale, string> = {
  'en': 'en-GB', // "A, B and C" (no serial comma), like the rest of the site's dates
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
};

/**
 * Join names the way the locale does: "A, B and C" / "A、B和C". In Chinese, a
 * conjunction between two Latin names gets a space each side, as everywhere
 * else on the site ("Carrot Fertility 和 Progyny", like "ADA 认证").
 */
export function formatList(items: readonly string[], locale: Locale, type: 'conjunction' | 'disjunction' = 'conjunction') {
  const out = new Intl.ListFormat(LIST_LOCALE[locale] ?? 'en-GB', { style: 'long', type }).format(items);
  if (locale !== 'zh-cn' && locale !== 'zh-tw') return out;
  return out.replace(/([A-Za-z0-9)])(和|或)([A-Za-z0-9(])/g, '$1 $2 $3');
}

/**
 * The training and exam languages from facts.ts (in their order), named in the
 * page's language. `names` comes from the page namespace's `languages.*` keys.
 */
export function programLanguages(
  names: Record<ProgramLanguage, string>,
  locale: Locale,
  type: 'conjunction' | 'disjunction' = 'conjunction'
) {
  return formatList(PROGRAM_LANGUAGES.map((l) => names[l.code]), locale, type);
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

/** Inner page body: the main column and the right-rail CTA box, in a flex-wrap row (KitC inner page). */
export function PageColumns({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  return (
    <div className="ada2-wrap flex flex-wrap items-start gap-x-12 gap-y-10 pt-8 pb-16 sm:pt-12 sm:pb-[104px]">
      <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-12 sm:gap-16">{children}</div>
      {rail}
    </div>
  );
}

/** The page's H1, lead sentence and an optional small note. */
export function PageIntro({ title, lead, note }: { title: ReactNode; lead?: ReactNode; note?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">{title}</h1>
      {lead ? (
        <p className="m-0 max-w-[760px] text-[20px] leading-[28px] sm:text-[22px] sm:leading-[31px] font-light text-ada2-body [text-wrap:pretty]">
          {lead}
        </p>
      ) : null}
      {note ? <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{note}</p> : null}
    </div>
  );
}

/** H2 at the kit's 36/44 light, stepping down to 28/34 on phones (HomeCMobile). */
export const h2ClassName =
  'm-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink [text-wrap:balance]';

/** A titled section of the main column. */
export function PageSection({
  id,
  title,
  children,
  gap = 'md',
  className,
}: {
  /** Used for the anchor and, with "-title", the heading id. */
  id: string;
  title: ReactNode;
  children: ReactNode;
  /** Space under the heading: md = 20px (rows, link lists), sm = 16px (tables). */
  gap?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('flex flex-col scroll-mt-6', gap === 'sm' ? 'gap-4' : 'gap-5', className)}
    >
      <h2 id={`${id}-title`} className={h2ClassName}>
        {title}
      </h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Ruled rows (KIT:RULED-ROWS list only)
// ---------------------------------------------------------------------------

export interface Row {
  label: ReactNode;
  value: ReactNode;
}

/** Label/value rows under a 2px ink rule. Every row must say something different. */
export function Rows({ rows, labelWidth = 160 }: { rows: Row[]; labelWidth?: number }) {
  return (
    <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
      {rows.map((r, i) => (
        <div key={i} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
          <dt className="font-semibold text-ada2-ink" style={{ flex: `0 0 ${labelWidth}px` }}>
            {r.label}
          </dt>
          <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// Table (KIT:TABLE: dark header row)
// ---------------------------------------------------------------------------

export interface TableColumn {
  label: ReactNode;
}

/**
 * A dark-header table. From 640px up it keeps `minWidth` and scrolls sideways
 * inside its own frame if it must (the page never does); on phones it fits the
 * column and its cells wrap. The first cell of each row is the row header.
 */
export function DataTable({
  caption,
  columns,
  rows,
  minWidth = 600,
}: {
  caption: ReactNode;
  columns: TableColumn[];
  rows: ReactNode[][];
  minWidth?: number;
}) {
  const th = 'text-left align-bottom py-3 px-3 sm:px-4 text-[14px] leading-[18px] font-semibold';
  return (
    <div className="relative overflow-x-auto border border-ada2-hairline" role="region" aria-label={typeof caption === 'string' ? caption : undefined} tabIndex={0}>
      <table
        className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums] sm:min-w-[var(--table-min)]"
        style={{ '--table-min': `${minWidth}px` } as CSSProperties}
      >
        <caption className="ada2-sr">{caption}</caption>
        <thead>
          <tr className="bg-ada2-table-head text-white">
            {columns.map((c, i) => (
              <th key={i} scope="col" className={th}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => {
            const border = r === rows.length - 1 ? '' : 'border-b border-ada2-hairline';
            return (
              <tr key={r}>
                {cells.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row" className={cn('text-left align-top py-2.5 px-3 sm:px-4 font-bold text-ada2-ink sm:whitespace-nowrap', border)}>
                      {cell}
                    </th>
                  ) : (
                    <td key={c} className={cn('align-top py-2.5 px-3 sm:px-4', border)}>
                      {cell}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Link list (KIT:LINK-LIST list only)
// ---------------------------------------------------------------------------

export interface LinkRow {
  href: string;
  label: ReactNode;
  description?: ReactNode;
}

/** One ruled row per destination, each with a one-line reason to go there. */
export function LinkRows({ items }: { items: LinkRow[] }) {
  return (
    <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-12 border-t-2 border-ada2-ink">
      {items.map((item, i) => (
        <li key={i} className="border-b border-ada2-hairline">
          <Link
            href={item.href}
            className="flex items-center justify-between gap-4 min-h-[72px] box-border py-3 px-1 text-ada2-ink no-underline hover:bg-ada2-band hover:text-ada2-ink"
          >
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[18px] leading-6 font-semibold">{item.label}</span>
              {item.description ? (
                <span className="text-[15px] leading-[22px] text-ada2-muted [text-wrap:pretty]">{item.description}</span>
              ) : null}
            </span>
            <ArrowIcon className="flex-none" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
