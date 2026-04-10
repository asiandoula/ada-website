import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Board of Directors',
  description:
    'Meet the volunteer Board of Directors who guide the Asian Doula Alliance\'s mission and strategic direction.',
};

const boardPositions = [
  {
    number: '01',
    title: 'President',
    description:
      'Leads the Board of Directors and represents ADA in external affairs. The President sets the strategic agenda, chairs quarterly board meetings, and serves as the organization\'s primary spokesperson. Works closely with all board members to ensure ADA\'s programs align with its mission of advancing culturally integrated postpartum care.',
    responsibilities: [
      'Chairs board meetings and annual member assembly',
      'Represents ADA to partners, media, and government agencies',
      'Oversees strategic planning and organizational direction',
    ],
  },
  {
    number: '02',
    title: 'Vice President',
    description:
      'Supports the President and assumes presidential duties when needed. The Vice President oversees committee operations, coordinates cross-functional initiatives, and ensures smooth governance transitions during board elections. Plays a key role in member engagement and community partnerships.',
    responsibilities: [
      "Acts as President in the President's absence",
      'Manages board committees and task forces',
      'Coordinates community outreach and partnership initiatives',
    ],
  },
  {
    number: '03',
    title: 'Director of Education',
    description:
      "Oversees all aspects of ADA's certification curriculum, training standards, and examination system. The Director of Education ensures that ADA's programs remain rigorous, culturally relevant, and aligned with current evidence-based practices. Manages the development of multilingual exam content and continuing education requirements.",
    responsibilities: [
      'Designs and updates certification curriculum',
      'Manages exam development in five languages',
      'Sets continuing education and recertification standards',
    ],
  },
  {
    number: '04',
    title: 'Treasurer',
    description:
      "Manages ADA's financial health, including budgeting, financial reporting, and compliance with 501(c)(3) requirements. The Treasurer oversees grant applications, scholarship fund allocation, and ensures transparent use of organizational resources. Presents financial reports to the board and membership.",
    responsibilities: [
      'Prepares annual budget and financial statements',
      'Manages scholarship and grant funds',
      'Ensures compliance with IRS and state reporting requirements',
    ],
  },
  {
    number: '05',
    title: 'Secretary',
    description:
      'Maintains official records of all board proceedings, manages organizational communications, and ensures regulatory compliance. The Secretary coordinates member notifications, maintains the certified doula registry, and handles correspondence with government agencies and partner organizations.',
    responsibilities: [
      'Records and distributes board meeting minutes',
      'Maintains certified doula registry and member records',
      'Manages regulatory filings and organizational documents',
    ],
  },
];

const sidebarLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Mission & Values', href: '/about-us/mission-value' },
  { label: 'History', href: '/about-us/history' },
  { label: 'Steps to Certification', href: '/certifications/postpartum-doula/steps' },
];

export default function BoardOfDirectorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'About Us', path: '/about-us' },
              { name: 'Board', path: '/about-us/board' },
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
            Board of Directors
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            The volunteers who guide ADA&apos;s mission and hold us accountable.
          </p>
        </div>
      </section>

      {/* Election Banner */}
      <section className="bg-ada-cream pb-8">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-ada-purple shrink-0 mt-1.5" />
                <div>
                  <p className="font-outfit font-semibold text-ada-navy">
                    2026 Board Election
                  </p>
                  <p className="text-ada-navy/60 text-sm mt-0.5">
                    Nominations are now open for the 2026&ndash;2028 term.
                  </p>
                </div>
              </div>
              <Link
                href="/about-us/board/election"
                className="inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors shrink-0"
              >
                Learn More &amp; Nominate &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main */}
            <div className="lg:w-4/5 order-2 lg:order-1">
              {/* Intro */}
              <h2 className="font-dm-serif text-3xl text-ada-navy">Our Board</h2>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                ADA is governed by a volunteer Board of Directors responsible for setting
                strategic direction, ensuring financial accountability, and upholding the
                organization&apos;s mission. Board members serve two-year terms and are elected
                by ADA&apos;s certified doula community.
              </p>

              {/* Board Positions */}
              <div className="mt-12 space-y-10">
                {boardPositions.map((position) => (
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
                      <ul className="mt-4 space-y-1.5">
                        {position.responsibilities.map((resp) => (
                          <li
                            key={resp}
                            className="text-sm text-ada-navy/60 flex items-start gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-ada-purple/40 mt-2 shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Note */}
              <p className="text-sm text-ada-navy/40 italic mt-12">
                Board members serve on a volunteer basis and receive no compensation.
                ADA&apos;s Form 990 is available upon request.
              </p>
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
