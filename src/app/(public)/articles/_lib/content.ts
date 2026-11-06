/**
 * Display helpers for CMS article HTML (articles.content). Server-side string
 * work only: the stored HTML is never changed, these shape what is rendered.
 *
 * - Older posts use h4/h5 as their section headings; levels are shifted so the
 *   top level is h2 (the page has the h1), which also feeds the table of contents.
 * - Stored headings have no ids, so the old TOC links went nowhere; ids are
 *   added here and the TOC links to them.
 * - Several posts open with "Estimated Reading Time: ~N minutes" as a paragraph
 *   (and the admin's auto-excerpt starts with it); it moves into the byline.
 */

export interface TocItem {
  id: string;
  text: string;
}

const READING_TIME_P =
  /<p[^>]*>\s*(?:<(?:strong|b|em)[^>]*>\s*)*Estimated Reading Time:\s*~?\s*(\d+)\s*minutes?\s*(?:<\/(?:strong|b|em)>\s*)*<\/p>/i;

const ZERO_WIDTH = /[​‌‍﻿]/g;

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(ZERO_WIDTH, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

/** Shift heading levels so the highest one in the body is h2. */
function normalizeHeadingLevels(html: string): string {
  const levels = Array.from(html.matchAll(/<h([1-6])\b/gi)).map((m) => Number(m[1]));
  if (levels.length === 0) return html;
  const top = Math.min(...levels);
  const shift = top - 2; // >0: promote (h4 → h2); <0: demote (h1 → h2)
  if (shift === 0) return html;
  return html.replace(/<(\/?)h([1-6])\b/gi, (_m, slash: string, n: string) => {
    const level = Math.min(6, Math.max(2, Number(n) - shift));
    return `<${slash}h${level}`;
  });
}

export interface PreparedArticle {
  html: string;
  toc: TocItem[];
  /** Minutes stated in the post, if it states them. */
  statedMinutes: number | null;
}

/** Prepare stored HTML for display: reading-time line out, heading levels normalised, ids on h2/h3. */
export function prepareArticleHtml(raw: string | null | undefined): PreparedArticle {
  let html = raw ?? '';
  let statedMinutes: number | null = null;
  const rt = READING_TIME_P.exec(html);
  if (rt) {
    statedMinutes = Number(rt[1]) || null;
    html = html.replace(READING_TIME_P, '');
  }
  html = normalizeHeadingLevels(html);

  const used = new Set<string>();
  const toc: TocItem[] = [];
  let n = 0;
  html = html.replace(/<h([23])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/gi, (whole, level: string, attrs: string, inner: string) => {
    n += 1;
    const text = stripTags(inner);
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs ?? '');
    let id = existing?.[1] ?? (slugify(text) || `section-${n}`);
    if (!existing) {
      let k = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${k++}`;
    }
    used.add(id);
    if (level === '2' && text) toc.push({ id, text });
    return existing ? whole : `<h${level} id="${id}"${attrs ?? ''}>${inner}</h${level}>`;
  });

  return { html, toc, statedMinutes };
}

/** Reading time: the post's own figure if it states one, otherwise ~220 words (or ~400 CJK characters) a minute. */
export function readingMinutes(prepared: PreparedArticle, raw: string | null | undefined): number {
  if (prepared.statedMinutes) return prepared.statedMinutes;
  const text = stripTags(raw ?? '');
  const cjk = (text.match(/[㐀-鿿豈-﫿぀-ヿ가-힯]/g) ?? []).length;
  const words = text.replace(/[㐀-鿿豈-﫿぀-ヿ가-힯]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220 + cjk / 400));
}

/**
 * The summary shown in lists. The stored excerpt, unless it is the admin's
 * auto-excerpt (it then starts with the reading-time line or glues a heading to
 * the first sentence); in that case the first real paragraph of the body.
 */
export function displayExcerpt(excerpt: string | null | undefined, content: string | null | undefined, max = 240): string {
  const clean = (excerpt ?? '').replace(ZERO_WIDTH, '').trim();
  const looksAuto = !clean || /Estimated Reading Time/i.test(clean) || /\.\.\.$|…$/.test(clean);
  if (!looksAuto) return clean;
  const body = (content ?? '').replace(READING_TIME_P, '');
  for (const m of Array.from(body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))) {
    const text = stripTags(m[1]);
    if (text.length < 40) continue;
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 40)).replace(/[\s,;:.]+$/, '')}…`;
  }
  return clean.replace(/^.*?Estimated Reading Time:\s*~?\s*\d+\s*minutes?/i, '').trim();
}

/** "2025-03-18T00:00:00+00:00" → "2025-03-18" (the calendar day as stored, UTC; matches the live site). */
export function publishedDay(publishedAt: string | null | undefined): string | null {
  if (!publishedAt) return null;
  const day = publishedAt.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}
