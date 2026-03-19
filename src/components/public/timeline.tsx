'use client';

import { ScrollAnimate } from './scroll-animate';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical center line */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-ada-purple/20" />

      <div className="space-y-12 md:space-y-16">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <ScrollAnimate
              key={`${item.year}-${item.title}`}
              animation={isLeft ? 'fade-right' : 'fade-left'}
              delay={index * 100}
            >
              <div className="relative flex items-start md:items-center">
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ada-purple border-4 border-white shadow-md z-10" />

                {/* Mobile: single column, always right of the line */}
                <div className="md:hidden pl-12 pr-2">
                  <span className="inline-block font-poppins text-sm font-bold text-ada-purple bg-ada-purple/10 px-3 py-1 rounded-full">
                    {item.year}
                  </span>
                  <h3 className="mt-2 font-poppins text-lg font-bold text-ada-navy">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-ada-navy/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Desktop: alternating left/right */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-12 w-full">
                  {isLeft ? (
                    <>
                      <div className="text-right pr-8">
                        <span className="inline-block font-poppins text-sm font-bold text-ada-purple bg-ada-purple/10 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="mt-2 font-poppins text-xl font-bold text-ada-navy">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-ada-navy/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div />
                    </>
                  ) : (
                    <>
                      <div />
                      <div className="pl-8">
                        <span className="inline-block font-poppins text-sm font-bold text-ada-purple bg-ada-purple/10 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="mt-2 font-poppins text-xl font-bold text-ada-navy">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-ada-navy/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ScrollAnimate>
          );
        })}
      </div>
    </div>
  );
}
