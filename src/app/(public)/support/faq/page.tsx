import { Metadata } from 'next';
import Link from 'next/link';
import { FAQContent } from './faq-content';
import { faqJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import { faqData } from './faq-data';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about ADA certification, training, and doula services.',
  openGraph: {
    title: 'FAQ | Asian Doula Alliance',
    description:
      'Frequently asked questions about ADA certification, training, and doula services.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

const sidebarLinks = [
  { label: 'Contact Us', href: '/support/contact' },
  { label: 'Articles', href: '/articles' },
  { label: 'Certifications', href: '/certifications' },
];

export default async function FAQPage() {
  const t = await getTranslations('supportFaq');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('heroSupport'), path: '/support' },
              { name: t('heroTitle'), path: '/support/faq' },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(faqData.flatMap((cat) => cat.items))
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('sidebarSupport')}
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Two-column: Sidebar + FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col-reverse lg:flex-row gap-12">
            {/* Main content */}
            <div className="lg:w-4/5">
              <FAQContent />
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-xs uppercase tracking-wider text-ada-navy/40 mb-4">
                  {t('sidebarSupport')}
                </p>
                <nav className="flex flex-row lg:flex-col gap-3">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-outfit text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
                    >
                      {t(link.label.replace(/ /g, '').toLowerCase())}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ada-off-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            {t('ctaTitle')}
          </h2>
          <p className="mt-4 font-outfit text-ada-navy/60 text-lg leading-relaxed">
            {t('ctaDescription')}
          </p>
          <Link
            href="/support/contact"
            className="mt-8 inline-flex items-center gap-1 rounded-full bg-ada-purple px-6 py-2.5 text-sm font-outfit font-medium text-white hover:bg-ada-purple-hover transition-colors"
          >
            {t('ctaContactUs')} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
