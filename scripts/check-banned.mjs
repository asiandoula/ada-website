#!/usr/bin/env node
/**
 * Banned-copy gate (2026-11 build plan, gates 2 and 4). Runs in `npm run build`.
 *
 * Fails if it finds, in messages/** or src/** (see EXCLUDE):
 *   - a placeholder in brackets, e.g. [EXAM SITE] or [CONTACT HOURS — CONFIRM]
 *   - a banned word or phrase, in any locale (list below)
 * and prints file:line:column for every hit.
 *
 * Allowed on purpose: the exam-site address (7515 Irvine Center Drive) as the
 * exam location only, which this script cannot judge; review it by hand.
 *
 * Usage: node scripts/check-banned.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

const SCAN_DIRS = ['messages', 'src'];
const SCAN_EXT = /\.(json|ts|tsx|js|jsx|mjs|css|md|mdx)$/;

/** Not public copy, or legal text that is reviewed separately. Paths use "/". */
const EXCLUDE = [
  /^src\/app\/admin\//, // admin UI (English only, staff-facing)
  /^src\/app\/\(public\)\/privacy-policy\//, // legal text
  /^src\/app\/\(public\)\/terms-of-service\//, // legal text
  /^src\/lib\/auth\/access\.ts$/, // admin sign-in email-domain allowlist (functional code, not copy)
];

const PLACEHOLDER = /\[[A-Z][A-Z0-9 ,:—/&'\-]{2,}\]/g;
/** Regex character classes such as [A-Z0-9] look like placeholders; skip them. */
const REGEX_CLASS = /A-Z|a-z|0-9/;

const BANNED = [
  { label: 'Cooings', re: /cooings/gi },
  { label: '可以阿姨', re: /可以阿姨/g },
  { label: '助产士', re: /助产士/g },
  { label: '助產士 (Traditional 助产士)', re: /助產士/g },
  { label: '月嫂', re: /月嫂/g },
  { label: 'accredited', re: /\baccredited\b/gi },
  { label: 'licensed', re: /\blicensed\b/gi },
  { label: '"the only"', re: /\bthe only\b/gi },
  { label: '"gold standard"', re: /\bgold[\s-]+standard\b/gi },
  { label: '"Asian Doula & Alliance"', re: /Asian Doula\s*(?:&|&amp;|and)\s*Alliance/gi },
  { label: '"ADA training center"', re: /\bADA training cent(?:er|re)\b/gi },
  { label: '949-229-5029', re: /\(?949\)?[\s.\-]*229[\s.\-]*5029/g },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (SCAN_EXT.test(name)) out.push(p);
  }
  return out;
}

const hits = []; // { file, line, col, kind, text, snippet }

for (const d of SCAN_DIRS) {
  for (const abs of walk(join(ROOT, d))) {
    const file = relative(ROOT, abs).split(sep).join('/');
    if (EXCLUDE.some((re) => re.test(file))) continue;
    const lines = readFileSync(abs, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const m of line.matchAll(PLACEHOLDER)) {
        if (REGEX_CLASS.test(m[0])) continue;
        hits.push({ file, line: i + 1, col: m.index + 1, kind: 'placeholder', text: m[0], snippet: line });
      }
      for (const { label, re } of BANNED) {
        for (const m of line.matchAll(re)) {
          hits.push({ file, line: i + 1, col: m.index + 1, kind: label, text: m[0], snippet: line });
        }
      }
    });
  }
}

if (hits.length === 0) {
  console.log('[banned] OK — no placeholders or banned words in messages/ or src/');
  process.exit(0);
}

const clip = (s) => {
  const t = s.trim();
  return t.length > 140 ? t.slice(0, 137) + '...' : t;
};

console.error(`\n[banned] ERROR: ${hits.length} hit(s) in ${new Set(hits.map((h) => h.file)).size} file(s):`);
for (const h of hits) {
  console.error(`  ${h.file}:${h.line}:${h.col}  ${h.kind}  "${h.text}"`);
  console.error(`      ${clip(h.snippet)}`);
}

const byKind = {};
for (const h of hits) byKind[h.kind] = (byKind[h.kind] ?? 0) + 1;
console.error(`\n[banned] by kind: ${Object.entries(byKind).map(([k, n]) => `${k} ×${n}`).join(' · ')}`);
console.error('[banned] FAIL');
process.exit(1);
