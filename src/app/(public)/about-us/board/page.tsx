import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Board of Directors',
  description:
    "Meet the volunteer Board of Directors who guide the Asian Doula Alliance's mission and strategic direction.",
};

type Director = {
  name: string;
  initials: string;
  role: string;
  location: string;
  bio: string;
};

// Inaugural board, seated at the May 2026 meeting, plus Founder Emeritus.
// Affiliation labels removed from per-card display per Seth 2026-05-25;
// composition disclosed in the Governance footer block instead.
const currentDirectors: Director[] = [
  {
    name: 'Qi Wang',
    initials: 'QW',
    role: 'Founder Emeritus',
    location: 'Southern California',
    bio: "Doula and doula educator. Qi Wang seeded what would become the Asian Doula Alliance in 2021, starting from a WeChat community of Asian-immigrant postpartum caregivers and growing it into the seed of a national professional body. Her conviction — that culturally integrated postpartum care deserved both the dignity of formal certification and a community that protected the women practicing it — remains ADA's founding premise. As Founder Emeritus, she advises on community and cultural fidelity as ADA grows beyond its founding roots.",
  },
  {
    name: 'Seth Meng',
    initials: 'SM',
    role: 'President',
    location: 'Buffalo, NY',
    bio: "Seth Meng was elected ADA's inaugural Board President at the 2026 board meeting, where he serves as the executive lead for technology, governance, and standards. His background is as an analyst and researcher in elder-care outcomes at the University of Rochester Medical Center, applying statistics and machine learning to questions of long-term care quality and family-caregiver impact. That orientation toward measurement, instrumentation, and protective system design now shapes ADA's certification platform, multilingual exam architecture, and public verification registry. Seth came to ADA out of a long-standing commitment to building public-benefit institutions.",
  },
  {
    name: 'Wesley Lau',
    initials: 'WL',
    role: 'Director',
    location: 'Los Angeles, CA',
    bio: "Wesley Lau is a serial entrepreneur and venture capital investor whose career has crossed several industries — from technology and finance to community-focused initiatives. Outside his professional work, he has been a steady presence in community and public-benefit organizations, drawn to neighborhood cleanups and the unglamorous volunteer work others overlook. He brings that same orientation to ADA's board — that good organizations are built by people who do the small, repeatable work as carefully as the strategic decisions.",
  },
  {
    name: 'Mingyu Zhang',
    initials: 'MZ',
    role: 'Director',
    location: 'Los Angeles, CA',
    bio: "Mingyu Zhang spent her earlier career in finance before turning much of her time and energy toward public-benefit work. She volunteers across a range of community and nonprofit initiatives, with a particular commitment to animal welfare and rescue. On ADA's board, she pairs financial discipline with steady engagement in mission-driven organizations — reading budgets carefully and showing up for the work because she cares about the people behind it.",
  },
  {
    name: 'Veronica Tseng',
    initials: 'VT',
    role: 'Director',
    location: 'Irvine, CA',
    bio: "Veronica Tseng works in operations at Cooings LLC, ADA's primary training partner, where she focuses on doula coordination and family-facing program delivery across the Bay Area, Southern California, Seattle, New York City, and Chicago. She brings that ground-level view to ADA's board — informing conversations on member needs, program quality, and how certification standards translate into daily practice for the doulas and families ADA serves.",
  },
  {
    name: 'Mia Liu',
    initials: 'ML',
    role: 'Director',
    location: 'Irvine, CA',
    bio: "Mia Liu leads operations at Cooings LLC, ADA's primary training partner, where she oversees doula workforce coordination, regional service delivery, and the day-to-day work of running culturally integrated postpartum care at scale. She brings to ADA's board the practical realities of the field — the regional service markets, the doulas who carry the work, and the families they serve — and helps the board calibrate certification standards against operational reality.",
  },
];

const officerRoles = [
  {
    number: '01',
    title: 'Board President',
    description:
      "Leads the Board of Directors and represents ADA in external affairs. The President sets the strategic agenda, chairs board meetings, and serves as ADA's primary spokesperson. Works closely with all directors to ensure ADA's programs align with its mission of advancing culturally integrated postpartum care.",
    held_by: 'Seth Meng (first term, 2026)',
  },
  {
    number: '02',
    title: 'Treasurer',
    description:
      "Holds primary responsibility for the financial integrity of ADA, including budget oversight, financial reporting, scholarship fund stewardship, and compliance with 501(c)(3) requirements. By board policy, the Treasurer is held by an independent director so that financial oversight is separated from training-partner interests.",
    held_by: 'Designated at inaugural board meeting',
  },
  {
    number: '03',
    title: 'Secretary',
    description:
      'Maintains the official record of all board proceedings, manages governance documentation (bylaws, conflict-of-interest disclosures, meeting minutes), and ensures regulatory filings (state registry, IRS Form 990, California Attorney General Registry of Charitable Trusts) are submitted on time.',
    held_by: 'Designated at inaugural board meeting',
  },
  {
    number: '04',
    title: 'Director of Education',
    description:
      "Oversees the integrity of ADA's certification curriculum, training standards, and examination system. Ensures that ADA's programs remain rigorous, culturally relevant, and aligned with current evidence-based practice. Manages the development of multilingual exam content across five languages and sets continuing-education and recertification requirements.",
    held_by: 'Standing committee chaired by a board director',
  },
];

const sidebarLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Mission & Values', href: '/about-us/mission-value' },
  { label: 'History', href: '/about-us/history' },
  { label: 'Financials & Accountability', href: '/about-us/financials' },
];

export default function BoardOfDirectorsPage() {
  const t = useTranslations('aboutBoard');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t('sidebarLinkAboutUs'), path: '/about-us' },
              { name: t('sidebarLinkBoard'), path: '/about-us/board' },
            ])
          ),
        }}
      />
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            {t('heroTitle')}
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Current Directors */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple">
              Current Board · Inaugural Term, May 2026
            </p>
            <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
              The people setting our standards
            </h2>
            <p className="mt-4 text-ada-navy/70 leading-relaxed">
              ADA&rsquo;s Board of Directors is a volunteer body that sets
              strategy, holds management accountable, and protects the
              integrity of certification. Our directors bring backgrounds in
              postpartum care, finance, technology, entrepreneurship, and
              community service &mdash; and an Honorary role for the founder
              whose work seeded the alliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDirectors.map((d) => (
              <article
                key={d.name}
                className="bg-ada-off-white rounded-2xl p-6 border border-ada-navy/5 flex flex-col"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full bg-ada-purple/15 text-ada-purple font-outfit font-semibold text-lg flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    {d.initials}
                  </div>
                  <div>
                    <h3 className="font-dm-serif text-xl text-ada-navy leading-tight">
                      {d.name}
                    </h3>
                    <p className="text-ada-navy/60 text-sm mt-0.5">
                      {d.role} &middot; {d.location}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-ada-navy/70 text-sm leading-relaxed flex-1">
                  {d.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Conflicts of Interest */}
      <section className="bg-ada-cream py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-ada-navy/5">
            <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-5">
              Governance &amp; Conflicts of Interest
            </h2>
            <p className="text-ada-navy/70 leading-relaxed">
              ADA&rsquo;s voting board is composed of 2 independent directors
              (Wesley Lau, Mingyu Zhang), 2 directors who work at our primary
              training partner Cooings LLC (Mia Liu, Veronica Tseng), and a
              founder-chair (Seth Meng). All directors serve as volunteers and
              receive no compensation from ADA.
            </p>
            <p className="mt-4 text-ada-navy/70 leading-relaxed">
              Each director signs an annual conflict-of-interest disclosure,
              and any director with a financial or material interest in a
              board matter abstains from voting. The board has adopted a
              standing policy that any related-party transaction &mdash;
              including arrangements with Cooings LLC &mdash; requires the
              affirmative vote of the independent directors.
            </p>
            <p className="mt-4 text-ada-navy/70 leading-relaxed">
              See our{' '}
              <Link
                href="/about-us/financials"
                className="text-ada-purple underline hover:text-ada-purple-hover"
              >
                Financials &amp; Accountability
              </Link>{' '}
              page for the standing exam-fee remittance arrangement and other
              related-party disclosures.
            </p>
          </div>
        </div>
      </section>

      {/* Officer roles */}
      <section className="bg-ada-off-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="lg:w-4/5 order-2 lg:order-1">
              <h2 className="font-dm-serif text-3xl text-ada-navy">
                Board officers &amp; standing roles
              </h2>
              <p className="mt-4 text-ada-navy/70 leading-relaxed max-w-3xl">
                Officer positions are filled by election among the seated
                directors at the inaugural and subsequent annual meetings.
                Officer roles define how authority and accountability are
                distributed among the board.
              </p>

              <div className="mt-12 space-y-10">
                {officerRoles.map((position) => (
                  <div key={position.number} className="flex gap-6">
                    <span className="font-outfit text-2xl font-semibold text-ada-purple/30 shrink-0 w-10">
                      {position.number}
                    </span>
                    <div>
                      <h3 className="font-dm-serif text-xl text-ada-navy">
                        {position.title}
                      </h3>
                      <p className="mt-3 text-ada-navy/70 leading-relaxed">
                        {position.description}
                      </p>
                      <p className="mt-3 text-ada-navy/50 text-sm">
                        <span className="font-outfit uppercase tracking-wider text-xs text-ada-navy/40">
                          Currently held by:
                        </span>{' '}
                        {position.held_by}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-ada-navy/40 italic mt-12">
                {t('bottomNote')}
              </p>
            </div>

            <aside className="lg:w-1/5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-32">
                <h4 className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-navy/40 mb-4">
                  {t('relatedTopicsTitle')}
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

      {/* Election Banner */}
      <section className="bg-white py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-ada-purple shrink-0 mt-1.5" />
                <div>
                  <p className="font-outfit font-semibold text-ada-navy">
                    {t('electionBannerTitle')}
                  </p>
                  <p className="text-ada-navy/60 text-sm mt-0.5">
                    {t('electionBannerDescription')}
                  </p>
                </div>
              </div>
              <Link
                href="/about-us/board/election"
                className="inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors shrink-0"
              >
                {t('learnMoreAndNominate')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
