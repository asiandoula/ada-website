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
  id: string;
  exam_session: string;
  exam_type: string;
  overall_score: number;
  score_terminology: number;
  score_newborn: number;
  score_lactation: number;
  score_emergency: number;
  score_practical: number;
  score_postpartum: number;
  score_knowledge: number;
  score_ethics: number;
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
  registered: { label: 'Registered', dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  active: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  under_investigation: { label: 'Under Review', dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  revoked: { label: 'Revoked', dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
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

function expiryText(dateStr: string | null): { text: string; color: string } | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { text: 'Expired', color: 'text-red-600' };
  if (days <= 90) return { text: `Expires in ${days} days`, color: 'text-amber-600' };
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0) return { text: `Expires in ${years}yr ${remMonths}mo`, color: 'text-emerald-600' };
  return { text: `Expires in ${months} months`, color: 'text-emerald-600' };
}

const scoreLabels: Record<string, string> = {
  score_terminology: 'Terminology',
  score_newborn: 'Newborn Care',
  score_lactation: 'Lactation',
  score_emergency: 'Emergency',
  score_practical: 'Practical',
  score_postpartum: 'Postpartum',
  score_knowledge: 'Knowledge',
  score_ethics: 'Ethics',
};

function ExamSection({ examResults }: { examResults: ExamResult[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
        Examination History
      </h2>
      {examResults.length === 0 ? (
        <p className="text-sm text-ada-navy/40 font-outfit">No exam results on file.</p>
      ) : (
        <div className="space-y-3">
          {examResults.map((exam) => {
            const isExpanded = expandedId === exam.id;
            return (
              <div key={exam.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Summary row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : exam.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-ada-navy/[0.02] transition-colors text-left"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="font-mono text-xs text-ada-navy/60">{exam.exam_session}</p>
                      <p className="text-sm font-outfit text-ada-navy/60 mt-0.5">
                        {credentialLabels[exam.exam_type] || exam.exam_type} — {formatDate(exam.exam_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-outfit font-bold text-ada-navy">{exam.overall_score}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-outfit ${
                      exam.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${exam.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {exam.passed ? 'Passed' : 'Failed'}
                    </span>
                    <svg className={`w-4 h-4 text-ada-navy/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div className="px-6 pb-5 pt-2 border-t border-gray-100 bg-ada-navy/[0.015]">
                    <p className="text-xs text-ada-navy/40 font-outfit uppercase tracking-wider font-semibold mb-4">
                      Score Breakdown
                    </p>
                    <div className="space-y-3">
                      {Object.entries(scoreLabels).map(([key, label]) => {
                        const score = exam[key as keyof ExamResult] as number;
                        return (
                          <div key={key} className="flex items-center gap-4">
                            <span className="w-24 text-xs text-ada-navy/60 font-outfit shrink-0">{label}</span>
                            <div className="flex-1 h-2 bg-ada-navy/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  score >= 90 ? 'bg-emerald-400' : score >= 80 ? 'bg-blue-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className={`w-8 text-right text-xs font-outfit font-semibold ${
                              score >= 90 ? 'text-emerald-600' : score >= 80 ? 'text-blue-600' : 'text-red-600'
                            }`}>{score}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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

        <section className="py-20 bg-gray-50/50">
          <div className="max-w-[440px] mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              {/* Form header */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ada-purple/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-ada-purple" />
                  </div>
                  <h2 className="font-outfit font-semibold text-ada-navy text-lg">
                    Sign In
                  </h2>
                </div>
                <p className="text-sm text-ada-navy/50 font-outfit">
                  Enter your Doula ID and contact information to access your portal.
                </p>
              </div>

              {/* Form body */}
              <form onSubmit={handleVerify} className="px-8 py-6 space-y-5">
                <div>
                  <label htmlFor="idCode" className="block text-sm font-outfit font-medium text-ada-navy mb-1.5">
                    Doula ID Code
                  </label>
                  <input
                    id="idCode"
                    type="text"
                    value={idCode}
                    onChange={(e) => setIdCode(e.target.value)}
                    placeholder="#25-0001"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-outfit font-medium text-ada-navy mb-1.5">
                    Verify with
                  </label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-3">
                    <button
                      type="button"
                      aria-pressed={contactMethod === 'email'}
                      onClick={() => { setContactMethod('email'); setContactValue(''); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-outfit font-medium transition-colors ${
                        contactMethod === 'email'
                          ? 'bg-ada-navy text-white'
                          : 'bg-white text-ada-navy/50 hover:bg-gray-50'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button
                      type="button"
                      aria-pressed={contactMethod === 'phone'}
                      onClick={() => { setContactMethod('phone'); setContactValue(''); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-outfit font-medium transition-colors border-l border-gray-300 ${
                        contactMethod === 'phone'
                          ? 'bg-ada-navy text-white'
                          : 'bg-white text-ada-navy/50 hover:bg-gray-50'
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
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple placeholder:text-gray-400"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-sm text-red-700 font-outfit">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-ada-purple text-white font-outfit font-semibold text-sm hover:bg-ada-purple-hover transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Access Portal'}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center space-y-1.5">
              <p className="text-xs text-ada-navy/35 font-outfit">
                Your ID code can be found on your ADA certification certificate or in the email from ADA.
              </p>
              <p className="text-xs text-ada-navy/35 font-outfit">
                Need to verify a doula?{' '}
                <Link href="/verify" className="text-ada-purple hover:underline font-medium">
                  Public Verification &rarr;
                </Link>
              </p>
            </div>
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
                  <span className="font-mono text-xs text-white/60">{doula.doula_id_code}</span>
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
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6">
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
              <div className={`grid gap-4 ${credentials.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-2'}`}>
                {credentials.map((cred) => {
                  const expiry = expiryText(cred.expiration_date);

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
                      {expiry && (
                        <div className="mt-4 pt-3 border-t border-ada-navy/5">
                          <span className={`text-xs font-outfit font-semibold ${expiry.color}`}>
                            {expiry.text}
                          </span>
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
          <ExamSection examResults={exam_results} />

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
