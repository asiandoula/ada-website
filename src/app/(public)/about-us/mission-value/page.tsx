import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mission & Values',
  description:
    'The principles that guide the Asian Doula Alliance — compassion, integrity, excellence, and knowledge in culturally integrated postpartum care.',
  openGraph: {
    title: 'Mission & Values | Asian Doula Alliance',
    description:
      'The principles that guide the Asian Doula Alliance — compassion, integrity, excellence, and knowledge in culturally integrated postpartum care.',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const coreValues = [
  {
    title: 'Compassion',
    description:
      'We lead with empathy and warmth, understanding that every family\'s postpartum journey is unique. Our doulas provide nurturing support that honors each mother\'s emotional, physical, and cultural needs.',
  },
  {
    title: 'Integrity',
    description:
      'We uphold the highest ethical standards in certification, training, and care delivery. Transparency, honesty, and accountability guide every decision we make as an organization.',
  },
  {
    title: 'Excellence',
    description:
      'We pursue the highest quality in everything we do — from our rigorous certification exams to our comprehensive training curriculum. Our doulas represent the gold standard in postpartum care.',
  },
  {
    title: 'Knowledge',
    description:
      'We are committed to continuous learning, bridging traditional wisdom with modern evidence-based practices. Our training empowers doulas with both cultural competency and clinical expertise.',
  },
];

export default function MissionValuePage() {
  return (
    <>
      {/* Hero banner */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            About
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Mission &amp; Values
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            The principles that guide our work and the vision that drives us forward.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-block font-outfit text-sm font-semibold tracking-widest text-ada-purple uppercase">
              Our Mission
            </span>
            <h2 className="mt-4 font-dm-serif text-3xl md:text-4xl text-ada-navy leading-tight">
              Setting the standard in culturally integrated postpartum care
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed max-w-3xl mx-auto">
              The Asian Doula Alliance exists to elevate the quality and accessibility
              of postpartum care by providing rigorous, culturally integrated certification
              for doulas serving Asian communities. We train professionals who can honor
              time-tested traditions while delivering evidence-based support — ensuring every
              family receives care that reflects their values, language, and heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-block font-outfit text-sm font-semibold tracking-widest text-ada-purple uppercase">
              Our Vision
            </span>
            <h2 className="mt-4 font-dm-serif text-3xl md:text-4xl text-ada-navy leading-tight">
              A world where every family receives culturally competent postpartum care
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed max-w-3xl mx-auto">
              We envision a future where culturally integrated postpartum care is not a
              luxury but a standard — where every new mother, regardless of background or
              language, has access to a certified doula who understands her traditions,
              speaks her language, and supports her family through the transformative
              postpartum period with both compassion and expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block font-outfit text-sm font-semibold tracking-widest text-ada-purple uppercase">
              Our Core Values
            </span>
            <h2 className="mt-4 font-dm-serif text-3xl md:text-4xl text-ada-navy">
              What We Stand For
            </h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {coreValues.map((value, i) => (
              <div key={value.title} className="flex gap-4">
                <span className="font-outfit text-xl font-semibold text-ada-purple shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-outfit font-semibold text-ada-navy">{value.title}</h3>
                  <p className="mt-1 text-ada-navy/60 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-ada-navy">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-white">
            Join Our Mission
          </h2>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            Whether you are a doula seeking certification or a family looking for
            culturally competent care, we welcome you to the Asian Doula Alliance community.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/become-a-doula/steps-to-certification"
              className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Get Certified
            </Link>
            <Link
              href="/about-us"
              className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
