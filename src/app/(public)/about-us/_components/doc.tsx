/**
 * Handbook-page parts for the About pages (Governance, Board, Financials),
 * copied from the canvas boards. Server-compatible. Page copy only: these are
 * PAGES (Source Sans, light heads), not records.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import { cn } from '@/lib/utils';

/** Main column (head + sections, 64px apart) beside the right-rail CTA box. */
export function DocLayout({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="ada2-wrap pt-12 pb-[104px] flex flex-wrap items-start gap-x-12 gap-y-10">
      <div className="flex-[999_1_640px] min-w-0 flex flex-col gap-16">{children}</div>
      {aside}
    </div>
  );
}

export function DocHead({ title, lead, meta }: { title: ReactNode; lead?: ReactNode; meta?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]">
        {title}
      </h1>
      {lead ? (
        <p className="m-0 max-w-[760px] text-[clamp(20px,1.6vw,22px)] leading-[1.42] font-light text-ada2-body [text-wrap:pretty]">
          {lead}
        </p>
      ) : null}
      {meta ? <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{meta}</p> : null}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="#6B7280" strokeWidth={1.5} aria-hidden focusable={false} className="flex-none">
      <path d="M3.5 6L8 10.5 12.5 6" />
    </svg>
  );
}

/** "On this page": in-page anchors in a ruled two-column list. */
export function OnThisPage({ title, items }: { title: ReactNode; items: { href: string; label: ReactNode }[] }) {
  return (
    <nav aria-labelledby="otp-title" className="flex flex-col gap-2 print:hidden">
      <h2 id="otp-title" className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
        {title}
      </h2>
      <ul className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-8 border-t-2 border-ada2-ink">
        {items.map((item) => (
          <li key={item.href} className="border-b border-ada2-hairline">
            <a
              href={item.href}
              className="flex items-center justify-between gap-3 min-h-[48px] px-1 text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-ink"
            >
              {item.label}
              <ChevronDown />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One article of the handbook: an anchored section under a light H2. */
export function DocSection({
  id,
  title,
  titleAside,
  gap = 'md',
  children,
}: {
  id: string;
  title: ReactNode;
  /** Beside the H2 (e.g. a page tag). */
  titleAside?: ReactNode;
  /** sm 16px · md 20px · lg 24px between the parts. */
  gap?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}) {
  const heading = (
    <h2 id={`${id}-title`} className="m-0 text-[clamp(30px,2.5vw,36px)] leading-[1.22] font-light text-ada2-ink [text-wrap:balance]">
      {title}
    </h2>
  );
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('flex flex-col scroll-mt-6', gap === 'sm' && 'gap-4', gap === 'md' && 'gap-5', gap === 'lg' && 'gap-6')}
    >
      {titleAside ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
          {heading}
          {titleAside}
        </div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}

export function DocText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]', className)}>{children}</p>;
}

export function DocNote({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
      {children}
    </p>
  );
}

/** A smaller head inside an article (24/30, regular). */
export function DocH3({ children, id, className }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h3 id={id} className={cn('m-0 text-[24px] leading-[30px] font-normal text-ada2-ink [text-wrap:balance]', className)}>
      {children}
    </h3>
  );
}

export interface DocRow {
  label: ReactNode;
  value: ReactNode;
}

/** Register rows: label / value under a 2px ink rule (KIT:RULED-ROWS without the photo). */
export function Rows({ rows, labelWidth = 220, className }: { rows: DocRow[]; labelWidth?: number; className?: string }) {
  return (
    <dl className={cn('m-0 flex flex-col border-t-2 border-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]', className)}>
      {rows.map((r, i) => (
        <div key={i} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
          <dt className="font-semibold text-ada2-ink" style={{ flex: `0 0 ${labelWidth}px`, maxWidth: '100%' }}>
            {r.label}
          </dt>
          <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A ruled list of short statements. */
export function RuledList({ items, labelledBy }: { items: ReactNode[]; labelledBy?: string }) {
  return (
    <ul aria-labelledby={labelledBy} className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
      {items.map((item, i) => (
        <li key={i} className="py-3 border-b border-ada2-hairline text-ada2-body [text-wrap:pretty]">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Dark-header table in a scroll box (the page never scrolls sideways; the box does). */
export function DataTable({
  caption,
  columns,
  minWidth = 560,
  children,
}: {
  caption: string;
  /** Header cells. A column with an empty label gets a visually hidden one via `srOnly`. */
  columns: { label: ReactNode; srOnly?: boolean; align?: 'left' | 'right' }[];
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <div
      // A scroll box only when the table has a min width; then it is a focusable region so keyboard users can scroll it.
      role={minWidth > 0 ? 'region' : undefined}
      aria-label={minWidth > 0 ? caption : undefined}
      tabIndex={minWidth > 0 ? 0 : undefined}
      className="relative overflow-x-auto border border-ada2-hairline"
    >
      <table
        className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]"
        style={{ minWidth }}
      >
        <caption className="ada2-sr">{caption}</caption>
        <thead>
          <tr className="bg-ada2-table-head text-white">
            {columns.map((c, i) => (
              <th
                key={i}
                scope="col"
                className={cn(
                  'align-bottom py-3 px-3 sm:px-4 text-[14px] leading-[18px] font-semibold',
                  c.align === 'right' ? 'text-right' : 'text-left'
                )}
              >
                {c.srOnly ? <span className="ada2-sr">{c.label}</span> : c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:not(:last-child)>*]:border-b [&>tr:not(:last-child)>*]:border-ada2-hairline">{children}</tbody>
      </table>
    </div>
  );
}

/** KIT:LINK-LIST rows inside the handbook column (one column, no page wrap). */
export function DocLinkList({ id, title, items }: { id: string; title: ReactNode; items: { href: string; label: ReactNode; description?: ReactNode }[] }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <h2 id={id} className="m-0 text-[clamp(30px,2.5vw,36px)] leading-[1.22] font-light text-ada2-ink [text-wrap:balance]">
        {title}
      </h2>
      <ul className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
        {items.map((item) => (
          <li key={item.href} className="border-b border-ada2-hairline">
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
    </section>
  );
}

export const thRowClass = 'text-left align-top py-2.5 px-3 sm:px-4 font-bold text-ada2-ink';
export const tdClass = 'align-top py-2.5 px-3 sm:px-4 text-ada2-body';
