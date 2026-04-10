import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: '2026 Board Election',
  description:
    'Nominations are open for the Asian Doula Alliance 2026\u20132028 Board of Directors election.',
};

const timelineSteps = [
  {
    title: 'Nominations Open',
    date: 'March 15 \u2013 April 30, 2026',
    description:
      'Any ADA-certified doula in good standing may nominate themselves or a colleague. Nominees must have held active certification for at least one year.',
    isActive: true,
  },
  {
    title: 'Candidate Review',
    date: 'May 1\u201315, 2026',
    description:
      'The current board reviews all nominations to verify eligibility. Candidates are notified and asked to submit a brief candidate statement.',
    isActive: false,
  },
  {
    title: 'Voting Period',
    date: 'June 1\u201314, 2026',
    description:
      'All ADA-certified doulas with active status may vote electronically. Each member casts one vote per position. Results are tallied independently.',
    isActive: false,
  },
  {
    title: 'Results & Transition',
    date: 'July 1, 2026',
    description:
      'Newly elected board members are announced and begin their two-year term. Outgoing members support a 30-day transition period.',
    isActive: false,
  },
];

const eligibilityRequirements = [
  'Must hold active ADA certification',
  'Certification must have been active for at least 12 months',
  'Must be in good standing (no active disciplinary actions)',
  'Must commit to serving a full two-year term',
  'Must attend at least 75% of quarterly board meetings',
];

const faqs = [
  {
    question: 'Can I nominate someone else?',
    answer:
      'Yes. Any certified doula can nominate a colleague, but the nominee must confirm their willingness to serve.',
  },
  {
    question: 'What if more people run than positions available?',
    answer:
      'If a position has multiple candidates, certified members vote by electronic ballot during the voting period.',
  },
  {
    question: 'Are board members paid?',
    answer:
      'No. All board positions are volunteer roles. Board members receive no compensation.',
  },
  {
    question: 'How long is a term?',
    answer:
      'Board members serve two-year terms. There are no term limits \u2014 members may be re-elected.',
  },
];

const sidebarLinks = [
  { label: 'Board of Directors', href: '/about-us/board' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Mission & Values', href: '/about-us/mission-value' },
];

export default function BoardElectionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'About Us', path: '/about-us' },
              { name: 'Board', path: '/about-us/board' },
              { name: 'Election', path: '/about-us/board/election' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            2026 Board Election
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Nominations are open for the 2026&ndash;2028 term
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main */}
            <div className="lg:w-4/5 order-2 lg:order-1">
              {/* Status Banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                <div>
                  <p className="font-semibold text-ada-navy">
                    Nominations are currently open
                  </p>
                  <p className="text-sm text-ada-navy/60 mt-0.5">
                    Deadline: April 30, 2026
                  </p>
                </div>
              </div>

              {/* Intro */}
              <p className="mt-8 text-ada-navy/70 leading-relaxed">
                Every two years, ADA&apos;s certified doula community elects the Board of
                Directors who will guide the organization&apos;s strategic direction. The 2026
                election covers all five board positions for the 2026&ndash;2028 term.
              </p>

              {/* Election Timeline */}
              <h2 className="font-dm-serif text-3xl text-ada-navy mt-12 mb-8">
                Election Timeline
              </h2>
              <div>
                {timelineSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          step.isActive ? 'bg-ada-purple' : 'bg-ada-navy/20'
                        } shrink-0 mt-1.5`}
                      />
                      {index < timelineSteps.length - 1 && (
                        <div className="w-px flex-1 bg-ada-navy/10" />
                      )}
                    </div>
                    <div className="pb-10">
                      <h3 className="font-outfit font-semibold text-ada-navy">
                        {step.title}
                      </h3>
                      <p className="text-sm text-ada-purple font-medium mt-0.5">
                        {step.date}
                      </p>
                      <p className="mt-2 text-ada-navy/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <h2 className="font-dm-serif text-3xl text-ada-navy mt-12 mb-6">
                Who Can Run?
              </h2>
              <ul className="space-y-3">
                {eligibilityRequirements.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-3 text-ada-navy/70"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-ada-purple/40 mt-2 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>

              {/* How to Nominate */}
              <h2 className="font-dm-serif text-3xl text-ada-navy mt-12 mb-4">
                How to Nominate
              </h2>
              <p className="text-ada-navy/70 leading-relaxed">
                To nominate yourself or a fellow certified doula, email{' '}
                <a
                  href="mailto:contact@asiandoula.org?subject=2026%20Board%20Nomination"
                  className="text-ada-purple hover:underline"
                >
                  contact@asiandoula.org
                </a>{' '}
                with the subject line &ldquo;2026 Board Nomination&rdquo;. Include the
                nominee&apos;s full name, certification number, and the position they&apos;re
                being nominated for. Self-nominations are welcome and encouraged.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:contact@asiandoula.org?subject=2026%20Board%20Nomination"
                  className="inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  Submit a Nomination &rarr;
                </a>
              </div>

              {/* FAQ */}
              <h2 className="font-dm-serif text-3xl text-ada-navy mt-16 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-outfit font-semibold text-ada-navy">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-ada-navy/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-32">
                <h4 className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-navy/40 mb-4">
                  Related Topics
                </h4>
                <nav className="space-y-2">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-ada-navy/70 hover:text-ada-purple transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
