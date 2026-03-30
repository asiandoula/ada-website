import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Renew & Recertification | Asian Doula Alliance',
  description:
    'Learn how to renew your ADA doula certification. Certificates are valid for 1 year with two renewal pathways: reference letters or recertification exam.',
};

const sidebarLinks = [
  { label: 'Postpartum Doula', href: '/certifications/postpartum-doula' },
  { label: 'Birth Doula', href: '/certifications/birth-doula' },
  { label: 'IBCLC Prep', href: '/certifications/ibclc' },
  { label: 'Code of Conduct', href: '/for-doulas/code-of-conduct' },
];

export default function RenewRecertificationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            For Doulas
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Renew &amp; Recertification
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/70 max-w-3xl mx-auto leading-relaxed">
            ADA certificates are valid for 1 year. Choose one of two pathways to renew your credential.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content column */}
            <div className="lg:w-4/5 space-y-16">
              {/* Key Info */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 bg-ada-off-white rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Certificate Validity
                  </h3>
                  <p className="text-2xl font-outfit font-bold text-ada-purple">1 Year</p>
                </div>
                <div className="flex-1 bg-ada-off-white rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Renewal Fee
                  </h3>
                  <p className="text-2xl font-outfit font-bold text-ada-purple">$100</p>
                </div>
                <div className="flex-1 bg-ada-off-white rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Renewal Pathways
                  </h3>
                  <p className="text-2xl font-outfit font-bold text-ada-purple">2 Options</p>
                </div>
                <div className="flex-1 bg-ada-off-white rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Insurance Partners
                  </h3>
                  <p className="text-ada-navy/70 text-sm leading-relaxed">
                    Medi-Cal, Kaiser, Cigna, IEHP, Carrot Fertility, Progyny
                  </p>
                </div>
              </div>

              {/* Step 1: Check Status */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-dm-serif text-3xl text-ada-purple/30">01</span>
                  <h2 className="font-dm-serif text-2xl text-ada-navy">Check Your Certification Status</h2>
                </div>
                <p className="text-ada-navy/70 leading-relaxed">
                  Verify your current certification status and expiration date using the
                  Doula Verification tool or your Doula Portal. Your Doula ID
                  (format: #YY-NNNN) can be found on your original certificate.
                </p>
              </div>

              {/* Step 2: Choose Pathway */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-dm-serif text-3xl text-ada-purple/30">02</span>
                  <h2 className="font-dm-serif text-2xl text-ada-navy">Choose Your Renewal Pathway</h2>
                </div>
                <p className="text-ada-navy/70 leading-relaxed mb-8">
                  ADA offers two pathways to renew your certification. Choose the one that works best for you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pathway A: Reference Letters */}
                  <div className="border-2 border-ada-purple/20 rounded-2xl p-8 relative">
                    <span className="absolute -top-3 left-6 bg-ada-purple text-white text-xs font-outfit font-semibold px-3 py-1 rounded-full">
                      Pathway A
                    </span>
                    <h3 className="font-dm-serif text-xl text-ada-navy mt-2">
                      Reference Letters
                    </h3>
                    <p className="mt-3 text-ada-navy/70 leading-relaxed">
                      Submit 3 professional reference letters from clients, colleagues, or
                      healthcare professionals who can speak to your work as a doula.
                    </p>
                    <div className="mt-6 bg-ada-off-white rounded-xl p-5">
                      <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                        Each reference must include:
                      </p>
                      <ul className="space-y-2 text-sm text-ada-navy/70">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Full name of the reference
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Phone number or email address
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Written recommendation describing your doula work
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pathway B: Recertification Exam */}
                  <div className="border-2 border-ada-purple/20 rounded-2xl p-8 relative">
                    <span className="absolute -top-3 left-6 bg-ada-navy text-white text-xs font-outfit font-semibold px-3 py-1 rounded-full">
                      Pathway B
                    </span>
                    <h3 className="font-dm-serif text-xl text-ada-navy mt-2">
                      Recertification Exam
                    </h3>
                    <p className="mt-3 text-ada-navy/70 leading-relaxed">
                      Take a shorter recertification exam to demonstrate your continued
                      competency in postpartum doula care.
                    </p>
                    <div className="mt-6 bg-ada-off-white rounded-xl p-5">
                      <p className="font-outfit text-sm font-semibold text-ada-navy mb-3">
                        Exam details:
                      </p>
                      <ul className="space-y-2 text-sm text-ada-navy/70">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Shorter than the initial certification exam
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Covers updated practices and protocols
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ada-purple shrink-0" />
                          Passing score: 70/100
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Submit */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-dm-serif text-3xl text-ada-purple/30">03</span>
                  <h2 className="font-dm-serif text-2xl text-ada-navy">Submit Your Renewal Application</h2>
                </div>
                <p className="text-ada-navy/70 leading-relaxed">
                  Submit your renewal application along with your chosen pathway materials
                  (reference letters or exam results). Contact ADA at{' '}
                  <a href="mailto:contact@asiandoula.org" className="text-ada-purple hover:underline">
                    contact@asiandoula.org
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+17142026501" className="text-ada-purple hover:underline">
                    (714) 202-6501
                  </a>{' '}
                  to begin the renewal process.
                </p>
              </div>

              {/* Step 4: Receive */}
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-dm-serif text-3xl text-ada-purple/30">04</span>
                  <h2 className="font-dm-serif text-2xl text-ada-navy">Receive Your Renewed Certification</h2>
                </div>
                <p className="text-ada-navy/70 leading-relaxed">
                  Once your application is reviewed and approved, you will receive your
                  renewed certification, valid for another 1 year from the renewal date.
                  Your updated certificate and verification status will be available in
                  your Doula Portal.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-ada-off-white rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  Ready to Renew?
                </h2>
                <p className="mt-3 text-ada-navy/70 leading-relaxed max-w-xl mx-auto">
                  Check your certification status or contact us to begin the renewal process.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/verify"
                    className="inline-flex items-center justify-center rounded-full bg-ada-purple text-white px-6 py-3 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                  >
                    Check Certification Status
                  </Link>
                  <Link
                    href="/portal"
                    className="inline-flex items-center justify-center rounded-full border border-ada-navy/20 text-ada-navy px-6 py-3 text-sm font-medium hover:bg-ada-navy/5 transition-colors"
                  >
                    My Portal
                  </Link>
                  <a
                    href="mailto:contact@asiandoula.org"
                    className="inline-flex items-center justify-center rounded-full border border-ada-navy/20 text-ada-navy px-6 py-3 text-sm font-medium hover:bg-ada-navy/5 transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="sticky top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  For Doulas
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
