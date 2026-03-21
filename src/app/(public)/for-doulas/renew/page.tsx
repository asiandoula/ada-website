import { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Renew & Recertification | Asian Doula Alliance',
  description:
    'Learn how to renew your ADA doula certification. Certificates are valid for 3 years with continuing education requirements.',
};

const renewalSteps = [
  {
    number: '01',
    title: 'Check Your Certification Status',
    description:
      'Verify your current certification status and expiration date using the Doula Verification tool. Your exam ID (format: YY-NNNNN) can be found on your original certificate.',
  },
  {
    number: '02',
    title: 'Complete Continuing Education',
    description:
      'Complete the required continuing education hours during your 3-year certification period. This ensures you stay current with the latest evidence-based practices in postpartum care.',
  },
  {
    number: '03',
    title: 'Submit Your Renewal Application',
    description:
      'Submit your renewal application along with documentation of completed continuing education. Contact ADA at contact@asiandoula.org or call (714) 202-6501 to begin the renewal process.',
  },
  {
    number: '04',
    title: 'Receive Your Renewed Certification',
    description:
      'Once your application is reviewed and approved, you will receive your renewed certification, valid for another 3 years from the renewal date.',
  },
];

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
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Keep your ADA credential current — certificates are valid for 3 years.
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
                <div className="flex-1 bg-[#fafafa] rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Certificate Validity
                  </h3>
                  <p className="text-2xl font-outfit font-bold text-ada-purple">3 Years</p>
                </div>
                <div className="flex-1 bg-[#fafafa] rounded-xl p-6">
                  <h3 className="font-outfit font-semibold text-ada-navy mb-1">
                    Insurance Partners
                  </h3>
                  <p className="text-ada-navy/60 text-sm leading-relaxed">
                    Medi-Cal, Kaiser, Cigna, IEHP, Carrot Fertility, Progyny
                  </p>
                </div>
              </div>

              {/* Renewal Steps */}
              <div className="space-y-8">
                {renewalSteps.map((item) => (
                  <div key={item.number} className="flex gap-6">
                    <span className="text-2xl font-semibold text-ada-purple/30 font-outfit shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="font-outfit text-lg font-semibold text-ada-navy mb-1">
                        {item.title}
                      </h3>
                      <p className="text-ada-navy/60 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-[#fafafa] rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
                  Ready to Renew?
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed max-w-xl mx-auto">
                  Check your certification status or contact us to begin the renewal process.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/verify"
                    className="inline-flex items-center justify-center rounded-full bg-ada-purple text-white px-4 py-2.5 text-sm font-medium hover:bg-ada-purple-hover transition-colors"
                  >
                    Check Certification Status
                  </Link>
                  <a
                    href="mailto:contact@asiandoula.org"
                    className="inline-flex items-center justify-center rounded-full border border-ada-navy/20 text-ada-navy px-4 py-2.5 text-sm font-medium hover:bg-ada-navy/5 transition-colors"
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
