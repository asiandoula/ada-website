import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Code of Conduct | Asian Doula Alliance',
  description:
    'ADA Code of Conduct for certified doulas. Professional standards, client care principles, and ethical guidelines.',
};

const professionalStandards = [
  {
    title: 'Maintain Professional Competency',
    description:
      'Continuously update your knowledge and skills through ongoing education and training. Stay current with evidence-based practices in postpartum care, newborn care, and breastfeeding support.',
  },
  {
    title: 'Practice Within Your Scope',
    description:
      'Provide care within the defined scope of a postpartum doula. Do not offer medical advice, diagnoses, or treatments. Refer clients to appropriate healthcare providers when medical concerns arise.',
  },
  {
    title: 'Maintain Certifications',
    description:
      'Keep your ADA certification current by meeting all renewal requirements. Display your credentials honestly and accurately. Do not misrepresent your qualifications or experience.',
  },
  {
    title: 'Professional Communication',
    description:
      'Communicate clearly, respectfully, and professionally with clients, families, healthcare providers, and fellow doulas. Respond to inquiries in a timely manner.',
  },
];

const clientCarePrinciples = [
  {
    title: 'Client-Centered Care',
    description:
      'Prioritize the needs, preferences, and well-being of the client and their family above all else. Tailor your care to each family\'s unique cultural background, values, and circumstances.',
  },
  {
    title: 'Informed Consent',
    description:
      'Ensure clients understand the services you provide, including the scope and limitations of doula care. Obtain clear consent before providing any care or support services.',
  },
  {
    title: 'Confidentiality',
    description:
      'Protect client privacy at all times. Do not share personal, medical, or family information without explicit consent. Maintain secure records and dispose of sensitive information appropriately.',
  },
  {
    title: 'Non-Discrimination',
    description:
      'Provide equitable care to all clients regardless of race, ethnicity, religion, language, sexual orientation, gender identity, socioeconomic status, or any other characteristic.',
  },
  {
    title: 'Cultural Sensitivity',
    description:
      'Respect and honor the cultural traditions, practices, and beliefs of each family you serve. Seek to understand and accommodate cultural preferences in postpartum and newborn care.',
  },
];

const ethicalGuidelines = [
  {
    title: 'Integrity and Honesty',
    description:
      'Be truthful in all professional interactions. Do not engage in deceptive practices, false advertising, or misrepresentation of your services, qualifications, or outcomes.',
  },
  {
    title: 'Conflict of Interest',
    description:
      'Avoid situations where personal interests may conflict with client welfare. Disclose any potential conflicts of interest to clients and the organization. Do not accept gifts or compensation that could influence your professional judgment.',
  },
  {
    title: 'Professional Boundaries',
    description:
      'Maintain clear professional boundaries with clients and their families. Recognize when a situation exceeds your scope of practice and make appropriate referrals.',
  },
  {
    title: 'Reporting Obligations',
    description:
      'Report any concerns about child safety or abuse according to local laws and regulations. Report any violations of this Code of Conduct to the Asian Doula Alliance.',
  },
  {
    title: 'Accountability',
    description:
      'Take responsibility for your actions and decisions. If mistakes occur, address them honestly and work to resolve any issues promptly. Cooperate fully with any ADA review or investigation.',
  },
];

function Section({
  title,
  items,
}: {
  title: string;
  items: { title: string; description: string }[];
}) {
  return (
    <>
      <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">{title}</h2>
      <div className="space-y-4 mb-12">
        {items.map((item) => (
          <div key={item.title} className="p-5 bg-ada-lavender rounded-xl">
            <h3 className="font-outfit font-semibold text-ada-navy mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default function CodeOfConductPage() {
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
        <span className="text-ada-navy font-medium">Code of Conduct</span>
      </nav>

      <h1 className="font-dm-serif text-3xl md:text-4xl text-ada-navy mb-4">
        Code of Conduct
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-2xl">
        As an ADA-certified doula, you are expected to uphold the highest standards of
        professional and ethical conduct. This Code of Conduct outlines the principles that
        guide our certified doulas in providing exceptional, culturally sensitive care.
      </p>

      <Section
        title="Professional Standards"
        items={professionalStandards}
      />

      <Section
        title="Client Care Principles"
        items={clientCarePrinciples}
      />

      <Section
        title="Ethical Guidelines"
        items={ethicalGuidelines}
      />

      {/* Enforcement note */}
      <div className="p-6 bg-ada-navy/5 rounded-2xl">
        <h3 className="font-outfit font-semibold text-ada-navy mb-2">
          Enforcement
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Violations of this Code of Conduct may result in disciplinary action, including
          suspension or revocation of ADA certification. If you become aware of a potential
          violation, please report it to the Asian Doula Alliance at{' '}
          <a
            href="mailto:contact@asiandoula.org"
            className="text-ada-purple hover:underline"
          >
            contact@asiandoula.org
          </a>
          . All reports will be reviewed confidentially.
        </p>
      </div>
    </div>
  );
}
