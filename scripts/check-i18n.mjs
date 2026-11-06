#!/usr/bin/env node
/**
 * i18n guard: validates literal t('…') calls against the merged English
 * messages and locale drift across all locales.
 *
 * Messages per locale = legacy messages/<locale>.json, with every namespace
 * file messages/<locale>/<ns>.json deep-merged over it under key <ns> (the
 * namespace file wins). This is the same merge as src/i18n/request.ts.
 * Every check below runs on the merged result.
 *
 * Also checks that src/i18n/namespaces.ts lists exactly the files in
 * messages/en/ (run `node scripts/sync-locales.mjs` to regenerate it), and
 * that no locale has a namespace file en does not have.
 *
 * Exit code:
 *   0  — all literal keys resolve in merged en AND all locales match en's key set
 *   1  — a literal key is missing, locale drift, HTML entities, or namespace mismatch
 *
 * Dynamic t(`…${x}…`) / t(someVar) calls CANNOT be checked statically;
 * the script emits a warning listing their file:line for human review but
 * does not fail on them.
 *
 * Usage:
 *   node scripts/check-i18n.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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

// Collect every string leaf with its dotted key path. Used for HTML-entity
// detection — React escapes `&` when it comes from a JS expression (like
// `{t('key')}`), so any entity in a translation value renders as raw text.
function flattenLeaves(obj, prefix = '') {
  const leaves = []; // { key, value }
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      leaves.push(...flattenLeaves(v, path));
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'string') leaves.push({ key: `${path}.${i}`, value: item });
        else if (item && typeof item === 'object') leaves.push(...flattenLeaves(item, `${path}.${i}`));
      });
    } else if (typeof v === 'string') {
      leaves.push({ key: path, value: v });
    }
  }
  return leaves;
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Same semantics as deepMerge() in src/i18n/request.ts: `over` wins.
function deepMerge(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] = isPlainObject(out[k]) && isPlainObject(v) ? deepMerge(out[k], v) : v;
  }
  return out;
}

function namespaceFiles(loc) {
  const dir = join(MESSAGES_DIR, loc);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => n.endsWith('.json')).map((n) => n.slice(0, -5)).sort();
}

const namespaceErrors = [];

// The runtime loads only the namespaces listed in src/i18n/namespaces.ts.
const NAMESPACES_TS = join(ROOT, 'src', 'i18n', 'namespaces.ts');
const nsSource = readFileSync(NAMESPACES_TS, 'utf8');
const nsBlock = /MESSAGE_NAMESPACES\s*=\s*\[([\s\S]*?)\]/.exec(nsSource);
const registered = nsBlock ? [...nsBlock[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]).sort() : [];
const enNamespaces = namespaceFiles('en');
for (const ns of enNamespaces) {
  if (!registered.includes(ns)) namespaceErrors.push(`messages/en/${ns}.json is not listed in src/i18n/namespaces.ts (run: node scripts/sync-locales.mjs)`);
}
for (const ns of registered) {
  if (!enNamespaces.includes(ns)) namespaceErrors.push(`src/i18n/namespaces.ts lists "${ns}" but messages/en/${ns}.json does not exist`);
}

const localeKeys = {};
const localeJson = {};
for (const loc of LOCALES) {
  let merged = JSON.parse(readFileSync(join(MESSAGES_DIR, `${loc}.json`), 'utf8'));
  for (const ns of namespaceFiles(loc)) {
    if (!enNamespaces.includes(ns)) {
      namespaceErrors.push(`messages/${loc}/${ns}.json has no English source messages/en/${ns}.json`);
    }
    let body;
    try {
      body = JSON.parse(readFileSync(join(MESSAGES_DIR, loc, `${ns}.json`), 'utf8'));
    } catch (err) {
      namespaceErrors.push(`messages/${loc}/${ns}.json is not valid JSON: ${err.message}`);
      continue;
    }
    if (!isPlainObject(body)) {
      namespaceErrors.push(`messages/${loc}/${ns}.json must be a JSON object (the namespace body)`);
      continue;
    }
    merged = { ...merged, [ns]: deepMerge(isPlainObject(merged[ns]) ? merged[ns] : {}, body) };
  }
  localeJson[loc] = merged;
  localeKeys[loc] = flattenKeys(merged);
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

// ---------- HTML entity check (all locales) ----------
//
// React escapes `&` when a string comes from a JS expression (e.g.
// `{t('key')}` or a JSON-loaded message), so entities like `&rarr;` render
// as literal text instead of the intended arrow. This walks every string
// leaf across all locales and fails hard on any `&<name>;` occurrence.
//
// The pattern matches named entities (`&rarr;`, `&ldquo;`, `&apos;`, ...)
// and numeric ones (`&#8594;`, `&#x2192;`). We intentionally do not
// whitelist — translators should use the Unicode character directly.

const ENTITY_PATTERN = /&(?:[a-zA-Z][a-zA-Z0-9]+|#\d+|#x[0-9a-fA-F]+);/g;
const entityHits = []; // { locale, key, snippet, entities: [...] }

for (const loc of LOCALES) {
  for (const { key, value } of flattenLeaves(localeJson[loc])) {
    const matches = value.match(ENTITY_PATTERN);
    if (matches && matches.length) {
      entityHits.push({
        locale: loc,
        key,
        snippet: value.length > 120 ? value.slice(0, 117) + '...' : value,
        entities: [...new Set(matches)],
      });
    }
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

if (namespaceErrors.length) {
  failed = true;
  console.error(`\n[i18n] ERROR: ${namespaceErrors.length} namespace file problem(s):`);
  for (const e of namespaceErrors) console.error(`  ${e}`);
}

if (literalHits.length) {
  failed = true;
  console.error(`\n[i18n] ERROR: ${literalHits.length} literal t() call(s) do not resolve in the merged English messages:`);
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
      console.error(`  [${d.locale}] missing ${d.missing.length} key(s) vs en (merged):`);
      for (const k of d.missing) console.error(`    - ${k}`);
    }
    if (d.extra.length) {
      console.error(`  [${d.locale}] extra ${d.extra.length} key(s) not in en (merged):`);
      for (const k of d.extra) console.error(`    + ${k}`);
    }
  }
}

if (entityHits.length) {
  failed = true;
  console.error(
    `\n[i18n] ERROR: ${entityHits.length} translation string(s) contain HTML entities.`
  );
  console.error(
    `  React escapes \`&\` when a string comes from an expression, so entities like`
  );
  console.error(
    `  \`&rarr;\` render as raw text. Use Unicode characters directly (e.g. →, ", ').`
  );
  for (const h of entityHits) {
    console.error(`  [${h.locale}] ${h.key}  (${h.entities.join(', ')})`);
    console.error(`    "${h.snippet}"`);
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

console.log(`[i18n] OK — ${enKeys.size} keys in merged en (legacy + ${enNamespaces.length} namespace file(s)), ${LOCALES.length - 1} locales in sync, 0 HTML entities, ${dynamicHits.length} dynamic call(s) flagged for review`);
