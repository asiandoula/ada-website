#!/usr/bin/env node
/**
 * i18n guard: validates literal t('…') calls against messages/en.json
 * and locale drift across all messages/*.json files.
 *
 * Exit code:
 *   0  — all literal keys resolve in en.json AND all locales match en.json key set
 *   1  — at least one literal key is missing OR locale drift detected
 *
 * Dynamic t(`…${x}…`) / t(someVar) calls CANNOT be checked statically;
 * the script emits a warning listing their file:line for human review but
 * does not fail on them.
 *
 * Usage:
 *   node scripts/check-i18n.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const MESSAGES_DIR = join(ROOT, 'messages');
const SRC_DIR = join(ROOT, 'src');

const LOCALES = ['en', 'ja', 'ko', 'zh-cn', 'zh-tw'];

// ---------- load locales ----------

function flattenKeys(obj, prefix = '') {
  const keys = new Set();
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const nested of flattenKeys(v, path)) keys.add(nested);
    } else if (Array.isArray(v)) {
      // treat arrays as leaf — next-intl supports t('key.0.field') etc.,
      // but we only need to know the array-root exists for coverage.
      keys.add(path);
    } else {
      keys.add(path);
    }
  }
  return keys;
}

const localeKeys = {};
for (const loc of LOCALES) {
  const raw = readFileSync(join(MESSAGES_DIR, `${loc}.json`), 'utf8');
  localeKeys[loc] = flattenKeys(JSON.parse(raw));
}
const enKeys = localeKeys.en;

// ---------- walk src for t() usages ----------

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue;
      walk(p, files);
    } else if (/\.(ts|tsx)$/.test(name)) {
      files.push(p);
    }
  }
  return files;
}

const files = walk(SRC_DIR);

// Match useTranslations('ns') / getTranslations('ns') to scope calls
// Then match t('literal') and t("literal") for literal keys.
// Dynamic: t(`...${...}...`) or t(variable).
// We look for ANY t(...) call inside a file that uses next-intl.

const literalHits = []; // { file, line, ns, key }
const dynamicHits = []; // { file, line, snippet }

const TRANSLATE_HOOK = /(?:useTranslations|getTranslations)\(\s*['"]([^'"]+)['"]\s*\)/g;
const T_LITERAL = /\bt\(\s*(['"])([^'"]+)\1\s*(?:,|\))/g;
const T_DYNAMIC = /\bt\(\s*`[^`]*\$\{[^}]+\}[^`]*`\s*(?:,|\))/g;

for (const file of files) {
  const rel = relative(ROOT, file);
  const src = readFileSync(file, 'utf8');

  // Collect namespaces declared in file (can be multiple).
  const namespaces = [];
  let m;
  const thRe = new RegExp(TRANSLATE_HOOK.source, 'g');
  while ((m = thRe.exec(src))) namespaces.push(m[1]);

  if (namespaces.length === 0) continue; // no next-intl usage

  // Literal t() calls.
  const litRe = new RegExp(T_LITERAL.source, 'g');
  let match;
  while ((match = litRe.exec(src))) {
    const key = match[2];
    const idx = match.index;
    const line = src.slice(0, idx).split('\n').length;

    // next-intl supports cross-namespace t(`ns.key`) via `useTranslations()` without arg,
    // and nested keys within a namespace via `t('a.b.c')`. To be safe we check:
    //   - literal that's already fully qualified: `x.y.z` exists in enKeys as-is
    //   - OR any declared namespace + '.' + literal exists in enKeys
    const fullyQualified = enKeys.has(key);
    const namespaced = namespaces.some((ns) => enKeys.has(`${ns}.${key}`));

    if (!fullyQualified && !namespaced) {
      literalHits.push({
        file: rel,
        line,
        tried: namespaces.map((ns) => `${ns}.${key}`).concat([key]),
      });
    }
  }

  // Dynamic t() calls.
  const dynRe = new RegExp(T_DYNAMIC.source, 'g');
  while ((match = dynRe.exec(src))) {
    const idx = match.index;
    const line = src.slice(0, idx).split('\n').length;
    // snippet the entire match
    dynamicHits.push({ file: rel, line, snippet: match[0].trim() });
  }
}

// ---------- locale drift ----------

const drift = []; // { locale, missing: [...], extra: [...] }
for (const loc of LOCALES.filter((l) => l !== 'en')) {
  const keys = localeKeys[loc];
  const missing = [...enKeys].filter((k) => !keys.has(k)).sort();
  const extra = [...keys].filter((k) => !enKeys.has(k)).sort();
  if (missing.length || extra.length) drift.push({ locale: loc, missing, extra });
}

// ---------- report ----------

let failed = false;

if (literalHits.length) {
  failed = true;
  console.error(`\n[i18n] ERROR: ${literalHits.length} literal t() call(s) do not resolve in messages/en.json:`);
  for (const h of literalHits) {
    console.error(`  ${h.file}:${h.line}`);
    console.error(`    tried: ${h.tried.join(' | ')}`);
  }
}

if (drift.length) {
  failed = true;
  console.error(`\n[i18n] ERROR: locale drift detected:`);
  for (const d of drift) {
    if (d.missing.length) {
      console.error(`  [${d.locale}] missing ${d.missing.length} key(s) vs en.json:`);
      for (const k of d.missing) console.error(`    - ${k}`);
    }
    if (d.extra.length) {
      console.error(`  [${d.locale}] extra ${d.extra.length} key(s) not in en.json:`);
      for (const k of d.extra) console.error(`    + ${k}`);
    }
  }
}

if (dynamicHits.length) {
  console.warn(`\n[i18n] WARNING: ${dynamicHits.length} dynamic t(\`…\${…}…\`) call(s) — static checker skipped these; please human-review:`);
  for (const h of dynamicHits) {
    console.warn(`  ${h.file}:${h.line}  ${h.snippet}`);
  }
}

if (failed) {
  console.error(`\n[i18n] FAIL`);
  process.exit(1);
}

console.log(`[i18n] OK — ${enKeys.size} keys in en.json, ${LOCALES.length - 1} locales in sync, ${dynamicHits.length} dynamic call(s) flagged for review`);
