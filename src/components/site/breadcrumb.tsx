/**
 * KIT:BREADCRUMB. Directly under the header on every inner page and record
 * page, never on the home page. Links are ink and underlined; the current page
 * (the last item) is plain text. "Home" is added for you.
 */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Fragment, type ReactNode } from 'react';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Omit on the last item (the current page). */
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const t = useTranslations('site.breadcrumb');
  const all: BreadcrumbItem[] = [{ label: t('home'), href: '/' }, ...items];
  return (
    <nav aria-label={t('label')} className="bg-ada2-band border-b border-ada2-band-rule print:hidden">
      <ol className="ada2-wrap flex flex-wrap items-center gap-x-2.5 text-[14px] leading-5 text-ada2-muted">
        {all.map((item, i) => {
          const last = i === all.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && <li aria-hidden="true">/</li>}
              {last || !item.href ? (
                <li
                  aria-current={last ? 'page' : undefined}
                  className="inline-flex items-center min-h-[44px] text-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]"
                >
                  {item.label}
                </li>
              ) : (
                <li>
                  <Link
                    href={item.href}
                    className="inline-flex items-center min-h-[44px] text-ada2-body underline underline-offset-[3px] hover:text-black"
                  >
                    {item.label}
                  </Link>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
