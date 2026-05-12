import { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Donate | Support Asian Doula Alliance',
  description:
    'Support the Asian Doula Alliance, a 501(c)(3) nonprofit that funds scholarships, multilingual training, and certification access for underserved Asian doulas across the United States.',
  openGraph: {
    title: 'Donate to Asian Doula Alliance',
    description:
      'Your gift funds scholarships, multilingual certification, and culturally integrated postpartum education.',
    url: 'https://asiandoula.org/donate',
  },
};

const fundedPrograms = [
  {
    title: 'Doula Training Scholarships',
    body: 'Need-based grants that cover ADA-approved training program fees for first-generation caregivers and doulas from underserved Asian communities.',
  },
  {
    title: 'Multilingual Certification Access',
    body: 'Development and maintenance of certification exams in English, Mandarin, Cantonese, Japanese, and Korean — removing language barriers to professional credentialing.',
  },
  {
    title: 'Culturally Integrated Curriculum',
    body: 'Research, translation, and authoring of postpartum care curriculum that pairs evidence-based clinical practice with traditional Asian postpartum traditions.',
  },
  {
    title: 'Community Verification Registry',
    body: 'A free public registry that lets families and insurance providers verify a doula\'s ADA credential — protecting families from unqualified providers.',
  },
];

const waysToGive = [
  {
    title: 'Online Gift',
    body: 'One-time or recurring gifts by credit card or bank transfer through our secure donation page.',
    cta: 'Give online',
    href: 'mailto:donate@asiandoula.org?subject=Online%20Donation%20Inquiry',
    note: 'A secure online giving portal is being set up. In the meantime, please email us and we will send a direct link.',
  },
  {
    title: 'Donor-Advised Funds',
    body: 'Recommend a grant to Asian Doula Alliance through your donor-advised fund. Use our EIN to direct your gift.',
    cta: 'See our EIN',
    href: '#tax-info',
  },
  {
    title: 'Employer Matching',
    body: 'Many employers match charitable contributions dollar-for-dollar. Check with your HR team and double your impact.',
    cta: 'Contact us for help',
    href: 'mailto:donate@asiandoula.org?subject=Employer%20Match%20Question',
  },
];

export default function DonatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([{ name: 'Donate', path: '/donate' }])
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Support our mission
          </span>
          <h1 className="mt-4 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Help build the future of Asian postpartum care
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Asian Doula Alliance is a 501(c)(3) nonprofit. Every gift directly funds
            scholarships, multilingual education, and the only culturally integrated
            postpartum doula certification in the United States.
          </p>
        </div>
      </section>

      {/* Why your gift matters */}
      <section className="bg-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div>
              <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
                Why your gift matters
              </h2>
              <p className="mt-4 text-ada-navy/60 leading-relaxed">
                For too many Asian families in the U.S., postpartum care has
                been shaped by language barriers, cultural mismatch, and lack of
                vetted professionals. ADA exists to change that — and we cannot
                do it without community support.
              </p>
              <p className="mt-4 text-ada-navy/60 leading-relaxed">
                More than half of our certified doulas trained on a scholarship.
                Every dollar you give moves us closer to a future where every
                Asian family has access to safe, professional, culturally
                respectful postpartum care.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {fundedPrograms.map((p) => (
                <div
                  key={p.title}
                  className="bg-ada-off-white rounded-2xl p-6 border border-ada-navy/5"
                >
                  <h3 className="font-outfit font-semibold text-ada-navy">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-ada-navy/60 text-sm leading-relaxed">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ways to give */}
      <section className="bg-ada-off-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl md:text-4xl text-ada-navy">
              Ways to give
            </h2>
            <p className="mt-2 text-ada-navy/60 max-w-2xl mx-auto">
              Choose the option that works for you. All donations are tax-deductible
              to the fullest extent allowed by law.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {waysToGive.map((w) => (
              <div
                key={w.title}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-300 flex flex-col"
              >
                <h3 className="font-dm-serif text-xl text-ada-navy">{w.title}</h3>
                <p className="mt-3 text-ada-navy/60 text-sm leading-relaxed flex-1">
                  {w.body}
                </p>
                {w.note && (
                  <p className="mt-3 text-ada-navy/40 text-xs italic leading-relaxed">
                    {w.note}
                  </p>
                )}
                <Link
                  href={w.href}
                  className="mt-4 inline-flex items-center gap-2 text-ada-purple text-sm font-medium hover:text-ada-purple-hover transition-colors"
                >
                  {w.cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax-deductibility */}
      <section className="bg-white py-20">
        <div className="max-w-[800px] mx-auto px-6">
          <div
            id="tax-info"
            className="bg-ada-purple/5 border border-ada-purple/20 rounded-2xl p-8"
          >
            <h2 className="font-dm-serif text-2xl text-ada-navy mb-4">
              Tax-deductibility &amp; EIN
            </h2>
            <p className="text-ada-navy/60 leading-relaxed">
              Asian Doula Alliance is a registered 501(c)(3) tax-exempt
              organization. Donations are deductible to the fullest extent
              permitted by U.S. law.
            </p>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                  Legal name
                </dt>
                <dd className="text-ada-navy font-medium mt-1">Asian Doula Alliance</dd>
              </div>
              <div>
                <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                  EIN
                </dt>
                <dd className="text-ada-navy font-mono mt-1">88-XXXXXXX</dd>
              </div>
              <div>
                <dt className="text-ada-navy/50 font-outfit uppercase tracking-wider text-xs">
                  IRS classification
                </dt>
                <dd className="text-ada-navy mt-1">
                  501(c)(3) public charity, California
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-ada-navy/50 text-xs leading-relaxed">
              Your tax receipt will be emailed shortly after your gift is
              processed. For Form 990, IRS determination letter, or annual
              financial summaries, please see our{' '}
              <Link
                href="/about-us/financials"
                className="underline hover:text-ada-purple"
              >
                Financials &amp; Accountability
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </section>

      {/* Other ways to support */}
      <section className="bg-ada-off-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy">
            Other ways to support ADA
          </h2>
          <p className="mt-3 text-ada-navy/60 max-w-2xl mx-auto leading-relaxed">
            Not in a position to give financially? You can still help us grow
            the certified Asian doula workforce.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/about-us/board/election"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-ada-navy/10 text-ada-navy text-sm font-medium hover:border-ada-purple hover:text-ada-purple transition-colors"
            >
              Volunteer on the Board
            </Link>
            <Link
              href="/for-families/find-a-doula"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-ada-navy/10 text-ada-navy text-sm font-medium hover:border-ada-purple hover:text-ada-purple transition-colors"
            >
              Hire a Certified Doula
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-white border border-ada-navy/10 text-ada-navy text-sm font-medium hover:border-ada-purple hover:text-ada-purple transition-colors"
            >
              Share Our Mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
