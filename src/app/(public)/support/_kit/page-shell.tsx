/**
 * Inner-page building blocks for the Help, FAQ, Legal, Donate and Articles
 * pages (Direction C, KitC). The shared kit's RuledRows / LinkList wrap
 * themselves in `.ada2-wrap`, so they cannot sit inside an inner page's main
 * column; these are the same markup without the page column.
 *
 * Layout (boards Support / FAQ / Legal / Articles / Article):
 *   .ada2-wrap, 48px top, 104px bottom, flex-wrap row, gap 40px 48px
 *   main column flex 999 1 640px · CtaBox rail flex 1 1 300px (max 380px)
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import { cn } from '@/lib/utils';

export function InnerPage({
  children,
  rail,
  mainClassName,
  as: Main = 'div',
  mainLabelledBy,
}: {
  children: ReactNode;
  /** The right-rail CtaBox. */
  rail?: ReactNode;
  mainClassName?: string;
  as?: 'div' | 'article';
  mainLabelledBy?: string;
}) {
  return (
    <div className="ada2-wrap pt-12 pb-[104px] flex flex-wrap items-start gap-x-12 gap-y-10">
      <Main
        aria-labelledby={mainLabelledBy}
        className={cn('flex-[999_1_640px] min-w-0 flex flex-col gap-16', mainClassName)}
      >
        {children}
      </Main>
      {rail}
    </div>
  );
}

/** H1 block of an inner page: light H1, 22/31 lead, optional 14/21 note. */
export function PageIntro({
  title,
  lead,
  note,
  id,
  className,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  note?: ReactNode;
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h1
        id={id}
        className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance]"
      >
        {title}
      </h1>
      {lead ? (
        <p className="m-0 max-w-[760px] text-[22px] leading-[31px] font-light text-ada2-body [text-wrap:pretty]">{lead}</p>
      ) : null}
      {note ? <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">{note}</p> : null}
      {children}
    </div>
  );
}

export const h2Class = 'm-0 text-[36px] leading-[44px] font-light text-ada2-ink [text-wrap:balance]';

/** A titled page section (H2 36/44 light). */
export function PageSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('flex flex-col gap-4 scroll-mt-6', className)}>
      <h2 id={`${id}-title`} className={h2Class}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Body paragraph inside a section (max 760px). */
export function SectionText({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('m-0 max-w-[760px] text-ada2-body [text-wrap:pretty]', className)}>{children}</p>;
}

export interface DefRow {
  label: ReactNode;
  value: ReactNode;
}

/** Label / value rows under a 2px ink rule (KIT:RULED-ROWS without the page column). */
export function DefRows({
  rows,
  labelWidth = 160,
  rowClassName = 'py-3',
  className,
}: {
  rows: DefRow[];
  labelWidth?: number;
  rowClassName?: string;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'm-0 flex flex-col border-t-2 border-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]',
        className
      )}
    >
      {rows.map((r, i) => (
        <div key={i} className={cn('flex flex-wrap gap-x-6 gap-y-0.5 border-b border-ada2-hairline', rowClassName)}>
          <dt className="font-semibold text-ada2-ink" style={{ flex: `0 0 ${labelWidth}px` }}>
            {r.label}
          </dt>
          <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One ruled row per item (a plain list under a 2px ink rule). */
export function ItemRows({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn('m-0 p-0 list-none border-t-2 border-ada2-ink', className)}>
      {items.map((item, i) => (
        <li key={i} className="py-2.5 border-b border-ada2-hairline [text-wrap:pretty]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export interface RowLink {
  href: string;
  label: ReactNode;
  description?: ReactNode;
}

/** KIT:LINK-LIST rows without the page column: two columns from ~1000px. */
export function LinkRows({ items, className }: { items: RowLink[]; className?: string }) {
  return (
    <ul
      className={cn(
        'm-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(min(440px,100%),1fr))] gap-x-12 border-t-2 border-ada2-ink',
        className
      )}
    >
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

/** "On this page" / "In this article" jump list: a ruled grid of anchor links with a down chevron. */
export function JumpList({
  id,
  title,
  items,
  minColumn = 300,
}: {
  id: string;
  title: ReactNode;
  items: { href: string; label: ReactNode }[];
  minColumn?: number;
}) {
  return (
    <nav aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="m-0 text-[17px] leading-[22px] font-semibold text-ada2-ink">
        {title}
      </h2>
      <ul
        className="m-0 p-0 list-none grid gap-x-8 border-t-2 border-ada2-ink"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumn}px, 100%), 1fr))` }}
      >
        {items.map((item, i) => (
          <li key={i} className="border-b border-ada2-hairline">
            <a
              href={item.href}
              className="flex items-center justify-between gap-3 min-h-[48px] px-1 py-1.5 text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-body"
            >
              <span className="min-w-0 [text-wrap:pretty]">{item.label}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#6B7280"
                strokeWidth="1.5"
                aria-hidden="true"
                focusable="false"
                className="flex-none"
              >
                <path d="M3.5 6L8 10.5 12.5 6" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Dark-header table frame. The scroll region is focusable so keyboard users can scroll it. */
export function TableFrame({ label, children, minWidth = 640 }: { label: string; children: ReactNode; minWidth?: number }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="relative overflow-x-auto border border-ada2-hairline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ada2-blossom"
    >
      <table
        className="w-full border-collapse bg-white text-[16px] leading-[22px] [font-variant-numeric:tabular-nums_lining-nums]"
        style={{ minWidth }}
      >
        <caption className="ada2-sr">{label}</caption>
        {children}
      </table>
    </div>
  );
}

export const thHeadClass = 'text-left align-bottom py-3 px-4 text-[14px] leading-[18px] font-semibold';
export const thRowClass = 'text-left align-top py-3 px-4 font-bold text-ada2-ink';
export const tdClass = 'align-top py-3 px-4 [text-wrap:pretty]';

/** Small footnotes under a table (14/21 muted). */
export function Footnotes({ items }: { items: ReactNode[] }) {
  return (
    <div className="flex flex-col gap-1 text-[14px] leading-[21px] text-ada2-muted">
      {items.map((n, i) => (
        <p key={i} className="m-0 [text-wrap:pretty]">
          {n}
        </p>
      ))}
    </div>
  );
}

/** Ink, underlined inline link class (KitC). */
export const inlineLink = 'text-ada2-ink underline underline-offset-[3px] hover:text-black';
/** Blossom inline link: opens the registry or a record. */
export const registryLink =
  'text-ada2-blossom font-semibold underline underline-offset-[3px] hover:text-ada2-blossom-hover';
