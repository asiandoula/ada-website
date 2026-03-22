import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Find a Doula Training | Asian Doula Alliance',
  description:
    'Find ADA-approved doula training programs. Learn what to look for in a quality training program.',
};

const lookForItems = [
  {
    title: 'ADA-Approved Curriculum',
    description:
      'Ensure the program is approved by the Asian Doula Alliance and covers all required competencies for ADA certification.',
  },
  {
    title: 'Multilingual Support',
    description:
      'Look for programs that offer instruction in your preferred language. ADA supports training in English, Chinese, Japanese, and Korean.',
  },
  {
    title: 'Hands-On Practice',
    description:
      'Quality programs include supervised hands-on practice sessions where you can develop practical skills in newborn care, swaddling, and postpartum support.',
  },
  {
    title: 'Cultural Competency Training',
    description:
      'The best programs include dedicated training on providing culturally sensitive care to families from diverse Asian backgrounds.',
  },
  {
    title: 'Experienced Instructors',
    description:
      'Look for programs led by certified, experienced doulas who can share real-world knowledge and mentorship.',
  },
];

const trainingProviders = [
  {
    name: 'Cooings Doula Training Program',
    location: 'Irvine, CA',
    languages: ['English', 'Chinese'],
    duration: '4-5 days intensive',
    description:
      'Comprehensive ADA-approved training program covering postpartum care, newborn care, breastfeeding support, and cultural competency. Includes hands-on practice and exam preparation.',
    address: '7515 Irvine Center Drive, #110, Irvine, CA 92618',
  },
];

const sidebarLinks = [
  { label: 'Steps to Certification', href: '/certifications/postpartum-doula/steps' },
  { label: 'Exam Details', href: '/certifications/postpartum-doula/exam' },
  { label: 'Renew & Recertification', href: '/for-doulas/renew' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

export default function FindADoulaTrainingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Postpartum Doula Certification
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Find a Training Program
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            ADA-approved programs that prepare you for certification.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 space-y-16">
              {/* What to Look For */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  What to Look For
                </h2>
                <div className="space-y-6">
                  {lookForItems.map((item) => (
                    <div key={item.title}>
                      <h3 className="font-outfit font-semibold text-ada-navy">{item.title}</h3>
                      <p className="mt-2 text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADA-Approved Providers */}
              <div>
                <h2 className="font-dm-serif text-3xl text-ada-navy mb-8">
                  ADA-Approved Providers
                </h2>
                <div className="space-y-6">
                  {trainingProviders.map((provider) => (
                    <div
                      key={provider.name}
                      className="bg-[#fafafa] rounded-2xl p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-outfit text-lg font-semibold text-ada-navy">
                            {provider.name}
                          </h3>
                          <p className="text-ada-navy/60 text-sm">{provider.location}</p>
                        </div>
                        <span className="inline-flex items-center text-ada-purple bg-ada-purple/10 text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0">
                          ADA Approved
                        </span>
                      </div>
                      <p className="text-ada-navy/60 text-sm mb-4 leading-relaxed">
                        {provider.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-ada-navy/60">
                        <span>
                          <strong className="text-ada-navy">Duration:</strong> {provider.duration}
                        </span>
                        <span>
                          <strong className="text-ada-navy">Languages:</strong>{' '}
                          {provider.languages.join(', ')}
                        </span>
                      </div>
                      <p className="text-sm text-ada-navy/60 mt-2">
                        <strong className="text-ada-navy">Address:</strong> {provider.address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Become a Provider CTA */}
              <div className="bg-[#fafafa] rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  Interested in Becoming an Approved Training Provider?
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed max-w-xl mx-auto">
                  If you operate a doula training program and would like to apply for ADA approval,
                  please contact us for more information on our approval process.
                </p>
                <a
                  href="mailto:contact@asiandoula.org"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  Contact ADA
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  Postpartum Doula Certification
                </span>
                <nav className="mt-4 flex flex-col">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors"
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
