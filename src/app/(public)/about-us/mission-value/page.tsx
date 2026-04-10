import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Mission & Values',
  description:
    'Setting the standard for culturally integrated postpartum care — the mission, vision, and values of the Asian Doula Alliance.',
  openGraph: {
    title: 'Mission & Values | Asian Doula Alliance',
    description:
      'Setting the standard for culturally integrated postpartum care — the mission, vision, and values of the Asian Doula Alliance.',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
  },
};

const commitments = [
  {
    number: '01',
    title: 'Rigorous Screening',
    description:
      'Every doula undergoes thorough background checks, interviews, and skills assessments before certification.',
    image: '/images/gallery/training-practice-2.jpg',
    alt: 'Doula practicing postpartum care techniques on a mannequin',
  },
  {
    number: '02',
    title: 'Continuous Education',
    description:
      'Ongoing professional development ensures doulas stay current with best practices.',
    image: '/images/gallery/training-equipment.jpg',
    alt: 'Instructor demonstrating bottle sterilizer equipment during training',
  },
  {
    number: '03',
    title: 'Ethical Standards',
    description:
      'Clear code of conduct and accountability standards protect families.',
    image: '/images/gallery/training-exam-day.jpg',
    alt: 'Exam day preparation with whiteboard instructions',
  },
  {
    number: '04',
    title: 'Community Trust',
    description:
      'Transparent processes rebuild and maintain trust within Asian communities.',
    image: '/images/gallery/training-graduates.jpg',
    alt: 'Graduation group photo of certified doulas',
  },
];

const sidebarLinks = [
  { label: 'History', href: '/about-us/history' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Steps to Certification', href: '/certifications/postpartum-doula/steps' },
];

export default function MissionValuePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'About Us', path: '/about-us' },
              { name: 'Mission & Values', path: '/about-us/mission-value' },
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
            Mission &amp; Values
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Setting the standard for culturally integrated postpartum care
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 space-y-16">
              {/* Our Why / Mission */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-2 text-ada-purple">
                    <span className="w-5 h-5 rounded bg-ada-purple/10 flex items-center justify-center text-xs">
                      &#9670;
                    </span>
                    <span className="font-outfit font-medium text-sm uppercase tracking-wider">
                      Our Why
                    </span>
                  </div>
                  <h3 className="mt-4 font-dm-serif text-3xl text-ada-navy">Mission</h3>
                  <p className="mt-4 text-ada-navy/70 leading-relaxed">
                    Empowering Asian families, we are the only U.S. doula organization
                    blending traditional practices with modern care, offering multilingual
                    support and certified training for a culturally rich postpartum
                    experience.
                  </p>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/gallery/training-practice-1.jpg"
                    alt="ADA training group holding baby dolls during hands-on practice session"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Blockquote */}
              <blockquote className="border-l-[5px] border-ada-purple bg-ada-off-white p-6 pl-8 rounded-r-lg">
                <p className="text-ada-navy/70 leading-relaxed">
                  ADA was founded to respond to urgent community needs by introducing
                  structured training, stringent certification, and a robust ethical
                  framework. Through these efforts, we rebuild and fortify trust, ensuring
                  every family receives reliable, safe, and culturally respectful postpartum
                  support.
                </p>
              </blockquote>

              {/* Quote Card 1 */}
              <div className="bg-ada-off-white rounded-2xl p-8">
                <p className="italic text-ada-navy/70 leading-relaxed">
                  &ldquo;Our rigorous certification and ongoing training ensure doulas
                  uphold the highest ethics, responsibility, and care for Asian families. We
                  are committed to restoring trust through strict professional
                  standards.&rdquo;
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-ada-navy/70 text-sm">
                    &mdash; Director of Education, ADA Certification &amp; Training
                  </p>
                </div>
              </div>

              {/* Our Dream / Vision (reversed) */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden md:order-first">
                  <Image
                    src="/images/gallery/training-class-2.jpg"
                    alt="ADA training class with seven women studying Global Health"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-ada-purple">
                    <span className="w-5 h-5 rounded bg-ada-purple/10 flex items-center justify-center text-xs">
                      &#9734;
                    </span>
                    <span className="font-outfit font-medium text-sm uppercase tracking-wider">
                      Our Dream
                    </span>
                  </div>
                  <h3 className="mt-4 font-dm-serif text-3xl text-ada-navy">Vision</h3>
                  <p className="mt-4 text-ada-navy/70 leading-relaxed">
                    Our vision is to be the leading authority in postpartum care, setting the
                    standard for culturally integrated support that honors Asian traditions
                    while embracing modern care practices, ensuring every family receives
                    compassionate, comprehensive, and culturally resonant support.
                  </p>
                </div>
              </div>

              {/* Quote Card 2 */}
              <div className="bg-ada-off-white rounded-2xl p-8">
                <p className="italic text-ada-navy/70 leading-relaxed">
                  &ldquo;We strive to rebuild and sustain community trust through meticulous
                  training, clear ethical guidelines, and strong support networks, ensuring
                  that doulas are held accountable and families receive reliable, safe, and
                  culturally respectful postpartum support.&rdquo;
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-ada-navy/70 text-sm">
                    &mdash; President Elected, Asian Doula Alliance
                  </p>
                </div>
              </div>

              {/* Our Commitment */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy">Our Commitment</h2>
                <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                  The standards we hold ourselves to, every single day.
                </p>
              </div>

              {/* Commitment grid */}
              <div className="grid sm:grid-cols-2 gap-8">
                {commitments.map((item) => (
                  <div
                    key={item.number}
                    className="bg-ada-off-white rounded-2xl overflow-hidden"
                  >
                    <div className="relative aspect-[3/2]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <span className="font-outfit font-semibold text-ada-purple">
                        {item.number}
                      </span>
                      <h3 className="mt-1 font-outfit font-semibold text-ada-navy">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  Related Topics
                </span>
                <nav className="mt-4 flex flex-col">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
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
