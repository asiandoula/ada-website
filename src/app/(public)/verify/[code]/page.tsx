import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';
import { ShieldCheck, ShieldAlert, ShieldX, Search } from 'lucide-react';

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
        <section className="bg-[#f7f8fa] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-200">
          <div className="max-w-[960px] mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image src="/images/ada-logo-white.svg" alt="ADA" width={36} height={36} className="opacity-60" />
              <div className="h-6 w-px bg-gray-300" />
              <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                Verification Result
              </span>
            </div>
            <h1 className="font-outfit text-3xl md:text-4xl font-semibold text-ada-navy tracking-tight">
              Certificate Not Found
            </h1>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-md mx-auto px-6 text-center">
            <ShieldX className="w-12 h-12 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 font-outfit leading-relaxed">
              The verification code &ldquo;{code}&rdquo; does not match any certificate
              in the ADA registry. Please check the code and try again.
            </p>
            <Link
              href="/verify"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ada-navy text-white px-5 py-2.5 text-sm font-outfit font-medium hover:bg-ada-navy/90 transition-colors"
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
    ? <ShieldCheck className="w-10 h-10 text-emerald-600" />
    : isExpired
    ? <ShieldAlert className="w-10 h-10 text-amber-500" />
    : <ShieldX className="w-10 h-10 text-red-500" />;

  const statusLabel = isRevoked
    ? 'REVOKED'
    : isActive
    ? 'VERIFIED — ACTIVE'
    : isExpired
    ? 'VERIFIED — EXPIRED'
    : doula.status.replace(/_/g, ' ').toUpperCase();

  const statusColor = isActive
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : isExpired
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-700 border-red-200';

  return (
    <>
      {/* Header */}
      <section className="bg-[#f7f8fa] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-200">
        <div className="max-w-[960px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/images/ada-logo-white.svg" alt="ADA" width={36} height={36} className="opacity-60" />
            <div className="h-6 w-px bg-gray-300" />
            <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Official Verification Record
            </span>
          </div>
          <h1 className="font-outfit text-3xl md:text-4xl font-semibold text-ada-navy tracking-tight">
            Certificate Verification
          </h1>
        </div>
      </section>

      {/* Result */}
      <section className="py-16 bg-white">
        <div className="max-w-[580px] mx-auto px-6">
          {/* Status banner */}
          <div className={`flex items-center gap-4 p-5 rounded-xl border ${statusColor} mb-8`}>
            {statusIcon}
            <div>
              <p className="font-outfit font-bold text-sm tracking-wide">
                {statusLabel}
              </p>
              <p className="font-outfit text-xs opacity-70 mt-0.5">
                {isActive ? 'This credential is current and in good standing.' :
                 isExpired ? 'This credential has passed its validity period.' :
                 isRevoked ? 'This credential has been revoked by ADA.' :
                 'This credential is not currently active.'}
              </p>
            </div>
          </div>

          {/* Data table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm font-outfit">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3.5 text-gray-400 w-[140px]">Name</td>
                  <td className="px-5 py-3.5 text-ada-navy font-medium">
                    {doula.full_name}
                    {doula.full_name_zh && (
                      <span className="text-gray-400 ml-2">({doula.full_name_zh})</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3.5 text-gray-400">Certificate Type</td>
                  <td className="px-5 py-3.5 text-ada-navy font-medium">
                    {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3.5 text-gray-400">Certificate No.</td>
                  <td className="px-5 py-3.5 text-ada-navy font-mono text-xs">{cert.certificate_number}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-5 py-3.5 text-gray-400">Date Issued</td>
                  <td className="px-5 py-3.5 text-ada-navy">{formatDate(cert.issued_date)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 text-gray-400">Valid Through</td>
                  <td className="px-5 py-3.5 text-ada-navy">{formatDate(cert.expiration_date)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-outfit">
              Asian Doula Alliance — Official Verification Record
            </p>
            <div className="flex gap-4">
              <Link
                href="/verify"
                className="text-sm text-ada-navy/60 font-outfit hover:text-ada-navy transition-colors"
              >
                &larr; Verify Another
              </Link>
              <Link
                href="/support/contact"
                className="text-sm text-ada-purple font-outfit hover:underline"
              >
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
