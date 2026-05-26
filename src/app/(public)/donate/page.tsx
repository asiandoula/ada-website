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

// Donorbox campaign slug — public value, safe to hardcode.
// Live: https://donorbox.org/general-fund-938446
// To restyle the widget's blue header / button to ADA's brand purple,
// log into donorbox.org, open this campaign, and set the primary color
// to #6969C1 in the campaign's Customize settings. URL params can't do
// this on the free plan.
const DONORBOX_CAMPAIGN = 'general-fund-938446';

const fundedPrograms = [
  {
    title: 'Doula training scholarships',
    body: 'Need-based grants that cover ADA-approved training program fees for first-generation caregivers and doulas from underserved Asian communities.',
  },
  {
    title: 'Multilingual certification access',
    body: 'Development and maintenance of certification exams in English, Mandarin, Cantonese, Japanese, and Korean — removing language barriers to professional credentialing.',
  },
  {
    title: 'Culturally integrated curriculum',
    body: 'Research, translation, and authoring of postpartum care curriculum that pairs evidence-based clinical practice with traditional Asian postpartum traditions.',
  },
  {
    title: 'Community verification registry',
    body: "A free public registry that lets families and insurance providers verify a doula's ADA credential — protecting families from unqualified providers.",
  },
];

const moreWaysToGive = [
  {
    title: 'Donor-Advised Funds',
    body: 'Recommend a grant to Asian Doula Alliance through your DAF (Fidelity Charitable, Schwab Charitable, Vanguard Charitable, and others). Use our EIN 93-3935047 to direct your gift.',
    cta: 'See tax details',
    href: '#tax-info',
    internal: true,
  },
  {
    title: 'Employer matching',
    body: "Many employers match charitable contributions dollar-for-dollar. Check with your HR team and double your impact — we'll handle any verification forms your employer requires.",
    cta: 'Email finance@asiandoula.org',
    href: 'mailto:finance@asiandoula.org?subject=Employer%20Match%20Question',
    internal: false,
  },
  {
    title: 'Planned giving',
    body: 'Include ADA in your estate plan, name us as a beneficiary of a retirement account or life insurance policy, or contribute appreciated securities.',
    cta: 'Start a conversation',
    href: 'mailto:finance@asiandoula.org?subject=Planned%20Giving%20Inquiry',
    internal: false,
  },
];

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-ada-purple">
        {children}
      </h2>
      <div className="mt-2 mb-8 h-px w-12 bg-ada-pink/30" />
    </>
  );
}

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

      {/* Hero — match the board-page H1 pattern */}
      <section className="bg-ada-cream pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-[640px] mx-auto px-6">
          <h1 className="font-dm-serif text-3xl md:text-4xl lg:text-5xl text-ada-navy leading-[1.1]">
            Support our work
          </h1>
          <div
            className="mt-5 h-[2px] w-16 bg-ada-pink/50 rounded-full"
            aria-hidden="true"
          />
          <p className="mt-8 text-ada-navy/75 leading-[1.8] text-[16px] md:text-[17px]">
            Asian Doula Alliance is a 501(c)(3) nonprofit. Every gift directly
            funds scholarships, multilingual education, and the only
            culturally integrated postpartum doula certification in the
            United States.
          </p>
        </div>
      </section>

      {/* Make your gift — Donorbox embed + legal info, no white card */}
      <section className="bg-ada-cream py-14 md:py-16 border-t border-ada-navy/10">
        <div className="max-w-[960px] mx-auto px-6">
          <SectionHeader>Make your gift</SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-14 items-start">
            <div>
              <p className="text-ada-navy/75 leading-[1.8] text-[14px] md:text-[15px]">
                One-time or recurring gifts in any amount are welcome. All
                donations are tax-deductible to the fullest extent permitted
                by U.S. law. You will receive an emailed receipt with our
                legal name, EIN, and the deductible portion of your
                contribution.
              </p>
              <dl className="mt-8 space-y-3 text-[13px]">
                <div className="flex items-baseline gap-3">
                  <dt className="text-ada-navy/40 font-outfit uppercase tracking-[0.18em] text-[10px] shrink-0 w-20">
                    Legal name
                  </dt>
                  <dd className="text-ada-navy/80">Asian Doula Alliance</dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt className="text-ada-navy/40 font-outfit uppercase tracking-[0.18em] text-[10px] shrink-0 w-20">
                    EIN
                  </dt>
                  <dd className="text-ada-navy/80 font-mono">93-3935047</dd>
                </div>
                <div className="flex items-baseline gap-3">
                  <dt className="text-ada-navy/40 font-outfit uppercase tracking-[0.18em] text-[10px] shrink-0 w-20">
                    Status
                  </dt>
                  <dd className="text-ada-navy/80">
                    501(c)(3) public charity, California
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-center md:justify-start">
              <iframe
                title="Donate to Asian Doula Alliance"
                src={`https://donorbox.org/embed/${DONORBOX_CAMPAIGN}?default_interval=o&default_amount=50&hide_donation_meter=true&primary_color=6969C1`}
                name="donorbox"
                allow="payment"
                seamless
                frameBorder="0"
                scrolling="no"
                height="560px"
                width="100%"
                style={{
                  maxWidth: '480px',
                  minWidth: '250px',
                  maxHeight: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why your gift matters — programs list, no boxed cards */}
      <section className="bg-ada-cream py-14 md:py-16 border-t border-ada-navy/10">
        <div className="max-w-[960px] mx-auto px-6">
          <SectionHeader>Why your gift matters</SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-14">
            <div>
              <p className="text-ada-navy/75 leading-[1.8] text-[14px] md:text-[15px]">
                For too many Asian families in the U.S., postpartum care has
                been shaped by language barriers, cultural mismatch, and a
                lack of vetted professionals. More than half of our certified
                doulas trained on a scholarship — every dollar moves us
                closer to a future where every Asian family has access to
                safe, professional, culturally respectful postpartum care.
              </p>
            </div>

            <ol className="space-y-6">
              {fundedPrograms.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[32px_1fr] gap-4 items-baseline"
                >
                  <span className="font-dm-serif text-base text-ada-pink/70 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-dm-serif text-[16px] md:text-[17px] text-ada-navy leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-ada-navy/65 text-[13.5px] leading-[1.7]">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* More ways to give — 3 columns, hairlines instead of cards */}
      <section className="bg-ada-cream py-14 md:py-16 border-t border-ada-navy/10">
        <div className="max-w-[960px] mx-auto px-6">
          <SectionHeader>More ways to give</SectionHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0 md:gap-x-10 md:divide-x divide-ada-navy/10">
            {moreWaysToGive.map((w, i) => (
              <div
                key={w.title}
                className={i > 0 ? 'md:pl-10' : ''}
              >
                <h3 className="font-dm-serif text-[17px] md:text-[18px] text-ada-navy leading-tight">
                  {w.title}
                </h3>
                <p className="mt-3 text-ada-navy/65 text-[13.5px] leading-[1.7]">
                  {w.body}
                </p>
                {w.internal ? (
                  <Link
                    href={w.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-[12px] tracking-wide text-ada-purple hover:text-ada-purple-hover transition-colors"
                  >
                    {w.cta} <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <a
                    href={w.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-[12px] tracking-wide text-ada-purple hover:text-ada-purple-hover transition-colors"
                  >
                    {w.cta} <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tax-deductibility — typographic, no purple card */}
      <section
        id="tax-info"
        className="bg-ada-cream py-14 md:py-16 border-t border-ada-navy/10"
      >
        <div className="max-w-[640px] mx-auto px-6">
          <SectionHeader>Tax-deductibility</SectionHeader>
          <p className="text-ada-navy/75 leading-[1.8] text-[14px] md:text-[15px]">
            Asian Doula Alliance is a registered 501(c)(3) tax-exempt
            organization. Donations are deductible to the fullest extent
            permitted by U.S. law. Your tax receipt will be emailed shortly
            after your gift is processed.
          </p>
          <p className="mt-4 text-ada-navy/60 leading-[1.7] text-[13.5px]">
            For our IRS determination letter, audited financials, or annual
            program summaries, see our{' '}
            <Link
              href="/about-us/financials"
              className="text-ada-purple underline underline-offset-4 hover:text-ada-purple-hover"
            >
              Financials &amp; Accountability
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      {/* Other ways to support — quiet line of link chips */}
      <section className="bg-ada-cream py-14 md:py-16 border-t border-ada-navy/10">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <p className="font-dm-serif italic text-ada-navy/70 text-base md:text-lg leading-relaxed">
            Not in a position to give financially? You can still help.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/about-us/board/election"
              className="text-[13px] text-ada-purple hover:text-ada-purple-hover underline underline-offset-4 transition-colors"
            >
              Volunteer on the board
            </Link>
            <Link
              href="/for-families/find-a-doula"
              className="text-[13px] text-ada-purple hover:text-ada-purple-hover underline underline-offset-4 transition-colors"
            >
              Hire a certified doula
            </Link>
            <Link
              href="/articles"
              className="text-[13px] text-ada-purple hover:text-ada-purple-hover underline underline-offset-4 transition-colors"
            >
              Share our mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
