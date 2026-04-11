/**
 * Auto-migrate a page to use next-intl translations.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... node scripts/i18n-migrate-page.mjs <page-path> <namespace>
 *
 * Example:
 *   node scripts/i18n-migrate-page.mjs "src/app/(public)/about-us/page.tsx" aboutUs
 *
 * What it does:
 * 1. Reads the page.tsx file
 * 2. Sends to GPT-4o-mini with instructions to:
 *    - Extract all user-visible English strings
 *    - Return JSON keys (as `messages` object)
 *    - Return rewritten page file using t() calls from `<namespace>` namespace
 * 3. Adds the new keys to messages/en.json under the given namespace
 * 4. Writes the rewritten page file back
 *
 * After running, you still need to:
 * - Run `node scripts/translate-messages.mjs` to translate to other locales
 * - `npm run build` to verify
 */

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY env var');
  process.exit(1);
}

const [, , pagePath, namespace] = process.argv;
if (!pagePath || !namespace) {
  console.error('Usage: node i18n-migrate-page.mjs <page-path> <namespace>');
  process.exit(1);
}

const ROOT = process.cwd();
const absPagePath = path.join(ROOT, pagePath);
const messagesPath = path.join(ROOT, 'messages/en.json');

if (!fs.existsSync(absPagePath)) {
  console.error(`File not found: ${absPagePath}`);
  process.exit(1);
}

const pageSource = fs.readFileSync(absPagePath, 'utf8');
console.log(`Processing ${pagePath} (${pageSource.length} chars)`);

const PROMPT = `You are migrating a Next.js 14 page to use the \`next-intl\` library for translations.

## Task

Rewrite the given page file to replace all hardcoded user-visible English strings with \`t('key')\` calls.

## Rules

1. The page currently is either a server component (async function) OR a client component ('use client').
2. For server components:
   - Add: \`import { getTranslations } from 'next-intl/server';\`
   - Inside the async function: \`const t = await getTranslations('${namespace}');\`
3. For client components ('use client'):
   - Add: \`import { useTranslations } from 'next-intl';\`
   - Inside the component: \`const t = useTranslations('${namespace}');\`
4. Replace every hardcoded English user-visible string with \`{t('keyName')}\` or \`t('keyName')\`.
5. **DO NOT translate**:
   - metadata fields (title, description, openGraph)
   - aria-label values (accessibility, keep in English)
   - alt text for images (keep in English)
   - CSS class names or any technical identifiers
   - HTML entities or &rdquo; etc
   - Phone numbers, emails, URLs, addresses
   - Already-dynamic strings from props/state/database
6. Preserve ALL existing styling, layout, imports, logic, components.
7. Generate DESCRIPTIVE camelCase key names (e.g., 'heroTitle', 'missionStatement', 'aboutAdaDescription'), not generic ones like 'text1'.
8. If the page has a \`metadata\` export, leave that as-is (server-rendered metadata, not via t()).
9. If the page has \`const arrays\` with text data (like values, steps, FAQ items) defined outside the component, you MUST move them INSIDE the component function body (after \`const t = ...\`) AND transform each text field to use \`t('key')\`. DO NOT delete these arrays — they are still referenced in the JSX. Verify by checking the JSX references them (e.g. \`<Accordion items={faqItems} />\`).
10. Keep testimonial quotes / real person names in English (don't translate user-generated content).
11. CRITICAL: Before returning, mentally check: if the original file had \`const X = [...]\` and the JSX uses \`{X}\` or \`<Component items={X}>\`, your rewritten file MUST still declare \`X\` (either moved inside component or left outside). Never remove a declaration that's still referenced.

## Output

Respond with a JSON object with exactly two fields:
{
  "messages": { ... keys and English values ... },
  "rewrittenFile": "... full new file content ..."
}

The "messages" object is ALL new translation keys you created (not nested under namespace — just the keys for this namespace).

The "rewrittenFile" is the complete new page file content, ready to write to disk.

## Input File (${pagePath})

\`\`\`tsx
${pageSource}
\`\`\`
`;

async function callGPT() {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: PROMPT }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
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
  console.log('Calling GPT...');
  const result = await callGPT();

  if (!result.messages || !result.rewrittenFile) {
    console.error('Invalid response shape');
    console.error(JSON.stringify(result, null, 2).slice(0, 500));
    process.exit(1);
  }

  console.log(`  ✓ Extracted ${Object.keys(result.messages).length} keys`);

  // Merge into messages/en.json under the given namespace
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
  messages[namespace] = { ...(messages[namespace] || {}), ...result.messages };
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2) + '\n');
  console.log(`  ✓ Updated messages/en.json with namespace "${namespace}"`);

  // Write rewritten file
  fs.writeFileSync(absPagePath, result.rewrittenFile);
  console.log(`  ✓ Wrote ${pagePath}`);

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
