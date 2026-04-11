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
