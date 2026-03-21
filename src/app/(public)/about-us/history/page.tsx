import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Timeline } from '@/components/public/timeline';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Our History',
  description:
    'From a small initiative in Irvine to a nationally recognized certification body — tracing the journey of the Asian Doula Alliance.',
  openGraph: {
    title: 'Our History | Asian Doula Alliance',
    description:
      'From a small initiative in Irvine to a nationally recognized certification body — tracing the journey of the Asian Doula Alliance.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const milestones = [
  {
    year: '2021',
    title: 'The Seed Is Planted',
    description:
      'A group of experienced doulas and maternal health advocates in Southern California identify the need for culturally integrated postpartum doula certification.',
  },
  {
    year: '2022',
    title: 'Asian Doula Alliance Founded',
    description:
      'ADA is officially established as a 501(c)(3) non-profit organization in Irvine, California, with a mission to set standards in culturally competent postpartum care.',
  },
  {
    year: '2022',
    title: 'First Certification Program',
    description:
      'The inaugural Postpartum Doula Certification program launches, combining Eastern postpartum traditions with Western evidence-based practices in a rigorous curriculum.',
  },
  {
    year: '2023',
    title: 'Multilingual Exams Introduced',
    description:
      'Certification exams become available in Mandarin, Cantonese, Japanese, and Korean — ensuring language is never a barrier to professional certification.',
  },
  {
    year: '2023',
    title: 'Insurance Partnerships Begin',
    description:
      'ADA secures partnerships with major insurance providers including Medi-Cal and Kaiser, making certified doula services more accessible to families.',
  },
  {
    year: '2024',
    title: '100+ Certified Doulas',
    description:
      'ADA reaches a major milestone with over 100 certified postpartum doulas serving families across California and beyond.',
  },
  {
    year: '2025',
    title: 'National Expansion',
    description:
      'Certified ADA doulas now serve families in Los Angeles, the Bay Area, Seattle, New York City, and Chicago. Insurance partnerships expand to include Cigna, Carrot Fertility, and Progyny.',
  },
  {
    year: '2026',
    title: 'Continuing to Grow',
    description:
      'With 164+ certified doulas, 6 insurance partners, and exams in 5 languages, ADA continues to set the gold standard for culturally integrated postpartum doula certification.',
  },
];

const sidebarLinks = [
  { label: 'Mission & Values', href: '/about-us/mission-value' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Steps to Certification', href: '/certifications/postpartum-doula/steps' },
];


export default function HistoryPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Our History
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            From a WeChat group to the only Asian doula certification body in the U.S.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 order-2 lg:order-1">
              {/* Heading section */}
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                History of ADA
              </h2>
              <p className="mt-4 text-lg text-ada-navy/60 leading-relaxed">
                From a WeChat group to the only Asian doula certification body in the U.S.
              </p>

              {/* Story */}
              <p className="mt-8 text-ada-navy/80 leading-relaxed">
                In 2017, a handful of Asian doulas in Southern California started a
                group chat. They shared the same frustration: organizations like ICEA
                and DONA offered excellent training — but almost nothing in Chinese,
                Japanese, or Korean. Doulas who didn&apos;t speak English were shut out of
                professional development entirely.
              </p>
              <p className="mt-4 text-ada-navy/80 leading-relaxed">
                So they began translating materials, pooling knowledge, and teaching
                each other. Within a year, what started as peer support had become
                something bigger — a shared conviction that Asian families deserved
                doulas trained in both evidence-based care and the cultural traditions
                they grew up with.
              </p>

              {/* Blockquote — founder voice, one punch */}
              <blockquote className="mt-8 border-l-[5px] border-ada-purple bg-[#fafafa] p-6 pl-8 rounded-r-lg">
                <p className="text-ada-navy/80 leading-relaxed italic">
                  &ldquo;It started as a chat group. It became a mission.&rdquo;
                </p>
              </blockquote>

              <p className="mt-8 text-ada-navy/80 leading-relaxed">
                In 2022, that mission became official. ADA was incorporated as a
                501(c)(3) non-profit in Irvine, California — the first and only U.S.
                organization offering culturally integrated postpartum doula
                certification with exams in five languages.
              </p>

              {/* Photo Gallery — magazine grid */}
              <div className="mt-12 space-y-3">
                {/* Hero photo — full width */}
                <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/training-workshop.webp"
                    alt="ADA Postpartum Doula Training Workshop — group photo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 960px"
                  />
                </div>

                {/* Row 2 — 2 columns: left stacked, right large */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="md:col-span-2 space-y-3">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src="/images/gallery/training-class-1.jpg"
                        alt="Doula trainees celebrating after a breastfeeding class"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 380px"
                      />
                    </div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <Image
                        src="/images/gallery/training-study.jpg"
                        alt="Trainees reviewing course materials during workshop"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 380px"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-auto">
                    <Image
                      src="/images/gallery/training-practice-1.jpg"
                      alt="Nine doula trainees practicing newborn care with baby dolls"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 580px"
                    />
                  </div>
                </div>

                {/* Row 3 — 3 equal columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src="/images/gallery/training-equipment.jpg"
                      alt="Trainer demonstrating bottle sterilizer equipment"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 310px"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src="/images/gallery/training-exam-day.jpg"
                      alt="Doula trainees on certification exam day"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 310px"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src="/images/gallery/training-graduates.jpg"
                      alt="ADA certified doulas group photo after graduation"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 310px"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-center text-ada-navy/40 italic">
                Scenes from ADA training workshops in Irvine, California
              </p>

              {/* Milestones heading */}
              <h2 className="mt-16 font-dm-serif text-3xl text-ada-navy">
                Milestones
              </h2>
              <p className="mt-4 text-lg text-ada-navy/60 leading-relaxed">
                From 0 to 164+ certified doulas in five years.
              </p>

              {/* Timeline */}
              <div className="mt-10">
                <Timeline items={milestones} />
              </div>

              {/* CTA section */}
              <div className="mt-16 text-center bg-[#fafafa] rounded-2xl p-10">
                <h3 className="font-dm-serif text-2xl text-ada-navy">
                  Become Part of Our Story
                </h3>
                <p className="mt-3 text-ada-navy/60">
                  Join 164+ certified doulas making a difference in families&apos; lives.
                </p>
                <Link
                  href="/certifications/postpartum-doula/steps"
                  className="inline-flex mt-6 rounded-full bg-ada-purple text-white px-5 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  Start Your Certification Journey
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5 order-1 lg:order-2">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-sm font-semibold text-ada-navy/40 uppercase tracking-wider">
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

      {/* Contact section */}
      <ContactForm />
    </>
  );
}
