import { Metadata } from 'next';
import { Accordion } from '@/components/public/accordion';
import { ScrollAnimate } from '@/components/public/scroll-animate';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'License and Exam | Asian Doula Alliance',
  description:
    'Learn about the ADA certification exam format, fees, languages, and frequently asked questions.',
};

const examDetails = [
  { label: 'Written Exam', value: '60 minutes' },
  { label: 'Practical Exam', value: '30 minutes (one-on-one)' },
  { label: 'Exam Fee', value: '$625' },
  { label: 'Languages', value: 'English, Chinese, Japanese, Korean' },
  { label: 'Certificate Validity', value: '3 years' },
  { label: 'Exam ID Format', value: 'YY-NNNNN (e.g., 25-80301)' },
];

const faqItems = [
  {
    question: 'What does the written exam cover?',
    answer:
      'The written exam covers postpartum care fundamentals, newborn care, breastfeeding support, cultural competency, safety protocols, and client communication. Questions are a mix of multiple choice and short answer, designed to assess your knowledge of evidence-based postpartum care practices.',
  },
  {
    question: 'What happens during the practical exam?',
    answer:
      'The practical exam is a 30-minute one-on-one evaluation with a certified examiner. You will demonstrate hands-on skills including newborn handling, swaddling, bathing techniques, postpartum recovery support, and your ability to communicate effectively with families from diverse cultural backgrounds.',
  },
  {
    question: 'Can I take the exam in my native language?',
    answer:
      'Yes. ADA offers the certification exam in English, Chinese (Mandarin), Japanese, and Korean. Please specify your preferred language when registering for the exam. All exam materials, including instructions and questions, will be provided in your chosen language.',
  },
  {
    question: 'What if I fail the exam?',
    answer:
      'If you do not pass on your first attempt, you may retake the exam. A retake fee applies. We recommend reviewing the areas identified for improvement and consulting with your training program before reattempting the exam.',
  },
  {
    question: 'How do I register for the exam?',
    answer:
      'After completing an ADA-approved training program, your training provider will guide you through the exam registration process. You can also contact ADA directly at contact@asiandoula.org or call (714) 202-6501 to register.',
  },
  {
    question: 'Where is the exam held?',
    answer:
      'Exams are administered at the ADA training center located at 7515 Irvine Center Drive, #110, Irvine, CA 92618. Additional exam locations may be available depending on demand. Contact us for the latest schedule.',
  },
  {
    question: 'How long does it take to receive my certification?',
    answer:
      'Results are typically communicated within 2 weeks of your exam date. Once you pass, your ADA certification and exam ID will be issued and you can begin practicing as a certified doula.',
  },
];

export default function LicenseAndExamPage() {
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
        <span className="text-ada-navy font-medium">License and Exam</span>
      </nav>

      <ScrollAnimate animation="fade-up">
        <h1 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy mb-4">
          License and Exam
        </h1>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl">
          The ADA Certification Examination validates your skills and knowledge in postpartum
          doula care. Here is everything you need to know about the exam.
        </p>
      </ScrollAnimate>

      {/* Exam details grid */}
      <ScrollAnimate animation="fade-up" delay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {examDetails.map((detail) => (
            <div
              key={detail.label}
              className="p-5 border border-gray-200 rounded-xl"
            >
              <p className="text-sm text-gray-500 mb-1">{detail.label}</p>
              <p className="font-poppins font-semibold text-ada-navy">{detail.value}</p>
            </div>
          ))}
        </div>
      </ScrollAnimate>

      {/* What to expect */}
      <ScrollAnimate animation="fade-up" delay={200}>
        <h2 className="font-poppins text-2xl font-bold text-ada-navy mb-4">
          What to Expect
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 bg-ada-purple/5 rounded-xl">
            <h3 className="font-poppins font-semibold text-ada-navy mb-2">Written Exam</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                60-minute timed examination
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Multiple choice and short answer questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Covers postpartum care, newborn care, and cultural competency
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Available in 4 languages
              </li>
            </ul>
          </div>
          <div className="p-6 bg-ada-purple/5 rounded-xl">
            <h3 className="font-poppins font-semibold text-ada-navy mb-2">Practical Exam</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                30-minute one-on-one evaluation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Hands-on demonstration of doula skills
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Assessed by a certified ADA examiner
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ada-purple mt-0.5">&#x2022;</span>
                Evaluates practical competency and communication
              </li>
            </ul>
          </div>
        </div>
      </ScrollAnimate>

      {/* FAQ */}
      <ScrollAnimate animation="fade-up" delay={300}>
        <h2 className="font-poppins text-2xl font-bold text-ada-navy mb-6">
          Frequently Asked Questions
        </h2>
        <Accordion items={faqItems} />
      </ScrollAnimate>
    </div>
  );
}
