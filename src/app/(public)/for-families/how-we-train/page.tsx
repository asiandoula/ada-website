import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How We Train Our Doulas | Asian Doula Alliance',
  description:
    'A rigorous program that blends traditional Asian postpartum wisdom with modern evidence-based care. Learn about ADA doula training standards.',
  openGraph: {
    title: 'How We Train Our Doulas | Asian Doula Alliance',
    description:
      'A rigorous program that blends traditional Asian postpartum wisdom with modern evidence-based care. Learn about ADA doula training standards.',
  },
};

const differences = [
  {
    number: '01',
    title: 'Cultural Integration',
    description:
      'Traditional Asian postpartum practices — from zuo yuezi to herbal nutrition — are woven into every module, not treated as an afterthought.',
  },
  {
    number: '02',
    title: 'Multilingual Delivery',
    description:
      "Training is conducted in your doula's native language, ensuring full comprehension and confident application of every skill.",
  },
  {
    number: '03',
    title: 'Practical Assessment',
    description:
      'Certification requires a hands-on, one-on-one evaluation — not just a written test — so every certified doula has demonstrated real-world competence.',
  },
  {
    number: '04',
    title: 'Insurance Recognition',
    description:
      'ADA certification is accepted by major insurance providers including Medi-Cal, Kaiser, Cigna, Carrot Fertility, and Blue Shield.',
  },
];

export default function HowWeTrainPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            How We Train Our Doulas
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            A rigorous program that blends traditional Asian postpartum wisdom
            with modern evidence-based care.
          </p>
        </div>
      </section>

      {/* Training Overview */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Comprehensive training for comprehensive care
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                Our 4-to-5 day intensive training program covers everything a
                postpartum doula needs to provide exceptional, culturally
                informed care. Conducted in Irvine, California, the program is
                available in English, Chinese, Japanese, and Korean — ensuring
                every trainee can learn in the language they are most comfortable
                with.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                Topics span newborn care fundamentals, postpartum recovery
                support, breastfeeding and lactation basics, traditional Asian
                postpartum practices, family communication, and nutrition
                guidance. Each module integrates cultural context with
                evidence-based techniques so doulas graduate ready to serve
                diverse families with confidence.
              </p>
            </div>
            <div className="lg:col-span-2 bg-ada-lavender rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy mb-6">
                Training at a Glance
              </h3>
              <dl className="space-y-5">
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Duration
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    4&ndash;5 day intensive
                  </dd>
                </div>
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Location
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    Irvine, California
                  </dd>
                </div>
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Languages
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    English, Chinese, Japanese, Korean
                  </dd>
                </div>
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Topics
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    Newborn care, postpartum recovery, breastfeeding, cultural
                    practices
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Our Training Different */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center">
            What Makes Our Training Different
          </h2>
          <div className="mt-14 max-w-3xl mx-auto space-y-12">
            {differences.map((item) => (
              <div key={item.number}>
                <span className="font-dm-serif text-3xl text-ada-purple/40">
                  {item.number}
                </span>
                <h3 className="mt-2 font-dm-serif text-xl text-ada-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-ada-navy/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Standards */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Certification Standards
          </h2>
          <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
            After completing the training program, candidates must pass a
            two-part certification examination to earn their ADA credential.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Written Exam
              </p>
              <p className="mt-2 font-dm-serif text-2xl text-ada-navy">
                60 minutes
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Practical Evaluation
              </p>
              <p className="mt-2 font-dm-serif text-2xl text-ada-navy">
                30 minutes, one-on-one
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Certification Valid For
              </p>
              <p className="mt-2 font-dm-serif text-2xl text-ada-navy">
                3 years
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Renewal
              </p>
              <p className="mt-2 font-dm-serif text-2xl text-ada-navy">
                Continuing education
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ada-navy py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            Find your certified doula
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/for-families/find-a-doula"
              className="inline-flex items-center px-8 py-4 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Find a Doula
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Verify Credentials
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
