import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Terms of Service | Asian Doula Alliance',
  description:
    'Terms that govern your use of the Asian Doula Alliance website, certification programs, and educational resources.',
};

const LAST_UPDATED = 'May 11, 2026';

export default function TermsOfServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: 'Terms of Service', path: '/terms-of-service' }])
          ),
        }}
      />

      <section className="bg-ada-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple">
            Legal
          </p>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
            Terms of Service
          </h1>
          <p className="mt-4 text-ada-navy/50 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-[900px] mx-auto px-6 space-y-10">
          <p className="text-ada-navy/70 leading-relaxed">
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
            and use of the Asian Doula Alliance website at{' '}
            <strong>asiandoula.org</strong>, our certification programs, and any
            related services (collectively, the &ldquo;Services&rdquo;). By using
            the Services, you agree to these Terms.
          </p>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              About ADA
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              Asian Doula Alliance is a California-incorporated 501(c)(3)
              nonprofit organization. Our mission is to advance the education,
              certification, and recognition of doulas who serve Asian families
              with culturally integrated postpartum care.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Acceptable use
            </h2>
            <p className="text-ada-navy/70 leading-relaxed mb-3">
              When using the Services, you agree not to:
            </p>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>
                Misrepresent your identity or impersonate any ADA-certified
                doula, board member, or staff.
              </li>
              <li>
                Display a credential, badge, or claim of ADA certification that
                you have not earned and is not currently valid.
              </li>
              <li>
                Use the Services to harass, defame, or harm any individual or
                community.
              </li>
              <li>
                Attempt to disrupt, reverse-engineer, or gain unauthorized access
                to any part of the Services or its underlying systems.
              </li>
              <li>
                Scrape, mirror, or republish ADA curriculum, exam content, or
                certified-doula registry data without written permission.
              </li>
              <li>
                Use ADA materials to compete with ADA&rsquo;s nonprofit mission
                or to create a derivative certification scheme.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Certification programs
            </h2>
            <p className="text-ada-navy/70 leading-relaxed mb-3">
              ADA&rsquo;s certification programs are governed by additional
              policies published with each program (eligibility, exam rules,
              scope of practice, code of conduct, renewal requirements). By
              enrolling, you agree to those policies.
            </p>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>
                <strong>Credential ownership.</strong> The ADA credential remains
                the property of Asian Doula Alliance. We may suspend or revoke a
                credential for violation of the Code of Conduct or these Terms.
              </li>
              <li>
                <strong>Exam fees.</strong> Exam and renewal fees are published
                on the relevant program page. Fees fund scholarship awards and
                ongoing program development. ADA reserves the right to update
                fees with reasonable notice.
              </li>
              <li>
                <strong>Refunds.</strong> Exam fees are refundable up to 7 days
                before the scheduled exam date, less a $25 processing fee. After
                that, fees may be transferred to a future exam attempt at
                ADA&rsquo;s discretion. Training program fees are governed by
                the individual training provider&rsquo;s policy.
              </li>
              <li>
                <strong>No employment relationship.</strong> Certification does
                not create an employment, agency, or partnership relationship
                between you and ADA. Certified doulas serve families
                independently under their own business and legal arrangements.
              </li>
              <li>
                <strong>Scope of practice.</strong> ADA-certified doulas are not
                medical professionals and do not diagnose, prescribe, or provide
                clinical care. Doulas must operate within the scope defined in
                the ADA Code of Conduct.
              </li>
            </ul>
            <p className="text-ada-navy/70 leading-relaxed mt-3">
              See the{' '}
              <Link
                href="/for-doulas/code-of-conduct"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                Code of Conduct
              </Link>{' '}
              for full scope-of-practice details.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Intellectual property
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              All content on this site (text, graphics, logos, curriculum,
              videos, exam materials) is owned by Asian Doula Alliance or used
              with permission. You may share short excerpts for educational or
              editorial purposes with attribution. You may not reproduce ADA
              curriculum or exam content for commercial use without a written
              license. The names &ldquo;Asian Doula Alliance&rdquo; and
              &ldquo;ADA Certified&rdquo;, together with associated logos and
              badges, are protected marks.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Donations
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              All donations to Asian Doula Alliance are voluntary and
              tax-deductible to the fullest extent permitted by U.S. law. Once
              processed, donations are non-refundable except where required by
              law or in the case of duplicate or erroneous transactions
              identified within 30 days. See our{' '}
              <Link
                href="/donate"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                Donate page
              </Link>{' '}
              for tax information.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Third-party links
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              The Services may include links to third-party sites (training
              providers, insurance partners, payment processors). ADA does not
              control those sites and is not responsible for their content,
              policies, or practices. Visiting a linked site is at your own
              discretion.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Disclaimers
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              The Services are provided &ldquo;as is&rdquo; without warranties
              of any kind, whether express or implied. ADA does not warrant
              that the site will be uninterrupted, error-free, or secure
              against all attacks. Educational content is provided for general
              information and does not constitute medical, legal, or
              professional advice. Always consult qualified professionals for
              individual care decisions.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Limitation of liability
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              To the maximum extent permitted by law, Asian Doula Alliance and
              its directors, officers, employees, and volunteers will not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Services. ADA&rsquo;s
              total liability for any direct damages will not exceed the
              amount you paid to ADA in the twelve months before the claim
              arose, or $100, whichever is greater.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Governing law &amp; disputes
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              These Terms are governed by the laws of the State of California,
              without regard to its conflict-of-laws principles. Any dispute
              arising from these Terms or the Services will be resolved in the
              state or federal courts located in Orange County, California, and
              you consent to personal jurisdiction there. The prevailing party
              in any action is entitled to reasonable attorney fees and costs.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Changes to these Terms
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              We may update these Terms as our programs or applicable law
              evolve. Material changes will be announced on this page and, where
              appropriate, by email to certified doulas and active enrollees.
              Continued use of the Services after a change constitutes acceptance
              of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Contact
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              Questions about these Terms:{' '}
              <a
                href="mailto:contact@asiandoula.org"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                contact@asiandoula.org
              </a>
              <br />
              Asian Doula Alliance, 7515 Irvine Center Dr, Suite 110, Irvine, CA
              92618, United States.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
