import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Privacy Policy | Asian Doula Alliance',
  description:
    'How Asian Doula Alliance collects, uses, and protects your personal information across our website, certification programs, and donor relationships.',
};

const LAST_UPDATED = 'May 11, 2026';

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: 'Privacy Policy', path: '/privacy-policy' }])
          ),
        }}
      />

      <section className="bg-ada-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-[900px] mx-auto px-6">
          <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple">
            Legal
          </p>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
            Privacy Policy
          </h1>
          <p className="mt-4 text-ada-navy/50 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-[900px] mx-auto px-6 prose-content space-y-10">
          <p className="text-ada-navy/70 leading-relaxed">
            Asian Doula Alliance (&ldquo;ADA&rdquo;, &ldquo;we&rdquo;,
            &ldquo;our&rdquo;) is a California-incorporated 501(c)(3) nonprofit
            organization. We respect your privacy and are committed to handling
            personal information responsibly. This policy describes what we
            collect, how we use it, and the choices you have.
          </p>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Information we collect
            </h2>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>
                <strong>Contact information</strong> you submit through forms
                (name, email, phone number, message content) — used to respond
                to inquiries, process certification applications, and send
                requested updates.
              </li>
              <li>
                <strong>Certification records</strong> for enrolled doulas
                (training program, exam results, certificate ID, renewal
                history) — required to issue and maintain credentials and to
                support the public verification registry.
              </li>
              <li>
                <strong>Donation records</strong> if you give to ADA (your
                name, amount, payment processor reference) — required for tax
                receipting and IRS reporting.
              </li>
              <li>
                <strong>Usage data</strong> automatically collected by our
                hosting provider and analytics tools (IP address, browser type,
                pages visited, referring site) — used to maintain the site and
                understand aggregate traffic patterns.
              </li>
              <li>
                <strong>Cookies</strong> for essential session management,
                language preference, and analytics. You can disable non-essential
                cookies through your browser or the cookie banner on first
                visit.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              How we use information
            </h2>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>To respond to your inquiries and provide requested services.</li>
              <li>
                To administer the ADA certification program — including
                enrollment, exam delivery, credential issuance, renewal, and
                public registry verification.
              </li>
              <li>
                To process donations, issue tax receipts, and maintain donor
                records as required by U.S. nonprofit accounting standards.
              </li>
              <li>
                To send program updates and newsletters to people who have
                opted in. Every email includes an unsubscribe link.
              </li>
              <li>
                To analyze aggregate site usage and improve content, navigation,
                and educational resources.
              </li>
              <li>
                To comply with legal obligations (IRS filings, court orders,
                regulatory requests).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Third-party service providers
            </h2>
            <p className="text-ada-navy/70 leading-relaxed mb-3">
              We rely on a small set of vetted vendors to run the site and
              programs. They access only the data needed to perform their
              service and are bound by data-processing agreements.
            </p>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>
                <strong>Vercel</strong> &mdash; web hosting and content delivery.
              </li>
              <li>
                <strong>Supabase</strong> &mdash; database for certification
                records and form submissions.
              </li>
              <li>
                <strong>Resend</strong> &mdash; transactional email delivery
                (certificates, exam results, receipts).
              </li>
              <li>
                <strong>Google Analytics &amp; Google Tag Manager</strong>
                &mdash; aggregate website analytics.
              </li>
              <li>
                <strong>Payment processors</strong> (for donations) &mdash; PCI-compliant
                providers; ADA does not store full card numbers.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              What we never do
            </h2>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>We do not sell, rent, or trade your personal information.</li>
              <li>
                We do not share donor lists with other organizations for their
                marketing.
              </li>
              <li>
                We do not run third-party advertising or behavioral targeting
                on this website.
              </li>
              <li>
                We do not knowingly collect personal information from children
                under 13.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Your rights
            </h2>
            <p className="text-ada-navy/70 leading-relaxed mb-3">
              Under the California Consumer Privacy Act (CCPA), GDPR, and similar
              frameworks, you have the right to:
            </p>
            <ul className="space-y-2 text-ada-navy/70 leading-relaxed list-disc pl-5">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>
                Request deletion of your data, subject to certification record
                retention obligations.
              </li>
              <li>Opt out of marketing emails at any time.</li>
              <li>Disable non-essential cookies in your browser.</li>
            </ul>
            <p className="text-ada-navy/70 leading-relaxed mt-3">
              To exercise any of these rights, email{' '}
              <a
                href="mailto:privacy@asiandoula.org"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                privacy@asiandoula.org
              </a>{' '}
              with the subject line &ldquo;Privacy Request&rdquo;. We respond
              within 30 days.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Data retention
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              Certification records are retained for the lifetime of the
              credential plus seven years, to support credential verification
              by employers, insurance partners, and regulators. Donation records
              are retained for at least seven years as required by IRS rules.
              Contact-form submissions are retained for up to two years unless a
              certification or service relationship is established. Aggregate
              analytics data is retained according to Google&rsquo;s default
              policies.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Security
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              All traffic to and from this site is encrypted with HTTPS. Database
              access is role-restricted and audit-logged. Payment processing is
              handled by PCI-DSS compliant providers. No method of transmission
              over the internet is 100% secure, but we follow industry best
              practices and reassess our controls regularly.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Changes to this policy
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              We may update this Privacy Policy as our services or applicable
              law evolve. Material changes will be announced on this page and,
              where appropriate, by email. The &ldquo;Last updated&rdquo; date at the
              top reflects the most recent revision.
            </p>
          </div>

          <div>
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
              Contact
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              Privacy questions and data requests:{' '}
              <a
                href="mailto:privacy@asiandoula.org"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                privacy@asiandoula.org
              </a>
              <br />
              General contact: see our{' '}
              <Link
                href="/support/contact"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                Contact page
              </Link>
              .
            </p>
            <p className="text-ada-navy/60 text-sm leading-relaxed mt-4">
              Asian Doula Alliance, 7515 Irvine Center Dr, Suite 110, Irvine, CA
              92618, United States.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
