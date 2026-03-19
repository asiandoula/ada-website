import { ScrollAnimate } from '@/components/public/scroll-animate';
import { Heart, Shield, Star, BookOpen } from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    title: 'Compassion',
    description:
      'We lead with empathy and warmth, understanding that every family\'s postpartum journey is unique. Our doulas provide nurturing support that honors each mother\'s emotional, physical, and cultural needs.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description:
      'We uphold the highest ethical standards in certification, training, and care delivery. Transparency, honesty, and accountability guide every decision we make as an organization.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Star,
    title: 'Excellence',
    description:
      'We pursue the highest quality in everything we do — from our rigorous certification exams to our comprehensive training curriculum. Our doulas represent the gold standard in postpartum care.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: BookOpen,
    title: 'Knowledge',
    description:
      'We are committed to continuous learning, bridging traditional wisdom with modern evidence-based practices. Our training empowers doulas with both cultural competency and clinical expertise.',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

export default function MissionValuePage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-ada-navy via-ada-navy/95 to-ada-navy" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <ScrollAnimate animation="fade-up">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Mission &amp; Values
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              The principles that guide our work and the vision that drives us forward.
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimate>
            <div className="text-center">
              <span className="inline-block font-poppins text-sm font-bold tracking-widest text-ada-purple uppercase">
                Our Mission
              </span>
              <h2 className="mt-4 font-poppins text-3xl md:text-4xl font-bold text-ada-navy leading-tight">
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
          </ScrollAnimate>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollAnimate>
            <div className="text-center">
              <span className="inline-block font-poppins text-sm font-bold tracking-widest text-ada-purple uppercase">
                Our Vision
              </span>
              <h2 className="mt-4 font-poppins text-3xl md:text-4xl font-bold text-ada-navy leading-tight">
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
          </ScrollAnimate>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimate>
            <div className="text-center mb-14">
              <span className="inline-block font-poppins text-sm font-bold tracking-widest text-ada-purple uppercase">
                Our Core Values
              </span>
              <h2 className="mt-4 font-poppins text-3xl md:text-4xl font-bold text-ada-navy">
                What We Stand For
              </h2>
            </div>
          </ScrollAnimate>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, i) => (
              <ScrollAnimate key={value.title} delay={i * 100}>
                <div className="rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow h-full">
                  <div
                    className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center`}
                  >
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="mt-5 font-poppins text-xl font-bold text-ada-navy">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-ada-navy/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-ada-navy">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimate>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white">
              Join Our Mission
            </h2>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              Whether you are a doula seeking certification or a family looking for
              culturally competent care, we welcome you to the Asian Doula Alliance community.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/become-a-doula/steps-to-certification"
                className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-semibold rounded-lg hover:bg-ada-purple-accent transition-colors"
              >
                Get Certified
              </a>
              <a
                href="/about-us"
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Learn More About Us
              </a>
            </div>
          </ScrollAnimate>
        </div>
      </section>
    </>
  );
}
