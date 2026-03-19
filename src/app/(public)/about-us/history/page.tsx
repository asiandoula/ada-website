import { Metadata } from 'next';
import { Timeline } from '@/components/public/timeline';

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

export default function HistoryPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Our History
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            From a small initiative in Irvine to a nationally recognized certification
            body — tracing the journey of the Asian Doula Alliance.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Timeline items={milestones} />
        </div>
      </section>
    </>
  );
}
