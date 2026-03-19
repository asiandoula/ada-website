'use client';

interface TocItem {
  level: number;
  text: string;
  id: string;
}

function extractHeadings(html: string): TocItem[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, ''); // strip inner tags
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    items.push({ level: parseInt(match[1]), text, id });
  }

  return items;
}

export function TableOfContents({ content }: { content: string }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-5">
      <h4 className="font-poppins font-semibold text-sm text-ada-navy mb-3 uppercase tracking-wide">
        Table of Contents
      </h4>
      <nav className="space-y-2">
        {headings.map((h, i) => (
          <a
            key={i}
            href={`#${h.id}`}
            className={`block text-sm text-gray-600 hover:text-ada-purple transition-colors ${
              h.level === 3 ? 'pl-4' : ''
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
