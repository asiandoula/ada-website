import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { locales, defaultLocale, COOKIE_NAME, type Locale } from './config';
import { MESSAGE_NAMESPACES } from './namespaces';

type Messages = Record<string, unknown>;

function isPlainObject(v: unknown): v is Messages {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Deep merge; `over` wins. Arrays and strings are replaced, not merged. */
function deepMerge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(over)) {
    const b = out[k];
    out[k] = isPlainObject(b) && isPlainObject(v) ? deepMerge(b, v) : v;
  }
  return out;
}

/**
 * Messages for one locale: the legacy messages/<locale>.json, with every
 * namespace file messages/<locale>/<ns>.json merged over it under key <ns>.
 * Same merge as scripts/check-i18n.mjs and scripts/sync-locales.mjs.
 */
export async function loadMessages(locale: Locale): Promise<Messages> {
  let messages: Messages = (await import(`../../messages/${locale}.json`)).default;
  for (const ns of MESSAGE_NAMESPACES) {
    try {
      const body = (await import(`../../messages/${locale}/${ns}.json`)).default as Messages;
      messages = { ...messages, [ns]: deepMerge(isPlainObject(messages[ns]) ? (messages[ns] as Messages) : {}, body) };
    } catch {
      // A missing namespace file is caught at build time by check-i18n (locale parity).
    }
  }
  return messages;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
