'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqData } from './faq-data';

export function FAQContent() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenItem((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      {faqData.map((category) => (
        <div key={category.category} className="mb-16 last:mb-0">
          <h2 className="font-dm-serif text-2xl md:text-3xl text-ada-navy mb-6">
            {category.category}
          </h2>
          <div>
            {category.items.map((item) => {
              const id = `${category.category}-${item.q}`;
              const isOpen = openItem === id;
              return (
                <div key={id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggle(id)}
                    className="flex w-full items-center justify-between py-5 text-left gap-4"
                  >
                    <span className="font-outfit font-semibold text-ada-navy">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-ada-navy/40 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96 pb-5' : 'max-h-0'
                    }`}
                  >
                    <p className="font-outfit text-ada-navy/60 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
