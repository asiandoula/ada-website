'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, FileText, GraduationCap, Download, LogOut, Phone, Mail } from 'lucide-react';

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

const statusConfig: Record<string, { label: string; color: string }> = {
  certified_active: { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  expired: { label: 'Expired', color: 'bg-red-50 text-red-700 border-red-200' },
  suspended: { label: 'Suspended', color: 'bg-red-50 text-red-700 border-red-200' },
  revoked: { label: 'Revoked', color: 'bg-red-50 text-red-700 border-red-200' },
  under_investigation: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  exam_scheduled: { label: 'Exam Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  exam_failed: { label: 'Exam Failed', color: 'bg-red-50 text-red-700 border-red-200' },
  retired: { label: 'Retired', color: 'bg-gray-50 text-gray-600 border-gray-200' },
};

const credentialLabels: Record<string, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
  ibclc_training: 'IBCLC Training',
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium font-outfit border ${config.color}`}>
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PortalPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [idCode, setIdCode] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!idCode.trim() || !contactValue.trim()) return;

    setLoading(true);
    setError('');

    try {
      const body: Record<string, string> = { doula_id_code: idCode.trim() };
      if (contactMethod === 'email') {
        body.email = contactValue.trim();
      } else {
        body.phone = contactValue.trim();
      }

      const res = await fetch('/api/portal/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || 'Verification failed.');
      }
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
        <section className="bg-[#f7f8fa] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-gray-200">
          <div className="max-w-[960px] mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image src="/images/ada-logo-white.svg" alt="ADA" width={36} height={36} className="opacity-60" />
              <div className="h-6 w-px bg-gray-300" />
              <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                Credential Portal
              </span>
            </div>
            <h1 className="font-outfit text-3xl md:text-4xl font-semibold text-ada-navy tracking-tight">
              Doula Portal
            </h1>
            <p className="mt-4 text-base text-gray-500 font-outfit max-w-xl mx-auto leading-relaxed">
              Access your credential records, download certificates, and review exam history.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-[420px] mx-auto px-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="idCode" className="block text-xs font-outfit font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Doula ID Code
                </label>
                <input
                  id="idCode"
                  type="text"
                  value={idCode}
                  onChange={(e) => setIdCode(e.target.value)}
                  placeholder="e.g., 25-80301 or #25-311"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-outfit font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Verify Identity
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setContactMethod('email'); setContactValue(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-outfit font-medium transition-colors border ${
                      contactMethod === 'email'
                        ? 'bg-ada-navy text-white border-ada-navy'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContactMethod('phone'); setContactValue(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-outfit font-medium transition-colors border ${
                      contactMethod === 'phone'
                        ? 'bg-ada-navy text-white border-ada-navy'
                        : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-ada-navy font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-outfit">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-ada-navy text-white font-outfit font-medium text-sm hover:bg-ada-navy/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access Portal'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 font-outfit">
                Your ID code is on your ADA certification certificate.
              </p>
              <p className="mt-2 text-xs text-gray-400 font-outfit">
                Need to verify a doula?{' '}
                <Link href="/verify" className="text-ada-purple hover:underline">
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

  return (
    <>
      {/* Header */}
      <section className="bg-[#f7f8fa] pt-32 pb-16 md:pt-40 md:pb-20 border-b border-gray-200">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/images/ada-logo-white.svg" alt="ADA" width={28} height={28} className="opacity-60" />
                <div className="h-5 w-px bg-gray-300" />
                <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                  Credential Portal
                </span>
              </div>
              <h1 className="font-outfit text-2xl md:text-3xl font-semibold text-ada-navy tracking-tight">
                {doula.full_name}
                {doula.full_name_zh && (
                  <span className="text-gray-400 ml-2 text-xl">({doula.full_name_zh})</span>
                )}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-outfit text-sm text-gray-500 font-mono">
                  {doula.doula_id_code}
                </span>
                <StatusBadge status={doula.status} />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-outfit text-gray-500 hover:bg-white transition-colors self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-[960px] mx-auto px-6 space-y-12">

          {/* Credentials */}
          <div>
            <h2 className="flex items-center gap-2 font-outfit font-semibold text-ada-navy text-lg mb-4">
              <ShieldCheck className="w-5 h-5 text-gray-400" /> Credentials
            </h2>
            {credentials.length === 0 ? (
              <p className="text-sm text-gray-400 font-outfit">No credentials on file.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm font-outfit">
                  <thead>
                    <tr className="bg-[#f7f8fa] text-left text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-5 py-3 font-medium">Credential</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Certified</th>
                      <th className="px-5 py-3 font-medium">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {credentials.map((cred) => (
                      <tr key={cred.credential_type} className="border-t border-gray-100">
                        <td className="px-5 py-3.5 text-ada-navy font-medium">
                          {credentialLabels[cred.credential_type] || cred.credential_type}
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge status={cred.status} /></td>
                        <td className="px-5 py-3.5 text-gray-600">{formatDate(cred.certification_date)}</td>
                        <td className="px-5 py-3.5 text-gray-600">{cred.expiration_date ? formatDate(cred.expiration_date) : 'Permanent'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <h2 className="flex items-center gap-2 font-outfit font-semibold text-ada-navy text-lg mb-4">
              <Award className="w-5 h-5 text-gray-400" /> Certificates
            </h2>
            {certificates.length === 0 ? (
              <p className="text-sm text-gray-400 font-outfit">No certificates issued yet.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm font-outfit">
                  <thead>
                    <tr className="bg-[#f7f8fa] text-left text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-5 py-3 font-medium">Certificate No.</th>
                      <th className="px-5 py-3 font-medium">Issued</th>
                      <th className="px-5 py-3 font-medium text-right">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="border-t border-gray-100">
                        <td className="px-5 py-3.5 text-ada-navy font-mono text-xs">{cert.certificate_number}</td>
                        <td className="px-5 py-3.5 text-gray-600">{formatDate(cert.issued_date)}</td>
                        <td className="px-5 py-3.5 text-right">
                          {cert.pdf_url ? (
                            <a
                              href={cert.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-ada-purple text-xs font-medium hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" /> Download PDF
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Exam Results */}
          <div>
            <h2 className="flex items-center gap-2 font-outfit font-semibold text-ada-navy text-lg mb-4">
              <GraduationCap className="w-5 h-5 text-gray-400" /> Exam History
            </h2>
            {exam_results.length === 0 ? (
              <p className="text-sm text-gray-400 font-outfit">No exam results on file.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm font-outfit">
                  <thead>
                    <tr className="bg-[#f7f8fa] text-left text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-5 py-3 font-medium">Session</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Score</th>
                      <th className="px-5 py-3 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam_results.map((exam, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-5 py-3.5 text-ada-navy font-mono text-xs">{exam.exam_session}</td>
                        <td className="px-5 py-3.5 text-gray-600">{credentialLabels[exam.exam_type] || exam.exam_type}</td>
                        <td className="px-5 py-3.5 text-gray-600">{formatDate(exam.exam_date)}</td>
                        <td className="px-5 py-3.5 text-ada-navy font-medium">{exam.score}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                            exam.passed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
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
            <h2 className="flex items-center gap-2 font-outfit font-semibold text-ada-navy text-lg mb-4">
              <FileText className="w-5 h-5 text-gray-400" /> Profile
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm font-outfit">
                <tbody>
                  {doula.email && (
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3.5 text-gray-400 w-[140px]">Email</td>
                      <td className="px-5 py-3.5 text-ada-navy">{doula.email}</td>
                    </tr>
                  )}
                  {doula.phone && (
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3.5 text-gray-400">Phone</td>
                      <td className="px-5 py-3.5 text-ada-navy">{doula.phone}</td>
                    </tr>
                  )}
                  {doula.languages && doula.languages.length > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3.5 text-gray-400">Languages</td>
                      <td className="px-5 py-3.5 text-ada-navy">{doula.languages.join(', ')}</td>
                    </tr>
                  )}
                  {doula.region && (
                    <tr>
                      <td className="px-5 py-3.5 text-gray-400">Region</td>
                      <td className="px-5 py-3.5 text-ada-navy">{doula.region}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-400 font-outfit">
              To update your profile, contact ADA at contact@asiandoula.org.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
