import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';
import { PronounceButton } from '@/components/public/pronounce-button';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'For Families | Asian Doula Alliance',
  description:
    'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  openGraph: {
    title: 'For Families | Asian Doula Alliance',
    description:
      'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  },
};

export default async function ForFamiliesPage() {
  const t = await getTranslations('forFamilies');

  const cards = [
    {
      title: t('learnMore'),
      description:
        t('heroDescription'),
      href: '/for-families/how-we-train',
      linkText: t('learnMore'),
    },
    {
      title: t('findADoula'),
      description:
        t('heroDescription'),
      href: '/for-families/find-a-doula',
      linkText: t('findADoula'),
    },
    {
      title: t('verifyNow'),
      description:
        t('heroDescription'),
      href: '/verify',
      linkText: t('verifyNow'),
    },
  ];

  const insurancePartners = [
    'Medi-Cal',
    'Kaiser',
    'Cigna',
    'IEHP',
    'Carrot Fertility',
    'Progyny',
  ];

  return (
    <> 
      {/* Hero — text left + image right */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                {t('notJustForAsianFamiliesTitle')}
              </span>
              <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-ada-navy/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>
            <div className="w-full lg:w-[500px] shrink-0">
              <Image
                src="/images/families/hero-recovery.webp"
                alt="A doula gently holding a newborn while the mother rests peacefully in bed"
                width={1920}
                height={1080}
                sizes="(max-width: 1024px) 100vw, 500px"
                className="rounded-2xl object-cover w-full aspect-[16/10]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Fourth Trimester — image + text side by side */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/families/fourth-trimester.webp"
                alt="A caregiver gently holding a new mother's hands in comfort"
                width={1600}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 440px"
                className="rounded-2xl object-cover w-full aspect-[4/3] lg:sticky lg:top-28"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                {t('fourthTrimesterTitle')}
              </h2>
              <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
                <p>
                  {t('fourthTrimesterText1')}
                </p>
                <p>
                  {t('fourthTrimesterText2')}
                </p>
                <p className="text-ada-navy font-medium text-xl">
                  {t('fourthTrimesterText3')}
                </p>
                <p>
                  {t('fourthTrimesterText4')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Tradition Older Than Modern Medicine */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              {t('traditionTitle')}
            </h2>
            <p className="mt-4 text-lg text-ada-navy/70 max-w-2xl mx-auto leading-relaxed">
              {t('traditionDescription')}
            </p>
          </div>

          {/* Food image — full width, cropped landscape */}
          <Image
            src="/images/families/zuoyuezi-food.webp"
            alt="Traditional Chinese postpartum recovery foods — red date ginger tea, herbal soups, goji berries"
            width={1600}
            height={1200}
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="rounded-2xl object-cover w-full aspect-[21/9] mb-14"
            loading="lazy"
          />

          {/* Three traditions side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-3">
                Chinese
              </p>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Zuo Yuezi (坐月子)
              </h3>
              <PronounceButton text="坐月子" lang="zh-CN" label="zuò yuè zi" />
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                {t('fourthTrimesterText4')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-3">
                Korean
              </p>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Sanhujori (산후조리)
              </h3>
              <PronounceButton text="산후조리" lang="ko-KR" label="san-hu-jo-ri" />
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                {t('fourthTrimesterText4')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-3">
                Japanese
              </p>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Satogaeri (里帰り)
              </h3>
              <PronounceButton text="里帰り" lang="ja-JP" label="sa-to-ga-e-ri" />
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                {t('fourthTrimesterText4')}
              </p>
            </div>
          </div>

          {/* PPD stats callout */}
          <div className="mt-14 bg-ada-navy rounded-2xl p-10 md:p-14 text-center">
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              {t('recoveryStats')}
            </p>
          </div>
        </div>
      </section>

      {/* What a Doula Actually Does */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 mb-14">
            <div className="flex-1">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                {t('doulaTitle')}
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                {t('doulaDescription')}
              </p>
            </div>
            <div className="w-full lg:w-[440px] shrink-0">
              <Image
                src="/images/families/doula-newborn.webp"
                alt="A doula helping a father learn to care for his newborn"
                width={1600}
                height={1200}
                sizes="(max-width: 1024px) 100vw, 440px"
                className="rounded-2xl object-cover w-full aspect-[4/3]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t('recoveryMeals'), text: t('recoveryMealsDescription') },
              { title: t('newbornCare'), text: t('newbornCareDescription') },
              { title: t('momsPhysicalRecovery'), text: t('momsPhysicalRecoveryDescription') },
              { title: t('emotionalSupport'), text: t('emotionalSupportDescription') },
              { title: t('familyBridge'), text: t('familyBridgeDescription') },
              { title: t('breastfeedingSupport'), text: t('breastfeedingSupportDescription') },
            ].map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-2xl p-7">
                <h3 className="font-dm-serif text-lg text-ada-navy">{item.title}</h3>
                <p className="mt-3 text-ada-navy/70 leading-relaxed text-[15px]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Just for Asian Families — image left + text right */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-[480px] shrink-0">
              <Image
                src="/images/families/diverse-mothers.webp"
                alt="Diverse group of mothers with their newborns, laughing and connecting together"
                width={1600}
                height={1201}
                sizes="(max-width: 1024px) 100vw, 480px"
                className="rounded-2xl object-cover w-full aspect-[4/3]"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                {t('notJustForAsianFamiliesTitle')}
              </h2>
              <div className="mt-6 space-y-5 text-lg text-ada-navy/70 leading-relaxed">
                <p>
                  {t('notJustForAsianFamiliesText1')}
                </p>
                <p>
                  {t('notJustForAsianFamiliesText2')}
                </p>
                <p className="text-ada-navy font-medium">
                  {t('notJustForAsianFamiliesText3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Coverage */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[800px]">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              {t('insuranceCoverageTitle')}
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
              {t('insuranceCoverageDescription')}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {insurancePartners.map((partner) => (
              <span
                key={partner}
                className="inline-block bg-ada-off-white rounded-full px-5 py-2.5 text-sm font-outfit font-medium text-ada-navy"
              >
                {partner}
              </span>
            ))}
          </div>

          <div className="mt-10 bg-ada-off-white rounded-2xl p-8 max-w-[800px]">
            <h3 className="font-dm-serif text-lg text-ada-navy">
              {t('coverageInstructionsTitle')}
            </h3>
            <ol className="mt-4 space-y-2 text-ada-navy/70 leading-relaxed list-decimal list-inside">
              <li>{t('coverageInstructionsStep1')}</li>
              <li>{t('coverageInstructionsStep2')}</li>
              <li>{t('coverageInstructionsStep3')}</li>
              <li>{t('coverageInstructionsStep4')}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="block bg-white rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              >
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  {card.title}
                </h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-6 inline-block text-ada-purple font-medium text-sm">
                  {card.linkText} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}
