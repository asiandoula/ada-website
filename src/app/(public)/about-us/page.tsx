import { ScrollAnimate } from '@/components/public/scroll-animate';
import { TeamCard } from '@/components/public/team-card';
import { Heart, Globe, Award, Users } from 'lucide-react';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Executive Director',
    role: 'Leadership',
    bio: 'Leading ADA\'s mission to set the gold standard in culturally integrated postpartum care certification across the United States.',
  },
  {
    name: 'Director of Education',
    role: 'Training & Curriculum',
    bio: 'Developing comprehensive training programs that bridge Eastern traditions with Western evidence-based postpartum care practices.',
  },
  {
    name: 'Certification Manager',
    role: 'Exam Administration',
    bio: 'Overseeing the multilingual certification process, ensuring fair and rigorous assessment for all doula candidates.',
  },
  {
    name: 'Community Outreach Lead',
    role: 'Partnerships & Growth',
    bio: 'Building relationships with insurance partners, healthcare providers, and communities to expand access to culturally competent doula care.',
  },
];

const highlights = [
  {
    icon: Heart,
    title: 'Culturally Integrated',
    description: 'Bridging Eastern postpartum traditions with Western evidence-based practices.',
  },
  {
    icon: Globe,
    title: 'Multilingual Support',
    description: 'Exams and training available in English, Mandarin, Cantonese, Japanese, and Korean.',
  },
  {
    icon: Award,
    title: 'Industry Recognized',
    description: 'Certifications accepted by major insurance partners including Kaiser, Medi-Cal, and Cigna.',
  },
  {
    icon: Users,
    title: '164+ Certified Doulas',
    description: 'A growing network of culturally competent postpartum care professionals nationwide.',
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-ada-navy via-ada-navy/95 to-ada-navy" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <ScrollAnimate animation="fade-up">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              About Us
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              The Asian Doula Alliance is a 501(c)(3) non-profit organization
              setting the standard in culturally integrated postpartum care.
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollAnimate animation="fade-right">
              <div>
                <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy">
                  Who We Are
                </h2>
                <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
                  Founded with a deep commitment to maternal health equity, the Asian Doula
                  Alliance was created to address the growing need for culturally competent
                  postpartum care within Asian communities across the United States.
                </p>
                <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                  We recognized that new mothers from Asian backgrounds often navigate
                  postpartum recovery between two worlds — traditional practices passed down
                  through generations and modern Western medical recommendations. Our
                  certification program uniquely bridges these approaches, training doulas who
                  can honor cultural traditions while providing evidence-based support.
                </p>
                <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
                  Today, ADA is the leading certification body for culturally integrated
                  postpartum doula care, with over 164 certified professionals serving
                  families in their preferred language and cultural context.
                </p>
              </div>
            </ScrollAnimate>
            <ScrollAnimate animation="fade-left" delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-ada-purple/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-ada-purple" />
                    </div>
                    <h3 className="mt-3 font-poppins text-sm font-bold text-ada-navy">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-ada-navy/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollAnimate>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy">
              Our Story
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
              The Asian Doula Alliance began when a group of experienced doulas and
              maternal health advocates noticed a critical gap: families seeking
              postpartum care that respected their cultural practices had few options.
              Existing certification programs, while valuable, did not address the
              specific needs of Asian communities — from zuo yuezi (sitting the month)
              traditions to multilingual communication needs.
            </p>
            <p className="mt-4 text-lg text-ada-navy/70 leading-relaxed">
              What started as a small training initiative in Irvine, California has
              grown into a nationally recognized certification program with doulas
              serving families across major metropolitan areas including Los Angeles,
              the Bay Area, Seattle, New York City, and Chicago.
            </p>
          </ScrollAnimate>
          <ScrollAnimate delay={200}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/about-us/history"
                className="inline-flex items-center px-6 py-3 bg-ada-purple text-white font-semibold rounded-lg hover:bg-ada-purple-accent transition-colors"
              >
                View Our History
              </Link>
              <Link
                href="/about-us/mission-value"
                className="inline-flex items-center px-6 py-3 border-2 border-ada-purple text-ada-purple font-semibold rounded-lg hover:bg-ada-purple hover:text-white transition-colors"
              >
                Mission &amp; Values
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollAnimate>
            <div className="text-center mb-14">
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-ada-navy">
                Our Team
              </h2>
              <p className="mt-4 text-lg text-ada-navy/70 max-w-2xl mx-auto">
                Dedicated professionals committed to advancing culturally competent
                postpartum care across the nation.
              </p>
            </div>
          </ScrollAnimate>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <ScrollAnimate key={member.name} delay={i * 100}>
                <TeamCard
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                />
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
