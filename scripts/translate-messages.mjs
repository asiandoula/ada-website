/**
 * Translate messages/en.json to all other locales using OpenAI.
 * Usage: OPENAI_API_KEY=sk-... node scripts/translate-messages.mjs
 *
 * Reads messages/en.json and writes messages/{zh-cn,zh-tw,ja,ko}.json
 * Uses gpt-4o-mini for cost efficiency.
 */

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY env var');
  process.exit(1);
}

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SOURCE = path.join(MESSAGES_DIR, 'en.json');

const LOCALES = {
  'zh-cn': 'Simplified Chinese (Mandarin, Mainland China)',
  'zh-tw': 'Traditional Chinese (Taiwan)',
  'ja': 'Japanese',
  'ko': 'Korean',
};

const CONTEXT = `You are translating UI strings for the Asian Doula Alliance (ADA), a non-profit organization that certifies postpartum doulas through culturally integrated training. Your translations should be:
- Professional and warm in tone
- Accurate for medical/certification terminology
- Natural and idiomatic in the target language, not word-for-word
- Concise, matching the length of the English original when possible
- Preserve any placeholders like {name} or {count} exactly`;

async function translateToLocale(sourceObj, locale, languageName) {
  console.log(`\n→ Translating to ${locale} (${languageName})...`);

  const prompt = `${CONTEXT}

Translate the following JSON object from English to ${languageName}. Return ONLY the translated JSON, preserving the exact same structure and keys. Only translate the string values.

INPUT:
${JSON.stringify(sourceObj, null, 2)}

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
    console.error(`  FAILED: ${res.status} ${err}`);
    return null;
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error(`  Parse error: ${e.message}`);
    console.error(`  Raw output: ${content.slice(0, 200)}`);
    return null;
  }
}

async function main() {
  const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
  console.log(`Loaded ${SOURCE}`);
  console.log(`Top-level keys: ${Object.keys(source).join(', ')}`);

  for (const [locale, languageName] of Object.entries(LOCALES)) {
    const translated = await translateToLocale(source, locale, languageName);
    if (!translated) {
      console.error(`  Skipping ${locale}`);
      continue;
    }
    const outPath = path.join(MESSAGES_DIR, `${locale}.json`);
    fs.writeFileSync(outPath, JSON.stringify(translated, null, 2) + '\n');
    console.log(`  ✓ Wrote ${outPath}`);
  }

  console.log('\nDone.');
}

main().catch(console.error);
