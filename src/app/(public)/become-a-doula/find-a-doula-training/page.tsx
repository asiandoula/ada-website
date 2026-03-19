import { Metadata } from 'next';
import Link from 'next/link';

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

export default function FindADoulaTrainingPage() {
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
        <span className="text-ada-navy font-medium">Find a Doula Training</span>
      </nav>

      <h1 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-4">
        Find a Doula Training
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">
        The first step to becoming a certified doula is completing an ADA-approved training
        program. Find a program that fits your schedule, language, and learning style.
      </p>

      {/* What to look for */}
      <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">
        What to Look for in a Training Program
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {lookForItems.map((item) => (
          <div key={item.title} className="p-5 bg-ada-lavender rounded-xl">
            <h3 className="font-outfit font-semibold text-ada-navy mb-2 text-sm">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* ADA-Approved Providers */}
      <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">
        ADA-Approved Training Providers
      </h2>
      <div className="space-y-6 mb-12">
        {trainingProviders.map((provider) => (
          <div
            key={provider.name}
            className="p-6 bg-ada-lavender rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="font-outfit text-lg font-semibold text-ada-navy">
                  {provider.name}
                </h3>
                <p className="text-gray-500 text-sm">{provider.location}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium shrink-0">
                ADA Approved
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{provider.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>
                <strong className="text-ada-navy">Duration:</strong> {provider.duration}
              </span>
              <span>
                <strong className="text-ada-navy">Languages:</strong>{' '}
                {provider.languages.join(', ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <strong className="text-ada-navy">Address:</strong> {provider.address}
            </p>
          </div>
        ))}
      </div>

      {/* Interested in becoming a provider */}
      <div className="p-8 bg-ada-lavender rounded-2xl text-center">
        <h3 className="font-dm-serif text-xl text-ada-navy mb-3">
          Interested in Becoming an Approved Training Provider?
        </h3>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          If you operate a doula training program and would like to apply for ADA approval,
          please contact us for more information on our approval process.
        </p>
        <a
          href="mailto:contact@asiandoula.org"
          className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-medium rounded-full hover:bg-ada-purple-hover transition-colors"
        >
          Contact ADA
        </a>
      </div>
    </div>
  );
}
