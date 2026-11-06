/**
 * The verify field: blossom, because it opens the registry. A plain GET form
 * to /verify?q=… so it works before hydration and without JavaScript.
 *
 *   header  compact pill group in the desktop header (visually hidden label)
 *   block   phone verify block: visible label, full-width input and pill,
 *           "Free. No account needed." (SiteHeader wraps it in the grey band)
 *   inline  page form (e.g. "Verify another credential"): label, input and
 *           pill side by side, with the use terms underneath
 *
 * Each instance needs a unique `id` (the desktop and phone headers are both
 * in the DOM).
 */
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { SearchIcon } from './icons';
import { pillClassName } from './pill';

export interface VerifyFieldProps {
  variant: 'header' | 'block' | 'inline';
  /** Unique id for the input. */
  id: string;
  defaultValue?: string;
  /** Form action. Default "/verify" (the page reads `q`). */
  action?: string;
  className?: string;
}

const inputBase =
  'w-full min-w-0 box-border bg-white border-[1.5px] border-solid border-ada2-blossom text-ada2-ink text-[16px] appearance-none placeholder:text-ada2-tag-border';

export function VerifyField({ variant, id, defaultValue, action = '/verify', className }: VerifyFieldProps) {
  const t = useTranslations('site.verify');

  if (variant === 'header') {
    return (
      <form action={action} method="get" role="search" className={cn('relative flex-[0_1_460px] min-w-0 flex', className)}>
        <label htmlFor={id} className="ada2-sr">
          {t('labelLong')}
        </label>
        <span className="relative flex-auto min-w-0 flex">
          <SearchIcon className="absolute left-4 top-[13px] text-ada2-blossom pointer-events-none" />
          <input
            id={id}
            name="q"
            type="text"
          enterKeyHint="search"
            defaultValue={defaultValue}
            placeholder={t('placeholder')}
            autoComplete="off"
            className={cn(inputBase, 'h-[44px] pr-3 pl-11 border-r-0 rounded-l-full rounded-r-none')}
          />
        </span>
        <button
          type="submit"
          className="flex-none inline-flex items-center justify-center min-h-[44px] box-border px-[22px] bg-ada2-blossom border-[1.5px] border-solid border-ada2-blossom rounded-r-full rounded-l-none text-white text-[16px] leading-5 font-semibold whitespace-nowrap cursor-pointer hover:bg-ada2-blossom-hover hover:border-ada2-blossom-hover"
        >
          {t('submit')}
        </button>
      </form>
    );
  }

  if (variant === 'block') {
    return (
      <form action={action} method="get" role="search" className={cn('flex flex-col gap-2.5', className)}>
        <label htmlFor={id} className="text-[15px] leading-5 font-semibold text-ada2-ink">
          {t('label')}
        </label>
        <input
          id={id}
          name="q"
          type="text"
          enterKeyHint="search"
          defaultValue={defaultValue}
          placeholder={t('placeholder')}
          autoComplete="off"
          className={cn(inputBase, 'block h-[48px] px-3.5 rounded-[4px]')}
        />
        <button type="submit" className={pillClassName('registry', 'md', 'flex w-full')}>
          <SearchIcon />
          {t('submitLong')}
        </button>
        <p className="m-0 text-[14px] leading-5 text-ada2-muted">{t('free')}</p>
      </form>
    );
  }

  return (
    <form action={action} method="get" role="search" className={cn('flex flex-col gap-2.5 max-w-[640px]', className)}>
      <label htmlFor={id} className="text-[15px] leading-5 font-semibold text-ada2-ink">
        {t('fieldLabel')}
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          id={id}
          name="q"
          type="text"
          enterKeyHint="search"
          defaultValue={defaultValue}
          placeholder={t('placeholder')}
          autoComplete="off"
          aria-describedby={`${id}-terms`}
          className={cn(inputBase, 'flex-[1_1_280px] h-[48px] px-3.5 rounded-[4px]')}
        />
        <button type="submit" className={pillClassName('registry', 'md', 'flex-none')}>
          <SearchIcon />
          {t('submitLong')}
        </button>
      </div>
      <p id={`${id}-terms`} className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
        {t('terms')}
      </p>
    </form>
  );
}
