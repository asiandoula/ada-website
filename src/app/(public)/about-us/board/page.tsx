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

type Person = {
  name: string;
  role: string;
  location: string;
  bio: string;
  initials: string;
  avatarBg: string; // brand pastel background (literal class for Tailwind JIT)
  avatarText: string; // deep accent ink for the monogram letters
};

// Leadership pair (Founder Emeritus + President) — shown as two large plates.
const leadership: Person[] = [
  {
    name: 'Qi Wang',
    role: 'Founder Emeritus',
    location: 'Southern California',
    initials: 'QW',
    avatarBg: 'bg-ada-sage',
    avatarText: 'text-[#4a7c1f]',
    bio: "Doula and doula educator. Qi Wang seeded what would become the Asian Doula Alliance in 2021, starting from a WeChat community of Asian-immigrant postpartum caregivers and growing it into the seed of a national professional body. Her conviction — that culturally integrated postpartum care deserved both the dignity of formal certification and a community that protected the women practicing it — remains ADA's founding premise. As Founder Emeritus, she advises on community and cultural fidelity as ADA grows beyond its founding roots.",
  },
  {
    name: 'Seth Meng',
    role: 'President',
    location: 'Buffalo, NY',
    initials: 'SM',
    avatarBg: 'bg-ada-sky',
    avatarText: 'text-[#1f6f8f]',
    bio: "Seth Meng was elected ADA's inaugural Board President at the 2026 board meeting, where he serves as the executive lead for technology, governance, and standards. His background is as an analyst and researcher in elder-care outcomes at the University of Rochester Medical Center, applying statistics and machine learning to questions of long-term care quality and family-caregiver impact. That orientation toward measurement, instrumentation, and protective system design now shapes ADA's certification platform, multilingual exam architecture, and public verification registry. Seth came to ADA out of a long-standing commitment to building public-benefit institutions.",
  },
];

// Serving directors — 2 independent + 2 industry — shown in a 2×2 grid.
const directors: Person[] = [
  {
    name: 'Wesley Lau',
    role: 'Independent Director',
    location: 'Los Angeles, CA',
    initials: 'WL',
    avatarBg: 'bg-ada-peach',
    avatarText: 'text-[#b85a2a]',
    bio: "Wesley Lau is a serial entrepreneur and venture capital investor whose career has crossed several industries — from technology and finance to community-focused initiatives. Outside his professional work, he has been a steady presence in community and public-benefit organizations, drawn to neighborhood cleanups and the unglamorous volunteer work others overlook. He brings that same orientation to ADA's board — that good organizations are built by people who do the small, repeatable work as carefully as the strategic decisions.",
  },
  {
    name: 'Minyu Zhang',
    role: 'Independent Director',
    location: 'Los Angeles, CA',
    initials: 'MZ',
    avatarBg: 'bg-ada-pink-light',
    avatarText: 'text-[#b3006b]',
    bio: "Minyu Zhang spent her earlier career in finance before turning much of her time and energy toward public-benefit work. She volunteers across a range of community and nonprofit initiatives, with a particular commitment to animal welfare and rescue. On ADA's board, she pairs financial discipline with steady engagement in mission-driven organizations — reading budgets carefully and showing up for the work because she cares about the people behind it.",
  },
  {
    name: 'Veronica Tseng',
    role: 'Director',
    location: 'Irvine, CA',
    initials: 'VT',
    avatarBg: 'bg-ada-violet-light',
    avatarText: 'text-[#662d91]',
    bio: "Veronica Tseng works in postpartum doula service operations across the Bay Area, Southern California, Seattle, New York City, and Chicago, where she focuses on doula coordination and family-facing program delivery. She brings that ground-level view to ADA's board — informing conversations on member needs, program quality, and how certification standards translate into daily practice for the doulas and families ADA serves.",
  },
  {
    name: 'Mia Liu',
    role: 'Director',
    location: 'Irvine, CA',
    initials: 'ML',
    avatarBg: 'bg-ada-rose',
    avatarText: 'text-[#b03a6e]',
    bio: "Mia Liu leads operations for a doula services organization, overseeing doula workforce coordination, regional service delivery, and the day-to-day work of running culturally integrated postpartum care at scale. She brings to ADA's board the practical realities of the field — the regional service markets, the doulas who carry the work, and the families they serve — and helps the board calibrate certification standards against operational reality.",
  },
];

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 mb-10 md:mb-12">
      <p className="font-outfit text-[11px] font-semibold tracking-[0.26em] uppercase text-ada-purple">
        {children}
      </p>
      <span className="flex-1 h-px bg-ada-navy/10" aria-hidden="true" />
    </div>
  );
}

function Monogram({ person, size }: { person: Person; size: 'lg' | 'md' }) {
  const dim =
    size === 'lg'
      ? 'w-[72px] h-[72px] text-[27px]'
      : 'w-[60px] h-[60px] text-[23px]';
  return (
    <div
      className={`${dim} ${person.avatarBg} ${person.avatarText} flex-none rounded-full grid place-items-center font-dm-serif leading-none`}
      aria-hidden="true"
    >
      {person.initials}
    </div>
  );
}

function RoleRow({ person }: { person: Person }) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="font-outfit text-[11px] font-semibold tracking-[0.16em] uppercase text-ada-purple-muted bg-ada-violet-light px-2.5 py-1 rounded-full">
        {person.role}
      </span>
      <span className="text-[13px] text-ada-navy/50">{person.location}</span>
    </div>
  );
}

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

      {/* Hero — centered, friendly */}
      <section className="bg-ada-cream pt-32 pb-12 md:pt-40 md:pb-16 text-center">
        <div className="max-w-[760px] mx-auto px-6">
          <span className="inline-block font-outfit text-xs font-semibold tracking-[0.08em] text-ada-purple-muted bg-ada-violet-light px-4 py-1.5 rounded-full">
            Asian Doula Alliance &middot; 2026
          </span>
          <h1 className="mt-6 font-dm-serif text-[42px] sm:text-5xl md:text-6xl lg:text-7xl text-ada-navy leading-[1.05] tracking-[-0.01em]">
            Meet our board
          </h1>
          <p className="mt-6 mx-auto max-w-[60ch] text-ada-navy/75 text-[17px] md:text-[19px] leading-[1.7]">
            Six volunteer directors set ADA&rsquo;s certification standards,
            steward a 501(c)(3) nonprofit, and protect the women practicing
            this work &mdash; serving without compensation.
          </p>
        </div>
      </section>

      {/* Leadership — Founder Emeritus + President */}
      <section className="bg-ada-cream pt-8 md:pt-10 pb-5">
        <div className="max-w-[1120px] mx-auto px-6">
          <SectionHeader>Leadership</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((p) => (
              <article
                key={p.name}
                className="bg-white border border-ada-navy/[0.07] rounded-[22px] p-7 md:p-10 shadow-[0_1px_2px_rgba(12,34,49,0.04)] transition-all duration-[400ms] ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(12,34,49,0.22)] flex flex-col gap-4"
              >
                <Monogram person={p} size="lg" />
                <h2 className="font-dm-serif text-[28px] md:text-[30px] leading-[1.1] text-ada-navy">
                  {p.name}
                </h2>
                <RoleRow person={p} />
                <p className="text-[15px] text-ada-navy/[0.74] leading-[1.7] max-w-[60ch]">
                  {p.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Directors — 2 independent + 2 industry */}
      <section className="bg-ada-cream pt-8 md:pt-10 pb-12 md:pb-14">
        <div className="max-w-[1120px] mx-auto px-6">
          <SectionHeader>Directors</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directors.map((p) => (
              <article
                key={p.name}
                className="bg-white border border-ada-navy/[0.07] rounded-[20px] p-7 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-6 items-start shadow-[0_1px_2px_rgba(12,34,49,0.04)] transition-all duration-[400ms] ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(12,34,49,0.2)]"
              >
                <Monogram person={p} size="md" />
                <div>
                  <h2 className="font-dm-serif text-[23px] leading-[1.12] text-ada-navy">
                    {p.name}
                  </h2>
                  <div className="mt-2">
                    <RoleRow person={p} />
                  </div>
                  <p className="mt-4 text-[14.5px] text-ada-navy/[0.72] leading-[1.7]">
                    {p.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Governance — composition + standing facts */}
      <section className="bg-ada-sage py-14 md:py-20 border-t border-ada-navy/[0.06]">
        <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div>
            <h2 className="font-dm-serif text-[28px] md:text-[40px] leading-[1.12] text-ada-navy">
              Real governance, openly disclosed
            </h2>
            <p className="mt-4 text-[16px] text-ada-navy/[0.72] max-w-[46ch] leading-[1.7]">
              ADA&rsquo;s board is built so that no single organization can
              capture it. Independent voices hold the Alliance to its own
              standards.
            </p>
            <div className="flex gap-6 mt-10 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <div className="font-dm-serif text-[38px] text-ada-purple-muted leading-none">
                  2
                </div>
                <div className="text-[13px] text-ada-navy/[0.62] mt-1.5 leading-[1.5]">
                  Independent directors
                  <br />
                  Wesley Lau &middot; Minyu Zhang
                </div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="font-dm-serif text-[38px] text-ada-purple-muted leading-none">
                  2
                </div>
                <div className="text-[13px] text-ada-navy/[0.62] mt-1.5 leading-[1.5]">
                  Industry directors
                  <br />
                  Mia Liu &middot; Veronica Tseng
                </div>
              </div>
              <div className="flex-1 min-w-[120px]">
                <div className="font-dm-serif text-[38px] text-ada-purple-muted leading-none">
                  1
                </div>
                <div className="text-[13px] text-ada-navy/[0.62] mt-1.5 leading-[1.5]">
                  Founder-chair
                  <br />
                  Seth Meng
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/70 rounded-2xl px-7 py-6 md:px-10">
              <div className="font-outfit text-[11px] font-semibold tracking-[0.2em] uppercase text-ada-purple-muted">
                Compensation
              </div>
              <div className="text-[14.5px] text-ada-navy/[0.78] mt-1.5 leading-[1.6]">
                All directors serve as volunteers and receive no compensation
                from ADA.
              </div>
            </div>
            <div className="bg-white/70 rounded-2xl px-7 py-6 md:px-10">
              <div className="font-outfit text-[11px] font-semibold tracking-[0.2em] uppercase text-ada-purple-muted">
                Conflicts of interest
              </div>
              <div className="text-[14.5px] text-ada-navy/[0.78] mt-1.5 leading-[1.6]">
                Each director signs an annual COI disclosure; any director with a
                material interest abstains. Related-party transactions require
                the affirmative vote of the independent directors.
              </div>
            </div>
            <div className="bg-white/70 rounded-2xl px-7 py-6 md:px-10">
              <div className="font-outfit text-[11px] font-semibold tracking-[0.2em] uppercase text-ada-purple-muted">
                Accountability
              </div>
              <div className="text-[14.5px] text-ada-navy/[0.78] mt-1.5 leading-[1.6]">
                Annual Form 990 and audited financials are published each year.
                See{' '}
                <Link
                  href="/about-us/financials"
                  className="text-ada-purple underline underline-offset-4 hover:text-ada-purple-hover"
                >
                  Financials &amp; Accountability
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open call */}
      <section className="bg-ada-cream py-14 md:py-16 text-center">
        <div className="max-w-[640px] mx-auto px-6">
          <p className="font-dm-serif italic text-ada-navy/75 text-lg md:text-2xl leading-relaxed">
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
