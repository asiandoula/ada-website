import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ItemRows, inlineLink } from '../support/_kit/page-shell';
import { LegalP, LegalPage, type LegalSection } from '../privacy-policy/legal-page';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.meta');
  return { title: t('termsTitle'), description: t('termsDescription') };
}

/** Live "Last updated: May 11, 2026". */
const LAST_UPDATED = '2026-05-11';

/*
 * The legal text below is the live Terms of Service, word for word. Only the
 * layout changed (Legal.dc.html): bullet lists became ruled rows, and the
 * certification-program list became label / text rows (its bold lead-ins).
 */
const certificationRows: [string, string][] = [
  [
    'Credential ownership.',
    'The ADA credential remains the property of Asian Doula Alliance. We may suspend or revoke a credential for violation of the Code of Conduct or these Terms.',
  ],
  [
    'Exam fees.',
    'Exam and renewal fees are published on the relevant program page. Fees fund scholarship awards and ongoing program development. ADA reserves the right to update fees with reasonable notice.',
  ],
  [
    'Refunds.',
    'Exam fees are refundable up to 7 days before the scheduled exam date, less a $25 processing fee. After that, fees may be transferred to a future exam attempt at ADA’s discretion. Training program fees are governed by the individual training provider’s policy.',
  ],
  [
    'No employment relationship.',
    'Certification does not create an employment, agency, or partnership relationship between you and ADA. Certified doulas serve families independently under their own business and legal arrangements.',
  ],
  [
    'Scope of practice.',
    'ADA-certified doulas are not medical professionals and do not diagnose, prescribe, or provide clinical care. Doulas must operate within the scope defined in the ADA Code of Conduct.',
  ],
];

const sections: LegalSection[] = [
  {
    id: 'about',
    title: 'About ADA',
    body: (
      <LegalP>
        Asian Doula Alliance is a California-incorporated 501(c)(3) nonprofit organization. Our mission is to advance the
        education, certification, and recognition of doulas who serve Asian families with culturally integrated postpartum
        care.
      </LegalP>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    body: (
      <>
        <LegalP>When using the Services, you agree not to:</LegalP>
        <ItemRows
          items={[
            'Misrepresent your identity or impersonate any ADA-certified doula, board member, or staff.',
            'Display a credential, badge, or claim of ADA certification that you have not earned and is not currently valid.',
            'Use the Services to harass, defame, or harm any individual or community.',
            'Attempt to disrupt, reverse-engineer, or gain unauthorized access to any part of the Services or its underlying systems.',
            'Scrape, mirror, or republish ADA curriculum, exam content, or certified-doula registry data without written permission.',
            'Use ADA materials to compete with ADA’s nonprofit mission or to create a derivative certification scheme.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'certification',
    title: 'Certification programs',
    body: (
      <>
        <LegalP>
          ADA’s certification programs are governed by additional policies published with each program (eligibility, exam
          rules, scope of practice, code of conduct, renewal requirements). By enrolling, you agree to those policies.
        </LegalP>
        <dl className="m-0 flex flex-col border-t-2 border-ada2-ink [font-variant-numeric:tabular-nums_lining-nums]">
          {certificationRows.map(([label, text]) => (
            <div key={label} className="flex flex-wrap gap-x-6 gap-y-0.5 py-3 border-b border-ada2-hairline">
              <dt className="flex-[0_0_200px] font-semibold text-ada2-ink">{label}</dt>
              <dd className="flex-[1_1_300px] min-w-0 m-0 [text-wrap:pretty]">{text}</dd>
            </div>
          ))}
        </dl>
        <LegalP>
          See the{' '}
          <Link href="/for-doulas/code-of-conduct" className={inlineLink}>
            Code of Conduct
          </Link>{' '}
          for full scope-of-practice details.
        </LegalP>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    body: (
      <LegalP>
        All content on this site (text, graphics, logos, curriculum, videos, exam materials) is owned by Asian Doula
        Alliance or used with permission. You may share short excerpts for educational or editorial purposes with
        attribution. You may not reproduce ADA curriculum or exam content for commercial use without a written license.
        The names “Asian Doula Alliance” and “ADA Certified”, together with associated logos and badges, are protected
        marks.
      </LegalP>
    ),
  },
  {
    id: 'donations',
    title: 'Donations',
    body: (
      <LegalP>
        All donations to Asian Doula Alliance are voluntary and tax-deductible to the fullest extent permitted by U.S. law.
        Once processed, donations are non-refundable except where required by law or in the case of duplicate or erroneous
        transactions identified within 30 days. See our{' '}
        <Link href="/donate" className={inlineLink}>
          Donate page
        </Link>{' '}
        for tax information.
      </LegalP>
    ),
  },
  {
    id: 'third-party-links',
    title: 'Third-party links',
    body: (
      <LegalP>
        The Services may include links to third-party sites (training providers, insurance partners, payment processors).
        ADA does not control those sites and is not responsible for their content, policies, or practices. Visiting a
        linked site is at your own discretion.
      </LegalP>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: (
      <LegalP>
        The Services are provided “as is” without warranties of any kind, whether express or implied. ADA does not warrant
        that the site will be uninterrupted, error-free, or secure against all attacks. Educational content is provided for
        general information and does not constitute medical, legal, or professional advice. Always consult qualified
        professionals for individual care decisions.
      </LegalP>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <LegalP>
        To the maximum extent permitted by law, Asian Doula Alliance and its directors, officers, employees, and volunteers
        will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use
        of the Services. ADA’s total liability for any direct damages will not exceed the amount you paid to ADA in the
        twelve months before the claim arose, or $100, whichever is greater.
      </LegalP>
    ),
  },
  {
    id: 'governing-law',
    title: 'Governing law & disputes',
    body: (
      <LegalP>
        These Terms are governed by the laws of the State of California, without regard to its conflict-of-laws
        principles. Any dispute arising from these Terms or the Services will be resolved in the state or federal courts
        located in Orange County, California, and you consent to personal jurisdiction there. The prevailing party in any
        action is entitled to reasonable attorney fees and costs.
      </LegalP>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these Terms',
    body: (
      <LegalP>
        We may update these Terms as our programs or applicable law evolve. Material changes will be announced on this
        page and, where appropriate, by email to certified doulas and active enrollees. Continued use of the Services after
        a change constitutes acceptance of the updated Terms.
      </LegalP>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <dl className="m-0 flex flex-col border-t-2 border-ada2-ink">
        {[
          [
            'Questions about these Terms',
            <a key="m" href="mailto:contact@asiandoula.org" className={inlineLink}>
              contact@asiandoula.org
            </a>,
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

export default function TermsOfServicePage() {
  return (
    <LegalPage
      current="terms"
      updatedIso={LAST_UPDATED}
      intro={
        <LegalP>
          These Terms of Service (“Terms”) govern your access to and use of the Asian Doula Alliance website at{' '}
          <strong className="font-semibold text-ada2-ink">asiandoula.org</strong>, our certification programs, and any
          related services (collectively, the “Services”). By using the Services, you agree to these Terms.
        </LegalP>
      }
      sections={sections}
    />
  );
}
