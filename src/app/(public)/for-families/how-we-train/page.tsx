import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'What Your Doula Knows | Asian Doula Alliance',
  description:
    'Every ADA-certified doula completes rigorous training that blends evidence-based care with cultural wisdom — before she ever enters your home.',
  openGraph: {
    title: 'What Your Doula Knows | Asian Doula Alliance',
    description:
      'Every ADA-certified doula completes rigorous training that blends evidence-based care with cultural wisdom — before she ever enters your home.',
  },
};

const modules = [
  {
    number: '01',
    title: 'Postpartum Recovery',
    learned:
      'Body recovery stages, wound care assessment, vital sign monitoring, and Traditional Chinese Medicine recovery principles including warming protocols and blood circulation support.',
    benefit:
      'She knows exactly what your body needs at every stage of recovery — and can spot warning signs before they become problems.',
  },
  {
    number: '02',
    title: 'Newborn Care',
    learned:
      'Safe feeding techniques (bottle and breast), proper bathing and umbilical care, evidence-based sleep safety, soothing methods, and developmental milestone tracking.',
    benefit:
      'You can rest at 3am knowing your baby is in the hands of someone trained to handle anything that comes up.',
  },
  {
    number: '03',
    title: 'Breastfeeding Support',
    learned:
      'Proper latch assessment, positioning techniques, common troubleshooting (engorgement, low supply, nipple pain), pumping guidance, and when to escalate to a lactation consultant.',
    benefit:
      'When breastfeeding feels impossible at 2am, she has the expertise to help you through it — or the judgment to bring in additional support.',
  },
  {
    number: '04',
    title: 'Cultural Traditions',
    learned:
      'Zuo yuezi (Chinese confinement), sanhujori (Korean postpartum care), satogaeri (Japanese homecoming birth), confinement meal principles, and cross-cultural family dynamics.',
    benefit:
      'She understands what your mother and grandmother are talking about — and can bridge traditional wisdom with modern medical guidance.',
  },
  {
    number: '05',
    title: 'Nutrition & Meal Planning',
    learned:
      'Postpartum recovery recipes across Asian traditions, dietary guidelines for breastfeeding mothers, body constitution assessment, and ingredient sourcing for culturally specific meals.',
    benefit:
      'The right food prepared for you every day — meals that support your recovery and respect your family\'s traditions.',
  },
  {
    number: '06',
    title: 'Emotional Wellness',
    learned:
      'Postpartum depression and anxiety recognition, active listening techniques, cultural stigma navigation, boundary setting, and professional referral protocols.',
    benefit:
      'Your feelings are seen and supported. She is trained to recognize when you need more than reassurance — and knows how to connect you with professional help.',
  },
  {
    number: '07',
    title: 'Safety & Emergency',
    learned:
      'Infant CPR certification, choking response, emergency protocols, safe sleep environment setup, and when to call 911 versus when to call the pediatrician.',
    benefit:
      'Your family\'s safety is never left to chance. She knows exactly what to do in an emergency.',
  },
];

const certSteps = [
  {
    number: '01',
    title: 'Complete ADA-approved training',
    description:
      '4-5 days of intensive, hands-on training conducted in your doula\'s preferred language.',
  },
  {
    number: '02',
    title: 'Pass written + practical exams',
    description:
      '60-minute written exam (passing score: 70/100) followed by a 30-minute one-on-one practical evaluation.',
  },
  {
    number: '03',
    title: 'Earn ADA certification',
    description:
      'Certification is valid for 1 year and must be renewed through continuing education — ensuring your doula stays current.',
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

export default function HowWeTrainPage() {
  return (
    <>
      {/* Hero with image */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                For Families
              </span>
              <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
                What Your Doula Knows
              </h1>
              <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-xl leading-relaxed">
                Every ADA-certified doula completes rigorous training that blends
                evidence-based care with cultural wisdom — before she ever enters
                your home.
              </p>
            </div>
            <div className="w-full lg:w-[500px] shrink-0">
              <Image
                src="/images/families/training-hero.webp"
                alt="Doula students during a professional training session"
                width={1920}
                height={1441}
                sizes="(max-width: 1024px) 100vw, 500px"
                className="rounded-2xl object-cover w-full aspect-[16/10]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opening Narrative */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="text-lg md:text-xl text-ada-navy/70 leading-relaxed">
            Your doula didn&apos;t just show up. She completed days of intensive
            training, passed both a written and practical exam, and earned a
            credential recognized by 6 insurance partners. She studied your
            culture&apos;s postpartum traditions alongside evidence-based
            newborn care. She practiced emergency protocols until they became
            second nature.
          </p>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/70 leading-relaxed">
            Here is what happened before she walked through your door.
          </p>
        </div>
      </section>

      {/* Training Curriculum */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Training Curriculum
            </h2>
            <p className="mt-4 text-lg text-ada-navy/60 max-w-2xl mx-auto">
              7 modules. Every one designed so your doula is ready for whatever
              your postpartum journey brings.
            </p>
            <Image
              src="/images/families/training-class.webp"
              alt="Doula trainer demonstrating newborn care techniques to students"
              width={1600}
              height={1201}
              sizes="(max-width: 800px) 100vw, 800px"
              className="mt-8 rounded-2xl object-cover w-full max-w-[800px] mx-auto aspect-[16/9]"
              loading="lazy"
            />
          </div>

          <div className="space-y-6">
            {modules.map((mod, i) => (
              <div
                key={mod.number}
                className={`rounded-2xl bg-white p-8 md:p-10 ${
                  i % 2 === 0
                    ? 'md:flex md:flex-row'
                    : 'md:flex md:flex-row-reverse'
                } gap-10 items-start`}
              >
                {/* Left: What she learned */}
                <div className="md:w-1/2">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-dm-serif text-3xl text-ada-purple/30">
                      {mod.number}
                    </span>
                    <h3 className="font-dm-serif text-2xl text-ada-navy">
                      {mod.title}
                    </h3>
                  </div>
                  <p className="text-ada-navy/60 leading-relaxed">
                    <span className="font-outfit font-semibold text-sm tracking-wide uppercase text-ada-purple block mb-2">
                      What your doula learned
                    </span>
                    {mod.learned}
                  </p>
                </div>

                {/* Right: What this means for you */}
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <div className="bg-ada-cream/60 rounded-xl p-6 h-full">
                    <span className="font-outfit font-semibold text-sm tracking-wide uppercase text-ada-purple block mb-2">
                      What this means for you
                    </span>
                    <p className="text-ada-navy/70 leading-relaxed text-lg">
                      {mod.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Process */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Certification Process
            </h2>
            <p className="mt-4 text-lg text-ada-navy/60">
              Three steps stand between your doula and her ADA credential.
            </p>
          </div>

          <div className="space-y-10">
            {certSteps.map((step) => (
              <div key={step.number} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-ada-purple/10 flex items-center justify-center">
                  <span className="font-dm-serif text-lg text-ada-purple">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-dm-serif text-xl text-ada-navy">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-ada-navy/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Continuing Education */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Continuing Education
          </h2>
          <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed max-w-2xl mx-auto">
            Certification is not a one-time event. ADA doulas must maintain
            their credential through ongoing learning — attending workshops,
            completing updated coursework, and staying current with the latest
            in postpartum care and safety protocols.
          </p>
          <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed max-w-2xl mx-auto">
            When your doula arrives, she is not working from knowledge that is
            years old. She is current.
          </p>
        </div>
      </section>

      {/* Insurance Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Insurance Recognition
            </h2>
            <p className="mt-4 text-lg text-ada-navy/60 max-w-2xl mx-auto">
              ADA certification is recognized by major insurance partners,
              which means your doula services may be covered.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {insurancePartners.map((partner) => (
              <div
                key={partner}
                className="bg-ada-off-white rounded-xl py-5 px-4 text-center"
              >
                <span className="font-outfit font-medium text-ada-navy">
                  {partner}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-ada-navy/60">
            FSA/HSA eligible. Contact your insurance provider to verify your
            specific coverage.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Ready to find your doula?
          </h2>
          <p className="mt-4 text-lg text-ada-navy/60">
            Every ADA-certified doula has earned the training described above.
            Find one who speaks your language and understands your traditions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/for-families/find-a-doula"
              className="inline-flex items-center justify-center px-6 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
            >
              Find a Doula
            </Link>
            <Link
              href="/verify"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
            >
              Verify a Doula
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
