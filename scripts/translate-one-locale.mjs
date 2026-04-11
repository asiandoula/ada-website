/**
 * Translate messages/en.json to ONE locale.
 * Usage: OPENAI_API_KEY=sk-... node scripts/translate-one-locale.mjs <locale>
 */

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY env var');
  process.exit(1);
}

const [, , locale] = process.argv;
const LOCALE_NAMES = {
  'zh-cn': 'Simplified Chinese (Mandarin, Mainland China)',
  'zh-tw': 'Traditional Chinese (Taiwan)',
  'ja': 'Japanese',
  'ko': 'Korean',
};

if (!locale || !LOCALE_NAMES[locale]) {
  console.error('Usage: node translate-one-locale.mjs <zh-cn|zh-tw|ja|ko>');
  process.exit(1);
}

const languageName = LOCALE_NAMES[locale];
const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const source = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'en.json'), 'utf8'));

const CONTEXT = `You are translating UI strings for the Asian Doula Alliance (ADA), a non-profit organization that certifies postpartum doulas through culturally integrated training. Your translations should be:
- Professional and warm in tone
- Accurate for medical/certification terminology
- Natural and idiomatic in the target language, not word-for-word
- Concise, matching the length of the English original when possible
- Preserve any placeholders like {name} or {count} exactly
- Preserve HTML entities like &ldquo;, &amp; exactly as-is`;

// Translate one namespace at a time to avoid timeouts on large payloads
async function translateNamespace(nsName, nsContent) {
  const prompt = `${CONTEXT}

Translate the following JSON object from English to ${languageName}. Return ONLY the translated JSON, preserving the exact same structure and keys. Only translate the string values.

INPUT:
${JSON.stringify(nsContent, null, 2)}

OUTPUT (valid JSON only):`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

async function main() {
  const result = {};
  const namespaces = Object.keys(source);
  console.log(`[${locale}] Translating ${namespaces.length} namespaces...`);

  for (const ns of namespaces) {
    process.stdout.write(`[${locale}]   ${ns}... `);
    try {
      result[ns] = await translateNamespace(ns, source[ns]);
      console.log('ok');
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      result[ns] = source[ns]; // fallback to English
    }
  }

  const outPath = path.join(MESSAGES_DIR, `${locale}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
  console.log(`[${locale}] ✓ Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
