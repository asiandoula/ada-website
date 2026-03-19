import { Metadata } from 'next';
import { ScrollAnimate } from '@/components/public/scroll-animate';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Renew & Recertification | Asian Doula Alliance',
  description:
    'Learn how to renew your ADA doula certification. Certificates are valid for 3 years with continuing education requirements.',
};

const renewalSteps = [
  {
    step: '1',
    title: 'Check Your Certification Status',
    description:
      'Verify your current certification status and expiration date using the Doula Verification tool. Your exam ID (format: YY-NNNNN) can be found on your original certificate.',
  },
  {
    step: '2',
    title: 'Complete Continuing Education',
    description:
      'Complete the required continuing education hours during your 3-year certification period. This ensures you stay current with the latest evidence-based practices in postpartum care.',
  },
  {
    step: '3',
    title: 'Submit Your Renewal Application',
    description:
      'Submit your renewal application along with documentation of completed continuing education. Contact ADA at contact@asiandoula.org or call (714) 202-6501 to begin the renewal process.',
  },
  {
    step: '4',
    title: 'Receive Your Renewed Certification',
    description:
      'Once your application is reviewed and approved, you will receive your renewed certification, valid for another 3 years from the renewal date.',
  },
];

export default function RenewRecertificationPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ada-purple transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/become-a-doula/steps-to-certification"
          className="hover:text-ada-purple transition-colors"
        >
          Get Certified
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ada-navy font-medium">Renew &amp; Recertification</span>
      </nav>

      <ScrollAnimate animation="fade-up">
        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy mb-4">
          Renew &amp; Recertification
        </h1>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl">
          ADA certifications are valid for 3 years. Keep your credential current to maintain your
          standing as a certified postpartum doula and continue providing care recognized by
          insurance partners.
        </p>
      </ScrollAnimate>

      {/* Key info card */}
      <ScrollAnimate animation="fade-up" delay={100}>
        <div className="p-6 bg-ada-purple/5 rounded-2xl mb-10 flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-ada-navy mb-1">Certificate Validity</h3>
            <p className="text-3xl font-poppins font-bold text-ada-purple">3 Years</p>
          </div>
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-ada-navy mb-1">Insurance Recognition</h3>
            <p className="text-gray-600 text-sm">
              Medi-Cal, Kaiser, Cigna, IEHP, Carrot Fertility, Progyny
            </p>
          </div>
        </div>
      </ScrollAnimate>

      {/* Renewal Steps */}
      <ScrollAnimate animation="fade-up" delay={200}>
        <h2 className="font-poppins text-2xl font-bold text-ada-navy mb-6">
          How to Renew Your Certification
        </h2>
        <div className="space-y-6 mb-12">
          {renewalSteps.map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ada-purple text-white font-poppins font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-ada-navy mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimate>

      {/* CTA */}
      <ScrollAnimate animation="fade-up" delay={300}>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/become-a-doula/doula-verification"
            className="inline-flex items-center justify-center px-6 py-3 bg-ada-purple text-white font-semibold rounded-lg hover:bg-ada-purple-accent transition-colors"
          >
            Check Certification Status
          </Link>
          <a
            href="mailto:contact@asiandoula.org"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-ada-purple text-ada-purple font-semibold rounded-lg hover:bg-ada-purple/5 transition-colors"
          >
            Contact Us for Renewal
          </a>
        </div>
      </ScrollAnimate>
    </div>
  );
}
