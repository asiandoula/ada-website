import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { CERT_TYPE_LABELS } from '@/lib/constants';
import type { CertificateType } from '@/lib/constants';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

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

  // Not found
  if (!cert) {
    return (
      <>
        <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
              Verification
            </span>
            <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
              Certificate Not Found
            </h1>
          </div>
        </section>
        <section className="py-20 bg-white">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-ada-navy/60 font-outfit leading-relaxed">
              The verification code &ldquo;{code}&rdquo; does not match any certificate in our system.
              Please check the code and try again.
            </p>
            <Link
              href="/verify"
              className="mt-8 inline-flex items-center rounded-full bg-ada-purple text-white px-6 py-2.5 text-sm font-outfit font-medium hover:bg-ada-purple-hover transition-colors"
            >
              &larr; Try Again
            </Link>
          </div>
        </section>
      </>
    );
  }

  const doula = cert.doulas as Record<string, string>;
  const isRevoked = cert.status === 'revoked';
  const isActive = !isRevoked && doula.status === 'certified_active';
  const isExpired = !isRevoked && doula.status === 'expired';

  const statusIcon = isActive
    ? <CheckCircle className="w-8 h-8 text-emerald-500" />
    : isExpired
    ? <AlertTriangle className="w-8 h-8 text-amber-500" />
    : <XCircle className="w-8 h-8 text-red-500" />;

  const statusLabel = isRevoked
    ? 'Certificate Revoked'
    : isActive
    ? 'Verified — Active'
    : isExpired
    ? 'Verified — Expired'
    : doula.status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  const statusColor = isActive
    ? 'bg-emerald-100 text-emerald-700'
    : isExpired
    ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';

  const statusBgColor = isActive
    ? 'bg-emerald-50'
    : isExpired
    ? 'bg-amber-50'
    : 'bg-red-50';

  return (
    <>
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
            Verification Result
          </span>
          <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
            Certificate Verification
          </h1>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-lg mx-auto px-6">
          {/* Status card */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 rounded-full ${statusBgColor} flex items-center justify-center mx-auto mb-4`}>
              {statusIcon}
            </div>
            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-outfit font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          {/* Details */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between px-6 py-4">
                <span className="text-sm text-ada-navy/50 font-outfit">Name</span>
                <span className="text-sm font-outfit font-medium text-ada-navy">
                  {doula.full_name}
                  {doula.full_name_zh && ` (${doula.full_name_zh})`}
                </span>
              </div>
              <div className="flex justify-between px-6 py-4">
                <span className="text-sm text-ada-navy/50 font-outfit">Certificate Type</span>
                <span className="text-sm font-outfit font-medium text-ada-navy">
                  {CERT_TYPE_LABELS[cert.certificate_type as CertificateType]}
                </span>
              </div>
              <div className="flex justify-between px-6 py-4">
                <span className="text-sm text-ada-navy/50 font-outfit">Certificate Number</span>
                <span className="text-sm font-mono text-ada-navy">{cert.certificate_number}</span>
              </div>
              <div className="flex justify-between px-6 py-4">
                <span className="text-sm text-ada-navy/50 font-outfit">Issued</span>
                <span className="text-sm font-outfit text-ada-navy">{formatDate(cert.issued_date)}</span>
              </div>
              <div className="flex justify-between px-6 py-4">
                <span className="text-sm text-ada-navy/50 font-outfit">Valid Through</span>
                <span className="text-sm font-outfit text-ada-navy">{formatDate(cert.expiration_date)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="inline-flex items-center rounded-full border border-ada-navy/20 px-5 py-2.5 text-sm font-outfit text-ada-navy/60 hover:bg-gray-50 transition-colors"
            >
              &larr; Verify Another
            </Link>
            <Link
              href="/support/contact"
              className="inline-flex items-center rounded-full bg-ada-purple/10 text-ada-purple px-5 py-2.5 text-sm font-outfit font-medium hover:bg-ada-purple/20 transition-colors"
            >
              <Shield className="w-4 h-4 mr-1.5" /> Report an Issue
            </Link>
          </div>

          <p className="mt-8 text-xs text-ada-navy/30 font-outfit text-center">
            Asian Doula Alliance — asiandoula.org
          </p>
        </div>
      </section>
    </>
  );
}
