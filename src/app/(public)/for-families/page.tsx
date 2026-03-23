import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'For Families | Asian Doula Alliance',
  description:
    'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  openGraph: {
    title: 'For Families | Asian Doula Alliance',
    description:
      'Find trusted, culturally competent postpartum care for your family. Verify credentials, learn about training standards, and connect with ADA-certified doulas.',
  },
};

const cards = [
  {
    title: 'How We Train Our Doulas',
    description:
      'Learn about ADA\u2019s rigorous training and certification process \u2014 so you know exactly what our doulas bring to your home.',
    href: '/for-families/how-we-train',
    linkText: 'Learn More',
  },
  {
    title: 'Find a Doula',
    description:
      'Connect with an ADA-certified postpartum doula who speaks your language and understands your cultural needs.',
    href: '/for-families/find-a-doula',
    linkText: 'Find a Doula',
  },
  {
    title: 'Verify a Doula',
    description:
      'Check if your doula holds a current ADA certification using their name or certification number.',
    href: '/verify',
    linkText: 'Verify Now',
  },
];

const insurancePartners = [
  'Medi-Cal',
  'Kaiser',
  'Cigna',
  'IEHP',
  'Carrot Fertility',
  'Progyny',
];

export default function ForFamiliesPage() {
  return (
    <>
      {/* Section 1: Hero with image */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                For Families
              </span>
              <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
                Your Recovery Matters
              </h1>
              <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-xl leading-relaxed">
                Where modern postpartum care meets thousand-year Asian traditions
                &mdash; because no new parent should recover alone.
              </p>
            </div>
            <div className="lg:w-[520px] shrink-0">
              <Image
                src="/images/families/hero-recovery.webp"
                alt="A doula gently holding a newborn while the mother rests peacefully in bed"
                width={1920}
                height={1080}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="rounded-2xl object-cover w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Fourth Trimester */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            The Fourth Trimester
          </h2>
          <Image
            src="/images/families/fourth-trimester.webp"
            alt="A caregiver gently holding a new mother's hands in comfort"
            width={1600}
            height={1200}
            sizes="(max-width: 800px) 100vw, 800px"
            className="mt-8 rounded-2xl object-cover w-full"
            loading="lazy"
          />
          <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              You come home from the hospital. The car seat feels impossibly
              heavy. Your body aches in ways no one warned you about. The baby
              is crying, and you realize that all the preparation in the
              world &mdash; the nursery, the registry, the birth plan &mdash;
              didn&apos;t prepare you for this moment: the quiet overwhelm of
              being home, being responsible, being utterly exhausted.
            </p>
            <p>
              Your partner does their best. Your mother calls. Friends text
              congratulations. But between the midnight feedings and the
              uncertainty, you wonder: is this just how it is? Is this
              something I&apos;m supposed to figure out alone?
            </p>
            <p className="text-ada-navy font-medium">
              In Asian cultures, the answer has always been no. This isn&apos;t
              something you face alone. It never was.
            </p>
            <p>
              For thousands of years, Asian families have recognized that the
              weeks after birth are not just about the baby &mdash; they are
              about the mother. A dedicated period of rest, nourishment, and
              supported recovery. A time when the community gathers around the
              new parent, not to visit, but to serve. This is the tradition
              that doula care was built on. And it&apos;s the tradition that ADA
              brings into your home.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: A Tradition Older Than Modern Medicine */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            A Tradition Older Than Modern Medicine
          </h2>
          <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              Across Asia, postpartum recovery isn&apos;t a suggestion &mdash;
              it&apos;s a practice woven into the fabric of family life. The
              details vary by culture, but the core belief is the same: a
              mother who is well cared for will heal faster, bond more
              deeply, and raise a healthier child.
            </p>
          </div>

          <Image
            src="/images/families/zuoyuezi-food.webp"
            alt="Traditional Chinese postpartum recovery foods — red date ginger tea, herbal soups, goji berries"
            width={1600}
            height={1200}
            sizes="(max-width: 800px) 100vw, 800px"
            className="mt-10 rounded-2xl object-cover w-full"
            loading="lazy"
          />

          <div className="mt-12 space-y-10">
            {/* Chinese */}
            <div>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Chinese: Zuo Yuezi (坐月子)
              </h3>
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                &ldquo;Sitting the month&rdquo; &mdash; a practice spanning
                over 2,000 years. For 30 days after birth, the mother rests
                completely. She eats warming, restorative foods. She avoids
                cold water and wind. Her family manages the household so she
                can focus entirely on healing and her newborn. It is not
                pampering. It is medicine, passed down through generations.
              </p>
            </div>

            {/* Korean */}
            <div>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Korean: Sanhujori (산후조리)
              </h3>
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                Korea developed an entire infrastructure around postpartum
                care. Sanhujori centers &mdash; dedicated recovery facilities
                where mothers spend two to four weeks receiving professional
                support &mdash; are used by the majority of Korean families.
                The practice is so deeply valued that government subsidies help
                make it accessible to all income levels.
              </p>
            </div>

            {/* Japanese */}
            <div>
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Japanese: Satogaeri (里帰り)
              </h3>
              <p className="mt-3 text-ada-navy/70 leading-relaxed">
                In Japan, new mothers traditionally return to their own
                mother&apos;s home for the first month after birth. This
                practice, called satogaeri, ensures the new mother is
                surrounded by experienced care while she recovers. It
                recognizes what every culture once understood: recovery
                requires a village.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              Despite their differences, these traditions share the same core
              principles: complete rest, warm and nourishing food, protection
              from cold and overexertion, emotional support, and the
              understanding that a mother&apos;s recovery is not secondary
              &mdash; it is essential.
            </p>
            <p>
              Modern medicine is catching up. Researchers now call the weeks
              after birth the &ldquo;fourth trimester&rdquo; and recognize it
              as a critical period for maternal health. In the United States,
              roughly 1 in 7 mothers experience postpartum depression. Studies
              show that continuous doula support significantly reduces this
              risk, along with rates of birth complications and maternal
              anxiety. The science is confirming what Asian families have known
              for millennia: dedicated postpartum care isn&apos;t a luxury. It
              is a necessity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: What a Doula Actually Does */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[800px]">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              What a Doula Actually Does
            </h2>
            <p className="mt-6 text-lg text-ada-navy/70 leading-relaxed">
              Forget the vague promises of &ldquo;culturally competent
              care.&rdquo; Here is what an ADA-certified doula brings into your
              home, day by day.
            </p>
          </div>

          <Image
            src="/images/families/doula-newborn.webp"
            alt="A doula helping a father learn to care for his newborn"
            width={1600}
            height={1200}
            sizes="(max-width: 800px) 100vw, 800px"
            className="mt-10 rounded-2xl object-cover w-full max-w-[800px]"
            loading="lazy"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Recovery Meals */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Recovery Meals
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                Your doula prepares traditional postpartum meals designed to
                restore energy and promote healing: red date and ginger tea to
                warm the body, pork trotter vinegar soup for collagen and milk
                production, Korean seaweed soup rich in iron and calcium. Every
                meal is intentional &mdash; not just nutrition, but medicine
                rooted in generations of knowledge.
              </p>
            </div>

            {/* Newborn Care */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Newborn Care
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                Proper swaddling so your baby sleeps soundly. Gentle bathing
                techniques. Umbilical cord care. Establishing sleep routines
                that work for your family. Your doula handles the learning
                curve so you can rest and bond &mdash; without the anxiety of
                figuring it all out through late-night internet searches.
              </p>
            </div>

            {/* Mom's Recovery */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Mom&apos;s Physical Recovery
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                TCM-inspired postpartum care that supports your body&apos;s
                natural healing: belly binding to support abdominal recovery,
                herbal baths to soothe and restore, guidance on movement and
                rest. Your doula monitors your recovery and knows when
                something needs medical attention &mdash; often before you
                realize it yourself.
              </p>
            </div>

            {/* Emotional Support */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Emotional Support
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                The baby blues are common. Postpartum depression is real. Your
                doula is trained to recognize the early signs and to be the
                steady, calm presence you need during the most vulnerable weeks
                of your life. Someone who listens without judgment. Someone who
                has seen this before and can tell you, with certainty, that you
                are doing well.
              </p>
            </div>

            {/* Family Bridge */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Family Bridge
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                New babies bring joy &mdash; and tension. Your partner wants to
                help but doesn&apos;t know how. Your mother-in-law has strong
                opinions. Your own parents are far away. An ADA doula bridges
                these dynamics with cultural fluency: helping partners
                participate meaningfully, navigating generational expectations,
                and making sure everyone in the household feels included in the
                care.
              </p>
            </div>

            {/* Breastfeeding */}
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h3 className="font-dm-serif text-xl text-ada-navy">
                Breastfeeding Support
              </h3>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                Latching difficulties, supply concerns, pumping schedules
                &mdash; breastfeeding rarely comes as naturally as people
                expect. Your doula provides hands-on guidance through the early
                days, helping you find what works and connecting you with
                lactation specialists when needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Not Just for Asian Families */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Not Just for Asian Families
          </h2>
          <Image
            src="/images/families/diverse-mothers.webp"
            alt="Diverse group of mothers with their newborns, laughing and connecting together"
            width={1600}
            height={1201}
            sizes="(max-width: 800px) 100vw, 800px"
            className="mt-8 rounded-2xl object-cover w-full"
            loading="lazy"
          />
          <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              We hear this question often: &ldquo;Do I need to be Asian to
              benefit from an ADA-certified doula?&rdquo;
            </p>
            <p>
              The answer is no. The principles behind dedicated postpartum
              recovery &mdash; rest, nourishment, emotional support, expert
              newborn care &mdash; are universal. They belong to every family,
              regardless of background.
            </p>
            <p>
              ADA-certified doulas serve families of all ethnicities,
              languages, and cultural backgrounds. The Asian postpartum
              traditions that inform our training are the foundation, not the
              boundary. Our doulas bring the depth of these traditions to every
              family they serve, adapting their care to your specific needs,
              preferences, and household.
            </p>
            <p className="text-ada-navy font-medium">
              The tradition is the root. The care is for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Insurance & Coverage */}
      <section className="py-20 bg-white">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
            Insurance &amp; Coverage
          </h2>
          <div className="mt-8 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              Postpartum doula care is increasingly recognized by insurance
              providers. ADA-certified doulas are accepted by a growing number
              of major plans, which means your care may be partially or fully
              covered.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="font-dm-serif text-xl text-ada-navy">
              Our Insurance Partners
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {insurancePartners.map((partner) => (
                <span
                  key={partner}
                  className="inline-block bg-ada-off-white rounded-full px-5 py-2.5 text-sm font-medium text-ada-navy"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-ada-navy/70 leading-relaxed">
            <p>
              Doula services are also eligible for reimbursement through
              FSA (Flexible Spending Account) and HSA (Health Savings Account)
              funds. If you have an FSA or HSA, you can use it to pay for
              ADA-certified doula care.
            </p>
            <div className="bg-ada-off-white rounded-2xl p-8">
              <h4 className="font-dm-serif text-lg text-ada-navy">
                How to Check Your Coverage
              </h4>
              <ol className="mt-4 space-y-3 text-ada-navy/70 leading-relaxed list-decimal list-inside">
                <li>
                  Call the member services number on the back of your insurance
                  card.
                </li>
                <li>
                  Ask if your plan covers postpartum doula services.
                </li>
                <li>
                  Mention that your doula is certified by the Asian Doula
                  Alliance (ADA), a recognized credentialing body.
                </li>
                <li>
                  Ask about any pre-authorization requirements or visit limits.
                </li>
              </ol>
              <p className="mt-4 text-ada-navy/70 leading-relaxed">
                If you need help navigating insurance, our team can guide
                you. Reach out through the contact form below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Navigation Cards */}
      <section className="py-20 bg-ada-off-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="block bg-white rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
              >
                <h3 className="font-dm-serif text-xl text-ada-navy">
                  {card.title}
                </h3>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-6 inline-block text-ada-purple font-medium text-sm">
                  {card.linkText} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Contact */}
      <ContactForm />
    </>
  );
}
