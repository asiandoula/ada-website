import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/public/hero';
import { Counter } from '@/components/public/counter';
import { TestimonialCarousel } from '@/components/public/testimonial-carousel';
import { ContactForm } from '@/components/public/contact-form';
import { CommunityMap } from '@/components/public/california-map';
import { ShapeHeart, ShapeFlower } from '@/components/public/decorative-shapes';
import { GraduationCap, Trophy, Users, Globe, Soup, Heart } from 'lucide-react';

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
      'Joining ADA has truly opened my eyes to the world of running a successful doula business. I\'m deeply grateful for ADA\'s guidance, comprehensive business training, and especially the insurance and legal protection offered. This support gives me confidence and peace of mind, allowing me to focus on delivering the best possible care to my clients.',
    name: 'Linda T.',
    role: 'Certified Doula, Bay Area',
  },
  {
    quote:
      'After the devastating nanny abuse case in the Bay Area, many doulas, including myself, were heartbroken and feared the erosion of trust in our profession. ADA stepped in decisively, openly addressing the issue and providing a transparent, regulated certification process. ADA\'s advocacy gives mothers a reliable platform to verify doulas and grants doulas the credibility and trust we need.',
    name: 'Sarah W.',
    role: 'Certified Doula, San Francisco',
  },
  {
    quote:
      'The ADA training is unlike anything else out there. It\'s rich in tradition, backed by science, and full of heart. I felt seen, supported, and inspired to build a career that makes a difference in other women\'s lives.',
    name: 'Hana K.',
    role: 'Doula Trainee, Los Angeles',
  },
  {
    quote:
      'As a doula who doesn\'t speak English, I used to feel isolated from the global doula community. Thanks to ADA\'s dedicated translation of materials from DONA and ICEA, I now have access to the latest doula practices and insights. ADA empowers me to blend modern knowledge with cultural traditions, enabling me to become the best version of myself professionally.',
    name: 'Mary D.',
    role: 'Certified Doula, Irvine',
  },
  {
    quote:
      'The certification exam was thorough but fair — both the written and practical portions truly tested my readiness to serve families. Having the exam available in Mandarin made all the difference for me.',
    name: 'Wendy L.',
    role: 'Certified Doula, San Diego',
  },
  {
    quote:
      'ADA connected me with families who share my cultural background. The matching process ensured I could provide care that honors their traditions while following evidence-based practices. My clients always feel understood.',
    name: 'Jasmine C.',
    role: 'Certified Doula, Seattle',
  },
  {
    quote:
      'The scholarship program made my doula certification possible. As a first-generation caregiver, I couldn\'t have afforded the training otherwise. Now I\'m giving back to my community every day.',
    name: 'Rosa M.',
    role: 'Scholarship Recipient & Certified Doula',
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

      {/* Section 1: Who We Are — Framer-style image grid + inline stats */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[454px_1fr] gap-12 items-center">
            {/* Left — image grid: overlapping on desktop, stacked on mobile */}
            {/* Desktop: 3-image overlapping grid with floating shapes */}
            <div className="hidden lg:block relative w-full h-[430px]">
              <svg className="absolute -top-[25px] left-[27px] w-[100px] h-[50px] rotate-[121deg] animate-float" viewBox="0 0 100 50" fill="none">
                <path d="M50 0C22.4 0 0 22.4 0 50h100C100 22.4 77.6 0 50 0Z" fill="#606090" />
              </svg>
              <svg className="absolute -bottom-[10px] -right-[17px] w-[100px] h-[100px] rotate-[121deg] animate-float-delayed" viewBox="0 0 100 100" fill="none">
                <path d="M50 8C52 25 60 38 75 42C60 46 52 58 50 75C48 58 40 46 25 42C40 38 48 25 50 8Z" fill="#606090" rx="4" />
              </svg>
              <Image
                src="/images/about-grid-1.png"
                alt="ADA doula training session"
                width={560}
                height={180}
                className="absolute top-[49px] left-0 w-[56%] h-[180px] object-cover rounded-3xl"
              />
              <Image
                src="/images/about-grid-2.png"
                alt="ADA certified doula with family"
                width={400}
                height={268}
                className="absolute top-0 right-0 w-[40%] aspect-[0.623] object-cover rounded-3xl"
              />
              <Image
                src="/images/about-grid-3.png"
                alt="Postpartum care in action"
                width={400}
                height={181}
                className="absolute bottom-0 left-[81px] w-[40%] h-[181px] object-cover rounded-3xl"
              />
            </div>
            {/* Mobile: simple single image */}
            <div className="lg:hidden">
              <Image
                src="/images/about-grid-1.png"
                alt="ADA doula training session"
                width={600}
                height={400}
                className="w-full rounded-3xl object-cover"
              />
            </div>

            {/* Right — text + inline stats */}
            <div>
              <div className="max-w-[93%]">
                <h2 className="font-dm-serif text-4xl text-ada-navy">
                  Leading in Professional Asian Postpartum Doula Care Since 2017!
                </h2>
                <p className="mt-6 text-base text-ada-navy/60 leading-relaxed">
                  Empowering families with specialized and reliable Asian Style Postpartum
                  Care, we are the only U.S. doula organization offering multilingual support
                  and certified training by uniquely blend traditional Asian confinement
                  practices with modern, professional postpartum and newborn care.
                </p>
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 mt-6 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
                >
                  About Us
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* Inline stats — matching Framer */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-6">
                <div>
                  <Counter target={109} suffix="" label="Doulas Trained" numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
                </div>
                <div>
                  <Counter target={50} suffix="+" label="Workshops & Seminars" numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
                </div>
                <div>
                  <Counter target={2} suffix="M+" label="Scholarships Secured" numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How to Get Certified — 4-step alternating, matching Framer */}
      <section className="py-20 bg-ada-off-white relative overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              How to Get Certified?
            </h2>
            <p className="mt-2 text-xl text-ada-navy/40 font-light">
              Guiding you through every step with care, clarity, and cultural understanding.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { num: '1', emoji: '🔍', title: 'Enrollment', description: 'Visit our Enrollment Page to provide your name, email, and a brief description of your experience and interests. After submitting your application, an ADA specialist will contact you to discuss the program details and guide you through the next steps.', color: '#00aeef', cardSide: 'right' as const },
              { num: '2', emoji: '📚', title: 'Training Program', description: 'Engage in training that integrates traditional Asian postpartum practices with modern, evidence-based care. Choose from in-person workshops or online modules to suit your schedule and learning preferences.', color: '#f15a29', cardSide: 'left' as const },
              { num: '3', emoji: '📝', title: 'Certification Exam', description: "The certification exam includes both a written assessment and a practical evaluation to test your knowledge and skills. Utilize ADA's study guides and practice materials to prepare effectively for the exam.", color: '#8dc63f', cardSide: 'right' as const },
              { num: '4', emoji: '🎓', title: 'Certification and Beyond', description: "Upon passing the exam, you will be awarded the ADA Postpartum Doula Certification. Benefit from ADA's continuous education opportunities, professional resources, and a supportive community to help you thrive in your doula career.", color: '#662d91', cardSide: 'left' as const },
            ].map((step, i) => {
              const card = (
                <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-dm-serif text-2xl text-ada-navy">
                    {step.emoji} {step.title}
                  </h3>
                  <p className="mt-2 text-base text-ada-navy/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
              const shapesArea = (
                <div className="h-[200px] relative hidden lg:block">
                  <svg className="absolute top-[39px] left-[60px] w-[80px] h-[80px] -rotate-[61deg] animate-float opacity-70" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" fill={step.color} opacity="0.15" />
                  </svg>
                  <svg className="absolute bottom-[34px] right-[71px] w-[70px] h-[70px] rotate-[32deg] animate-float-delayed opacity-70" viewBox="0 0 100 50" fill="none">
                    <path d="M50 0C22.4 0 0 22.4 0 50h100C100 22.4 77.6 0 50 0Z" fill={step.color} opacity="0.15" />
                  </svg>
                </div>
              );
              const progressLine = (
                <div className="hidden lg:flex flex-col items-center shrink-0 w-[10%]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-outfit font-bold text-sm shrink-0"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>
                  {i < 3 && (
                    <div className="w-[4px] flex-1 min-h-[180px] mt-1 rounded-full" style={{ borderLeft: '4px dashed #ebedee' }} />
                  )}
                </div>
              );

              return (
                <div key={step.num}>
                  {/* Desktop: 3-column alternating */}
                  <div className="hidden lg:flex items-stretch">
                    <div className="w-[45%]">{step.cardSide === 'right' ? shapesArea : card}</div>
                    {progressLine}
                    <div className="w-[45%]">{step.cardSide === 'right' ? card : shapesArea}</div>
                  </div>
                  {/* Mobile: simple stack */}
                  <div className="lg:hidden flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-outfit font-bold text-sm shrink-0"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-dm-serif text-lg text-ada-navy">
                        {step.emoji} {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-ada-navy/50 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/certifications/postpartum-doula/steps"
              className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
            >
              Start Your Journey <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Our Values — matching Framer exactly */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              Our Values
            </h2>
            <p className="mt-2 text-xl text-ada-navy/50 font-light">
              Compassion, professionalism, dedication, and cultural understanding define our care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { image: '/images/value-cultural.avif', title: 'Trust', description: 'Providing honest and empathetic care to every family, fostering a foundation of respect and reliability.' },
              { image: '/images/value-commitment.avif', title: 'Excellence', description: 'Committed to the highest standards through comprehensive training and culturally attuned support.' },
              { image: '/images/value-excellence.avif', title: 'Commitment', description: "Supporting mothers' recovery and newborn care with unwavering dedication at every stage." },
              { image: '/images/value-trust.avif', title: 'Cultural Integration', description: 'Harmonizing traditional Asian practices with modern care to serve families globally.' },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col lg:h-[395px] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-4 flex-1">
                  <h3 className="font-dm-serif text-xl text-ada-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-ada-navy/50 text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>
                <div className="h-[180px] lg:h-[242px] shrink-0">
                  <Image
                    src={value.image}
                    alt={value.title}
                    width={300}
                    height={242}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Our Work — 6 service cards */}
      <section className="py-20 bg-ada-off-white relative overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              Our Work
            </h2>
            <p className="mt-2 text-xl text-ada-navy/50 font-light">
              Elevating postpartum care with culturally rooted and evidence-based programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] p-[10px]" style={{ gridTemplateColumns: 'repeat(3, minmax(50px, 1fr))' }}>
            {[
              {
                icon: <GraduationCap className="w-5 h-5 text-[#662d91]" />,
                iconBg: 'bg-[#f3ebf9]',
                title: 'Doula Certification',
                description: 'We provide structured training and certification with a strong emphasis on Asian cultural practices, science-based knowledge, and hands-on support.',
                link: '/certifications/postpartum-doula/steps',
                linkText: 'Program Details',
              },
              {
                icon: <Trophy className="w-5 h-5 text-[#f15a29]" />,
                iconBg: 'bg-[#fdede7]',
                title: 'Scholarship Program',
                description: 'We offer need-based and merit-based scholarships to make doula training accessible for passionate caregivers in Asian communities.',
                link: '/programs/scholarship',
                linkText: 'Apply Now',
              },
              {
                icon: <Users className="w-5 h-5 text-[#00aeef]" />,
                iconBg: 'bg-[#e6f7fe]',
                title: 'Family Matching',
                description: 'We carefully match families with trained doulas who understand both your cultural background and modern recovery needs.',
                link: '/for-families/find-a-doula',
                linkText: 'Matching Process',
              },
              {
                icon: <Globe className="w-5 h-5 text-[#ec008c]" />,
                iconBg: 'bg-[#ffe5f5]',
                title: 'Multilingual Training',
                description: 'We offer education and care services in Mandarin, Cantonese, Korean, Japanese, and more — because care starts with clear understanding.',
                link: '/certifications/postpartum-doula/training',
                linkText: 'Language Options',
              },
              {
                icon: <Soup className="w-5 h-5 text-[#8dc63f]" />,
                iconBg: 'bg-[#fffee5]',
                title: 'Cultural Postpartum Care',
                description: 'From confinement meals to herbal remedies and body recovery practices, we guide doulas and families in integrating trusted Asian traditions.',
                link: '/about-us/mission-value',
                linkText: 'Learn More',
              },
              {
                icon: <Heart className="w-5 h-5 text-[#8dc63f]" />,
                iconBg: 'bg-[#f3f9eb]',
                title: 'Community & Advocacy',
                description: 'We champion postpartum care rights, organize workshops, and empower Asian doulas and families to be seen, heard, and supported.',
                link: '/articles',
                linkText: 'Join the Movement',
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.link}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col lg:h-[314px]"
              >
                <div className="flex flex-col justify-between h-full p-4 overflow-hidden">
                  <div>
                    <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center`}>
                      {service.icon}
                    </div>
                    <h3 className="mt-8 font-dm-serif text-2xl text-ada-navy">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm text-ada-navy/50 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-ada-navy font-outfit font-medium text-sm">
                    {service.linkText} <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Our Partners */}
      <section className="py-20 bg-ada-peach relative overflow-hidden">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              Our Partners
            </h2>
            <p className="mt-2 text-xl text-ada-navy/50 font-light">
              Trusted collaborations with leading organizations in maternal care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'ICEA',
                logo: '/images/partners/icea.png',
                description: 'A globally respected organization offering evidence-based training for childbirth educators and doulas. ADA collaborates with ICEA to promote excellence in maternal and infant health worldwide.',
              },
              {
                name: 'DONA International',
                logo: '/images/partners/dona.jpg',
                description: 'As one of the largest and most established doula organizations, DONA International partners with ADA to ensure high standards of training, certification, and professional support for doulas.',
              },
              {
                name: 'The Educated Birth',
                logo: '/images/partners/teb.png',
                description: 'ADA proudly partners with The Educated Birth to promote birthwork that is informed, equitable, and rooted in justice. Together, we support doulas of all backgrounds with inclusive tools and resources.',
              },
              {
                name: 'Cooings Doula Care',
                logo: '/images/partners/cooings.svg',
                description: 'A partner in innovation, Cooings provides professional postpartum services while pioneering modern doula training for Asian caregivers through digital tools and data-driven solutions.',
              },
              {
                name: 'IBLCE',
                logo: '/images/partners/iblce.png',
                description: 'ADA aligns with IBLCE in promoting breastfeeding education and certification. We support doulas who wish to expand their knowledge in lactation support and pursue IBCLC credentials.',
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 overflow-hidden bg-[#fafafa]">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={48}
                      height={48}
                      className="object-contain w-11 h-11"
                    />
                  ) : (
                    <span className="text-ada-purple text-[10px] font-outfit font-bold tracking-wide">
                      {(partner as { abbr?: string }).abbr}
                    </span>
                  )}
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
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 w-full">
          <div className="max-w-xl">
            <h2 className="font-dm-serif text-4xl text-white">
              Begin Your Doula Journey
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
                href="/certifications/postpartum-doula/training"
                className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
              >
                Find a Training <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/certifications/postpartum-doula/steps"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/30 px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Community — left progress bars + right west coast map */}
      <section className="py-20 bg-ada-sky relative overflow-hidden">
        <ShapeHeart className="absolute top-8 right-16 w-16 h-16 rotate-[20deg]" color="#ec008c" />
        <ShapeFlower className="absolute bottom-16 left-12 w-20 h-20 -rotate-[25deg]" color="#00aeef" />
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left — text + progress bars */}
            <div>
              <h2 className="font-dm-serif text-4xl text-ada-navy">
                Where Our Doulas Serve
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

            {/* Right — west coast map (desktop only, content already visible via progress bars) */}
            <div className="hidden lg:block" aria-hidden="true">
              <CommunityMap />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — dark bg with texture */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #606090, #4a4a70)' }}>
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-white">
              Testimonials
            </h2>
            <p className="mt-2 text-xl text-white/60 font-light">
              Real voices. True impact.
            </p>
          </div>
          <div className="max-w-[60%] mx-auto max-lg:max-w-full">
            <TestimonialCarousel testimonials={testimonials} darkMode />
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
