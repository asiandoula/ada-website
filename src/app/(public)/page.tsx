import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/public/hero';
import { Counter } from '@/components/public/counter';
import { TestimonialCarousel } from '@/components/public/testimonial-carousel';
import { ContactForm } from '@/components/public/contact-form';
import { CommunityMap } from '@/components/public/california-map';

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
      <section className="py-24 md:py-32 bg-ada-cream relative overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-20 items-center">
            <div>
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Who We Are
              </span>
              <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Leading in Professional Asian Postpartum Doula Care Since 2017!
              </h2>
              <p className="mt-6 text-lg text-ada-navy/60 leading-relaxed">
                Empowering families with specialized and reliable Asian Style Postpartum
                Care, we are the only U.S. doula organization offering multilingual support
                and certified training by uniquely blend traditional Asian confinement
                practices with modern, professional postpartum and newborn care.
              </p>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 mt-6 rounded-full bg-ada-purple px-6 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover"
              >
                About Us
                <span aria-hidden="true">&rarr;</span>
              </Link>
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

      {/* Section 2: Stats Band — full-width purple gradient with texture */}
      <section
        className="py-12 md:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #606090, #6969c1)' }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Decorative soft glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8482ff, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8482ff, transparent 70%)' }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <Counter target={8} label="Years of Service" numberClassName="text-white" labelClassName="text-white/60" />
            <Counter target={164} label="Certified Doulas" numberClassName="text-white" labelClassName="text-white/60" />
            <Counter target={5} label="Languages Supported" numberClassName="text-white" labelClassName="text-white/60" />
            <Counter target={6} label="Insurance Partners" numberClassName="text-white" labelClassName="text-white/60" />
          </div>
          <p className="mt-8 text-center text-white/35 text-xs tracking-wide">
            Accepted by Kaiser · Medi-Cal · Cigna · Carrot Fertility · Blue Shield · FSA / HSA
          </p>
        </div>
      </section>

      {/* Section 3: Path to Certification — horizontal timeline */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Decorative soft glow */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
              Certification
            </span>
            <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Your path to certification
            </h2>
            <p className="mt-4 text-lg text-ada-navy/50 max-w-2xl mx-auto">
              A rigorous program blending evidence-based training with deep cultural competency.
            </p>
          </div>

          {/* Horizontal timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-[2px] bg-ada-purple/20" />

            {certSteps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center px-6 relative">
                {/* Circle node */}
                <div className="w-20 h-20 rounded-full bg-ada-lavender flex items-center justify-center mb-6 relative z-10 ring-4 ring-white">
                  <span className="font-outfit text-2xl font-semibold text-ada-purple">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Mobile connecting line */}
                {i < certSteps.length - 1 && (
                  <div className="md:hidden w-[2px] h-8 bg-ada-purple/20 -mt-3 mb-3" />
                )}
                <h3 className="font-outfit font-semibold text-ada-navy text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-ada-navy/50 text-sm leading-relaxed max-w-[260px]">
                  {step.description}
                </p>
                {/* Details */}
                <div className="mt-3 text-xs font-medium text-ada-purple/70">
                  {i === 0 && 'Multiple languages available'}
                  {i === 1 && '4-5 days hands-on training'}
                  {i === 2 && 'Written + Practical exam · 3-year cert'}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/become-a-doula/steps-to-certification"
              className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-8 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover"
            >
              Start Your Journey <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Our Values */}
      <section className="py-24 md:py-32 bg-ada-cream relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
              Our Values
            </span>
            <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
              What drives everything we do
            </h2>
            <p className="mt-4 text-lg text-ada-navy/50 max-w-2xl mx-auto">
              Compassion, professionalism, dedication, and cultural understanding define our care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { image: '/images/value-cultural.avif', title: 'Trust', description: 'Providing honest and empathetic care to every family, fostering a foundation of respect and reliability.' },
              { image: '/images/value-commitment.avif', title: 'Excellence', description: 'Committed to the highest standards through comprehensive training and culturally attuned support.' },
              { image: '/images/value-excellence.avif', title: 'Commitment', description: "Supporting mothers' recovery and newborn care with unwavering dedication at every stage." },
              { image: '/images/value-trust.avif', title: 'Cultural Integration', description: 'Harmonizing traditional Asian practices with modern care to serve families globally.' },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1">
                  <h3 className="font-outfit font-semibold text-ada-navy text-lg">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-ada-navy/50 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
                <div className="h-40">
                  <Image
                    src={value.image}
                    alt={value.title}
                    width={300}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Our Partners */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
              Our Partners
            </span>
            <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Trusted collaborations in maternal care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'ICEA',
                abbr: 'ICEA',
                color: 'bg-[#2a4365]',
                description: 'A globally respected organization offering evidence-based training for childbirth educators and doulas. ADA collaborates with ICEA to promote excellence in maternal and infant health worldwide.',
              },
              {
                name: 'DONA International',
                abbr: 'DONA',
                color: 'bg-[#4a3570]',
                description: 'As one of the largest and most established doula organizations, DONA International partners with ADA to ensure high standards of training, certification, and professional support for doulas.',
              },
              {
                name: 'CAPPA',
                abbr: 'CAPPA',
                color: 'bg-[#2d6a6a]',
                description: 'ADA works alongside CAPPA to align on culturally sensitive training standards and expand global awareness of postpartum recovery rooted in Asian traditions.',
              },
              {
                name: 'The Educated Birth',
                abbr: 'TEB',
                color: 'bg-[#3a7a6a]',
                description: 'ADA proudly partners with The Educated Birth to promote birthwork that is informed, equitable, and rooted in justice. Together, we support doulas of all backgrounds with inclusive tools and resources.',
              },
              {
                name: 'Cooings Doula Care',
                abbr: 'Cooings',
                color: 'bg-[#606090]',
                description: 'A partner in innovation, Cooings provides professional postpartum services while pioneering modern doula training for Asian caregivers through digital tools and data-driven solutions.',
              },
              {
                name: 'IBLCE',
                abbr: 'IBLCE',
                color: 'bg-[#2a5ca8]',
                description: 'ADA aligns with IBLCE in promoting breastfeeding education and certification. We support doulas who wish to expand their knowledge in lactation support and pursue IBCLC credentials.',
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${partner.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-white text-[10px] font-outfit font-bold tracking-wide">
                    {partner.abbr}
                  </span>
                </div>
                <h3 className="font-outfit font-semibold text-ada-navy text-base">
                  {partner.name}
                </h3>
                <p className="mt-2 text-ada-navy/50 text-sm leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles — hidden until Supabase has published articles */}

      {/* Upcoming Training — full-bleed image + overlay */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/pict1.png')" }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(12,34,49,0.92) 40%, rgba(12,34,49,0.6) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="max-w-xl">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
              Training Programs
            </span>
            <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-white">
              Begin your doula journey
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed">
              Our ADA-approved training programs combine traditional Asian postpartum
              practices with modern evidence-based care. Programs available in
              English, Chinese, Japanese, and Korean.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <span>Irvine, CA — 7515 Irvine Center Dr</span>
              <span>4-5 day intensive program</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/become-a-doula/find-a-doula-training"
                className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-6 py-3 text-white font-medium transition-colors hover:bg-ada-purple-hover"
              >
                Find a Training <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/become-a-doula/steps-to-certification"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/30 px-6 py-3 text-white font-medium transition-colors hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Community — left progress bars + right west coast map */}
      <section className="py-24 md:py-32 bg-ada-cream relative overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left — text + progress bars */}
            <div>
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Our Community
              </span>
              <h2 className="mt-3 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Where our doulas serve
              </h2>
              <p className="mt-4 text-ada-navy/50 leading-relaxed">
                164+ certified doulas supporting families across California and nationwide.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { city: 'Los Angeles', count: '60+', bar: 'w-full' },
                  { city: 'Bay Area', count: '40+', bar: 'w-[70%]' },
                  { city: 'San Diego', count: '30+', bar: 'w-[52%]' },
                  { city: 'Seattle', count: '15+', bar: 'w-[26%]' },
                  { city: 'New York', count: '10+', bar: 'w-[18%]' },
                ].map((loc) => (
                  <div key={loc.city}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-outfit font-medium text-ada-navy">{loc.city}</span>
                      <span className="font-outfit text-ada-purple font-semibold">{loc.count}</span>
                    </div>
                    <div className="h-2 bg-ada-lavender rounded-full overflow-hidden">
                      <div className={`h-full bg-ada-purple/60 rounded-full ${loc.bar}`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-ada-navy/30">
                Also serving families in Chicago, Houston, and other cities nationwide
              </p>
            </div>

            {/* Right — west coast map */}
            <div className="hidden lg:block">
              <CommunityMap />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — centered quote */}
      <section className="py-24 md:py-32 bg-ada-cream relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #606090 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #606090, transparent 70%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center mb-14">
            What Our Community Says
          </h2>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
