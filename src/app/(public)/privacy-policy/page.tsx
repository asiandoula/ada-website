import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { ItemRows, TableFrame, inlineLink, tdClass, thHeadClass, thRowClass } from '../support/_kit/page-shell';
import { LegalP, LegalPage, type LegalSection } from './legal-page';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.meta');
  return { title: t('privacyTitle'), description: t('privacyDescription') };
}

/** Live "Last updated: September 28, 2026". */
const LAST_UPDATED = '2026-09-28';

const mail = (address: string) => (
  <a href={`mailto:${address}`} className={inlineLink}>
    {address}
  </a>
);

/*
 * The legal text below is the live policy, word for word. Only the layout
 * changed (Legal.dc.html): bullet lists became ruled rows and the service
 * providers list became a table (name | what it does, same words).
 */
const sections: LegalSection[] = [
  {
    id: 'collect',
    title: 'Information we collect',
    body: (
      <ItemRows
        items={[
          <>
            <strong className="font-semibold text-ada2-ink">Contact information</strong> you submit through forms (name,
            email, phone number, message content) — used to respond to inquiries, process certification applications, and
            send requested updates.
          </>,
          <>
            <strong className="font-semibold text-ada2-ink">Certification records</strong> for enrolled doulas (training
            program, exam results, certificate ID, renewal history) — required to issue and maintain credentials and to
            support the public verification registry.
          </>,
          <>
            <strong className="font-semibold text-ada2-ink">Donation records</strong> if you give to ADA (your name,
            amount, payment processor reference) — required for tax receipting and IRS reporting.
          </>,
          <>
            <strong className="font-semibold text-ada2-ink">Usage data</strong> automatically collected by our hosting
            provider and analytics tools (IP address, browser type, pages visited, referring site) — used to maintain the
            site and understand aggregate traffic patterns.
          </>,
          <>
            <strong className="font-semibold text-ada2-ink">Cookies</strong> for essential session management, language
            preference, and analytics. You can disable non-essential cookies through your browser or the cookie banner on
            first visit.
          </>,
        ]}
      />
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    body: (
      <ItemRows
        items={[
          'To respond to your inquiries and provide requested services.',
          'To administer the ADA certification program — including enrollment, exam delivery, credential issuance, renewal, and public registry verification.',
          'To process donations, issue tax receipts, and maintain donor records as required by U.S. nonprofit accounting standards.',
          'To send program updates and newsletters to people who have opted in. Every email includes an unsubscribe link.',
          'To analyze aggregate site usage and improve content, navigation, and educational resources.',
          'To comply with legal obligations (IRS filings, court orders, regulatory requests).',
        ]}
      />
    ),
  },
  {
    id: 'providers',
    title: 'Third-party service providers',
    body: (
      <>
        <LegalP>
          We rely on a small set of vetted vendors to run the site and programs. They access only the data needed to
          perform their service and are bound by data-processing agreements.
        </LegalP>
        <TableFrame label="Third-party service providers" minWidth={480}>
          <thead>
            <tr className="bg-ada2-table-head text-white">
              <th scope="col" className={thHeadClass}>
                Provider
              </th>
              <th scope="col" className={thHeadClass}>
                Service
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Vercel', 'web hosting and content delivery.'],
              ['Supabase', 'database for certification records and form submissions.'],
              ['Resend', 'transactional email delivery (certificates, exam results, receipts).'],
              ['Google Analytics & Google Tag Manager', 'aggregate website analytics.'],
              ['Payment processors (for donations)', 'PCI-compliant providers; ADA does not store full card numbers.'],
            ].map(([name, what], i, all) => {
              const rule = i === all.length - 1 ? '' : 'border-b border-ada2-hairline';
              return (
                <tr key={name}>
                  <th scope="row" className={cn(thRowClass, 'py-2.5', rule)}>
                    {name}
                  </th>
                  <td className={cn(tdClass, 'py-2.5 first-letter:uppercase', rule)}>{what}</td>
                </tr>
              );
            })}
          </tbody>
        </TableFrame>
      </>
    ),
  },
  {
    id: 'sms',
    title: 'Text messages (SMS)',
    body: (
      <ItemRows
        items={[
          'If you share your mobile number with us (for example on our contact form), Asian Doula Alliance may text you about your inquiry and, if you are a doula in our network, about client matches, work orders and scheduling. Message frequency varies. Message and data rates may apply.',
          <>
            Reply <strong className="font-semibold text-ada2-ink">STOP</strong> at any time to stop receiving texts, or{' '}
            <strong className="font-semibold text-ada2-ink">HELP</strong> for help. You can also reach us at{' '}
            {mail('contact@asiandoula.org')}.
          </>,
          'We do not share mobile numbers or text-message opt-in consent with third parties or affiliates for their marketing or promotional purposes. Our messaging provider processes your number only to deliver our messages.',
        ]}
      />
    ),
  },
  {
    id: 'never',
    title: 'What we never do',
    body: (
      <ItemRows
        items={[
          'We do not sell, rent, or trade your personal information.',
          'We do not share donor lists with other organizations for their marketing.',
          'We do not run third-party advertising or behavioral targeting on this website.',
          'We do not knowingly collect personal information from children under 13.',
        ]}
      />
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <LegalP>
          Under the California Consumer Privacy Act (CCPA), GDPR, and similar frameworks, you have the right to:
        </LegalP>
        <ItemRows
          items={[
            'Access the personal information we hold about you.',
            'Request correction of inaccurate data.',
            'Request deletion of your data, subject to certification record retention obligations.',
            'Opt out of marketing emails at any time.',
            'Disable non-essential cookies in your browser.',
          ]}
        />
        <LegalP>
          To exercise any of these rights, email {mail('privacy@asiandoula.org')} with the subject line “Privacy
          Request”. We respond within 30 days.
        </LegalP>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data retention',
    body: (
      <ItemRows
        items={[
          'Certification records are retained for the lifetime of the credential plus seven years, to support credential verification by employers, insurance partners, and regulators.',
          'Donation records are retained for at least seven years as required by IRS rules.',
          'Contact-form submissions are retained for up to two years unless a certification or service relationship is established.',
          'Aggregate analytics data is retained according to Google’s default policies.',
        ]}
      />
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <LegalP>
        All traffic to and from this site is encrypted with HTTPS. Database access is role-restricted and audit-logged.
        Payment processing is handled by PCI-DSS compliant providers. No method of transmission over the internet is 100%
        secure, but we follow industry best practices and reassess our controls regularly.
      </LegalP>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <LegalP>
        We may update this Privacy Policy as our services or applicable law evolve. Material changes will be announced on
        this page and, where appropriate, by email. The “Last updated” date at the top reflects the most recent revision.
      </LegalP>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
        {[
          ['Privacy questions and data requests', mail('privacy@asiandoula.org')],
          [
            'General contact',
            <>
              see our{' '}
              <Link href="/support/contact" className={inlineLink}>
                Contact page
              </Link>
              .
            </>,
          ],
          ['Mail', 'Asian Doula Alliance, 20 Fairbanks, Suite 184, Irvine, CA 92618, United States.'],
        ].map(([label, value], i) => (
          <div key={i} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
            <dt className="flex-[0_0_200px] font-semibold text-ada2-ink">{label}</dt>
            <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{value}</dd>
          </div>
        ))}
      </dl>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      current="privacy"
      updatedIso={LAST_UPDATED}
      intro={
        <LegalP>
          Asian Doula Alliance (“ADA”, “we”, “our”) is a California-incorporated 501(c)(3) nonprofit organization. We
          respect your privacy and are committed to handling personal information responsibly. This policy describes what
          we collect, how we use it, and the choices you have.
        </LegalP>
      }
      sections={sections}
    />
  );
}
