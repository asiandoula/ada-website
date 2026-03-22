'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, BadgeCheck, BookOpen, Scale, GraduationCap, Loader2 } from 'lucide-react';

interface NameResult {
  doula: {
    full_name: string;
    full_name_zh?: string;
    doula_id_code: string;
    status: string;
  };
  certificates: {
    verification_code: string;
    certificate_number: string;
    certificate_type: string;
  }[];
}

export default function VerifyPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameResults, setNameResults] = useState<NameResult[] | null>(null);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setNameResults(null);
    setNoResults(false);

    try {
      const res = await fetch(`/api/verify/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.type === 'name') {
        // Name search — show results list or no results
        if (data.results.length === 0) {
          setNoResults(true);
        } else if (data.results.length === 1 && data.results[0].certificates.length === 1) {
          // Single match — go directly to result page
          router.push(`/verify/${data.results[0].certificates[0].verification_code}`);
          return;
        } else {
          setNameResults(data.results);
        }
      } else {
        // ID/cert/verification code search — direct result or not found
        if (data.results.length === 0) {
          setNoResults(true);
        } else if (data.results.length === 1) {
          router.push(`/verify/${data.results[0].verification_code}`);
          return;
        }
      }
    } catch {
      setNoResults(true);
    }

    setLoading(false);
  }

  const statusLabel: Record<string, { text: string; color: string }> = {
    certified_active: { text: 'Active', color: 'bg-emerald-50 text-emerald-700' },
    expired: { text: 'Expired', color: 'bg-amber-50 text-amber-700' },
    revoked: { text: 'Revoked', color: 'bg-red-50 text-red-700' },
    under_investigation: { text: 'Under Review', color: 'bg-gray-100 text-gray-600' },
    exam_failed: { text: 'Not Certified', color: 'bg-red-50 text-red-700' },
  };

  return (
    <>
      {/* Dark navy banner — institutional header */}
      <section className="bg-ada-navy pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          {/* Seal / emblem */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
              <Image
                src="/images/ada-logo-white.svg"
                alt="ADA Seal"
                width={44}
                height={44}
              />
            </div>
          </div>
          <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-white/50 mb-3">
            Asian Doula Alliance
          </p>
          <h1 className="font-dm-serif text-4xl md:text-5xl text-white">
            Credential Verification
          </h1>
          <p className="mt-5 text-base text-white/50 font-outfit max-w-lg mx-auto leading-relaxed">
            Verify the certification status of any ADA-credentialed doula.
            This is an official verification service.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ada-navy/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setNoResults(false); setNameResults(null); }}
                  placeholder="Name, Doula ID, or Certificate Number"
                  required
                  aria-label="Search by name, Doula ID, or certificate number"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 bg-white text-ada-navy font-outfit text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-ada-purple/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 px-6 py-3.5 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-sm hover:bg-ada-purple-hover transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
              </button>
            </div>
            <p className="mt-4 text-xs text-white/50 font-outfit">
              Search by doula name, Doula ID (e.g. #25-311), or certificate number (e.g. ADA-PD-0001)
            </p>
          </form>

          {/* No results */}
          {noResults && (
            <div className="mt-6 max-w-md mx-auto bg-white/10 rounded-xl p-5">
              <p className="text-white/70 font-outfit text-sm">
                No matching records found for &ldquo;{query}&rdquo;.
                Please check the spelling or try a different search term.
              </p>
            </div>
          )}

          {/* Name search results — multiple matches */}
          {nameResults && nameResults.length > 0 && (
            <div className="mt-6 max-w-md mx-auto">
              <p className="text-white/60 font-outfit text-sm mb-3">
                {nameResults.length} doula{nameResults.length > 1 ? 's' : ''} found — select to view details:
              </p>
              <div className="space-y-2">
                {nameResults.map((r) => {
                  const st = statusLabel[r.doula.status] || { text: r.doula.status, color: 'bg-gray-100 text-gray-600' };
                  const cert = r.certificates[0];
                  return (
                    <button
                      key={r.doula.doula_id_code}
                      onClick={() => {
                        if (cert) {
                          router.push(`/verify/${cert.verification_code}`);
                        }
                      }}
                      disabled={!cert}
                      className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div>
                        <p className="font-outfit font-semibold text-ada-navy text-sm">
                          {r.doula.full_name}
                          {r.doula.full_name_zh && (
                            <span className="text-ada-navy/40 font-normal ml-1.5">({r.doula.full_name_zh})</span>
                          )}
                        </p>
                        <p className="text-xs text-ada-navy/40 font-outfit mt-0.5">
                          {r.doula.doula_id_code}
                          {cert && <span className="ml-2">·  {cert.certificate_number}</span>}
                        </p>
                      </div>
                      <span className={`shrink-0 ml-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-outfit font-semibold ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          r.doula.status === 'certified_active' ? 'bg-emerald-500' :
                          r.doula.status === 'expired' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        {st.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust bar — partner logos */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <span className="text-xs text-gray-400 font-outfit uppercase tracking-wider shrink-0">
              Recognized by
            </span>
            {['Medi-Cal', 'Kaiser', 'Cigna', 'Carrot Fertility', 'Progyny', 'IEHP'].map((name) => (
              <span key={name} className="text-sm font-outfit text-gray-500 font-medium">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Three-column info */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-dm-serif text-3xl text-ada-navy">
              About ADA Certification
            </h2>
            <p className="mt-3 text-ada-navy/50 font-outfit max-w-2xl mx-auto">
              The Asian Doula Alliance maintains rigorous standards for postpartum doula certification,
              ensuring families receive culturally competent, evidence-based care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-ada-navy/5 flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="w-7 h-7 text-ada-navy/60" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                Why Verify
              </h3>
              <p className="text-sm text-ada-navy/50 font-outfit leading-relaxed">
                Confirms the doula has completed ADA&apos;s accredited training program
                and passed both written and practical certification exams under supervised conditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-ada-navy/5 flex items-center justify-center mx-auto mb-5">
                <BadgeCheck className="w-7 h-7 text-ada-navy/60" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                What You&apos;ll See
              </h3>
              <p className="text-sm text-ada-navy/50 font-outfit leading-relaxed">
                Full credential details including certification type, current status,
                date issued, and validity period. All information is verified in real-time
                against our registry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-ada-navy/5 flex items-center justify-center mx-auto mb-5">
                <Scale className="w-7 h-7 text-ada-navy/60" />
              </div>
              <h3 className="font-outfit font-semibold text-ada-navy mb-2">
                Open to Everyone
              </h3>
              <p className="text-sm text-ada-navy/50 font-outfit leading-relaxed">
                This service is available to expectant parents, insurance providers,
                healthcare facilities, and doula agencies. No registration required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — numbered steps */}
      <section className="py-20 bg-ada-cream">
        <div className="max-w-[1000px] mx-auto px-6">
          <h2 className="font-dm-serif text-3xl text-ada-navy text-center mb-14">
            Verification Process
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-2 bottom-2 w-px bg-ada-purple/15" />
              <div className="space-y-10">
                {[
                  { title: 'Search', text: 'Enter the doula\'s name, Doula ID (e.g. #25-311), or certificate number in the search field above.', icon: Search },
                  { title: 'Select', text: 'If multiple results are found, select the correct doula from the list to view their credential details.', icon: BookOpen },
                  { title: 'Review', text: 'View the official verification record showing the doula\'s credential type, certification status, and validity dates.', icon: GraduationCap },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-ada-purple flex items-center justify-center text-white font-outfit font-bold text-sm shrink-0 shadow-md">
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-outfit font-semibold text-ada-navy mb-1">{step.title}</h3>
                      <p className="text-sm text-ada-navy/50 font-outfit leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification standards */}
      <section className="py-20 bg-white">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="bg-ada-navy rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
            }} />
            <div className="relative">
              <h2 className="font-dm-serif text-3xl text-white mb-4">
                ADA Certification Standards
              </h2>
              <p className="text-white/50 font-outfit max-w-xl mx-auto leading-relaxed mb-8">
                Our doulas complete a comprehensive program including classroom training,
                supervised practice, and dual examinations before earning their credential.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { num: '167+', label: 'Registered Doulas' },
                  { num: '4-5', label: 'Day Training' },
                  { num: '90', label: 'Min Exam Score' },
                  { num: '3yr', label: 'Validity Period' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-outfit text-2xl font-bold text-white">{stat.num}</p>
                    <p className="text-xs text-white/40 font-outfit mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ada-cream">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="font-dm-serif text-2xl text-ada-navy mb-3">
            Are you a certified doula?
          </h2>
          <p className="text-ada-navy/50 font-outfit mb-6">
            Access your credential portal to view records, download certificates, and check exam history.
          </p>
          <Link
            href="/portal"
            className="inline-flex items-center rounded-full bg-ada-purple text-white px-6 py-3 text-sm font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
          >
            Access Doula Portal &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
