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
  affiliation: 'Independent' | 'Cooings-affiliated' | 'Founder';
  bio: string;
};

// Inaugural board, formally seated at the May 2026 meeting.
// Independent directors hold the majority vote on any related-party
// transaction involving ADA's training partner (Cooings LLC), per the
// standing board resolution and the conflict-of-interest policy.
const currentDirectors: Director[] = [
  {
    name: 'Seth Meng',
    initials: 'SM',
    role: 'Board Chair · Founding Director',
    affiliation: 'Founder',
    bio: "Seth founded the Asian Doula Alliance in 2022 to set professional standards for postpartum doulas serving Asian immigrant families in the United States. He serves as the inaugural Board Chair and leads ADA's technology infrastructure — including the five-language certification exam platform, exam administration system, and public doula verification registry. Seth is also affiliated with Cooings LLC, an ADA-approved training partner; this related-party relationship is fully disclosed and governed by a standing board resolution adopted under ADA's conflict-of-interest policy.",
  },
  {
    name: 'Wesley Lau',
    initials: 'WL',
    role: 'Independent Director',
    affiliation: 'Independent',
    bio: 'Wesley serves as one of two independent directors providing external oversight of board governance, financial controls, and any decisions involving ADA training partners. As an independent voice, he holds a deciding vote on related-party transactions and on the standing approval of the Cooings exam-fee remittance arrangement. Wesley receives no compensation from ADA or any affiliated training partner.',
  },
  {
    name: 'Mingyu Zhang',
    initials: 'MZ',
    role: 'Independent Director',
    affiliation: 'Independent',
    bio: "Mingyu is the second of ADA's independent directors, contributing external expertise in community programs, member services, and member protection. Along with Wesley, she carries the independent vote required for the board to approve any transaction in which a Cooings-affiliated director has an interest. Mingyu receives no compensation from ADA or any affiliated training partner.",
  },
  {
    name: 'Veronica Tseng',
    initials: 'VT',
    role: 'Director',
    affiliation: 'Cooings-affiliated',
    bio: 'Veronica brings extensive operational experience in postpartum services and Asian-immigrant family care to ADA. She works directly with ADA-certified doulas, training partners, and the families ADA serves, and informs board strategy on member needs and program delivery. As a Cooings-affiliated director, Veronica abstains from board votes involving the Cooings training partnership.',
  },
  {
    name: 'Mia Liu',
    initials: 'ML',
    role: 'Director',
    affiliation: 'Cooings-affiliated',
    bio: "Mia leads operations at Cooings LLC, ADA's primary training partner today, and brings to the board a deep practical knowledge of the postpartum doula workforce, family-facing care delivery, and the regional service markets ADA's certified doulas serve. As a Cooings-affiliated director, Mia abstains from board votes involving the Cooings training partnership.",
  },
];

const officerRoles = [
  {
    number: '01',
    title: 'Board Chair',
    description:
      "Leads the Board of Directors and represents ADA in external affairs. The Chair sets the strategic agenda, chairs board meetings, and serves as ADA's primary spokesperson. Works closely with all directors to ensure ADA's programs align with its mission of advancing culturally integrated postpartum care.",
    held_by: 'Seth Meng (first term, 2026)',
  },
  {
    number: '02',
    title: 'Treasurer',
    description:
      "Holds primary responsibility for the financial integrity of ADA, including budget oversight, financial reporting, scholarship fund stewardship, and compliance with 501(c)(3) requirements. By board policy, the Treasurer is held by an independent director so that financial oversight is separated from training-partner interests.",
    held_by: 'Independent director (designated at inaugural board meeting)',
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

const affiliationStyle: Record<Director['affiliation'], string> = {
  Independent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cooings-affiliated': 'bg-amber-50 text-amber-700 border-amber-200',
  Founder: 'bg-ada-purple/10 text-ada-purple border-ada-purple/20',
};

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
              Five directors. Two independent. One mission.
            </h2>
            <p className="mt-4 text-ada-navy/70 leading-relaxed">
              ADA&rsquo;s Board of Directors is a volunteer body that sets
              strategy, holds management accountable, and protects the integrity
              of certification. Our 2-2-1 structure &mdash; two independent
              directors, two directors affiliated with our training partner, and
              the founding Chair &mdash; gives independent directors the
              deciding vote on any related-party matter, ensuring no single
              interest can compromise ADA&rsquo;s standards.
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
                    <p className="text-ada-navy/60 text-sm mt-0.5">{d.role}</p>
                  </div>
                </div>
                <span
                  className={`mt-4 self-start inline-block text-xs font-medium px-2.5 py-1 rounded-full border ${affiliationStyle[d.affiliation]}`}
                >
                  {d.affiliation}
                </span>
                <p className="mt-4 text-ada-navy/70 text-sm leading-relaxed flex-1">
                  {d.bio}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 max-w-3xl text-ada-navy/50 text-sm leading-relaxed border-t border-ada-navy/10 pt-6">
            <p>
              <span className="font-medium text-ada-navy/70">
                Compensation:
              </span>{' '}
              All directors serve without compensation from ADA. Directors are
              reimbursed only for documented out-of-pocket expenses incurred on
              ADA business.
            </p>
            <p className="mt-3">
              <span className="font-medium text-ada-navy/70">
                Conflicts of interest:
              </span>{' '}
              Each director signs an annual conflict-of-interest disclosure.
              Where a director has a financial or material interest in a board
              matter, they abstain from voting and may be excused from
              deliberation. Independent directors hold the deciding vote on
              all related-party transactions.
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
