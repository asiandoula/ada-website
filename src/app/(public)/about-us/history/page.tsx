import { ScrollAnimate } from '@/components/public/scroll-animate';
import { Timeline } from '@/components/public/timeline';

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
      <section className="relative bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-ada-navy via-ada-navy/95 to-ada-navy" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <ScrollAnimate animation="fade-up">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Our History
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              From a small initiative in Irvine to a nationally recognized certification
              body — tracing the journey of the Asian Doula Alliance.
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Timeline items={milestones} />
        </div>
      </section>
    </>
  );
}
