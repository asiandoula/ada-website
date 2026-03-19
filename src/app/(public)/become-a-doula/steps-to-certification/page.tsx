import { Metadata } from 'next';
import { Steps } from '@/components/public/steps';
import { ScrollAnimate } from '@/components/public/scroll-animate';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Steps to Certification | Asian Doula Alliance',
  description:
    'Learn how to become a certified postpartum doula through ADA. Complete training, pass the exam, and earn your certification.',
};

const certSteps = [
  {
    number: '1',
    title: 'Enroll in an ADA-Approved Training Program',
    description:
      'Find and enroll in an ADA-approved postpartum doula training program. Our approved programs cover essential skills including newborn care, postpartum recovery support, breastfeeding basics, cultural competency, and family dynamics. Training programs are available in multiple languages including English, Chinese, Japanese, and Korean.',
  },
  {
    number: '2',
    title: 'Complete the Training',
    description:
      'Successfully complete all required coursework and hands-on training hours. Training typically includes classroom instruction, practical demonstrations, and supervised practice sessions. You will learn evidence-based techniques for supporting new families during the critical postpartum period.',
  },
  {
    number: '3',
    title: 'Pass the Certification Examination',
    description:
      'Register for and pass the ADA Certification Examination. The exam consists of a 60-minute written test and a 30-minute practical evaluation conducted one-on-one with an examiner. The exam fee is $625 and is available in English, Chinese, Japanese, and Korean. Upon passing, you will receive your ADA certification, valid for 3 years.',
  },
];

const values = [
  { label: 'Compassion', color: 'bg-ada-purple/10 text-ada-purple' },
  { label: 'Integrity', color: 'bg-ada-cyan/10 text-ada-cyan' },
  { label: 'Excellence', color: 'bg-ada-purple-accent/10 text-ada-purple-accent' },
  { label: 'Knowledge', color: 'bg-ada-navy/10 text-ada-navy' },
];

export default function StepsToCertificationPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-ada-purple transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ada-navy font-medium">Get Certified</span>
      </nav>

      <ScrollAnimate animation="fade-up">
        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy mb-4">
          Steps to Apply for Certification
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl">
          The Asian Doula Alliance certification demonstrates your commitment to providing
          culturally sensitive, high-quality postpartum care. Follow these steps to earn your
          credential.
        </p>
      </ScrollAnimate>

      {/* Value badges */}
      <ScrollAnimate animation="fade-up" delay={100}>
        <div className="flex flex-wrap gap-3 mb-10">
          {values.map((v) => (
            <span
              key={v.label}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${v.color}`}
            >
              {v.label}
            </span>
          ))}
        </div>
      </ScrollAnimate>

      {/* Steps */}
      <ScrollAnimate animation="fade-up" delay={200}>
        <Steps steps={certSteps} />
      </ScrollAnimate>

      {/* CTA */}
      <ScrollAnimate animation="fade-up" delay={300}>
        <div className="mt-12 p-8 bg-ada-purple/5 rounded-2xl text-center">
          <h3 className="font-poppins text-xl font-semibold text-ada-navy mb-3">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6">
            Find an ADA-approved training program near you and begin your journey.
          </p>
          <Link
            href="/become-a-doula/find-a-doula-training"
            className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-semibold rounded-lg hover:bg-ada-purple-accent transition-colors"
          >
            Find a Training Program
          </Link>
        </div>
      </ScrollAnimate>
    </div>
  );
}
