import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/public/hero';
import { Counter } from '@/components/public/counter';
import { TestimonialCarousel } from '@/components/public/testimonial-carousel';
import { ContactForm } from '@/components/public/contact-form';
import { ShapeHeart, ShapeFlower } from '@/components/public/decorative-shapes';
import { HomepageArticles } from '@/components/public/homepage-articles';
import { GraduationCap, Trophy, Users, Globe, Soup, Heart } from 'lucide-react';
import { organizationJsonLd } from '@/lib/json-ld';

const CommunityMap = dynamic(
  () => import('@/components/public/california-map').then((m) => m.CommunityMap),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Asian Doula Alliance — Bridging Cultures, Supporting Moms, Celebrating Life',
  description:
    'Setting standards in postpartum care through culturally integrated training, certification, and multilingual support for Asian doulas.',
  openGraph: {
    title: 'Asian Doula Alliance — Bridging Cultures, Supporting Moms, Celebrating Life',
    description:
      'Setting standards in postpartum care through culturally integrated training, certification, and multilingual support for Asian doulas.',
    url: 'https://asiandoula.org',
    images: [{ url: '/images/hero.webp', width: 1200, height: 630 }],
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

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />

      {/* Hero — full viewport */}
      <Hero />

      {/* Section 1: Who We Are — Framer-style image grid + inline stats */}
      <section className="py-20 bg-white relative">
        <div className="relative max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[454px_1fr] gap-12 items-center">
            {/* Left — Real photo with color block accents */}
            <div className="hidden lg:block relative w-full">
              {/* Decorative shapes — peeking out behind photo */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-[20px] bg-ada-lavender rotate-12 animate-float" />
              <div className="absolute -top-4 right-8 w-16 h-16 rounded-full bg-ada-purple/20 animate-float-delayed" />
              <div className="absolute top-[45%] -right-6 w-20 h-20 rounded-[18px] bg-ada-peach rotate-[-8deg] animate-float" />
              <div className="absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-ada-sage animate-float-delayed" />
              <div className="absolute -bottom-4 left-[20%] w-16 h-16 rounded-[16px] bg-ada-purple/10 rotate-[15deg] animate-float" />
              <div className="absolute top-[20%] -left-5 w-14 h-14 rounded-full bg-ada-rose animate-float-delayed" />

              {/* Single photo — natural aspect ratio, warm filter */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/gallery/training-practice-1.jpg"
                  alt="ADA doula trainees practicing with newborn care dolls during certification training"
                  width={800}
                  height={530}
                  sizes="454px"
                  className="w-full object-cover brightness-105 contrast-[1.03] saturate-[1.15] sepia-[0.08]"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden relative">
              <div className="absolute -top-3 -left-3 w-16 h-16 rounded-2xl bg-ada-lavender -z-10" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-ada-sage -z-10" />
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/gallery/training-practice-1.jpg"
                  alt="ADA doula trainees practicing with newborn care dolls"
                  width={800}
                  height={530}
                  sizes="100vw"
                  className="w-full object-cover brightness-105 saturate-[1.15] sepia-[0.08]"
                />
              </div>
            </div>

            {/* Right — text + inline stats */}
            <div>
              <div className="max-w-[93%]">
                <h2 className="font-dm-serif text-4xl text-ada-navy">
                  {t('whoWeAreTitle')}
                </h2>
                <p className="mt-6 text-base text-ada-navy/60 leading-relaxed">
                  {t('whoWeAreText')}
                </p>
                <Link
                  href="/about-us"
                  className="inline-flex items-center gap-2 mt-6 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
                >
                  {t('aboutUsButton')}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* Inline stats — matching Framer */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-6">
                <div>
                  <Counter target={167} suffix="" label={t('doulasTrained')} numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
                </div>
                <div>
                  <Counter target={50} suffix="+" label={t('workshopsSeminars')} numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
                </div>
                <div>
                  <Counter target={2} suffix="M+" label={t('scholarshipsSecured')} numberClassName="text-ada-purple-muted" labelClassName="text-ada-navy/60" />
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
              {t('howToGetCertifiedTitle')}
            </h2>
            <p className="mt-2 text-xl text-ada-navy/40 font-light">
              {t('howToGetCertifiedSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { num: '1', emoji: '🔍', title: t('step1Title'), description: t('step1Desc'), color: '#00aeef', cardSide: 'right' as const },
              { num: '2', emoji: '📚', title: t('step2Title'), description: t('step2Desc'), color: '#f15a29', cardSide: 'left' as const },
              { num: '3', emoji: '📝', title: t('step3Title'), description: t('step3Desc'), color: '#8dc63f', cardSide: 'right' as const },
              { num: '4', emoji: '🎓', title: t('step4Title'), description: t('step4Desc'), color: '#662d91', cardSide: 'left' as const },
            ].map((step, i) => {
              const card = (
                <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300">
                  <h3 className="font-dm-serif text-2xl text-ada-navy">
                    {step.emoji} {step.title}
                  </h3>
                  <p className="mt-2 text-base text-ada-navy/60 leading-relaxed">
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
                      <p className="mt-2 text-sm text-ada-navy/60 leading-relaxed">
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
              {t('startYourJourney')} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Our Values — matching Framer exactly */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              {t('ourValuesTitle')}
            </h2>
            <p className="mt-2 text-xl text-ada-navy/60 font-light">
              {t('ourValuesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { image: '/images/value-cultural.avif', title: t('valueTrust'), description: t('valueTrustDesc') },
              { image: '/images/value-commitment.avif', title: t('valueExcellence'), description: t('valueExcellenceDesc') },
              { image: '/images/value-excellence.avif', title: t('valueCommitment'), description: t('valueCommitmentDesc') },
              { image: '/images/value-trust.avif', title: t('valueCultural'), description: t('valueCulturalDesc') },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col lg:h-[395px] hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              >
                <div className="p-4 flex-1">
                  <h3 className="font-dm-serif text-xl text-ada-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-ada-navy/60 text-base leading-relaxed">
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
              {t('ourWorkTitle')}
            </h2>
            <p className="mt-2 text-xl text-ada-navy/60 font-light">
              {t('ourWorkSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] p-[10px]">
            {[
              {
                icon: <GraduationCap className="w-5 h-5 text-ada-violet" />,
                iconBg: 'bg-ada-violet-light',
                title: t('doulaCertification'),
                description: t('doulaCertificationDesc'),
                link: '/certifications/postpartum-doula/steps',
                linkText: t('programDetails'),
              },
              {
                icon: <Trophy className="w-5 h-5 text-ada-orange" />,
                iconBg: 'bg-ada-orange-light',
                title: t('scholarshipProgram'),
                description: t('scholarshipProgramDesc'),
                link: '/programs/scholarship',
                linkText: t('applyNow'),
              },
              {
                icon: <Users className="w-5 h-5 text-ada-blue" />,
                iconBg: 'bg-ada-blue-light',
                title: t('familyMatching'),
                description: t('familyMatchingDesc'),
                link: '/for-families/find-a-doula',
                linkText: t('matchingProcess'),
              },
              {
                icon: <Globe className="w-5 h-5 text-ada-pink" />,
                iconBg: 'bg-ada-pink-light',
                title: t('multilingualTraining'),
                description: t('multilingualTrainingDesc'),
                link: '/certifications/postpartum-doula/training',
                linkText: t('languageOptions'),
              },
              {
                icon: <Soup className="w-5 h-5 text-ada-green" />,
                iconBg: 'bg-ada-yellow-light',
                title: t('culturalPostpartumCare'),
                description: t('culturalPostpartumCareDesc'),
                link: '/about-us/mission-value',
                linkText: t('learnMore'),
              },
              {
                icon: <Heart className="w-5 h-5 text-ada-green" />,
                iconBg: 'bg-ada-green-light',
                title: t('communityAdvocacy'),
                description: t('communityAdvocacyDesc'),
                link: '/articles',
                linkText: t('joinTheMovement'),
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.link}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col lg:h-[314px]"
              >
                <div className="flex flex-col justify-between h-full p-4 overflow-hidden">
                  <div>
                    <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center`}>
                      {service.icon}
                    </div>
                    <h3 className="mt-8 font-dm-serif text-2xl text-ada-navy">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm text-ada-navy/60 leading-relaxed">
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
              {t('ourPartnersTitle')}
            </h2>
            <p className="mt-2 text-xl text-ada-navy/60 font-light">
              {t('ourPartnersSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'ICEA',
                logo: '/images/partners/icea.png',
                description: t('iceaDesc'),
              },
              {
                name: 'DONA International',
                logo: '/images/partners/dona.webp',
                description: t('donaDesc'),
              },
              {
                name: 'The Educated Birth',
                logo: '/images/partners/teb.png',
                description: t('tebDesc'),
              },
              {
                name: 'Cooings Doula Care',
                logo: '/images/partners/cooings.svg',
                description: t('cooingsDesc'),
              },
              {
                name: 'IBLCE',
                logo: '/images/partners/iblce.webp',
                description: t('iblceDesc'),
              },
            ].map((partner) => (
              <div
                key={partner.name}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 overflow-hidden bg-ada-off-white">
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
                <p className="mt-2 text-ada-navy/60 text-sm leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credential Verification CTA — for institutions & families */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="bg-ada-navy/[0.03] border border-ada-navy/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-ada-purple mb-2">
                {t('verifyCtaLabel')}
              </p>
              <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                {t('verifyCtaTitle')}
              </h2>
              <p className="mt-3 text-ada-navy/60 font-outfit leading-relaxed max-w-xl">
                {t('verifyCtaDesc')}
              </p>
            </div>
            <Link
              href="/verify"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-ada-purple px-6 py-3 text-white font-outfit font-medium text-sm hover:bg-ada-purple-hover transition-colors"
            >
              {t('verifyCredentials')} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-dm-serif text-4xl text-ada-navy">
              {t('latestArticlesTitle')}
            </h2>
            <p className="mt-2 text-xl text-ada-navy/60 font-light">
              {t('latestArticlesSubtitle')}
            </p>
          </div>
          <HomepageArticles />
          <div className="text-center mt-10">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ada-purple text-ada-purple px-6 py-3 text-sm font-medium hover:bg-ada-purple hover:text-white transition-colors"
            >
              {t('viewAllArticles')} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Training — full-bleed image + overlay */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden">
        <Image
          src="/images/pict1.webp"
          alt="Doula training session"
          fill
          sizes="100vw"
          className="object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(12,34,49,0.92) 40%, rgba(12,34,49,0.6) 100%)' }} />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 w-full">
          <div className="max-w-xl">
            <h2 className="font-dm-serif text-4xl text-white">
              {t('beginDoulaJourneyTitle')}
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed">
              {t('beginDoulaJourneyDesc')}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <span>{t('irvineAddress')}</span>
              <span>{t('intensiveProgram')}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/certifications/postpartum-doula/training"
                className="inline-flex items-center gap-2 rounded-full bg-ada-purple px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-ada-purple-hover"
              >
                {t('findATraining')} <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/certifications/postpartum-doula/steps"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white/30 px-4 py-2.5 text-white font-medium text-sm transition-colors hover:bg-white/10"
              >
                {t('learnMore')}
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
                {t('whereDoulasServeTitle')}
              </h2>
              <p className="mt-4 text-ada-navy/60 leading-relaxed">
                {t('whereDoulasServeDesc')}
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
                {t('alsoServingCities')}
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
              {t('testimonialsTitle')}
            </h2>
            <p className="mt-2 text-xl text-white/60 font-light">
              {t('testimonialsSubtitle')}
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
