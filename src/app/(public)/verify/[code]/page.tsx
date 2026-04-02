import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { CREDENTIAL_LABELS } from '@/lib/constants';
import type { CredentialType } from '@/lib/constants';
import { ShieldCheck, ShieldAlert, ShieldX, Search, ArrowLeft } from 'lucide-react';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface CredentialRow {
  credential_type: string;
  status: string;
  expiration_date: string | null;
}

interface CertificateRow {
  certificate_number: string;
  certificate_type: string;
  status: string;
}

export default async function VerifyResultPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const supabase = getSupabase();
  const { code } = await params;
  const decoded = decodeURIComponent(code);

  // Find the doula — try verification_code, certificate_number, doula_id_code
  let doulaId: string | null = null;
  let doulaInfo: Record<string, string> | null = null;

  // 1. Verification code → find certificate → get doula
  const { data: byVerification } = await supabase
    .from('certificates')
    .select('doula_id, doulas(id, full_name, full_name_zh, doula_id_code, status)')
    .eq('verification_code', decoded)
    .limit(1)
    .single();

  if (byVerification) {
    doulaId = byVerification.doula_id;
    doulaInfo = byVerification.doulas as unknown as Record<string, string>;
  }

  // 2. Certificate number
  if (!doulaId) {
    const { data: byCertNum } = await supabase
      .from('certificates')
      .select('doula_id, doulas(id, full_name, full_name_zh, doula_id_code, status)')
      .eq('certificate_number', decoded.toUpperCase())
      .limit(1)
      .single();

    if (byCertNum) {
      doulaId = byCertNum.doula_id;
      doulaInfo = byCertNum.doulas as unknown as Record<string, string>;
    }
  }

  // 3. Doula ID code
  if (!doulaId) {
    const normalizedId = decoded.startsWith('#') ? decoded : `#${decoded}`;
    const { data: byDoulaId } = await supabase
      .from('doulas')
      .select('id, full_name, full_name_zh, doula_id_code, status')
      .eq('doula_id_code', normalizedId)
      .single();

    if (byDoulaId) {
      doulaId = byDoulaId.id;
      doulaInfo = byDoulaId as unknown as Record<string, string>;
    }
  }

  // ============ NOT FOUND ============
  if (!doulaId || !doulaInfo) {
    return (
      <>
        <section className="bg-ada-navy pt-32 pb-20 md:pt-40 md:pb-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
          }} />
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/5">
              <ShieldX className="w-8 h-8 text-white/60" />
            </div>
            <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
              Record Not Found
            </h1>
            <p className="mt-4 text-white/60 font-outfit max-w-md mx-auto leading-relaxed">
              The query &ldquo;{decoded}&rdquo; does not match any record in the ADA registry.
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

  // ============ FOUND — fetch all credentials + latest active cert per type ============
  const { data: credentials } = await supabase
    .from('doula_credentials')
    .select('credential_type, status, expiration_date')
    .eq('doula_id', doulaId)
    .order('credential_type');

  const { data: activeCerts } = await supabase
    .from('certificates')
    .select('certificate_number, certificate_type, status')
    .eq('doula_id', doulaId)
    .eq('status', 'active')
    .order('issued_date', { ascending: false });

  const creds: CredentialRow[] = credentials ?? [];
  const certs: CertificateRow[] = activeCerts ?? [];

  // Doula-level overrides
  const doulaStatus = doulaInfo.status;
  const isDoulaRevoked = doulaStatus === 'revoked';
  const isDoulaSuspended = doulaStatus === 'suspended';
  const isDoulaUnderInvestigation = doulaStatus === 'under_investigation';
  const isDoulaRetired = doulaStatus === 'retired';

  // Determine overall status banner
  let overallStatus: string;
  let bannerColor: string;
  let bannerIcon: React.ReactNode;

  if (isDoulaRevoked) {
    overallStatus = 'CREDENTIAL REVOKED';
    bannerColor = 'bg-red-600';
    bannerIcon = <ShieldX className="w-10 h-10 text-red-200" />;
  } else if (isDoulaSuspended) {
    overallStatus = 'CREDENTIAL SUSPENDED';
    bannerColor = 'bg-red-600';
    bannerIcon = <ShieldX className="w-10 h-10 text-red-200" />;
  } else if (isDoulaUnderInvestigation) {
    overallStatus = 'CREDENTIAL UNDER REVIEW';
    bannerColor = 'bg-amber-600';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
  } else if (isDoulaRetired) {
    overallStatus = 'RETIRED — IN GOOD STANDING';
    bannerColor = 'bg-gray-500';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-gray-200" />;
  } else if (creds.length === 0) {
    overallStatus = 'NO CREDENTIALS ON FILE';
    bannerColor = 'bg-gray-500';
    bannerIcon = <ShieldAlert className="w-10 h-10 text-gray-200" />;
  } else {
    const allExpired = creds.every(c => c.expiration_date && new Date(c.expiration_date) < new Date());
    const anyRevoked = creds.some(c => c.status === 'revoked');
    if (anyRevoked) {
      overallStatus = 'CREDENTIAL ISSUE — SEE DETAILS';
      bannerColor = 'bg-amber-600';
      bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
    } else if (allExpired) {
      overallStatus = 'EXPIRED';
      bannerColor = 'bg-amber-600';
      bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
    } else {
      const anyExpired = creds.some(c => c.expiration_date && new Date(c.expiration_date) < new Date());
      if (anyExpired) {
        overallStatus = 'PARTIALLY EXPIRED — SEE DETAILS';
        bannerColor = 'bg-amber-600';
        bannerIcon = <ShieldAlert className="w-10 h-10 text-amber-200" />;
      } else {
        overallStatus = 'VERIFIED — ACTIVE';
        bannerColor = 'bg-emerald-600';
        bannerIcon = <ShieldCheck className="w-10 h-10 text-emerald-200" />;
      }
    }
  }

  return (
    <>
      {/* Header */}
      <section className="bg-ada-navy pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/ada-logo-white.svg" alt="ADA" width={32} height={32} />
            <div className="h-5 w-px bg-white/20" />
            <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
              Official Verification Record
            </span>
          </div>
          <h1 className="font-dm-serif text-3xl md:text-4xl text-white">
            Credential Verification
          </h1>
        </div>
      </section>

      {/* Status banner */}
      <div className={`${bannerColor} py-4`}>
        <div className="max-w-[1000px] mx-auto px-6 flex items-center justify-center gap-3">
          {bannerIcon}
          <span className="font-outfit font-bold text-white tracking-wide text-sm md:text-base">
            {overallStatus}
          </span>
        </div>
      </div>

      {/* Doula info + all credentials */}
      <section className="py-16 bg-white">
        <div className="max-w-[640px] mx-auto px-6">
          {/* Doula identity card */}
          <div className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden mb-6">
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
                    Credential Verification
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-ada-navy/5">
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Holder</span>
                <span className="text-sm font-outfit font-semibold text-ada-navy">
                  {doulaInfo.full_name}
                  {doulaInfo.full_name_zh && (
                    <span className="text-ada-navy/40 font-normal ml-2">({doulaInfo.full_name_zh})</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center px-8 py-4">
                <span className="text-sm text-ada-navy/40 font-outfit">Doula ID</span>
                <span className="text-sm font-mono text-ada-navy">{doulaInfo.doula_id_code}</span>
              </div>
            </div>
          </div>

          {/* Credentials list */}
          {creds.length === 0 ? (
            <p className="text-sm text-ada-navy/40 font-outfit text-center">No credentials on file for this doula.</p>
          ) : (
            <div className="space-y-4">
              {creds.map((cred) => {
                const isExpired = cred.expiration_date && new Date(cred.expiration_date) < new Date();
                const isCredRevoked = cred.status === 'revoked';
                const isCredSuspended = cred.status === 'suspended';
                const isCredActive = !isDoulaRevoked && !isDoulaSuspended && !isCredRevoked && !isCredSuspended && !isExpired;
                const latestCert = certs.find(c => c.certificate_type === cred.credential_type);

                const credStatusLabel = isDoulaRevoked ? 'Revoked' : isDoulaSuspended ? 'Suspended' : isCredRevoked ? 'Revoked' : isCredSuspended ? 'Suspended' : isExpired ? 'Expired' : 'Active';
                const credStatusColor = isCredActive ? 'bg-emerald-50 text-emerald-700' : (isExpired ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700');
                const credDotColor = isCredActive ? 'bg-emerald-500' : (isExpired ? 'bg-amber-500' : 'bg-red-500');

                return (
                  <div key={cred.credential_type} className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-ada-navy/5">
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Credential</span>
                        <span className="text-sm font-outfit font-semibold text-ada-navy">
                          {CREDENTIAL_LABELS[cred.credential_type as CredentialType] || cred.credential_type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Status</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-outfit font-semibold ${credStatusColor}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${credDotColor}`} />
                          {credStatusLabel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center px-8 py-4">
                        <span className="text-sm text-ada-navy/40 font-outfit">Valid Through</span>
                        <span className="text-sm font-outfit text-ada-navy">
                          {cred.expiration_date ? formatDate(cred.expiration_date) : 'Permanent'}
                        </span>
                      </div>
                      {latestCert && (
                        <div className="flex justify-between items-center px-8 py-4">
                          <span className="text-sm text-ada-navy/40 font-outfit">Certificate</span>
                          <span className="text-sm font-mono text-ada-navy">{latestCert.certificate_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 bg-ada-navy/[0.03] rounded-xl px-6 py-4 border border-ada-navy/10">
            <p className="text-xs text-ada-navy/30 font-outfit text-center">
              This record was retrieved from the Asian Doula Alliance official certification registry.
              <br />
              Verification records are retrieved in real-time from the ADA registry.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 text-sm text-ada-navy/60 font-outfit hover:text-ada-navy transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Verify Another Credential
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
