'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, FileText, GraduationCap, Download, LogOut, Phone, Mail, User } from 'lucide-react';

interface DoulaProfile {
  full_name: string;
  full_name_zh: string | null;
  doula_id_code: string;
  email: string | null;
  phone: string | null;
  status: string;
  region: string | null;
  languages: string[] | null;
  certification_date: string | null;
  expiration_date: string | null;
}

interface Credential {
  credential_type: string;
  status: string;
  certification_date: string | null;
  expiration_date: string | null;
}

interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  pdf_url: string | null;
}

interface ExamResult {
  exam_session: string;
  exam_type: string;
  score: number;
  passed: boolean;
  exam_date: string;
}

interface PortalData {
  doula: DoulaProfile;
  credentials: Credential[];
  certificates: Certificate[];
  exam_results: ExamResult[];
}

const statusConfig: Record<string, { label: string; dot: string; bg: string }> = {
  certified_active: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  expired: { label: 'Expired', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  revoked: { label: 'Revoked', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  under_investigation: { label: 'Under Review', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  exam_scheduled: { label: 'Exam Scheduled', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  exam_failed: { label: 'Failed', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  retired: { label: 'Retired', dot: 'bg-gray-400', bg: 'bg-gray-50 text-gray-600' },
};

const credentialLabels: Record<string, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
  ibclc_training: 'IBCLC Training',
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, dot: 'bg-gray-400', bg: 'bg-gray-50 text-gray-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysUntilExpiry(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PortalPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [idCode, setIdCode] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = data
      ? `${data.doula.full_name} — Credential Portal | Asian Doula Alliance`
      : 'Doula Portal | Asian Doula Alliance';
  }, [data]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!idCode.trim() || !contactValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const body: Record<string, string> = { doula_id_code: idCode.trim() };
      if (contactMethod === 'email') body.email = contactValue.trim();
      else body.phone = contactValue.trim();

      const res = await fetch('/api/portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) setData(result);
      else setError(result.error || 'Verification failed.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setData(null);
    setIdCode('');
    setContactValue('');
    setError('');
  }

  // ============ LOGIN FORM ============
  if (!data) {
    return (
      <>
        <section className="bg-ada-navy pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
          }} />
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
                <Image src="/images/ada-logo-white.svg" alt="ADA Seal" width={44} height={44} />
              </div>
            </div>
            <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-white/50 mb-3">
              Asian Doula Alliance
            </p>
            <h1 className="font-dm-serif text-4xl md:text-5xl text-white">
              Credential Portal
            </h1>
            <p className="mt-5 text-base text-white/50 font-outfit max-w-lg mx-auto leading-relaxed">
              Access your certification records, download certificates, and review exam history.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-[400px] mx-auto px-6">
            <div className="border-2 border-ada-navy/10 rounded-2xl p-8">
              <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-6">
                Verify Your Identity
              </h2>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label htmlFor="idCode" className="block text-xs font-outfit font-semibold text-ada-navy/40 uppercase tracking-wider mb-2">
                    Doula ID Code
                  </label>
                  <input
                    id="idCode"
                    type="text"
                    value={idCode}
                    onChange={(e) => setIdCode(e.target.value)}
                    placeholder="e.g., #25-311"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-outfit font-semibold text-ada-navy/40 uppercase tracking-wider mb-2">
                    Contact Information
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      aria-pressed={contactMethod === 'email'}
                      onClick={() => { setContactMethod('email'); setContactValue(''); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-medium transition-colors ${
                        contactMethod === 'email'
                          ? 'bg-ada-navy text-white'
                          : 'bg-ada-navy/5 text-ada-navy/50 hover:bg-ada-navy/10'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button
                      type="button"
                      aria-pressed={contactMethod === 'phone'}
                      onClick={() => { setContactMethod('phone'); setContactValue(''); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-medium transition-colors ${
                        contactMethod === 'phone'
                          ? 'bg-ada-navy text-white'
                          : 'bg-ada-navy/5 text-ada-navy/50 hover:bg-ada-navy/10'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" /> Phone
                    </button>
                  </div>
                  <input
                    type={contactMethod === 'email' ? 'email' : 'tel'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={contactMethod === 'email' ? 'your@email.com' : '(626) 555-1234'}
                    required
                    aria-label={contactMethod === 'email' ? 'Email address' : 'Phone number'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                  />
                </div>

                {error && <p className="text-sm text-red-600 font-outfit">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-ada-purple text-white font-outfit font-semibold text-sm hover:bg-ada-purple-hover transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Access Portal'}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-ada-navy/30 font-outfit">
              Your ID code is on your ADA certification certificate.
            </p>
            <p className="mt-2 text-center text-xs text-ada-navy/30 font-outfit">
              Need to verify a doula?{' '}
              <Link href="/verify" className="text-ada-purple hover:underline">
                Public Verification &rarr;
              </Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  // ============ DASHBOARD ============
  const { doula, credentials, certificates, exam_results } = data;
  const primaryStatus = statusConfig[doula.status];

  return (
    <>
      {/* Dark header with user info */}
      <section className="bg-ada-navy pt-32 pb-12 md:pt-40 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar circle */}
              <div className="w-16 h-16 rounded-full bg-ada-purple/20 flex items-center justify-center border-2 border-ada-purple/30 shrink-0">
                <User className="w-7 h-7 text-ada-purple" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Image src="/images/ada-logo-white.svg" alt="ADA" width={18} height={18} className="opacity-40" />
                  <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-white/30">
                    Credential Portal
                  </span>
                </div>
                <h1 className="font-outfit text-xl md:text-2xl font-semibold text-white">
                  {doula.full_name}
                  {doula.full_name_zh && (
                    <span className="text-white/30 ml-2 text-lg">({doula.full_name_zh})</span>
                  )}
                </h1>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-mono text-xs text-white/40">{doula.doula_id_code}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-outfit ${
                    primaryStatus?.bg || 'bg-gray-50 text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${primaryStatus?.dot || 'bg-gray-400'}`} />
                    {primaryStatus?.label || doula.status}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-outfit text-white/50 hover:text-white hover:border-white/20 transition-colors self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-ada-purple" />
                <span className="text-xs text-ada-navy/40 font-outfit font-semibold uppercase tracking-wider">Credentials</span>
              </div>
              <p className="text-2xl font-outfit font-bold text-ada-navy">{credentials.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-ada-purple" />
                <span className="text-xs text-ada-navy/40 font-outfit font-semibold uppercase tracking-wider">Certificates</span>
              </div>
              <p className="text-2xl font-outfit font-bold text-ada-navy">{certificates.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-5 h-5 text-ada-purple" />
                <span className="text-xs text-ada-navy/40 font-outfit font-semibold uppercase tracking-wider">Exams</span>
              </div>
              <p className="text-2xl font-outfit font-bold text-ada-navy">{exam_results.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 space-y-12">

          {/* Credentials */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              Credentials
            </h2>
            {credentials.length === 0 ? (
              <p className="text-sm text-ada-navy/40 font-outfit">No credentials on file.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {credentials.map((cred) => {
                  const days = daysUntilExpiry(cred.expiration_date);
                  const totalDays = cred.certification_date && cred.expiration_date
                    ? (new Date(cred.expiration_date).getTime() - new Date(cred.certification_date).getTime()) / (1000 * 60 * 60 * 24)
                    : null;
                  const progress = days !== null && totalDays ? Math.max(0, Math.min(100, (days / totalDays) * 100)) : null;

                  return (
                    <div key={cred.credential_type} className="border-2 border-ada-navy/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-outfit font-semibold text-ada-navy">
                          {credentialLabels[cred.credential_type] || cred.credential_type}
                        </h3>
                        <StatusBadge status={cred.status} />
                      </div>
                      <div className="space-y-2 text-sm font-outfit">
                        <div className="flex justify-between">
                          <span className="text-ada-navy/40">Certified</span>
                          <span className="text-ada-navy">{formatDate(cred.certification_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ada-navy/40">Expires</span>
                          <span className="text-ada-navy">{cred.expiration_date ? formatDate(cred.expiration_date) : 'Permanent'}</span>
                        </div>
                      </div>
                      {progress !== null && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-ada-navy/30 font-outfit mb-1">
                            <span>Validity</span>
                            <span>{days !== null && days > 0 ? `${Math.floor(days / 365)}yr ${Math.floor((days % 365) / 30)}mo remaining` : 'Expired'}</span>
                          </div>
                          <div className="h-2 bg-ada-navy/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-[width] duration-500 ${
                                progress > 30 ? 'bg-emerald-400' : progress > 10 ? 'bg-amber-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              Certificates
            </h2>
            {certificates.length === 0 ? (
              <p className="text-sm text-ada-navy/40 font-outfit">No certificates issued yet.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border border-gray-200 rounded-xl px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-ada-purple/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-ada-purple/60" />
                      </div>
                      <div>
                        <p className="font-outfit font-semibold text-ada-navy text-sm">{cert.certificate_number}</p>
                        <p className="text-xs text-ada-navy/40 font-outfit">Issued {formatDate(cert.issued_date)}</p>
                      </div>
                    </div>
                    {cert.pdf_url ? (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ada-purple text-white text-xs font-outfit font-semibold hover:bg-ada-purple-hover transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    ) : (
                      <span className="text-xs text-ada-navy/20 font-outfit">No PDF</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Results */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              Examination History
            </h2>
            {exam_results.length === 0 ? (
              <p className="text-sm text-ada-navy/40 font-outfit">No exam results on file.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm font-outfit">
                  <thead>
                    <tr className="bg-ada-navy/[0.03] text-left text-xs text-ada-navy/40 uppercase tracking-wider">
                      <th className="px-6 py-3 font-semibold">Session</th>
                      <th className="px-6 py-3 font-semibold">Type</th>
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Score</th>
                      <th className="px-6 py-3 font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam_results.map((exam, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-6 py-4 text-ada-navy font-mono text-xs">{exam.exam_session}</td>
                        <td className="px-6 py-4 text-ada-navy/70">{credentialLabels[exam.exam_type] || exam.exam_type}</td>
                        <td className="px-6 py-4 text-ada-navy/70">{formatDate(exam.exam_date)}</td>
                        <td className="px-6 py-4 text-ada-navy font-semibold">{exam.score}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            exam.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${exam.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {exam.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Profile */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              Profile Information
            </h2>
            <div className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden">
              <div className="divide-y divide-ada-navy/5">
                {doula.email && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">Email</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.email}</span>
                  </div>
                )}
                {doula.phone && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">Phone</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.phone}</span>
                  </div>
                )}
                {doula.languages && doula.languages.length > 0 && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">Languages</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.languages.join(', ')}</span>
                  </div>
                )}
                {doula.region && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">Region</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.region}</span>
                  </div>
                )}
              </div>
              <div className="bg-ada-navy/[0.03] px-6 py-3 border-t border-ada-navy/10">
                <p className="text-xs text-ada-navy/30 font-outfit">
                  To update your information, contact ADA at contact@asiandoula.org or (714) 202-6501.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
