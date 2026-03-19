import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/public/hero';
import { Counter } from '@/components/public/counter';
import { TestimonialCarousel } from '@/components/public/testimonial-carousel';
import { ContactForm } from '@/components/public/contact-form';

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

const certSteps = [
  { title: 'Enroll', description: 'Sign up for our culturally integrated postpartum doula training program.' },
  { title: 'Train', description: 'Complete hands-on training covering evidence-based care and cultural practices.' },
  { title: 'Certify', description: 'Pass the ADA certification exam and join our network of certified doulas.' },
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

      {/* Section 1: Who We Are — asymmetric two-column */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-20 items-center">
            <div>
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Who We Are
              </span>
              <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Bridging cultures, elevating postpartum care
              </h2>
              <p className="mt-6 text-lg text-ada-navy/60 leading-relaxed">
                The Asian Doula Alliance is a 501(c)(3) non-profit organization dedicated to
                elevating postpartum care standards through culturally integrated training and
                certification. We bridge Eastern wisdom with Western evidence-based practices to
                support families during one of life&apos;s most transformative moments.
              </p>
              <p className="mt-4 text-lg text-ada-navy/60 leading-relaxed">
                Our certified doulas speak multiple languages and honor the diverse traditions
                that families bring to their postpartum journey, ensuring every new parent feels
                seen, supported, and empowered.
              </p>
            </div>
            <div>
              <Image
                src="/images/pict1.png"
                alt="Asian Doula Alliance community"
                width={600}
                height={400}
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Stats Band — full-width purple gradient */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #606090, #6969c1)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Counter target={164} label="Certified Doulas" numberClassName="text-white" labelClassName="text-white/60" />
            <Counter target={5} label="Languages Supported" numberClassName="text-white" labelClassName="text-white/60" />
            <Counter target={6} label="Insurance Partners" numberClassName="text-white" labelClassName="text-white/60" />
          </div>
        </div>
      </section>

      {/* Section 3: Path to Certification — asymmetric two-column (reversed) */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-16 lg:gap-20 items-start">
            <div className="flex flex-col gap-4">
              {certSteps.map((step, i) => (
                <div key={step.title} className="bg-ada-lavender rounded-xl p-5">
                  <span className="font-outfit text-xl font-semibold text-ada-purple">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-outfit font-semibold text-ada-navy text-sm">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-ada-navy/50 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Certification
              </span>
              <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Three steps to your certification
              </h2>
              <p className="mt-6 text-lg text-ada-navy/60 leading-relaxed">
                Our certification program combines rigorous evidence-based training with deep
                cultural competency. Whether you&apos;re starting your doula journey or adding a
                specialty certification, we provide the pathway to professional excellence.
              </p>
              <Link
                href="/become-a-doula/steps-to-certification"
                className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-6 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover mt-6"
              >
                Learn More <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials — centered quote */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center mb-14">
            What Our Community Says
          </h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Section 5: Contact */}
      <ContactForm />
    </>
  );
}
