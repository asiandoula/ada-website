import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateDoulaIdCode(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0');
  return `ADA-${year}-${seq}`;
}

export function generateVerificationCode(): string {
  return nanoid(8);
}

export function generateCertificateNumber(
  type: 'postpartum' | 'birth' | 'cpr',
  sequence: number
): string {
  const year = new Date().getFullYear();
  const prefix = type === 'postpartum' ? 'PD' : type === 'birth' ? 'BD' : 'CPR';
  return `ADA-${prefix}-${year}-${sequence.toString().padStart(4, '0')}`;
}

export function computeProficiencyLevel(score: number | null): string | null {
  if (score === null || score === undefined) return null;
  if (score > 95) return 'Highly Proficient';
  if (score > 85) return 'Proficient';
  return 'Not Proficient';
}
