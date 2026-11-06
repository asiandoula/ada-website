/**
 * Category filter (Articles.dc.html): pills that are links, so the filter
 * works without JavaScript and each category has its own URL (?category=).
 * The current one is ink-filled and carries aria-current="page".
 */
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface CategoryTab {
  key: string;
  label: string;
  href: string;
}

export function CategoryTabs({
  tabs,
  activeCategory,
  label,
}: {
  tabs: CategoryTab[];
  activeCategory: string;
  label: string;
}) {
  return (
    <ul aria-label={label} className="m-0 p-0 list-none flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const on = tab.key === activeCategory;
        return (
          <li key={tab.key}>
            <Link
              href={tab.href}
              aria-current={on ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center min-h-[44px] box-border px-5 rounded-full border-[1.5px] border-solid',
                'text-[15px] leading-5 no-underline whitespace-nowrap',
                on
                  ? 'bg-ada2-ink border-ada2-ink text-white font-semibold hover:text-white'
                  : 'bg-white border-ada2-tag-border text-ada2-ink font-normal hover:bg-ada2-band hover:text-ada2-ink'
              )}
            >
              {tab.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
