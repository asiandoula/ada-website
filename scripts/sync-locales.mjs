#!/usr/bin/env node
/**
 * Fill missing namespace keys in the non-English locales.
 *
 *   messages/en/<ns>.json     source of truth for keys and their order
 *   messages/zh-cn/<ns>.json  written by hand (formal Simplified Chinese). NEVER
 *                             filled by this script: missing keys are an error.
 *   messages/zh-tw/<ns>.json  missing keys ← zh-cn converted to Traditional
 *                             (← en if zh-cn lacks the key too, with a warning)
 *   messages/ja/<ns>.json     missing keys ← en (to be translated later)
 *   messages/ko/<ns>.json     missing keys ← en (to be translated later)
 *
 * Existing translations are never overwritten. Keys that are not in en are
 * removed (they would fail check-i18n). Files are rewritten in en's key order.
 * It also regenerates src/i18n/namespaces.ts from the files in messages/en/.
 *
 * Simplified → Traditional:
 *   - macOS with `swift`: ICU's "Hans-Hant" transform (phrase-aware), via
 *     scripts/lib/hans-hant.swift, one batch per run.
 *   - otherwise: built-in tables scripts/data/s2t-phrases.json (longest match
 *     first) + scripts/data/s2t-chars.json (generated from the same ICU data
 *     over GB2312). Character-level, so review the output.
 *   Either way the result is a draft: a Traditional reader should review it.
 *
 * Only messages/<locale>/<ns>.json files are touched. The legacy
 * messages/<locale>.json files are left alone.
 *
 * Usage:
 *   node scripts/sync-locales.mjs            write changes
 *   node scripts/sync-locales.mjs --check    report only; exit 1 if anything would change
 *   node scripts/sync-locales.mjs --engine=map   skip ICU, use the built-in tables
 */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const MESSAGES_DIR = join(ROOT, 'messages');
const NAMESPACES_TS = join(ROOT, 'src', 'i18n', 'namespaces.ts');

const CHECK = process.argv.includes('--check');
const FORCE_MAP = process.argv.includes('--engine=map');

const isPlainObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);
const rel = (p) => relative(ROOT, p);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function namespaceFiles(loc) {
  const dir = join(MESSAGES_DIR, loc);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => n.endsWith('.json')).map((n) => n.slice(0, -5)).sort();
}

function hasCjk(s) {
  return /[㐀-鿿]/.test(s);
}

// ---------- Simplified → Traditional ----------

const S2T_CHARS = readJson(join(__dirname, 'data', 's2t-chars.json'));
const S2T_PHRASES = readJson(join(__dirname, 'data', 's2t-phrases.json'));
const PHRASES_BY_LENGTH = Object.keys(S2T_PHRASES).sort((a, b) => b.length - a.length);

function convertWithTables(s) {
  let out = '';
  let i = 0;
  outer: while (i < s.length) {
    for (const p of PHRASES_BY_LENGTH) {
      if (s.startsWith(p, i)) {
        out += S2T_PHRASES[p];
        i += p.length;
        continue outer;
      }
    }
    const ch = s[i];
    out += S2T_CHARS[ch] ?? ch;
    i += 1;
  }
  return out;
}

function swiftAvailable() {
  if (FORCE_MAP || process.platform !== 'darwin') return false;
  const r = spawnSync('swift', ['--version'], { stdio: 'ignore' });
  return r.status === 0;
}

/** Convert many strings at once. Returns { values, engine }. */
function convertBatch(strings) {
  if (strings.length === 0) return { values: [], engine: 'none' };
  if (swiftAvailable()) {
    const dir = mkdtempSync(join(tmpdir(), 'ada-s2t-'));
    try {
      const inPath = join(dir, 'in.json');
      const outPath = join(dir, 'out.json');
      writeFileSync(inPath, JSON.stringify(strings));
      const r = spawnSync('swift', [join(__dirname, 'lib', 'hans-hant.swift'), inPath, outPath], {
        stdio: ['ignore', 'ignore', 'pipe'],
        timeout: 180_000,
      });
      if (r.status === 0 && existsSync(outPath)) {
        const values = readJson(outPath);
        if (Array.isArray(values) && values.length === strings.length) return { values, engine: 'icu' };
      }
      console.warn('[sync-locales] swift ICU conversion failed; using the built-in tables.');
      if (r.stderr?.length) console.warn(String(r.stderr).trim());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return { values: strings.map(convertWithTables), engine: 'map' };
}

// ---------- key walking ----------

/**
 * Rebuild `target` in en's shape and order. `fill(path, enValue)` returns the
 * value for a missing leaf. Records missing / removed paths.
 */
function rebuild(en, target, fill, path, report) {
  const out = {};
  for (const [k, enV] of Object.entries(en)) {
    const p = path ? `${path}.${k}` : k;
    const cur = isPlainObject(target) ? target[k] : undefined;
    if (isPlainObject(enV)) {
      if (cur !== undefined && !isPlainObject(cur)) report.replaced.push(p);
      out[k] = rebuild(enV, isPlainObject(cur) ? cur : {}, fill, p, report);
    } else if (cur !== undefined && !isPlainObject(cur)) {
      out[k] = cur;
    } else {
      report.filled.push(p);
      out[k] = fill(p, enV);
    }
  }
  if (isPlainObject(target)) {
    for (const k of Object.keys(target)) {
      if (!(k in en)) report.removed.push(path ? `${path}.${k}` : k);
    }
  }
  return out;
}

function getPath(obj, path) {
  let cur = obj;
  for (const part of path.split('.')) {
    if (!isPlainObject(cur) || !(part in cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

function missingPaths(en, target, path = '') {
  const out = [];
  for (const [k, v] of Object.entries(en)) {
    const p = path ? `${path}.${k}` : k;
    const cur = isPlainObject(target) ? target[k] : undefined;
    if (isPlainObject(v)) out.push(...missingPaths(v, isPlainObject(cur) ? cur : {}, p));
    else if (cur === undefined || isPlainObject(cur)) out.push(p);
  }
  return out;
}

// ---------- main ----------

const namespaces = namespaceFiles('en');
let problems = 0;
let wouldChange = 0;
const changes = [];

function writeIfChanged(path, data) {
  const next = JSON.stringify(data, null, 2) + '\n';
  const prev = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (prev === next) return false;
  wouldChange += 1;
  changes.push(rel(path));
  if (!CHECK) {
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, next);
  }
  return true;
}

// Pass 1: collect zh-cn strings that zh-tw needs, so ICU runs once.
const zhTwJobs = []; // { ns, path, source }
const loaded = {};
for (const ns of namespaces) {
  const en = readJson(join(MESSAGES_DIR, 'en', `${ns}.json`));
  const read = (loc) => {
    const p = join(MESSAGES_DIR, loc, `${ns}.json`);
    return existsSync(p) ? readJson(p) : {};
  };
  const zhCn = read('zh-cn');
  const zhTw = read('zh-tw');
  loaded[ns] = { en, zhCn, zhTw, ja: read('ja'), ko: read('ko') };
  for (const p of missingPaths(en, zhTw)) {
    const src = getPath(zhCn, p);
    if (typeof src === 'string' && hasCjk(src)) zhTwJobs.push({ ns, path: p, source: src });
  }
}

const { values: converted, engine } = convertBatch(zhTwJobs.map((j) => j.source));
const convertedByKey = new Map(zhTwJobs.map((j, i) => [`${j.ns}:${j.path}`, converted[i]]));

for (const ns of namespaces) {
  const { en, zhCn, zhTw, ja, ko } = loaded[ns];

  // zh-cn: report only.
  const zhCnMissing = missingPaths(en, zhCn);
  if (zhCnMissing.length) {
    problems += 1;
    console.error(`[sync-locales] messages/zh-cn/${ns}.json is missing ${zhCnMissing.length} key(s). Write them in Simplified Chinese:`);
    for (const p of zhCnMissing) console.error(`    - ${p}`);
  }

  // zh-tw
  const twReport = { filled: [], removed: [], replaced: [] };
  const twFallbackEn = [];
  const twOut = rebuild(en, zhTw, (p, enV) => {
    const key = `${ns}:${p}`;
    if (convertedByKey.has(key)) return convertedByKey.get(key);
    const src = getPath(zhCn, p);
    if (src !== undefined && !isPlainObject(src)) return src; // no CJK: copy as is
    twFallbackEn.push(p);
    return enV;
  }, '', twReport);
  writeIfChanged(join(MESSAGES_DIR, 'zh-tw', `${ns}.json`), twOut);
  if (twReport.filled.length) console.log(`[sync-locales] zh-tw/${ns}.json: filled ${twReport.filled.length} key(s) from zh-cn (${engine === 'icu' ? 'ICU Hans-Hant' : 'built-in tables'}).`);
  if (twFallbackEn.length) console.warn(`[sync-locales] zh-tw/${ns}.json: ${twFallbackEn.length} key(s) copied from en because zh-cn lacks them: ${twFallbackEn.join(', ')}`);

  // ja, ko
  for (const [loc, cur] of [['ja', ja], ['ko', ko]]) {
    const report = { filled: [], removed: [], replaced: [] };
    const out = rebuild(en, cur, (_p, enV) => enV, '', report);
    writeIfChanged(join(MESSAGES_DIR, loc, `${ns}.json`), out);
    if (report.filled.length) console.log(`[sync-locales] ${loc}/${ns}.json: filled ${report.filled.length} key(s) with English (translate later).`);
    if (report.removed.length) console.warn(`[sync-locales] ${loc}/${ns}.json: removed ${report.removed.length} key(s) not in en: ${report.removed.join(', ')}`);
  }
  if (twReport.removed.length) console.warn(`[sync-locales] zh-tw/${ns}.json: removed ${twReport.removed.length} key(s) not in en: ${twReport.removed.join(', ')}`);

  // zh-cn extras are reported, not removed (a human wrote them).
  const zhCnExtra = missingPaths(zhCn, en);
  if (zhCnExtra.length) {
    problems += 1;
    console.error(`[sync-locales] messages/zh-cn/${ns}.json has ${zhCnExtra.length} key(s) that en does not: ${zhCnExtra.join(', ')}`);
  }
}

// Locale folders with a namespace en does not have.
for (const loc of ['zh-cn', 'zh-tw', 'ja', 'ko']) {
  for (const ns of namespaceFiles(loc)) {
    if (!namespaces.includes(ns)) {
      problems += 1;
      console.error(`[sync-locales] messages/${loc}/${ns}.json has no English source messages/en/${ns}.json`);
    }
  }
}

// Regenerate the runtime namespace list.
const nsTs = readFileSync(NAMESPACES_TS, 'utf8');
const nextNsTs = nsTs.replace(
  /export const MESSAGE_NAMESPACES = \[[\s\S]*?\] as const;/,
  `export const MESSAGE_NAMESPACES = [\n${namespaces.map((n) => `  '${n}',`).join('\n')}\n] as const;`
);
if (nextNsTs !== nsTs) {
  wouldChange += 1;
  changes.push(rel(NAMESPACES_TS));
  if (!CHECK) writeFileSync(NAMESPACES_TS, nextNsTs);
}

if (changes.length) console.log(`[sync-locales] ${CHECK ? 'would change' : 'wrote'}: ${changes.join(', ')}`);
else console.log(`[sync-locales] ${namespaces.length} namespace(s) in sync.`);

if (problems || (CHECK && wouldChange)) process.exit(1);
