/**
 * "In this article" (Article.dc.html): the post's h2 sections as a ruled,
 * two-column jump list. Items and ids come from prepareArticleHtml(), which
 * also writes the ids into the rendered body, so every link has a target.
 */
import { JumpList } from '../../support/_kit/page-shell';
import type { TocItem } from '../_lib/content';

export function TableOfContents({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length < 2) return null;
  return (
    <JumpList id="toc-title" title={title} items={items.map((h) => ({ href: `#${h.id}`, label: h.text }))} />
  );
}
