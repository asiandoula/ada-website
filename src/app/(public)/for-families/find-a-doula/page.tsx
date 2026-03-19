import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Find a Doula | Asian Doula Alliance',
  description:
    'Connect with an ADA-certified postpartum doula through our partner network. Culturally competent, multilingual care for your family.',
  openGraph: {
    title: 'Find a Doula | Asian Doula Alliance',
    description:
      'Connect with an ADA-certified postpartum doula through our partner network. Culturally competent, multilingual care for your family.',
  },
};

const steps = [
  {
    number: '01',
    description:
      'ADA certifies doulas through rigorous training and examination.',
  },
  {
    number: '02',
    description: 'Certified doulas join partner service networks.',
  },
  {
    number: '03',
    description:
      'Families connect with doulas through partners for personalized matching.',
  },
];

export default function FindADoulaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple-hover">
            Find a Doula
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Connect with a Certified Doula
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            ADA partners with professional doula service providers to connect
            families with certified caregivers.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 bg-ada-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy text-center">
            How It Works
          </h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <span className="font-dm-serif text-5xl text-ada-purple/30">
                  {step.number}
                </span>
                <p className="mt-4 text-lg text-ada-navy/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner — Cooings */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3">
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Our Partner
              </span>
              <h2 className="mt-4 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Cooings Doula Care
              </h2>
              <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                Cooings is a professional postpartum doula service specializing
                in Asian families. They offer 26-day live-in care with
                ADA-certified doulas, providing culturally integrated support
                during your postpartum recovery.
              </p>
              <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                From newborn care and breastfeeding support to traditional
                postpartum nutrition and recovery practices, Cooings doulas are
                trained and certified to the highest ADA standards. Insurance is
                accepted through multiple major providers.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://cooings.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                >
                  Visit Cooings &rarr;
                </a>
                <Link
                  href="/support/contact"
                  className="inline-flex items-center px-6 py-3 border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
                >
                  Contact ADA
                </Link>
              </div>
            </div>
            <div className="lg:col-span-2 bg-ada-lavender rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy mb-6">
                Cooings at a Glance
              </h3>
              <dl className="space-y-5">
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Coverage
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    LA, Bay Area, San Diego, Seattle, NYC
                  </dd>
                </div>
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Insurance
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    Medi-Cal, Kaiser, Cigna, Carrot Fertility, Blue Shield
                  </dd>
                </div>
                <div>
                  <dt className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                    Services
                  </dt>
                  <dd className="mt-1 text-ada-navy/80">
                    Live-in postpartum care, lactation support, newborn care
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Other Ways */}
      <section className="py-24 md:py-32 bg-ada-lavender">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Other Ways to Find a Doula
          </h2>
          <div className="mt-12 space-y-6 text-left">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-dm-serif text-lg text-ada-navy">
                Contact ADA Directly
              </h3>
              <p className="mt-2 text-ada-navy/70 leading-relaxed">
                Reach us at{' '}
                <a
                  href="mailto:contact@asiandoula.org"
                  className="text-ada-purple hover:text-ada-purple-hover underline"
                >
                  contact@asiandoula.org
                </a>{' '}
                or{' '}
                <a
                  href="tel:+17142026501"
                  className="text-ada-purple hover:text-ada-purple-hover underline"
                >
                  (714) 202-6501
                </a>{' '}
                and we can help connect you with a certified doula in your area.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-dm-serif text-lg text-ada-navy">
                Ask Your Insurance Provider
              </h3>
              <p className="mt-2 text-ada-navy/70 leading-relaxed">
                Contact your insurance company and ask about coverage for
                ADA-certified postpartum doulas. Many major providers recognize
                our certification.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-dm-serif text-lg text-ada-navy">
                Check with Your Hospital or Birthing Center
              </h3>
              <p className="mt-2 text-ada-navy/70 leading-relaxed">
                Many hospitals and birthing centers maintain referral lists of
                certified doulas. Ask if they work with ADA-certified
                professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
