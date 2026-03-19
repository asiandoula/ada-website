import { Metadata } from 'next';
import { Hero } from '@/components/public/hero';
import { Counter } from '@/components/public/counter';
import { TestimonialCarousel } from '@/components/public/testimonial-carousel';
import { ContactForm } from '@/components/public/contact-form';
import { ScrollAnimate } from '@/components/public/scroll-animate';
import { Star, BookOpen, GraduationCap, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Asian Doula Alliance — Bridging Cultures, Supporting Moms, Celebrating Life',
  description:
    'Setting standards in postpartum care through culturally integrated training, certification, and multilingual support for Asian doulas.',
  openGraph: {
    title: 'Asian Doula Alliance — Bridging Cultures, Supporting Moms, Celebrating Life',
    description:
      'Setting standards in postpartum care through culturally integrated training, certification, and multilingual support for Asian doulas.',
    url: 'https://asiandoula.org',
    images: [{ url: '/images/hero.jpg', width: 1200, height: 630 }],
  },
};

const testimonials = [
  {
    quote:
      'The ADA certification program gave me the confidence and cultural knowledge I needed to serve families in my community. The training was thorough, compassionate, and deeply relevant.',
    name: 'Sarah Chen',
    role: 'Certified Postpartum Doula',
  },
  {
    quote:
      'Having a culturally competent doula who understood our traditions made all the difference during our postpartum journey. We felt truly supported and understood.',
    name: 'Yuki Tanaka',
    role: 'New Mother, Los Angeles',
  },
  {
    quote:
      'ADA\'s multilingual exam options meant I could demonstrate my knowledge in the language I\'m most comfortable with. This organization truly values diversity.',
    name: 'Minji Park',
    role: 'Certified Doula & Lactation Consultant',
  },
  {
    quote:
      'The certification process was rigorous but fair. I now feel equipped to provide evidence-based care while honoring the cultural practices that families hold dear.',
    name: 'Priya Sharma',
    role: 'Certified Postpartum Doula',
  },
];

const values = [
  { label: 'Compassion', icon: Star },
  { label: 'Integrity', icon: Star },
  { label: 'Excellence', icon: Star },
  { label: 'Knowledge', icon: Star },
];

const certSteps = [
  {
    title: 'Enroll',
    description: 'Sign up for our culturally integrated postpartum doula training program.',
    icon: BookOpen,
  },
  {
    title: 'Train',
    description: 'Complete hands-on training covering evidence-based care and cultural practices.',
    icon: GraduationCap,
  },
  {
    title: 'Certify',
    description: 'Pass the ADA certification exam and join our network of certified doulas.',
    icon: Award,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Asian Doula Alliance',
  url: 'https://asiandoula.org',
  logo: 'https://asiandoula.org/ada-logo.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-714-202-6501',
    email: 'contact@asiandoula.org',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero — full viewport */}
      <Hero />

      {/* Mission / Who We Are */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimate>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy">
                Who We Are
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                The Asian Doula Alliance is a 501(c)(3) non-profit organization dedicated to
                elevating postpartum care standards through culturally integrated training and
                certification. We bridge Eastern wisdom with Western evidence-based practices to
                support families during one of life&apos;s most transformative moments.
              </p>
            </div>
          </ScrollAnimate>

          {/* Value badges */}
          <ScrollAnimate delay={200}>
            <div className="mt-14 flex flex-wrap justify-center gap-4 md:gap-6">
              {values.map((v) => (
                <div
                  key={v.label}
                  className="flex items-center gap-2 rounded-full bg-ada-purple/10 px-6 py-3"
                >
                  <v.icon className="w-5 h-5 text-ada-purple" />
                  <span className="font-medium text-ada-navy">{v.label}</span>
                </div>
              ))}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollAnimate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <Counter target={164} label="Certified Doulas" />
              <Counter target={5} label="Languages Supported" />
              <Counter target={6} label="Insurance Partners" />
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Certification Path */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimate>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy text-center">
              Path to Certification
            </h2>
          </ScrollAnimate>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {certSteps.map((step, i) => (
              <ScrollAnimate key={step.title} delay={i * 150}>
                <Link
                  href="/become-a-doula/steps-to-certification"
                  className="block group rounded-2xl border border-gray-200 p-8 text-center transition-shadow hover:shadow-lg"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-ada-purple/10 flex items-center justify-center group-hover:bg-ada-purple/20 transition-colors">
                    <step.icon className="w-8 h-8 text-ada-purple" />
                  </div>
                  <h3 className="mt-6 font-poppins text-xl font-bold text-ada-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-ada-navy/60 leading-relaxed">
                    {step.description}
                  </p>
                </Link>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimate>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy text-center mb-14">
              What Our Community Says
            </h2>
          </ScrollAnimate>
          <ScrollAnimate delay={200}>
            <TestimonialCarousel testimonials={testimonials} />
          </ScrollAnimate>
        </div>
      </section>

      {/* Contact */}
      <ScrollAnimate>
        <ContactForm />
      </ScrollAnimate>
    </>
  );
}
