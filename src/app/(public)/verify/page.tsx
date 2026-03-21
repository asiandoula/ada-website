'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
            Verify a Doula&apos;s Certification
          </h1>
          <p className="mt-4 text-lg text-ada-navy/60 max-w-2xl mx-auto leading-relaxed">
            Confirm that a doula holds a valid ADA certification. Enter the
            verification code found on their certificate.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ada-navy/30" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-ada-purple text-white font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
            >
              Verify
            </button>
          </form>
          <p className="mt-3 text-sm text-ada-navy/40 font-outfit text-center">
            The verification code is printed on the doula&apos;s certification certificate.
          </p>
        </div>
      </section>

      {/* What is ADA Certification */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-dm-serif text-3xl text-ada-navy">
              What is ADA Certification?
            </h2>
            <p className="mt-3 text-ada-navy/60 max-w-2xl mx-auto leading-relaxed">
              The Asian Doula Alliance certifies postpartum doulas through
              rigorous training and examination, ensuring families receive
              culturally competent, evidence-based care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                Why Verify?
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed">
                Verification confirms that a doula has completed ADA&apos;s certified
                training program and passed both written and practical exams.
                It protects families by ensuring their caregiver meets
                professional standards.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                Who Can Use This?
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed">
                Anyone can verify a doula&apos;s certification — expectant parents,
                insurance companies, healthcare providers, or doula agencies.
                No account or login required.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                Insurance Partners
              </h3>
              <p className="text-sm text-ada-navy/60 leading-relaxed">
                ADA certification is recognized by Medi-Cal, Kaiser, Cigna,
                IEHP, Carrot Fertility, and Progyny. Verified doulas may
                be eligible for insurance reimbursement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl text-ada-navy text-center mb-10">
            How It Works
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { num: '1', text: 'Ask the doula for their ADA certification certificate or verification code.' },
              { num: '2', text: 'Enter the verification code in the search box above.' },
              { num: '3', text: 'View the doula\'s certification status, type, and validity dates.' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-ada-purple flex items-center justify-center text-white font-outfit font-bold text-sm shrink-0">
                  {step.num}
                </div>
                <p className="text-ada-navy/70 leading-relaxed font-outfit pt-1">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#fafafa]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-ada-navy/50 font-outfit">
            Are you a certified doula?{' '}
            <a href="/portal" className="text-ada-purple hover:underline">
              Access your portal &rarr;
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
