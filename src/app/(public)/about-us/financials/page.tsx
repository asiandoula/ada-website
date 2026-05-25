import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Financials & Accountability | Asian Doula Alliance',
  description:
    'Asian Doula Alliance is a transparent 501(c)(3) nonprofit. View our EIN, tax-exempt status, governance, and annual program impact.',
};

const programAllocation = [
  {
    label: 'Certification & Training',
    description:
      'Multilingual exam development, training curriculum maintenance, examiner training, and the public verification registry.',
    pct: '62%',
  },
  {
    label: 'Scholarships',
    description:
      'Need-based grants covering exam and training fees for doulas from underserved Asian communities.',
    pct: '22%',
  },
  {
    label: 'Community Programs',
    description:
      'Workshops, family education events, partner outreach, and translation of postpartum care materials.',
    pct: '10%',
  },
  {
    label: 'Administration',
    description:
      'Technology, accounting, legal, insurance, and the volunteer-led board governance.',
    pct: '6%',
  },
];

const governanceCommitments = [
  'Annual independent review of finances and program outcomes.',
  'Public Form 990 filing annually, starting with fiscal year 2025 (Q3 2026 publication).',
  'Volunteer Board of Directors — no board member receives compensation.',
  'Written conflict-of-interest policy reviewed annually.',
  'Whistleblower and document-retention policies in place.',
  'Donor privacy: we never sell or share donor lists with other organizations.',
];

export default function FinancialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'About', path: '/about-us' },
              { name: 'Financials & Accountability', path: '/about-us/financials' },
            ])
          ),
        }}
      />

      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple">
            About ADA
          </p>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Financials &amp; Accountability
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl leading-relaxed">
            We believe a community-supported certification body should be
            radically transparent about its finances and governance. This page
            collects everything you need to assess how ADA operates and where
            your support goes.
          </p>
        </div>
      </section>

      {/* Legal status */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-ada-off-white rounded-2xl p-8 border border-ada-navy/5">
              <h2 className="font-dm-serif text-2xl text-ada-navy mb-5">
                Legal status
              </h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                    Legal name
                  </dt>
                  <dd className="text-ada-navy font-medium mt-1">
                    Asian Doula Alliance
                  </dd>
                </div>
                <div>
                  <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                    EIN (Federal Tax ID)
                  </dt>
                  <dd className="text-ada-navy font-mono mt-1">93-3935047</dd>
                </div>
                <div>
                  <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                    IRS classification
                  </dt>
                  <dd className="text-ada-navy mt-1">
                    501(c)(3) public charity
                  </dd>
                </div>
                <div>
                  <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                    State of incorporation
                  </dt>
                  <dd className="text-ada-navy mt-1">California, 2022</dd>
                </div>
                <div>
                  <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                    Registered office
                  </dt>
                  <dd className="text-ada-navy mt-1 leading-relaxed">
                    7515 Irvine Center Dr, Suite 110
                    <br />
                    Irvine, CA 92618
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-ada-purple/5 rounded-2xl p-8 border border-ada-purple/20">
              <h2 className="font-dm-serif text-2xl text-ada-navy mb-5">
                Documents available
              </h2>
              <ul className="space-y-3 text-ada-navy/70 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#x2022;</span>
                  IRS Determination Letter recognizing 501(c)(3) status &mdash; available on request.
                </li>
                <li className="flex gap-3">
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#x2022;</span>
                  Form 990 &mdash; our first annual filing covers fiscal year 2025 and will be published in Q3 2026. Future filings are released annually within 30 days of IRS acceptance.
                </li>
                <li className="flex gap-3">
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#x2022;</span>
                  California Attorney General Registry of Charitable Trusts filings.
                </li>
                <li className="flex gap-3">
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#x2022;</span>
                  Bylaws and conflict-of-interest policy &mdash; available on request.
                </li>
                <li className="flex gap-3">
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#x2022;</span>
                  Annual program impact summary &mdash; see below.
                </li>
              </ul>
              <p className="mt-6 text-ada-navy/60 text-xs leading-relaxed">
                To request any of the above documents, email{' '}
                <a
                  href="mailto:finance@asiandoula.org"
                  className="text-ada-purple underline hover:text-ada-purple-hover"
                >
                  finance@asiandoula.org
                </a>
                . We respond within 10 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Program allocation */}
      <section className="bg-ada-off-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-3xl text-ada-navy">
              Where our resources go
            </h2>
            <p className="mt-3 text-ada-navy/60 max-w-2xl mx-auto">
              Planned allocation of ADA&rsquo;s annual operating budget. Audited
              actuals will be disclosed each year on Form 990, beginning with
              the fiscal year 2025 filing (publication Q3 2026).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {programAllocation.map((p) => (
              <div
                key={p.label}
                className="bg-white rounded-2xl p-6 border border-gray-200"
              >
                <p className="font-dm-serif text-4xl text-ada-purple">
                  {p.pct}
                </p>
                <h3 className="mt-3 font-outfit font-semibold text-ada-navy">
                  {p.label}
                </h3>
                <p className="mt-2 text-ada-navy/60 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual impact */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl text-ada-navy text-center">
            Annual program impact
          </h2>
          <p className="mt-3 text-ada-navy/60 text-center max-w-2xl mx-auto">
            A snapshot of the doulas we trained, the families served, and the
            scholarships awarded since incorporation.
          </p>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-ada-cream rounded-2xl p-6 text-center">
              <p className="font-dm-serif text-4xl text-ada-navy">167+</p>
              <p className="mt-2 text-ada-navy/60 text-sm">
                Certified doulas
              </p>
            </div>
            <div className="bg-ada-cream rounded-2xl p-6 text-center">
              <p className="font-dm-serif text-4xl text-ada-navy">5</p>
              <p className="mt-2 text-ada-navy/60 text-sm">
                Languages of certification
              </p>
            </div>
            <div className="bg-ada-cream rounded-2xl p-6 text-center">
              <p className="font-dm-serif text-4xl text-ada-navy">50+</p>
              <p className="mt-2 text-ada-navy/60 text-sm">
                Workshops &amp; seminars
              </p>
            </div>
            <div className="bg-ada-cream rounded-2xl p-6 text-center">
              <p className="font-dm-serif text-4xl text-ada-navy">$2M+</p>
              <p className="mt-2 text-ada-navy/60 text-sm">
                Scholarships secured
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance commitments */}
      <section className="bg-ada-off-white py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
            <div>
              <h2 className="font-dm-serif text-3xl text-ada-navy">
                Governance commitments
              </h2>
              <p className="mt-4 text-ada-navy/60 leading-relaxed">
                ADA is governed by a volunteer Board of Directors elected by the
                certified doula community every two years. We hold ourselves to
                the same standards we ask of certified doulas.
              </p>
              <Link
                href="/about-us/board"
                className="inline-flex items-center gap-2 mt-6 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
              >
                Meet the Board <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <ul className="space-y-3">
              {governanceCommitments.map((c) => (
                <li
                  key={c}
                  className="bg-white rounded-xl px-5 py-4 border border-ada-navy/5 text-ada-navy/70 text-sm leading-relaxed flex items-start gap-3"
                >
                  <span className="text-ada-purple mt-0.5" aria-hidden="true">&#10003;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-ada-navy/60">
            Have a question about our finances or governance?
          </p>
          <a
            href="mailto:finance@asiandoula.org"
            className="inline-flex items-center gap-2 mt-3 text-ada-purple font-medium hover:text-ada-purple-hover transition-colors"
          >
            finance@asiandoula.org <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </>
  );
}
