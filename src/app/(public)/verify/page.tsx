'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, Clock, FileCheck } from 'lucide-react';

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
      {/* Hero — institutional, minimal */}
      <section className="bg-[#f7f8fa] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-200">
        <div className="max-w-[960px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/images/ada-logo-white.svg"
              alt="ADA"
              width={36}
              height={36}
              className="opacity-60"
            />
            <div className="h-6 w-px bg-gray-300" />
            <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Official Verification System
            </span>
          </div>
          <h1 className="font-outfit text-3xl md:text-4xl font-semibold text-ada-navy tracking-tight">
            Credential Verification
          </h1>
          <p className="mt-4 text-base text-gray-500 font-outfit max-w-xl mx-auto leading-relaxed">
            Verify that a doula holds a valid certification issued by the Asian Doula Alliance.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-lg mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 px-5 py-3 rounded-lg bg-ada-navy text-white font-outfit font-medium text-sm hover:bg-ada-navy/90 transition-colors"
              >
                Verify
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400 font-outfit">
              The verification code is printed on the doula&apos;s official ADA certificate.
            </p>
          </form>
        </div>
      </section>

      {/* Info sections */}
      <section className="py-16 bg-white">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
            <div className="bg-white p-8">
              <ShieldCheck className="w-6 h-6 text-ada-navy/70 mb-4" />
              <h3 className="font-outfit font-semibold text-ada-navy text-sm mb-2">
                Why Verify
              </h3>
              <p className="text-sm text-gray-500 font-outfit leading-relaxed">
                Confirms that a doula has completed ADA&apos;s accredited training
                and passed both written and practical certification exams.
              </p>
            </div>
            <div className="bg-white p-8">
              <FileCheck className="w-6 h-6 text-ada-navy/70 mb-4" />
              <h3 className="font-outfit font-semibold text-ada-navy text-sm mb-2">
                Who Can Verify
              </h3>
              <p className="text-sm text-gray-500 font-outfit leading-relaxed">
                Open to all — expectant parents, insurance providers, healthcare
                facilities, and doula agencies. No account required.
              </p>
            </div>
            <div className="bg-white p-8">
              <Clock className="w-6 h-6 text-ada-navy/70 mb-4" />
              <h3 className="font-outfit font-semibold text-ada-navy text-sm mb-2">
                What You&apos;ll See
              </h3>
              <p className="text-sm text-gray-500 font-outfit leading-relaxed">
                Certification type, status (active/expired/revoked),
                issue date, and validity period. Results are real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-[#f7f8fa] border-t border-gray-200">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-8">
            How to Verify
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', text: 'Request the verification code from the doula — it is printed on their ADA certificate.' },
              { num: '2', text: 'Enter the code in the search field above and click Verify.' },
              { num: '3', text: 'Review the official verification record showing credential status and validity.' },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ada-navy text-white text-xs font-outfit font-bold shrink-0">
                  {step.num}
                </span>
                <p className="text-sm text-gray-600 font-outfit leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance partners */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-[960px] mx-auto px-6">
          <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-2">
            Recognized by Insurance Partners
          </h2>
          <p className="text-sm text-gray-500 font-outfit mb-8">
            ADA certification is accepted by the following insurance providers for doula service reimbursement.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Medi-Cal', 'Kaiser Permanente', 'Cigna', 'IEHP', 'Carrot Fertility', 'Progyny'].map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-lg bg-[#f7f8fa] border border-gray-200 text-sm font-outfit text-ada-navy/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer links */}
      <section className="py-12 bg-[#f7f8fa] border-t border-gray-200">
        <div className="max-w-[960px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 font-outfit">
            Asian Doula Alliance — Official Credential Verification
          </p>
          <div className="flex gap-6">
            <Link href="/portal" className="text-sm text-ada-purple font-outfit hover:underline">
              Doula Portal
            </Link>
            <Link href="/support/contact" className="text-sm text-ada-purple font-outfit hover:underline">
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
