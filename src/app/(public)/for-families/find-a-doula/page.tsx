import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';
import { ShieldCheck, ExternalLink, MessageCircle, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find a Doula | Asian Doula Alliance',
  description:
    'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  openGraph: {
    title: 'Find a Doula | Asian Doula Alliance',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
  },
};

const languages = ['English', 'Mandarin', 'Cantonese', 'Japanese', 'Korean'];

const serviceAreas = [
  'Los Angeles',
  'Bay Area',
  'San Diego',
  'Seattle',
  'New York City',
  'Chicago',
];

export default function FindADoulaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[900px] mx-auto px-6 text-center">
          <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-white/50 mb-4">
            For Families
          </p>
          <h1 className="font-dm-serif text-4xl md:text-5xl lg:text-6xl text-white">
            Find an ADA-Certified Doula
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            ADA certifies doulas to the highest standards of culturally integrated postpartum care. We can help connect you with a certified professional.
          </p>
        </div>
      </section>

      {/* Three Pathways */}
      <section className="py-20 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Three Ways to Connect
            </h2>
            <p className="mt-4 text-lg text-ada-navy/50 max-w-2xl mx-auto">
              Whether you already have a doula in mind or need help finding the right match, we have a path for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pathway 1: Cooings Partner */}
            <div className="relative border-2 border-ada-purple/20 rounded-2xl p-8 bg-gradient-to-b from-ada-purple/[0.03] to-transparent">
              <div className="absolute -top-3 left-8">
                <span className="bg-ada-purple text-white text-xs font-outfit font-semibold px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-ada-purple/10 flex items-center justify-center mb-6">
                <ExternalLink className="w-6 h-6 text-ada-purple" />
              </div>
              <h3 className="font-dm-serif text-xl text-ada-navy mb-3">
                Through Our Partner
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed mb-6">
                <strong className="text-ada-navy">Cooings</strong> specializes in culturally integrated postpartum doula care. Their entire roster consists of ADA-certified doulas who speak Mandarin, Cantonese, Japanese, Korean, and English.
              </p>
              <ul className="text-sm text-ada-navy/50 space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                  Insurance billing support (Kaiser, Medi-Cal, Cigna)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                  Serving LA, Bay Area, Seattle, NYC, Chicago
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                  Personalized matching based on your needs
                </li>
              </ul>
              <a
                href="https://www.cooings.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 bg-ada-purple text-white font-outfit font-semibold text-sm rounded-xl hover:bg-ada-purple-hover transition-colors"
              >
                Visit Cooings <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Pathway 2: Contact ADA */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-ada-navy/5 flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-ada-navy/60" />
              </div>
              <h3 className="font-dm-serif text-xl text-ada-navy mb-3">
                Ask ADA Directly
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed mb-6">
                Not sure where to start? Reach out to us directly. We maintain relationships with certified doulas across the country and can personally recommend someone based on your location, language, and care preferences.
              </p>
              <ul className="text-sm text-ada-navy/50 space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  Personalized recommendation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  Independent doulas & partner agencies
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  No obligation, no cost
                </li>
              </ul>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 border-2 border-ada-navy/15 text-ada-navy font-outfit font-semibold text-sm rounded-xl hover:bg-ada-navy/5 transition-colors"
              >
                Contact Us Below
              </Link>
            </div>

            {/* Pathway 3: Verify */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-ada-navy/5 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-ada-navy/60" />
              </div>
              <h3 className="font-dm-serif text-xl text-ada-navy mb-3">
                Verify a Doula
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed mb-6">
                Already found a doula and want to confirm their ADA certification? Use our public verification tool to check their credentials, certification status, and expiration date.
              </p>
              <ul className="text-sm text-ada-navy/50 space-y-2 mb-8">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  Search by name, ID, or certificate number
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  Real-time certification status
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-ada-navy/30 shrink-0" />
                  Instant results
                </li>
              </ul>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 border-2 border-ada-navy/15 text-ada-navy font-outfit font-semibold text-sm rounded-xl hover:bg-ada-navy/5 transition-colors"
              >
                Verify Credentials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why ADA Certification Matters */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Why ADA Certification Matters
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Rigorous Training',
                desc: '7-module curriculum covering postpartum care, newborn care, lactation support, emergency response, and cultural competency.',
              },
              {
                title: 'Examination & Assessment',
                desc: 'Certified doulas pass a comprehensive exam testing knowledge across all domains of postpartum care.',
              },
              {
                title: 'Cultural Competency',
                desc: 'Specialized training in Asian postpartum traditions including 坐月子, 산후조리, and 里帰り, alongside evidence-based practices.',
              },
              {
                title: 'Ongoing Standards',
                desc: 'Annual renewal requirements ensure doulas maintain current knowledge and adhere to our Code of Conduct.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="mt-1 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-ada-purple" />
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">{item.title}</h3>
                  <p className="text-sm text-ada-navy/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages & Service Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">
                Languages Supported
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">
                Service Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-ada-navy/40 font-outfit">
                Our network of certified doulas is growing. Contact us if you need support in an area not listed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <div id="contact">
        <ContactForm />
      </div>
    </>
  );
}
