import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';
import { ShieldCheck, ShieldAlert, ShieldX, Search, ArrowLeft } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function VerifyResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: cert } = await supabase
    .from('certificates')
    .select('*, doulas(full_name, full_name_zh, status)')
    .eq('verification_code', code)
    .single();

  // ============ NOT FOUND ============
  if (!cert) {
    return (
      <>
        <section className="bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
          }} />
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5">
              <ShieldX className="w-8 h-8 text-white/40" />
            </div>
            <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
              Certificate Not Found
            </h1>
            <p className="mt-4 text-white/40 font-outfit max-w-md mx-auto leading-relaxed">
              The verification code &ldquo;{code}&rdquo; does not match any
              certificate in the ADA registry.
            </p>
            <Link
              href="/verify"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-5 py-2.5 text-sm font-outfit font-medium hover:bg-white/20 transition-colors"
            >
              <Search className="w-4 h-4" /> Try Again
            </Link>
          </div>
        </section>
      </>
    );
  }

  // ============ FOUND ============
  const doula = cert.doulas as Record<string, string>;
  const isRevoked = cert.status === 'revoked';
  const isActive = !isRevoked && doula.status === 'certified_active';
  const isExpired = !isRevoked && doula.status === 'expired';

  const statusIcon = isActive
    ? <ShieldCheck className="w-10 h-10 text-emerald-400" />
    : isExpired
    ? <ShieldAlert className="w-10 h-10 text-amber-400" />
    : <ShieldX className="w-10 h-10 text-red-400" />;

  const statusLabel = isRevoked
    ? 'CERTIFICATE REVOKED'
    : isActive
    ? 'VERIFIED — ACTIVE'
    : isExpired
    ? 'VERIFIED — EXPIRED'
    : doula.status.replace(/_/g, ' ').toUpperCase();

  const statusBannerColor = isActive
    ? 'bg-emerald-600'
    : isExpired
    ? 'bg-amber-600'
    : 'bg-red-600';

  return (
    <>
      {/* Dark banner header */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/ada-logo-white.svg" alt="ADA" width={32} height={32} />
            <div className="h-5 w-px bg-white/20" />
            <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-white/40">
              Official Verification Record
            </span>
          </div>
          <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
            Certificate Verification
          </h1>
        </div>
      </section>

      {/* Status banner */}
      <div className={`${statusBannerColor} py-4`}>
        <div className="max-w-[1000px] mx-auto px-6 flex items-center justify-center gap-3">
          {statusIcon}
          <span className="font-outfit font-bold text-white tracking-wide text-sm md:text-base">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Credential details */}
      <section className="py-16 bg-white">
        <div className="max-w-[640px] mx-auto px-6">
          {/* Certificate card */}
          <div className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="bg-ada-navy/[0.03] px-8 py-5 border-b border-ada-navy/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ada-purple/10 flex items-center justify-center">
                  <Image src="/images/ada-logo-white.svg" alt="ADA" width={20} height={20} className="opacity-50" />
                </div>
                <div>
                  <p className="font-outfit text-xs text-ada-navy/40 uppercase tracking-wider font-semibold">
                    Asian Doula Alliance
                  </p>
                  <p className="font-outfit text-sm text-ada-navy font-semibold">
                    {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]} Certification
                  </p>
                </div>
              </div>
            </div>

            {/* Data rows */}
            <div className="divide-y divide-ada-navy/5">
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Holder</span>
                <span className="text-sm font-outfit font-semibold text-ada-navy">
                  {doula.full_name}
                  {doula.full_name_zh && (
                    <span className="text-ada-navy/40 font-normal ml-2">({doula.full_name_zh})</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Certificate Number</span>
                <span className="text-sm font-mono text-ada-navy">{cert.certificate_number}</span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Credential Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-outfit font-semibold ${
                  isActive ? 'bg-emerald-50 text-emerald-700' :
                  isExpired ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : isExpired ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {isActive ? 'Active' : isExpired ? 'Expired' : isRevoked ? 'Revoked' : doula.status}
                </span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Date Issued</span>
                <span className="text-sm font-outfit text-ada-navy">{formatDate(cert.issued_date)}</span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Valid Through</span>
                <span className="text-sm font-outfit text-ada-navy">{formatDate(cert.expiration_date)}</span>
              </div>
            </div>

            {/* Card footer */}
            <div className="bg-ada-navy/[0.03] px-8 py-4 border-t border-ada-navy/10">
              <p className="text-xs text-ada-navy/30 font-outfit text-center">
                This record was retrieved from the Asian Doula Alliance official certification registry.
                <br />
                Verification records are retrieved in real-time from the ADA registry.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 text-sm text-ada-navy/50 font-outfit hover:text-ada-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Verify Another Certificate
            </Link>
            <Link
              href="/support/contact"
              className="text-sm text-ada-purple font-outfit hover:underline"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
