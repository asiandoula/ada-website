'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, FileText, GraduationCap, Download, LogOut, Phone, Mail, User, Globe } from 'lucide-react';

// ============ TYPES ============

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
  certificate_type: string;
  issued_date: string;
  pdf_url: string | null;
  status: string;
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

// ============ I18N ============

type Lang = 'en' | 'zh';

const t = {
  en: {
    credentialPortal: 'Credential Portal',
    portalSubtitle: 'Access your certification records, download certificates, and review exam history.',
    signIn: 'Sign In',
    signInDesc: 'Enter your Doula ID and contact information to access your portal.',
    doulaIdCode: 'Doula ID Code',
    verifyWith: 'Verify with',
    email: 'Email',
    phone: 'Phone',
    accessPortal: 'Access Portal',
    verifying: 'Verifying...',
    idHint: 'Your ID code can be found on your ADA certification certificate or in the email from ADA.',
    verifyDoula: 'Need to verify a doula?',
    publicVerification: 'Public Verification',
    signOut: 'Sign Out',
    certificates: 'My Certificates',
    certificatesEmpty: 'No certificates issued yet.',
    download: 'Download PDF',
    noPdf: 'No PDF',
    issued: 'Issued',
    examHistory: 'Exam Results',
    examEmpty: 'No exam results on file.',
    scoreBreakdown: 'Score Breakdown',
    passed: 'Passed',
    failed: 'Failed',
    credentials: 'My Credentials',
    credentialsEmpty: 'No credentials on file.',
    certified: 'Certified',
    expires: 'Expires',
    permanent: 'Permanent',
    expired: 'Expired',
    expiresInDays: (d: number) => `Expires in ${d} days`,
    expiresInMonths: (m: number) => `Expires in ${m} months`,
    expiresInYears: (y: number, m: number) => `Expires in ${y}yr ${m}mo`,
    profile: 'Profile Information',
    profileUpdateNote: 'To update your information, contact ADA at contact@asiandoula.org or (714) 202-6501.',
    region: 'Region',
    languages: 'Languages',
    superseded: 'Superseded',
    networkError: 'Network error. Please try again.',
    // Status labels
    status_registered: 'Registered',
    status_active: 'Active',
    status_under_investigation: 'Under Review',
    status_suspended: 'Suspended',
    status_revoked: 'Revoked',
    status_retired: 'Retired',
    // Credential types
    cred_postpartum: 'Postpartum Doula',
    cred_birth: 'Birth Doula',
    cred_ibclc_training: 'IBCLC Training',
    // Score labels
    score_terminology: 'Terminology',
    score_newborn: 'Newborn Care',
    score_lactation: 'Lactation',
    score_emergency: 'Emergency',
    score_practical: 'Practical',
    score_postpartum: 'Postpartum',
    score_knowledge: 'Knowledge',
    score_ethics: 'Ethics',
  },
  zh: {
    credentialPortal: '资质门户',
    portalSubtitle: '查看您的认证记录、下载证书、查看考试成绩。',
    signIn: '登录',
    signInDesc: '输入您的导乐ID和联系方式来访问您的门户。',
    doulaIdCode: '导乐 ID',
    verifyWith: '验证方式',
    email: '邮箱',
    phone: '手机号',
    accessPortal: '进入门户',
    verifying: '验证中...',
    idHint: '您的ID可以在ADA认证证书或ADA发送的邮件中找到。',
    verifyDoula: '需要验证导乐资质？',
    publicVerification: '公开验证',
    signOut: '退出登录',
    certificates: '我的证书',
    certificatesEmpty: '暂无证书。',
    download: '下载 PDF',
    noPdf: '暂无 PDF',
    issued: '颁发日期',
    examHistory: '考试成绩',
    examEmpty: '暂无考试记录。',
    scoreBreakdown: '成绩明细',
    passed: '通过',
    failed: '未通过',
    credentials: '我的资质',
    credentialsEmpty: '暂无资质记录。',
    certified: '认证日期',
    expires: '到期日期',
    permanent: '永久',
    expired: '已过期',
    expiresInDays: (d: number) => `${d}天后到期`,
    expiresInMonths: (m: number) => `${m}个月后到期`,
    expiresInYears: (y: number, m: number) => `${y}年${m}个月后到期`,
    profile: '个人信息',
    profileUpdateNote: '如需更新信息，请联系 ADA：contact@asiandoula.org 或 (714) 202-6501。',
    region: '地区',
    languages: '语言',
    superseded: '已替代',
    networkError: '网络错误，请重试。',
    // Status labels
    status_registered: '已注册',
    status_active: '有效',
    status_under_investigation: '审核中',
    status_suspended: '已暂停',
    status_revoked: '已撤销',
    status_retired: '已退休',
    // Credential types
    cred_postpartum: '产后导乐',
    cred_birth: '分娩导乐',
    cred_ibclc_training: 'IBCLC 培训',
    // Score labels
    score_terminology: '专业术语',
    score_newborn: '新生儿护理',
    score_lactation: '哺乳指导',
    score_emergency: '应急处理',
    score_practical: '实操技能',
    score_postpartum: '产后护理',
    score_knowledge: '专业知识',
    score_ethics: '职业伦理',
  },
} as const;

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || '';
  return lang.startsWith('zh') ? 'zh' : 'en';
}

// ============ HELPERS ============

const statusStyles: Record<string, { dot: string; bg: string }> = {
  registered: { dot: 'bg-blue-500', bg: 'bg-blue-50 text-blue-700' },
  active: { dot: 'bg-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  under_investigation: { dot: 'bg-amber-500', bg: 'bg-amber-50 text-amber-700' },
  suspended: { dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  revoked: { dot: 'bg-red-500', bg: 'bg-red-50 text-red-700' },
  retired: { dot: 'bg-gray-400', bg: 'bg-gray-50 text-gray-600' },
};

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const style = statusStyles[status] || { dot: 'bg-gray-400', bg: 'bg-gray-50 text-gray-600' };
  const label = t[lang][`status_${status}` as keyof typeof t.en] as string || status;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-outfit ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}

function formatDate(dateStr: string | null, lang: Lang): string {
  if (!dateStr) return '—';
  // Append T12:00 to avoid timezone shifting (date-only strings parse as UTC midnight)
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  if (isNaN(d.getTime())) return '—';
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function expiryText(dateStr: string | null, lang: Lang): { text: string; color: string } | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { text: t[lang].expired, color: 'text-red-600' };
  if (days <= 90) return { text: t[lang].expiresInDays(days), color: 'text-amber-600' };
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0) return { text: t[lang].expiresInYears(years, remMonths), color: 'text-emerald-600' };
  return { text: t[lang].expiresInMonths(months), color: 'text-emerald-600' };
}

const scoreKeys = [
  'score_terminology', 'score_newborn', 'score_lactation', 'score_emergency',
  'score_practical', 'score_postpartum', 'score_knowledge', 'score_ethics',
] as const;

// ============ COMPONENTS ============

function ExamSection({ examResults, lang }: { examResults: ExamResult[]; lang: Lang }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const labels = t[lang];

  return (
    <div>
      <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
        <GraduationCap className="w-5 h-5 inline-block mr-2 text-ada-purple" />
        {labels.examHistory}
      </h2>
      {examResults.length === 0 ? (
        <p className="text-sm text-ada-navy/40 font-outfit">{labels.examEmpty}</p>
      ) : (
        <div className="space-y-3">
          {examResults.map((exam) => {
            const isExpanded = expandedId === exam.id;
            const credLabel = labels[`cred_${exam.exam_type}` as keyof typeof labels] as string || exam.exam_type;
            return (
              <div key={exam.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : exam.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-ada-navy/[0.02] transition-colors text-left"
                >
                  <div>
                    <p className="font-mono text-xs text-ada-navy/60">{exam.exam_session}</p>
                    <p className="text-sm font-outfit text-ada-navy/60 mt-0.5">
                      {credLabel} — {formatDate(exam.exam_date, lang)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-outfit font-bold text-ada-navy">{exam.overall_score}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-outfit ${
                      exam.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${exam.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {exam.passed ? labels.passed : labels.failed}
                    </span>
                    <svg className={`w-4 h-4 text-ada-navy/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-2 border-t border-gray-100 bg-ada-navy/[0.015]">
                    <p className="text-xs text-ada-navy/40 font-outfit uppercase tracking-wider font-semibold mb-4">
                      {labels.scoreBreakdown}
                    </p>
                    <div className="space-y-3">
                      {scoreKeys.map((key) => {
                        const score = exam[key as keyof ExamResult] as number;
                        const label = labels[key as keyof typeof labels] as string;
                        return (
                          <div key={key} className="flex items-center gap-4">
                            <span className="w-24 text-xs text-ada-navy/60 font-outfit shrink-0">{label}</span>
                            <div className="flex-1 h-2 bg-ada-navy/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  score >= 90 ? 'bg-emerald-400' : score >= 80 ? 'bg-blue-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
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

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-outfit text-white/50 hover:text-white hover:border-white/20 transition-colors"
      title={lang === 'en' ? '切换中文' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5" />
      {lang === 'en' ? '中文' : 'EN'}
    </button>
  );
}

// ============ MAIN ============

export default function PortalPage() {
  const [data, setData] = useState<PortalData | null>(null);
  const [idCode, setIdCode] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(detectLang());
  }, []);

  useEffect(() => {
    document.title = data
      ? `${data.doula.full_name} — ${t[lang].credentialPortal} | Asian Doula Alliance`
      : `${t[lang].credentialPortal} | Asian Doula Alliance`;
  }, [data, lang]);

  const labels = t[lang];

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
      setError(labels.networkError);
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
            {/* Language toggle */}
            <div className="absolute top-0 right-6">
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-outfit text-white/50 hover:text-white hover:border-white/20 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === 'en' ? '中文' : 'EN'}
              </button>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
                <Image src="/images/ada-logo-white.svg" alt="ADA Seal" width={44} height={44} />
              </div>
            </div>
            <p className="font-outfit text-xs font-semibold tracking-[0.25em] uppercase text-white/50 mb-3">
              Asian Doula Alliance
            </p>
            <h1 className="font-dm-serif text-4xl md:text-5xl text-white">
              {labels.credentialPortal}
            </h1>
            <p className="mt-5 text-base text-white/50 font-outfit max-w-lg mx-auto leading-relaxed">
              {labels.portalSubtitle}
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50/50">
          <div className="max-w-[440px] mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ada-purple/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-ada-purple" />
                  </div>
                  <h2 className="font-outfit font-semibold text-ada-navy text-lg">
                    {labels.signIn}
                  </h2>
                </div>
                <p className="text-sm text-ada-navy/50 font-outfit">
                  {labels.signInDesc}
                </p>
              </div>

              <form onSubmit={handleVerify} className="px-8 py-6 space-y-5">
                <div>
                  <label htmlFor="idCode" className="block text-sm font-outfit font-medium text-ada-navy mb-1.5">
                    {labels.doulaIdCode}
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
                    {labels.verifyWith}
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
                      <Mail className="w-3.5 h-3.5" /> {labels.email}
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
                      <Phone className="w-3.5 h-3.5" /> {labels.phone}
                    </button>
                  </div>
                  <input
                    type={contactMethod === 'email' ? 'email' : 'tel'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder={contactMethod === 'email' ? 'your@email.com' : '(626) 555-1234'}
                    required
                    aria-label={contactMethod === 'email' ? labels.email : labels.phone}
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
                  {loading ? labels.verifying : labels.accessPortal}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center space-y-1.5">
              <p className="text-xs text-ada-navy/35 font-outfit">
                {labels.idHint}
              </p>
              <p className="text-xs text-ada-navy/35 font-outfit">
                {labels.verifyDoula}{' '}
                <Link href="/verify" className="text-ada-purple hover:underline font-medium">
                  {labels.publicVerification} &rarr;
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
  const statusStyle = statusStyles[doula.status];
  const statusLabel = labels[`status_${doula.status}` as keyof typeof labels] as string || doula.status;

  return (
    <>
      {/* Header */}
      <section className="bg-ada-navy pt-32 pb-12 md:pt-40 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)',
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-ada-purple/20 flex items-center justify-center border-2 border-ada-purple/30 shrink-0">
                <User className="w-7 h-7 text-ada-purple" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Image src="/images/ada-logo-white.svg" alt="ADA" width={18} height={18} className="opacity-40" />
                  <span className="font-outfit text-xs font-semibold tracking-[0.2em] uppercase text-white/30">
                    {labels.credentialPortal}
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
                    statusStyle?.bg || 'bg-gray-50 text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle?.dot || 'bg-gray-400'}`} />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <LangToggle lang={lang} setLang={setLang} />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm font-outfit text-white/50 hover:text-white hover:border-white/20 transition-colors"
              >
                <LogOut className="w-4 h-4" /> {labels.signOut}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content — reordered: Certificates → Exams → Credentials → Profile */}
      <section className="py-12 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 space-y-12">

          {/* 1. Certificates — most important, doulas need to download their PDF */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              <FileText className="w-5 h-5 inline-block mr-2 text-ada-purple" />
              {labels.certificates}
            </h2>
            {certificates.filter(c => c.status === 'active').length === 0 ? (
              <p className="text-sm text-ada-navy/40 font-outfit">{labels.certificatesEmpty}</p>
            ) : (
              <div className="space-y-3">
                {certificates.filter(c => c.status === 'active').map((cert) => (
                  <div key={cert.id} className={`flex items-center justify-between border border-gray-200 rounded-xl px-6 py-4 ${cert.status !== 'active' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-ada-purple/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-ada-purple/60" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-outfit font-semibold text-ada-navy text-sm">{cert.certificate_number}</p>
                          {cert.status === 'superseded' && (
                            <span className="text-[10px] font-outfit font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
                              {labels.superseded}
                            </span>
                          )}
                          {cert.status === 'revoked' && (
                            <span className="text-[10px] font-outfit font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-500">
                              {lang === 'zh' ? '已撤销' : 'Revoked'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ada-navy/40 font-outfit">{labels.issued} {formatDate(cert.issued_date, lang)}</p>
                      </div>
                    </div>
                    {cert.pdf_url ? (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ada-purple text-white text-xs font-outfit font-semibold hover:bg-ada-purple-hover transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> {labels.download}
                      </a>
                    ) : (
                      <span className="text-xs text-ada-navy/20 font-outfit">{labels.noPdf}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Exam Results — second most important */}
          <ExamSection examResults={exam_results} lang={lang} />

          {/* 3. Credentials */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              <ShieldCheck className="w-5 h-5 inline-block mr-2 text-ada-purple" />
              {labels.credentials}
            </h2>
            {credentials.length === 0 ? (
              <p className="text-sm text-ada-navy/40 font-outfit">{labels.credentialsEmpty}</p>
            ) : (
              <div className={`grid gap-4 ${credentials.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-2'}`}>
                {credentials.map((cred) => {
                  const exp = expiryText(cred.expiration_date, lang);
                  const credLabel = labels[`cred_${cred.credential_type}` as keyof typeof labels] as string || cred.credential_type;

                  return (
                    <div key={cred.credential_type} className="border-2 border-ada-navy/10 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-outfit font-semibold text-ada-navy">
                          {credLabel}
                        </h3>
                        <StatusBadge status={cred.status} lang={lang} />
                      </div>
                      <div className="space-y-2 text-sm font-outfit">
                        <div className="flex justify-between">
                          <span className="text-ada-navy/40">{labels.certified}</span>
                          <span className="text-ada-navy">{formatDate(cred.certification_date, lang)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ada-navy/40">{labels.expires}</span>
                          <span className="text-ada-navy">{cred.expiration_date ? formatDate(cred.expiration_date, lang) : labels.permanent}</span>
                        </div>
                      </div>
                      {exp && (
                        <div className="mt-4 pt-3 border-t border-ada-navy/5">
                          <span className={`text-xs font-outfit font-semibold ${exp.color}`}>
                            {exp.text}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Profile */}
          <div>
            <h2 className="font-outfit font-semibold text-ada-navy text-lg mb-5">
              {labels.profile}
            </h2>
            <div className="border-2 border-ada-navy/10 rounded-2xl overflow-hidden">
              <div className="divide-y divide-ada-navy/5">
                {doula.email && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">{labels.email}</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.email}</span>
                  </div>
                )}
                {doula.phone && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">{labels.phone}</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.phone}</span>
                  </div>
                )}
                {doula.languages && doula.languages.length > 0 && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">{labels.languages}</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.languages.join(', ')}</span>
                  </div>
                )}
                {doula.region && (
                  <div className="flex justify-between items-center px-6 py-4">
                    <span className="text-sm text-ada-navy/40 font-outfit">{labels.region}</span>
                    <span className="text-sm font-outfit text-ada-navy">{doula.region}</span>
                  </div>
                )}
              </div>
              <div className="bg-ada-navy/[0.03] px-6 py-3 border-t border-ada-navy/10">
                <p className="text-xs text-ada-navy/30 font-outfit">
                  {labels.profileUpdateNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
