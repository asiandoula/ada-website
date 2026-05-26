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

// Tier 1 — full-width treatment under the founder's letter
const founderEmeritus: Director = {
  name: 'Qi Wang',
  initials: 'QW',
  role: 'Founder Emeritus',
  location: 'Southern California',
  bio: "Doula and doula educator. Qi Wang seeded what would become the Asian Doula Alliance in 2021, starting from a WeChat community of Asian-immigrant postpartum caregivers and growing it into the seed of a national professional body. Her conviction — that culturally integrated postpartum care deserved both the dignity of formal certification and a community that protected the women practicing it — remains ADA's founding premise. As Founder Emeritus, she advises on community and cultural fidelity as ADA grows beyond its founding roots.",
};

// Tier 2 — full-width but medium scale
const president: Director = {
  name: 'Seth Meng',
  initials: 'SM',
  role: 'President',
  location: 'Buffalo, NY',
  bio: "Seth Meng was elected ADA's inaugural Board President at the 2026 board meeting, where he serves as the executive lead for technology, governance, and standards. His background is as an analyst and researcher in elder-care outcomes at the University of Rochester Medical Center, applying statistics and machine learning to questions of long-term care quality and family-caregiver impact. That orientation toward measurement, instrumentation, and protective system design now shapes ADA's certification platform, multilingual exam architecture, and public verification registry. Seth came to ADA out of a long-standing commitment to building public-benefit institutions.",
};

// Tier 3 — 4 directors, equal weight, 2-column grid
const directors: Director[] = [
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
    bio: "Veronica Tseng works in postpartum doula service operations across the Bay Area, Southern California, Seattle, New York City, and Chicago, where she focuses on doula coordination and family-facing program delivery. She brings that ground-level view to ADA's board — informing conversations on member needs, program quality, and how certification standards translate into daily practice for the doulas and families ADA serves.",
  },
  {
    name: 'Mia Liu',
    initials: 'ML',
    role: 'Director',
    location: 'Irvine, CA',
    bio: "Mia Liu leads operations for a doula services organization, overseeing doula workforce coordination, regional service delivery, and the day-to-day work of running culturally integrated postpartum care at scale. She brings to ADA's board the practical realities of the field — the regional service markets, the doulas who carry the work, and the families they serve — and helps the board calibrate certification standards against operational reality.",
  },
];

const officerRoles = [
  { title: 'Board President', held_by: 'Seth Meng (2026–)' },
  { title: 'Treasurer', held_by: 'Designated at inaugural board meeting' },
  { title: 'Secretary', held_by: 'Designated at inaugural board meeting' },
  { title: 'Director of Education', held_by: 'Standing committee chair' },
];

const standingPolicies = [
  { title: 'Conflict of Interest', detail: 'Signed annually by all directors' },
  { title: 'Document Retention', detail: '7-year minimum' },
  { title: 'Whistleblower', detail: 'Protections in place' },
  { title: 'Independent Audit', detail: 'Annual, beginning FY2025' },
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

      {/* Letter-as-hero — Qi Wang's founding letter, no traditional title hero */}
      <section className="bg-ada-cream pt-32 pb-20 md:pt-40 md:pb-24">
        <article className="max-w-[640px] mx-auto px-6">
          <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-ada-purple">
            A note from our founder
          </p>
          <div className="mt-8 text-ada-navy/80 leading-[1.8] text-[17px] md:text-[18px] space-y-5 font-light">
            <p>
              In 2021, I started a small WeChat group for postpartum doulas
              like me &mdash; women trained in the traditions our mothers and
              grandmothers carried with them when they immigrated, and now
              working in a country whose healthcare system rarely had room
              for that knowledge. We needed a place to ask each other
              questions. We needed each other.
            </p>
            <p>
              What I did not expect was how quickly that group would grow
              into something the work itself required: a place to set
              standards, to certify, and &mdash; most of all &mdash; to
              protect the women doing this work when no one else would.
            </p>
            <p>
              Today, the Asian Doula Alliance is a 501(c)(3) nonprofit
              guided by a volunteer board of directors, with members serving
              their first formal term. I am honored to step into the role of
              Founder Emeritus as they take the work forward. The premise
              has not changed: culturally integrated postpartum care
              deserves both the dignity of certification and a community
              that protects its practitioners.
            </p>
          </div>

          {/* Pull quote — mobile: below body; desktop: same column, visually offset */}
          <blockquote className="mt-10 border-l-2 border-ada-purple pl-6 font-dm-serif text-[22px] md:text-[26px] text-ada-navy leading-snug">
            &ldquo;We needed to protect the women doing this work.&rdquo;
          </blockquote>

          <p className="mt-10 font-outfit text-sm text-ada-navy/60">
            &mdash; Qi Wang
            <br />
            <span className="text-ada-navy/40 tracking-wide uppercase text-xs">
              Founder Emeritus &middot; Southern California
            </span>
          </p>
        </article>
      </section>

      {/* Tiered Roster — Qi Wang large, Seth medium, 4 directors equal */}
      <section className="bg-white pt-20 pb-24 md:pt-24 md:pb-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-ada-purple">
              The Board
            </p>
            <span className="h-px flex-1 bg-ada-navy/15" aria-hidden="true" />
            <p className="font-outfit text-xs tracking-[0.2em] text-ada-navy/50">2026</p>
          </div>

          {/* Tier 1 — Qi Wang, full-width, large placeholder + bio */}
          <article className="mb-20 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-14 items-start">
              <div
                className="w-full aspect-square bg-ada-cream rounded-sm flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="font-dm-serif text-6xl md:text-7xl text-ada-purple/40">
                  {founderEmeritus.initials}
                </span>
              </div>
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy leading-tight">
                  {founderEmeritus.name}
                </h2>
                <p className="mt-3 font-outfit text-xs tracking-[0.2em] uppercase text-ada-purple">
                  {founderEmeritus.role} &middot; {founderEmeritus.location}
                </p>
                <p className="mt-6 text-ada-navy/75 leading-[1.8] text-[15px] md:text-base">
                  {founderEmeritus.bio}
                </p>
              </div>
            </div>
          </article>

          {/* Tier 2 — Seth Meng, medium scale */}
          <article className="mb-20 md:mb-24 max-w-[820px]">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start">
              <div
                className="w-full aspect-square bg-ada-cream rounded-sm flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="font-dm-serif text-5xl text-ada-purple/40">
                  {president.initials}
                </span>
              </div>
              <div>
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy leading-tight">
                  {president.name}
                </h2>
                <p className="mt-3 font-outfit text-xs tracking-[0.2em] uppercase text-ada-purple">
                  {president.role} &middot; {president.location}
                </p>
                <p className="mt-5 text-ada-navy/75 leading-[1.8] text-[15px]">
                  {president.bio}
                </p>
              </div>
            </div>
          </article>

          {/* Tier 3 — 4 directors, equal weight, 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14">
            {directors.map((d) => (
              <article key={d.name}>
                <div className="grid grid-cols-[88px_1fr] gap-5 items-start">
                  <div
                    className="bg-ada-cream rounded-sm flex items-center justify-center"
                    style={{ width: '88px', height: '88px' }}
                    aria-hidden="true"
                  >
                    <span className="font-dm-serif text-2xl text-ada-purple/40">
                      {d.initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-dm-serif text-xl text-ada-navy leading-tight">
                      {d.name}
                    </h3>
                    <p className="mt-2 font-outfit text-[10px] tracking-[0.2em] uppercase text-ada-purple">
                      {d.role} &middot; {d.location}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-ada-navy/75 leading-[1.75] text-[14px]">
                  {d.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Conflicts of Interest — editorial typography, no boxed card */}
      <section className="bg-ada-cream py-24 md:py-28">
        <div className="max-w-[640px] mx-auto px-6">
          <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-ada-purple">
            Governance &amp; Conflicts of Interest
          </p>
          <div className="mt-2 mb-10 h-px w-16 bg-ada-purple/30" />
          <div className="space-y-5 text-ada-navy/80 leading-[1.8] text-[15px] md:text-[16px]">
            <p>
              ADA&rsquo;s voting board is composed of 2 independent directors
              (Wesley Lau, Mingyu Zhang), 2 directors who work in the doula
              industry (Mia Liu, Veronica Tseng), and a founder-chair (Seth
              Meng). All directors serve as volunteers and receive no
              compensation from ADA.
            </p>
            <p>
              Each director signs an annual conflict-of-interest disclosure,
              and any director with a financial or material interest in a
              board matter abstains from voting. The board has adopted a
              standing policy that any related-party transaction requires
              the affirmative vote of the independent directors.
            </p>
            <p>
              For ADA&rsquo;s exam-fee remittance arrangement and other
              related-party disclosures, see{' '}
              <Link
                href="/about-us/financials"
                className="text-ada-purple underline underline-offset-4 hover:text-ada-purple-hover"
              >
                Financials &amp; Accountability
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Officers & Standing Policies — condensed 2-column appendix */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            <div>
              <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-ada-purple mb-1">
                Officers
              </p>
              <div className="h-px w-16 bg-ada-purple/30 mb-8" />
              <dl className="space-y-5">
                {officerRoles.map((o) => (
                  <div key={o.title}>
                    <dt className="font-dm-serif text-[17px] text-ada-navy leading-tight">
                      {o.title}
                    </dt>
                    <dd className="mt-1 text-ada-navy/60 text-[13px] leading-relaxed">
                      {o.held_by}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-ada-purple mb-1">
                Standing Policies
              </p>
              <div className="h-px w-16 bg-ada-purple/30 mb-8" />
              <dl className="space-y-5">
                {standingPolicies.map((p) => (
                  <div key={p.title}>
                    <dt className="font-dm-serif text-[17px] text-ada-navy leading-tight">
                      {p.title}
                    </dt>
                    <dd className="mt-1 text-ada-navy/60 text-[13px] leading-relaxed">
                      {p.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <nav className="mt-16 pt-8 border-t border-ada-navy/10 flex flex-wrap gap-x-6 gap-y-2">
            <p className="font-outfit text-xs tracking-[0.2em] uppercase text-ada-navy/40 mr-2">
              Related
            </p>
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Quiet Open Call — replaces boxed election banner */}
      <section className="bg-ada-cream py-16 md:py-20">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <p className="font-dm-serif italic text-ada-navy/70 text-base md:text-lg leading-relaxed">
            We accept board nominations year-round. To nominate yourself or
            someone for the 2027 term, write to{' '}
            <a
              href="mailto:board@asiandoula.org"
              className="text-ada-purple underline underline-offset-4 hover:text-ada-purple-hover not-italic"
            >
              board@asiandoula.org
            </a>{' '}
            or{' '}
            <Link
              href="/about-us/board/election"
              className="text-ada-purple underline underline-offset-4 hover:text-ada-purple-hover not-italic"
            >
              submit a nomination
            </Link>
            .
          </p>
        </div>
      </section>

      <ContactForm />
    </>
  );
}
