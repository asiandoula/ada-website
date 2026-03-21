'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle, Users, Building } from 'lucide-react';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Verification
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl lg:text-6xl text-ada-navy">
            Verify a Doula&apos;s Certification
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ada-navy/60 max-w-3xl mx-auto leading-relaxed">
            Confirm that a doula holds a valid ADA certification. Enter the
            verification code found on their certificate.
          </p>
        </div>
      </section>

      {/* Search + Content */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Main content */}
            <div className="lg:w-4/5 space-y-16">
              {/* Search box */}
              <div className="max-w-lg">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ada-navy/30" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter verification code"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-ada-navy font-outfit focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 px-6 py-3 rounded-full bg-ada-purple text-white font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
                  >
                    Verify
                  </button>
                </form>
                <p className="mt-3 text-sm text-ada-navy/40 font-outfit">
                  The verification code is printed on the doula&apos;s certification certificate.
                </p>
              </div>

              {/* What is ADA Certification */}
              <div>
                <h2 className="font-dm-serif text-2xl text-ada-navy mb-6">
                  What is ADA Certification?
                </h2>
                <p className="text-ada-navy/60 leading-relaxed mb-8">
                  The Asian Doula Alliance certifies postpartum doulas through rigorous training
                  and examination, ensuring families receive culturally competent, evidence-based care.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#fafafa] rounded-xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                      Why Verify?
                    </h3>
                    <p className="text-sm text-ada-navy/60 leading-relaxed">
                      Verification confirms that a doula has completed ADA&apos;s certified
                      training program and passed both written and practical exams.
                    </p>
                  </div>

                  <div className="bg-[#fafafa] rounded-xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                      Who Can Use This?
                    </h3>
                    <p className="text-sm text-ada-navy/60 leading-relaxed">
                      Anyone — expectant parents, insurance companies, healthcare providers,
                      or doula agencies. No account or login required.
                    </p>
                  </div>

                  <div className="bg-[#fafafa] rounded-xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                      <Building className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                      Insurance Partners
                    </h3>
                    <p className="text-sm text-ada-navy/60 leading-relaxed">
                      ADA certification is recognized by Medi-Cal, Kaiser, Cigna,
                      IEHP, Carrot Fertility, and Progyny.
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="space-y-8">
                <h2 className="font-dm-serif text-2xl text-ada-navy">How It Works</h2>
                {[
                  { num: '01', text: 'Ask the doula for their ADA certification certificate or verification code.' },
                  { num: '02', text: 'Enter the verification code in the search box above.' },
                  { num: '03', text: 'View the doula\'s certification status, type, and validity dates.' },
                ].map((step) => (
                  <div key={step.num} className="flex gap-6">
                    <span className="text-2xl font-semibold text-ada-purple/30 font-outfit shrink-0">
                      {step.num}
                    </span>
                    <p className="text-ada-navy/60 leading-relaxed font-outfit pt-1">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="bg-[#fafafa] rounded-2xl p-10 text-center">
                <h2 className="font-dm-serif text-2xl text-ada-navy">
                  Are you a certified doula?
                </h2>
                <p className="mt-3 text-ada-navy/60 leading-relaxed">
                  Access your portal to view credentials, download certificates, and check exam results.
                </p>
                <Link
                  href="/portal"
                  className="mt-6 inline-flex items-center rounded-full bg-ada-purple text-white px-6 py-2.5 text-sm font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
                >
                  My Portal &rarr;
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <div className="lg:sticky lg:top-32">
                <span className="font-outfit text-xs font-semibold tracking-widest uppercase text-ada-navy/40">
                  Verification
                </span>
                <nav className="mt-4 flex flex-col">
                  <Link href="/portal" className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors font-outfit">
                    Doula Portal
                  </Link>
                  <Link href="/certifications" className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors font-outfit">
                    Certifications
                  </Link>
                  <Link href="/support/contact" className="block py-1.5 text-sm text-ada-navy/60 hover:text-ada-purple transition-colors font-outfit">
                    Contact Us
                  </Link>
                </nav>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
