#!/usr/bin/env node
/**
 * One-shot fixer: converts HTML entities in messages/*.json string values
 * to their Unicode equivalents. Preserves key order and produces 2-space
 * pretty-printed output with a trailing newline (matching existing style).
 *
 * Substitution map — per P9 spec (fix/html-entities-in-i18n):
 *   &rarr;  → →  (U+2192)
 *   &darr;  → ↓  (U+2193)
 *   &ldquo; → "  (U+201C)
 *   &rdquo; → "  (U+201D)
 *   &apos;  → '  (U+2019 — typographic, NOT ASCII apostrophe)
 *   &amp;   → &
 *
 * Safe to run more than once (idempotent).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const MESSAGES_DIR = join(ROOT, 'messages');

const LOCALES = ['en', 'ja', 'ko', 'zh-cn', 'zh-tw'];

const ENTITY_MAP = {
  '&rarr;': '\u2192',
  '&darr;': '\u2193',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&apos;': '\u2019',
  '&amp;': '&',
};

function replaceEntities(s) {
  let out = s;
  for (const [ent, uni] of Object.entries(ENTITY_MAP)) {
    out = out.split(ent).join(uni);
  }
  return out;
}

function walk(node) {
  if (typeof node === 'string') return replaceEntities(node);
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v);
    return out;
  }
  return node;
}

let totalReplacements = 0;

for (const loc of LOCALES) {
  const path = join(MESSAGES_DIR, `${loc}.json`);
  const raw = readFileSync(path, 'utf8');
  const json = JSON.parse(raw);

  // Count entities in source for logging (per-file).
  const before = (raw.match(/&(rarr|darr|ldquo|rdquo|apos|amp);/g) || []).length;

  const fixed = walk(json);
  const next = JSON.stringify(fixed, null, 2) + '\n';
  writeFileSync(path, next, 'utf8');

  const after = (next.match(/&(rarr|darr|ldquo|rdquo|apos|amp);/g) || []).length;
  totalReplacements += before - after;
  console.log(`${loc}.json: ${before} → ${after} entities (replaced ${before - after})`);
}

console.log(`\nDone. Total replacements: ${totalReplacements}`);
