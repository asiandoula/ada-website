/**
 * Support.dc.html, "Help and contact". One page body for two routes:
 *   /support          variant "help": contact details first, the board's order
 *   /support/contact  variant "contact": the message form first, because the
 *                     header's "Contact" link and the footer's "Contact" land here
 * Contact facts come from facts.ts. The board's office hours, support
 * languages, per-office mailboxes, reply time and "ADA never calls" rows are
 * not stated anywhere, so they are not shown.
 */
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Breadcrumb, CtaBox } from '@/components/site';
import { ArrowLink } from '@/components/site/pill';
import { CONTACT, ENTITY } from '@/lib/facts';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { cn } from '@/lib/utils';
import { MessageForm } from './message-form';
import {
  DefRows,
  Footnotes,
  InnerPage,
  LinkRows,
  PageIntro,
  PageSection,
  SectionText,
  TableFrame,
  inlineLink,
  registryLink,
  tdClass,
  thHeadClass,
  thRowClass,
} from './page-shell';

const mailLink = (chunks: ReactNode) => (
  <a href={`mailto:${CONTACT.email}`} className={cn(inlineLink, 'whitespace-nowrap')}>
    {chunks}
  </a>
);

export function HelpContact({ variant }: { variant: 'help' | 'contact' }) {
  const t = useTranslations('support');
  const isContact = variant === 'contact';

  const startLink = (href: string, label: string, tone: 'ink' | 'registry' = 'ink') => (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center min-h-[44px] font-semibold underline underline-offset-[3px]',
        tone === 'registry' ? 'text-ada2-blossom hover:text-ada2-blossom-hover' : 'text-ada2-ink hover:text-black'
      )}
    >
      {label}
    </Link>
  );

  const routingRows = [
    {
      topic: t('routing.certification'),
      about: t('routing.certificationAbout'),
      start: [startLink('/certifications/postpartum-doula', t('routing.certificationLink'))],
    },
    {
      topic: t('routing.registry'),
      about: t('routing.registryAbout'),
      start: [startLink('/verify', t('routing.registryLink'), 'registry')],
    },
    {
      topic: t('routing.exams'),
      about: t('routing.examsAbout'),
      start: [startLink('/exam-dates', t('routing.examsLinkDates')), startLink('/exam-day', t('routing.examsLinkDay'))],
    },
    {
      topic: t('routing.renewals'),
      about: t('routing.renewalsAbout'),
      start: [startLink('/for-doulas/renew', t('routing.renewalsLink'))],
    },
    {
      topic: t('routing.providers'),
      about: t('routing.providersAbout'),
      start: [startLink('/programs', t('routing.providersLink'))],
    },
  ];

  const details = (
    <PageSection id="contact" title={isContact ? t('details.titleOther') : t('details.title')}>
      <DefRows
        rows={[
          {
            label: t('details.email'),
            value: (
              <a href={`mailto:${CONTACT.email}`} className={inlineLink}>
                {CONTACT.email}
              </a>
            ),
          },
          {
            label: t('details.phone'),
            value: (
              <a href={`tel:${CONTACT.phone.tel}`} className={cn(inlineLink, 'whitespace-nowrap')}>
                {CONTACT.phone.display}
              </a>
            ),
          },
          {
            label: t('details.mail'),
            value: t('details.mailValue', {
              legalName: ENTITY.legalName,
              dba: ENTITY.dba,
              address: ENTITY.address.oneLine,
            }),
          },
        ]}
      />
    </PageSection>
  );

  const routing = (
    <PageSection id="where-to-start" title={t('routing.title')}>
      <SectionText>{t('routing.intro')}</SectionText>
      <TableFrame label={t('routing.label')} minWidth={640}>
        <thead>
          <tr className="bg-ada2-table-head text-white">
            <th scope="col" className={thHeadClass}>
              {t('routing.colTopic')}
            </th>
            <th scope="col" className={thHeadClass}>
              {t('routing.colAbout')}
            </th>
            <th scope="col" className={thHeadClass}>
              {t('routing.colStart')}
            </th>
          </tr>
        </thead>
        <tbody>
          {routingRows.map((row, i) => {
            const last = i === routingRows.length - 1;
            const rule = last ? '' : 'border-b border-ada2-hairline';
            return (
              <tr key={i}>
                <th scope="row" className={cn(thRowClass, rule)}>
                  {row.topic}
                </th>
                <td className={cn(tdClass, rule)}>{row.about}</td>
                <td className={cn('align-top py-px px-4 whitespace-nowrap', rule)}>
                  <span className="flex flex-col">{row.start}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableFrame>
      <Footnotes items={[t.rich('routing.note', { email: CONTACT.email, mail: mailLink })]} />
    </PageSection>
  );

  const message = (
    <PageSection id="message" title={t('form.title')}>
      <MessageForm />
    </PageSection>
  );

  const concern = (
    <PageSection id="concern" title={t('concern.title')}>
      <SectionText>{t.rich('concern.body', { email: CONTACT.email, mail: mailLink })}</SectionText>
      <ArrowLink href="/for-doulas/code-of-conduct" className="self-start">
        {t('concern.link')}
      </ArrowLink>
    </PageSection>
  );

  const security = (
    <PageSection id="security" title={t('security.title')}>
      <DefRows
        rows={[
          { label: t('security.messages'), value: t.rich('security.messagesValue', { email: CONTACT.email, mail: mailLink }) },
          { label: t('security.exams'), value: t('security.examsValue') },
          {
            label: t('security.certificates'),
            value: t.rich('security.certificatesValue', {
              registry: (chunks) => (
                <Link href="/verify" className={cn(registryLink, 'whitespace-nowrap')}>
                  {chunks}
                </Link>
              ),
            }),
          },
        ]}
      />
    </PageSection>
  );

  const more = (
    <PageSection id="more" title={t('more.title')} className="gap-5">
      <LinkRows
        items={[
          { href: '/support/faq', label: t('more.faq'), description: t('more.faqDescription') },
          { href: '/exam-day', label: t('more.examDay'), description: t('more.examDayDescription') },
          { href: '/privacy-policy', label: t('more.privacy'), description: t('more.privacyDescription') },
          { href: '/donate', label: t('more.donate'), description: t('more.donateDescription') },
        ]}
      />
    </PageSection>
  );

  const crumbs = isContact
    ? [{ label: t('breadcrumb.help'), href: '/support' }, { label: t('breadcrumb.contact') }]
    : [{ label: t('breadcrumb.help') }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              isContact
                ? [
                    { name: t('breadcrumb.help'), path: '/support' },
                    { name: t('breadcrumb.contact'), path: '/support/contact' },
                  ]
                : [{ name: t('breadcrumb.help'), path: '/support' }]
            )
          ),
        }}
      />
      <Breadcrumb items={crumbs} />
      <InnerPage
        rail={<CtaBox title={t('cta.title')} action={{ href: '/support/faq', label: t('cta.action') }} />}
      >
        <PageIntro
          title={isContact ? t('intro.contactTitle') : t('intro.helpTitle')}
          lead={isContact ? t('intro.contactLead') : t('intro.helpLead')}
        />
        {isContact ? (
          <>
            {message}
            {details}
            {routing}
          </>
        ) : (
          <>
            {details}
            {routing}
            {message}
          </>
        )}
        {concern}
        {security}
        {more}
      </InnerPage>
    </>
  );
}
