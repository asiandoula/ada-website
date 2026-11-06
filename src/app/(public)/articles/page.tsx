import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox } from '@/components/site';
import { ArrowIcon } from '@/components/site/icons';
import { pillClassName } from '@/components/site/pill';
import type { Locale } from '@/i18n/config';
import { getNextExamSession } from '@/lib/exam-sessions';
import { CONTACT } from '@/lib/facts';
import { formatExamDate } from '@/lib/site-dates';
import { cn } from '@/lib/utils';
import { InnerPage, PageIntro, inlineLink } from '../support/_kit/page-shell';
import { displayExcerpt, publishedDay } from './_lib/content';
import { CategoryTabs } from './category-tabs';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('articles.meta');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | Asian Doula Alliance`,
      description: t('description'),
      images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
    },
  };
}

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const ALL_CATEGORIES = ['all', 'news', 'education', 'community', 'certification'] as const;
const PAGE_SIZE = 10;

interface SearchParams {
  category?: string;
  page?: string;
}

function listHref(category: string, page = 1) {
  const qs = new URLSearchParams();
  if (category !== 'all') qs.set('category', category);
  if (page > 1) qs.set('page', String(page));
  const s = qs.toString();
  return s ? `/articles?${s}` : '/articles';
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const t = await getTranslations('articles');
  const tSite = await getTranslations('site');
  const locale = (await getLocale()) as Locale;
  const supabase = getSupabase();
  const params = await searchParams;
  const activeCategory = params.category || 'all';
  const requested = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'all':
        return t('category.all');
      case 'news':
        return t('category.news');
      case 'education':
        return t('category.education');
      case 'community':
        return t('category.community');
      case 'certification':
        return t('category.certification');
      default:
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  // Same query as before (published, newest first, optional category), one page at a time.
  // Count first, so an out-of-range ?page= clamps to the last page instead of erroring.
  let countQuery = supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published');
  if (activeCategory !== 'all') countQuery = countQuery.eq('category', activeCategory);
  const { count } = await countQuery;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const page = Math.min(requested, pages);

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (activeCategory !== 'all') query = query.eq('category', activeCategory);
  const { data: articles } = await query;

  const next = await getNextExamSession();
  const cta = next ? (
    <CtaBox
      title={tSite('hero.nextExam', {
        type: next.examType === 'birth' ? tSite('examType.birth') : tSite('examType.postpartum'),
        date: formatExamDate(next.date, locale),
      })}
      action={{ href: '/exam-dates', label: t('cta.examAction') }}
    />
  ) : (
    <CtaBox
      title={t('cta.defaultTitle')}
      action={{ href: '/certifications/postpartum-doula', label: t('cta.defaultAction') }}
    />
  );

  const note =
    activeCategory === 'all' ? t('noteAll') : t('noteCategory', { category: categoryLabel(activeCategory) });

  return (
    <>
      <Breadcrumb items={[{ label: t('breadcrumb.about'), href: '/about-us' }, { label: t('breadcrumb.list') }]} />
      <InnerPage rail={cta} mainClassName="gap-10">
        <PageIntro title={t('title')} lead={t('lead')} />

        <section aria-labelledby="list-title" className="flex flex-col gap-5">
          <h2 id="list-title" className="ada2-sr">
            {t('listLabel')}
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <CategoryTabs
              label={t('filterLabel')}
              activeCategory={activeCategory}
              tabs={ALL_CATEGORIES.map((cat) => ({ key: cat, label: categoryLabel(cat), href: listHref(cat) }))}
            />
            <p className="m-0 text-[14px] leading-5 text-ada2-muted">
              {note}
              {pages > 1 ? ` · ${t('pageNote', { page, pages })}` : ''}
            </p>
          </div>

          {articles && articles.length > 0 ? (
            <ul className="m-0 p-0 list-none flex flex-col border-t-2 border-ada2-ink">
              {articles.map((article) => {
                const day = publishedDay(article.published_at);
                const hid = `art-${article.id}`;
                return (
                  <li key={article.id} className="border-b border-ada2-hairline">
                    <article
                      aria-labelledby={hid}
                      className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-[22px] pb-6"
                    >
                      <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-1.5">
                        <p className="m-0 flex flex-wrap gap-x-2.5 text-[14px] leading-5 text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
                          {day ? (
                            <>
                              <time dateTime={day}>{formatExamDate(day, locale, { weekday: false })}</time>
                              <span aria-hidden="true">·</span>
                            </>
                          ) : null}
                          <span className="font-semibold text-ada2-tag-text">{categoryLabel(article.category)}</span>
                        </p>
                        <h3
                          id={hid}
                          lang={locale === 'en' ? undefined : 'en'}
                          className="m-0 text-[22px] leading-[29px] font-normal text-ada2-ink [text-wrap:balance]"
                        >
                          <Link
                            href={`/articles/${article.slug}`}
                            className="text-ada2-ink no-underline hover:underline underline-offset-[3px] hover:text-black"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p
                          lang={locale === 'en' ? undefined : 'en'}
                          className="mt-0.5 mb-0 line-clamp-2 text-[16px] leading-[25px] text-ada2-body"
                        >
                          {displayExcerpt(article.excerpt, article.content)}
                        </p>
                      </div>
                      {article.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element -- CMS covers come from any host
                        <img
                          src={article.cover_image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="flex-[0_1_220px] w-[220px] max-w-full min-w-0 h-auto aspect-[3/2] object-cover block"
                        />
                      ) : null}
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-3 py-8 border-t-2 border-ada2-ink">
              <p className="m-0 text-[18px] leading-7 text-ada2-body">{t('empty')}</p>
              {activeCategory !== 'all' ? (
                <Link href="/articles" className={cn(inlineLink, 'font-semibold')}>
                  {t('emptyAction')}
                </Link>
              ) : null}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            {pages > 1 ? (
              <nav aria-label={t('pagination')} className="flex flex-wrap gap-3">
                {page > 1 ? (
                  <Link href={listHref(activeCategory, page - 1)} className={pillClassName('secondary', 'md')}>
                    <ArrowIcon className="rotate-180" />
                    {t('newer')}
                  </Link>
                ) : null}
                {page < pages ? (
                  <Link href={listHref(activeCategory, page + 1)} className={pillClassName('secondary', 'md')}>
                    {t('older')}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </nav>
            ) : (
              <span />
            )}
            <p className="m-0 text-[14px] leading-[21px] text-ada2-muted [text-wrap:pretty]">
              {t.rich('press', {
                email: CONTACT.email,
                mail: (chunks) => (
                  <a href={`mailto:${CONTACT.email}`} className={inlineLink}>
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </section>
      </InnerPage>
    </>
  );
}
