import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';

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

const cards = [
  {
    title: 'How We Train Our Doulas',
    description:
      'Learn about ADA\u2019s rigorous training and certification process \u2014 so you know exactly what our doulas bring to your home.',
    href: '/for-families/how-we-train',
    linkText: 'Learn More',
  },
  {
    title: 'Find a Doula',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
    href: '/for-families/find-a-doula',
    linkText: 'Find a Doula',
  },
  {
    title: 'Verify a Doula',
    description:
      'Check if your doula holds a current ADA certification using their name or certification number.',
    href: '/verify',
    linkText: 'Verify Now',
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

export default function ForFamiliesPage() {
  return (
    <>
      {/* Hero — text left + image right */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                For Families
              </span>
              <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
                Your Recovery Matters
              </h1>
              <p className="mt-6 text-lg md:text-xl text-ada-navy/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Where modern postpartum care meets thousand-year Asian traditions
                &mdash; because no new parent should recover alone.
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
                The Fourth Trimester
              </h2>
              <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
                <p>
                  You come home from the hospital. The car seat feels impossibly
                  heavy. Your body aches in ways no one warned you about. The baby
                  is crying, and you realize that all the preparation in the
                  world &mdash; the nursery, the registry, the birth plan &mdash;
                  didn&apos;t prepare you for this moment: the quiet overwhelm of
                  being home, being responsible, being utterly exhausted.
                </p>
                <p>
                  Your partner does their best. Your mother calls. Friends text
                  congratulations. But between the midnight feedings and the
                  uncertainty, you wonder: is this just how it is? Is this
                  something I&apos;m supposed to figure out alone?
                </p>
                <p className="text-ada-navy font-medium text-xl">
                  In Asian cultures, the answer has always been no.
                </p>
                <p>
                  For thousands of years, Asian families have recognized that the
                  weeks after birth are not just about the baby &mdash; they are
                  about the mother. A dedicated period of rest, nourishment, and
                  supported recovery. This is the tradition that ADA
                  brings into your home.
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
              A Tradition Older Than Modern Medicine
            </h2>
            <p className="mt-4 text-lg text-ada-navy/70 max-w-2xl mx-auto leading-relaxed">
              Across Asia, postpartum recovery isn&apos;t a suggestion &mdash;
              it&apos;s a practice woven into the fabric of family life.
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
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                &ldquo;Sitting the month&rdquo; &mdash; over 2,000 years old.
                For 30 days, the mother rests completely, eats warming foods,
                avoids cold. It is not pampering. It is medicine, passed down
                through generations.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-3">
                Korean
              </p>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Sanhujori (산후조리)
              </h3>
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                Korea built dedicated postpartum recovery centers where mothers
                spend 2&ndash;4 weeks with professional support. The practice is
                so valued that government subsidies make it accessible to all.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple mb-3">
                Japanese
              </p>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Satogaeri (里帰り)
              </h3>
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                New mothers return to their own mother&apos;s home for the first
                month. Recovery requires a village &mdash; and in Japan, that
                village starts with family.
              </p>
            </div>
          </div>

          {/* PPD stats callout */}
          <div className="mt-14 bg-ada-navy rounded-2xl p-10 md:p-14 text-center">
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              In the United States, <span className="font-semibold text-white">1 in 7 mothers</span> experience
              postpartum depression. Studies show that continuous doula support
              significantly reduces this risk. The science is confirming what Asian
              families have known for millennia: dedicated postpartum care
              isn&apos;t a luxury &mdash; <span className="font-semibold text-white">it is a necessity.</span>
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
                What a Doula Actually Does
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                Forget the vague promises of &ldquo;culturally competent
                care.&rdquo; Here is what an ADA-certified doula brings into your
                home, day by day.
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
              { title: 'Recovery Meals', text: 'Red date ginger tea, pork trotter vinegar soup, Korean seaweed soup. Every meal is intentional — not just nutrition, but medicine rooted in generations of knowledge.' },
              { title: 'Newborn Care', text: 'Proper swaddling, gentle bathing, umbilical cord care, sleep routines. Your doula handles the learning curve so you can rest and bond.' },
              { title: 'Mom\u2019s Physical Recovery', text: 'Belly binding, herbal baths, guidance on movement and rest. Your doula monitors your recovery and knows when something needs medical attention.' },
              { title: 'Emotional Support', text: 'Postpartum depression is real. Your doula recognizes early signs and is the steady presence you need — someone who listens without judgment.' },
              { title: 'Family Bridge', text: 'Helping partners participate meaningfully, navigating generational expectations, making sure everyone in the household feels included in the care.' },
              { title: 'Breastfeeding Support', text: 'Latching guidance, supply troubleshooting, pumping schedules. Hands-on help through the early days, with referrals to lactation specialists when needed.' },
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
                Not Just for Asian Families
              </h2>
              <div className="mt-6 space-y-5 text-lg text-ada-navy/70 leading-relaxed">
                <p>
                  &ldquo;Do I need to be Asian to benefit from an ADA-certified doula?&rdquo;
                </p>
                <p>
                  No. The principles behind dedicated postpartum recovery &mdash;
                  rest, nourishment, emotional support, expert newborn care &mdash;
                  are universal. ADA-certified doulas serve families of all
                  backgrounds, adapting care to your specific needs and household.
                </p>
                <p className="text-ada-navy font-medium">
                  The tradition is the root. The care is for everyone.
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
              Insurance &amp; Coverage
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
              ADA-certified doula services are recognized by major insurance
              providers. FSA/HSA eligible.
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
              How to Check Your Coverage
            </h3>
            <ol className="mt-4 space-y-2 text-ada-navy/70 leading-relaxed list-decimal list-inside">
              <li>Call member services on the back of your insurance card.</li>
              <li>Ask if your plan covers postpartum doula services.</li>
              <li>Mention certification by the Asian Doula Alliance (ADA).</li>
              <li>Ask about pre-authorization requirements or visit limits.</li>
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
