'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Award, FileText, GraduationCap, Download, LogOut, Phone, Mail } from 'lucide-react';

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
  certified_active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-700' },
  revoked: { label: 'Revoked', color: 'bg-red-100 text-red-700' },
  under_investigation: { label: 'Under Review', color: 'bg-amber-100 text-amber-700' },
  exam_scheduled: { label: 'Exam Scheduled', color: 'bg-blue-100 text-blue-700' },
  exam_failed: { label: 'Exam Failed', color: 'bg-red-100 text-red-700' },
  retired: { label: 'Retired', color: 'bg-gray-100 text-gray-600' },
};

const credentialLabels: Record<string, string> = {
  postpartum: 'Postpartum Doula',
  birth: 'Birth Doula',
  ibclc_training: 'IBCLC Training',
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
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

  // ============ VERIFICATION FORM ============
  if (!data) {
    return (
      <>
        <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
              Doula Portal
            </span>
            <h1 className="mt-3 font-dm-serif text-4xl md:text-5xl text-ada-navy">
              Access Your Profile
            </h1>
            <p className="mt-4 text-lg text-ada-navy/60 max-w-2xl mx-auto leading-relaxed">
              View your certifications, download certificates, and check exam results.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-md mx-auto px-6">
            <form onSubmit={handleVerify} className="space-y-5">
              {/* Doula ID Code */}
              <div>
                <label htmlFor="idCode" className="block text-sm font-outfit font-medium text-ada-navy mb-1.5">
                  Doula ID Code
                </label>
                <input
                  id="idCode"
                  type="text"
                  value={idCode}
                  onChange={(e) => setIdCode(e.target.value)}
                  placeholder="e.g., 25-80301"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                />
              </div>

              {/* Contact method toggle */}
              <div>
                <div className="flex gap-2 mb-1.5">
                  <button
                    type="button"
                    onClick={() => { setContactMethod('email'); setContactValue(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-medium transition-colors ${
                      contactMethod === 'email'
                        ? 'bg-ada-purple text-white'
                        : 'bg-gray-100 text-ada-navy/60 hover:bg-gray-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContactMethod('phone'); setContactValue(''); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-medium transition-colors ${
                      contactMethod === 'phone'
                        ? 'bg-ada-purple text-white'
                        : 'bg-gray-100 text-ada-navy/60 hover:bg-gray-200'
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-ada-navy focus:outline-none focus:ring-2 focus:ring-ada-purple/30 focus:border-ada-purple"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 font-outfit">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-ada-purple text-white font-outfit font-medium hover:bg-ada-purple-hover transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Access My Profile'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ada-navy/40 font-outfit">
              Your Doula ID Code is on your certification certificate.
            </p>
            <p className="mt-2 text-center text-sm text-ada-navy/40 font-outfit">
              Looking to verify a doula&apos;s certification?{' '}
              <Link href="/verify" className="text-ada-purple hover:underline">
                Public Verification &rarr;
              </Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  // ============ PROFILE DASHBOARD ============
  const { doula, credentials, certificates, exam_results } = data;

  return (
    <>
      {/* Header bar */}
      <section className="bg-ada-cream pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="font-outfit text-sm font-semibold tracking-widest uppercase text-ada-purple">
                Doula Portal
              </span>
              <h1 className="mt-2 font-dm-serif text-3xl md:text-4xl text-ada-navy">
                {doula.full_name}
                {doula.full_name_zh && (
                  <span className="ml-3 text-ada-navy/40 text-2xl">{doula.full_name_zh}</span>
                )}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="font-outfit text-sm text-ada-navy/50">
                  ID: {doula.doula_id_code}
                </span>
                <StatusBadge status={doula.status} />
                {doula.region && (
                  <span className="font-outfit text-sm text-ada-navy/50">{doula.region}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-ada-navy/20 text-sm font-outfit text-ada-navy/60 hover:bg-white transition-colors self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">

          {/* Credentials */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-ada-purple" />
              <h2 className="font-dm-serif text-2xl text-ada-navy">Credentials</h2>
            </div>
            {credentials.length === 0 ? (
              <p className="text-ada-navy/40 font-outfit">No credentials on file.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {credentials.map((cred) => (
                  <div
                    key={cred.credential_type}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-[transform,box-shadow] duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-outfit font-semibold text-ada-navy">
                        {credentialLabels[cred.credential_type] || cred.credential_type}
                      </h3>
                      <StatusBadge status={cred.status} />
                    </div>
                    <div className="space-y-1 text-sm text-ada-navy/60 font-outfit">
                      <p>Certified: {formatDate(cred.certification_date)}</p>
                      <p>Expires: {cred.expiration_date ? formatDate(cred.expiration_date) : 'Permanent'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certificates */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-ada-purple" />
              <h2 className="font-dm-serif text-2xl text-ada-navy">Certificates</h2>
            </div>
            {certificates.length === 0 ? (
              <p className="text-ada-navy/40 font-outfit">No certificates issued yet.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-ada-navy/30 shrink-0" />
                      <div>
                        <p className="font-outfit font-medium text-ada-navy">{cert.certificate_number}</p>
                        <p className="text-sm text-ada-navy/50 font-outfit">Issued {formatDate(cert.issued_date)}</p>
                      </div>
                    </div>
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ada-purple/10 text-ada-purple text-sm font-outfit font-medium hover:bg-ada-purple/20 transition-colors"
                      >
                        <Download className="w-4 h-4" /> PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Results */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-ada-purple" />
              <h2 className="font-dm-serif text-2xl text-ada-navy">Exam Results</h2>
            </div>
            {exam_results.length === 0 ? (
              <p className="text-ada-navy/40 font-outfit">No exam results on file.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-outfit">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-ada-navy/40">
                      <th className="py-3 pr-4 font-medium">Session</th>
                      <th className="py-3 pr-4 font-medium">Type</th>
                      <th className="py-3 pr-4 font-medium">Date</th>
                      <th className="py-3 pr-4 font-medium">Score</th>
                      <th className="py-3 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam_results.map((exam, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-ada-navy">{exam.exam_session}</td>
                        <td className="py-3 pr-4 text-ada-navy/70">
                          {credentialLabels[exam.exam_type] || exam.exam_type}
                        </td>
                        <td className="py-3 pr-4 text-ada-navy/70">{formatDate(exam.exam_date)}</td>
                        <td className="py-3 pr-4 text-ada-navy font-medium">{exam.score}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            exam.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
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

          {/* Profile Info */}
          <div className="bg-[#fafafa] rounded-2xl p-6">
            <h3 className="font-outfit font-semibold text-ada-navy mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-outfit">
              {doula.email && (
                <div>
                  <span className="text-ada-navy/40 block">Email</span>
                  <span className="text-ada-navy">{doula.email}</span>
                </div>
              )}
              {doula.phone && (
                <div>
                  <span className="text-ada-navy/40 block">Phone</span>
                  <span className="text-ada-navy">{doula.phone}</span>
                </div>
              )}
              {doula.languages && doula.languages.length > 0 && (
                <div>
                  <span className="text-ada-navy/40 block">Languages</span>
                  <span className="text-ada-navy">{doula.languages.join(', ')}</span>
                </div>
              )}
              {doula.region && (
                <div>
                  <span className="text-ada-navy/40 block">Region</span>
                  <span className="text-ada-navy">{doula.region}</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-ada-navy/30 font-outfit">
              To update your profile information, please contact ADA at contact@asiandoula.org.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
