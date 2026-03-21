'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
}

export function Steps({ steps }: StepsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={step.number}
            className="bg-ada-lavender rounded-xl overflow-hidden transition-shadow hover:shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              <span className="font-outfit text-xl font-semibold text-ada-purple min-w-[2rem]">
                {step.number}
              </span>
              <span className="flex-1 font-outfit font-semibold text-ada-navy">
                {step.title}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-ada-navy/40 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pl-14 text-ada-navy/60 text-sm leading-relaxed">
                  {step.description}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
