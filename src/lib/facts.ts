/**
 * ADA public facts: the single source of numbers and facts for public copy.
 *
 * Gate 2 of the 2026-11 build plan: every figure on a public page comes from
 * here, passed into messages as ICU arguments (`t('fee', { fee: usd(EXAM.feeUsd) })`).
 * A section whose fact is not here is removed, never filled with a placeholder.
 *
 * Each value was checked on 2026-11-05 against the live copy in messages/en.json
 * and the code; where they disagree the code wins (see notes).
 *
 * NOT STATED anywhere (do not write them, and do not invent them):
 *   CE hours, renewal window, grace period, late fee, registration deadline,
 *   accepted-ID list, arrival time, signatory, contact hours, trainer term.
 *   For ID, use only the build plan's generic wording: "bring a valid
 *   government-issued photo ID" (message key site.alert.body).
 *
 * Registry counts (doulas in good standing, certificates issued) are NOT facts
 * to hard-code: read them live from the database or leave them out.
 */
import { HIGHLY_PROFICIENT_SCORE, PASS_SCORE } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Examination
// ---------------------------------------------------------------------------

export const EXAM = {
  /** en.json certPostpartum.examFeeValue / certExam.examFeeValue. Paid to ADA. */
  feeUsd: 625,
  /** en.json certExam.retakeFeeValue. */
  retakeFeeUsd: 325,
  /** en.json certExam.faqFailExamAnswer: "wait at least 30 days before retaking". */
  retakeWaitDays: 30,
  /** en.json certExam.examDuration: "60-minute timed examination". */
  writtenMinutes: 60,
  /** en.json certExam.practicalExamDuration: "30-minute one-on-one evaluation". */
  practicalMinutes: 30,
  /** The practical exam is one-on-one with an examiner. */
  practicalOneOnOne: true,
  /** `PASS_SCORE` in src/lib/utils.ts (used by the admin exam-entry code). */
  passScore: PASS_SCORE,
  maxScore: 100,
  /**
   * Results by email in about 7–10 business days (build plan; ADA-Brain
   * certification-exam.md). NOTE: live en.json certExam.faqCertificationTimeAnswer
   * still says "within 2 weeks"; page agents rewriting that page use this value.
   */
  resultsBusinessDays: { min: 7, max: 10 },
  /**
   * en.json certExam.faqExamLocationAnswer. May appear ONLY as the exam location.
   * Never describe it as an ADA training site (banned phrase, see check-banned).
   */
  location: {
    street: '7515 Irvine Center Drive, #110',
    city: 'Irvine',
    state: 'CA',
    zip: '92618',
    oneLine: '7515 Irvine Center Drive, #110, Irvine, CA 92618',
  },
} as const;

export type ProficiencyKey = 'highlyProficient' | 'proficient' | 'notProficient';

export interface ProficiencyLevel {
  key: ProficiencyKey;
  /** English label exactly as stored by computeProficiencyLevel() in utils.ts. */
  label: 'Highly Proficient' | 'Proficient' | 'Not Proficient';
  /** Inclusive lower bound, out of 100. */
  min: number;
  /** Exclusive upper bound, out of 100 (scores are averages and can be fractional). */
  below: number | null;
}

/** Cutoffs from computeProficiencyLevel() in src/lib/utils.ts: 90+ / 70–89 / below 70. */
export const PROFICIENCY_LEVELS: readonly ProficiencyLevel[] = [
  { key: 'highlyProficient', label: 'Highly Proficient', min: HIGHLY_PROFICIENT_SCORE, below: null },
  { key: 'proficient', label: 'Proficient', min: PASS_SCORE, below: HIGHLY_PROFICIENT_SCORE },
  { key: 'notProficient', label: 'Not Proficient', min: 0, below: PASS_SCORE },
] as const;

// ---------------------------------------------------------------------------
// Certificate and renewal
// ---------------------------------------------------------------------------

export const CERTIFICATE = {
  /**
   * Code: migration 009 sets expiry = certification date + 1 year, and
   * /api/certificates/generate defaults to +1 year. en.json certExam /
   * certPostpartum / renewCert agree. NOTE: en.json
   * certifications.trackPostpartumDoulaFacts still says "3-year validity" (stale).
   */
  validityYears: 1,
} as const;

export const RENEWAL = {
  /** en.json renewCert.renewalCost / certPostpartum.renewalFeeValue. */
  feeUsd: 100,
} as const;

// ---------------------------------------------------------------------------
// Languages, training
// ---------------------------------------------------------------------------

export type ProgramLanguage = 'en' | 'zh' | 'ja' | 'ko';

/**
 * Training and exam languages: English, Chinese (Mandarin), Japanese, Korean
 * (en.json certSteps.faq3A, certExam.faqNativeLanguageAnswer). Cantonese and
 * "5 languages" appear elsewhere in en.json but are not confirmed: do not use.
 * `name` is the English name; pages translate via messages.
 */
export const PROGRAM_LANGUAGES: readonly { code: ProgramLanguage; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese (Mandarin)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
] as const;

export type ModuleKey =
  | 'postpartumRecovery'
  | 'newbornCare'
  | 'breastfeedingSupport'
  | 'culturalTraditions'
  | 'nutrition'
  | 'emotionalWellness'
  | 'safetyEmergency';

/** The 7 modules, in order (src/app/(public)/for-families/how-we-train/page.tsx). */
export const TRAINING_MODULES: readonly { key: ModuleKey; title: string }[] = [
  { key: 'postpartumRecovery', title: 'Postpartum Recovery' },
  { key: 'newbornCare', title: 'Newborn Care' },
  { key: 'breastfeedingSupport', title: 'Breastfeeding Support' },
  { key: 'culturalTraditions', title: 'Cultural Traditions' },
  { key: 'nutrition', title: 'Nutrition & Meal Planning' },
  { key: 'emotionalWellness', title: 'Emotional Wellness' },
  { key: 'safetyEmergency', title: 'Safety & Emergency' },
] as const;

export const TRAINING = {
  /** en.json home.intensiveProgram / certSteps.faq1A: "4-5 days of intensive instruction". */
  inPersonDays: { min: 4, max: 5 },
  moduleCount: TRAINING_MODULES.length,
  /** Infant CPR from the American Red Cross is included (module 7; CERT_TYPE_LABELS.cpr). */
  cpr: { provider: 'American Red Cross', course: 'Infant CPR', included: true },
} as const;

// ---------------------------------------------------------------------------
// Recognition
// ---------------------------------------------------------------------------

/**
 * Insurers and benefit platforms that recognize ADA certification
 * (en.json renewCert.insurancePartnersList, certSteps.insuranceRecognition).
 * Proper nouns: never translated.
 */
export const INSURANCE_RECOGNITION = [
  'Medi-Cal',
  'Kaiser',
  'Cigna',
  'IEHP',
  'Carrot Fertility',
  'Progyny',
] as const;

// ---------------------------------------------------------------------------
// Contact and entity
// ---------------------------------------------------------------------------

export const CONTACT = {
  email: 'contact@asiandoula.org',
  phone: { display: '+1 (714) 202-6501', tel: '+17142026501' },
} as const;

/** ADA-Brain 00-start-here + 04-legal-compliance (IRS determination letter); live footer for EIN and address. */
export const ENTITY = {
  dba: 'Asian Doula Alliance',
  legalName: 'Turing Learning Center',
  /** English legal description. Pages translate the descriptive words, never the names. */
  corporation: 'California nonprofit public benefit corporation',
  /** IRS designation, written the same in every locale. */
  taxCode: '501(c)(3)',
  /** IRS determination letter: public charity under 170(b)(1)(A)(vi), effective 2023-09-29. */
  taxStatus: '501(c)(3) public charity',
  ein: '93-3935047',
  address: {
    street: '20 Fairbanks, Suite 184',
    city: 'Irvine',
    state: 'CA',
    zip: '92618',
    oneLine: '20 Fairbanks, Suite 184, Irvine, CA 92618',
  },
} as const;

export const SITE = {
  origin: 'https://asiandoula.org',
  host: 'asiandoula.org',
} as const;

// ---------------------------------------------------------------------------
// Formatting helpers (so copy never hand-types a number)
// ---------------------------------------------------------------------------

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** 625 → "$625". Dollar amounts are written the same way in every locale. */
export function usd(amount: number): string {
  return usdFormat.format(amount);
}

/** {min: 7, max: 10} → "7–10" (en dash). */
export function range(r: { min: number; max: number }): string {
  return `${r.min}–${r.max}`;
}

/** Everything above in one object, for pages that prefer `FACTS.exam.feeUsd`. */
export const FACTS = {
  exam: EXAM,
  proficiency: PROFICIENCY_LEVELS,
  certificate: CERTIFICATE,
  renewal: RENEWAL,
  languages: PROGRAM_LANGUAGES,
  training: TRAINING,
  modules: TRAINING_MODULES,
  insurers: INSURANCE_RECOGNITION,
  contact: CONTACT,
  entity: ENTITY,
  site: SITE,
} as const;
