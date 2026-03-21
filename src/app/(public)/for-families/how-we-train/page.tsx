import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'How We Train Our Doulas | Asian Doula Alliance',
  description:
    'The standards behind every ADA-certified doula. Learn about our rigorous training curriculum, certification process, and insurance recognition.',
  openGraph: {
    title: 'How We Train Our Doulas | Asian Doula Alliance',
    description:
      'The standards behind every ADA-certified doula. Learn about our rigorous training curriculum, certification process, and insurance recognition.',
  },
};

const sidebarLinks = [
  { label: 'Find a Doula', href: '/for-families/find-a-doula' },
  { label: 'Verify a Doula', href: '/verify' },
  { label: 'FAQ', href: '/support/faq' },
];

const curriculum = [
  'Postpartum recovery support (physical and emotional)',
  'Newborn care: feeding, bathing, sleep safety, soothing techniques',
  'Breastfeeding fundamentals and troubleshooting',
  'Cultural competency across Asian traditions (zuo yuezi, Korean sanhujori, Japanese satogaeri)',
  'Nutrition and meal planning for postpartum recovery',
  'Family dynamics and communication',
  'Safety protocols and emergency awareness',
];

const certSteps = [
  {
    number: '01',
    title: 'Complete ADA-approved training',
    description: '4\u20135 days intensive, conducted in your preferred language.',
  },
  {
    number: '02',
    title: 'Pass written exam + practical evaluation',
    description: '60-minute written exam and 30-minute one-on-one practical assessment.',
  },
  {
    number: '03',
    title: 'Earn certification valid for 3 years',
    description: 'Maintain your credential with continuing education for renewal.',
  },
];

export default function HowWeTrainPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            How We Train Our Doulas
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            The standards behind every ADA-certified doula who enters your home.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main Column */}
            <div className="lg:w-4/5 space-y-16">
              {/* Intro */}
              <p className="text-lg text-ada-navy/70 leading-relaxed">
                When an ADA-certified doula walks through your door, she brings
                more than experience &mdash; she brings verified training in both
                modern postpartum care and the cultural traditions your family
                values. Here&apos;s what goes into that certification.
              </p>

              {/* Training Curriculum */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Training Curriculum
                </h2>
                <ul className="mt-8 space-y-4">
                  {curriculum.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-ada-navy/70 leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Certification Process */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Certification Process
                </h2>
                <div className="mt-8 space-y-8">
                  {certSteps.map((step) => (
                    <div key={step.number}>
                      <span className="font-dm-serif text-3xl text-ada-purple/40">
                        {step.number}
                      </span>
                      <h3 className="mt-2 font-dm-serif text-xl text-ada-navy">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-ada-navy/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance Recognition */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Insurance Recognition
                </h2>
                <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                  Many ADA-certified doula services are covered by insurance. Our
                  certified doulas are recognized by: Medi-Cal, Kaiser, Cigna,
                  IEHP, Carrot Fertility, and Progyny. Contact your insurance
                  provider to verify your specific coverage.
                </p>
              </div>

              {/* CTA */}
              <div>
                <h2 className="font-dm-serif text-2xl text-ada-navy">
                  Ready to find your doula?
                </h2>
                <Link
                  href="/for-families/find-a-doula"
                  className="mt-4 inline-flex items-center px-4 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                >
                  Find a Doula &rarr;
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <p className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                  For Families
                </p>
                <nav className="mt-4 space-y-3">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-ada-navy/60 hover:text-ada-purple transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactForm />
    </>
  );
}
