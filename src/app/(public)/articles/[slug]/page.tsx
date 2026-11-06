import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb, CtaBox } from '@/components/site';
import type { Locale } from '@/i18n/config';
import { articleJsonLd } from '@/lib/json-ld';
import { formatExamDate } from '@/lib/site-dates';
import { InnerPage, LinkRows, PageSection } from '../../support/_kit/page-shell';
import { prepareArticleHtml, publishedDay, readingMinutes } from '../_lib/content';
import { TableOfContents } from './table-of-contents';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = getSupabase();
  const { slug } = await params;
  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    const t = await getTranslations('articles.meta');
    return { title: t('notFound') };
  }

  // The root layout's title template adds " | Asian Doula Alliance".
  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

/**
 * Body typography for CMS HTML (Article.dc.html): 18/30 text, light 36/44 h2,
 * 20/28 semibold h3, ruled spacing between blocks, ink underlined links.
 */
const bodyClass = [
  'text-[18px] leading-[30px] text-ada2-body [overflow-wrap:anywhere]',
  // Margins: every child 0, then per element (element selectors outrank the child reset).
  '[&>*]:my-0 [&>*:first-child]:mt-0',
  '[&_p]:mt-4 [&_ul]:mt-4 [&_ol]:mt-4 [&_blockquote]:mt-4 [&_figure]:mt-6 [&_table]:mt-6 [&_hr]:my-8',
  '[&_h2]:mt-10 [&_h2]:mb-0 [&_h2]:text-[36px] [&_h2]:leading-[44px] [&_h2]:font-light [&_h2]:text-ada2-ink [&_h2]:[text-wrap:balance] [&_h2]:scroll-mt-6',
  '[&_h3]:mt-7 [&_h3]:mb-0 [&_h3]:text-[20px] [&_h3]:leading-7 [&_h3]:font-semibold [&_h3]:text-ada2-ink [&_h3]:scroll-mt-6',
  '[&_h4]:mt-6 [&_h4]:mb-0 [&_h4]:text-[18px] [&_h4]:leading-7 [&_h4]:font-semibold [&_h4]:text-ada2-ink',
  '[&_h5]:mt-5 [&_h5]:mb-0 [&_h5]:text-[17px] [&_h5]:font-semibold [&_h5]:text-ada2-ink',
  '[&_p]:[text-wrap:pretty]',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li+li]:mt-2 [&_li>p]:mt-0 [&_li>ul]:mt-2 [&_li>ol]:mt-2',
  '[&_strong]:font-semibold [&_strong]:text-ada2-ink [&_b]:font-semibold',
  '[&_a]:text-ada2-ink [&_a]:underline [&_a]:underline-offset-[3px] hover:[&_a]:text-black',
  '[&_img]:max-w-full [&_img]:h-auto',
  '[&_blockquote]:border-l-2 [&_blockquote]:border-ada2-ink [&_blockquote]:pl-5 [&_blockquote]:text-ada2-ink',
  '[&_hr]:border-0 [&_hr]:border-t [&_hr]:border-ada2-hairline',
  '[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ada2-hairline [&_td]:p-2 [&_th]:border [&_th]:border-ada2-hairline [&_th]:p-2',
].join(' ');

export default async function ArticleDetailPage({ params }: PageProps) {
  const supabase = getSupabase();
  const { slug } = await params;
  const t = await getTranslations('articles');
  const locale = (await getLocale()) as Locale;

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) notFound();

  // Related articles (same category, excluding current)
  const { data: related } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'news':
        return t('category.news');
      case 'education':
        return t('category.education');
      case 'community':
        return t('category.community');
      case 'certification':
        return t('category.certification');
      default:
        return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '';
    }
  };

  const prepared = prepareArticleHtml(article.content);
  const minutes = readingMinutes(prepared, article.content);
  const day = publishedDay(article.published_at);
  const contentLang = locale === 'en' ? undefined : 'en';

  const cta =
    article.category === 'certification' ? (
      <CtaBox
        title={t('article.ctaCertificationTitle')}
        action={{ href: '/certifications/postpartum-doula', label: t('article.ctaCertificationAction') }}
      />
    ) : article.category === 'education' ? (
      <CtaBox
        title={t('article.ctaEducationTitle')}
        action={{ href: '/programs', label: t('article.ctaEducationAction') }}
      />
    ) : (
      <CtaBox
        title={t('article.ctaDefaultTitle')}
        action={{ href: '/support/contact', label: t('article.ctaDefaultAction') }}
      />
    );

  const relatedItems = [
    ...(related ?? []).map((r) => {
      const d = publishedDay(r.published_at);
      return {
        href: `/articles/${r.slug}`,
        label: <span lang={contentLang}>{r.title}</span>,
        description: t('article.relatedMeta', {
          category: categoryLabel(r.category),
          date: d ? formatExamDate(d, locale, { weekday: false }) : '',
        }).replace(/ · $/, ''),
      };
    }),
    { href: '/articles', label: t('article.all'), description: t('article.allDescription') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: article.title,
              excerpt: article.excerpt,
              author: article.author,
              cover_image: article.cover_image,
              published_at: article.published_at,
              updated_at: article.updated_at,
            })
          ),
        }}
      />
      <Breadcrumb
        items={[
          { label: t('breadcrumb.about'), href: '/about-us' },
          { label: t('breadcrumb.list'), href: '/articles' },
          { label: <span lang={contentLang}>{article.title}</span> },
        ]}
      />
      <InnerPage rail={cta} as="article" mainLabelledBy="art-title" mainClassName="gap-14">
        <div className="max-w-[680px] flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            {article.category ? (
              <p className="m-0 text-[15px] leading-[22px] text-ada2-muted">
                <Link
                  href={`/articles?category=${encodeURIComponent(article.category)}`}
                  aria-label={t('article.categoryLink', { category: categoryLabel(article.category) })}
                  className="inline-flex items-center min-h-[44px] -my-[11px] text-ada2-ink font-semibold underline underline-offset-[3px] hover:text-black"
                >
                  {categoryLabel(article.category)}
                </Link>
              </p>
            ) : null}
            <h1
              id="art-title"
              lang={contentLang}
              className="m-0 text-[clamp(40px,3.9vw,56px)] leading-[1.15] font-light text-ada2-ink [text-wrap:balance] [overflow-wrap:anywhere]"
            >
              {article.title}
            </h1>
            <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-[15px] leading-[22px] text-ada2-muted [font-variant-numeric:tabular-nums_lining-nums]">
              {article.author ? <span>{t('article.byline', { author: article.author })}</span> : null}
              {article.author && day ? <span aria-hidden="true">·</span> : null}
              {day ? <time dateTime={day}>{formatExamDate(day, locale, { weekday: false })}</time> : null}
              <span aria-hidden="true">·</span>
              <span>{t('article.readingTime', { minutes })}</span>
            </p>
          </header>

          {article.cover_image ? (
            <figure className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS covers come from any host */}
              <img
                src={article.cover_image}
                alt=""
                className="block w-full h-auto aspect-[3/2] object-cover"
              />
            </figure>
          ) : null}

          <TableOfContents items={prepared.toc} title={t('article.toc')} />

          <div lang={contentLang} className={bodyClass} dangerouslySetInnerHTML={{ __html: prepared.html }} />
        </div>

        <PageSection id="related" title={t('article.related')} className="max-w-[680px] gap-5">
          <LinkRows items={relatedItems} />
        </PageSection>
      </InnerPage>
    </>
  );
}
