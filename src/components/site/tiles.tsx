/**
 * KIT:TILES. Hub pages only, once. Three tiles at most, at unequal weight: one
 * wide primary tile (it carries the next date and the fee, plus a Register
 * pill) and up to two narrower tiles with ruled sublinks. A flex-wrap row,
 * never grid-column: span. The registry is not a program and never gets a tile.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowIcon, ChevronIcon } from './icons';
import { ArrowLink, Pill } from './pill';

export interface PrimaryTile {
  title: ReactNode;
  href: string;
  description: ReactNode;
  /** Key facts (e.g. Next exam · Exam fee). Values from facts.ts or a real session only. */
  facts?: { label: ReactNode; value: ReactNode }[];
  /** The tile's indigo pill. */
  action?: { href: string; label: ReactNode; 'aria-label'?: string };
  /** A standalone → link beside the pill. */
  link?: { href: string; label: ReactNode };
}

export interface SecondaryTile {
  title: ReactNode;
  href: string;
  description: ReactNode;
  links?: { href: string; label: ReactNode }[];
}

export interface TilesProps {
  title: ReactNode;
  /** Heading id. Default "tiles-title". */
  id?: string;
  primary: PrimaryTile;
  /** At most two; more are dropped. */
  others?: SecondaryTile[];
}

export function Tiles({ title, id = 'tiles-title', primary, others = [] }: TilesProps) {
  const shown = others.slice(0, 2);
  return (
    <section aria-labelledby={id} className="bg-white">
      <div className="ada2-wrap flex flex-col gap-7">
        <h2 id={id} className="m-0 text-[28px] leading-[34px] sm:text-[36px] sm:leading-[44px] font-light text-ada2-ink">
          {title}
        </h2>
        <div className="flex flex-wrap items-stretch gap-8">
          <article
            aria-labelledby={`${id}-primary`}
            className="flex-[2_1_560px] min-w-0 box-border flex flex-col gap-5 pt-6 px-7 pb-7 bg-ada2-band border-t-2 border-ada2-ink"
          >
            <h3 id={`${id}-primary`} className="m-0">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-3 min-h-[44px] text-ada2-ink text-[28px] leading-[34px] font-normal no-underline hover:text-black"
              >
                {primary.title}
                <ArrowIcon size={22} className="flex-none" />
              </Link>
            </h3>
            <p className="m-0 max-w-[560px] text-ada2-body [text-wrap:pretty]">{primary.description}</p>
            {primary.facts && primary.facts.length > 0 && (
              <dl className="m-0 flex flex-wrap gap-x-10 gap-y-4 py-4 border-y border-ada2-hairline [font-variant-numeric:tabular-nums_lining-nums]">
                {primary.facts.map((f, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <dt className="text-[14px] leading-5 font-semibold text-ada2-muted">{f.label}</dt>
                    <dd className="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[20px] leading-7 font-semibold text-ada2-ink">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {(primary.action || primary.link) && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {primary.action ? (
                  <Pill href={primary.action.href} variant="primary" aria-label={primary.action['aria-label']}>
                    {primary.action.label}
                  </Pill>
                ) : null}
                {primary.link ? (
                  <ArrowLink href={primary.link.href} size="sm">
                    {primary.link.label}
                  </ArrowLink>
                ) : null}
              </div>
            )}
          </article>
          {shown.map((tile, i) => (
            <article
              key={i}
              aria-labelledby={`${id}-other-${i}`}
              className="flex-[1_1_260px] min-w-0 flex flex-col border-t-2 border-ada2-ink"
            >
              <h3 id={`${id}-other-${i}`} className="m-0">
                <Link
                  href={tile.href}
                  className="flex items-center justify-between gap-3 min-h-[44px] pt-5 pb-1.5 text-ada2-ink text-[24px] leading-[30px] font-normal no-underline hover:bg-ada2-band hover:text-ada2-ink"
                >
                  {tile.title}
                  <ArrowIcon size={20} className="flex-none" />
                </Link>
              </h3>
              <p className="m-0 pb-[18px] text-[16px] leading-6 text-ada2-muted [text-wrap:pretty]">{tile.description}</p>
              {tile.links && tile.links.length > 0 && (
                <ul className="border-b border-ada2-hairline">
                  {tile.links.map((l, j) => (
                    <li key={j} className="border-t border-ada2-hairline">
                      <Link
                        href={l.href}
                        className="flex items-center justify-between gap-3 min-h-[48px] text-ada2-body text-[16px] leading-[22px] no-underline hover:bg-ada2-band hover:text-ada2-body"
                      >
                        {l.label}
                        <ChevronIcon />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
