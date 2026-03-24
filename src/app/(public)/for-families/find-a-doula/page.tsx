import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';

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

const sidebarLinks = [
  { label: 'How We Train', href: '/for-families/how-we-train' },
  { label: 'Verify a Doula', href: '/verify' },
  { label: 'FAQ', href: '/support/faq' },
];

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
      {/* Hero — light, per inner page pattern */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-24 left-[8%] w-16 h-16 rounded-full border-[3px] border-ada-green/30 rotate-[-20deg] hidden lg:block" />
        <div className="absolute bottom-12 right-[12%] w-12 h-12 bg-ada-pink-light rounded-lg rotate-[35deg] hidden lg:block" />
        <div className="absolute top-36 right-[6%] w-8 h-8 bg-ada-blue/20 rotate-[60deg] hidden lg:block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />

        <div className="relative max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Families
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Find an ADA-Certified Doula
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            ADA certifies doulas to the highest standards of culturally integrated postpartum care.
            We can help connect you with a certified professional who speaks your language.
          </p>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main Column */}
            <div className="lg:w-4/5 space-y-20">

              {/* Pathway 1: Partner — warm editorial card */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Work With a Trusted Partner
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-2xl">
                  ADA works with select organizations whose doula teams are fully ADA-certified.
                  Our primary partner serves families across the country with culturally integrated postpartum care.
                </p>

                <div className="mt-10 bg-ada-lavender rounded-3xl overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative">
                      <Image
                        src="/images/families/cooings-partner.webp"
                        alt="Cooings doula providing postpartum care to a new mother"
                        width={1200}
                        height={857}
                        className="w-full h-full object-cover object-center min-h-[240px]"
                      />
                    </div>
                    <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                      <p className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-purple/60 mb-2">
                        Featured Partner
                      </p>
                      <h3 className="font-dm-serif text-2xl text-ada-navy">
                        Cooings
                      </h3>
                      <p className="mt-3 text-sm text-ada-navy/60 leading-relaxed">
                        Cooings specializes in culturally integrated postpartum doula care. Their entire roster consists of ADA-certified doulas serving families in Mandarin, Cantonese, Japanese, Korean, and English.
                      </p>
                      <ul className="mt-4 space-y-1.5 text-sm text-ada-navy/50">
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          Insurance support — Kaiser, Medi-Cal, Cigna, FSA/HSA
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          LA, Bay Area, Seattle, NYC, Chicago
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-ada-purple shrink-0" />
                          Personalized matching based on your needs
                        </li>
                      </ul>
                      <div className="mt-6">
                        <a
                          href="https://www.cooings.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2.5 text-sm bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
                        >
                          Visit Cooings &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pathway 2: Contact ADA directly */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Ask Us for a Recommendation
                </h2>
                <p className="mt-4 text-ada-navy/60 leading-relaxed max-w-2xl">
                  Not sure where to start? We maintain relationships with certified doulas and partner agencies across the country. Tell us your location, language preference, and care needs — we&apos;ll personally recommend someone.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { step: '01', title: 'Tell us your needs', desc: 'Due date, location, language, cultural preferences.' },
                    { step: '02', title: 'We recommend', desc: 'We match you with certified doulas or partner agencies in your area.' },
                    { step: '03', title: 'You choose', desc: 'Meet your recommended doula and decide if it\'s the right fit.' },
                  ].map((s) => (
                    <div key={s.step} className="bg-ada-off-white rounded-2xl p-6">
                      <span className="font-dm-serif text-2xl text-ada-purple/30">{s.step}</span>
                      <h3 className="mt-2 font-dm-serif text-lg text-ada-navy">{s.title}</h3>
                      <p className="mt-2 text-sm text-ada-navy/50 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="inline-flex items-center px-5 py-2.5 text-sm border-2 border-ada-purple text-ada-purple font-medium rounded-full hover:bg-ada-purple hover:text-white transition-colors"
                  >
                    Contact Us Below &darr;
                  </Link>
                  <span className="ml-4 text-sm text-ada-navy/40">No obligation, no cost.</span>
                </div>
              </div>

              {/* Pathway 3: Already have a doula? */}
              <div className="bg-ada-off-white rounded-2xl p-10">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  Already Have a Doula?
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed max-w-2xl">
                  If you&apos;ve already found a doula through another channel, you can verify their ADA certification status using our public verification tool. Search by name, ID code, or certificate number.
                </p>
                <div className="mt-6">
                  <Link
                    href="/verify"
                    className="inline-flex items-center px-5 py-2.5 text-sm border-2 border-ada-navy/20 text-ada-navy font-medium rounded-full hover:bg-ada-navy/5 transition-colors"
                  >
                    Verify a Doula &rarr;
                  </Link>
                </div>
              </div>

              {/* Why Certification Matters */}
              <div>
                <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                  Why ADA Certification Matters
                </h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    {
                      title: 'Rigorous Training',
                      desc: '7-module curriculum covering postpartum care, newborn care, lactation support, emergency response, and cultural competency.',
                      color: 'bg-ada-green-light',
                    },
                    {
                      title: 'Comprehensive Examination',
                      desc: 'Certified doulas pass a multi-domain exam testing knowledge, practical skills, and ethical reasoning.',
                      color: 'bg-ada-blue-light',
                    },
                    {
                      title: 'Cultural Competency',
                      desc: 'Specialized training in Asian postpartum traditions — 坐月子, 산후조리, 里帰り — alongside evidence-based practices.',
                      color: 'bg-ada-pink-light',
                    },
                    {
                      title: 'Ongoing Standards',
                      desc: 'Annual renewal ensures doulas maintain current knowledge and adhere to our Code of Conduct.',
                      color: 'bg-ada-violet-light',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className={`mt-1 w-10 h-10 ${item.color} rounded-lg shrink-0`} />
                      <div>
                        <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                        <p className="mt-1 text-sm text-ada-navy/60 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-dm-serif text-2xl text-ada-navy mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span key={lang} className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-dm-serif text-2xl text-ada-navy mb-4">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceAreas.map((area) => (
                      <span key={area} className="px-4 py-2 bg-ada-off-white rounded-full text-ada-navy/70 text-sm font-outfit">
                        {area}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-ada-navy/40 font-outfit">
                    Our network is growing. Contact us if your area is not listed.
                  </p>
                </div>
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
      <div id="contact">
        <ContactForm />
      </div>
    </>
  );
}
