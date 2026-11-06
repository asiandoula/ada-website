export const locales = ['en', 'zh-cn', 'zh-tw', 'ja', 'ko'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  'ja': '日本語',
  'ko': '한국어',
};

export const COOKIE_NAME = 'ADA_LOCALE';

/**
 * BCP 47 tag for `<html lang>` and per-element `lang` attributes. The CSS in
 * globals.css picks the Noto CJK fallback with `:lang(zh-Hans)` etc., so these
 * must be script subtags, not the cookie values.
 */
export const htmlLang: Record<Locale, string> = {
  'en': 'en',
  'zh-cn': 'zh-Hans',
  'zh-tw': 'zh-Hant',
  'ja': 'ja',
  'ko': 'ko',
};

/** Short labels for the utility-bar language switcher (KitC: EN · 简体 · 繁體 · 日本語 · 한국어). Proper nouns, never translated. */
export const localeShortNames: Record<Locale, string> = {
  'en': 'EN',
  'zh-cn': '简体',
  'zh-tw': '繁體',
  'ja': '日本語',
  'ko': '한국어',
};
