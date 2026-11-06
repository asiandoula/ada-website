import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateDoulaIdCode(): string {
  const year = new Date().getFullYear().toString().slice(2);
  const seq = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0');
  return `#${year}-${seq}`;
}

export function generateVerificationCode(): string {
  return nanoid(8);
}

export function generateCertificateNumber(
  type: 'postpartum' | 'birth' | 'trainer' | 'cpr',
  sequence: number
): string {
  const year = new Date().getFullYear();
  const prefix =
    type === 'postpartum' ? 'PD' : type === 'birth' ? 'BD' : type === 'trainer' ? 'TR' : 'CPR';
  return `ADA-${prefix}-${year}-${sequence.toString().padStart(4, '0')}`;
}

/** Pass mark out of 100. Also the lower bound of "Proficient". */
export const PASS_SCORE = 70;
/** Lower bound of "Highly Proficient", out of 100. */
export const HIGHLY_PROFICIENT_SCORE = 90;

export function computeProficiencyLevel(score: number | null): string | null {
  if (score === null || score === undefined) return null;
  if (score >= HIGHLY_PROFICIENT_SCORE) return 'Highly Proficient';
  if (score >= PASS_SCORE) return 'Proficient';
  return 'Not Proficient';
}
